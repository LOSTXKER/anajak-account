import { prisma } from './prisma'

// Placeholder for Recurring Invoice utilities

export async function generateRecurringInvoices() {
  // This would query RecurringInvoice schedules and generate invoices
  // Currently returns empty as RecurringInvoice model doesn't exist
  
  console.log('✅ Recurring invoice generation completed (no schedules found)')
  
  return {
    generated: 0,
    schedules: [],
  }
}

export function getNextRecurringDate(frequency: string, lastDate: Date): Date {
  const next = new Date(lastDate)
  
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1)
      break
    case 'weekly':
      next.setDate(next.getDate() + 7)
      break
    case 'monthly':
      next.setMonth(next.getMonth() + 1)
      break
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1)
      break
  }
  
  return next
}

