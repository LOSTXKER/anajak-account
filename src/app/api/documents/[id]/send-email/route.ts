import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendDocumentEmail } from '@/lib/email'

export async function POST(
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

    const body = await request.json()
    const { email, message } = body

    if (!email) {
      return NextResponse.json(
        { error: 'กรุณาระบุอีเมลผู้รับ' },
        { status: 400 }
      )
    }

    // Get document
    const document = await prisma.document.findFirst({
      where: {
        id,
        companyId: tenantId,
      },
      include: {
        documentType: true,
        contact: true,
        company: true,
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'ไม่พบเอกสาร' },
        { status: 404 }
      )
    }

    // Send email
    const result = await sendDocumentEmail({
      to: email,
      documentNumber: document.documentNumber,
      documentType: document.documentType.name,
      companyName: document.company.name,
      totalAmount: Number(document.totalAmount),
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'ส่งอีเมลไม่สำเร็จ' },
        { status: 500 }
      )
    }

    // Update document sent status
    await prisma.document.update({
      where: { id },
      data: {
        sentAt: new Date(),
        status: document.status === 'draft' ? 'sent' : document.status,
      },
    })

    console.log('✅ Document sent via email:', id)

    return NextResponse.json({
      success: true,
      message: 'ส่งอีเมลเรียบร้อยแล้ว',
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการส่งอีเมล' },
      { status: 500 }
    )
  }
}

