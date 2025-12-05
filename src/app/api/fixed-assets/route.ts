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

    const assets = await prisma.fixedAsset.findMany({
      where: {
        companyId: tenantId,
      },
      orderBy: {
        purchaseDate: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: assets,
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
      name,
      assetCode,
      category,
      purchaseDate,
      purchasePrice,
      salvageValue,
      usefulLife, // in years
      depreciationMethod,
    } = data

    // Calculate depreciation
    const yearlyDepreciation = (purchasePrice - (salvageValue || 0)) / usefulLife
    const monthlyDepreciation = yearlyDepreciation / 12

    const asset = await prisma.fixedAsset.create({
      data: {
        companyId: tenantId,
        name,
        assetCode: assetCode || `AST-${Date.now()}`,
        category: category || 'equipment',
        purchaseDate: new Date(purchaseDate),
        purchasePrice,
        salvageValue: salvageValue || 0,
        usefulLife,
        depreciationMethod: depreciationMethod || 'straight_line',
        accumulatedDepreciation: 0,
        bookValue: purchasePrice,
        status: 'active',
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...asset,
        yearlyDepreciation,
        monthlyDepreciation,
      },
      message: 'บันทึกทรัพย์สินสำเร็จ',
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create' },
      { status: 500 }
    )
  }
}

