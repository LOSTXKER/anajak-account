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

    // Get sales documents (Output VAT)
    const documents = await prisma.document.findMany({
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
      include: {
        documentType: true,
        contact: true,
      },
      orderBy: {
        documentDate: 'asc',
      },
    })

    const total = documents.reduce((sum, d) => sum + Number(d.vatAmount), 0)

    return NextResponse.json({
      success: true,
      data: {
        month,
        documents: documents.map(d => ({
          id: d.id,
          documentNumber: d.documentNumber,
          documentDate: d.documentDate,
          contactName: d.contact?.name || d.contactName,
          contactTaxId: d.contactTaxId,
          amountBeforeVat: d.amountBeforeVat,
          vatAmount: d.vatAmount,
          totalAmount: d.totalAmount,
        })),
        total,
      },
    })
  } catch (error) {
    console.error('Error fetching VAT output:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

