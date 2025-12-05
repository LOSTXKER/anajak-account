import { prisma } from '@/lib/prisma'

/**
 * Calculate monthly depreciation for all active assets
 * Run this monthly via cron job
 */
export async function calculateMonthlyDepreciation() {
  const activeAssets = await prisma.fixedAsset.findMany({
    where: {
      status: 'active',
    },
  })

  const results = []

  for (const asset of activeAssets) {
    try {
      // Calculate depreciation based on method
      const depreciation = calculateDepreciation(
        asset.purchasePrice,
        asset.salvageValue || 0,
        asset.usefulLife,
        asset.depreciationMethod,
        1 / 12 // 1 month
      )

      // Update accumulated depreciation
      const newAccumulated = (asset.accumulatedDepreciation || 0) + depreciation
      const newBookValue = asset.purchasePrice - newAccumulated

      // Don't depreciate below salvage value
      if (newBookValue < (asset.salvageValue || 0)) {
        continue
      }

      await prisma.fixedAsset.update({
        where: { id: asset.id },
        data: {
          accumulatedDepreciation: newAccumulated,
          bookValue: newBookValue,
        },
      })

      // Create depreciation journal entry (optional)
      // TODO: Create journal entry
      // Dr. Depreciation Expense
      // Cr. Accumulated Depreciation

      results.push({
        assetId: asset.id,
        assetName: asset.name,
        depreciation,
        success: true,
      })
    } catch (error) {
      console.error(`Error calculating depreciation for asset ${asset.id}:`, error)
      results.push({
        assetId: asset.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return results
}

/**
 * Calculate depreciation amount
 */
export function calculateDepreciation(
  cost: number,
  salvageValue: number,
  usefulLifeYears: number,
  method: string,
  periodYears: number = 1
): number {
  const depreciableAmount = cost - salvageValue

  switch (method) {
    case 'straight_line':
      return (depreciableAmount / usefulLifeYears) * periodYears

    case 'declining_balance':
      // Double declining balance
      const rate = (2 / usefulLifeYears) * periodYears
      return cost * rate

    default:
      return (depreciableAmount / usefulLifeYears) * periodYears
  }
}

/**
 * Get depreciation schedule for an asset
 */
export function getDepreciationSchedule(
  cost: number,
  salvageValue: number,
  usefulLifeYears: number,
  method: string = 'straight_line'
) {
  const schedule = []
  let bookValue = cost
  let accumulated = 0

  for (let year = 1; year <= usefulLifeYears; year++) {
    const depreciation = calculateDepreciation(
      cost,
      salvageValue,
      usefulLifeYears,
      method,
      1
    )

    accumulated += depreciation
    bookValue -= depreciation

    // Don't go below salvage value
    if (bookValue < salvageValue) {
      bookValue = salvageValue
      accumulated = cost - salvageValue
    }

    schedule.push({
      year,
      depreciation,
      accumulated,
      bookValue,
    })
  }

  return schedule
}

