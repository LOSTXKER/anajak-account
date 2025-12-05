import { prisma } from '@/lib/prisma'

export interface StockMovementParams {
  companyId: string
  productId: string
  quantity: number
  type: 'in' | 'out' | 'adjust'
  documentId?: string
  reference?: string
  notes?: string
}

/**
 * Create stock movement and update product stock
 */
export async function createStockMovement({
  companyId,
  productId,
  quantity,
  type,
  documentId,
  reference,
  notes,
}: StockMovementParams) {
  try {
    // Create movement record
    const movement = await prisma.inventoryMovement.create({
      data: {
        companyId,
        productId,
        quantity,
        type,
        documentId,
        reference,
        notes,
      },
    })

    // Update product stock
    const updateData: any = {}
    if (type === 'in' || type === 'adjust') {
      updateData.stockQuantity = {
        increment: quantity,
      }
    } else if (type === 'out') {
      updateData.stockQuantity = {
        decrement: quantity,
      }
    }

    await prisma.product.update({
      where: { id: productId },
      data: updateData,
    })

    return { success: true, data: movement }
  } catch (error) {
    console.error('Error creating stock movement:', error)
    return { success: false, error: 'Failed to create stock movement' }
  }
}

/**
 * Process stock movements from document line items
 */
export async function processDocumentStockMovements(
  companyId: string,
  documentId: string,
  documentType: string,
  lineItems: any[]
) {
  try {
    // Determine movement type based on document type
    let movementType: 'in' | 'out' | 'adjust' = 'out'
    
    if (documentType === 'purchase_order' || documentType === 'bill') {
      movementType = 'in' // Buying/receiving stock
    } else if (documentType === 'invoice' || documentType === 'tax_invoice' || documentType === 'receipt') {
      movementType = 'out' // Selling stock
    } else {
      // Quotation doesn't affect stock
      return { success: true, message: 'No stock movement needed' }
    }

    // Create movements for each line item
    for (const item of lineItems) {
      if (item.productId) {
        // Check if product is a goods (not service)
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        })

        if (product && product.type === 'goods') {
          await createStockMovement({
            companyId,
            productId: item.productId,
            quantity: item.quantity,
            type: movementType,
            documentId,
            notes: `${documentType} - ${item.description || product.name}`,
          })
        }
      }
    }

    return { success: true, message: 'Stock movements processed' }
  } catch (error) {
    console.error('Error processing stock movements:', error)
    return { success: false, error: 'Failed to process stock movements' }
  }
}

/**
 * Get stock movement history for a product
 */
export async function getProductStockHistory(productId: string, limit: number = 50) {
  try {
    const movements = await prisma.inventoryMovement.findMany({
      where: {
        productId,
      },
      include: {
        document: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return { success: true, data: movements }
  } catch (error) {
    console.error('Error fetching stock history:', error)
    return { success: false, error: 'Failed to fetch stock history' }
  }
}

/**
 * Get low stock products
 */
export async function getLowStockProducts(companyId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        companyId,
        type: 'goods',
        stockQuantity: {
          lte: prisma.raw('minStockLevel'),
        },
      },
      orderBy: {
        stockQuantity: 'asc',
      },
    })

    return { success: true, data: products }
  } catch (error) {
    console.error('Error fetching low stock products:', error)
    return { success: false, error: 'Failed to fetch low stock products' }
  }
}

