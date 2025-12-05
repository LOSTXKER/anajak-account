import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this'
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: { 
        email: email.toLowerCase(),
        status: 'active',
      },
      include: {
        userCompanies: {
          include: {
            company: true,
            role: true,
          },
        },
      },
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      )
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Create JWT token
    const token = await new SignJWT({ 
      userId: user.id,
      email: user.email,
      tenantId: user.tenantId,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        companies: user.userCompanies.map(uc => ({
          id: uc.company.id,
          name: uc.company.name,
          role: uc.role.name,
          isDefault: uc.isDefault,
        })),
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { 
        error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
        dbError: error?.code || undefined,
      },
      { status: 500 }
    )
  }
}

