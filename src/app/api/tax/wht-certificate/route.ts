import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/tax/wht-certificate
 * หนังสือรับรองการหักภาษี ณ ที่จ่าย (50 ทวิ)
 */
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (paymentId) {
      // Get specific payment with WHT
      const payment = await prisma.payment.findFirst({
        where: {
          id: paymentId,
          companyId: tenantId,
        },
        include: {
          contact: true,
          document: true,
        },
      })

      if (!payment) {
        return NextResponse.json(
          { success: false, error: 'Payment not found' },
          { status: 404 }
        )
      }

      // Get company info
      const company = await prisma.company.findUnique({
        where: { id: tenantId },
      })

      return NextResponse.json({
        success: true,
        data: {
          certificateNumber: `WHT${new Date().getFullYear()}-${String(payment.paymentNumber).padStart(4, '0')}`,
          issueDate: payment.paymentDate,
          payer: {
            name: company?.name || '',
            taxId: company?.taxId || '',
            address: company?.address || '',
          },
          payee: {
            name: payment.contact?.name || '',
            taxId: payment.contact?.taxId || '',
            address: payment.contact?.address || '',
          },
          payment: {
            date: payment.paymentDate,
            amount: payment.amount,
            whtRate: 3, // Default, should come from document
            whtAmount: payment.amount * 0.03, // Should calculate from actual rate
            description: payment.notes || 'จ้างทำของ/บริการ',
          },
        },
      })
    }

    // List all WHT certificates in period
    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุช่วงวันที่' },
        { status: 400 }
      )
    }

    const payments = await prisma.payment.findMany({
      where: {
        companyId: tenantId,
        paymentDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        // Only payments with WHT
        // TODO: Add WHT amount field to filter
      },
      include: {
        contact: true,
        document: true,
      },
      orderBy: {
        paymentDate: 'asc',
      },
    })

    const items = payments.map((payment) => ({
      id: payment.id,
      certificateNumber: `WHT${new Date().getFullYear()}-${String(payment.paymentNumber).padStart(4, '0')}`,
      date: payment.paymentDate,
      payeeName: payment.contact?.name || '',
      payeeTaxId: payment.contact?.taxId || '',
      amount: payment.amount,
      whtRate: 3,
      whtAmount: payment.amount * 0.03,
    }))

    return NextResponse.json({
      success: true,
      data: {
        period: {
          startDate,
          endDate,
        },
        items,
        summary: {
          totalCertificates: items.length,
          totalAmount: items.reduce((sum, item) => sum + item.amount, 0),
          totalWht: items.reduce((sum, item) => sum + item.whtAmount, 0),
        },
      },
    })
  } catch (error) {
    console.error('Error generating WHT certificate:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate certificate' },
      { status: 500 }
    )
  }
}

