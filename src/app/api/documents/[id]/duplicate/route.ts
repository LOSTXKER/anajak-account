import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params
    const tenantId = request.headers.get('x-tenant-id')
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get source document with line items
    const sourceDoc = await prisma.document.findFirst({
      where: {
        id: documentId,
        companyId: tenantId,
      },
      include: {
        lineItems: {
          include: {
            product: true,
          },
        },
        contact: true,
      },
    })

    if (!sourceDoc) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      )
    }

    // Generate new document number
    const prefix = getDocumentPrefix(sourceDoc.type)
    const year = new Date().getFullYear()
    const lastDoc = await prisma.document.findFirst({
      where: {
        companyId: tenantId,
        type: sourceDoc.type,
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

    // Create duplicate document
    const newDoc = await prisma.document.create({
      data: {
        companyId: tenantId,
        type: sourceDoc.type,
        documentNumber,
        contactId: sourceDoc.contactId,
        issueDate: new Date(),
        dueDate: sourceDoc.dueDate,
        referenceNumber: `คัดลอกจาก ${sourceDoc.documentNumber}`,
        notes: sourceDoc.notes,
        terms: sourceDoc.terms,
        subtotal: sourceDoc.subtotal,
        discountAmount: sourceDoc.discountAmount,
        vatAmount: sourceDoc.vatAmount,
        withholdingTaxAmount: sourceDoc.withholdingTaxAmount,
        grandTotal: sourceDoc.grandTotal,
        status: 'draft',
        lineItems: {
          create: sourceDoc.lineItems.map((item) => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            discountType: item.discountType,
            amount: item.amount,
          })),
        },
      },
      include: {
        lineItems: true,
        contact: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: newDoc,
      message: 'คัดลอกเอกสารสำเร็จ',
    })
  } catch (error) {
    console.error('Error duplicating document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to duplicate document' },
      { status: 500 }
    )
  }
}

function getDocumentPrefix(type: string): string {
  const prefixes: Record<string, string> = {
    quotation: 'QT',
    invoice: 'IV',
    tax_invoice: 'TI',
    receipt: 'RC',
    purchase_order: 'PO',
    bill: 'BL',
  }
  return prefixes[type] || 'DOC'
}
