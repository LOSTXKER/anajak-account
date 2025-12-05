import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendDocumentEmailParams {
  to: string
  documentNumber: string
  documentType: string
  companyName: string
  totalAmount: number
  pdfUrl?: string
}

export async function sendDocumentEmail(params: SendDocumentEmailParams) {
  const { to, documentNumber, documentType, companyName, totalAmount, pdfUrl } = params

  try {
    const data = await resend.emails.send({
      from: 'AccountPro <onboarding@resend.dev>',
      to: [to],
      subject: `${documentType} เลขที่ ${documentNumber} จาก ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
              .document-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .info-label { color: #6b7280; }
              .info-value { font-weight: 600; }
              .total { font-size: 1.5em; color: #0ea5e9; }
              .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; color: #6b7280; font-size: 0.9em; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">📄 ${documentType}</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">เลขที่ ${documentNumber}</p>
              </div>
              <div class="content">
                <p>เรียน คุณลูกค้า</p>
                <p>ได้รับเอกสาร <strong>${documentType}</strong> จาก <strong>${companyName}</strong></p>
                
                <div class="document-info">
                  <div class="info-row">
                    <span class="info-label">เลขที่เอกสาร:</span>
                    <span class="info-value">${documentNumber}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">ประเภท:</span>
                    <span class="info-value">${documentType}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">จาก:</span>
                    <span class="info-value">${companyName}</span>
                  </div>
                  <div class="info-row" style="border-bottom: none; margin-top: 10px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                    <span class="info-label" style="font-size: 1.2em;">ยอดรวม:</span>
                    <span class="info-value total">฿${new Intl.NumberFormat('th-TH').format(totalAmount)}</span>
                  </div>
                </div>

                ${pdfUrl ? `<p style="text-align: center;"><a href="${pdfUrl}" class="button">ดาวน์โหลด PDF</a></p>` : ''}

                <p style="margin-top: 30px; font-size: 0.95em; color: #6b7280;">
                  กรุณาตรวจสอบข้อมูลและชำระเงินตามกำหนด หากมีข้อสงสัยกรุณาติดต่อกลับ
                </p>
              </div>
              <div class="footer">
                <p>ส่งจาก AccountPro - ระบบบัญชีครบวงจร</p>
                <p style="font-size: 0.85em;">อีเมลนี้ส่งอัตโนมัติ กรุณาอย่าตอบกลับ</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    console.log('✅ Email sent:', data)
    return { success: true, data: data.data }
  } catch (error: any) {
    console.error('❌ Email error:', error)
    return { success: false, error: error.message }
  }
}

