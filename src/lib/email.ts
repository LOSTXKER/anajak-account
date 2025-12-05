import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendDocumentEmailParams {
  to: string
  documentNumber: string
  documentType: string
  companyName: string
  contactName: string
  grandTotal: number
  pdfUrl?: string
  message?: string
}

export async function sendDocumentEmail({
  to,
  documentNumber,
  documentType,
  companyName,
  contactName,
  grandTotal,
  pdfUrl,
  message,
}: SendDocumentEmailParams) {
  const documentTypeLabels: Record<string, string> = {
    quotation: 'ใบเสนอราคา',
    invoice: 'ใบแจ้งหนี้',
    tax_invoice: 'ใบกำกับภาษี',
    receipt: 'ใบเสร็จรับเงิน',
    purchase_order: 'ใบสั่งซื้อ',
    bill: 'ใบวางบิล',
  }

  const typeLabel = documentTypeLabels[documentType] || 'เอกสาร'
  const formattedAmount = new Intl.NumberFormat('th-TH').format(grandTotal)

  const html = `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Sarabun', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #0d9488;
    }
    .header h1 {
      color: #0d9488;
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px 0;
    }
    .document-info {
      background-color: #f0fdf4;
      border-left: 4px solid #0d9488;
      padding: 15px;
      margin: 20px 0;
    }
    .document-info p {
      margin: 5px 0;
    }
    .amount {
      font-size: 24px;
      font-weight: bold;
      color: #0d9488;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #0d9488;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${typeLabel}</h1>
      <p style="color: #6b7280; margin: 5px 0;">${companyName}</p>
    </div>

    <div class="content">
      <p>เรียน คุณ${contactName}</p>
      
      ${message ? `<p>${message}</p>` : `
      <p>ขอบคุณที่ใช้บริการของเรา เราขอส่ง${typeLabel} ให้ท่านตามรายละเอียดด้านล่าง</p>
      `}

      <div class="document-info">
        <p><strong>เลขที่เอกสาร:</strong> ${documentNumber}</p>
        <p><strong>ยอดรวมทั้งสิ้น:</strong> <span class="amount">฿${formattedAmount}</span></p>
      </div>

      ${pdfUrl ? `
      <div style="text-align: center;">
        <a href="${pdfUrl}" class="button">ดูเอกสาร</a>
      </div>
      ` : ''}

      <p>หากมีข้อสงสัยหรือต้องการสอบถามเพิ่มเติม กรุณาติดต่อกลับมาที่เราได้ทันที</p>
      
      <p>ขอบคุณและขอแสดงความนับถือ<br>
      ${companyName}</p>
    </div>

    <div class="footer">
      <p>อีเมลนี้ถูกส่งอัตโนมัติจากระบบบัญชี Account Pro</p>
      <p style="font-size: 12px; color: #9ca3af;">กรุณาอย่าตอบกลับอีเมลนี้โดยตรง</p>
    </div>
  </div>
</body>
</html>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Account Pro <onboarding@resend.dev>',
      to: [to],
      subject: `${typeLabel} ${documentNumber} - ${companyName}`,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}

export async function sendPaymentReminderEmail({
  to,
  documentNumber,
  dueDate,
  amount,
  companyName,
}: {
  to: string
  documentNumber: string
  dueDate: string
  amount: number
  companyName: string
}) {
  const formattedAmount = new Intl.NumberFormat('th-TH').format(amount)
  const formattedDate = new Date(dueDate).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const html = `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Sarabun', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2 4px rgba(0,0,0,0.1);
    }
    .alert {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
    }
    .amount {
      font-size: 24px;
      font-weight: bold;
      color: #dc2626;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2 style="color: #f59e0b;">🔔 การแจ้งเตือนการชำระเงิน</h2>
    
    <p>เรียน ลูกค้าที่เคารพ</p>
    
    <p>เราขอเตือนท่านว่า ยอดชำระสำหรับเอกสาร <strong>${documentNumber}</strong> กำลังจะครบกำหนดในเร็วๆ นี้</p>

    <div class="alert">
      <p><strong>เลขที่เอกสาร:</strong> ${documentNumber}</p>
      <p><strong>วันครบกำหนด:</strong> ${formattedDate}</p>
      <p><strong>ยอดค้างชำระ:</strong> <span class="amount">฿${formattedAmount}</span></p>
    </div>

    <p>กรุณาชำระภายในวันครบกำหนดเพื่อหลีกเลี่ยงค่าปรับหรือการหยุดให้บริการ</p>
    
    <p>ขอบคุณและขอแสดงความนับถือ<br>
    ${companyName}</p>
  </div>
</body>
</html>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Account Pro <onboarding@resend.dev>',
      to: [to],
      subject: `แจ้งเตือนการชำระเงิน - ${documentNumber}`,
      html,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

