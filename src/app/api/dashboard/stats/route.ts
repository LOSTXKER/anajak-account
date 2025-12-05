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

    // Get basic stats
    const [
      totalContacts,
      totalProducts,
      totalDocuments,
      totalPayments,
    ] = await Promise.all([
      prisma.contact.count({ where: { companyId: tenantId } }),
      prisma.product.count({ where: { companyId: tenantId } }),
      prisma.document.count({ where: { companyId: tenantId } }),
      prisma.payment.count({ where: { companyId: tenantId } }),
    ])

    // Get recent documents
    const recentDocuments = await prisma.document.findMany({
      where: { companyId: tenantId },
      include: {
        documentType: true,
        contact: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
      where: { companyId: tenantId },
      include: {
        contact: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalContacts,
          totalProducts,
          totalDocuments,
          totalPayments,
        },
        recentDocuments: recentDocuments.map(d => ({
          id: d.id,
          documentNumber: d.documentNumber,
          type: d.documentType?.name || '',
          contactName: d.contact?.name || d.contactName || '-',
          totalAmount: d.totalAmount,
          status: d.status,
          date: d.documentDate,
        })),
        recentPayments: recentPayments.map(p => ({
          id: p.id,
          paymentNumber: p.paymentNumber,
          type: p.type,
          contactName: p.contact?.name || '-',
          amount: p.amount,
          date: p.paymentDate,
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
