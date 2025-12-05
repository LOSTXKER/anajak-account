# MVP Scope Definition (Minimum Viable Product)

กำหนดขอบเขตการพัฒนา Phase แรก เพื่อให้ Launch ได้เร็วที่สุด

---

## 🎯 MVP Goals

### Primary Goals
1. ✅ ผู้ใช้สามารถ **ลงทะเบียนและเริ่มใช้งาน** ได้ภายใน 5 นาที
2. ✅ ผู้ใช้สามารถ **ออกใบเสนอราคา → ใบแจ้งหนี้ → ใบเสร็จ** ได้ครบ Flow
3. ✅ ผู้ใช้สามารถ **บันทึกค่าใช้จ่าย** และดู **กำไรขาดทุน** เบื้องต้นได้
4. ✅ ผู้ใช้สามารถ **ออกใบกำกับภาษี** และดู **รายงานภาษี** ได้

### Success Metrics
- 🎯 Time to First Invoice: < 10 minutes
- 🎯 User Registration to Onboarding Complete: < 5 minutes
- 🎯 Core Task Completion Rate: > 90%

---

## ✅ Phase 1: MVP Features (Week 1-8)

### 1. 🔐 Authentication & Onboarding

| Feature | Priority | Status |
|---------|----------|--------|
| User Registration | P0 | 📋 TODO |
| Email Verification | P0 | 📋 TODO |
| Login / Logout | P0 | 📋 TODO |
| Forgot Password | P1 | 📋 TODO |
| Company Setup Wizard | P0 | 📋 TODO |
| - ถามประเภทธุรกิจ | P0 | 📋 TODO |
| - ตั้งค่าข้อมูลบริษัท | P0 | 📋 TODO |
| - สร้างผังบัญชีอัตโนมัติ | P0 | 📋 TODO |

### 2. 📇 Contacts (ลูกค้า/Vendor)

| Feature | Priority | Status |
|---------|----------|--------|
| รายการลูกค้า/Vendor | P0 | 📋 TODO |
| สร้าง/แก้ไข/ลบ Contact | P0 | 📋 TODO |
| ค้นหา/กรอง | P0 | 📋 TODO |
| ที่อยู่หลายแห่ง | P1 | 📋 TODO |
| Import จาก Excel | P2 | 📋 TODO |

### 3. 📦 Products & Services

| Feature | Priority | Status |
|---------|----------|--------|
| รายการสินค้า/บริการ | P0 | 📋 TODO |
| สร้าง/แก้ไข/ลบ Product | P0 | 📋 TODO |
| หมวดหมู่สินค้า | P1 | 📋 TODO |
| ราคาขาย/ราคาซื้อ | P0 | 📋 TODO |
| Import จาก Excel | P2 | 📋 TODO |

### 4. 📄 Sales Documents (เอกสารขาย)

| Feature | Priority | Status |
|---------|----------|--------|
| **ใบเสนอราคา (Quotation)** | | |
| - สร้าง/แก้ไข/ลบ | P0 | 📋 TODO |
| - Preview PDF | P0 | 📋 TODO |
| - ส่ง Email | P1 | 📋 TODO |
| - Convert เป็น Invoice | P0 | 📋 TODO |
| **ใบแจ้งหนี้/ใบกำกับภาษี (Invoice)** | | |
| - สร้าง/แก้ไข/ลบ | P0 | 📋 TODO |
| - Preview PDF | P0 | 📋 TODO |
| - ส่ง Email | P1 | 📋 TODO |
| - รายงานภาษีขาย | P0 | 📋 TODO |
| **ใบเสร็จรับเงิน (Receipt)** | | |
| - สร้างจาก Invoice | P0 | 📋 TODO |
| - บันทึกการรับชำระ | P0 | 📋 TODO |

### 5. 📄 Purchase/Expense Documents

| Feature | Priority | Status |
|---------|----------|--------|
| **ค่าใช้จ่าย (Expense)** | | |
| - บันทึกค่าใช้จ่าย | P0 | 📋 TODO |
| - เลือกหมวดหมู่ | P0 | 📋 TODO |
| - แนบไฟล์/รูปบิล | P1 | 📋 TODO |
| - ภาษีซื้อ | P0 | 📋 TODO |
| - หัก ณ ที่จ่าย | P1 | 📋 TODO |
| **ใบสำคัญจ่าย (Payment)** | | |
| - จ่ายชำระเจ้าหนี้ | P1 | 📋 TODO |

### 6. 💰 Payments

| Feature | Priority | Status |
|---------|----------|--------|
| บันทึกรับเงิน | P0 | 📋 TODO |
| บันทึกจ่ายเงิน | P1 | 📋 TODO |
| เลือกช่องทาง (เงินสด/โอน) | P0 | 📋 TODO |
| ตัดยอดลูกหนี้/เจ้าหนี้ | P0 | 📋 TODO |

### 7. 📒 Chart of Accounts

| Feature | Priority | Status |
|---------|----------|--------|
| ผังบัญชีเริ่มต้น | P0 | 📋 TODO |
| ดูรายการบัญชี | P0 | 📋 TODO |
| เพิ่ม/แก้ไขบัญชี | P1 | 📋 TODO |

### 8. 📊 Reports (Basic)

| Feature | Priority | Status |
|---------|----------|--------|
| **Dashboard** | | |
| - ยอดขายวันนี้/เดือนนี้ | P0 | 📋 TODO |
| - ลูกหนี้ค้างชำระ | P0 | 📋 TODO |
| - เจ้าหนี้ที่ต้องจ่าย | P1 | 📋 TODO |
| **Financial Reports** | | |
| - งบกำไรขาดทุน (P&L) | P0 | 📋 TODO |
| - งบทดลอง | P1 | 📋 TODO |
| **Tax Reports** | | |
| - รายงานภาษีขาย | P0 | 📋 TODO |
| - รายงานภาษีซื้อ | P0 | 📋 TODO |

### 9. ⚙️ Settings

| Feature | Priority | Status |
|---------|----------|--------|
| ข้อมูลบริษัท | P0 | 📋 TODO |
| อัปโหลด Logo | P1 | 📋 TODO |
| รูปแบบเลขเอกสาร | P1 | 📋 TODO |

---

## ❌ NOT in MVP (Phase 2+)

| Feature | Phase | Reason |
|---------|-------|--------|
| Multi-company | Phase 2 | ซับซ้อน |
| Inventory/Stock | Phase 2 | ต้องมี Core ก่อน |
| Payroll | Phase 3 | ขอบเขตใหญ่ |
| Bank Reconciliation | Phase 2 | ต้องมี Integration |
| Approval Workflow | Phase 2 | Advanced feature |
| Multi-user/Roles | Phase 2 | ซับซ้อน |
| API/Webhooks | Phase 2 | ต้องมี Core ก่อน |
| Mobile App | Phase 3 | ทำ Web ก่อน |
| AI Features | Phase 3 | Nice to have |
| E-Commerce Integration | Phase 3 | Integration |

---

## 🏗️ Technical Architecture (MVP)

### Tech Stack (Simplified for MVP)

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 14 (App Router) + TypeScript + Tailwind CSS        │
│  + shadcn/ui (Component Library)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│  Next.js API Routes (or NestJS if prefer separation)        │
│  + Prisma ORM + PostgreSQL                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE                              │
│  PostgreSQL (Supabase or Railway or Neon)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        STORAGE                               │
│  Supabase Storage or AWS S3 (for file attachments)          │
└─────────────────────────────────────────────────────────────┘
```

### Recommended Stack for MVP

| Layer | Technology | Reason |
|-------|------------|--------|
| **Frontend** | Next.js 14 | Full-stack, Fast, SEO-ready |
| **UI Library** | shadcn/ui + Tailwind | Beautiful, Customizable |
| **State** | TanStack Query + Zustand | Simple, Powerful |
| **Forms** | React Hook Form + Zod | Type-safe validation |
| **Backend** | Next.js API Routes | Same codebase, Simple deploy |
| **ORM** | Prisma | Type-safe, Easy migrations |
| **Database** | PostgreSQL (Supabase) | Free tier, Built-in auth |
| **Auth** | NextAuth.js or Supabase Auth | Easy setup |
| **Storage** | Supabase Storage | Integrated with DB |
| **PDF** | React-PDF or Puppeteer | Document generation |
| **Email** | Resend or SendGrid | Transactional emails |
| **Deploy** | Vercel | Easy, Auto-scaling |

---

## 📅 Development Timeline (8 Weeks)

### Week 1-2: Foundation
- [ ] Project setup (Next.js, Prisma, Supabase)
- [ ] Database schema migration
- [ ] Authentication (Register, Login)
- [ ] Company setup wizard
- [ ] Basic layout & navigation

### Week 3-4: Master Data
- [ ] Contacts CRUD
- [ ] Products CRUD
- [ ] Chart of Accounts (pre-populated)
- [ ] Company settings

### Week 5-6: Documents
- [ ] Quotation CRUD + PDF
- [ ] Invoice CRUD + PDF
- [ ] Receipt CRUD + PDF
- [ ] Expense CRUD
- [ ] Document conversion (QT → INV → RC)

### Week 7: Payments & Reports
- [ ] Payment recording
- [ ] Dashboard
- [ ] P&L Report
- [ ] VAT Reports

### Week 8: Polish & Launch
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] User testing
- [ ] Documentation
- [ ] Deploy to production

---

## 📁 Project Structure

```
account/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages (login, register)
│   │   ├── (dashboard)/        # Protected pages
│   │   │   ├── dashboard/
│   │   │   ├── contacts/
│   │   │   ├── products/
│   │   │   ├── documents/
│   │   │   │   ├── quotations/
│   │   │   │   ├── invoices/
│   │   │   │   ├── receipts/
│   │   │   │   └── expenses/
│   │   │   ├── payments/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── api/                # API Routes
│   │   │   ├── auth/
│   │   │   ├── contacts/
│   │   │   ├── products/
│   │   │   ├── documents/
│   │   │   └── reports/
│   │   └── layout.tsx
│   │
│   ├── components/             # React Components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── forms/              # Form components
│   │   ├── tables/             # Data tables
│   │   ├── documents/          # Document viewers/editors
│   │   └── layout/             # Layout components
│   │
│   ├── lib/                    # Utilities
│   │   ├── prisma.ts           # Prisma client
│   │   ├── auth.ts             # Auth utilities
│   │   ├── pdf.ts              # PDF generation
│   │   └── utils.ts            # Helper functions
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── use-contacts.ts
│   │   ├── use-documents.ts
│   │   └── use-auth.ts
│   │
│   ├── types/                  # TypeScript types
│   │   ├── contact.ts
│   │   ├── document.ts
│   │   └── index.ts
│   │
│   └── styles/                 # Global styles
│       └── globals.css
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Database migrations
│   └── seed.ts                 # Seed data
│
├── public/                     # Static files
│   └── templates/              # Document templates
│
├── .env.local                  # Environment variables
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🚀 Quick Start Commands

```bash
# 1. Create project
npx create-next-app@latest account --typescript --tailwind --eslint --app --src-dir

# 2. Install dependencies
cd account
npm install prisma @prisma/client
npm install @tanstack/react-query zustand
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react clsx tailwind-merge
npm install @react-pdf/renderer
npm install next-auth
npm install resend

# 3. Setup shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input label card table dialog form

# 4. Setup Prisma
npx prisma init
# Edit schema.prisma
npx prisma migrate dev --name init
npx prisma db seed

# 5. Run development
npm run dev
```

---

## 📋 MVP Checklist

### Before Launch
- [ ] All P0 features working
- [ ] Mobile responsive
- [ ] Error handling
- [ ] Loading states
- [ ] Basic validation
- [ ] Thai language support
- [ ] PDF generation working
- [ ] Email sending working

### Launch Criteria
- [ ] 10 beta users tested
- [ ] No critical bugs
- [ ] Performance acceptable (< 3s load time)
- [ ] Data backup configured
- [ ] SSL certificate configured
- [ ] Domain configured

---

## 💰 MVP Cost Estimation

### Free Tier (Good for MVP testing)
| Service | Free Tier |
|---------|-----------|
| Vercel | 100GB bandwidth, Unlimited deploys |
| Supabase | 500MB DB, 1GB Storage, 50K MAU |
| Resend | 3,000 emails/month |
| **Total** | **$0/month** |

### Production (Small Scale)
| Service | Cost |
|---------|------|
| Vercel Pro | $20/month |
| Supabase Pro | $25/month |
| Resend | $20/month |
| Domain | $12/year |
| **Total** | **~$65/month** |

---

## 🎯 Next Steps

1. **Project Setup** - สร้างโปรเจค Next.js
2. **Database Setup** - สร้าง Prisma Schema
3. **Auth Setup** - ทำระบบ Login/Register
4. **Core Features** - ทำ Contacts, Products, Documents
5. **Reports** - ทำ Dashboard และ Reports
6. **Polish** - ทำให้สวยและใช้งานง่าย
7. **Launch!** 🚀

---

พร้อมเริ่มเขียนโค้ดเลยไหมครับ? 💪

