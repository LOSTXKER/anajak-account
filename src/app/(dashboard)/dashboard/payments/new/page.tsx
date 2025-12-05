'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  ArrowLeft, 
  Save,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  FileText
} from 'lucide-react'

const paymentMethods = [
  { value: 'cash', label: '💵 เงินสด' },
  { value: 'transfer', label: '🏦 โอนเงิน' },
  { value: 'check', label: '📄 เช็ค' },
  { value: 'credit_card', label: '💳 บัตรเครดิต' },
]

function NewPaymentPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const paymentType = searchParams.get('type') || 'receive'

  const [contactId, setContactId] = useState('')
  const [amount, setAmount] = useState(0)
  const [method, setMethod] = useState('transfer')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  
  const [contacts, setContacts] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [])

  useEffect(() => {
    if (contactId) {
      fetchDocuments()
    }
  }, [contactId])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts')
      const result = await response.json()
      if (result.success) {
        const filtered = result.data.filter((c: any) => 
          paymentType === 'receive' 
            ? c.type === 'customer' || c.type === 'both'
            : c.type === 'vendor' || c.type === 'both'
        )
        setContacts(filtered)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDocuments = async () => {
    try {
      const params = new URLSearchParams()
      params.append('contactId', contactId)
      params.append('status', 'pending,approved,partial')
      
      const response = await fetch(`/api/documents?${params}`)
      const result = await response.json()
      if (result.success) {
        setDocuments(result.data)
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH').format(amount)
  }

  const handleDocumentSelect = (docId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, docId])
      const doc = documents.find(d => d.id === docId)
      if (doc) {
        setAmount(prev => prev + doc.grandTotal)
      }
    } else {
      setSelectedDocuments(selectedDocuments.filter(id => id !== docId))
      const doc = documents.find(d => d.id === docId)
      if (doc) {
        setAmount(prev => prev - doc.grandTotal)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const paymentData = {
      type: paymentType,
      contactId,
      amount,
      method,
      paymentDate,
      reference,
      notes,
      documentIds: selectedDocuments,
    }

    console.log('Saving payment:', paymentData)
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    router.push('/dashboard/payments')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="hover:bg-muted">
            <Link href="/dashboard/payments">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              {paymentType === 'receive' ? (
                <ArrowDownLeft className="h-6 w-6 text-primary" />
              ) : (
                <ArrowUpRight className="h-6 w-6 text-orange-500" />
              )}
              <h1 className={`text-2xl font-bold ${paymentType === 'receive' ? 'text-primary' : 'text-orange-500'}`}>
                {paymentType === 'receive' ? 'บันทึกรับเงิน' : 'บันทึกจ่ายเงิน'}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              {paymentType === 'receive' 
                ? 'บันทึกการรับเงินจากลูกค้า'
                : 'บันทึกการจ่ายเงินให้คู่ค้า'
              }
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving || !contactId || amount <= 0}>
          {saving ? (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          บันทึก
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  ข้อมูลการชำระ
                </CardTitle>
                <CardDescription>
                  กรอกรายละเอียดการรับ/จ่ายเงิน
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{paymentType === 'receive' ? 'ลูกค้า' : 'คู่ค้า'} <span className="text-destructive">*</span></Label>
                    <Select value={contactId} onValueChange={setContactId}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder={loading ? "กำลังโหลด..." : `เลือก${paymentType === 'receive' ? 'ลูกค้า' : 'คู่ค้า'}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {contacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>วันที่ <span className="text-destructive">*</span></Label>
                    <Input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>จำนวนเงิน <span className="text-destructive">*</span></Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      className="h-10 text-right text-lg font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ช่องทางชำระ <span className="text-destructive">*</span></Label>
                    <Select value={method} onValueChange={setMethod}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(m => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>เลขที่อ้างอิง</Label>
                  <Input
                    placeholder="เลขที่ใบสลิป, เลขที่เช็ค..."
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>หมายเหตุ</Label>
                  <Textarea
                    placeholder="รายละเอียดเพิ่มเติม..."
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Related Documents */}
            {contactId && documents.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    เอกสารที่เกี่ยวข้อง
                  </CardTitle>
                  <CardDescription>
                    เลือกเอกสารที่ต้องการ{paymentType === 'receive' ? 'รับชำระ' : 'ชำระ'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedDocuments.includes(doc.id)}
                            onCheckedChange={(checked) => handleDocumentSelect(doc.id, checked as boolean)}
                          />
                          <div>
                            <div className="font-mono text-sm">{doc.documentNumber}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(doc.issueDate).toLocaleDateString('th-TH')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">฿{formatCurrency(doc.grandTotal)}</div>
                          <div className="text-xs text-muted-foreground">
                            คงค้าง ฿{formatCurrency(doc.grandTotal - (doc.paidAmount || 0))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className={`border-0 shadow-sm ${paymentType === 'receive' ? 'bg-gradient-to-br from-primary/5 to-primary/10' : 'bg-gradient-to-br from-orange-50 to-orange-100'}`}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">สรุปการชำระ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ประเภท</span>
                  <div className="flex items-center gap-2">
                    {paymentType === 'receive' ? (
                      <>
                        <ArrowDownLeft className="h-4 w-4 text-primary" />
                        <span className="font-medium text-primary">รับเงิน</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-orange-500">จ่ายเงิน</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ช่องทาง</span>
                  <span className="font-medium">
                    {paymentMethods.find(m => m.value === method)?.label}
                  </span>
                </div>
                {selectedDocuments.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">เอกสาร</span>
                    <span className="font-medium">{selectedDocuments.length} รายการ</span>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <div className="flex items-end justify-between">
                    <span className="text-lg font-semibold">จำนวนเงิน</span>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${paymentType === 'receive' ? 'text-primary' : 'text-orange-500'}`}>
                        ฿{formatCurrency(amount)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={saving || !contactId || amount <= 0}
            >
              {saving ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              บันทึกรายการ
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function NewPaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <NewPaymentPageContent />
    </Suspense>
  )
}
