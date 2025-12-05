import { prisma } from '@/lib/prisma'

export interface BankTransaction {
  date: Date
  description: string
  amount: number
  type: 'debit' | 'credit'
  reference?: string
}

export interface PaymentMatch {
  paymentId: string
  bankTransactionIndex: number
  confidence: number
}

/**
 * Auto-match bank transactions with payments
 */
export async function autoMatchTransactions(
  companyId: string,
  bankAccountId: string,
  bankTransactions: BankTransaction[]
): Promise<PaymentMatch[]> {
  // Get unreconciled payments
  const payments = await prisma.payment.findMany({
    where: {
      companyId,
      // TODO: Add bankAccountId filter
      // TODO: Add reconciled filter
    },
    include: {
      contact: true,
      document: true,
    },
  })

  const matches: PaymentMatch[] = []

  for (let i = 0; i < bankTransactions.length; i++) {
    const transaction = bankTransactions[i]
    
    for (const payment of payments) {
      let confidence = 0

      // Match by amount (exact)
      if (Math.abs(payment.amount - Math.abs(transaction.amount)) < 0.01) {
        confidence += 50
      }

      // Match by date (within 3 days)
      const daysDiff = Math.abs(
        (new Date(payment.paymentDate).getTime() - transaction.date.getTime()) /
        (1000 * 60 * 60 * 24)
      )
      if (daysDiff <= 3) {
        confidence += 30
      }

      // Match by reference
      if (transaction.reference && payment.reference) {
        if (transaction.reference.includes(payment.reference) || 
            payment.reference.includes(transaction.reference)) {
          confidence += 20
        }
      }

      // If high confidence, add to matches
      if (confidence >= 70) {
        matches.push({
          paymentId: payment.id,
          bankTransactionIndex: i,
          confidence,
        })
      }
    }
  }

  return matches
}

/**
 * Parse CSV bank statement
 * Simple parser - customize based on bank format
 */
export function parseBankStatement(csvContent: string): BankTransaction[] {
  const lines = csvContent.split('\n')
  const transactions: BankTransaction[] = []

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const columns = line.split(',')
    
    try {
      // Assuming format: Date, Description, Debit, Credit, Balance
      // Customize this based on actual bank format
      const date = new Date(columns[0])
      const description = columns[1] || ''
      const debit = parseFloat(columns[2] || '0')
      const credit = parseFloat(columns[3] || '0')

      if (debit > 0) {
        transactions.push({
          date,
          description,
          amount: -debit, // Negative for outgoing
          type: 'debit',
        })
      }

      if (credit > 0) {
        transactions.push({
          date,
          description,
          amount: credit, // Positive for incoming
          type: 'credit',
        })
      }
    } catch (error) {
      console.error('Error parsing line:', line, error)
    }
  }

  return transactions
}

/**
 * Get reconciliation summary
 */
export async function getReconciliationSummary(
  companyId: string,
  bankAccountId: string,
  endDate: Date
) {
  // Get bank account
  const bankAccount = await prisma.bankAccount.findFirst({
    where: {
      id: bankAccountId,
      companyId,
    },
  })

  if (!bankAccount) {
    throw new Error('Bank account not found')
  }

  // Get all payments for this account
  const payments = await prisma.payment.findMany({
    where: {
      companyId,
      paymentDate: {
        lte: endDate,
      },
      // TODO: Filter by bankAccountId
    },
  })

  const totalDebit = payments
    .filter(p => p.type === 'pay')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalCredit = payments
    .filter(p => p.type === 'receive')
    .reduce((sum, p) => sum + p.amount, 0)

  const bookBalance = bankAccount.balance + totalCredit - totalDebit

  return {
    bankBalance: bankAccount.balance,
    bookBalance,
    difference: bankAccount.balance - bookBalance,
    totalDebit,
    totalCredit,
    lastReconciled: bankAccount.lastReconciledDate,
  }
}

