# ⚡ Quick Start - เริ่มใช้งานใน 5 นาที!

## 🎯 ทำเพียง 3 ขั้นตอน!

---

## ✅ Step 1: Setup Supabase (3 นาที)

### 1.1 สร้าง Account & Project

1. **เปิด:** https://supabase.com
2. **Click:** "Start your project"
3. **Login:** Continue with GitHub
4. **Click:** "New Project"
5. **กรอก:**
   - Name: `anajak-account-db`
   - Password: `สร้างรหัสผ่าน` (จำไว้!)
   - Region: **Singapore**
6. **Click:** "Create new project"
7. **รอ 2 นาที...**

### 1.2 Get Connection String

1. **รอจน Project พร้อม**
2. **Click:** Settings (⚙️) → Database
3. **Scroll:** หา "Connection string"
4. **Click:** Tab "URI"
5. **Click:** Copy
6. **จะได้:**
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
   ```

### 1.3 แก้ไข Connection String

**เปลี่ยน 3 จุด:**
1. `[YOUR-PASSWORD]` → รหัสผ่านจริง
2. `:5432` → `:6543`
3. เพิ่ม `?pgbouncer=true` ท้ายสุด

**ตัวอย่างที่ถูกต้อง:**
```
postgresql://postgres.abc:MyPassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

✅ **เก็บไว้! จะใช้ในขั้นต่อไป**

---

## ✅ Step 2: Setup Local Environment (1 นาที)

### 2.1 Copy Template

```bash
# ไปที่ folder project
cd /Users/lostxker/Desktop/dev/account

# Copy template เป็น .env
cp .env.local.template .env
```

### 2.2 แก้ไขไฟล์ .env

เปิดไฟล์ `.env` แล้วแก้ไข:

**แก้ไขเฉพาะบรรทัดนี้:**
```bash
DATABASE_URL="PASTE_YOUR_SUPABASE_CONNECTION_STRING_HERE"
```

**เป็น:**
```bash
DATABASE_URL="postgresql://postgres.abc:MyPassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**ส่วนอื่นไม่ต้องแก้!** (JWT_SECRET และ NEXTAUTH_SECRET มีไว้ให้แล้ว)

✅ **Environment พร้อม!**

---

## ✅ Step 3: Run! (1 นาที)

### 3.1 Setup Database

```bash
# Install dependencies (ถ้ายังไม่ได้ทำ)
npm install

# Generate Prisma Client
npm run db:generate

# Push schema to Supabase (สร้าง 26 tables)
npm run db:push

# Seed ข้อมูลเริ่มต้น
npm run db:seed
```

**ควรเห็น:**
```
✔ Generated Prisma Client
🚀 Your database is now in sync with your schema
✅ Seeded 5 account types
✅ Seeded 3 roles  
✅ Seeded 7 document types
🎉 Database seeded successfully!
```

### 3.2 Start Server

```bash
npm run dev
```

**ควรเห็น:**
```
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

### 3.3 Test!

1. **เปิด:** http://localhost:3000
2. **Click:** "สมัครสมาชิก"
3. **กรอก:**
   - ชื่อบริษัท: `บริษัท ทดสอบ จำกัด`
   - เลขผู้เสียภาษี: `0123456789012`
   - ชื่อ: `ทดสอบ`
   - นามสกุล: `ระบบ`
   - Email: `test@example.com`
   - Password: `test1234`
4. **Click:** "สมัครสมาชิก"

✅ **สำเร็จ! เข้าสู่ระบบได้แล้ว!** 🎉

---

## 🎊 เสร็จแล้ว!

### ตอนนี้คุณมี:

- ✅ Supabase Database (Cloud)
- ✅ 26 Tables พร้อมใช้งาน
- ✅ Local Development ทำงาน
- ✅ Registration/Login ใช้ได้

---

## 🔍 ตรวจสอบ Database

### วิธีที่ 1: Prisma Studio

```bash
npm run db:studio
```

เปิดที่ http://localhost:5555

### วิธีที่ 2: Supabase Dashboard

1. https://supabase.com/dashboard
2. เลือก Project
3. Click "Table Editor"
4. ดู 26 tables

---

## 🐛 ถ้าเจอปัญหา

### Error: Cannot connect to database

**แก้:**
```bash
# ตรวจสอบ .env
cat .env | grep DATABASE_URL

# ตรวจสอบว่า:
# 1. Password ถูกต้อง
# 2. ใช้ port 6543
# 3. มี ?pgbouncer=true
```

### Error: Prisma Client not found

**แก้:**
```bash
npm run db:generate
```

### Error: Seed failed

**แก้:**
```bash
npx prisma db push --force-reset
npm run db:seed
```

---

## 🚀 Next Steps

1. **ทดสอบทุก Feature** - สร้างข้อมูล
2. **Deploy to Vercel** - ดู VERCEL_DEPLOY.md
3. **Setup Email** - Resend.com (optional)
4. **Go Live!**

---

## 📚 คู่มือเพิ่มเติม

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - คู่มือฉบับเต็ม
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Deploy guide
- [README.md](./README.md) - Project overview

---

**🎉 Happy Coding!**

Made with ❤️ for Account Pro 🇹🇭

