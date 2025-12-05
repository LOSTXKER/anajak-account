# 🚀 เริ่มใช้งาน Account Pro!

## ✅ ระบบพร้อมแล้ว!

เปิดเบราว์เซอร์แล้วให้คุณ! 🎉

**URL:** http://localhost:3000

---

## 🎯 ทำตามนี้เลย!

### 1️⃣ สมัครสมาชิก (1 นาที)

1. หน้าแรก → คลิก **"สมัครสมาชิก"**
2. กรอกข้อมูล:

```
ชื่อบริษัท:       บริษัท ทดสอบ จำกัด
เลขผู้เสียภาษี:   0123456789012
ชื่อ:             ทดสอบ
นามสกุล:          ระบบ
Email:            test@example.com
รหัสผ่าน:         test1234
```

3. คลิก **"สมัครสมาชิก"**
4. **Login อัตโนมัติ!** 🎉

---

### 2️⃣ ทดสอบระบบ (5 นาที)

#### สร้างลูกค้า
- ไปที่: **ผู้ติดต่อ** → **เพิ่มลูกค้า**
- กรอกข้อมูล → **บันทึก**

#### สร้างสินค้า
- ไปที่: **สินค้า** → **เพิ่มสินค้า**
- กรอกข้อมูล → **บันทึก**

#### สร้างใบเสนอราคา
- ไปที่: **เอกสาร** → **สร้างเอกสาร**
- เลือก: **ใบเสนอราคา**
- เลือกลูกค้า → เพิ่มสินค้า → **บันทึก**

#### แปลงเป็นใบแจ้งหนี้
- เปิดใบเสนอราคาที่สร้าง
- คลิก **"แปลงเป็นใบแจ้งหนี้"**
- **สำเร็จ!** 🎉

#### บันทึกรับเงิน
- ไปที่: **การเงิน** → **รับเงิน**
- เลือกใบแจ้งหนี้ → กรอกจำนวนเงิน → **บันทึก**

#### ดูรายงาน
- ไปที่: **รายงาน**
- ดู: งบทดลอง, งบดุล, กำไรขาดทุน

---

## 📊 Features ทั้งหมด

### ✅ Master Data
- ✅ ลูกค้า/คู่ค้า
- ✅ สินค้า/บริการ

### ✅ Documents (6 ประเภท)
- ✅ ใบเสนอราคา (Quotation)
- ✅ ใบแจ้งหนี้/ใบกำกับภาษี (Invoice)
- ✅ ใบเสร็จรับเงิน (Receipt)
- ✅ ใบสั่งซื้อ (Purchase Order)
- ✅ ใบวางบิล (Bill)
- ✅ แปลงเอกสารอัตโนมัติ
- ✅ ส่งอีเมล
- ✅ พิมพ์ PDF

### ✅ Payments
- ✅ รับเงิน
- ✅ จ่ายเงิน
- ✅ ติดตามการชำระ

### ✅ Inventory
- ✅ ติดตามสต็อกอัตโนมัติ
- ✅ รายงานสต็อก

### ✅ Accounting
- ✅ ผังบัญชี
- ✅ บันทึกรายวัน

### ✅ Reports
- ✅ งบทดลอง
- ✅ งบดุล
- ✅ กำไรขาดทุน
- ✅ รายงานภาษี (ภ.พ.30)

### ✅ Advanced
- ✅ Bank Reconciliation
- ✅ Recurring Invoices
- ✅ Fixed Assets

### ✅ Dashboard
- ✅ Analytics
- ✅ Charts
- ✅ Activity Feed

---

## 🔍 ตรวจสอบ Database

### วิธีที่ 1: Prisma Studio

```bash
npm run db:studio
```

เปิดที่: http://localhost:5555

### วิธีที่ 2: Supabase Dashboard

https://supabase.com/dashboard/project/isuswhazlczolzvxwtsk/editor

---

## 💡 คำสั่งที่ใช้บ่อย

```bash
# Start server (ถ้าปิดไป)
npm run dev

# Open browser
open http://localhost:3000

# View database
npm run db:studio

# View logs
# Server กำลังรันอยู่ใน Terminal
```

---

## 🎯 การตั้งค่า

### Environment Variables
- ✅ DATABASE_URL (Supabase)
- ✅ JWT_SECRET
- ✅ NEXTAUTH_SECRET
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY

### Database
- ✅ 26 Tables
- ✅ Seeded data
- ✅ Connected to Supabase

### Server
- ✅ Running on http://localhost:3000
- ✅ Hot reload enabled
- ✅ Ready to use!

---

## 🚀 Next Steps

### 1. ทดสอบ Local
- ✅ **ทำตอนนี้!**
- ทดสอบทุก Feature
- สร้างข้อมูลจริง

### 2. Deploy to Vercel
- อ่าน: [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)
- Deploy ใน 10 นาที
- ได้ URL: `https://your-app.vercel.app`

### 3. Setup Email (Optional)
- สมัคร Resend.com
- Get API Key
- ส่งเอกสารทางอีเมล

### 4. Custom Domain (Optional)
- ซื้อโดเมน
- เชื่อมกับ Vercel
- Go Live!

---

## 📚 Documentation

- [README.md](./README.md) - Project Overview
- [QUICK_START.md](./QUICK_START.md) - Quick Setup
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database Guide
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Deploy Guide
- [FINAL_SUMMARY.md](./FINAL_SUMMARY.md) - Complete Summary

---

## 🐛 Troubleshooting

### ไม่เห็นหน้าแอพ?

```bash
# เช็คว่า server รันอยู่
lsof -ti:3000

# ถ้าไม่รัน → start ใหม่
npm run dev

# เปิด browser
open http://localhost:3000
```

### Error: Cannot connect to database

```bash
# ตรวจสอบ .env
cat .env | grep DATABASE_URL

# ควรเห็น:
# DATABASE_URL="postgresql://postgres:Bestlxk007@db.isuswhazlczolzvxwtsk.supabase.co:6543/postgres?pgbouncer=true"
```

### ลืม Password

```bash
# ไม่มีปัญหา! สมัครใหม่ได้
# Email: test2@example.com
```

---

## 🎊 Ready!

**ระบบพร้อมใช้งาน 100%!**

### ✅ ที่ทำเสร็จแล้ว:
- ✅ Supabase Database
- ✅ Environment Setup
- ✅ Database Schema (26 tables)
- ✅ Seed Data
- ✅ Development Server
- ✅ Browser Opened

### 🎯 ทำตอนนี้:
1. สมัครสมาชิก
2. Login
3. สร้างข้อมูล
4. ทดสอบระบบ
5. สนุก! 🎉

---

**🚀 Let's Go!**

**URL:** http://localhost:3000

Made with ❤️ for Account Pro 🇹🇭

