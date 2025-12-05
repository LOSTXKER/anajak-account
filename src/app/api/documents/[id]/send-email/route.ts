import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendDocumentEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { recipientEmail, message } = await request.json()
    const documentId = params.id

    // Get document with contact
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        companyId: tenantId,
      },
      include: {
        contact: true,
        company: true,
      },
    })

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      )
    }

    // Use recipient email or contact email
    const toEmail = recipientEmail || document.contact?.email

    if (!toEmail) {
      return NextResponse.json(
        { success: false, error: 'No recipient email provided' },
        { status: 400 }
      )
    }

    // Send email
    const result = await sendDocumentEmail({
      to: toEmail,
      documentNumber: document.documentNumber || '',
      documentType: document.type || '',
      companyName: document.company?.name || '',
      contactName: document.contact?.name || '',
      grandTotal: document.grandTotal || 0,
      message,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // Log email sent activity (optional)
    // You can add activity logging here

    return NextResponse.json({
      success: true,
      message: 'ส่งอีเมลสำเร็จ',
      data: result.data,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

