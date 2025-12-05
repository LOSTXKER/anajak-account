import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/bank-accounts/[id]/reconcile
 * Reconcile bank account
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { reconciledDate, closingBalance, matchedTransactions } = data

    // Update bank account
    await prisma.bankAccount.updateMany({
      where: {
        id: params.id,
        companyId: tenantId,
      },
      data: {
        lastReconciledDate: new Date(reconciledDate),
        lastReconciledBalance: closingBalance,
      },
    })

    // Create reconciliation record
    const reconciliation = await prisma.bankReconciliation.create({
      data: {
        bankAccountId: params.id,
        reconciledDate: new Date(reconciledDate),
        closingBalance,
        matchedCount: matchedTransactions?.length || 0,
        status: 'completed',
      },
    })

    return NextResponse.json({
      success: true,
      data: reconciliation,
      message: 'กระทบยอดสำเร็จ',
    })
  } catch (error) {
    console.error('Error reconciling:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reconcile' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/bank-accounts/[id]/reconcile
 * Get reconciliation history
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const reconciliations = await prisma.bankReconciliation.findMany({
      where: {
        bankAccountId: params.id,
      },
      orderBy: {
        reconciledDate: 'desc',
      },
      take: 12, // Last 12 months
    })

    return NextResponse.json({
      success: true,
      data: reconciliations,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch' },
      { status: 500 }
    )
  }
}

