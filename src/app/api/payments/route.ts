import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/payments - List all payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type')
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
        { paymentNumber: { contains: search, mode: 'insensitive' } },
        { referenceNumber: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (type) {
      where.type = type
    }

    if (status) {
      where.status = status
    }

    // Get payments with pagination
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          contact: {
            select: {
              id: true,
              name: true,
            },
          },
          account: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          paymentItems: {
            include: {
              document: {
                select: {
                  id: true,
                  documentNumber: true,
                  totalAmount: true,
                },
              },
            },
          },
        },
        orderBy: {
          paymentDate: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    )
  }
}

// POST /api/payments - Create new payment
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
    console.log('📝 Creating payment:', body)

    const {
      type,
      contactId,
      accountId,
      paymentDate,
      amount,
      paymentMethod,
      referenceNumber,
      notes,
      documents, // Array of { documentId, amount }
    } = body

    // Validate required fields
    if (!type || !contactId || !accountId || !paymentDate || !amount) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Generate payment number
    const year = new Date().getFullYear()
    const prefix = type === 'receive' ? 'RCV' : 'PAY'
    
    const lastPayment = await prisma.payment.findFirst({
      where: {
        companyId: tenantId,
        type,
        paymentNumber: {
          startsWith: `${prefix}${year}`,
        },
      },
      orderBy: {
        paymentNumber: 'desc',
      },
    })

    let runningNumber = 1
    if (lastPayment) {
      const match = lastPayment.paymentNumber.match(/\d+$/)
      if (match) {
        runningNumber = parseInt(match[0]) + 1
      }
    }

    const paymentNumber = `${prefix}${year}-${runningNumber.toString().padStart(4, '0')}`

    // Create payment with items
    const payment = await prisma.payment.create({
      data: {
        companyId: tenantId,
        type,
        contactId,
        accountId,
        paymentNumber,
        paymentDate: new Date(paymentDate),
        amount,
        paymentMethod: paymentMethod || 'cash',
        referenceNumber,
        notes,
        status: 'completed',
        createdById: userId,
        paymentItems: documents && documents.length > 0 ? {
          create: documents.map((doc: any) => ({
            documentId: doc.documentId,
            amount: doc.amount,
          })),
        } : undefined,
      },
      include: {
        contact: true,
        account: true,
        paymentItems: {
          include: {
            document: true,
          },
        },
      },
    })

    // Update document payment status
    if (documents && documents.length > 0) {
      for (const doc of documents) {
        const document = await prisma.document.findUnique({
          where: { id: doc.documentId },
          include: {
            payments: true,
          },
        })

        if (document) {
          const totalPaid = document.payments.reduce((sum, p) => sum + p.amount, 0) + doc.amount
          const newStatus = totalPaid >= document.totalAmount 
            ? 'paid' 
            : totalPaid > 0 
              ? 'partial' 
              : document.status

          await prisma.document.update({
            where: { id: doc.documentId },
            data: {
              paidAmount: totalPaid,
              status: newStatus,
            },
          })
        }
      }
    }

    console.log('✅ Payment created:', payment.id, payment.paymentNumber)

    return NextResponse.json({
      success: true,
      data: payment,
    })
  } catch (error) {
    console.error('❌ Error creating payment:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างรายการชำระเงิน' },
      { status: 500 }
    )
  }
}

