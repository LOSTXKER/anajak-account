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

    const { targetType } = await request.json()

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
    const prefix = getDocumentPrefix(targetType)
    const year = new Date().getFullYear()
    const lastDoc = await prisma.document.findFirst({
      where: {
        companyId: tenantId,
        type: targetType,
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

    // Create new document
    const newDoc = await prisma.document.create({
      data: {
        companyId: tenantId,
        type: targetType,
        documentNumber,
        contactId: sourceDoc.contactId,
        issueDate: new Date(),
        dueDate: sourceDoc.dueDate,
        referenceNumber: sourceDoc.documentNumber, // Link to source
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
      message: `แปลงเป็น${getDocumentTypeLabel(targetType)}สำเร็จ`,
    })
  } catch (error) {
    console.error('Error converting document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to convert document' },
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

function getDocumentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    quotation: 'ใบเสนอราคา',
    invoice: 'ใบแจ้งหนี้',
    tax_invoice: 'ใบกำกับภาษี',
    receipt: 'ใบเสร็จรับเงิน',
    purchase_order: 'ใบสั่งซื้อ',
    bill: 'ใบวางบิล',
  }
  return labels[type] || 'เอกสาร'
}
