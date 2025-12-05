import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 Register request:', { email: body.email, companyName: body.companyName })
    
    const { email, password, firstName, lastName, companyName, phone } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !companyName) {
      console.log('❌ Validation failed: Missing required fields')
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 400 }
      )
    }

    // Create tenant (organization)
    const tenant = await prisma.tenant.create({
      data: {
        name: companyName,
        slug: companyName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        plan: 'free',
        status: 'active',
      },
    })

    // Create company
    const company = await prisma.company.create({
      data: {
        tenantId: tenant.id,
        name: companyName,
        phone: phone || null,
      },
    })

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        status: 'active',
      },
    })

    // Get or create Owner role
    let ownerRole = await prisma.role.findFirst({
      where: { name: 'owner', isSystem: true },
    })

    if (!ownerRole) {
      ownerRole = await prisma.role.create({
        data: {
          name: 'owner',
          description: 'เจ้าของบริษัท - สิทธิ์เต็ม',
          isSystem: true,
        },
      })
    }

    // Link user to company with Owner role
    await prisma.userCompany.create({
      data: {
        userId: user.id,
        companyId: company.id,
        roleId: ownerRole.id,
        isDefault: true,
      },
    })

    console.log('✅ User created successfully:', user.id)

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        company: {
          id: company.id,
          name: company.name,
        },
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' },
      { status: 500 }
    )
  }
}

