import { prisma } from './prisma'

export interface StockMovement {
  productId: string
  type: 'in' | 'out' | 'adjust'
  quantity: number
  reference?: string
  documentId?: string
  notes?: string
}

export async function createStockMovement(
  companyId: string,
  movement: StockMovement
) {
  // Note: This is a placeholder since InventoryMovement table doesn't exist yet
  // Update product stock directly
  const { productId, type, quantity } = movement

  const product = await prisma.product.findFirst({
    where: { id: productId, companyId },
  })

  if (!product) {
    throw new Error('Product not found')
  }

  const currentStock = Number(product.stockQuantity) || 0
  let newStock = currentStock

  if (type === 'in' || type === 'adjust') {
    newStock = currentStock + quantity
  } else if (type === 'out') {
    newStock = currentStock - quantity
  }

  await prisma.product.update({
    where: { id: productId },
    data: { stockQuantity: newStock },
  })

  console.log(`✅ Stock updated: ${product.name} (${currentStock} → ${newStock})`)

  return {
    productId,
    oldStock: currentStock,
    newStock,
    quantity,
    type,
  }
}

export async function processDocumentStockMovements(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      documentType: true,
      lines: true,
    },
  })

  if (!document) {
    throw new Error('Document not found')
  }

  // Only process for sales/purchase documents
  if (!['sales', 'purchase'].includes(document.documentType.category)) {
    return
  }

  const movementType = document.documentType.category === 'sales' ? 'out' : 'in'

  for (const line of document.lines) {
    if (line.productId) {
      await createStockMovement(document.companyId, {
        productId: line.productId,
        type: movementType,
        quantity: Number(line.quantity),
        reference: document.documentNumber,
        documentId: document.id,
        notes: `Auto from ${document.documentType.name}`,
      })
    }
  }

  console.log(`✅ Processed stock movements for document: ${document.documentNumber}`)
}

