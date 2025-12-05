import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/documents - List documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const typeId = searchParams.get('typeId')

    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const where: any = {
      companyId: tenantId,
    }

    if (search) {
      where.OR = [
        { documentNumber: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (typeId) {
      where.documentTypeId = typeId
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        documentType: true,
        contact: true,
        lines: true,
      },
      orderBy: {
        documentDate: 'desc',
      },
      take: 100,
    })

    return NextResponse.json({
      success: true,
      data: documents,
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    )
  }
}

// POST /api/documents - Create document
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
    const {
      documentTypeId,
      contactId,
      contactName,
      contactAddress,
      contactTaxId,
      documentDate,
      dueDate,
      referenceNumber,
      notes,
      lines,
      subtotal,
      discountAmount,
      vatAmount,
      whtAmount,
      totalAmount,
    } = body

    // Get document type for numbering
    const docType = await prisma.documentType.findUnique({
      where: { id: documentTypeId }
    })

    if (!docType) {
      return NextResponse.json(
        { error: 'Document type not found' },
        { status: 400 }
      )
    }

    // Generate document number
    const prefix = docType.code.toUpperCase()
    const year = new Date().getFullYear()
    const lastDoc = await prisma.document.findFirst({
      where: {
        companyId: tenantId,
        documentTypeId,
        documentNumber: {
          startsWith: `${prefix}${year}`,
        },
      },
      orderBy: {
        documentNumber: 'desc',
      },
    })

    let runningNumber = 1
    if (lastDoc && lastDoc.documentNumber) {
      const match = lastDoc.documentNumber.match(/(\d+)$/)
      if (match) {
        runningNumber = parseInt(match[1]) + 1
      }
    }
    const documentNumber = `${prefix}${year}-${runningNumber.toString().padStart(4, '0')}`

    // Create document
    const document = await prisma.document.create({
      data: {
        companyId: tenantId,
        documentTypeId,
        documentNumber,
        contactId,
        contactName,
        contactAddress,
        contactTaxId,
        documentDate: documentDate ? new Date(documentDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        referenceNumber,
        notes,
        subtotal: subtotal || 0,
        discountAmount: discountAmount || 0,
        amountBeforeVat: (subtotal || 0) - (discountAmount || 0),
        vatAmount: vatAmount || 0,
        whtAmount: whtAmount || 0,
        totalAmount: totalAmount || 0,
        status: 'draft',
        createdBy: userId,
        lines: {
          create: (lines || []).map((item: any, index: number) => ({
            lineNumber: index + 1,
            productId: item.productId,
            productCode: item.productCode,
            productName: item.productName || item.description || '',
            description: item.description,
            quantity: item.quantity || 1,
            unit: item.unit,
            unitPrice: item.unitPrice || 0,
            discountPercent: item.discountPercent || 0,
            discountAmount: item.discountAmount || 0,
            amount: item.amount || 0,
            vatAmount: item.vatAmount || 0,
            whtRate: item.whtRate || 0,
            whtAmount: item.whtAmount || 0,
          })),
        },
      },
      include: {
        documentType: true,
        contact: true,
        lines: true,
      },
    })

    console.log('✅ Document created:', document.id)

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
