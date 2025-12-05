import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7)

    // Parse month (YYYY-MM)
    const [year, monthNum] = month.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate = new Date(year, monthNum, 0)

    // Get all documents for the month
    const [salesDocs, purchaseDocs] = await Promise.all([
      // Output VAT (Sales)
      prisma.document.findMany({
        where: {
          companyId: tenantId,
          documentDate: {
            gte: startDate,
            lte: endDate,
          },
          documentType: {
            category: 'sales',
          },
        },
      }),
      // Input VAT (Purchase)
      prisma.document.findMany({
        where: {
          companyId: tenantId,
          documentDate: {
            gte: startDate,
            lte: endDate,
          },
          documentType: {
            category: 'purchase',
          },
        },
      }),
    ])

    const outputVat = salesDocs.reduce((sum, d) => sum + Number(d.vatAmount), 0)
    const inputVat = purchaseDocs.reduce((sum, d) => sum + Number(d.vatAmount), 0)
    const netVat = outputVat - inputVat

    return NextResponse.json({
      success: true,
      data: {
        month,
        outputVat,
        inputVat,
        netVat,
        status: netVat > 0 ? 'ต้องชำระ' : 'ขอคืน',
      },
    })
  } catch (error) {
    console.error('Error fetching PP30:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

