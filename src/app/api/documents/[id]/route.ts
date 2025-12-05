import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/documents/:id
export async function GET(
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

    const document = await prisma.document.findFirst({
      where: {
        id,
        companyId: tenantId,
      },
      include: {
        documentType: true,
        contact: true,
        lines: {
          include: {
            product: true,
          },
          orderBy: {
            lineNumber: 'asc',
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'ไม่พบเอกสาร' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: document,
    })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    )
  }
}

// PUT /api/documents/:id
export async function PUT(
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

    // Check document exists
    const existingDoc = await prisma.document.findFirst({
      where: {
        id,
        companyId: tenantId,
      },
    })

    if (!existingDoc) {
      return NextResponse.json(
        { error: 'ไม่พบเอกสาร' },
        { status: 404 }
      )
    }

    if (existingDoc.status === 'paid') {
      return NextResponse.json(
        { error: 'ไม่สามารถแก้ไขเอกสารที่ชำระเงินแล้ว' },
        { status: 400 }
      )
    }

    const {
      contactId,
      contactName,
      contactAddress,
      documentDate,
      dueDate,
      referenceNumber,
      notes,
      lines,
      subtotal,
      discountAmount,
      vatAmount,
      whtAmount,
      totalAmount,
      status,
    } = body

    // Delete old lines
    await prisma.documentLine.deleteMany({
      where: { documentId: id },
    })

    // Update document
    const document = await prisma.document.update({
      where: { id },
      data: {
        contactId,
        contactName,
        contactAddress,
        documentDate: documentDate ? new Date(documentDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : null,
        referenceNumber,
        notes,
        subtotal: subtotal || 0,
        discountAmount: discountAmount || 0,
        vatAmount: vatAmount || 0,
        whtAmount: whtAmount || 0,
        totalAmount: totalAmount || 0,
        status: status || existingDoc.status,
        lines: {
          create: (lines || []).map((item: any, index: number) => ({
            lineNumber: index + 1,
            productId: item.productId,
            productCode: item.productCode,
            productName: item.productName || '',
            description: item.description,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            discountAmount: item.discountAmount || 0,
            amount: item.amount || 0,
          })),
        },
      },
      include: {
        documentType: true,
        contact: true,
        lines: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: document,
    })
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดทเอกสาร' },
      { status: 500 }
    )
  }
}

// DELETE /api/documents/:id
export async function DELETE(
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

    const document = await prisma.document.findFirst({
      where: {
        id,
        companyId: tenantId,
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'ไม่พบเอกสาร' },
        { status: 404 }
      )
    }

    if (document.status === 'paid') {
      return NextResponse.json(
        { error: 'ไม่สามารถลบเอกสารที่ชำระเงินแล้ว' },
        { status: 400 }
      )
    }

    // Soft delete
    await prisma.document.update({
      where: { id },
      data: {
        status: 'cancelled',
        voidedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'ยกเลิกเอกสารเรียบร้อยแล้ว',
    })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบเอกสาร' },
      { status: 500 }
    )
  }
}
