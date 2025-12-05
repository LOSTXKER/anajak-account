import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/bank-accounts
 * List all bank accounts
 */
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const bankAccounts = await prisma.bankAccount.findMany({
      where: {
        companyId: tenantId,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: bankAccounts,
    })
  } catch (error) {
    console.error('Error fetching bank accounts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bank accounts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/bank-accounts
 * Create new bank account
 */
export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { name, bankName, accountNumber, accountType, currency, openingBalance } = data

    if (!name || !bankName || !accountNumber) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    const bankAccount = await prisma.bankAccount.create({
      data: {
        companyId: tenantId,
        name,
        bankName,
        accountNumber,
        accountType: accountType || 'checking',
        currency: currency || 'THB',
        balance: openingBalance || 0,
        lastReconciledDate: null,
        lastReconciledBalance: null,
      },
    })

    return NextResponse.json({
      success: true,
      data: bankAccount,
      message: 'สร้างบัญชีธนาคารสำเร็จ',
    })
  } catch (error) {
    console.error('Error creating bank account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create bank account' },
      { status: 500 }
    )
  }
}

