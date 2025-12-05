# 🗄️ Database Setup Guide

คู่มือการตั้งค่า Database สำหรับโปรเจค Account Pro

---

## 🎯 ตัวเลือก Database

### Option 1: Supabase (แนะนำ - ฟรี)
- ✅ PostgreSQL ฟรี 500MB
- ✅ ไม่ต้อง Setup อะไร
- ✅ มี Dashboard จัดการง่าย
- ✅ มี Storage + Auth ให้ด้วย

### Option 2: Railway (ฟรี $5/เดือน)
- ✅ PostgreSQL ฟรี (จำกัด)
- ✅ Deploy ง่าย
- ✅ Auto-scaling

### Option 3: Local PostgreSQL
- ✅ ควบคุมได้เต็มที่
- ✅ ไม่จำกัด
- ❌ ต้อง Setup เอง

---

## 🚀 Option 1: Setup Supabase (แนะนำ)

### Step 1: สร้าง Supabase Project

1. ไปที่ https://supabase.com
2. คลิก **"Start your project"**
3. Sign in ด้วย GitHub
4. คลิก **"New Project"**
5. กรอกข้อมูล:
   - **Name:** account-pro
   - **Database Password:** (สร้าง password ที่แข็งแรง)
   - **Region:** Southeast Asia (Singapore)
6. คลิก **"Create new project"** (รอ 2-3 นาที)

### Step 2: Get Connection String

1. ที่หน้า Project → Settings → Database
2. ส่วน **"Connection string"** เลือก **"URI"**
3. Copy connection string (จะเป็นแบบนี้):
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
4. แทนที่ `[password]` ด้วย password ที่ตั้งไว้

### Step 3: Update .env

1. เปิดไฟล์ `.env` (ถ้าไม่มีให้ copy จาก `.env.example`)
2. วาง Connection String:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Account Pro"
```

### Step 4: Run Migrations

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

### Step 5: Verify Database

```bash
# Open Prisma Studio
npm run db:studio
```

Browser จะเปิดที่ http://localhost:5555 ให้ดูว่ามีตารางครบหรือไม่

---

## 🎨 Option 2: Setup Railway

### Step 1: Create Railway Account

1. ไปที่ https://railway.app
2. Sign in ด้วย GitHub
3. คลิก **"New Project"**
4. เลือก **"Provision PostgreSQL"**

### Step 2: Get Connection String

1. คลิกที่ PostgreSQL service
2. ไปที่ **"Variables"** tab
3. Copy ค่า `DATABASE_URL`

### Step 3: Update .env & Run Migrations

```bash
# Update .env
DATABASE_URL="postgresql://..."

# Run migrations
npm run db:generate
npm run db:push
npm run db:seed
```

---

## 💻 Option 3: Local PostgreSQL

### Step 1: Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Windows:**
ดาวน์โหลดจาก https://www.postgresql.org/download/windows/

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

```bash
# Create database
createdb account_db

# Or using psql
psql postgres
CREATE DATABASE account_db;
\q
```

### Step 3: Update .env

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/account_db"
```

### Step 4: Run Migrations

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

---

## ✅ Verify Installation

### 1. Check Tables

```bash
npm run db:studio
```

ควรเห็นตารางเหล่านี้:
- ✅ tenants
- ✅ companies
- ✅ users
- ✅ roles
- ✅ contacts
- ✅ products
- ✅ accounts
- ✅ account_types
- ✅ documents
- ✅ document_types
- ✅ และอื่นๆ (รวม 26 ตาราง)

### 2. Check Seed Data

ควรมีข้อมูลเริ่มต้น:
- ✅ Account Types (5 ประเภท)
- ✅ Roles (7 roles)
- ✅ Document Types (8 types)

### 3. Test Connection

```bash
# Run dev server
npm run dev
```

ลอง Register ผู้ใช้ใหม่ที่ http://localhost:3000/register

---

## 🔧 Database Commands

| Command | คำอธิบาย |
|---------|---------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to DB (Development) |
| `npm run db:migrate` | Create migration (Production) |
| `npm run db:seed` | Seed initial data |
| `npm run db:studio` | Open Prisma Studio |

---

## 🐛 Troubleshooting

### ❌ Error: "Can't reach database server"

**วิธีแก้:**
1. เช็คว่า DATABASE_URL ถูกต้อง
2. เช็คว่า Database service running
3. เช็ค firewall/network

### ❌ Error: "Migration failed"

**วิธีแก้:**
```bash
# Reset database (ระวัง: ข้อมูลหาย!)
npx prisma migrate reset

# Push schema again
npm run db:push
npm run db:seed
```

### ❌ Error: "Prisma Client not generated"

**วิธีแก้:**
```bash
npm run db:generate
```

---

## 📊 Recommended: Supabase Setup

ผมแนะนำ Supabase เพราะ:

| Feature | Supabase | Railway | Local |
|---------|----------|---------|-------|
| ฟรี | ✅ 500MB | ✅ $5/mo | ✅ Unlimited |
| Setup ง่าย | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Dashboard | ✅ สวย | ✅ ดี | ❌ |
| Backup | ✅ Auto | ✅ Auto | ❌ ต้องทำเอง |
| Production Ready | ✅ | ✅ | ❌ |

---

## 🎯 Next Steps

หลัง Setup Database เรียบร้อยแล้ว:

1. ✅ ทดสอบ Register/Login
2. ✅ ลองสร้าง Contact/Product
3. ✅ ดูข้อมูลใน Prisma Studio
4. 🚀 พร้อม Deploy!

---

ถ้ามีปัญหาตรงไหน บอกได้เลยครับ! 💪

