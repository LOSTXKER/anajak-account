import { NextRequest, NextResponse } from 'next/server'
import { calculateMonthlyDepreciation } from '@/lib/fixed-asset'

/**
 * POST /api/fixed-assets/depreciate
 * Calculate depreciation for all active assets
 * In production, this should be called by a monthly cron job
 */
export async function POST(request: NextRequest) {
  try {
    const results = await calculateMonthlyDepreciation()

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length
    const totalDepreciation = results
      .filter(r => r.success && r.depreciation)
      .reduce((sum, r) => sum + (r.depreciation || 0), 0)

    return NextResponse.json({
      success: true,
      data: {
        total: results.length,
        successful,
        failed,
        totalDepreciation,
        details: results,
      },
      message: `คำนวณค่าเสื่อมสำเร็จ ${successful} รายการ`,
    })
  } catch (error) {
    console.error('Error calculating depreciation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to calculate' },
      { status: 500 }
    )
  }
}

