# 🚀 Deployment Guide - Account Pro

**Last Updated:** December 5, 2025

---

## 📋 Pre-Deployment Checklist

### ✅ Code Ready
- [x] All features implemented
- [x] Error handling in place
- [x] Loading states added
- [x] Responsive design
- [x] Print optimization

### ✅ Database Ready
- [x] Schema defined (26 tables)
- [x] Seed data prepared
- [x] Indexes optimized
- [x] Multi-tenant isolation

### ✅ Environment Ready
- [ ] Production database URL
- [ ] JWT secret key
- [ ] Domain name
- [ ] SSL certificate

---

## 🗄 Database Setup

### Option 1: Supabase (Recommended)

1. **Create Project**
```
1. Go to https://supabase.com
2. Click "New Project"
3. Fill in project details
4. Wait for database to be ready
```

2. **Get Connection String**
```
1. Go to Project Settings → Database
2. Copy connection string (Pooler)
3. Format: postgresql://postgres:[password]@[host]:[port]/postgres
```

3. **Update .env**
```bash
DATABASE_URL="your-supabase-connection-string"
DIRECT_URL="your-supabase-direct-url"  # For migrations
```

### Option 2: Self-Hosted PostgreSQL

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb account_pro

# Create user
sudo -u postgres createuser account_admin

# Grant privileges
sudo -u postgres psql
ALTER USER account_admin WITH PASSWORD 'secure-password';
GRANT ALL PRIVILEGES ON DATABASE account_pro TO account_admin;
```

---

## 🔐 Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # Optional, for migrations

# Authentication
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="https://your-domain.com"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
```

### Generate Secrets

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# or
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 📦 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
# Development
vercel

# Production
vercel --prod
```

4. **Environment Variables**
```
1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add all required variables
4. Redeploy
```

### Option 2: Railway

1. **Install Railway CLI**
```bash
npm i -g @railway/cli
```

2. **Login & Init**
```bash
railway login
railway init
```

3. **Deploy**
```bash
railway up
```

### Option 3: Self-Hosted (VPS)

#### Prerequisites
- Ubuntu 22.04 LTS
- Node.js 18+
- Nginx
- PM2

#### Setup Steps

1. **Clone Repository**
```bash
git clone https://github.com/your-repo/account-pro.git
cd account-pro
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment**
```bash
cp .env.example .env
nano .env  # Edit variables
```

4. **Build**
```bash
npm run build
```

5. **Database Migration**
```bash
npx prisma db push
npx prisma db seed
```

6. **Start with PM2**
```bash
npm install -g pm2
pm2 start npm --name "account-pro" -- start
pm2 save
pm2 startup
```

7. **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. **SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🧪 Post-Deployment Testing

### 1. Health Check
```bash
curl https://your-domain.com
# Should return 200 OK
```

### 2. Database Connection
```bash
# Check if API works
curl https://your-domain.com/api/health
```

### 3. Authentication
```
1. Go to /register
2. Create test account
3. Login
4. Access dashboard
```

### 4. Core Features
```
1. Create Contact
2. Create Product
3. Create Invoice
4. Receive Payment
5. View Reports
```

---

## 📊 Monitoring

### Application Monitoring

**Vercel Analytics** (if using Vercel)
```bash
npm install @vercel/analytics
```

**Sentry** (Error Tracking)
```bash
npm install @sentry/nextjs
```

### Database Monitoring

**Supabase Dashboard**
- Query performance
- Connection pool
- Storage usage

**Self-hosted**
```bash
# Install pg_stat_statements
sudo -u postgres psql
CREATE EXTENSION pg_stat_statements;

# Monitor queries
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 🛡️ Security Best Practices

### 1. Environment Variables
- ✅ Never commit .env files
- ✅ Use different secrets for dev/prod
- ✅ Rotate secrets regularly

### 2. Database
- ✅ Use connection pooling
- ✅ Enable SSL
- ✅ Regular backups
- ✅ Limit user permissions

### 3. Application
- ✅ Enable CORS properly
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention (Prisma handles this)

### 4. Infrastructure
- ✅ Use HTTPS only
- ✅ Keep dependencies updated
- ✅ Enable firewall
- ✅ Monitor logs

---

## 📈 Performance Optimization

### Database
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_document_company_status ON "Document"(company_id, status);
CREATE INDEX idx_payment_company_date ON "Payment"(company_id, payment_date);
CREATE INDEX idx_contact_company_type ON "Contact"(company_id, type);
```

### Next.js
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn.com'],
  },
  compress: true,
  poweredByHeader: false,
}
```

### Caching
```typescript
// Add Redis for session caching
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})
```

---

## 🔧 Troubleshooting

### Build Errors

**Issue: Out of Memory**
```bash
# Increase Node memory
export NODE_OPTIONS="--max_old_space_size=4096"
npm run build
```

**Issue: Prisma Client Not Generated**
```bash
npx prisma generate
npm run build
```

### Runtime Errors

**Issue: Database Connection Failed**
```
1. Check DATABASE_URL format
2. Verify database is accessible
3. Check firewall rules
4. Test connection:
   npx prisma db pull
```

**Issue: 500 Internal Server Error**
```
1. Check server logs
2. Verify environment variables
3. Check database status
4. Review error stack trace
```

---

## 📝 Maintenance

### Daily
- ✅ Monitor error rates
- ✅ Check database connections
- ✅ Review performance metrics

### Weekly
- ✅ Database backup
- ✅ Security updates
- ✅ Log analysis

### Monthly
- ✅ Dependency updates
- ✅ Performance review
- ✅ Cost optimization

---

## 🆘 Support

### Documentation
- System Planning: `/docs/accounting_system_plan.md`
- Database Setup: `/docs/database_setup.md`
- API Docs: `/docs/api_specification.md`

### Community
- GitHub Issues
- Discord Server
- Email Support

---

## ✅ Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] Database migrated and seeded
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Error tracking enabled
- [ ] Performance tested
- [ ] Security audit passed
- [ ] Documentation updated

---

**🎉 Ready to Deploy!**

Your Account Pro system is production-ready and can be deployed with confidence.

**Good luck! 🚀**

