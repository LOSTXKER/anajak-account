# 🗄️ Supabase Setup Guide - ทีละขั้นตอน

## 📋 ภาพรวม

Supabase คือ PostgreSQL Database แบบ Cloud ที่:
- ✅ **ฟรี** - 500MB Database + 1GB Storage
- ✅ **ง่าย** - Setup ใน 5 นาที
- ✅ **เร็ว** - Server ใกล้เมืองไทย (Singapore)
- ✅ **ปลอดภัย** - Auto backup ทุกวัน

---

## 🚀 ขั้นตอนที่ 1: สร้าง Supabase Account (2 นาที)

### 1.1 เข้าเว็บไซต์

1. เปิดเบราว์เซอร์ไปที่: **https://supabase.com**
2. คลิกปุ่ม **"Start your project"** (สีเขียว)

### 1.2 Sign Up

เลือก 1 ใน 3 วิธี:

**Option 1: ใช้ GitHub (แนะนำ!)**
- คลิก **"Continue with GitHub"**
- Authorize Supabase
- เสร็จ!

**Option 2: ใช้ Email**
- กรอก Email
- ตรวจสอบ Email → คลิกลิงก์ Verify
- เสร็จ!

**Option 3: ใช้ Google**
- คลิก **"Continue with Google"**
- เลือก Google Account
- เสร็จ!

### 1.3 Verify Email (ถ้าใช้ Email)

1. เปิด Email
2. หา Email จาก Supabase
3. คลิก **"Confirm your mail"**
4. กลับไปหน้า Supabase

✅ **มี Account แล้ว!**

---

## 🏗️ ขั้นตอนที่ 2: สร้าง Project (3 นาที)

### 2.1 Create New Project

หลัง Login จะเห็นหน้า Dashboard:

1. คลิกปุ่ม **"New Project"** (สีเขียว)
2. เลือก **Organization** (ถ้ายังไม่มี ให้สร้างก่อน)

### 2.2 กรอกข้อมูล Project

| Field | ค่าที่กรอก | หมายเหตุ |
|-------|-----------|----------|
| **Name** | `anajak-account-db` | ชื่ออะไรก็ได้ |
| **Database Password** | `สร้างรหัสผ่าน` | **จำไว้ให้ดี!** |
| **Region** | `Southeast Asia (Singapore)` | ใกล้ไทยสุด |
| **Pricing Plan** | `Free` | ฟรี 500MB |

**ตัวอย่างรหัสผ่าน:**
```
MySecurePass2024!@#
```

**⚠️ สำคัญ:** 
- จด/คัดลอกรหัสผ่านไว้ที่ปลอดภัย
- จะใช้ในขั้นตอนต่อไป
- **ถ้าลืม ต้องสร้าง Project ใหม่!**

### 2.3 สร้าง Project

1. คลิก **"Create new project"** (สีเขียว)
2. รอ ~2-3 นาที (Supabase กำลังสร้าง Database)
3. เห็นหน้า Dashboard → **สำเร็จ!** 🎉

✅ **มี Database แล้ว!**

---

## 🔗 ขั้นตอนที่ 3: Get Connection String (2 นาที)

### 3.1 เข้าหน้า Database Settings

1. ที่ Sidebar ซ้าย → คลิก **⚙️ Settings**
2. คลิก **"Database"** (ใน Settings)
3. Scroll ลงหา **"Connection string"**

### 3.2 เลือก URI Mode

ที่ **Connection string** มี Tabs หลายแบบ:

1. คลิก Tab **"URI"** (ไม่ใช่ Session หรือ Transaction!)
2. เห็น String แบบนี้:

```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

### 3.3 Copy & แก้ไข

1. **คลิก Copy** (ปุ่มด้านขวา)
2. Paste ลงใน Text Editor (Notepad/VSCode)
3. **แก้ไข 2 จุด:**

**ก่อนแก้:**
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

**หลังแก้:**
```
postgresql://postgres.xxxxx:MySecurePass2024!@#@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**สิ่งที่ต้องแก้:**
1. ✏️ `[YOUR-PASSWORD]` → เปลี่ยนเป็นรหัสผ่านจริง (จากขั้นที่ 2)
2. ✏️ `:5432` → เปลี่ยนเป็น `:6543`
3. ✏️ เพิ่ม `?pgbouncer=true` ท้ายสุด

### 3.4 ตัวอย่าง Final String

**ตัวอย่างที่ถูกต้อง:**
```
postgresql://postgres.abcdefghijk:MySecurePass2024!@#@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**✅ เก็บไว้! จะใช้ในขั้นต่อไป**

---

## 💻 ขั้นตอนที่ 4: Setup ใน Local (3 นาที)

### 4.1 สร้างไฟล์ `.env`

เปิด Terminal:

```bash
cd /Users/lostxker/Desktop/dev/account
touch .env
```

หรือสร้างด้วย VSCode:
- คลิกขวาที่ Folder
- New File → `.env`

### 4.2 เพิ่ม Environment Variables

เปิดไฟล์ `.env` แล้วเพิ่ม:

```bash
# Database
DATABASE_URL="postgresql://postgres.xxxxx:MySecurePass2024!@#@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Authentication (Generate ด้านล่าง)
JWT_SECRET="YOUR_JWT_SECRET_HERE"
NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET_HERE"
NEXTAUTH_URL="http://localhost:3000"

# Email (Optional)
RESEND_API_KEY=""
RESEND_FROM_EMAIL="Account Pro <onboarding@resend.dev>"
```

**⚠️ สำคัญ:**
- แทนที่ `DATABASE_URL` ด้วย Connection String จริง
- **อย่า Commit `.env` ขึ้น GitHub!** (มีใน `.gitignore` อยู่แล้ว)

### 4.3 Generate JWT Secrets

เปิด Terminal ใหม่:

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# คัดลอกผลลัพธ์ → ใส่ใน JWT_SECRET

# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# คัดลอกผลลัพธ์ → ใส่ใน NEXTAUTH_SECRET
```

**ตัวอย่างผลลัพธ์:**
```
xK8nV2mP5wQ9rT3sA1bC6dE7fG4hI0jL/MNO+PQR==
```

### 4.4 ตัวอย่าง `.env` ที่สมบูรณ์

```bash
DATABASE_URL="postgresql://postgres.abcd:MyPass123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
JWT_SECRET="xK8nV2mP5wQ9rT3sA1bC6dE7fG4hI0jL/MNO+PQR=="
NEXTAUTH_SECRET="yL9oW3nQ6xR0tU4tB2cD7eF8gH5iJ1kM/NOP+QRS=="
NEXTAUTH_URL="http://localhost:3000"
```

✅ **Environment Variables พร้อม!**

---

## 🏗️ ขั้นตอนที่ 5: Push Database Schema (2 นาที)

### 5.1 Generate Prisma Client

```bash
cd /Users/lostxker/Desktop/dev/account
npm run db:generate
```

**ควรเห็น:**
```
✔ Generated Prisma Client
```

### 5.2 Push Schema to Supabase

```bash
npm run db:push
```

**ควรเห็น:**
```
🚀  Your database is now in sync with your Prisma schema.
```

**ระหว่างรัน Prisma จะ:**
- สร้างตารางทั้งหมด (26 tables)
- สร้าง Relations
- สร้าง Indexes
- Setup Constraints

**⏱️ ใช้เวลา ~30 วินาที**

### 5.3 Seed ข้อมูลเริ่มต้น

```bash
npm run db:seed
```

**ควรเห็น:**
```
✅ Seeded 5 account types
✅ Seeded 3 roles
✅ Seeded 7 document types
🎉 Database seeded successfully!
```

✅ **Database พร้อมใช้งาน!**

---

## ✅ ขั้นตอนที่ 6: Verify Database (2 นาที)

### 6.1 เปิด Prisma Studio (วิธีที่ 1)

```bash
npm run db:studio
```

จะเปิดเบราว์เซอร์ที่ http://localhost:5555

**ตรวจสอบ:**
- ✅ เห็นตาราง `AccountType` (5 rows)
- ✅ เห็นตาราง `Role` (3 rows)
- ✅ เห็นตาราง `DocumentType` (7 rows)

### 6.2 เปิด Supabase Table Editor (วิธีที่ 2)

1. กลับไป Supabase Dashboard
2. ที่ Sidebar → คลิก **🗂️ Table Editor**
3. ดูตารางทั้งหมด

**ควรเห็น 26+ ตาราง:**
- Company
- User
- Contact
- Product
- Document
- Payment
- Account
- JournalEntry
- และอื่นๆ...

### 6.3 Query ทดสอบ (วิธีที่ 3)

1. ที่ Sidebar → คลิก **📊 SQL Editor**
2. Run SQL:

```sql
-- ตรวจสอบจำนวนตาราง
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- ดูข้อมูล Seed
SELECT * FROM "AccountType";
SELECT * FROM "Role";
SELECT * FROM "DocumentType";
```

**ควรเห็น:**
- table_count: 26+
- AccountType: 5 rows
- Role: 3 rows
- DocumentType: 7 rows

✅ **Database ทำงานถูกต้อง!**

---

## 🧪 ขั้นตอนที่ 7: Test Local App (3 นาที)

### 7.1 Start Development Server

```bash
npm run dev
```

**ควรเห็น:**
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

### 7.2 Test Registration

1. เปิด http://localhost:3000
2. คลิก **"สมัครสมาชิก"**
3. กรอกข้อมูล:
   - ชื่อบริษัท: `บริษัท ทดสอบ จำกัด`
   - เลขประจำตัวผู้เสียภาษี: `0123456789012`
   - ชื่อ: `ทดสอบ`
   - นามสกุล: `ระบบ`
   - Email: `test@example.com`
   - รหัสผ่าน: `test1234`
4. คลิก **"สมัครสมาชิก"**

**ควรเห็น:**
- ✅ สมัครสำเร็จ
- ✅ Redirect ไปหน้า Login
- ✅ Login เข้าสู่ระบบได้

### 7.3 ตรวจสอบใน Database

เปิด Prisma Studio:
```bash
npm run db:studio
```

**ตรวจสอบ:**
- ✅ ตาราง `User` มีข้อมูล 1 row
- ✅ ตาราง `Company` มีข้อมูล 1 row
- ✅ Password ถูก Hash แล้ว (bcrypt)

### 7.4 Test Dashboard

1. Login เข้าระบบ
2. ดูหน้า Dashboard
3. ลองสร้าง:
   - Contact (ลูกค้า)
   - Product (สินค้า)
   - Document (ใบเสนอราคา)

**ถ้าทำได้ทั้งหมด = สำเร็จ!** 🎉

✅ **ระบบทำงานปกติ!**

---

## 📊 ตรวจสอบ Database Structure

### ตารางทั้งหมด (26 tables)

```
Multi-tenant & Auth:
├── Company
├── User
└── Role

Master Data:
├── Contact
├── Product
├── ProductCategory
└── ContactAddress

Documents:
├── Document
├── DocumentLineItem
└── DocumentType

Payments:
├── Payment
└── PaymentAllocation

Accounting:
├── Account
├── AccountType
├── JournalEntry
└── JournalEntryLine

Inventory:
└── StockMovement

Bank:
├── BankAccount
└── BankReconciliation

Tax:
└── TaxRate

Recurring:
└── RecurringInvoice

Fixed Assets:
└── FixedAsset

System:
├── Notification
└── AuditLog
```

---

## 🎯 Database Stats

เมื่อ Seed เสร็จจะมี:

| Table | Rows | Purpose |
|-------|------|---------|
| AccountType | 5 | ประเภทบัญชี (สินทรัพย์, หนี้สิน, ทุน, รายได้, ค่าใช้จ่าย) |
| Role | 3 | สิทธิ์ผู้ใช้ (Admin, Accountant, User) |
| DocumentType | 7 | ประเภทเอกสาร (Quotation, Invoice, Receipt, PO, Bill, DN, CN) |

**รวมทั้งหมด: 15 seed records**

---

## 🔐 Security Best Practices

### ✅ ควรทำ:

1. **ไม่ Commit `.env`**
   ```bash
   # ตรวจสอบ .gitignore
   cat .gitignore | grep .env
   ```

2. **ใช้รหัสผ่านที่แข็งแรง**
   - อย่างน้อย 12 ตัวอักษร
   - มีตัวพิมพ์เล็ก-ใหญ่
   - มีตัวเลขและอักขระพิเศษ

3. **เก็บ Connection String ปลอดภัย**
   - ไม่แชร์ในที่สาธารณะ
   - ไม่ Screenshot แชร์
   - ไม่ Commit ใน Code

4. **Backup Database**
   - Supabase auto-backup ทุกวัน
   - Export เองเป็นครั้งคราว

### ⚠️ ไม่ควรทำ:

1. ❌ ใช้รหัสผ่าน `123456` หรือ `password`
2. ❌ Share `.env` file
3. ❌ Commit secrets ขึ้น GitHub
4. ❌ ใช้ Production URL ใน Development

---

## 🐛 Troubleshooting

### ปัญหา 1: Cannot connect to database

**สาเหตุ:**
- DATABASE_URL ไม่ถูกต้อง
- Password ผิด
- Port ผิด

**วิธีแก้:**
```bash
# ตรวจสอบ .env
cat .env | grep DATABASE_URL

# ทดสอบ Connection
npx prisma db execute --stdin <<< "SELECT 1"
```

### ปัญหา 2: Prisma Client not found

**วิธีแก้:**
```bash
npm run db:generate
```

### ปัญหา 3: Seed failed

**วิธีแก้:**
```bash
# Reset database
npx prisma db push --force-reset

# Seed again
npm run db:seed
```

### ปัญหา 4: Port 6543 ไม่ทำงาน

**วิธีแก้:**
- ใช้ port 5432 แทน
- ลบ `?pgbouncer=true`

**ตัวอย่าง:**
```
postgresql://postgres.xxx:pass@host:5432/postgres
```

### ปัญหา 5: ลืมรหัสผ่าน Database

**วิธีแก้:**
- ไม่มีวิธีกู้คืน
- ต้องสร้าง Project ใหม่
- หรือ Reset Database Password (อาจเสียข้อมูล)

---

## 📈 Monitoring & Maintenance

### ดู Database Usage

1. Supabase Dashboard → **📊 Database**
2. ดู:
   - Database size (MB)
   - Table sizes
   - Connections
   - Queries

### ดู Logs

1. Supabase Dashboard → **📋 Logs**
2. เลือก:
   - Postgres Logs
   - API Logs
   - Auth Logs

### Backup & Restore

**Auto Backup:**
- Supabase backup ทุกวัน
- เก็บไว้ 7 วัน (Free Plan)

**Manual Export:**
```bash
# Export schema
npx prisma db pull

# Export data
pg_dump $DATABASE_URL > backup.sql
```

---

## 🎓 เรียนรู้เพิ่มเติม

### Supabase Resources

- 📚 Docs: https://supabase.com/docs
- 🎥 Video Tutorials: https://supabase.com/docs/guides/getting-started
- 💬 Community: https://github.com/supabase/supabase/discussions
- 🐛 Support: https://supabase.com/support

### Prisma Resources

- 📚 Docs: https://www.prisma.io/docs
- 🎥 Tutorials: https://www.prisma.io/learn
- 💬 Discord: https://pris.ly/discord

---

## ✅ Checklist สุดท้าย

ก่อน Deploy Production ตรวจสอบ:

- [ ] ✅ Supabase Project สร้างแล้ว
- [ ] ✅ Database URL ถูกต้อง
- [ ] ✅ `.env` มีค่าครบ
- [ ] ✅ Schema pushed (26 tables)
- [ ] ✅ Seed data inserted (15 rows)
- [ ] ✅ Prisma Studio เปิดได้
- [ ] ✅ Local app ทำงานได้
- [ ] ✅ Registration/Login ทำงาน
- [ ] ✅ Dashboard แสดงผลได้
- [ ] ✅ สร้างข้อมูลได้
- [ ] ✅ `.env` ไม่ถูก commit

---

## 🎊 สำเร็จ!

ตอนนี้คุณมี:

- ✅ Supabase Database (500MB ฟรี)
- ✅ 26 Tables พร้อมใช้งาน
- ✅ Seed Data เริ่มต้น
- ✅ Local Development Environment
- ✅ Production Ready Database

---

## 🚀 Next Steps

1. **Test Local** - ทดสอบทุก Feature
2. **Deploy to Vercel** - ตาม VERCEL_DEPLOY.md
3. **Monitor Usage** - ดู Dashboard
4. **Scale Up** - อัพเกรด Plan เมื่อต้องการ

---

**🎉 Happy Coding with Supabase!**

**Made with ❤️ for Account Pro** 🇹🇭

