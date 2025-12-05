import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/reports/balance-sheet - Generate balance sheet
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

    // Get account balances grouped by type
    const accountTypes = ['assets', 'liabilities', 'equity']
    const balanceSheet: any = {
      asOfDate,
      assets: [],
      liabilities: [],
      equity: [],
      totals: {
        assets: 0,
        liabilities: 0,
        equity: 0,
      },
    }

    for (const typeName of accountTypes) {
      const accountType = await prisma.accountType.findFirst({
        where: {
          name: typeName,
        },
      })

      if (!accountType) continue

      const accounts = await prisma.account.findMany({
        where: {
          companyId: tenantId,
          accountTypeId: accountType.id,
          isActive: true,
        },
      })

      for (const account of accounts) {
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
        const balance = debit - credit

        if (balance !== 0) {
          balanceSheet[typeName].push({
            code: account.code,
            name: account.name,
            balance: Math.abs(balance),
          })
          balanceSheet.totals[typeName] += Math.abs(balance)
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: balanceSheet,
    })
  } catch (error) {
    console.error('Error generating balance sheet:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

