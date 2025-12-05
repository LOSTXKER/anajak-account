import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/accounts - List all accounts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const typeId = searchParams.get('typeId')
    const includeBalance = searchParams.get('includeBalance') === 'true'

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
      isActive: true,
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (typeId) {
      where.accountTypeId = typeId
    }

    // Get accounts
    const accounts = await prisma.account.findMany({
      where,
      include: {
        accountType: true,
        parent: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: [
        { code: 'asc' },
      ],
    })

    // Calculate balances if requested
    let accountsWithBalance = accounts
    if (includeBalance) {
      accountsWithBalance = await Promise.all(
        accounts.map(async (account) => {
          const balance = await calculateAccountBalance(account.id)
          return {
            ...account,
            balance,
          }
        })
      )
    }

    return NextResponse.json({
      success: true,
      data: accountsWithBalance,
    })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    )
  }
}

// POST /api/accounts - Create new account
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
    console.log('📝 Creating account:', body)

    const {
      accountTypeId,
      code,
      name,
      description,
      parentId,
      isActive = true,
    } = body

    // Validate required fields
    if (!accountTypeId || !code || !name) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Check duplicate code
    const existing = await prisma.account.findFirst({
      where: {
        companyId: tenantId,
        code,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'รหัสบัญชีซ้ำ' },
        { status: 400 }
      )
    }

    // Create account
    const account = await prisma.account.create({
      data: {
        companyId: tenantId,
        accountTypeId,
        code,
        name,
        description,
        parentId,
        isActive,
      },
      include: {
        accountType: true,
        parent: true,
      },
    })

    console.log('✅ Account created:', account.id, account.code)

    return NextResponse.json({
      success: true,
      data: account,
    })
  } catch (error) {
    console.error('❌ Error creating account:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างบัญชี' },
      { status: 500 }
    )
  }
}

// Helper function to calculate account balance
async function calculateAccountBalance(accountId: string) {
  const entries = await prisma.journalEntryLine.findMany({
    where: {
      accountId,
      journalEntry: {
        status: 'posted',
      },
    },
  })

  const debit = entries.reduce((sum, e) => sum + Number(e.debitAmount), 0)
  const credit = entries.reduce((sum, e) => sum + Number(e.creditAmount), 0)

  return {
    debit,
    credit,
    balance: debit - credit,
  }
}

