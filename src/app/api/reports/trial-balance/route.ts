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

    return NextResponse.json({
      success: true,
      data: {
        accounts: accounts.map(a => ({
          code: a.code,
          name: a.name,
          type: a.accountType?.name || '',
          debit: 0,
          credit: 0,
        })),
        totalDebit: 0,
        totalCredit: 0,
      },
    })
  } catch (error) {
    console.error('Error generating trial balance:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
