import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/documents/:id - Get single document
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
        id: id,
        companyId: tenantId,
      },
      include: {
        contact: {
          include: {
            addresses: true,
          },
        },
        documentType: true,
        lineItems: {
          include: {
            product: true,
          },
          orderBy: {
            lineNumber: 'asc',
          },
        },
        payments: true,
        createdBy: {
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

// PUT /api/documents/:id - Update document
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tenantId = request.headers.get('x-tenant-id')
    const userId = request.headers.get('x-user-id')

    if (!tenantId || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Check if document exists and belongs to tenant
    const existingDoc = await prisma.document.findFirst({
      where: {
        id: id,
        companyId: tenantId,
      },
    })

    if (!existingDoc) {
      return NextResponse.json(
        { error: 'ไม่พบเอกสาร' },
        { status: 404 }
      )
    }

    // Cannot edit if document is paid
    if (existingDoc.status === 'paid') {
      return NextResponse.json(
        { error: 'ไม่สามารถแก้ไขเอกสารที่ชำระเงินแล้ว' },
        { status: 400 }
      )
    }

    const {
      contactId,
      issueDate,
      dueDate,
      referenceNumber,
      notes,
      terms,
      lineItems,
      subtotal,
      discountAmount,
      vatAmount,
      withholdingTaxAmount,
      totalAmount,
      status,
    } = body

    // Delete old line items and create new ones
    await prisma.documentLineItem.deleteMany({
      where: { documentId: id },
    })

    // Update document
    const document = await prisma.document.update({
      where: { id: id },
      data: {
        contactId,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : null,
        referenceNumber,
        notes,
        terms,
        subtotalAmount: subtotal,
        discountAmount: discountAmount || 0,
        taxAmount: vatAmount || 0,
        withholdingTaxAmount: withholdingTaxAmount || 0,
        totalAmount,
        status: status || existingDoc.status,
        lineItems: {
          create: lineItems.map((item: any, index: number) => ({
            lineNumber: index + 1,
            productId: item.productId,
            description: item.description || item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discountAmount: item.discountAmount || 0,
            amount: item.amount,
          })),
        },
      },
      include: {
        contact: true,
        documentType: true,
        lineItems: {
          include: {
            product: true,
          },
        },
      },
    })

    console.log('✅ Document updated:', document.id)

    return NextResponse.json({
      success: true,
      data: document,
    })
  } catch (error) {
    console.error('❌ Error updating document:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดทเอกสาร' },
      { status: 500 }
    )
  }
}

// DELETE /api/documents/:id - Delete document
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

    // Check if document exists and belongs to tenant
    const document = await prisma.document.findFirst({
      where: {
        id: id,
        companyId: tenantId,
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'ไม่พบเอกสาร' },
        { status: 404 }
      )
    }

    // Cannot delete if document is paid or has payments
    if (document.status === 'paid') {
      return NextResponse.json(
        { error: 'ไม่สามารถลบเอกสารที่ชำระเงินแล้ว' },
        { status: 400 }
      )
    }

    // Soft delete by setting status to cancelled
    await prisma.document.update({
      where: { id: id },
      data: {
        status: 'cancelled',
      },
    })

    console.log('✅ Document deleted (cancelled):', id)

    return NextResponse.json({
      success: true,
      message: 'ยกเลิกเอกสารเรียบร้อยแล้ว',
    })
  } catch (error) {
    console.error('❌ Error deleting document:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบเอกสาร' },
      { status: 500 }
    )
  }
}
