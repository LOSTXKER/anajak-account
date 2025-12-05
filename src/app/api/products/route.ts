import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get('x-company-id')
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') // product, service, bundle

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required' },
        { status: 400 }
      )
    }

    const where: any = { companyId }

    if (type) {
      where.type = type
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const companyId = request.headers.get('x-company-id')
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { 
      type,
      categoryId,
      code,
      barcode,
      name,
      nameEn,
      description,
      unit,
      salePrice,
      purchasePrice,
      isVatable,
      vatType,
      trackInventory,
      minStock,
      incomeAccountId,
      expenseAccountId,
      inventoryAccountId,
    } = body

    // Validate required fields
    if (!type || !name) {
      return NextResponse.json(
        { error: 'Type and name are required' },
        { status: 400 }
      )
    }

    // Check if code already exists
    if (code) {
      const existing = await prisma.product.findFirst({
        where: { companyId, code },
      })
      if (existing) {
        return NextResponse.json(
          { error: 'Product code already exists' },
          { status: 400 }
        )
      }
    }

    const product = await prisma.product.create({
      data: {
        companyId,
        type,
        categoryId,
        code,
        barcode,
        name,
        nameEn,
        description,
        unit,
        salePrice: salePrice || 0,
        purchasePrice: purchasePrice || 0,
        isVatable: isVatable !== false,
        vatType: vatType || 'vat7',
        trackInventory: trackInventory || false,
        minStock: minStock || 0,
        incomeAccountId,
        expenseAccountId,
        inventoryAccountId,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

