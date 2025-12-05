'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface DocumentPreviewProps {
  data: {
    documentNumber: string
    type: string
    companyName: string
    companyAddress?: string
    companyTaxId?: string
    companyPhone?: string
    contactName: string
    contactAddress?: string
    contactTaxId?: string
    issueDate: string
    dueDate?: string
    lineItems: Array<{
      productName: string
      description?: string
      quantity: number
      unitPrice: number
      amount: number
    }>
    subtotal: number
    discountAmount?: number
    vatAmount?: number
    withholdingTaxAmount?: number
    grandTotal: number
    notes?: string
    terms?: string
  }
}

const documentTypeLabels: Record<string, string> = {
  quotation: 'ใบเสนอราคา',
  invoice: 'ใบแจ้งหนี้ / ใบกำกับภาษี',
  receipt: 'ใบเสร็จรับเงิน / ใบกำกับภาษี',
  purchaseOrder: 'ใบสั่งซื้อ',
  bill: 'ใบวางบิล',
}

export function DocumentPreview({ data }: DocumentPreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
      <CardContent className="p-12 print:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                {data.companyName}
              </h1>
              {data.companyAddress && (
                <p className="text-sm text-muted-foreground">{data.companyAddress}</p>
              )}
              {data.companyTaxId && (
                <p className="text-sm text-muted-foreground">
                  เลขประจำตัวผู้เสียภาษี: {data.companyTaxId}
                </p>
              )}
              {data.companyPhone && (
                <p className="text-sm text-muted-foreground">
                  โทร: {data.companyPhone}
                </p>
              )}
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold mb-2">
                {documentTypeLabels[data.type] || data.type}
              </h2>
              <p className="text-lg font-semibold">{data.documentNumber}</p>
            </div>
          </div>

          <Separator />

          {/* Customer & Date Info */}
          <div className="grid grid-cols-2 gap-8 mt-6">
            <div>
              <h3 className="font-semibold mb-2">ลูกค้า / Customer</h3>
              <p className="font-medium">{data.contactName}</p>
              {data.contactAddress && (
                <p className="text-sm text-muted-foreground">{data.contactAddress}</p>
              )}
              {data.contactTaxId && (
                <p className="text-sm text-muted-foreground">
                  เลขประจำตัวผู้เสียภาษี: {data.contactTaxId}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="text-sm text-muted-foreground">วันที่ออกเอกสาร: </span>
                <span className="font-medium">{formatDate(data.issueDate)}</span>
              </div>
              {data.dueDate && (
                <div>
                  <span className="text-sm text-muted-foreground">วันครบกำหนด: </span>
                  <span className="font-medium">{formatDate(data.dueDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-300">
                <th className="text-left p-3 text-sm font-semibold">ลำดับ</th>
                <th className="text-left p-3 text-sm font-semibold">รายการ</th>
                <th className="text-right p-3 text-sm font-semibold">จำนวน</th>
                <th className="text-right p-3 text-sm font-semibold">ราคา/หน่วย</th>
                <th className="text-right p-3 text-sm font-semibold">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              {data.lineItems.map((item, index) => (
                <tr key={index} className="border-b border-slate-200">
                  <td className="p-3 text-sm">{index + 1}</td>
                  <td className="p-3">
                    <div className="font-medium">{item.productName}</div>
                    {item.description && (
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    )}
                  </td>
                  <td className="p-3 text-right text-sm">{formatCurrency(item.quantity)}</td>
                  <td className="p-3 text-right text-sm">{formatCurrency(item.unitPrice)}</td>
                  <td className="p-3 text-right font-medium">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-80 space-y-2">
            <div className="flex justify-between text-sm">
              <span>ยอดรวม</span>
              <span>{formatCurrency(data.subtotal)}</span>
            </div>

            {data.discountAmount && data.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>ส่วนลด</span>
                <span>-{formatCurrency(data.discountAmount)}</span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-sm">
              <span>ยอดหลังหักส่วนลด</span>
              <span>{formatCurrency(data.subtotal - (data.discountAmount || 0))}</span>
            </div>

            {data.vatAmount && data.vatAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span>ภาษีมูลค่าเพิ่ม 7%</span>
                <span>{formatCurrency(data.vatAmount)}</span>
              </div>
            )}

            {data.withholdingTaxAmount && data.withholdingTaxAmount > 0 && (
              <div className="flex justify-between text-sm text-orange-600">
                <span>หัก ณ ที่จ่าย</span>
                <span>-{formatCurrency(data.withholdingTaxAmount)}</span>
              </div>
            )}

            <Separator className="my-2" />

            <div className="flex justify-between text-lg font-bold">
              <span>ยอดชำระสุทธิ</span>
              <span className="text-primary">{formatCurrency(data.grandTotal)} บาท</span>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        {(data.notes || data.terms) && (
          <div className="mt-8 space-y-4">
            <Separator />
            {data.notes && (
              <div>
                <h4 className="font-semibold mb-1">หมายเหตุ</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.notes}</p>
              </div>
            )}
            {data.terms && (
              <div>
                <h4 className="font-semibold mb-1">เงื่อนไขและข้อตกลง</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* Signature */}
        <div className="mt-16 grid grid-cols-2 gap-8">
          <div className="text-center">
            <div className="border-t border-slate-300 pt-2 mt-16">
              <p className="text-sm">ผู้รับเงิน / Received By</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-slate-300 pt-2 mt-16">
              <p className="text-sm">ผู้อนุมัติ / Authorized By</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>เอกสารนี้สร้างโดยระบบ Account Pro</p>
          <p className="mt-1">
            หากมีข้อสงสัย กรุณาติดต่อ {data.companyPhone || 'ฝ่ายการเงิน'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

