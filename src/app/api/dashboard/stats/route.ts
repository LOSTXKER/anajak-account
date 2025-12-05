import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    // 1. Document Stats
    const [totalDocuments, monthDocuments, documentsByStatus] = await Promise.all([
      prisma.document.count({
        where: { companyId: tenantId },
      }),
      prisma.document.count({
        where: {
          companyId: tenantId,
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.document.groupBy({
        by: ['status'],
        where: { companyId: tenantId },
        _count: true,
      }),
    ])

    // 2. Payment Stats
    const [receivePayments, makePayments] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          companyId: tenantId,
          type: 'receive',
          paymentDate: { gte: startOfMonth },
        },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.payment.aggregate({
        where: {
          companyId: tenantId,
          type: 'make',
          paymentDate: { gte: startOfMonth },
        },
        _sum: { amount: true },
        _count: true,
      }),
    ])

    // 3. Outstanding Documents
    const outstanding = await prisma.document.aggregate({
      where: {
        companyId: tenantId,
        status: { in: ['sent', 'partial'] },
      },
      _sum: {
        totalAmount: true,
        paidAmount: true,
      },
      _count: true,
    })

    // 4. Top Customers (by revenue)
    const topCustomers = await prisma.document.groupBy({
      by: ['contactId'],
      where: {
        companyId: tenantId,
        status: 'paid',
      },
      _sum: {
        totalAmount: true,
      },
      orderBy: {
        _sum: {
          totalAmount: 'desc',
        },
      },
      take: 5,
    })

    const topCustomersWithDetails = await Promise.all(
      topCustomers.map(async (item) => {
        const contact = await prisma.contact.findUnique({
          where: { id: item.contactId },
          select: { name: true },
        })
        return {
          name: contact?.name || 'Unknown',
          amount: item._sum.totalAmount || 0,
        }
      })
    )

    // 5. Monthly Revenue Trend (last 6 months)
    const monthlyRevenue = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const revenue = await prisma.payment.aggregate({
        where: {
          companyId: tenantId,
          type: 'receive',
          paymentDate: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: { amount: true },
      })

      monthlyRevenue.push({
        month: monthStart.toLocaleDateString('th-TH', { month: 'short' }),
        amount: Number(revenue._sum.amount || 0),
      })
    }

    // 6. Recent Activities
    const recentDocuments = await prisma.document.findMany({
      where: { companyId: tenantId },
      include: {
        contact: {
          select: { name: true },
        },
        documentType: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    const recentPayments = await prisma.payment.findMany({
      where: { companyId: tenantId },
      include: {
        contact: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    return NextResponse.json({
      success: true,
      data: {
        documents: {
          total: totalDocuments,
          thisMonth: monthDocuments,
          byStatus: documentsByStatus,
        },
        payments: {
          receive: {
            amount: Number(receivePayments._sum.amount || 0),
            count: receivePayments._count,
          },
          make: {
            amount: Number(makePayments._sum.amount || 0),
            count: makePayments._count,
          },
          net: Number(receivePayments._sum.amount || 0) - Number(makePayments._sum.amount || 0),
        },
        outstanding: {
          total: Number(outstanding._sum.totalAmount || 0) - Number(outstanding._sum.paidAmount || 0),
          count: outstanding._count,
        },
        topCustomers: topCustomersWithDetails,
        monthlyRevenue,
        recentActivities: {
          documents: recentDocuments.map(d => ({
            id: d.id,
            type: d.documentType.name,
            number: d.documentNumber,
            contact: d.contact.name,
            amount: Number(d.totalAmount),
            status: d.status,
            date: d.createdAt,
          })),
          payments: recentPayments.map(p => ({
            id: p.id,
            type: p.type,
            number: p.paymentNumber,
            contact: p.contact?.name,
            amount: Number(p.amount),
            date: p.paymentDate,
          })),
        },
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

