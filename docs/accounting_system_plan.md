# Professional Accounting System Plan (แผนพัฒนาระบบบัญชีบริหารธุรกิจครบวงจร)

เอกสารนี้รวบรวมฟีเจอร์และโครงสร้างระบบสำหรับการพัฒนา Web Application บัญชีสำหรับมืออาชีพ (SaaS หรือ Enterprise Internal Use) โดยเน้นความถูกต้องตามมาตรฐานการบัญชีและรองรับระบบภาษีของประเทศไทย

## 1. ภาพรวมระบบ (System Overview)
ระบบถูกออกแบบมาให้เป็น **Double-entry Bookkeeping System** (ระบบบัญชีคู่) ที่เชื่อมโยงข้อมูลจากทุกส่วนงานเข้าสู่สมุดบัญชีแยกประเภท (General Ledger) โดยอัตโนมัติ

**จุดเด่นสำคัญ:** เน้นการออกแบบ **User-Centric Design** ที่เป็นมิตรกับผู้ใช้งานทั่วไป (Non-Accountant Friendly) โดยลดความซับซ้อนของศัพท์บัญชี และใช้ Flow การทำงานที่เข้าใจง่าย เพื่อให้เจ้าของธุรกิจสามารถใช้งานได้จริงโดยไม่ต้องมีความรู้บัญชีลึกซึ้ง

### กลุ่มผู้ใช้งาน (Target Users)
- **Business Owner:** ดู Dashboard, อนุมัติเอกสาร, ดูงบกำไรขาดทุน (ใช้งานง่าย เน้นภาพรวม)
- **Accountant:** บันทึกบัญชี, ปรับปรุงรายการ (JV), ปิดงบ, จัดการภาษี (เครื่องมือครบ มืออาชีพ)
- **HR:** จัดการเงินเดือน, ประกันสังคม
- **Auditor:** ตรวจสอบ Transaction, ดู Audit Log

---

## 2. กลยุทธ์ด้านประสบการณ์ผู้ใช้งาน (UX/UI Strategy for Non-Accountants)
เพื่อให้ระบบ "ใช้งานง่าย" สำหรับผู้ที่ไม่ใช่นักบัญชี ระบบจะถูกออกแบบภายใต้แนวคิด **"Invisible Accounting"** คือการซ่อนความซับซ้อนทางบัญชีไว้เบื้องหลังการทำงานปกติ

### 2.1 Smart Wizards & Guided Flows (ระบบนำทางอัจฉริยะ)
- **Onboarding Wizard:** ระบบสอบถามประเภทธุรกิจ (บริการ/ซื้อมาขายไป/ผลิต) และจดทะเบียนภาษีหรือไม่ เพื่อตั้งค่าผังบัญชีและภาษีให้อัตโนมัติทันทีที่เริ่มใช้งาน
- **Document Flow Navigator:** แสดงสถานะเอกสารเป็นแผนภาพ (Visual Pipeline) เช่น ใบเสนอราคา -> รออนุมัติ -> ส่งลูกค้า -> รอเก็บเงิน -> เก็บเงินแล้ว ให้ผู้ใช้รู้ว่าต้องทำอะไรต่อ
- **Step-by-Step Forms:** แบ่งการกรอกข้อมูลยาวๆ เป็นขั้นตอนย่อย (Step 1: ข้อมูลลูกค้า, Step 2: รายการสินค้า, Step 3: การชำระเงิน) ลดความสับสน

### 2.2 Business Language Interface (ลดศัพท์เทคนิค)
- ใช้ภาษาธุรกิจแทนศัพท์บัญชีในหน้าจอหลัก เช่น:
  - "ลูกหนี้การค้า" -> "ลูกค้าที่ยังไม่จ่ายเงิน" (Unpaid Customers)
  - "เจ้าหนี้การค้า" -> "บิลที่ต้องจ่าย" (Bills to Pay)
  - "เดบิต/เครดิต" -> "รับเงิน/จ่ายเงิน" (Money In/Out) ในหน้าบันทึกทั่วไป
- **Auto-GL Mapping:** ผู้ใช้เลือกแค่ "ซื้อค่าอุปกรณ์สำนักงาน" ระบบจะบันทึก Dr. วัสดุสิ้นเปลือง / Cr. เงินสด/เจ้าหนี้ ให้อัตโนมัติ

### 2.3 Intelligent Automation & Defaults (ระบบช่วยคิด)
- **Auto-Fill:** จดจำรายการที่ใช้บ่อย และดึงข้อมูลเดิมมาเติมให้
- **OCR Integration:** (Phase ถัดไป) ถ่ายรูปบิล ระบบอ่านค่า วันที่ ยอดเงิน และชื่อร้านค้าให้
- **Smart Validation:** แจ้งเตือนภาษามนุษย์เมื่อกรอกผิด เช่น "ยอดเงินรับชำระ เกินกว่ายอดในใบแจ้งหนี้" แทน Error Code

---

## 3. โมดูลหลัก (Core Modules)

### 3.1 ระบบจัดการข้อมูลพื้นฐาน (Master Data)
- **Chart of Accounts (ผังบัญชี):** รองรับมาตรฐาน 5 หมวด (สินทรัพย์, หนี้สิน, ทุน, รายได้, ค่าใช้จ่าย) สามารถ Customize เลขที่บัญชีได้
- **Contact Management:** ทะเบียนลูกค้า (Debtors) และ ผู้จำหน่าย (Creditors) พร้อมระบบตรวจสอบเลขผู้เสียภาษี (Tax ID Verification)
- **Product/Service:** สินค้า, บริการ, SKU, หน่วยนับ, ราคามาตรฐาน

### 3.2 ระบบรายได้และลูกหนี้ (Revenue & Accounts Receivable)
- **Flow:** ใบเสนอราคา (Quotation) -> ใบวางบิล (Billing Note) -> ใบแจ้งหนี้ (Invoice) -> ใบเสร็จรับเงิน (Receipt) -> ใบกำกับภาษี (Tax Invoice)
- รองรับการขายสด และขายเชื่อ
- รองรับใบลดหนี้ (Credit Note) / ใบเพิ่มหนี้ (Debit Note)
- ระบบติดตามหนี้ (Aging Report)

### 3.3 ระบบรายจ่ายและเจ้าหนี้ (Expense & Accounts Payable)
- **Flow:** ใบขอซื้อ (PR) -> ใบสั่งซื้อ (PO) -> บันทึกรับสินค้า/ตั้งเจ้าหนี้ -> จ่ายชำระหนี้
- บันทึกค่าใช้จ่ายเงินสดย่อย (Petty Cash)
- ระบบจัดการค่าใช้จ่ายพนักงาน (Expense Claims) พร้อมแนบไฟล์สลิป

### 3.4 ระบบบัญชีแยกประเภท (General Ledger)
- **Journal Voucher (JV):** สมุดรายวันทั่วไป สำหรับรายการปรับปรุง
- **Automatic Posting:** การลงบัญชีอัตโนมัติจากโมดูล AR/AP/Payroll
- **Fixed Assets:** ทะเบียนทรัพย์สิน และการคำนวณค่าเสื่อมราคา (Depreciation) อัตโนมัติ (Straight Line, Declining Balance)

### 3.5 ระบบภาษี (Taxation - Thai Localization)
- **VAT (ภาษีมูลค่าเพิ่ม):**
  - รายงานภาษีซื้อ (Input Tax Report)
  - รายงานภาษีขาย (Output Tax Report)
  - แบบ ภ.พ. 30 (P.P.30)
- **Withholding Tax (ภาษีหัก ณ ที่จ่าย):**
  - ออกหนังสือรับรอง 50 ทวิ
  - สรุปยื่นแบบ ภ.ง.ด. 3, 53 (P.N.D. 3, 53)
- **Corporate Tax:** เตรียมข้อมูลสำหรับ ภ.ง.ด. 50/51

### 3.6 ระบบธนาคารและการเงิน (Banking & Cash)
- Bank Reconciliation (กระทบยอดเงินฝากธนาคาร)
- รองรับการ Import Bank Statement (CSV/Excel)
- Cheque Management (ทะเบียนเช็ครับ/จ่าย)

### 3.7 ระบบอัตโนมัติและการเชื่อมต่อ (Automation & Connectivity) - *New!*
- **E-Commerce Sync:** เชื่อมต่อ API (Shopee, Lazada, TikTok Shop) ดึงออเดอร์มาสร้างใบกำกับภาษีและตัดสต็อกอัตโนมัติ
- **Recurring Invoices:** ตั้งเวลาออกเอกสารซ้ำรายเดือนอัตโนมัติ (สำหรับธุรกิจค่าเช่า, ค่าบริการ, SaaS)
- **Smart Notifications:** แจ้งเตือนผ่าน LINE OA / Email (เตือนอนุมัติ, เตือนลูกหนี้ครบกำหนด, สรุปยอดขายรายวัน)

### 3.8 ระบบบริหารจัดการเอกสาร (Document Management System - DMS) - *Critical!*
- **Digital Attachment:** รองรับการแนบไฟล์ (PDF, JPG, PNG) ในทุก Transaction (เช่น แนบบิลค่าไฟในใบสำคัญจ่าย)
- **Auto-Filing Structure:** ระบบจัดเก็บไฟล์เข้าโฟลเดอร์อัตโนมัติตาม ปี > เดือน > ประเภทเอกสาร (พร้อมให้เรียกดู/ดาวน์โหลดได้ทันทีเมื่อสรรพากรตรวจ)
- **e-Tax Invoice & e-Receipt:** รองรับการสร้าง, ลงลายมือชื่อดิจิทัล (Digital Signature), และส่งอีเมลหาลูกค้า พร้อมเก็บ Log ตามมาตรฐานสรรพากร (ข. 20)
- **Document Versioning:** เก็บประวัติเวอร์ชันของเอกสาร หากมีการแก้ไข (Revision History)

### 3.9 ระบบอนุมัติเอกสาร (Advanced Approval Workflow)
- **Custom Approval Rules:** ตั้งเงื่อนไขการอนุมัติตามวงเงินได้ (เช่น PO < 5,000 อนุมัติอัตโนมัติ, > 50,000 ต้องให้ MD อนุมัติ)
- **Multi-level Approval:** รองรับสายการอนุมัติหลายระดับ (Requester -> Manager -> Finance -> Director)
- **Mobile Approval:** ผู้มีอำนาจสามารถกด "อนุมัติ/ไม่อนุมัติ" ได้ผ่านมือถือ หรือลิงก์ใน Email/LINE

### 3.10 ระบบจัดการวงจรเอกสาร (Document Lifecycle & Creation) - *User Favorite*
- **Professional Templates:** มีเทมเพลตเอกสารมาตรฐานให้เลือกหลายแบบ (Modern/Classic) สามารถใส่ Logo, ลายเซ็น, และปรับสีตาม CI บริษัทได้
- **One-Click Conversion:** แปลงสถานะเอกสารต่อเนื่องได้ทันทีโดยไม่ต้องคีย์ใหม่ (เช่น คลิก "Convert" ที่ใบเสนอราคา -> สร้างเป็นใบแจ้งหนี้ทันที)
- **Status Tracking:** ติดตามสถานะเอกสารได้ละเอียด (Draft -> Awaiting Approval -> Approved -> Sent -> Viewed -> Paid -> Overdue -> Voided)
- **Activity Log:** บันทึกประวัติการส่งเอกสาร (เช่น "ส่งอีเมลหาลูกค้าเมื่อ...", "ลูกค้าเปิดอ่านใบเสนอราคาเมื่อ...") ช่วยให้เซลล์ติดตามงานง่ายขึ้น
- **Print & Share:** สั่งพิมพ์เป็น PDF, ส่ง Email จากระบบ, หรือสร้าง Public Link ส่งทาง LINE ให้ลูกค้าดาวน์โหลดเองได้

### 3.11 การตั้งค่าขั้นสูง (Advanced Configuration - Match & Exceed Competitors)
- **Price Lists & VAT Options:** ตั้งค่าราคาสินค้าได้หลายระดับ (ปลีก/ส่ง/Member) และเลือกได้ว่าเป็นราคารวม VAT หรือแยก VAT
- **Running Number Flexibility:** ปรับรูปแบบเลขที่เอกสารได้อิสระ (เช่น INV-{YY}{MM}-{RUN}) และแยก Series ตามสาขาได้
- **Duplicate Control:** ตั้งค่าได้ว่าจะอนุญาตให้สร้างชื่อลูกค้า/สินค้าซ้ำกันได้หรือไม่ (ป้องกันข้อมูลขยะ)
- **Lock Period:** ล็อกงวดบัญชีห้ามแก้ไขย้อนหลัง (รายเดือน/รายปี) เพื่อป้องกันตัวเลขเปลี่ยนหลังจากส่งงบแล้ว

### 3.12 Partner Ecosystem (ระบบสำนักงานบัญชีพันธมิตร)
- **Accountant Connect:** เมนูสำหรับค้นหาและเชื่อมต่อกับสำนักงานบัญชีที่ใช้ระบบเดียวกัน
- **Audit Tools:** เครื่องมือพิเศษสำหรับนักบัญชี (Batch Edit, Reclassify) ที่ช่วยให้ตรวจสอบงานลูกค้าได้เร็วกว่าคู่แข่ง

### 3.13 ระบบเงินทดรองและมัดจำ (Advance & Deposit) - *เก็บตกรายละเอียดสำคัญ*
- **Advance Payment (เงินทดรองจ่าย):** ระบบเบิกเงินล่วงหน้าสำหรับพนักงาน (Clearance Form) พร้อมระบบหักล้างยอดเมื่อนำบิลมาเคลียร์
- **Deposit (เงินมัดจำ):** รองรับ Flow รับ/จ่ายเงินมัดจำ และการ "ตัดมัดจำ" เมื่อออกใบแจ้งหนี้งวดสุดท้าย
- **Withholding Tax Receivable (ภาษีถูกหัก ณ ที่จ่าย):** บันทึกรายการที่เราถูกลูกค้าหักภาษี ไว้สำหรับทำรายงานขอคืนภาษีประจำปี

### 3.14 ระบบบริหารจัดการสต็อกละเอียด (Advanced Inventory)
- **Stock Adjustment (ใบปรับปรุงยอด):** บันทึกการเบิกสินค้าไปใช้ภายใน, สินค้าชำรุด, หรือสินค้าสูญหาย (นอกจากแค่ซื้อ/ขาย)
- **Asset Purchasing:** แยก Flow "ซื้อทรัพย์สิน" ออกจาก "ซื้อสินค้า" เพื่อให้บันทึกเข้าบัญชีทรัพย์สินและคำนวณค่าเสื่อมได้ถูกต้องทันที

### 3.15 ระบบติดตามการรับ-ส่งเอกสาร (Smart Delivery & Collection Tracking) - *New!*
- **Multi-channel Sending:** ส่งเอกสารให้ลูกค้าได้ทันทีผ่าน Email, SMS, หรือ LINE OA พร้อมแนบลิงก์ดาวน์โหลด PDF
- **Read Status Tracking:** ติดตามสถานะการส่งละเอียด: Sent (ส่งแล้ว) -> Delivered (ถึงแล้ว) -> **Opened (เปิดดูแล้ว)** -> Downloaded (ดาวน์โหลดแล้ว)
- **Original Document Tracking (ติดตามเอกสารตัวจริง):** ระบบช่วยเตือนติดตามเอกสารสำคัญที่ต้องใช้ตัวจริง
    - **WHT Collection:** ติดตาม "ใบหัก ณ ที่จ่าย" จากลูกค้า (ระบบเตือนถ้าจ่ายเงินมาแล้วแต่ยังไม่ส่งใบหักภาษีตัวจริงมา)
    - **Billing Note Tracking:** ติดตามว่าแมสเซนเจอร์เอาใบวางบิลไปวางแล้ว ได้รับลายเซ็นรับวางบิลกลับมาหรือยัง

### 3.16 รายละเอียดเล็กน้อยที่สร้างความแตกต่าง (Micro-Features & Usability) - *God is in the details*
- **Flexible Discount:** รองรับส่วนลดทั้งแบบ % และบาท, ส่วนลดรายสินค้า (Line Item) และส่วนลดท้ายบิล (Subtotal), รวมถึงเลือกได้ว่าลดก่อน/หลัง VAT
- **Address Intelligence:** 1 ลูกค้าเก็บที่อยู่ได้หลายแบบ (สำนักงานใหญ่/สาขา/ที่อยู่ส่งของ/ที่อยู่วางบิล) และดึงมาใช้ได้ถูกต้องตามประเภทเอกสาร
- **Rounding Adjustment (จัดการเศษสตางค์):** ระบบปัดเศษทศนิยมให้อัตโนมัติตามหลักสรรพากร และมีปุ่ม "ปัดเศษรับชำระ" เพื่อเคลียร์ยอดเศษสตางค์ (เช่น ยอด 100.02 จ่ายมา 100) ลงบัญชีให้อัตโนมัติ
- **Default Remarks:** ตั้งค่าหมายเหตุมาตรฐานได้ตามประเภทเอกสาร (เช่น ใบเสนอราคา -> แสดงเงื่อนไขยืนยันราคา, ใบแจ้งหนี้ -> แสดงเลขบัญชีธนาคาร)
- **Void Protection:** ป้องกันการ "ลบ" เอกสารที่รันเลขแล้ว ให้ทำได้เพียง "ยกเลิก (Void)" เพื่อไม่ให้เลขที่เอกสารกระโดด (ป้องกันปัญหากับสรรพากร)

### 3.17 รายละเอียดเล็กน้อยเพิ่มเติม (Micro-Features Part 2) - *The Devil is in the Details*
- **VAT Classification:** แยกชัดระหว่าง VAT 7%, VAT 0% (ส่งออก/BOI), และ Non-VAT เพื่อให้รายงานภาษีถูกต้อง
- **Copy Document:** ปุ่มคัดลอกเอกสาร -> สร้างเอกสารใหม่จากเอกสารเดิมในคลิกเดียว (เปลี่ยนวันที่/เลขที่ ข้อมูลอื่นเหมือนเดิม)
- **Ad-hoc Item:** รองรับ "Free Text Item" พิมพ์ชื่อสินค้าและราคาได้เลยโดยไม่ต้องสร้าง Master (สำหรับของที่ขายครั้งเดียว)
- **Multi-rate WHT per Line:** รองรับการหัก ณ ที่จ่ายหลายอัตราในบิลเดียว (เช่น ค่าเช่า 5% + ค่าบริการ 3%)
- **Dual Document Number:** ตั้งค่าได้ว่าจะใช้เลข Invoice = เลขใบกำกับภาษี หรือแยก 2 ชุด
- **Pre-Due Reminder:** แจ้งเตือน "ก่อน" ครบกำหนดชำระ (3 วัน, 7 วัน) ไม่ใช่แค่เตือนตอน Overdue
- **Installment Tracking:** รองรับการแบ่งชำระเป็นงวด และแสดง "งวดที่ 1/3" บนเอกสาร พร้อมประวัติการชำระแต่ละงวด
- **Combine Documents:** รวมเอกสารหลายใบเป็นใบเดียว (เช่น ใบส่งของ 5 ใบ -> ใบแจ้งหนี้ 1 ใบ)
- **Multi-unit Conversion:** ตั้งค่าการแปลงหน่วย (เช่น 1 ลัง = 12 ชิ้น) ระบบตัดสต็อกถูกต้องทั้ง 2 หน่วย
- **Bilingual Documents:** เลือก Template ภาษาไทย/อังกฤษ/ทั้งคู่ ได้ตอนออกเอกสาร

### 3.18 ระบบปรับแต่งเอกสารขั้นสูง (Advanced Document Designer) - *Design like a Pro*
- **Drag & Drop Editor:** เครื่องมือออกแบบเอกสารแบบลากวาง (เหมือน Canva) ให้ผู้ใช้จัดตำแหน่ง Logo, ที่อยู่, และตารางสินค้าได้เอง
- **Theme Gallery & Customization:** มีธีมสำเร็จรูปสวยงามให้เลือก และสามารถเปลี่ยนสี (Color Palette), ฟอนต์ (Google Fonts: Prompt, Sarabun), และขนาดตัวอักษรได้ตาม CI บริษัท
- **Dynamic Column Control:** เลือก ซ่อน/แสดง คอลัมน์ในตารางได้อิสระ (เช่น ใบส่งของ -> ซ่อนราคา, ใบแจ้งหนี้ -> แสดงส่วนลดแยกรายบรรทัด)
- **Digital Signature & Stamp:** อัปโหลดลายเซ็นและตราประทับบริษัท จัดวางตำแหน่งได้อิสระ พร้อมระบบ Conditional Logic (เช่น ยอดเกิน 1 แสน ต้องมีลายเซ็น MD)
- **Custom Paper Size:** รองรับขนาดกระดาษหลากหลาย (A4, A5, กระดาษต่อเนื่อง, สลิปความร้อน 80mm)

### 3.19 ระบบภาษีขั้นสูง (Advanced Tax Features) - *Tax Made Easy*
- **WHT Rate Presets:** มีอัตราภาษีหัก ณ ที่จ่ายสำเร็จรูปให้เลือก (1% ขนส่ง, 2% โฆษณา, 3% บริการ, 5% เช่า, 10% ปันผล) และผูกกับประเภทค่าใช้จ่ายเพื่อ Auto-suggest
- **P.N.D.54 (จ่ายต่างประเทศ):** รองรับการหักภาษี 15% สำหรับค่าบริการที่จ่ายให้บริษัทต่างประเทศ พร้อมสร้างแบบ ภ.ง.ด.54
- **Full vs Abbreviated Tax Invoice:** เลือกออกใบกำกับภาษีเต็มรูป (B2B) หรืออย่างย่อ (ขายปลีก) ได้ตามประเภทธุรกิจ
- **Non-deductible Input VAT:** Checkbox "ภาษีซื้อใช้ไม่ได้" สำหรับค่าใช้จ่ายที่ไม่สามารถนำภาษีซื้อมาเครดิตได้ (เช่น ค่ารับรอง, รถยนต์นั่ง)
- **6-Month VAT Alert:** แจ้งเตือนใบกำกับภาษีซื้อที่ใกล้หมดอายุ 6 เดือน (ต้องรีบนำมาเครดิต)
- **VAT Refund Options:** เมื่อภาษีซื้อ > ภาษีขาย เลือกได้ว่าจะ "ขอคืน" หรือ "ยกไปเครดิตเดือนถัดไป"
- **Tax Calendar & Reminders:** ปฏิทินภาษีแสดงกำหนดยื่นทุกประเภท (ภ.พ.30, ภ.ง.ด.3/53, ประกันสังคม) พร้อมแจ้งเตือนล่วงหน้า 3-7 วัน
- **Tax Estimation:** AI ประมาณการภาษีนิติบุคคลที่ต้องจ่ายสิ้นปี จากกำไรปัจจุบัน เพื่อช่วยวางแผนการเงิน (เตรียมเงินไว้จ่าย ภ.ง.ด.51/50)
- **E-filing Ready:** Export ไฟล์พร้อมยื่นผ่านระบบ rd.go.th (สรรพากร) และ sso.go.th (ประกันสังคม)

### 3.20 รายละเอียดปลีกย่อยแยกตามโมดูล (Module-specific Micro-Features) - *Polish & Delight*

#### Contact Management (ลูกค้า/Vendor)
- **Credit Term per Contact:** กำหนดเครดิตต่างกันได้แต่ละราย (30/45/60 วัน)
- **Credit Limit Alert:** ตั้งวงเงินขายสูงสุด และเตือนเมื่อขายเกินวงเงิน
- **Tags/Labels:** ติด Tag จัดกลุ่มลูกค้าได้ (VIP, ขายส่ง, รายย่อย)
- **Birthday Reminder:** เก็บวันเกิดลูกค้า ระบบเตือนให้ส่งอวยพร (CRM touch)
- **Blacklist Flag:** Flag ลูกค้าที่มีปัญหา (ค้างชำระ/เบี้ยวหนี้)

#### Products & Inventory (สินค้า/สต็อก)
- **Barcode Support:** เก็บ Barcode และสแกนขายได้
- **Product Images:** แนบรูปสินค้าได้ (แสดงในเอกสารได้)
- **Min Stock Alert:** เตือนเมื่อสินค้าต่ำกว่า Safety Stock
- **Bundle/Kit:** สินค้าชุด (ขาย 1 ชุด ตัดสต็อกหลายรายการ)
- **Serial/Lot Tracking:** ติดตามสินค้าตาม Serial Number หรือ Lot ได้
- **Expiry Date Alert:** เตือนสินค้าใกล้หมดอายุ (สำคัญสำหรับอาหาร/ยา)

#### Payment (การชำระเงิน)
- **Partial Payment:** รับชำระบางส่วนได้ (บิล 10,000 รับก่อน 5,000)
- **Batch Payment:** รับชำระหลายบิลพร้อมกัน (ลูกค้าโอนมารวม 1 ก้อน)
- **Multi-method Payment:** บิลเดียวจ่ายหลายช่องทาง (เงินสด + โอน + บัตร)
- **Bank Fee Recording:** บันทึกค่าธรรมเนียมธนาคาร/บัตรเครดิตแยกได้
- **PromptPay QR on Invoice:** แสดง QR จ่ายเงินบนใบแจ้งหนี้

#### Document Features (เอกสาร)
- **Drag & Drop Reorder:** ลากเรียงลำดับรายการสินค้าในเอกสารได้
- **Clone Line Items:** Copy รายการจากเอกสารเก่ามาใช้ได้
- **Batch Print/Email:** พิมพ์/ส่งหลายใบพร้อมกัน
- **Link Expiry:** ตั้งวันหมดอายุของ Public Link ได้
- **Draft Watermark:** เอกสาร Draft แสดงลายน้ำ "DRAFT" ชัดเจน

#### Notifications (แจ้งเตือน)
- **Multi-channel:** เลือกรับแจ้งเตือนทาง Email / LINE / In-App / SMS
- **Frequency Control:** ปรับความถี่ได้ (ทันที / สรุปรายวัน / รายสัปดาห์)
- **Daily Digest Email:** สรุปยอดขาย/ค่าใช้จ่ายส่งให้ทุกเช้า
- **Smart Mute:** ปิดแจ้งเตือนช่วงนอกเวลางานได้

#### Search & Productivity (ค้นหาและประสิทธิภาพ)
- **Global Search:** ค้นหาได้ทุกอย่างจากช่องเดียว (ลูกค้า, เลขบิล, ยอดเงิน)
- **Saved Filters:** บันทึก Filter ที่ใช้บ่อยได้ (เช่น "ลูกหนี้เกิน 30 วัน")
- **Recent Items:** แสดงรายการที่เพิ่งใช้งาน เข้าถึงได้เร็ว
- **Keyboard Shortcuts:** (Ctrl+N สร้างใหม่, Ctrl+S บันทึก, Ctrl+P พิมพ์)

#### Mobile Features (มือถือ)
- **Quick Approve:** กดอนุมัติจาก Push Notification ได้เลย (ไม่ต้องเปิด App)
- **Offline Mode:** บันทึกค่าใช้จ่ายได้แม้ไม่มีเน็ต (Sync ทีหลัง)
- **Home Screen Widget:** Widget แสดงยอดขาย/เงินสดวันนี้

#### Reports (รายงาน)
- **Multi-format Export:** Excel / PDF / CSV / Google Sheets
- **Scheduled Reports:** ตั้งเวลาส่งรายงานอัตโนมัติ (เช่น ทุกวันจันทร์ เช้า)
- **YoY Comparison:** เปรียบเทียบข้อมูลข้ามปีได้ในคลิกเดียว

#### Data Safety (ความปลอดภัยข้อมูล)
- **Recycle Bin:** เอกสารที่ลบไปยังกู้คืนได้ภายใน 30 วัน
- **Version History:** ดูประวัติการแก้ไขเอกสาร (ใครแก้อะไร เมื่อไหร่)
- **Full Data Export:** Export ข้อมูลทั้งหมดออกได้ (ไม่ Lock-in ลูกค้า)

### 3.21 ระบบรองรับความผิดพลาดและความยืดหยุ่น (Error Handling & Flexibility)

#### Error Prevention (ป้องกันความผิดพลาด)
- **Smart Validation:** ตรวจสอบข้อมูลก่อน Save (เลขประจำตัวผู้เสียภาษี, ยอดเงิน, วันที่)
- **Duplicate Detection:** เตือนเมื่อสร้างเอกสารซ้ำ (ลูกค้าเดียวกัน ยอดเดียวกัน วันใกล้กัน)
- **Preview Before Save:** แสดง Preview ข้อมูลสำคัญก่อนบันทึก
- **Required Field Highlight:** แสดงชัดเจนว่าฟิลด์ไหนต้องกรอก
- **Period Warning:** เตือนเมื่อวันที่เอกสารอยู่นอกงวดปัจจุบัน
- **Confirmation Dialog:** ถามยืนยันก่อนทำ Action สำคัญ (ลบ, Void, Post)
- **Auto-Lock Posted Documents:** เอกสารที่ Post แล้วแก้ไขไม่ได้ ต้อง Void

#### Error Recovery (กู้คืนจากความผิดพลาด)
- **Recycle Bin:** ลบแล้วกู้คืนได้ภายใน 30 วัน
- **Version History:** ดูประวัติการแก้ไข + Rollback ได้
- **Undo/Redo:** กด Ctrl+Z ย้อนกลับได้ก่อน Leave หน้า
- **Void & Recreate:** ยกเลิกเอกสารแล้วสร้างใหม่ (เก็บ Audit Trail)
- **Credit Note / Debit Note:** ปรับยอดบิลที่ออกไปแล้ว
- **Adjustment Entry:** บันทึกปรับปรุงแก้ไขรายการบัญชี
- **Reallocate Payment:** โยกเงินที่บันทึกผิดบิลไปบิลที่ถูกต้อง

#### Customer Flexibility (รองรับความเรื่องมากของลูกค้า)
- **Address Change:** เปลี่ยนที่อยู่ในบิลได้ก่อน Post
- **Split Invoice:** แยก 1 บิลเป็นหลายบิลได้
- **Combine Invoice:** รวมหลายบิลเป็น 1 บิลได้
- **Partial Return:** รับคืนสินค้าบางรายการ + Partial Refund
- **Price Adjustment:** ปรับราคาได้ก่อน Post หรือออก Credit Note
- **Due Date Extension:** ขยายวันครบกำหนด (with Approval)
- **Advance Payment / Deposit:** รับเงินล่วงหน้า ตัดยอดทีหลัง
- **Installment Tracking:** ติดตามการผ่อนชำระ

#### Payment Edge Cases (กรณีพิเศษทางการเงิน)
- **Overpayment Handling:** จ่ายเกิน → เก็บเป็น Credit Balance หรือ Refund
- **Underpayment Tracking:** จ่ายขาด → ติดตามยอดค้างชำระ
- **Batch Payment Allocation:** จ่ายรวมหลายบิล → แยกลงแต่ละบิลได้
- **Bank Fee Recording:** บันทึกค่าธรรมเนียมธนาคารแยก
- **Exchange Rate Adjustment:** บันทึกกำไร/ขาดทุนจากอัตราแลกเปลี่ยน

#### Smart Suggestions (ระบบช่วยคิด)
- **Auto-correct & Suggestions:** พิมพ์ผิด ระบบแนะนำคำที่ถูก
- **Anomaly Detection:** "ยอดนี้สูงกว่าปกติ 10 เท่า ถูกต้องหรือไม่?"
- **Missing Item Reminder:** "รายการนี้ปกติมี VAT / หัก ณ ที่จ่าย"
- **Past Date Warning:** "วันที่นี้ผ่านไปแล้ว ต้องการดำเนินการต่อ?"
- **Similar Record Found:** "พบรายการคล้ายกันเมื่อวาน ต้องการดูหรือไม่?"

### 3.22 Polish & Delight Features (ความลื่นไหลและประทับใจ)

#### UX/UI Polish
- **Sticky Header:** Header ติดอยู่เวลา Scroll
- **Floating Action Button:** ปุ่ม "+" ลอยมุมขวาล่าง
- **Breadcrumb Navigation:** รู้ว่าอยู่ตรงไหน กลับได้
- **Loading Skeleton:** แสดงโครงร่างระหว่างโหลด
- **Quick View (Slide-over):** ดูรายละเอียดไม่ต้องเปิดหน้าใหม่
- **Copy to Clipboard:** กดก็อปเลขบิล/ยอดเงินได้ทันที
- **Bulk Actions:** เลือกหลายรายการ ทำพร้อมกัน
- **Column Resize & Reorder:** ปรับขนาด/ลำดับ Column ได้
- **Pin/Freeze Column:** ล็อค Column ซ้ายสุด

#### Data Entry Helpers
- **Auto-fill from History:** กรอกจากประวัติที่เคยใส่
- **In-field Calculator:** พิมพ์ `1000*1.07` คำนวณให้
- **Smart Number Input:** พิมพ์ `1k` = 1,000 / `1m` = 1,000,000
- **Date Presets:** ปุ่มลัด: วันนี้, เมื่อวาน, สิ้นเดือน
- **Tab & Enter Navigation:** Tab ไปช่องถัดไป, Enter เพิ่มแถว
- **Paste from Excel:** Copy จาก Excel → Paste ลงตารางได้
- **Auto Format:** เบอร์โทร/เลขประจำตัว Format อัตโนมัติ
- **Quick Add Inline:** เพิ่มลูกค้า/สินค้าใหม่ตรงนั้นเลย

#### Display Options
- **Dark Mode:** โหมดมืด ถนอมสายตา
- **Compact/Comfortable View:** เลือกแสดงข้อมูลแน่น/หลวม
- **Date Format Options:** DD/MM/YYYY หรือ YYYY-MM-DD
- **Buddhist Year (พ.ศ.):** แสดงปี พ.ศ. 2567 ได้
- **Color Coding:** เขียว=ดี, เหลือง=เตือน, แดง=ปัญหา
- **Badge Counter:** แสดงจำนวนรอดำเนินการ

#### Thai-specific Features
- **Thai Address Format:** บ้านเลขที่/หมู่/ซอย/ถนน/แขวง/เขต
- **Postal Code Autocomplete:** พิมพ์รหัสไปรษณีย์ → เติมที่อยู่
- **Thai Name Order:** ชื่อ-นามสกุล
- **Thai Number Option:** แสดงตัวเลขไทย ๑๒๓ (optional)

#### Collaboration Features
- **Comments/Notes:** คอมเมนต์ในเอกสารได้
- **@Mention:** Tag เพื่อนร่วมงาน ส่ง Notification
- **Activity Log:** ดูว่าใครทำอะไร เมื่อไหร่
- **Internal vs External Notes:** โน้ตภายใน vs แสดงในเอกสาร
- **Shared Filters:** แชร์ Filter/View ให้ทีม

#### Performance & Reliability
- **Auto-save Draft:** บันทึก Draft ทุก 30 วินาที
- **Session Warning:** เตือน 5 นาทีก่อน Session หมด
- **Optimistic UI:** แสดงผลทันที รอ Save เบื้องหลัง
- **Offline Queue:** เก็บไว้ก่อน Sync ทีหลังเมื่อมีเน็ต
- **Tab Sync:** หลาย Tab Update พร้อมกัน

#### Navigation & Links
- **Deep Link:** ส่ง Link ไปหน้าเฉพาะได้
- **Browser Back Safe:** กด Back ไม่พัง
- **QR to Mobile:** สแกน QR เปิดหน้าเดียวกันบนมือถือ
- **Recently Visited:** แสดงหน้าที่เพิ่งเข้า

#### Import/Export Polish
- **Import Validation:** ตรวจสอบไฟล์ก่อน Import
- **Column Mapping:** จับคู่ Column ในไฟล์กับฟิลด์
- **Selective Export:** เลือก Column ที่จะ Export
- **Template Download:** ดาวน์โหลด Template สำหรับ Import

#### Personalization
- **Favorite Items:** ปักหมุดสินค้า/ลูกค้าที่ใช้บ่อย
- **Favorite Reports:** บันทึกรายงาน + Filter ที่ใช้บ่อย
- **Custom Dashboard:** ลาก Widget จัด Dashboard เอง
- **Remember Last State:** จำ Filter/Sort ที่ตั้งไว้

### 3.23 Business Scenarios พิเศษ (Special Cases)

#### Promotional & Free Items
- **ของแถม / Buy 1 Get 1:** บันทึกราคา 0 แต่ตัดสต็อก + ลงต้นทุน
- **สินค้าตัวอย่าง / แจกฟรี:** บันทึกเป็นค่าใช้จ่ายส่งเสริมการขาย
- **ส่วนลดตามปริมาณ:** ซื้อเยอะลดเยอะ (Tiered Pricing)

#### Deposits & Guarantees
- **เงินประกัน (Deposit):** บันทึกเป็นหนี้สิน/สินทรัพย์ คืนเมื่อครบสัญญา
- **เงินมัดจำล่วงหน้า:** ตัดยอดเมื่อออกบิลจริง

#### Late Fees & Discounts
- **ค่าปรับจ่ายช้า (Late Fee):** คำนวณอัตโนมัติตามวันที่เลยกำหนด
- **ส่วนลดจ่ายเร็ว (Early Payment):** "จ่ายใน 7 วัน ลด 2%"

#### Write-offs & Adjustments
- **Write-off หนี้สูญ:** ตัดหนี้เก็บไม่ได้ + บันทึกค่าใช้จ่าย
- **Stock Write-off:** สินค้าหมดอายุ/เสียหาย → ปรับลดสต็อก

### 3.24 Master Data Change Management (ข้อมูลเปลี่ยนแปลง)

- **Company Info History:** เปลี่ยนชื่อ/ที่อยู่บริษัท → เอกสารเก่าใช้ข้อมูลเก่า
- **Contact Name History:** ลูกค้าเปลี่ยนชื่อ → เก็บประวัติ
- **Price History:** สินค้าเปลี่ยนราคา → เอกสารเก่าใช้ราคาเก่า
- **Tax Rate Effective Date:** VAT เปลี่ยน → กำหนดวันที่มีผล
- **Employee Archive:** พนักงานลาออก → Archive ไม่ลบ เพื่อดูประวัติได้

### 3.25 Security & Compliance ขั้นสูง

#### Access Control
- **Login History:** ดูประวัติ Login (เวลา, IP, อุปกรณ์)
- **Device Management:** ดูอุปกรณ์ที่ Login + บังคับ Logout ได้
- **IP Whitelist:** จำกัด Login เฉพาะ IP บริษัท
- **Suspicious Activity Alert:** แจ้งเตือน Login ผิดปกติ

#### PDPA & Data Privacy
- **Consent Management:** บันทึกความยินยอมเก็บข้อมูล
- **Right to be Forgotten:** ลูกค้าขอลบข้อมูลได้
- **Data Retention Policy:** กำหนดระยะเวลาเก็บข้อมูล
- **Data Anonymization:** ลบข้อมูลส่วนบุคคลแต่เก็บสถิติ

### 3.26 Help & Support System

- **Contextual Help (?):** กด ? แต่ละฟิลด์ดูคำอธิบาย
- **Tooltips:** Hover แล้วแสดงคำอธิบายสั้นๆ
- **Guided Tours:** สอนใช้งานครั้งแรก Step-by-step
- **Video Tutorials:** วิดีโอสอนแต่ละฟีเจอร์
- **Knowledge Base:** บทความช่วยเหลือค้นหาได้
- **Live Chat Support:** แชทกับทีมซัพพอร์ตได้ทันที
- **Feedback Button:** ส่ง Feedback/Bug Report ได้ทุกหน้า
- **What's New Modal:** แจ้งฟีเจอร์ใหม่เมื่อมี Update

### 3.27 Advanced Analytics

- **Customer Scoring:** จัดเกรดลูกค้า (A/B/C) ตามประวัติจ่ายเงิน
- **Product Performance:** สินค้าขายดี vs สินค้าค้างสต็อก
- **Profit Margin Analysis:** กำไรต่อสินค้า/ลูกค้า
- **Seasonal Trends:** วิเคราะห์ยอดขายตามฤดูกาล
- **Aging Analysis:** อายุลูกหนี้/เจ้าหนี้ (30/60/90/120 วัน)
- **Cash Runway:** เงินสดเหลือใช้ได้กี่เดือน

### 3.28 Additional Integrations

- **E-Signature:** เซ็นเอกสารออนไลน์ (Signify, DocuSign)
- **Calendar Sync:** Sync Due Date กับ Google/Outlook Calendar
- **Government Portal:** ยื่น DBD e-Filing, RD e-Filing ตรงๆ
- **Shipping Tracking:** ติดตามสถานะจัดส่ง (Kerry, Flash, J&T)
- **POS Integration:** เชื่อมกับระบบขายหน้าร้าน
- **CRM Integration:** Sync ข้อมูลลูกค้ากับ HubSpot, Salesforce

### 3.29 Periodic Tasks & Year-end

- **Year-end Closing Wizard:** ปิดบัญชีสิ้นปี + ยกยอดไปปีใหม่
- **Audit Preparation Pack:** เตรียมเอกสาร/รายงานสำหรับผู้สอบบัญชี
- **Tax Planning Dashboard:** ประมาณการภาษีสิ้นปี + แนะนำวางแผน
- **Budget vs Actual Report:** เปรียบเทียบงบประมาณกับยอดจริง
- **13th Month Bonus Calculator:** คำนวณโบนัสสิ้นปี

### 3.30 Gamification & User Engagement

- **Achievement Badges:** "ออกบิลครบ 100 ใบ!" "จ่ายภาษีตรงเวลา 12 เดือน!"
- **Streak Counter:** "บันทึกบัญชีติดต่อกัน 30 วัน!"
- **Completion Progress:** "ข้อมูลบริษัทครบ 80%"
- **Tips of the Day:** แนะนำทริคใหม่ๆ ทุกวัน
- **Usage Insights:** "คุณประหยัดเวลาไป 10 ชม./เดือน ด้วยระบบอัตโนมัติ"

### 3.31 ระบบ Support (Customer Support System)

#### Ticket System
- **Create Ticket:** สร้างได้จาก In-app, Email, LINE
- **Ticket Category:** Bug, Question, Feature Request, Billing
- **Priority Level:** Low, Medium, High, Critical
- **Status Tracking:** Open → In Progress → Waiting → Resolved → Closed
- **Agent Assignment:** กำหนดทีมซัพพอร์ตรับผิดชอบ
- **SLA Timer:** นับเวลาตอบกลับตาม Plan
- **Internal Notes:** โน้ตภายในทีม ลูกค้าไม่เห็น
- **Satisfaction Rating:** ให้คะแนนหลังปิด Ticket

#### Support Channels
- **In-app Chat Widget:** แชทกับทีมซัพพอร์ตได้ทันที
- **Email to Ticket:** support@company.com → สร้าง Ticket อัตโนมัติ
- **LINE Official:** แชทผ่าน LINE → สร้าง Ticket
- **Phone Support:** เฉพาะ Enterprise Plan
- **Screen Share:** ขอดูหน้าจอลูกค้า (with permission)

#### Self-Service
- **Knowledge Base:** บทความช่วยเหลือค้นหาได้
- **Video Tutorials:** วิดีโอสอนใช้งานแต่ละฟีเจอร์
- **FAQ Section:** คำถามที่พบบ่อย
- **Community Forum:** ผู้ใช้ช่วยกันตอบ
- **System Status Page:** แจ้งสถานะระบบ (ปกติ/มีปัญหา/บำรุงรักษา)

### 3.32 ระบบรายเดือน (Subscription & Billing)

#### Pricing Plans
| Plan | ราคา/เดือน | Users | Documents | Storage | SLA |
|------|-----------|-------|-----------|---------|-----|
| **Free** | ฟรี | 1 | 20/เดือน | 100MB | - |
| **Starter** | 499 บาท | 3 | 100/เดือน | 5GB | 48 ชม. |
| **Pro** | 1,499 บาท | 10 | Unlimited | 50GB | 4 ชม. |
| **Enterprise** | Custom | Unlimited | Unlimited | Unlimited | 1 ชม. |

#### Feature Availability by Plan
- **Free:** Core features, Limited documents, Email support
- **Starter:** + More users, Bank reconciliation, LINE support
- **Pro:** + API Access, Custom domain, Multi-company, Priority support
- **Enterprise:** + White label, Dedicated support, SLA guarantee, On-premise option

#### Billing Features
- **Billing Cycle:** รายเดือน / รายปี (ลด 20%)
- **Payment Methods:** Credit Card, PromptPay, Bank Transfer
- **Auto-renewal:** ต่ออายุอัตโนมัติ (ปิดได้)
- **Invoice Generation:** ออกใบเสร็จ/ใบกำกับภาษีอัตโนมัติ
- **Usage Dashboard:** ดูการใช้งาน vs Limit
- **Usage Alert:** เตือนเมื่อใกล้ถึง Limit (80%, 100%)
- **Upgrade/Downgrade:** เปลี่ยน Plan ได้ตลอด (Pro-rata)
- **Trial Period:** ทดลอง Pro ฟรี 14 วัน
- **Promo Code:** ใส่โค้ดลดราคา
- **Referral Program:** แนะนำเพื่อน ได้ส่วนลด/เครดิต

#### Account Management
- **Billing History:** ดูประวัติการชำระเงินทั้งหมด
- **Payment Method Management:** เพิ่ม/ลบ/เปลี่ยนบัตร
- **Cancel Subscription:** ยกเลิก + Survey ถามเหตุผล
- **Data Export on Cancel:** Export ข้อมูลทั้งหมดก่อนยกเลิก
- **Grace Period:** เลยกำหนดชำระ ยังใช้ได้ 7 วัน
- **Dunning Management:** เตือนจ่ายเงินอัตโนมัติ (วันที่ 1, 3, 7)

### 3.33 ระบบ Role & Permission (RBAC)

#### Pre-defined Roles
| Role | คำอธิบาย | ระดับสิทธิ์ |
|------|---------|------------|
| **Owner** | เจ้าของบริษัท | ทำได้ทุกอย่าง + Billing |
| **Admin** | ผู้ดูแลระบบ | ทำได้ทุกอย่าง (ยกเว้น Billing) |
| **Accountant** | นักบัญชี | ทุกเอกสาร + รายงาน |
| **Sales** | ฝ่ายขาย | Quotation, Invoice, Receipt |
| **Purchasing** | ฝ่ายจัดซื้อ | PO, Expense, Payment |
| **HR** | ฝ่ายบุคคล | Payroll, Employee |
| **Viewer** | ดูอย่างเดียว | ดูเอกสาร + รายงาน |
| **External Accountant** | สำนักงานบัญชี | ดู + Export รายงาน |

#### Permission Types
- **Module Access:** เข้าถึงแต่ละโมดูลได้หรือไม่
- **Action Permissions:** View / Create / Edit / Delete / Approve / Export
- **Data Scope:** Own (เฉพาะของตัวเอง) / Team / All Company
- **Amount Limit:** อนุมัติได้ไม่เกิน X บาท

#### Custom Roles
- **Create Custom Role:** สร้าง Role เองได้
- **Clone & Modify:** Copy Role ที่มีแล้วปรับแต่ง
- **Permission Template:** Template สำเร็จรูปให้เลือก

#### Advanced Access Control
- **Branch-level Access:** เห็นเฉพาะสาขาที่กำหนด
- **Time-based Access:** เข้าได้เฉพาะเวลางาน (9:00-18:00)
- **IP Restriction:** เข้าได้เฉพาะ IP ที่กำหนด
- **Two-Factor Authentication:** บังคับใช้ 2FA สำหรับ Role สำคัญ

#### Approval Workflow by Amount
| ระดับ | ยอดเงิน | ผู้อนุมัติ |
|-------|---------|-----------|
| Level 1 | ≤ 10,000 | Supervisor |
| Level 2 | 10,001 - 100,000 | Manager |
| Level 3 | 100,001 - 500,000 | Director |
| Level 4 | > 500,000 | Owner |

#### Audit & Compliance
- **Permission Change Log:** บันทึกทุกครั้งที่เปลี่ยนสิทธิ์
- **Access Review Report:** รายงานว่าใครมีสิทธิ์อะไรบ้าง
- **Segregation of Duties Alert:** เตือนถ้ามี Conflict of Interest
- **Inactive User Auto-disable:** ไม่ใช้งาน 90 วัน ปิดบัญชีอัตโนมัติ

---

## 4. ระบบบริหารงานบุคคลและเงินเดือน (Payroll Module)
*Complete HR & Payroll Solution for Thailand*

### 4.1 Employee Data & Management
- **Employee Profile:** เก็บประวัติละเอียด (ที่อยู่, บัญชีธนาคาร, ลดหย่อนภาษี, ประวัติการทำงาน)
- **Salary History:** บันทึกประวัติการปรับเงินเดือนและการเลื่อนตำแหน่ง (Audit Trail)
- **Contract Management:** แจ้งเตือนเมื่อใกล้หมดสัญญาจ้าง หรือครบกำหนดทดลองงาน

### 4.2 Salary Calculation & Payout
- **Flexible Income/Deduction:** ตั้งค่ารายการรับ/หักได้อิสระ (ค่าเดินทาง, เบี้ยขยัน, ค่าคอมมิชชั่น) และเลือกได้ว่าจะนำไปคำนวณภาษี/ประกันสังคมหรือไม่
- **Attendance Integration:** Import ไฟล์เวลาเข้างาน หรือเชื่อมต่อเครื่องสแกนนิ้ว เพื่อคำนวณหัก ขาด/ลา/มาสาย อัตโนมัติ
- **Prorated Calculation:** คำนวณเงินเดือนตามสัดส่วนวันที่เริ่มงาน/ลาออก ให้อัตโนมัติ (ไม่ต้องกดเครื่องคิดเลขหารวัน)
- **Bank File Export:** สร้างไฟล์ Text เพื่อ upload จ่ายเงินเดือนผ่านธนาคาร (K-Cash Connect, SCB Business Net, etc.)
- **Secure e-Payslip:** ส่งสลิปเงินเดือนทาง Email (ใส่รหัสผ่าน PDF) หรือผ่าน LINE OA (Secure Link)

### 4.3 Social Security (SSO) & Tax Compliance
- **SSO E-filing Ready:** สร้างไฟล์ยื่นประกันสังคมออนไลน์ (สปส. 1-10) ได้ทันที
- **Registration Forms:** สร้างฟอร์มขึ้นทะเบียนพนักงานใหม่ (สปส. 1-03) และแจ้งออก (สปส. 6-09) อัตโนมัติ
- **Tax Automation (ภ.ง.ด.1 / 1ก):**
    - คำนวณภาษีหัก ณ ที่จ่ายรายเดือน และสร้างรายงาน ภ.ง.ด.1
    - สรุปยอดทั้งปีเพื่อสร้างแบบ ภ.ง.ด.1ก (ยื่นรายปี)
    - ออกใบ 50 ทวิ ให้พนักงานสำหรับยื่นภาษีส่วนตัวตอนสิ้นปี
- **Provident Fund (PVD):** รองรับการหักกองทุนสำรองเลี้ยงชีพและสร้างรายงานส่งบริษัทจัดการกองทุน

---

## 5. รายงานและการวิเคราะห์ (Reporting & BI)
- **Financial Statements:**
  - งบแสดงฐานะการเงิน (Balance Sheet)
  - งบกำไรขาดทุน (Profit & Loss)
  - งบทดลอง (Trial Balance)
  - งบกระแสเงินสด (Cash Flow Statement)
- **Operational Reports:** สรุปยอดขาย, ลูกหนี้ค้างชำระ, สินค้าคงเหลือ, VAT Report
- **Dashboard:** กราฟแสดงรายได้, ค่าใช้จ่าย, Cash Run-way, Top Selling Products

---

## 6. Technology Stack (ข้อเสนอแนะ)

### Frontend
- **Framework:** Next.js (React) หรือ Vue.js
- **UI Library:** Ant Design หรือ Mantine (เหมาะกับ Dashboard/Data Table)
- **State Management:** TanStack Query + Zustand/Redux

### Backend
- **Language:** Node.js (NestJS) หรือ Go (Golang) เพื่อความเสถียรและ Type safe
- **API:** RESTful หรือ GraphQL
- **Authentication:** JWT, OAuth2 (Google/Microsoft Login)

### Database
- **Relational DB:** PostgreSQL (แนะนำอย่างยิ่งสำหรับข้อมูลบัญชีที่ต้องการความถูกต้องสูง - ACID Compliance)
- **Cache:** Redis

### Infrastructure
- **Container:** Docker, Kubernetes
- **Cloud:** AWS/Google Cloud/Azure
- **Storage:** S3 (สำหรับเก็บไฟล์แนบ สลิป เอกสาร PDF)

---

## 7. ความปลอดภัยและการตรวจสอบ (Security & Audit)
- **Role-Based Access Control (RBAC):** กำหนดสิทธิ์ละเอียด (View/Create/Edit/Approve)
- **Audit Trail:** บันทึก Log ทุกการกระทำ (ใคร ทำอะไร เมื่อไหร่ ข้อมูลก่อน/หลังแก้) **สำคัญมากสำหรับระบบบัญชี**
- **Data Encryption:** เข้ารหัสข้อมูลสำคัญใน DB และ SSL/TLS ในการส่งข้อมูล
- **Backup:** ระบบสำรองข้อมูลอัตโนมัติรายวัน/รายชั่วโมง

---

## 10. Visionary Features: เปลี่ยนบัญชีให้สนุกและง่าย (Gamification & Experience) - *The "Wow" Factor*
ฟีเจอร์ที่จะเปลี่ยน "งานบัญชีที่น่าเบื่อ" ให้เป็น "เรื่องสนุกและท้าทาย" ตามวิสัยทัศน์ของแอป:

### 10.1 Business Health Score (คะแนนสุขภาพธุรกิจ)
- **Gamified KPI:** ให้คะแนนสุขภาพการเงินของบริษัท (0-100 คะแนน) หรือตัดเกรด (Grade A/B/C) โดยวิเคราะห์จากกำไร, สภาพคล่อง, และหนี้สิน
- **Actionable Advice:** หากได้คะแนนน้อย ระบบจะแนะนำภารกิจ (Quest) ให้ทำ เช่น "เก็บหนี้ที่ค้างเกิน 30 วัน เพื่อเพิ่มคะแนนสภาพคล่อง"
- **Streak & Badges:** แจกเหรียญรางวัลเมื่อทำภารกิจสำเร็จ เช่น "เหรียญผู้พิชิตภาษี" (ยื่นภาษีตรงเวลา 3 เดือนติด), "นักเก็บเงินมือทอง" (DSO ต่ำกว่า 30 วัน)

### 10.2 Interactive Cash Flow Calendar (ปฏิทินวางแผนเงินสด)
- **Visual Planning:** แสดงปฏิทินที่เห็นยอดเงินเข้า (สีเขียว) และยอดที่ต้องจ่าย (สีแดง) ในแต่ละวัน
- **Drag & Drop Simulation:** ผู้ใช้สามารถ "ลาก" บิลที่ต้องจ่ายไปวางในวันที่อื่น เพื่อจำลองว่าถ้าเลื่อนจ่าย บัญชีจะติดลบไหม (Scenario Planning) ช่วยให้วางแผนหมุนเงินได้ง่ายและสนุกเหมือนเล่นเกม

### 10.3 "Just Talk" Data Entry (สั่งงานด้วยเสียง/แชท)
- **Voice/Chat Command:** ลดงานคีย์ข้อมูลด้วยการพิมพ์แชทหรือพูด เช่น *"บันทึกจ่ายค่าแท็กซี่ไปหาลูกค้า 200 บาท"* -> ระบบบันทึกเป็น "ค่าพาหนะ" ให้ทันที
- **Email Forwarding:** ได้รับใบเสร็จ Grab/ค่าโฆษณาทางเมล -> Forward เข้า `bills@yourapp.com` ระบบจะสร้าง Expense รออนุมัติให้อัตโนมัติ (Zero Entry)

---

## 9. ฟีเจอร์เสริมเพื่อความได้เปรียบ (Competitive Advantage Features)
เพื่อให้ระบบโดดเด่นกว่าคู่แข่งในตลาด และตอบโจทย์ Modern Business:

### 9.1 Collaboration & Accountant Portal
- **Invite External Accountant:** เจ้าของธุรกิจสามารถ "เชิญ" สำนักงานบัญชีเข้ามาในระบบได้ (แยกสิทธิ์ชัดเจน) เพื่อให้เข้ามาตรวจสอบ ปรับปรุงรายการ และปิดงบ โดยไม่ต้องส่งไฟล์ไปมา
- **In-Context Comments:** ระบบแชท/โน้ตแปะบนเอกสาร (Transaction Level) เช่น นักบัญชีถามในบิลซื้อใบที่ #123 ว่า "อันนี้ค่ารับรองใครครับ?" เจ้าของตอบกลับได้ทันที ไม่ต้องคุยแยกใน LINE

### 9.2 AI & Financial Health Check
- **Cash Flow Forecasting:** AI วิเคราะห์แนวโน้มรายรับ-รายจ่าย เพื่อพยากรณ์กระแสเงินสดล่วงหน้า 3-6 เดือน เตือนก่อนเงินขาดมือ
- **Anomaly Detection:** แจ้งเตือนเมื่อมีความผิดปกติ เช่น ยอดซื้อวัตถุดิบสูงโดดกว่าปกติ, ค่าไฟแพงผิดปกติ, หรือมีการแก้ไขเอกสารย้อนหลังที่น่าสงสัย
- **OCR Expense Scanning:** (Advanced) ถ่ายรูปสลิป 7-11 หรือใบเสร็จ -> ระบบอ่านชื่อร้าน/วันที่/ยอดเงิน/ภาษี -> ลงบัญชีให้อัตโนมัติ (ลดงาน Key ข้อมูลได้ 80%)

---

## 11. Advanced Features for Scale-up & Competitive Edge (ฟีเจอร์ขั้นสูงเพื่อชนะขาด)
ฟีเจอร์ที่จะทำให้ระบบรองรับธุรกิจที่โตขึ้น และสร้างความแตกต่างจากคู่แข่งอย่างชัดเจน:

### 11.1 Multi-Company & Consolidated Reports (งบรวมหลายบริษัท)
- **Company Switching:** สลับดูข้อมูลหลายบริษัทในบัญชีเดียว
- **Consolidated Financial Statements:** รวมงบการเงินของบริษัทในเครือได้ในคลิกเดียว
- **Inter-company Elimination:** ตัดรายการระหว่างกันอัตโนมัติ (เช่น บริษัทแม่ขายของให้บริษัทลูก)

### 11.2 Budget & Variance Analysis (งบประมาณและการเปรียบเทียบ)
- **Budget Setup:** ตั้งงบประมาณรายปี/ไตรมาส/เดือน ตามผังบัญชี
- **Real-time Comparison:** Dashboard เปรียบเทียบ ยอดจริง vs งบประมาณ
- **Alert:** แจ้งเตือนอัตโนมัติเมื่อค่าใช้จ่ายเกินงบที่ตั้งไว้ (เช่น "ค่าการตลาดเดือนนี้ใช้ไป 120% ของงบ")

### 11.3 Cost Center / Profit Center (ศูนย์ต้นทุน/กำไร)
- **Dimension Tracking:** แบ่งรายได้/ค่าใช้จ่ายตาม แผนก, สาขา, หรือโปรเจกต์
- **Profitability Report:** รายงานกำไรขาดทุนแยกตามศูนย์ (รู้ว่าสาขาไหนกำไร สาขาไหนขาดทุน)
- **Allocation Rules:** ตั้งกฎกระจายค่าใช้จ่ายส่วนกลาง (เช่น ค่าเช่าสำนักงานใหญ่) ไปแต่ละศูนย์ตามสัดส่วน

### 11.4 Project-based Accounting / Job Costing (บัญชีตามโปรเจกต์)
- **Project Tracking:** สร้างโปรเจกต์และ Link รายได้/ค่าใช้จ่ายเข้าโปรเจกต์นั้น
- **Job Profitability:** รู้ว่างานแต่ละงานกำไรจริงเท่าไหร่ (หักต้นทุนแรงงาน, วัสดุ)
- **Timesheet Integration:** (สำหรับ Agency/Consulting) บันทึกชั่วโมงทำงาน -> คำนวณต้นทุนแรงงานต่อโปรเจกต์

### 11.5 Multi-Currency Support (หลายสกุลเงิน)
- **Foreign Currency Invoices:** ออกใบแจ้งหนี้เป็น USD, EUR, JPY ได้
- **Auto Exchange Rate:** ดึงอัตราแลกเปลี่ยนจาก BOT อัตโนมัติ
- **Gain/Loss Calculation:** คำนวณกำไรขาดทุนจากอัตราแลกเปลี่ยน (Realized/Unrealized) อัตโนมัติ

### 11.6 Open Banking & Real-time Integration
- **Bank Feed API:** เชื่อมต่อธนาคารโดยตรง (SCB Connect, K PLUS API, Krungsri Statement API) ดึง Statement มา Match รายการอัตโนมัติ
- **POS Sync:** ยอดขายจาก POS (Wongnai, Ocha) ไหลเข้าระบบบัญชีทันทีที่ปิดร้าน
- **Payment Gateway:** รับชำระเงินออนไลน์ผ่าน QR/บัตรเครดิต และบันทึกบัญชีให้อัตโนมัติ

### 11.7 Self-Service Portal (ลูกค้า/Vendor เข้าดูเอง)
- **Customer Portal:** ลูกค้าเข้ามาดูใบแจ้งหนี้ค้างชำระ, ดาวน์โหลดใบกำกับภาษี, และจ่ายเงินออนไลน์ได้เลย
- **Vendor Portal:** ผู้จำหน่ายเข้ามาเช็คสถานะบิลของตัวเอง (รอตรวจสอบ/อนุมัติแล้ว/จ่ายเมื่อไหร่)
- **Notification:** แจ้งเตือนอัตโนมัติเมื่อมีเอกสารใหม่หรือสถานะเปลี่ยน

### 11.8 Predictive Analytics & AI Insights
- **Break-even Analysis:** คำนวณจุดคุ้มทุน และแสดงว่าเดือนนี้ "ผ่าน" หรือ "ยังไม่ถึง"
- **Working Capital Optimization:** AI แนะนำว่าควรเร่งเก็บหนี้ใคร หรือเลื่อนจ่ายใครได้บ้าง เพื่อให้เงินหมุนได้ดีขึ้น
- **Revenue Forecasting:** พยากรณ์รายได้ 3-6 เดือนข้างหน้าจาก Pattern ที่ผ่านมา

### 11.9 Audit-Ready & Compliance Plus
- **Digital Audit File:** Export ข้อมูลให้ผู้สอบบัญชีในรูปแบบมาตรฐาน (พร้อม GL, Sub-ledger, Attachments)
- **Management Letter Tracking:** บันทึกประเด็นที่ผู้สอบบัญชีแจ้ง และติดตามสถานะการแก้ไข
- **DBD e-Filing:** ส่งงบการเงินให้กรมพัฒนาธุรกิจการค้าได้โดยตรงจากระบบ
- **BOI Compliance:** (Optional) แยกบัญชี BOI/Non-BOI สำหรับบริษัทที่ได้รับสิทธิประโยชน์

---

## 8. แผนการพัฒนา (Phasing Roadmap)

### Phase 1: MVP (Minimum Viable Product)
- ระบบจัดการผังบัญชี (GL)
- ระบบซื้อ/ขายพื้นฐาน (AR/AP)
- ออกเอกสารสำคัญ (Invoice, Receipt, PO)
- รายงานงบการเงินพื้นฐาน

### Phase 2: Compliance & Banking
- ระบบภาษี (VAT, WHT)
- Bank Reconciliation
- ทะเบียนทรัพย์สิน (Assets)

### Phase 3: Payroll & Advanced Features
- ระบบเงินเดือน (Payroll)
- ระบบคลังสินค้า (Inventory)
- Dashboard & Analytics

### Phase 4: Integration & Scale
- API สำหรับเชื่อมต่อ E-Commerce (Shopee, Lazada)
- เชื่อมต่อธนาคาร (Payment Gateway)
- Mobile App สำหรับดู Dashboard

