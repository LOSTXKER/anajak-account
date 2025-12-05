# 💼 Account Pro - ระบบบัญชีมืออาชีพ

ระบบบัญชีครบวงจรสำหรับธุรกิจ SME ในประเทศไทย

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+ (หรือใช้ Supabase)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env
# แก้ไข DATABASE_URL และ NEXTAUTH_SECRET

# 3. Push database schema
npm run db:push

# 4. Seed initial data
npm run db:seed

# 5. Start development server
npm run dev
```

เปิดเบราว์เซอร์ที่ http://localhost:3000

---

## 📦 Features Completed

### ✅ Phase 1: Authentication & Setup
- [x] User Registration
- [x] Login/Logout
- [x] JWT Authentication
- [x] Multi-tenant Support
- [x] Dashboard Layout

### ✅ Phase 2: Master Data
- [x] Customer/Vendor Management (Contacts)
- [x] Product/Service Catalog
- [x] Dashboard Overview

### ✅ Phase 3: Document Management System 🎉
- [x] **Document List** - Filter, Search, Stats
- [x] **Create Documents** - Quotation, Invoice, Receipt, PO, Bill
- [x] **Line Items** - Multiple products per document
- [x] **Auto Calculation** - VAT 7%, Discount, Withholding Tax
- [x] **Document Preview** - Professional layout
- [x] **Print Support** - Print-ready CSS
- [x] **API Routes** - Full CRUD operations
- [x] **Auto Numbering** - QT2025-0001, IV2025-0001, etc.

**เอกสารที่รองรับ:**
- 📋 ใบเสนอราคา (Quotation)
- 📄 ใบแจ้งหนี้/ใบกำกับภาษี (Tax Invoice)
- 🧾 ใบเสร็จรับเงิน (Receipt)
- 📝 ใบสั่งซื้อ (Purchase Order)
- 💸 ใบวางบิล (Bill)

---

## 🎯 Current Status

**✅ ทำเสร็จแล้ว:**
1. Authentication System
2. Dashboard Layout
3. Master Data (Contacts, Products) - UI พร้อม
4. **Document Management - ครบทุกอย่าง!**

**⏳ กำลังทำ:**
- เชื่อม Contacts/Products กับ API จริง
- PDF Export
- Email Sending

**📋 แผนต่อไป:**
- Payment Management (รับ-จ่ายเงิน)
- Journal Entry (บันทึกบัญชี)
- Reports (งบการเงิน)

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React Framework (App Router)
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **Lucide Icons** - Icons

### Backend
- **Next.js API Routes** - Backend API
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database (Supabase)
- **JWT** - Authentication

### Tools
- **ESLint** - Linting
- **Prettier** - Code Formatting
- **Prisma Studio** - Database GUI

---

## 📁 Project Structure

```
account/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Auth pages (login, register)
│   │   ├── (dashboard)/      # Dashboard pages
│   │   │   └── dashboard/
│   │   │       ├── page.tsx           # Dashboard overview
│   │   │       ├── contacts/          # Contacts management
│   │   │       ├── products/          # Products management
│   │   │       └── documents/         # Document management ✨
│   │   │           ├── page.tsx       # Document list
│   │   │           ├── new/           # Create document
│   │   │           └── [id]/          # View/Edit document
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Auth endpoints
│   │   │   ├── contacts/     # Contacts CRUD
│   │   │   ├── products/     # Products CRUD
│   │   │   └── documents/    # Documents CRUD ✨
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── dashboard/        # Dashboard components
│   │   └── documents/        # Document components ✨
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client
│   │   └── utils.ts          # Utilities
│   └── middleware.ts         # Auth middleware
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
├── docs/
│   ├── accounting_system_plan.md    # System planning
│   ├── database_setup.md            # DB setup guide
│   └── documents_system.md          # Document system docs ✨
└── package.json
```

---

## 🗄 Database

### Commands

```bash
# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed

# Open Prisma Studio (GUI)
npm run db:studio

# Generate Prisma Client
npm run db:generate
```

### Tables (26 tables)
- Users & Auth
- Companies (Multi-tenant)
- Contacts (Customers/Vendors)
- Products & Categories
- **Documents & Line Items** ✨
- Payments
- Journal Entries
- Tax & Payroll
- And more...

---

## 🧪 Testing

### Test Document System

1. **Login** - http://localhost:3000/login
2. **Go to Documents** - http://localhost:3000/dashboard/documents
3. **Create New Document**:
   - Click "สร้างเอกสารใหม่"
   - Select "ใบเสนอราคา"
   - Fill in customer, products, etc.
   - See live calculation
   - Save as draft or send
4. **View Document** - Click on any document
5. **Print** - Click "พิมพ์" button

---

## 🌟 Highlights

### 1. **ใช้งานง่าย**
- UI/UX ออกแบบมาเพื่อคนไทย
- ไม่ต้องมีความรู้ด้านบัญชี
- Guided flow ชัดเจน

### 2. **คำนวณอัตโนมัติ**
- VAT 7% (ปรับได้)
- ส่วนลด (% หรือ บาท)
- หัก ณ ที่จ่าย (1%, 3%, 5%)
- Live preview ยอดเงิน

### 3. **ครบวงจร**
- สร้างเอกสาร → ส่งให้ลูกค้า → รับชำระเงิน → บันทึกบัญชี
- รองรับทุกประเภทเอกสาร
- Multi-tenant (รองรับหลาย company)

### 4. **Professional**
- เอกสารดูสวย พร้อมพิมพ์
- Auto-numbering
- Status tracking

---

## 📚 Documentation

- [System Planning](./docs/accounting_system_plan.md) - แผนระบบทั้งหมด
- [Database Setup](./docs/database_setup.md) - Setup database
- [Document System](./docs/documents_system.md) - Document management docs

---

## 🔐 Default Credentials

สร้าง account ใหม่ที่หน้า Register หรือใช้ account ที่สร้างไว้แล้ว

---

## 📞 Support

มีปัญหา? เปิด Issue ใน GitHub หรือติดต่อทีมพัฒนา

---

## 📝 License

MIT License - ใช้งานได้ฟรี

---

## 🎉 What's Next?

**Coming Soon:**
1. PDF Export (react-pdf)
2. Email Sending (Resend / SendGrid)
3. Document Conversion (Quote → Invoice)
4. Payment Management
5. Bank Reconciliation
6. Financial Reports

**Future:**
- Mobile App (React Native)
- AI-powered Accounting Assistant
- E-Tax Filing (ยื่นภาษีอัตโนมัติ)
- Open Banking Integration

---

**Made with ❤️ for Thai SMEs**

ระบบบัญชีที่ออกแบบมาเพื่อธุรกิจไทยโดยเฉพาะ 🇹🇭
