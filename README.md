# 💼 Account Pro - ระบบบัญชีมืออาชีพ

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

ระบบบัญชีครบวงจรสำหรับธุรกิจ SME ในประเทศไทย 🇹🇭

[Live Demo](#) | [Documentation](./docs) | [Deployment Guide](./DEPLOYMENT_GUIDE.md)

---

## ✨ Features

### 🎯 Core Features
- ✅ **Authentication** - Login/Register with JWT
- ✅ **Multi-tenant** - รองรับหลายบริษัท
- ✅ **Master Data** - ลูกค้า, คู่ค้า, สินค้า/บริการ
- ✅ **Document Management** - ใบเสนอราคา, ใบแจ้งหนี้, ใบเสร็จ, PO, Bill
- ✅ **Payment Tracking** - รับ-จ่ายเงิน + Link เอกสาร
- ✅ **Accounting** - ผังบัญชี, บันทึกบัญชีคู่
- ✅ **Financial Reports** - งบทดลอง, งบดุล, กำไรขาดทุน

### 🚀 Advanced Features
- ✅ **Document Conversion** - แปลง Quote→Invoice→Receipt ใน 1 คลิก
- ✅ **Email Integration** - ส่งเอกสารทางอีเมลอัตโนมัติ
- ✅ **Inventory Tracking** - ตัดสต็อกอัตโนมัติ
- ✅ **Tax Reports** - รายงานภาษี ภ.พ.30, VAT Input/Output
- ✅ **Bank Reconciliation** - กระทบยอดธนาคาร + Auto-match
- ✅ **Recurring Invoices** - ออกบิลซ้ำอัตโนมัติ
- ✅ **Fixed Assets** - ทรัพย์สินถาวร + ค่าเสื่อมราคา

### 🎨 UI/UX
- ✅ Professional Light Theme (Cream/Teal)
- ✅ Responsive Design
- ✅ Dashboard Analytics with Charts
- ✅ Thai Language Support
- ✅ Print-ready Documents

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React Framework (App Router)
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **Lucide Icons** - Beautiful Icons

### Backend
- **Next.js API Routes** - Backend API
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Resend** - Email Delivery

### Tools
- **ESLint** - Code Linting
- **Prettier** - Code Formatting
- **Prisma Studio** - Database GUI

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or Supabase account)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/LOSTXKER/anajak-account.git
cd anajak-account

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# 4. Setup database
npm run db:push
npm run db:seed

# 5. Start development server
npm run dev
```

เปิดเบราว์เซอร์ที่ http://localhost:3000

---

## 📦 Project Structure

```
account/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Authentication pages
│   │   ├── (dashboard)/         # Dashboard pages
│   │   │   └── dashboard/
│   │   │       ├── contacts/    # Customer/Vendor management
│   │   │       ├── products/    # Product catalog
│   │   │       ├── documents/   # Document management
│   │   │       ├── payments/    # Payment tracking
│   │   │       ├── inventory/   # Stock tracking
│   │   │       ├── accounting/  # Chart of Accounts
│   │   │       ├── reports/     # Financial reports
│   │   │       └── tax/         # Tax reports
│   │   └── api/                 # API routes (30+ endpoints)
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── dashboard/           # Dashboard components
│   │   └── documents/           # Document components
│   ├── lib/
│   │   ├── prisma.ts            # Database client
│   │   ├── email.ts             # Email functions
│   │   ├── inventory.ts         # Inventory logic
│   │   └── ...                  # More utilities
│   └── middleware.ts            # Auth middleware
├── prisma/
│   ├── schema.prisma            # Database schema (26 tables)
│   └── seed.ts                  # Seed data
└── docs/                        # Documentation
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

### Schema
- **26 Tables** covering all business needs
- Multi-tenant architecture
- Referential integrity
- Optimized indexes

---

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Master Data
- `GET/POST /api/contacts` - Customers/Vendors
- `GET/POST /api/products` - Products/Services

### Documents
- `GET/POST /api/documents` - All document types
- `POST /api/documents/[id]/convert` - Convert document
- `POST /api/documents/[id]/send-email` - Email document

### Payments
- `GET/POST /api/payments` - Payment tracking

### Tax
- `GET /api/tax/pp30` - ภ.พ.30 Report
- `GET /api/tax/vat-input` - VAT Input Report
- `GET /api/tax/vat-output` - VAT Output Report

### Inventory
- `GET/POST /api/inventory/movements` - Stock movements

### Bank
- `GET/POST /api/bank-accounts` - Bank accounts
- `POST /api/bank-accounts/[id]/reconcile` - Reconciliation

### Recurring
- `GET/POST /api/recurring-invoices` - Recurring schedules
- `POST /api/recurring-invoices/generate` - Generate invoices

### Fixed Assets
- `GET/POST /api/fixed-assets` - Asset register
- `POST /api/fixed-assets/depreciate` - Calculate depreciation

[Full API Documentation →](./docs/api_specification.md)

---

## 🌟 Highlights

### 1. ใช้งานง่าย
- UI/UX ออกแบบสำหรับคนไทย
- ไม่ต้องมีความรู้ด้านบัญชี
- Guided flow ชัดเจน

### 2. คำนวณอัตโนมัติ
- ✅ VAT 7% (ปรับได้)
- ✅ ส่วนลด (% หรือ บาท)
- ✅ หัก ณ ที่จ่าย (1%, 3%, 5%)
- ✅ ค่าเสื่อมราคา (Straight Line)

### 3. ครบวงจร
- สร้างเอกสาร → ส่งให้ลูกค้า → รับชำระเงิน → บันทึกบัญชี
- รองรับทุกประเภทเอกสาร
- Multi-tenant support

### 4. Professional
- เอกสารสวย พร้อมพิมพ์
- Auto-numbering
- Status tracking
- Email integration

---

## 📊 Statistics

- **100+** Files
- **15,000+** Lines of Code
- **26** Database Tables
- **30+** API Endpoints
- **15+** Pages
- **0** Lint Errors ✅

---

## 🔐 Environment Variables

สร้างไฟล์ `.env` และกรอกข้อมูล:

```bash
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Authentication
JWT_SECRET="your-secret-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Email (Resend - https://resend.com)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_FROM_EMAIL="Account Pro <onboarding@resend.dev>"
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Add environment variables in Vercel dashboard
# 4. Connect PostgreSQL (Supabase/Neon)
```

[Full Deployment Guide →](./DEPLOYMENT_GUIDE.md)

---

## 📖 Documentation

- [📘 System Planning](./docs/accounting_system_plan.md)
- [📗 Database Setup](./docs/database_setup.md)
- [📙 Document System](./docs/documents_system.md)
- [📕 Payment System](./docs/payment_system.md)
- [📓 New Features Guide](./docs/new_features_guide.md)
- [📔 Progress Update](./docs/progress_update.md)

---

## 🎯 Roadmap

### ✅ Phase 1: Core (Completed)
- [x] Authentication
- [x] Master Data
- [x] Documents
- [x] Payments
- [x] Accounting
- [x] Reports

### ✅ Phase 2: Advanced (Completed)
- [x] Document Conversion
- [x] Email Sending
- [x] Inventory Tracking
- [x] Tax Reports
- [x] Bank Reconciliation
- [x] Recurring Invoices
- [x] Fixed Assets

### 🔄 Phase 3: Enterprise (Future)
- [ ] Approval Workflow
- [ ] Payroll System
- [ ] Multi-Currency
- [ ] OCR Integration
- [ ] Mobile App
- [ ] AI Assistant

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

- 📧 Email: support@accountpro.com
- 💬 Discord: [Join our community](#)
- 📚 Docs: [Read the docs](./docs)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [Resend](https://resend.com/)

---

## 🏆 Features Showcase

### 📄 Document Management
![Documents](https://via.placeholder.com/800x400?text=Document+Management)

### 📊 Dashboard Analytics
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Analytics)

### 🧾 Tax Reports
![Tax](https://via.placeholder.com/800x400?text=Tax+Reports)

---

**Made with ❤️ for Thai SMEs**

ระบบบัญชีที่ออกแบบมาเพื่อธุรกิจไทยโดยเฉพาะ 🇹🇭

---

## 🎉 What's Included

- ✅ Full-featured Accounting System
- ✅ Professional UI/UX
- ✅ Tax Compliance (Thai)
- ✅ Email Integration
- ✅ Inventory Management
- ✅ Bank Reconciliation
- ✅ Automated Workflows
- ✅ Complete Documentation
- ✅ Production Ready

**Start managing your business finances today!** 🚀
