# API Specification (RESTful API)

ออกแบบ API Endpoints สำหรับระบบบัญชีครบวงจร

---

## 📋 API Overview

### Base URL
```
Production: https://api.yourapp.com/v1
Staging: https://api-staging.yourapp.com/v1
```

### Authentication
- **Method:** Bearer Token (JWT)
- **Header:** `Authorization: Bearer <token>`
- **Token Expiry:** 24 hours (Access Token), 7 days (Refresh Token)

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Email is required" }
    ]
  }
}
```

### Common HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (Delete success) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Server Error |

---

## 🔐 1. Authentication

### 1.1 Register
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "first_name": "สมชาย",
  "last_name": "ใจดี",
  "company_name": "บริษัท ทดสอบ จำกัด",
  "phone": "0812345678"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "สมชาย",
      "last_name": "ใจดี"
    },
    "company": {
      "id": "uuid",
      "name": "บริษัท ทดสอบ จำกัด"
    },
    "tokens": {
      "access_token": "eyJ...",
      "refresh_token": "eyJ...",
      "expires_in": 86400
    }
  }
}
```

### 1.2 Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "companies": [ ... ],
    "tokens": {
      "access_token": "eyJ...",
      "refresh_token": "eyJ...",
      "expires_in": 86400
    }
  }
}
```

### 1.3 Refresh Token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refresh_token": "eyJ..."
}
```

### 1.4 Logout
```http
POST /auth/logout
```

### 1.5 Forgot Password
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### 1.6 Reset Password
```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123!"
}
```

### 1.7 Get Current User
```http
GET /auth/me
```

### 1.8 Update Profile
```http
PUT /auth/me
```

---

## 🏢 2. Companies

### 2.1 List Companies (for current user)
```http
GET /companies
```

### 2.2 Get Company
```http
GET /companies/:id
```

### 2.3 Create Company
```http
POST /companies
```

**Request Body:**
```json
{
  "name": "บริษัท ทดสอบ จำกัด",
  "name_en": "Test Company Limited",
  "tax_id": "0123456789012",
  "branch_code": "00000",
  "address": "123 ถนนสุขุมวิท",
  "district": "คลองเตย",
  "sub_district": "คลองเตย",
  "province": "กรุงเทพมหานคร",
  "postal_code": "10110",
  "phone": "02-123-4567",
  "email": "info@test.com",
  "vat_registered": true,
  "vat_rate": 7.00,
  "fiscal_year_start": 1
}
```

### 2.4 Update Company
```http
PUT /companies/:id
```

### 2.5 Upload Logo
```http
POST /companies/:id/logo
Content-Type: multipart/form-data
```

### 2.6 Get Company Settings
```http
GET /companies/:id/settings
```

### 2.7 Update Company Settings
```http
PUT /companies/:id/settings
```

---

## 👥 3. Users & Roles

### 3.1 List Users
```http
GET /companies/:companyId/users
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | ค้นหาชื่อ/อีเมล |
| role | string | กรองตาม role |
| status | string | active, inactive |
| page | number | หน้าที่ |
| per_page | number | จำนวนต่อหน้า |

### 3.2 Invite User
```http
POST /companies/:companyId/users/invite
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "role_id": "uuid",
  "first_name": "สมหญิง",
  "last_name": "ใจดี"
}
```

### 3.3 Update User Role
```http
PUT /companies/:companyId/users/:userId
```

### 3.4 Remove User
```http
DELETE /companies/:companyId/users/:userId
```

### 3.5 List Roles
```http
GET /roles
```

### 3.6 Create Custom Role
```http
POST /companies/:companyId/roles
```

### 3.7 Update Role Permissions
```http
PUT /companies/:companyId/roles/:roleId/permissions
```

---

## 📇 4. Contacts (ลูกค้า/Vendor)

### 4.1 List Contacts
```http
GET /companies/:companyId/contacts
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | customer, vendor, both |
| search | string | ค้นหาชื่อ/รหัส/Tax ID |
| tags | string[] | กรองตาม tags |
| is_active | boolean | สถานะ |
| has_outstanding | boolean | มียอดค้าง |
| page | number | หน้าที่ |
| per_page | number | จำนวนต่อหน้า |
| sort | string | name, code, created_at |
| order | string | asc, desc |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "code": "C001",
      "name": "บริษัท ลูกค้าดี จำกัด",
      "type": "customer",
      "tax_id": "0123456789012",
      "phone": "02-123-4567",
      "email": "contact@customer.com",
      "credit_term": 30,
      "credit_limit": 100000,
      "outstanding_amount": 25000,
      "is_active": true,
      "tags": ["VIP", "ขายส่ง"]
    }
  ],
  "meta": { "page": 1, "per_page": 20, "total": 150 }
}
```

### 4.2 Get Contact
```http
GET /companies/:companyId/contacts/:id
```

### 4.3 Create Contact
```http
POST /companies/:companyId/contacts
```

**Request Body:**
```json
{
  "type": "customer",
  "code": "C001",
  "name": "บริษัท ลูกค้าดี จำกัด",
  "name_en": "Good Customer Co., Ltd.",
  "tax_id": "0123456789012",
  "branch_code": "00000",
  "contact_name": "คุณสมศรี",
  "phone": "02-123-4567",
  "email": "contact@customer.com",
  "credit_term": 30,
  "credit_limit": 100000,
  "default_wht_rate": 3,
  "tags": ["VIP"],
  "notes": "ลูกค้าประจำ",
  "addresses": [
    {
      "type": "billing",
      "label": "สำนักงานใหญ่",
      "address": "123 ถนนสุขุมวิท",
      "district": "คลองเตย",
      "sub_district": "คลองเตย",
      "province": "กรุงเทพมหานคร",
      "postal_code": "10110",
      "is_default": true
    }
  ]
}
```

### 4.4 Update Contact
```http
PUT /companies/:companyId/contacts/:id
```

### 4.5 Delete Contact
```http
DELETE /companies/:companyId/contacts/:id
```

### 4.6 Get Contact Addresses
```http
GET /companies/:companyId/contacts/:id/addresses
```

### 4.7 Add Contact Address
```http
POST /companies/:companyId/contacts/:id/addresses
```

### 4.8 Get Contact Documents
```http
GET /companies/:companyId/contacts/:id/documents
```

### 4.9 Get Contact Statement
```http
GET /companies/:companyId/contacts/:id/statement
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| from_date | date | วันที่เริ่มต้น |
| to_date | date | วันที่สิ้นสุด |

### 4.10 Import Contacts
```http
POST /companies/:companyId/contacts/import
Content-Type: multipart/form-data
```

### 4.11 Export Contacts
```http
GET /companies/:companyId/contacts/export
```

---

## 📦 5. Products & Services

### 5.1 List Products
```http
GET /companies/:companyId/products
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | product, service, bundle |
| category_id | uuid | หมวดหมู่ |
| search | string | ค้นหาชื่อ/รหัส/Barcode |
| is_active | boolean | สถานะ |
| low_stock | boolean | สินค้าใกล้หมด |
| page | number | หน้าที่ |
| per_page | number | จำนวนต่อหน้า |

### 5.2 Get Product
```http
GET /companies/:companyId/products/:id
```

### 5.3 Create Product
```http
POST /companies/:companyId/products
```

**Request Body:**
```json
{
  "type": "product",
  "category_id": "uuid",
  "code": "SKU001",
  "barcode": "8850123456789",
  "name": "สินค้าทดสอบ",
  "name_en": "Test Product",
  "description": "รายละเอียดสินค้า",
  "unit": "ชิ้น",
  "sale_price": 100.00,
  "purchase_price": 60.00,
  "is_vatable": true,
  "vat_type": "vat7",
  "track_inventory": true,
  "min_stock": 10,
  "income_account_id": "uuid",
  "expense_account_id": "uuid"
}
```

### 5.4 Update Product
```http
PUT /companies/:companyId/products/:id
```

### 5.5 Delete Product
```http
DELETE /companies/:companyId/products/:id
```

### 5.6 Upload Product Image
```http
POST /companies/:companyId/products/:id/image
Content-Type: multipart/form-data
```

### 5.7 Get Product Stock
```http
GET /companies/:companyId/products/:id/stock
```

### 5.8 List Categories
```http
GET /companies/:companyId/product-categories
```

### 5.9 Create Category
```http
POST /companies/:companyId/product-categories
```

---

## 📄 6. Documents (เอกสาร)

### Document Types
| Type | Code | Description |
|------|------|-------------|
| Sales | quotation | ใบเสนอราคา |
| Sales | invoice | ใบแจ้งหนี้/ใบกำกับภาษี |
| Sales | receipt | ใบเสร็จรับเงิน |
| Sales | credit_note | ใบลดหนี้ |
| Purchase | purchase_order | ใบสั่งซื้อ |
| Purchase | purchase_invoice | บันทึกซื้อ |
| Purchase | payment | ใบสำคัญจ่าย |
| Purchase | expense | ค่าใช้จ่าย |

### 6.1 List Documents
```http
GET /companies/:companyId/documents
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | document type code |
| status | string | draft, approved, sent, paid, overdue, voided |
| contact_id | uuid | ลูกค้า/Vendor |
| from_date | date | วันที่เริ่มต้น |
| to_date | date | วันที่สิ้นสุด |
| search | string | ค้นหาเลขเอกสาร |
| page | number | หน้าที่ |
| per_page | number | จำนวนต่อหน้า |

### 6.2 Get Document
```http
GET /companies/:companyId/documents/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "document_type": "invoice",
    "document_number": "INV-2024-0001",
    "reference_number": "TAX-2024-0001",
    "document_date": "2024-01-15",
    "due_date": "2024-02-14",
    "contact": {
      "id": "uuid",
      "name": "บริษัท ลูกค้าดี จำกัด",
      "tax_id": "0123456789012"
    },
    "lines": [
      {
        "id": "uuid",
        "line_number": 1,
        "product_id": "uuid",
        "product_code": "SKU001",
        "product_name": "สินค้าทดสอบ",
        "quantity": 10,
        "unit": "ชิ้น",
        "unit_price": 100.00,
        "discount_percent": 0,
        "amount": 1000.00,
        "vat_type": "vat7",
        "vat_amount": 70.00
      }
    ],
    "subtotal": 1000.00,
    "discount_amount": 0,
    "amount_before_vat": 1000.00,
    "vat_amount": 70.00,
    "wht_amount": 0,
    "total_amount": 1070.00,
    "paid_amount": 0,
    "status": "sent",
    "notes": "หมายเหตุภายใน",
    "customer_notes": "หมายเหตุแสดงในเอกสาร",
    "attachments": [],
    "activities": [
      {
        "type": "created",
        "performed_by": "สมชาย ใจดี",
        "performed_at": "2024-01-15T10:00:00Z"
      }
    ],
    "created_at": "2024-01-15T10:00:00Z",
    "created_by": { "id": "uuid", "name": "สมชาย ใจดี" }
  }
}
```

### 6.3 Create Document
```http
POST /companies/:companyId/documents
```

**Request Body:**
```json
{
  "document_type": "invoice",
  "contact_id": "uuid",
  "document_date": "2024-01-15",
  "due_date": "2024-02-14",
  "reference_number": "TAX-2024-0001",
  "lines": [
    {
      "product_id": "uuid",
      "description": "รายละเอียดเพิ่มเติม",
      "quantity": 10,
      "unit": "ชิ้น",
      "unit_price": 100.00,
      "discount_percent": 0,
      "vat_type": "vat7",
      "wht_rate": 0,
      "account_id": "uuid"
    }
  ],
  "discount_amount": 0,
  "notes": "หมายเหตุภายใน",
  "customer_notes": "กรุณาชำระเงินภายในวันที่กำหนด"
}
```

### 6.4 Update Document
```http
PUT /companies/:companyId/documents/:id
```

### 6.5 Delete Document (Draft only)
```http
DELETE /companies/:companyId/documents/:id
```

### 6.6 Approve Document
```http
POST /companies/:companyId/documents/:id/approve
```

### 6.7 Reject Document
```http
POST /companies/:companyId/documents/:id/reject
```

**Request Body:**
```json
{
  "reason": "เหตุผลที่ไม่อนุมัติ"
}
```

### 6.8 Send Document
```http
POST /companies/:companyId/documents/:id/send
```

**Request Body:**
```json
{
  "channel": "email",
  "to": "customer@example.com",
  "cc": ["cc@example.com"],
  "subject": "ใบแจ้งหนี้ INV-2024-0001",
  "message": "เรียน ลูกค้า..."
}
```

### 6.9 Void Document
```http
POST /companies/:companyId/documents/:id/void
```

**Request Body:**
```json
{
  "reason": "เหตุผลที่ยกเลิก"
}
```

### 6.10 Convert Document
```http
POST /companies/:companyId/documents/:id/convert
```

**Request Body:**
```json
{
  "to_type": "invoice"
}
```

### 6.11 Copy Document
```http
POST /companies/:companyId/documents/:id/copy
```

### 6.12 Get Document PDF
```http
GET /companies/:companyId/documents/:id/pdf
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| template | string | modern, classic, minimal |
| language | string | th, en, both |

### 6.13 Get Public Document (No Auth)
```http
GET /public/documents/:token
```

### 6.14 Upload Attachment
```http
POST /companies/:companyId/documents/:id/attachments
Content-Type: multipart/form-data
```

### 6.15 Delete Attachment
```http
DELETE /companies/:companyId/documents/:id/attachments/:attachmentId
```

---

## 💰 7. Payments

### 7.1 List Payments
```http
GET /companies/:companyId/payments
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | receive, pay |
| contact_id | uuid | ลูกค้า/Vendor |
| from_date | date | วันที่เริ่มต้น |
| to_date | date | วันที่สิ้นสุด |
| payment_method | string | cash, transfer, cheque |

### 7.2 Get Payment
```http
GET /companies/:companyId/payments/:id
```

### 7.3 Create Payment (Receive)
```http
POST /companies/:companyId/payments/receive
```

**Request Body:**
```json
{
  "contact_id": "uuid",
  "payment_date": "2024-01-20",
  "payment_method": "transfer",
  "bank_account_id": "uuid",
  "reference_number": "REF123456",
  "allocations": [
    {
      "document_id": "uuid",
      "amount": 1070.00,
      "wht_amount": 0
    }
  ],
  "notes": "รับชำระจากลูกค้า"
}
```

### 7.4 Create Payment (Pay)
```http
POST /companies/:companyId/payments/pay
```

**Request Body:**
```json
{
  "contact_id": "uuid",
  "payment_date": "2024-01-20",
  "payment_method": "transfer",
  "bank_account_id": "uuid",
  "reference_number": "REF123456",
  "allocations": [
    {
      "document_id": "uuid",
      "amount": 10000.00,
      "wht_amount": 300.00,
      "wht_rate": 3
    }
  ],
  "notes": "จ่ายชำระเจ้าหนี้"
}
```

### 7.5 Void Payment
```http
POST /companies/:companyId/payments/:id/void
```

### 7.6 Get Outstanding Documents (for payment)
```http
GET /companies/:companyId/contacts/:contactId/outstanding
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | receivable, payable |

---

## 📒 8. Chart of Accounts

### 8.1 List Accounts
```http
GET /companies/:companyId/accounts
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | 1-5 (asset, liability, equity, revenue, expense) |
| is_active | boolean | สถานะ |
| search | string | ค้นหารหัส/ชื่อ |

### 8.2 Get Account
```http
GET /companies/:companyId/accounts/:id
```

### 8.3 Create Account
```http
POST /companies/:companyId/accounts
```

**Request Body:**
```json
{
  "account_type_id": "uuid",
  "parent_id": "uuid",
  "code": "1100",
  "name": "เงินสดและเงินฝากธนาคาร",
  "name_en": "Cash and Bank",
  "is_header": true
}
```

### 8.4 Update Account
```http
PUT /companies/:companyId/accounts/:id
```

### 8.5 Delete Account
```http
DELETE /companies/:companyId/accounts/:id
```

### 8.6 Get Account Ledger
```http
GET /companies/:companyId/accounts/:id/ledger
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| from_date | date | วันที่เริ่มต้น |
| to_date | date | วันที่สิ้นสุด |

### 8.7 Get Trial Balance
```http
GET /companies/:companyId/accounts/trial-balance
```

---

## 📊 9. Journal Entries

### 9.1 List Journal Entries
```http
GET /companies/:companyId/journal-entries
```

### 9.2 Get Journal Entry
```http
GET /companies/:companyId/journal-entries/:id
```

### 9.3 Create Journal Entry (Manual)
```http
POST /companies/:companyId/journal-entries
```

**Request Body:**
```json
{
  "entry_date": "2024-01-31",
  "description": "ปรับปรุงรายการสิ้นเดือน",
  "lines": [
    {
      "account_id": "uuid",
      "debit_amount": 1000.00,
      "credit_amount": 0,
      "description": "ค่าเสื่อมราคา"
    },
    {
      "account_id": "uuid",
      "debit_amount": 0,
      "credit_amount": 1000.00,
      "description": "ค่าเสื่อมราคาสะสม"
    }
  ]
}
```

### 9.4 Reverse Journal Entry
```http
POST /companies/:companyId/journal-entries/:id/reverse
```

---

## 📦 10. Inventory

### 10.1 List Warehouses
```http
GET /companies/:companyId/warehouses
```

### 10.2 Get Stock Balance
```http
GET /companies/:companyId/inventory/balance
```

### 10.3 Get Stock Movements
```http
GET /companies/:companyId/inventory/movements
```

### 10.4 Create Stock Adjustment
```http
POST /companies/:companyId/inventory/adjustments
```

**Request Body:**
```json
{
  "warehouse_id": "uuid",
  "adjustment_date": "2024-01-31",
  "reason": "ตรวจนับสต็อกประจำเดือน",
  "lines": [
    {
      "product_id": "uuid",
      "quantity_change": -5,
      "reason": "สินค้าเสียหาย"
    }
  ]
}
```

### 10.5 Create Stock Transfer
```http
POST /companies/:companyId/inventory/transfers
```

---

## 💵 11. Tax

### 11.1 Get VAT Report
```http
GET /companies/:companyId/tax/vat
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| month | number | เดือน (1-12) |
| year | number | ปี (พ.ศ. หรือ ค.ศ.) |

### 11.2 Get Input Tax Report
```http
GET /companies/:companyId/tax/vat/input
```

### 11.3 Get Output Tax Report
```http
GET /companies/:companyId/tax/vat/output
```

### 11.4 Export VAT Report (PP.30)
```http
GET /companies/:companyId/tax/vat/export
```

### 11.5 List WHT Certificates
```http
GET /companies/:companyId/tax/wht
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | issued, received |
| month | number | เดือน |
| year | number | ปี |

### 11.6 Get WHT Certificate
```http
GET /companies/:companyId/tax/wht/:id
```

### 11.7 Create WHT Certificate
```http
POST /companies/:companyId/tax/wht
```

### 11.8 Export WHT Report (PND.3/53)
```http
GET /companies/:companyId/tax/wht/export
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| form | string | pnd3, pnd53 |
| month | number | เดือน |
| year | number | ปี |

### 11.9 Get Tax Calendar
```http
GET /companies/:companyId/tax/calendar
```

---

## 👥 12. Payroll

### 12.1 List Employees
```http
GET /companies/:companyId/employees
```

### 12.2 Get Employee
```http
GET /companies/:companyId/employees/:id
```

### 12.3 Create Employee
```http
POST /companies/:companyId/employees
```

### 12.4 Update Employee
```http
PUT /companies/:companyId/employees/:id
```

### 12.5 List Payroll Periods
```http
GET /companies/:companyId/payroll
```

### 12.6 Get Payroll Period
```http
GET /companies/:companyId/payroll/:id
```

### 12.7 Create Payroll Period
```http
POST /companies/:companyId/payroll
```

**Request Body:**
```json
{
  "period_month": 1,
  "period_year": 2024,
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "payment_date": "2024-01-31"
}
```

### 12.8 Calculate Payroll
```http
POST /companies/:companyId/payroll/:id/calculate
```

### 12.9 Update Payroll Entry
```http
PUT /companies/:companyId/payroll/:id/entries/:entryId
```

### 12.10 Approve Payroll
```http
POST /companies/:companyId/payroll/:id/approve
```

### 12.11 Export Bank File
```http
GET /companies/:companyId/payroll/:id/export/bank
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| bank | string | scb, kbank, bbl, ktb |

### 12.12 Export SSO File
```http
GET /companies/:companyId/payroll/:id/export/sso
```

### 12.13 Send Payslips
```http
POST /companies/:companyId/payroll/:id/send-payslips
```

### 12.14 Get Payslip PDF
```http
GET /companies/:companyId/payroll/:periodId/entries/:entryId/payslip
```

---

## 📊 13. Reports

### 13.1 Financial Statements

#### Balance Sheet
```http
GET /companies/:companyId/reports/balance-sheet
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| as_of_date | date | ณ วันที่ |
| compare_period | string | previous_month, previous_year |

#### Profit & Loss
```http
GET /companies/:companyId/reports/profit-loss
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| from_date | date | วันที่เริ่มต้น |
| to_date | date | วันที่สิ้นสุด |
| compare_period | string | previous_period, previous_year |

#### Cash Flow Statement
```http
GET /companies/:companyId/reports/cash-flow
```

#### Trial Balance
```http
GET /companies/:companyId/reports/trial-balance
```

### 13.2 Operational Reports

#### Accounts Receivable Aging
```http
GET /companies/:companyId/reports/ar-aging
```

#### Accounts Payable Aging
```http
GET /companies/:companyId/reports/ap-aging
```

#### Sales Summary
```http
GET /companies/:companyId/reports/sales-summary
```

#### Purchase Summary
```http
GET /companies/:companyId/reports/purchase-summary
```

#### Inventory Valuation
```http
GET /companies/:companyId/reports/inventory-valuation
```

### 13.3 Export Reports
```http
GET /companies/:companyId/reports/:reportType/export
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| format | string | pdf, excel, csv |

---

## 📱 14. Dashboard

### 14.1 Get Dashboard Summary
```http
GET /companies/:companyId/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "from_date": "2024-01-01",
      "to_date": "2024-01-31"
    },
    "revenue": {
      "total": 500000,
      "change_percent": 12.5
    },
    "expenses": {
      "total": 350000,
      "change_percent": -5.2
    },
    "profit": {
      "total": 150000,
      "margin_percent": 30
    },
    "cash_balance": 250000,
    "receivables": {
      "total": 180000,
      "overdue": 25000
    },
    "payables": {
      "total": 120000,
      "due_this_week": 45000
    },
    "recent_transactions": [ ... ],
    "pending_approvals": [ ... ],
    "upcoming_due_dates": [ ... ]
  }
}
```

### 14.2 Get Cash Flow Forecast
```http
GET /companies/:companyId/dashboard/cash-flow-forecast
```

### 14.3 Get Top Customers
```http
GET /companies/:companyId/dashboard/top-customers
```

### 14.4 Get Top Products
```http
GET /companies/:companyId/dashboard/top-products
```

---

## 🔔 15. Notifications

### 15.1 List Notifications
```http
GET /notifications
```

### 15.2 Mark as Read
```http
POST /notifications/:id/read
```

### 15.3 Mark All as Read
```http
POST /notifications/read-all
```

### 15.4 Get Notification Settings
```http
GET /users/:userId/notification-settings
```

### 15.5 Update Notification Settings
```http
PUT /users/:userId/notification-settings
```

---

## 🔍 16. Search

### 16.1 Global Search
```http
GET /companies/:companyId/search
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| q | string | คำค้นหา |
| types | string[] | contacts, products, documents |
| limit | number | จำนวนผลลัพธ์ |

**Response:**
```json
{
  "success": true,
  "data": {
    "contacts": [
      { "id": "uuid", "name": "...", "type": "customer" }
    ],
    "products": [
      { "id": "uuid", "name": "...", "code": "SKU001" }
    ],
    "documents": [
      { "id": "uuid", "document_number": "INV-2024-0001", "type": "invoice" }
    ]
  }
}
```

---

## 📤 17. Import/Export

### 17.1 Get Import Template
```http
GET /companies/:companyId/import/:entityType/template
```

### 17.2 Validate Import File
```http
POST /companies/:companyId/import/:entityType/validate
Content-Type: multipart/form-data
```

### 17.3 Execute Import
```http
POST /companies/:companyId/import/:entityType/execute
```

### 17.4 Export Data
```http
GET /companies/:companyId/export/:entityType
```

---

## 🔧 18. Webhooks

### 18.1 List Webhooks
```http
GET /companies/:companyId/webhooks
```

### 18.2 Create Webhook
```http
POST /companies/:companyId/webhooks
```

**Request Body:**
```json
{
  "url": "https://your-server.com/webhook",
  "events": ["document.created", "payment.received"],
  "secret": "your_webhook_secret"
}
```

### 18.3 Update Webhook
```http
PUT /companies/:companyId/webhooks/:id
```

### 18.4 Delete Webhook
```http
DELETE /companies/:companyId/webhooks/:id
```

### 18.5 Test Webhook
```http
POST /companies/:companyId/webhooks/:id/test
```

---

## 📊 Rate Limiting

| Plan | Requests/minute | Requests/day |
|------|-----------------|--------------|
| Free | 30 | 1,000 |
| Starter | 60 | 5,000 |
| Pro | 120 | 20,000 |
| Enterprise | 300 | Unlimited |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640000000
```

---

## 🔐 API Security Best Practices

1. **Always use HTTPS**
2. **Validate JWT tokens** on every request
3. **Check company access** - user must have access to company
4. **Validate permissions** - check role permissions for actions
5. **Log all API calls** in audit log
6. **Sanitize inputs** - prevent SQL injection, XSS
7. **Rate limiting** - prevent abuse

---

## 📝 Changelog

### v1.0.0 (Initial Release)
- Core authentication
- Contacts, Products, Documents
- Payments and Journal Entries
- Basic Reports

### v1.1.0 (Coming Soon)
- Inventory Management
- Payroll Module
- Advanced Tax Features
- API Webhooks

