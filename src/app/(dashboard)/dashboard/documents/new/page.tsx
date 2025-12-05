'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Save, Send, FileText, Calculator } from 'lucide-react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

interface LineItem {
  id: string
  productId: string
  productName: string
  description: string
  quantity: number
  unitPrice: number
  discount: number
  discountType: 'percent' | 'amount'
  amount: number
}

const documentTypeLabels: Record<string, { label: string; icon: string; color: string }> = {
  quotation: { label: 'ใบเสนอราคา', icon: '📄', color: 'text-blue-600' },
  invoice: { label: 'ใบแจ้งหนี้', icon: '📃', color: 'text-yellow-600' },
  tax_invoice: { label: 'ใบกำกับภาษี', icon: '🧾', color: 'text-green-600' },
  receipt: { label: 'ใบเสร็จรับเงิน', icon: '🧾', color: 'text-primary' },
  purchase_order: { label: 'ใบสั่งซื้อ', icon: '📋', color: 'text-orange-600' },
}

export default function NewDocumentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const documentType = searchParams.get('type') || 'quotation'
  const docConfig = documentTypeLabels[documentType] || documentTypeLabels.quotation

  const [contactId, setContactId] = useState('')
  const [contactName, setContactName] = useState('')
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [terms, setTerms] = useState('')
  
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: '1',
      productId: '',
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: 'percent',
      amount: 0,
    },
  ])

  const [globalDiscount, setGlobalDiscount] = useState(0)
  const [globalDiscountType, setGlobalDiscountType] = useState<'percent' | 'amount'>('percent')
  const [vatRate, setVatRate] = useState(7)
  const [includeVat, setIncludeVat] = useState(true)
  const [withholdingTaxRate, setWithholdingTaxRate] = useState(0)

  const [contacts, setContacts] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContacts()
    fetchProducts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts')
      const result = await response.json()
      if (result.success) setContacts(result.data)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoadingContacts(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const result = await response.json()
      if (result.success) setProducts(result.data)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoadingProducts(false)
    }
  }

  const calculateLineAmount = (item: LineItem) => {
    let amount = item.quantity * item.unitPrice
    if (item.discount > 0) {
      if (item.discountType === 'percent') {
        amount = amount * (1 - item.discount / 100)
      } else {
        amount = amount - item.discount
      }
    }
    return amount
  }

  const updateLineItem = (id: string, field: string, value: any) => {
    setLineItems(items =>
      items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          updated.amount = calculateLineAmount(updated)
          return updated
        }
        return item
      })
    )
  }

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        productId: '',
        productName: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        discountType: 'percent',
        amount: 0,
      },
    ])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id))
    }
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
  
  let discountAmount = 0
  if (globalDiscount > 0) {
    if (globalDiscountType === 'percent') {
      discountAmount = subtotal * (globalDiscount / 100)
    } else {
      discountAmount = globalDiscount
    }
  }

  const afterDiscount = subtotal - discountAmount
  const vatAmount = includeVat ? afterDiscount * (vatRate / 100) : 0
  const withholdingTaxAmount = withholdingTaxRate > 0 ? afterDiscount * (withholdingTaxRate / 100) : 0
  const grandTotal = afterDiscount + vatAmount - withholdingTaxAmount

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const handleProductSelect = (lineId: string, productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      updateLineItem(lineId, 'productId', productId)
      updateLineItem(lineId, 'productName', product.name)
      updateLineItem(lineId, 'unitPrice', product.unitPrice)
    }
  }

  const handleSave = async (status: 'draft' | 'sent') => {
    setSaving(true)
    const documentData = {
      type: documentType,
      contactId,
      issueDate,
      dueDate,
      referenceNumber,
      notes,
      terms,
      lineItems,
      subtotal,
      discountAmount,
      vatAmount,
      withholdingTaxAmount,
      grandTotal,
      status,
    }

    console.log('Saving document:', documentData)
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    router.push('/dashboard/documents')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="hover:bg-muted">
            <Link href="/dashboard/documents">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{docConfig.icon}</span>
              <h1 className={`text-2xl font-bold ${docConfig.color}`}>
                สร้าง{docConfig.label}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              กรอกข้อมูลเอกสารให้ครบถ้วน
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            บันทึกฉบับร่าง
          </Button>
          <Button onClick={() => handleSave('sent')} disabled={saving}>
            {saving ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            บันทึกและส่ง
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Info */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                ข้อมูลเอกสาร
              </CardTitle>
              <CardDescription>
                ระบุข้อมูลพื้นฐานของเอกสาร
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>ลูกค้า/คู่ค้า <span className="text-destructive">*</span></Label>
                  <Select value={contactId} onValueChange={(value) => {
                    setContactId(value)
                    const contact = contacts.find(c => c.id === value)
                    if (contact) setContactName(contact.name)
                  }}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder={loadingContacts ? "กำลังโหลด..." : "เลือกลูกค้า/คู่ค้า"} />
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
                  <Label>เลขที่อ้างอิง</Label>
                  <Input
                    placeholder="PO-001, INV-001"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>วันที่ออกเอกสาร <span className="text-destructive">*</span></Label>
                  <Input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>วันครบกำหนด</Label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">รายการสินค้า/บริการ</CardTitle>
              <CardDescription>
                เพิ่มรายการสินค้าหรือบริการที่ต้องการ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[280px]">สินค้า/บริการ</TableHead>
                      <TableHead className="w-[90px] text-right">จำนวน</TableHead>
                      <TableHead className="w-[110px] text-right">ราคา/หน่วย</TableHead>
                      <TableHead className="w-[130px] text-right">ส่วนลด</TableHead>
                      <TableHead className="w-[110px] text-right">รวม</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="py-2">
                          <Select
                            value={item.productId}
                            onValueChange={(value) => handleProductSelect(item.id, value)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder={loadingProducts ? "กำลังโหลด..." : "เลือกสินค้า/บริการ"} />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map(product => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} - ฿{product.unitPrice.toLocaleString()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-2">
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="text-right h-9"
                          />
                        </TableCell>
                        <TableCell className="py-2">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="text-right h-9"
                          />
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex gap-1">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.discount}
                              onChange={(e) => updateLineItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                              className="text-right w-16 h-9"
                            />
                            <Select
                              value={item.discountType}
                              onValueChange={(value) => updateLineItem(item.id, 'discountType', value)}
                            >
                              <SelectTrigger className="w-14 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percent">%</SelectItem>
                                <SelectItem value="amount">฿</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium py-2">
                          ฿{formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell className="py-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLineItem(item.id)}
                            disabled={lineItems.length === 1}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={addLineItem}
              >
                <Plus className="mr-2 h-4 w-4" />
                เพิ่มรายการ
              </Button>
            </CardContent>
          </Card>

          {/* Notes & Terms */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">หมายเหตุและเงื่อนไข</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>หมายเหตุ</Label>
                <Textarea
                  placeholder="ข้อมูลเพิ่มเติมสำหรับเอกสาร..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label>เงื่อนไขและข้อตกลง</Label>
                <Textarea
                  placeholder="เงื่อนไขการชำระเงิน, การรับประกัน, ฯลฯ"
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Discount & Tax Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                ส่วนลดและภาษี
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">ส่วนลดรวม</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={globalDiscount}
                    onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                    className="text-right h-9"
                  />
                  <Select
                    value={globalDiscountType}
                    onValueChange={(value: 'percent' | 'amount') => setGlobalDiscountType(value)}
                  >
                    <SelectTrigger className="w-16 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">%</SelectItem>
                      <SelectItem value="amount">฿</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">ภาษีมูลค่าเพิ่ม (VAT)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={vatRate}
                    onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
                    className="text-right h-9"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">หัก ณ ที่จ่าย</Label>
                <Select
                  value={withholdingTaxRate.toString()}
                  onValueChange={(value) => setWithholdingTaxRate(parseFloat(value))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">ไม่มี</SelectItem>
                    <SelectItem value="1">1% - ค่าขนส่ง</SelectItem>
                    <SelectItem value="2">2% - โฆษณา</SelectItem>
                    <SelectItem value="3">3% - จ้างทำของ/บริการ</SelectItem>
                    <SelectItem value="5">5% - ค่าเช่า</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">สรุปยอดเงิน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ยอดรวม</span>
                <span className="font-medium">฿{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>ส่วนลด</span>
                  <span>-฿{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ยอดหลังหักส่วนลด</span>
                <span className="font-medium">฿{formatCurrency(afterDiscount)}</span>
              </div>
              {vatAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT {vatRate}%</span>
                  <span className="font-medium">฿{formatCurrency(vatAmount)}</span>
                </div>
              )}
              {withholdingTaxAmount > 0 && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>หัก ณ ที่จ่าย {withholdingTaxRate}%</span>
                  <span>-฿{formatCurrency(withholdingTaxAmount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-end pt-2">
                <span className="text-lg font-semibold">ยอดชำระสุทธิ</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">฿{formatCurrency(grandTotal)}</div>
                  <p className="text-xs text-muted-foreground">
                    ({grandTotal.toFixed(2)} บาท)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Save */}
          <div className="space-y-2">
            <Button className="w-full" size="lg" onClick={() => handleSave('sent')} disabled={saving}>
              {saving ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              บันทึกและส่งเอกสาร
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSave('draft')} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              บันทึกฉบับร่าง
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
