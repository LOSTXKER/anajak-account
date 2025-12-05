import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get recent documents with stock movements
    const documents = await prisma.document.findMany({
      where: {
        companyId: tenantId,
        documentType: {
          category: {
            in: ['sales', 'purchase'],
          },
        },
      },
      include: {
        documentType: true,
        lines: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    })

    // Transform to movement format
    const movements = documents.flatMap(doc => 
      doc.lines
        .filter(line => line.productId)
        .map(line => ({
          id: `${doc.id}-${line.id}`,
          documentId: doc.id,
          documentNumber: doc.documentNumber,
          type: doc.documentType.category === 'sales' ? 'out' : 'in',
          productId: line.productId,
          product: line.product,
          quantity: line.quantity,
          reference: doc.documentNumber,
          notes: `${doc.documentType.name}`,
          createdAt: doc.createdAt,
        }))
    )

    return NextResponse.json({
      success: true,
      data: movements,
    })
  } catch (error) {
    console.error('Error fetching movements:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}

