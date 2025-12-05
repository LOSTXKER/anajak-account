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

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {
      companyId: tenantId,
    }

    if (productId) {
      where.productId = productId
    }

    const movements = await prisma.inventoryMovement.findMany({
      where,
      include: {
        product: true,
        document: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return NextResponse.json({
      success: true,
      data: movements,
    })
  } catch (error) {
    console.error('Error fetching inventory movements:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch movements' },
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

    const movement = await prisma.inventoryMovement.create({
      data: {
        ...data,
        companyId: tenantId,
      },
      include: {
        product: true,
      },
    })

    // Update product stock
    if (movement.type === 'in') {
      await prisma.product.update({
        where: { id: movement.productId },
        data: {
          stockQuantity: {
            increment: movement.quantity,
          },
        },
      })
    } else if (movement.type === 'out') {
      await prisma.product.update({
        where: { id: movement.productId },
        data: {
          stockQuantity: {
            decrement: movement.quantity,
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: movement,
    })
  } catch (error) {
    console.error('Error creating inventory movement:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create movement' },
      { status: 500 }
    )
  }
}

