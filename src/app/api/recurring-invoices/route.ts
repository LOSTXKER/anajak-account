import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const recurring = await prisma.recurringInvoice.findMany({
      where: {
        companyId: tenantId,
      },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        nextInvoiceDate: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: recurring,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch' },
      { status: 500 }
    )
  }
}

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
    const {
      contactId,
      frequency, // 'daily' | 'weekly' | 'monthly' | 'yearly'
      startDate,
      endDate,
      amount,
      description,
      lineItems,
    } = data

    const recurring = await prisma.recurringInvoice.create({
      data: {
        companyId: tenantId,
        contactId,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        nextInvoiceDate: new Date(startDate),
        amount,
        description,
        lineItems: lineItems || [],
        status: 'active',
      },
    })

    return NextResponse.json({
      success: true,
      data: recurring,
      message: 'สร้างรายการซ้ำสำเร็จ',
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create' },
      { status: 500 }
    )
  }
}

