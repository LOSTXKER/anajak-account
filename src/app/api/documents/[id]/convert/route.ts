import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tenantId = request.headers.get('x-tenant-id')
    const userId = request.headers.get('x-user-id')

    if (!tenantId || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { targetType } = body // 'invoice', 'tax_invoice', etc.

    // Get source document
    const sourceDoc = await prisma.document.findFirst({
      where: {
        id,
        companyId: tenantId,
      },
      include: {
        documentType: true,
        lines: true,
      },
    })

    if (!sourceDoc) {
      return NextResponse.json(
        { error: 'ไม่พบเอกสาร' },
        { status: 404 }
      )
    }

    // Get target document type
    const targetDocType = await prisma.documentType.findFirst({
      where: { code: targetType },
    })

    if (!targetDocType) {
      return NextResponse.json(
        { error: 'ไม่พบประเภทเอกสารปลายทาง' },
        { status: 400 }
      )
    }

    // Generate new document number
    const prefix = targetDocType.code.toUpperCase()
    const year = new Date().getFullYear()
    const lastDoc = await prisma.document.findFirst({
      where: {
        companyId: tenantId,
        documentTypeId: targetDocType.id,
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

    // Create new document (converted)
    const newDoc = await prisma.document.create({
      data: {
        companyId: tenantId,
        documentTypeId: targetDocType.id,
        documentNumber,
        contactId: sourceDoc.contactId,
        contactName: sourceDoc.contactName,
        contactAddress: sourceDoc.contactAddress,
        contactTaxId: sourceDoc.contactTaxId,
        documentDate: new Date(),
        dueDate: sourceDoc.dueDate,
        referenceNumber: sourceDoc.documentNumber, // Reference to source
        subtotal: sourceDoc.subtotal,
        discountAmount: sourceDoc.discountAmount,
        amountBeforeVat: sourceDoc.amountBeforeVat,
        vatAmount: sourceDoc.vatAmount,
        whtAmount: sourceDoc.whtAmount,
        totalAmount: sourceDoc.totalAmount,
        notes: sourceDoc.notes,
        status: 'draft',
        sourceDocumentId: sourceDoc.id,
        createdBy: userId,
        lines: {
          create: sourceDoc.lines.map((line, index) => ({
            lineNumber: index + 1,
            productId: line.productId,
            productCode: line.productCode,
            productName: line.productName,
            description: line.description,
            quantity: line.quantity,
            unit: line.unit,
            unitPrice: line.unitPrice,
            discountPercent: line.discountPercent,
            discountAmount: line.discountAmount,
            amount: line.amount,
            vatType: line.vatType,
            vatAmount: line.vatAmount,
            whtRate: line.whtRate,
            whtAmount: line.whtAmount,
          })),
        },
      },
      include: {
        documentType: true,
        contact: true,
        lines: true,
      },
    })

    console.log('✅ Document converted:', sourceDoc.id, '→', newDoc.id)

    return NextResponse.json({
      success: true,
      data: newDoc,
    })
  } catch (error) {
    console.error('Error converting document:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการแปลงเอกสาร' },
      { status: 500 }
    )
  }
}

