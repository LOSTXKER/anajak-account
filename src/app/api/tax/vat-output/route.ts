import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/tax/vat-output
 * รายงานภาษีขาย (Output Tax) สำหรับยื่น ภ.พ.30
 */
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุช่วงวันที่' },
        { status: 400 }
      )
    }

    // Get sales documents (Invoice, Tax Invoice, Receipt) with VAT
    const documents = await prisma.document.findMany({
      where: {
        companyId: tenantId,
        type: {
          in: ['invoice', 'tax_invoice', 'receipt'],
        },
        issueDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        status: {
          not: 'cancelled',
        },
      },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            taxId: true,
          },
        },
        lineItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        issueDate: 'asc',
      },
    })

    // Calculate VAT summary
    let totalSales = 0
    let totalVat = 0
    let totalWithVat = 0
    
    const items = documents.map((doc) => {
      const subtotal = doc.subtotal || 0
      const vat = doc.vatAmount || 0
      const grandTotal = doc.grandTotal || 0

      totalSales += subtotal
      totalVat += vat
      totalWithVat += grandTotal

      return {
        id: doc.id,
        documentNumber: doc.documentNumber,
        date: doc.issueDate,
        customerName: doc.contact?.name || '',
        customerTaxId: doc.contact?.taxId || '',
        description: `ขายสินค้า/บริการ`,
        subtotal,
        vat,
        total: grandTotal,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        period: {
          startDate,
          endDate,
        },
        summary: {
          totalSales,
          totalVat,
          totalWithVat,
          documentCount: items.length,
        },
        items,
      },
    })
  } catch (error) {
    console.error('Error generating VAT output report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

