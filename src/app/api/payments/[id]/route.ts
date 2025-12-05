import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/payments/:id - Get single payment
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
        id: id,
        companyId: tenantId,
      },
      include: {
        contact: true,
        account: true,
        paymentItems: {
          include: {
            document: {
              include: {
                documentType: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
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
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    )
  }
}

// DELETE /api/payments/:id - Delete payment
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

    // Check if payment exists
    const payment = await prisma.payment.findFirst({
      where: {
        id: id,
        companyId: tenantId,
      },
      include: {
        paymentItems: true,
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'ไม่พบรายการชำระเงิน' },
        { status: 404 }
      )
    }

    // Reverse document payment status
    for (const item of payment.paymentItems) {
      const document = await prisma.document.findUnique({
        where: { id: item.documentId },
        include: {
          payments: {
            where: {
              id: { not: id },
            },
          },
        },
      })

      if (document) {
        const totalPaid = document.payments.reduce((sum, p) => sum + p.amount, 0)
        const newStatus = totalPaid >= document.totalAmount 
          ? 'paid' 
          : totalPaid > 0 
            ? 'partial' 
            : 'sent'

        await prisma.document.update({
          where: { id: item.documentId },
          data: {
            paidAmount: totalPaid,
            status: newStatus,
          },
        })
      }
    }

    // Delete payment items first
    await prisma.paymentItem.deleteMany({
      where: { paymentId: id },
    })

    // Delete payment
    await prisma.payment.delete({
      where: { id: id },
    })

    console.log('✅ Payment deleted:', id)

    return NextResponse.json({
      success: true,
      message: 'ลบรายการชำระเงินเรียบร้อยแล้ว',
    })
  } catch (error) {
    console.error('❌ Error deleting payment:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบรายการ' },
      { status: 500 }
    )
  }
}
