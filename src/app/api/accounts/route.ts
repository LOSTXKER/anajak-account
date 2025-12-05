import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/accounts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const typeId = searchParams.get('typeId')

    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const where: any = {
      companyId: tenantId,
      isActive: true,
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (typeId) {
      where.accountTypeId = typeId
    }

    const accounts = await prisma.account.findMany({
      where,
      include: {
        accountType: true,
      },
      orderBy: {
        code: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: accounts,
    })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    )
  }
}

// POST /api/accounts
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
    const { accountTypeId, code, name, description, parentId, isActive = true } = body

    if (!accountTypeId || !code || !name) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Check duplicate
    const existing = await prisma.account.findFirst({
      where: {
        companyId: tenantId,
        code,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'รหัสบัญชีซ้ำ' },
        { status: 400 }
      )
    }

    const account = await prisma.account.create({
      data: {
        companyId: tenantId,
        accountTypeId,
        code,
        name,
        description,
        parentId,
        isActive,
      },
      include: {
        accountType: true,
      },
    })

    console.log('✅ Account created:', account.id)

    return NextResponse.json({
      success: true,
      data: account,
    })
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างบัญชี' },
      { status: 500 }
    )
  }
}
