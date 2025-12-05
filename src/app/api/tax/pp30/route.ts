import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/tax/pp30
 * สรุปรายงาน ภ.พ.30 (VAT Return Form)
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
    const month = searchParams.get('month') // Format: YYYY-MM
    const year = searchParams.get('year')

    let periodStart: Date
    let periodEnd: Date

    if (month) {
      // Use month parameter
      const [y, m] = month.split('-')
      periodStart = new Date(parseInt(y), parseInt(m) - 1, 1)
      periodEnd = new Date(parseInt(y), parseInt(m), 0, 23, 59, 59)
    } else if (startDate && endDate) {
      periodStart = new Date(startDate)
      periodEnd = new Date(endDate)
    } else {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุเดือนหรือช่วงวันที่' },
        { status: 400 }
      )
    }

    // Get all sales (output VAT)
    const salesDocs = await prisma.document.findMany({
      where: {
        companyId: tenantId,
        type: {
          in: ['invoice', 'tax_invoice', 'receipt'],
        },
        issueDate: {
          gte: periodStart,
          lte: periodEnd,
        },
        status: {
          not: 'cancelled',
        },
      },
    })

    // Get all purchases (input VAT)
    const purchaseDocs = await prisma.document.findMany({
      where: {
        companyId: tenantId,
        type: {
          in: ['purchase_order', 'bill'],
        },
        issueDate: {
          gte: periodStart,
          lte: periodEnd,
        },
        status: {
          not: 'cancelled',
        },
      },
    })

    // Calculate totals
    const outputVat = salesDocs.reduce((sum, doc) => sum + (doc.vatAmount || 0), 0)
    const inputVat = purchaseDocs.reduce((sum, doc) => sum + (doc.vatAmount || 0), 0)
    const netVat = outputVat - inputVat

    const totalSales = salesDocs.reduce((sum, doc) => sum + (doc.subtotal || 0), 0)
    const totalPurchases = purchaseDocs.reduce((sum, doc) => sum + (doc.subtotal || 0), 0)

    // Get company info
    const company = await prisma.company.findUnique({
      where: { id: tenantId },
    })

    return NextResponse.json({
      success: true,
      data: {
        period: {
          month: month || `${periodStart.getFullYear()}-${String(periodStart.getMonth() + 1).padStart(2, '0')}`,
          startDate: periodStart,
          endDate: periodEnd,
        },
        company: {
          name: company?.name || '',
          taxId: company?.taxId || '',
          address: company?.address || '',
          branchCode: company?.branchCode || '00000',
        },
        summary: {
          // ภาษีขาย (Output VAT)
          salesExcludeVat: totalSales,
          outputVat,
          salesIncludeVat: totalSales + outputVat,
          
          // ภาษีซื้อ (Input VAT)
          purchasesExcludeVat: totalPurchases,
          inputVat,
          purchasesIncludeVat: totalPurchases + inputVat,
          
          // สรุป
          netVat, // + = ต้องชำระ, - = ขอคืน
          vatPayable: netVat > 0 ? netVat : 0,
          vatRefundable: netVat < 0 ? Math.abs(netVat) : 0,
          
          // นับเอกสาร
          salesDocumentCount: salesDocs.length,
          purchaseDocumentCount: purchaseDocs.length,
        },
        sections: {
          // ส่วนที่ 1: ภาษีขาย
          section1: {
            label: 'ภาษีขาย',
            items: [
              {
                description: 'รายได้จากการขายสินค้า/บริการ (ก่อน VAT)',
                amount: totalSales,
                vat: outputVat,
              },
            ],
            total: outputVat,
          },
          
          // ส่วนที่ 2: ภาษีซื้อ
          section2: {
            label: 'ภาษีซื้อ',
            items: [
              {
                description: 'ค่าใช้จ่ายในการซื้อสินค้า/บริการ (ก่อน VAT)',
                amount: totalPurchases,
                vat: inputVat,
              },
            ],
            total: inputVat,
          },
          
          // ส่วนที่ 3: สรุป
          section3: {
            label: 'ภาษีมูลค่าเพิ่มสุทธิ',
            outputVat,
            inputVat,
            netVat,
            status: netVat > 0 ? 'ต้องชำระ' : netVat < 0 ? 'ขอคืน' : 'เท่ากัน',
          },
        },
      },
    })
  } catch (error) {
    console.error('Error generating PP30:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate PP30' },
      { status: 500 }
    )
  }
}

