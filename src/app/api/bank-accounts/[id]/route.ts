import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const bankAccount = await prisma.bankAccount.findFirst({
      where: {
        id: params.id,
        companyId: tenantId,
      },
    })

    if (!bankAccount) {
      return NextResponse.json(
        { success: false, error: 'Bank account not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: bankAccount,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bank account' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const bankAccount = await prisma.bankAccount.updateMany({
      where: {
        id: params.id,
        companyId: tenantId,
      },
      data,
    })

    return NextResponse.json({
      success: true,
      data: bankAccount,
      message: 'อัปเดตสำเร็จ',
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    await prisma.bankAccount.deleteMany({
      where: {
        id: params.id,
        companyId: tenantId,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'ลบสำเร็จ',
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete' },
      { status: 500 }
    )
  }
}

