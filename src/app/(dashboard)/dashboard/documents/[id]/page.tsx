'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Printer, Download, Send, Edit, Trash2, Copy, FileType, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DocumentPreview } from '@/components/documents/document-preview'
import Link from 'next/link'

const documentTypes = [
  { value: 'quotation', label: 'ใบเสนอราคา', icon: '📄' },
  { value: 'invoice', label: 'ใบแจ้งหนี้', icon: '📃' },
  { value: 'tax_invoice', label: 'ใบกำกับภาษี', icon: '🧾' },
  { value: 'receipt', label: 'ใบเสร็จรับเงิน', icon: '🧾' },
  { value: 'purchase_order', label: 'ใบสั่งซื้อ', icon: '📋' },
]

// Mock data - will connect to API later
const mockDocument = {
  id: '1',
  documentNumber: 'QT2025-0001',
  type: 'quotation',
  companyName: 'บริษัท เดโม จำกัด',
  companyAddress: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
  companyTaxId: '0-1234-56789-01-2',
  companyPhone: '02-123-4567',
  contactName: 'บริษัท ABC จำกัด',
  contactAddress: '456 ถนนพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310',
  contactTaxId: '0-9876-54321-01-3',
  issueDate: '2025-12-01',
  dueDate: '2025-12-15',
  lineItems: [
    {
      productName: 'บริการที่ปรึกษา',
      description: 'ที่ปรึกษาระบบบัญชี 10 ชั่วโมง',
      quantity: 10,
      unitPrice: 5000,
      amount: 50000,
    },
    {
      productName: 'ออกแบบเว็บไซต์',
      description: 'ออกแบบ UI/UX พร้อม Responsive',
      quantity: 1,
      unitPrice: 50000,
      amount: 50000,
    },
  ],
  subtotal: 100000,
  discountAmount: 5000,
  vatAmount: 6650,
  withholdingTaxAmount: 0,
  grandTotal: 101650,
  notes: 'กรุณาชำระเงินภายในวันครบกำหนด\nโอนเข้าบัญชี: ธนาคารกสิกรไทย สาขาสีลม\nเลขที่บัญชี: 123-4-56789-0\nชื่อบัญชี: บริษัท เดโม จำกัด',
  terms: 'เงื่อนไขการชำระเงิน: 14 วัน นับจากวันที่ออกเอกสาร\nรับประกันงาน 30 วัน',
}

export default function DocumentViewPage() {
  const params = useParams()
  const router = useRouter()
  const documentId = params.id as string

  const [convertDialogOpen, setConvertDialogOpen] = useState(false)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [converting, setConverting] = useState(false)
  const [duplicating, setDuplicating] = useState(false)
  const [sending, setSending] = useState(false)
  const [emailForm, setEmailForm] = useState({
    recipientEmail: '',
    message: '',
  })

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    window.print()
  }

  const handleSendEmail = async () => {
    if (!emailForm.recipientEmail) {
      alert('กรุณากรอกอีเมลผู้รับ')
      return
    }

    try {
      setSending(true)
      const response = await fetch(`/api/documents/${documentId}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm),
      })
      const result = await response.json()

      if (result.success) {
        alert(result.message || 'ส่งอีเมลสำเร็จ')
        setEmailDialogOpen(false)
        setEmailForm({ recipientEmail: '', message: '' })
      } else {
        alert(result.error || 'เกิดข้อผิดพลาด')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('ไม่สามารถส่งอีเมลได้')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = () => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเอกสารนี้?')) {
      alert('ลบเอกสารแล้ว')
      router.push('/dashboard/documents')
    }
  }

  const handleDuplicate = async () => {
    try {
      setDuplicating(true)
      const response = await fetch(`/api/documents/${documentId}/duplicate`, {
        method: 'POST',
      })
      const result = await response.json()

      if (result.success) {
        alert(result.message || 'คัดลอกเอกสารสำเร็จ')
        router.push(`/dashboard/documents/${result.data.id}`)
      } else {
        alert(result.error || 'เกิดข้อผิดพลาด')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('ไม่สามารถคัดลอกเอกสารได้')
    } finally {
      setDuplicating(false)
    }
  }

  const handleConvert = async (targetType: string) => {
    try {
      setConverting(true)
      const response = await fetch(`/api/documents/${documentId}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType }),
      })
      const result = await response.json()

      if (result.success) {
        alert(result.message || 'แปลงเอกสารสำเร็จ')
        router.push(`/dashboard/documents/${result.data.id}`)
      } else {
        alert(result.error || 'เกิดข้อผิดพลาด')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('ไม่สามารถแปลงเอกสารได้')
    } finally {
      setConverting(false)
      setConvertDialogOpen(false)
    }
  }

  const currentType = mockDocument.type
  const availableTypes = documentTypes.filter(t => t.value !== currentType)

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
      {/* Action Bar - Hidden when printing */}
      <div className="bg-white border-b sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/documents">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold">{mockDocument.documentNumber}</h1>
                <p className="text-sm text-muted-foreground">
                  ออกให้: {mockDocument.contactName}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {/* More Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <FileType className="mr-2 h-4 w-4" />
                    เพิ่มเติม
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setConvertDialogOpen(true)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    แปลงเป็นเอกสารอื่น
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDuplicate} disabled={duplicating}>
                    <Copy className="mr-2 h-4 w-4" />
                    {duplicating ? 'กำลังคัดลอก...' : 'คัดลอกเอกสาร'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/documents/${documentId}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      แก้ไข
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    ลบ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                พิมพ์
              </Button>
              <Button variant="outline" onClick={() => setEmailDialogOpen(true)}>
                <Send className="mr-2 h-4 w-4" />
                ส่งอีเมล
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview */}
      <div className="max-w-7xl mx-auto px-6 py-8 print:p-0">
        <DocumentPreview data={mockDocument} />
      </div>

      {/* Convert Dialog */}
      <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แปลงเอกสาร</DialogTitle>
            <DialogDescription>
              เลือกประเภทเอกสารที่ต้องการแปลง (ข้อมูลจะถูกคัดลอกทั้งหมด)
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {availableTypes.map((type) => (
              <Button
                key={type.value}
                variant="outline"
                className="justify-start h-auto py-4"
                onClick={() => handleConvert(type.value)}
                disabled={converting}
              >
                <span className="text-2xl mr-3">{type.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs text-muted-foreground">
                    จาก {documentTypes.find(t => t.value === currentType)?.label}
                  </div>
                </div>
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertDialogOpen(false)}>
              ยกเลิก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ส่งเอกสารทางอีเมล</DialogTitle>
            <DialogDescription>
              กรอกอีเมลผู้รับและข้อความที่ต้องการส่งพร้อมเอกสาร
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">อีเมลผู้รับ *</Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@example.com"
                value={emailForm.recipientEmail}
                onChange={(e) => setEmailForm({ ...emailForm, recipientEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">ข้อความเพิ่มเติม (ไม่บังคับ)</Label>
              <Textarea
                id="message"
                placeholder="เพิ่มข้อความส่วนตัวถึงผู้รับ..."
                rows={4}
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                className="resize-none"
              />
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
              <p><strong>เอกสาร:</strong> {mockDocument.documentNumber}</p>
              <p><strong>ผู้รับ:</strong> {mockDocument.contactName}</p>
              <p><strong>ยอดเงิน:</strong> ฿{new Intl.NumberFormat('th-TH').format(mockDocument.grandTotal)}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)} disabled={sending}>
              ยกเลิก
            </Button>
            <Button onClick={handleSendEmail} disabled={sending}>
              {sending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  กำลังส่ง...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  ส่งอีเมล
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
