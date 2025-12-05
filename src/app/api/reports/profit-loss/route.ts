import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/reports/profit-loss - Generate P&L statement
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0]

    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get revenue and expense accounts
    const accountTypes = ['revenue', 'expenses']
    const profitLoss: any = {
      startDate,
      endDate,
      revenue: [],
      expenses: [],
      totals: {
        revenue: 0,
        expenses: 0,
        netIncome: 0,
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
        const where: any = {
          accountId: account.id,
          journalEntry: {
            status: 'posted',
            entryDate: {
              lte: new Date(endDate),
            },
          },
        }

        if (startDate) {
          where.journalEntry.entryDate.gte = new Date(startDate)
        }

        const entries = await prisma.journalEntryLine.findMany({ where })

        const debit = entries.reduce((sum, e) => sum + Number(e.debitAmount), 0)
        const credit = entries.reduce((sum, e) => sum + Number(e.creditAmount), 0)
        const balance = credit - debit // Revenue = credit, Expenses = debit

        if (balance !== 0) {
          profitLoss[typeName].push({
            code: account.code,
            name: account.name,
            amount: Math.abs(balance),
          })
          profitLoss.totals[typeName] += Math.abs(balance)
        }
      }
    }

    profitLoss.totals.netIncome = profitLoss.totals.revenue - profitLoss.totals.expenses

    return NextResponse.json({
      success: true,
      data: profitLoss,
    })
  } catch (error) {
    console.error('Error generating P&L:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

