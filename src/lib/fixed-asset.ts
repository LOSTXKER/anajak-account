// Placeholder for Fixed Asset utilities

export function calculateDepreciation(
  cost: number,
  salvageValue: number,
  usefulLife: number,
  method: 'straight-line' | 'declining-balance' = 'straight-line'
): number {
  if (method === 'straight-line') {
    return (cost - salvageValue) / usefulLife
  }
  
  // Declining balance method
  const rate = 2 / usefulLife
  return cost * rate
}

export function calculateAccumulatedDepreciation(
  cost: number,
  salvageValue: number,
  usefulLife: number,
  yearsUsed: number,
  method: 'straight-line' | 'declining-balance' = 'straight-line'
): number {
  if (method === 'straight-line') {
    const annualDepreciation = (cost - salvageValue) / usefulLife
    return annualDepreciation * yearsUsed
  }
  
  // Declining balance
  const rate = 2 / usefulLife
  let bookValue = cost
  
  for (let i = 0; i < yearsUsed; i++) {
    bookValue -= bookValue * rate
  }
  
  return cost - bookValue
}

export function getBookValue(
  cost: number,
  accumulatedDepreciation: number
): number {
  return cost - accumulatedDepreciation
}

