import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/journal-entries - List all journal entries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Build filter
    const where: any = {
      companyId: tenantId,
    }

    if (search) {
      where.OR = [
        { entryNumber: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    // Get entries with pagination
    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        include: {
          lines: {
            include: {
              account: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
            },
            orderBy: {
              lineNumber: 'asc',
            },
          },
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          entryDate: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.journalEntry.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: entries,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    )
  }
}

// POST /api/journal-entries - Create new journal entry
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
    console.log('📝 Creating journal entry:', body)

    const {
      entryDate,
      description,
      referenceNumber,
      lines, // Array of { accountId, debitAmount, creditAmount, description }
    } = body

    // Validate required fields
    if (!entryDate || !description || !lines || lines.length < 2) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน (ต้องมีอย่างน้อย 2 รายการ)' },
        { status: 400 }
      )
    }

    // Validate debit = credit
    const totalDebit = lines.reduce((sum: number, line: any) => sum + (line.debitAmount || 0), 0)
    const totalCredit = lines.reduce((sum: number, line: any) => sum + (line.creditAmount || 0), 0)

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return NextResponse.json(
        { error: 'ยอด Debit และ Credit ต้องเท่ากัน' },
        { status: 400 }
      )
    }

    // Generate entry number
    const year = new Date().getFullYear()
    const lastEntry = await prisma.journalEntry.findFirst({
      where: {
        companyId: tenantId,
        entryNumber: {
          startsWith: `JE${year}`,
        },
      },
      orderBy: {
        entryNumber: 'desc',
      },
    })

    let runningNumber = 1
    if (lastEntry) {
      const match = lastEntry.entryNumber.match(/\d+$/)
      if (match) {
        runningNumber = parseInt(match[0]) + 1
      }
    }

    const entryNumber = `JE${year}-${runningNumber.toString().padStart(4, '0')}`

    // Create journal entry with lines
    const entry = await prisma.journalEntry.create({
      data: {
        companyId: tenantId,
        entryNumber,
        entryDate: new Date(entryDate),
        description,
        referenceNumber,
        totalAmount: totalDebit,
        status: 'posted',
        createdById: userId,
        lines: {
          create: lines.map((line: any, index: number) => ({
            lineNumber: index + 1,
            accountId: line.accountId,
            description: line.description || description,
            debitAmount: line.debitAmount || 0,
            creditAmount: line.creditAmount || 0,
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

    console.log('✅ Journal entry created:', entry.id, entry.entryNumber)

    return NextResponse.json({
      success: true,
      data: entry,
    })
  } catch (error) {
    console.error('❌ Error creating journal entry:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างรายการ' },
      { status: 500 }
    )
  }
}

