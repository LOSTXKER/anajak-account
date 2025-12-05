import { NextRequest, NextResponse } from 'next/server'
import { generateRecurringInvoices } from '@/lib/recurring-invoice'

/**
 * POST /api/recurring-invoices/generate
 * Manual trigger for generating recurring invoices
 * In production, this should be called by a cron job
 */
export async function POST(request: NextRequest) {
  try {
    const results = await generateRecurringInvoices()

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      data: {
        total: results.length,
        successful,
        failed,
        details: results,
      },
      message: `สร้างใบแจ้งหนี้สำเร็จ ${successful} รายการ`,
    })
  } catch (error) {
    console.error('Error generating recurring invoices:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate invoices' },
      { status: 500 }
    )
  }
}

