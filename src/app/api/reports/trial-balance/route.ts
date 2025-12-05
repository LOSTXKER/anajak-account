import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/reports/trial-balance - Generate trial balance
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const asOfDate = searchParams.get('asOfDate') || new Date().toISOString().split('T')[0]

    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all accounts with their balances
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

    // Calculate balance for each account
    const trialBalance = await Promise.all(
      accounts.map(async (account) => {
        const entries = await prisma.journalEntryLine.findMany({
          where: {
            accountId: account.id,
            journalEntry: {
              status: 'posted',
              entryDate: {
                lte: new Date(asOfDate),
              },
            },
          },
        })

        const debit = entries.reduce((sum, e) => sum + Number(e.debitAmount), 0)
        const credit = entries.reduce((sum, e) => sum + Number(e.creditAmount), 0)

        return {
          account: {
            id: account.id,
            code: account.code,
            name: account.name,
            type: account.accountType.name,
          },
          debit,
          credit,
          balance: debit - credit,
        }
      })
    )

    // Filter out zero balances
    const nonZeroBalances = trialBalance.filter(
      (item) => item.debit !== 0 || item.credit !== 0
    )

    // Calculate totals
    const totals = {
      debit: nonZeroBalances.reduce((sum, item) => sum + item.debit, 0),
      credit: nonZeroBalances.reduce((sum, item) => sum + item.credit, 0),
    }

    return NextResponse.json({
      success: true,
      data: {
        asOfDate,
        accounts: nonZeroBalances,
        totals,
        isBalanced: Math.abs(totals.debit - totals.credit) < 0.01,
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

