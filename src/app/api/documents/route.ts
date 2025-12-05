import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { processDocumentStockMovements } from '@/lib/inventory'

// GET /api/documents - List all documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get tenantId from headers (set by middleware)
    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Build filter
    const where: any = {
      companyId: tenantId,
    }

    if (search) {
      where.OR = [
        { documentNumber: { contains: search, mode: 'insensitive' } },
        { contact: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (type) {
      where.documentTypeId = type
    }

    if (status) {
      where.status = status
    }

    // Get documents with pagination
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          contact: {
            select: {
              id: true,
              name: true,
              taxId: true,
            },
          },
          documentType: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          lineItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          issueDate: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.document.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: documents,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร' },
      { status: 500 }
    )
  }
}

// POST /api/documents - Create new document
export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    const userId = request.headers.get('x-user-id')

    if (!tenantId || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('📝 Creating document:', body)

    const {
      documentTypeId,
      contactId,
      issueDate,
      dueDate,
      referenceNumber,
      notes,
      terms,
      lineItems,
      subtotal,
      discountAmount,
      vatAmount,
      withholdingTaxAmount,
      totalAmount,
      status,
    } = body

    // Validate required fields
    if (!documentTypeId || !contactId || !issueDate || !lineItems || lineItems.length === 0) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Get document type to generate document number
    const documentType = await prisma.documentType.findUnique({
      where: { id: documentTypeId },
    })

    if (!documentType) {
      return NextResponse.json(
        { error: 'ไม่พบประเภทเอกสาร' },
        { status: 400 }
      )
    }

    // Generate document number
    const year = new Date().getFullYear()
    const lastDoc = await prisma.document.findFirst({
      where: {
        companyId: tenantId,
        documentTypeId,
        documentNumber: {
          startsWith: `${documentType.code}${year}`,
        },
      },
      orderBy: {
        documentNumber: 'desc',
      },
    })

    let runningNumber = 1
    if (lastDoc) {
      const match = lastDoc.documentNumber.match(/\d+$/)
      if (match) {
        runningNumber = parseInt(match[0]) + 1
      }
    }

    const documentNumber = `${documentType.code}${year}-${runningNumber.toString().padStart(4, '0')}`

    // Create document with line items
    const document = await prisma.document.create({
      data: {
        companyId: tenantId,
        documentTypeId,
        contactId,
        documentNumber,
        issueDate: new Date(issueDate),
        dueDate: dueDate ? new Date(dueDate) : null,
        referenceNumber,
        notes,
        terms,
        subtotalAmount: subtotal,
        discountAmount: discountAmount || 0,
        taxAmount: vatAmount || 0,
        withholdingTaxAmount: withholdingTaxAmount || 0,
        totalAmount: totalAmount,
        status: status || 'draft',
        createdById: userId,
        lineItems: {
          create: lineItems.map((item: any, index: number) => ({
            lineNumber: index + 1,
            productId: item.productId,
            description: item.description || item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discountAmount: item.discountAmount || 0,
            amount: item.amount,
          })),
        },
      },
      include: {
        contact: true,
        documentType: true,
        lineItems: {
          include: {
            product: true,
          },
        },
      },
    })

    console.log('✅ Document created:', document.id, document.documentNumber)

    // Process inventory movements for goods
    // Only process for invoice, tax_invoice, receipt (out) and purchase_order, bill (in)
    if (document.status === 'approved' || document.status === 'paid') {
      await processDocumentStockMovements(
        tenantId,
        document.id,
        documentType.code,
        lineItems
      )
    }

    return NextResponse.json({
      success: true,
      data: document,
    })
  } catch (error) {
    console.error('❌ Error creating document:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างเอกสาร' },
      { status: 500 }
    )
  }
}

