import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/payments
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payments = await prisma.payment.findMany({
      where: {
        companyId: tenantId,
      },
      include: {
        contact: true,
      },
      orderBy: {
        paymentDate: 'desc',
      },
      take: 100,
    })

    return NextResponse.json({
      success: true,
      data: payments,
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

// POST /api/payments
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
    const {
      type,
      contactId,
      amount,
      paymentMethod,
      paymentDate,
      referenceNumber,
      notes,
    } = body

    // Generate payment number
    const prefix = type === 'receive' ? 'RV' : 'PV'
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    
    const lastPayment = await prisma.payment.findFirst({
      where: {
        companyId: tenantId,
        paymentNumber: {
          startsWith: `${prefix}${year}${month}`,
        },
      },
      orderBy: {
        paymentNumber: 'desc',
      },
    })

    let runningNumber = 1
    if (lastPayment && lastPayment.paymentNumber) {
      const match = lastPayment.paymentNumber.match(/(\d+)$/)
      if (match) {
        runningNumber = parseInt(match[1]) + 1
      }
    }
    const paymentNumber = `${prefix}${year}${month}-${runningNumber.toString().padStart(4, '0')}`

    const payment = await prisma.payment.create({
      data: {
        companyId: tenantId,
        type,
        paymentNumber,
        contactId,
        amount,
        paymentMethod: paymentMethod || 'transfer',
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        referenceNumber,
        notes,
        status: 'completed',
        createdBy: userId,
      },
      include: {
        contact: true,
      },
    })

    console.log('✅ Payment created:', payment.id)

    return NextResponse.json({
      success: true,
      data: payment,
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
