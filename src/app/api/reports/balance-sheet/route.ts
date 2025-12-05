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
    const assets = accounts.filter(a => a.accountType?.code === '1')
    const liabilities = accounts.filter(a => a.accountType?.code === '2')
    const equity = accounts.filter(a => a.accountType?.code === '3')

    return NextResponse.json({
      success: true,
      data: {
        assets: {
          accounts: assets.map(a => ({
            code: a.code,
            name: a.name,
            balance: 0,
          })),
          total: 0,
        },
        liabilities: {
          accounts: liabilities.map(a => ({
            code: a.code,
            name: a.name,
            balance: 0,
          })),
          total: 0,
        },
        equity: {
          accounts: equity.map(a => ({
            code: a.code,
            name: a.name,
            balance: 0,
          })),
          total: 0,
        },
      },
    })
  } catch (error) {
    console.error('Error generating balance sheet:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
