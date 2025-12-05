# 🚀 Deploy to Vercel - Quick Guide

## 📋 ขั้นตอนการ Deploy (10 นาที)

### ✅ Step 1: สร้าง Supabase Database (3 นาที)

1. ไปที่ **https://supabase.com** และ Sign up/Login
2. คลิก **"New Project"**
3. กรอกข้อมูล:
   - **Name:** `anajak-account-db`
   - **Database Password:** สร้างรหัสผ่าน (จำไว้!)
   - **Region:** Southeast Asia (Singapore)
4. คลิก **"Create new project"** (รอ ~2 นาที)
5. เมื่อสร้างเสร็จ → ไปที่ **Settings → Database**
6. Scroll ลงหา **"Connection string"**
7. เลือก **"URI"** mode
8. คลิก Copy (จะได้แบบนี้):
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@...
   ```
9. **เปลี่ยน `[YOUR-PASSWORD]`** ให้เป็นรหัสผ่านจริง
10. **เปลี่ยน port จาก 5432 เป็น 6543** และเพิ่ม `?pgbouncer=true`
11. เก็บไว้ใช้ในขั้นต่อไป

**ตอนนี้มี DATABASE_URL แล้ว! ✅**

---

### ✅ Step 2: Generate Secrets (1 นาที)

เปิด Terminal และรันคำสั่งนี้ 2 ครั้ง:

```bash
openssl rand -base64 32
```

ครั้งที่ 1 → **JWT_SECRET**  
ครั้งที่ 2 → **NEXTAUTH_SECRET**

เก็บไว้ใช้ในขั้นต่อไป

---

### ✅ Step 3: Deploy to Vercel (5 นาที)

#### 3.1 Login to Vercel

1. ไปที่ **https://vercel.com**
2. คลิก **"Sign Up"** → เลือก **"Continue with GitHub"**
3. Authorize Vercel เข้าถึง GitHub

#### 3.2 Import Project

1. คลิก **"Add New..."** → **"Project"**
2. ค้นหา **"anajak-account"**
3. คลิก **"Import"**

#### 3.3 Configure Project

1. **Framework Preset:** Next.js (auto-detect ✅)
2. **Root Directory:** `./` (default)
3. **Build Command:** `npm run build` (default)
4. **Output Directory:** `.next` (default)

#### 3.4 Add Environment Variables

คลิก **"Environment Variables"** แล้วเพิ่ม:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://postgres...` (จาก Step 1) |
| `JWT_SECRET` | `xxx...` (จาก Step 2) |
| `NEXTAUTH_SECRET` | `xxx...` (จาก Step 2) |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` (จะได้หลัง deploy) |
| `NODE_ENV` | `production` |

**Tips:** 
- เลือก Environment: **Production, Preview, Development** (ทั้ง 3)
- กด **Add** ทีละตัว

#### 3.5 Deploy!

1. คลิก **"Deploy"** (สีน้ำเงิน)
2. รอ ~2-3 นาที (ดูสถานะ Building...)
3. เมื่อเห็น **"Congratulations!"** = สำเร็จ! 🎉

#### 3.6 Get Your URL

1. คลิกไปที่ Domain ที่ได้ (เช่น `anajak-account-xxx.vercel.app`)
2. Copy URL
3. กลับไป **Settings → Environment Variables**
4. แก้ไข `NEXTAUTH_URL` เป็น URL ที่ได้

---

### ✅ Step 4: Setup Database (2 นาที)

#### วิธีที่ 1: ใช้ Local + Tunnel (แนะนำ)

```bash
# 1. ตั้ง DATABASE_URL ชั่วคราว
export DATABASE_URL="postgresql://postgres..."

# 2. Push schema
npx prisma db push

# 3. Seed data
npx prisma db seed
```

#### วิธีที่ 2: ใช้ Prisma Studio

```bash
# 1. เปิด Prisma Studio
npx prisma studio

# 2. Manually add initial data:
# - AccountTypes
# - Roles
# - DocumentTypes
```

#### วิธีที่ 3: ใช้ Supabase SQL Editor

1. ไปที่ Supabase Dashboard
2. คลิก **"SQL Editor"**
3. Run SQL:

```sql
-- Create Account Types
INSERT INTO "AccountType" (code, name, "normalBalance") VALUES
  ('1', 'สินทรัพย์', 'debit'),
  ('2', 'หนี้สิน', 'credit'),
  ('3', 'ทุน', 'credit'),
  ('4', 'รายได้', 'credit'),
  ('5', 'ค่าใช้จ่าย', 'debit');

-- Create Roles
INSERT INTO "Role" (name, description, permissions) VALUES
  ('admin', 'Administrator', '{}'),
  ('accountant', 'Accountant', '{}'),
  ('user', 'User', '{}');

-- Create Document Types
INSERT INTO "DocumentType" (code, name, "prefix", "affectsInventory", "affectsReceivable", "affectsPayable") VALUES
  ('quotation', 'ใบเสนอราคา', 'QT', false, false, false),
  ('invoice', 'ใบแจ้งหนี้/ใบกำกับภาษี', 'IV', true, true, false),
  ('receipt', 'ใบเสร็จรับเงิน', 'RC', false, false, false),
  ('purchase_order', 'ใบสั่งซื้อ', 'PO', false, false, false),
  ('bill', 'ใบวางบิล', 'BL', true, false, true),
  ('debit_note', 'ใบเพิ่มหนี้', 'DN', false, false, false),
  ('credit_note', 'ใบลดหนี้', 'CN', false, false, false);
```

---

### ✅ Step 5: Test Your App! (1 นาที)

1. เปิด URL ที่ได้ (เช่น `https://anajak-account-xxx.vercel.app`)
2. คลิก **"สมัครสมาชิก"**
3. กรอกข้อมูล → Register
4. Login เข้าสู่ระบบ
5. ทดสอบสร้างข้อมูล

**เสร็จสมบูรณ์! 🎊**

---

## 🔧 Optional: Setup Resend Email (5 นาที)

### 1. สมัคร Resend

1. ไปที่ **https://resend.com**
2. Sign up with GitHub
3. Verify email

### 2. Get API Key

1. ไปที่ **API Keys**
2. คลิก **"Create API Key"**
3. Name: `Account Pro`
4. Permission: **Full Access**
5. คลิก **"Add"**
6. Copy API Key (จะแสดงครั้งเดียว!)

### 3. Add to Vercel

1. กลับไป Vercel Dashboard
2. **Settings → Environment Variables**
3. เพิ่ม:
   - `RESEND_API_KEY` = `re_xxx...`
   - `RESEND_FROM_EMAIL` = `Account Pro <onboarding@resend.dev>`

### 4. Redeploy

1. ไปที่ **Deployments**
2. คลิก **"..."** บน Latest Deployment
3. เลือก **"Redeploy"**

**ตอนนี้ส่งอีเมลได้แล้ว! 📧**

---

## 🎯 Quick Checklist

Before deploying, make sure:

- [x] ✅ Code pushed to GitHub
- [ ] ✅ Supabase Database created
- [ ] ✅ DATABASE_URL ready
- [ ] ✅ JWT_SECRET generated
- [ ] ✅ NEXTAUTH_SECRET generated
- [ ] ✅ Vercel account created
- [ ] ✅ Environment variables added
- [ ] ✅ Database schema pushed
- [ ] ✅ Seed data inserted
- [ ] ✅ Tested registration/login

---

## 🐛 Troubleshooting

### Problem: "Prisma Client not found"

**Solution:**
```bash
# In vercel.json, add:
{
  "buildCommand": "prisma generate && next build"
}
```

### Problem: "Database connection failed"

**Solution:**
- ตรวจสอบ DATABASE_URL ว่าถูกต้อง
- ใช้ port 6543 (pgbouncer) แทน 5432
- เพิ่ม `?pgbouncer=true` ท้าย URL

### Problem: "NEXTAUTH_URL not set"

**Solution:**
- Set `NEXTAUTH_URL` = your Vercel URL
- Redeploy

### Problem: "Cannot find module prisma"

**Solution:**
```json
// package.json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma db push && next build"
  }
}
```

---

## 📊 Deployment Summary

### Free Tier Limits

**Vercel:**
- ✅ 100GB Bandwidth/month
- ✅ 100 Serverless Function calls/day
- ✅ Unlimited sites
- ✅ Auto SSL
- ✅ Global CDN

**Supabase:**
- ✅ 500MB Database
- ✅ 1GB File Storage
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests

**Resend:**
- ✅ 100 emails/day
- ✅ 1 domain
- ✅ Email API

**Total Cost: $0/month** 🎉

---

## 🚀 Post-Deployment

### Auto Deploy on Git Push

Vercel จะ auto-deploy ทุกครั้งที่:
- Push to `main` branch → Production
- Push to other branches → Preview

### Custom Domain (Optional)

1. Vercel Dashboard → **Settings → Domains**
2. Add your domain (e.g., `accountpro.com`)
3. Update DNS records ตามที่แนะนำ
4. รอ SSL provision (~5 นาที)
5. เสร็จ! 🎉

### Monitoring

Vercel มี built-in monitoring:
- **Analytics** - Page views, traffic
- **Speed Insights** - Performance
- **Logs** - Runtime logs
- **Deployments** - History

---

## 🎊 Congratulations!

ระบบ **Account Pro** ออนไลน์แล้ว!

### ✅ What You Have Now:

- 🌐 **Live URL:** `https://your-app.vercel.app`
- 🗄️ **Cloud Database:** Supabase
- 📧 **Email Service:** Resend (optional)
- 🔒 **SSL Certificate:** Auto
- 🚀 **Auto Deploy:** On every push
- 📊 **Analytics:** Built-in
- 💯 **Cost:** $0/month

### 🎯 Next Steps:

1. Share URL with users
2. Test all features
3. Setup custom domain (optional)
4. Monitor usage
5. Enjoy! 🎉

---

**Need help?**
- 📚 Vercel Docs: https://vercel.com/docs
- 📚 Supabase Docs: https://supabase.com/docs
- 📧 Support: support@accountpro.com

**Happy Deploying! 🚀**

