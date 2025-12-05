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

    // Get accounts by type
    const accounts = await prisma.account.findMany({
      where: {
        companyId: tenantId,
        isActive: true,
      },
      include: {
        accountType: true,
      },
      orderBy: {
        code: 'asc',
      },
    })

    // Group by type
    const revenue = accounts.filter(a => a.accountType?.code === '4')
    const expenses = accounts.filter(a => a.accountType?.code === '5')

    return NextResponse.json({
      success: true,
      data: {
        revenue: {
          accounts: revenue.map(a => ({
            code: a.code,
            name: a.name,
            balance: 0,
          })),
          total: 0,
        },
        expenses: {
          accounts: expenses.map(a => ({
            code: a.code,
            name: a.name,
            balance: 0,
          })),
          total: 0,
        },
        netIncome: 0,
      },
    })
  } catch (error) {
    console.error('Error generating profit loss:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
