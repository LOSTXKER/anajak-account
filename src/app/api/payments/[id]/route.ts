import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/payments/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        companyId: tenantId,
      },
      include: {
        contact: true,
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'ไม่พบรายการชำระเงิน' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: payment,
    })
  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

// DELETE /api/payments/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        companyId: tenantId,
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'ไม่พบรายการชำระเงิน' },
        { status: 404 }
      )
    }

    await prisma.payment.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'ลบรายการชำระเงินเรียบร้อยแล้ว',
    })
  } catch (error) {
    console.error('Error deleting payment:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
