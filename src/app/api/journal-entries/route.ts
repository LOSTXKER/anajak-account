import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/journal-entries
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const entries = await prisma.journalEntry.findMany({
      where: {
        companyId: tenantId,
      },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
      orderBy: {
        entryDate: 'desc',
      },
      take: 100,
    })

    return NextResponse.json({
      success: true,
      data: entries,
    })
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    )
  }
}

// POST /api/journal-entries
export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    const userId = request.headers.get('x-user-id')

    if (!tenantId || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { entryDate, description, lines } = body

    // Generate entry number
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const prefix = `JV${year}${month}`
    
    const lastEntry = await prisma.journalEntry.findFirst({
      where: {
        companyId: tenantId,
        entryNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        entryNumber: 'desc',
      },
    })

    let runningNumber = 1
    if (lastEntry && lastEntry.entryNumber) {
      const match = lastEntry.entryNumber.match(/(\d+)$/)
      if (match) {
        runningNumber = parseInt(match[1]) + 1
      }
    }
    const entryNumber = `${prefix}-${runningNumber.toString().padStart(4, '0')}`

    // Calculate totals
    let totalDebit = 0
    let totalCredit = 0
    for (const line of lines || []) {
      totalDebit += Number(line.debitAmount) || 0
      totalCredit += Number(line.creditAmount) || 0
    }

    // Create entry
    const date = entryDate ? new Date(entryDate) : new Date()
    const entry = await prisma.journalEntry.create({
      data: {
        companyId: tenantId,
        entryNumber,
        entryDate: date,
        fiscalYear: date.getFullYear(),
        fiscalMonth: date.getMonth() + 1,
        description,
        totalDebit,
        totalCredit,
        status: 'posted',
        createdBy: userId,
        lines: {
          create: (lines || []).map((line: any, index: number) => ({
            lineNumber: index + 1,
            accountId: line.accountId,
            debitAmount: Number(line.debitAmount) || 0,
            creditAmount: Number(line.creditAmount) || 0,
            description: line.description,
          })),
        },
      },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
    })

    console.log('✅ Journal entry created:', entry.id)

    return NextResponse.json({
      success: true,
      data: entry,
    })
  } catch (error) {
    console.error('Error creating journal entry:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างบันทึกบัญชี' },
      { status: 500 }
    )
  }
}
