import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Account Types
  console.log('Creating account types...')
  const accountTypes = await Promise.all([
    prisma.accountType.upsert({
      where: { code: '1' },
      update: {},
      create: {
        code: '1',
        name: 'สินทรัพย์',
        nameEn: 'Assets',
        normalBalance: 'debit',
        displayOrder: 1,
      },
    }),
    prisma.accountType.upsert({
      where: { code: '2' },
      update: {},
      create: {
        code: '2',
        name: 'หนี้สิน',
        nameEn: 'Liabilities',
        normalBalance: 'credit',
        displayOrder: 2,
      },
    }),
    prisma.accountType.upsert({
      where: { code: '3' },
      update: {},
      create: {
        code: '3',
        name: 'ส่วนของผู้ถือหุ้น',
        nameEn: 'Equity',
        normalBalance: 'credit',
        displayOrder: 3,
      },
    }),
    prisma.accountType.upsert({
      where: { code: '4' },
      update: {},
      create: {
        code: '4',
        name: 'รายได้',
        nameEn: 'Revenue',
        normalBalance: 'credit',
        displayOrder: 4,
      },
    }),
    prisma.accountType.upsert({
      where: { code: '5' },
      update: {},
      create: {
        code: '5',
        name: 'ค่าใช้จ่าย',
        nameEn: 'Expenses',
        normalBalance: 'debit',
        displayOrder: 5,
      },
    }),
  ])
  console.log(`✅ Created ${accountTypes.length} account types`)

  // Create System Roles
  console.log('Creating system roles...')
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { id: '00000000-0000-0000-0000-000000000001' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'owner',
        description: 'เจ้าของบริษัท - สิทธิ์เต็ม',
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { id: '00000000-0000-0000-0000-000000000002' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000002',
        name: 'admin',
        description: 'ผู้ดูแลระบบ',
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { id: '00000000-0000-0000-0000-000000000003' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000003',
        name: 'accountant',
        description: 'นักบัญชี',
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { id: '00000000-0000-0000-0000-000000000004' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000004',
        name: 'sales',
        description: 'ฝ่ายขาย',
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { id: '00000000-0000-0000-0000-000000000005' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000005',
        name: 'purchasing',
        description: 'ฝ่ายจัดซื้อ',
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { id: '00000000-0000-0000-0000-000000000006' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000006',
        name: 'hr',
        description: 'ฝ่ายบุคคล',
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { id: '00000000-0000-0000-0000-000000000007' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000007',
        name: 'viewer',
        description: 'ดูอย่างเดียว',
        isSystem: true,
      },
    }),
  ])
  console.log(`✅ Created ${roles.length} system roles`)

  // Create Document Types
  console.log('Creating document types...')
  const documentTypes = await Promise.all([
    // Sales
    prisma.documentType.upsert({
      where: { code: 'quotation' },
      update: {},
      create: {
        code: 'quotation',
        name: 'ใบเสนอราคา',
        nameEn: 'Quotation',
        category: 'sales',
        canConvertTo: ['invoice', 'sales_order'],
        displayOrder: 1,
      },
    }),
    prisma.documentType.upsert({
      where: { code: 'invoice' },
      update: {},
      create: {
        code: 'invoice',
        name: 'ใบแจ้งหนี้/ใบกำกับภาษี',
        nameEn: 'Invoice/Tax Invoice',
        category: 'sales',
        canConvertTo: ['receipt'],
        displayOrder: 3,
      },
    }),
    prisma.documentType.upsert({
      where: { code: 'receipt' },
      update: {},
      create: {
        code: 'receipt',
        name: 'ใบเสร็จรับเงิน',
        nameEn: 'Receipt',
        category: 'sales',
        canConvertTo: [],
        displayOrder: 4,
      },
    }),
    prisma.documentType.upsert({
      where: { code: 'credit_note' },
      update: {},
      create: {
        code: 'credit_note',
        name: 'ใบลดหนี้',
        nameEn: 'Credit Note',
        category: 'sales',
        canConvertTo: [],
        displayOrder: 5,
      },
    }),
    // Purchase
    prisma.documentType.upsert({
      where: { code: 'purchase_order' },
      update: {},
      create: {
        code: 'purchase_order',
        name: 'ใบสั่งซื้อ',
        nameEn: 'Purchase Order',
        category: 'purchase',
        canConvertTo: ['purchase_invoice'],
        displayOrder: 11,
      },
    }),
    prisma.documentType.upsert({
      where: { code: 'purchase_invoice' },
      update: {},
      create: {
        code: 'purchase_invoice',
        name: 'บันทึกซื้อ',
        nameEn: 'Purchase Invoice',
        category: 'purchase',
        canConvertTo: ['payment'],
        displayOrder: 13,
      },
    }),
    prisma.documentType.upsert({
      where: { code: 'payment' },
      update: {},
      create: {
        code: 'payment',
        name: 'ใบสำคัญจ่าย',
        nameEn: 'Payment Voucher',
        category: 'purchase',
        canConvertTo: [],
        displayOrder: 14,
      },
    }),
    prisma.documentType.upsert({
      where: { code: 'expense' },
      update: {},
      create: {
        code: 'expense',
        name: 'ค่าใช้จ่าย',
        nameEn: 'Expense',
        category: 'purchase',
        canConvertTo: [],
        displayOrder: 20,
      },
    }),
  ])
  console.log(`✅ Created ${documentTypes.length} document types`)

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

