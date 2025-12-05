import { prisma } from '@/lib/prisma'

/**
 * Generate invoices from recurring schedules
 * Run this daily via cron job
 */
export async function generateRecurringInvoices() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get all active recurring invoices due today
  const dueRecurring = await prisma.recurringInvoice.findMany({
    where: {
      status: 'active',
      nextInvoiceDate: {
        lte: today,
      },
      OR: [
        { endDate: null },
        { endDate: { gte: today } },
      ],
    },
    include: {
      contact: true,
    },
  })

  const results = []

  for (const recurring of dueRecurring) {
    try {
      // Generate document number
      const year = new Date().getFullYear()
      const lastDoc = await prisma.document.findFirst({
        where: {
          companyId: recurring.companyId,
          type: 'invoice',
          documentNumber: {
            startsWith: `IV${year}`,
          },
        },
        orderBy: {
          documentNumber: 'desc',
        },
      })

      let runningNumber = 1
      if (lastDoc && lastDoc.documentNumber) {
        const match = lastDoc.documentNumber.match(/(\d+)$/)
        if (match) {
          runningNumber = parseInt(match[1]) + 1
        }
      }
      const documentNumber = `IV${year}-${runningNumber.toString().padStart(4, '0')}`

      // Create invoice
      const invoice = await prisma.document.create({
        data: {
          companyId: recurring.companyId,
          type: 'invoice',
          documentNumber,
          contactId: recurring.contactId,
          issueDate: new Date(),
          notes: `Generated from recurring invoice: ${recurring.description}`,
          subtotal: recurring.amount,
          grandTotal: recurring.amount * 1.07, // Assume 7% VAT
          vatAmount: recurring.amount * 0.07,
          status: 'pending',
          lineItems: {
            create: Array.isArray(recurring.lineItems) ? recurring.lineItems : [],
          },
        },
      })

      // Calculate next invoice date
      const nextDate = calculateNextDate(recurring.nextInvoiceDate, recurring.frequency)

      // Update recurring invoice
      await prisma.recurringInvoice.update({
        where: { id: recurring.id },
        data: {
          nextInvoiceDate: nextDate,
          lastInvoiceDate: new Date(),
        },
      })

      results.push({
        recurringId: recurring.id,
        invoiceId: invoice.id,
        success: true,
      })
    } catch (error) {
      console.error(`Error generating invoice for recurring ${recurring.id}:`, error)
      results.push({
        recurringId: recurring.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return results
}

function calculateNextDate(currentDate: Date, frequency: string): Date {
  const next = new Date(currentDate)

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

