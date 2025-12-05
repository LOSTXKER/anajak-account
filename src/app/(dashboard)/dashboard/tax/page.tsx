'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText,
  Download,
  Calculator,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Printer
} from 'lucide-react'

export default function TaxReportsPage() {
  const [activeTab, setActiveTab] = useState('pp30')
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM
  const [loading, setLoading] = useState(false)
  
  const [pp30Data, setPp30Data] = useState<any>(null)
  const [inputVatData, setInputVatData] = useState<any>(null)
  const [outputVatData, setOutputVatData] = useState<any>(null)

  const fetchPP30 = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tax/pp30?month=${month}`)
      const result = await response.json()
      if (result.success) {
        setPp30Data(result.data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInputVat = async () => {
    try {
      setLoading(true)
      const [year, monthNum] = month.split('-')
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1).toISOString().split('T')[0]
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0).toISOString().split('T')[0]
      
      const response = await fetch(`/api/tax/vat-input?startDate=${startDate}&endDate=${endDate}`)
      const result = await response.json()
      if (result.success) {
        setInputVatData(result.data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOutputVat = async () => {
    try {
      setLoading(true)
      const [year, monthNum] = month.split('-')
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1).toISOString().split('T')[0]
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0).toISOString().split('T')[0]
      
      const response = await fetch(`/api/tax/vat-output?startDate=${startDate}&endDate=${endDate}`)
      const result = await response.json()
      if (result.success) {
        setOutputVatData(result.data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const thaiYear = parseInt(year) + 543
    const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    return `${months[parseInt(month) - 1]} ${thaiYear}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">รายงานภาษี</h1>
          <p className="text-muted-foreground">รายงานภาษีมูลค่าเพิ่มและภาษีหัก ณ ที่จ่าย</p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          พิมพ์
        </Button>
      </div>

      {/* Month Selector */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            เลือกเดือนภาษี
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label>เดือน/ปี</Label>
              <Input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-48"
              />
            </div>
            <Button onClick={fetchPP30} disabled={loading}>
              {loading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              สร้างรายงาน
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="pp30" className="gap-2">
            <FileText className="h-4 w-4" />
            ภ.พ.30
          </TabsTrigger>
          <TabsTrigger value="input" className="gap-2" onClick={fetchInputVat}>
            <TrendingDown className="h-4 w-4" />
            ภาษีซื้อ
          </TabsTrigger>
          <TabsTrigger value="output" className="gap-2" onClick={fetchOutputVat}>
            <TrendingUp className="h-4 w-4" />
            ภาษีขาย
          </TabsTrigger>
        </TabsList>

        {/* PP30 Tab */}
        <TabsContent value="pp30" className="mt-6">
          {!pp30Data ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <Calculator className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">กรุณากด "สร้างรายงาน" เพื่อดูข้อมูล</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">ภาษีขาย</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      ฿{formatCurrency(pp30Data.summary.outputVat)}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">ภาษีซื้อ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      ฿{formatCurrency(pp30Data.summary.inputVat)}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">VAT สุทธิ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${pp30Data.summary.netVat >= 0 ? 'text-primary' : 'text-blue-600'}`}>
                      {pp30Data.summary.netVat >= 0 ? '+' : ''}฿{formatCurrency(pp30Data.summary.netVat)}
                    </div>
                  </CardContent>
                </Card>
                <Card className={`border-0 shadow-sm ${pp30Data.summary.netVat >= 0 ? 'bg-gradient-to-br from-red-50 to-red-100' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">สถานะ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {pp30Data.summary.netVat >= 0 ? (
                        <>
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <span className="text-lg font-bold text-red-600">ต้องชำระ</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                          <span className="text-lg font-bold text-blue-600">ขอคืน</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* PP30 Form */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="text-center border-b pb-6">
                  <CardTitle className="text-xl">แบบ ภ.พ.30</CardTitle>
                  <CardDescription>
                    แบบแสดงรายการภาษีมูลค่าเพิ่ม<br/>
                    ประจำเดือน {formatMonth(pp30Data.period.month)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Company Info */}
                  <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                    <p><strong>ชื่อผู้ประกอบการ:</strong> {pp30Data.company.name}</p>
                    <p><strong>เลขประจำตัวผู้เสียภาษี:</strong> {pp30Data.company.taxId}</p>
                    <p><strong>สาขา:</strong> {pp30Data.company.branchCode === '00000' ? 'สำนักงานใหญ่' : pp30Data.company.branchCode}</p>
                  </div>

                  {/* Section 1: Output VAT */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 pb-2 border-b flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      ส่วนที่ 1: ภาษีขาย (Output VAT)
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 text-sm">
                        <span className="text-muted-foreground">รายได้จากการขายสินค้า/บริการ</span>
                        <span className="font-medium">฿{formatCurrency(pp30Data.summary.salesExcludeVat)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t font-bold">
                        <span>ภาษีขายทั้งหมด</span>
                        <span className="text-green-600">฿{formatCurrency(pp30Data.summary.outputVat)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Input VAT */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 pb-2 border-b flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      ส่วนที่ 2: ภาษีซื้อ (Input VAT)
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 text-sm">
                        <span className="text-muted-foreground">ค่าใช้จ่ายในการซื้อสินค้า/บริการ</span>
                        <span className="font-medium">฿{formatCurrency(pp30Data.summary.purchasesExcludeVat)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t font-bold">
                        <span>ภาษีซื้อทั้งหมด</span>
                        <span className="text-orange-600">฿{formatCurrency(pp30Data.summary.inputVat)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Net VAT */}
                  <div className={`rounded-lg p-4 ${pp30Data.summary.netVat >= 0 ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <h3 className="font-bold text-lg mb-4">ส่วนที่ 3: ภาษีมูลค่าเพิ่มสุทธิ</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>ภาษีขาย</span>
                        <span className="font-medium">฿{formatCurrency(pp30Data.summary.outputVat)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ภาษีซื้อ</span>
                        <span className="font-medium">-฿{formatCurrency(pp30Data.summary.inputVat)}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t-2 border-current">
                        <span className="text-lg font-bold">
                          {pp30Data.summary.netVat >= 0 ? 'ภาษีที่ต้องชำระ' : 'ภาษีที่ขอคืน'}
                        </span>
                        <span className={`text-2xl font-bold ${pp30Data.summary.netVat >= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                          ฿{formatCurrency(Math.abs(pp30Data.summary.netVat))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Export Excel
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Input VAT Tab */}
        <TabsContent value="input" className="mt-6">
          {!inputVatData ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">กรุณากดที่แท็บเพื่อโหลดข้อมูล</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>รายงานภาษีซื้อ (Input Tax)</CardTitle>
                <CardDescription>
                  จำนวนเอกสาร: {inputVatData.summary.documentCount} ใบ | 
                  ยอดรวม: ฿{formatCurrency(inputVatData.summary.totalVat)}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>วันที่</TableHead>
                      <TableHead>เลขที่เอกสาร</TableHead>
                      <TableHead>ผู้ขาย</TableHead>
                      <TableHead className="text-right">มูลค่า</TableHead>
                      <TableHead className="text-right">VAT</TableHead>
                      <TableHead className="text-right">รวม</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inputVatData.items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{new Date(item.date).toLocaleDateString('th-TH')}</TableCell>
                        <TableCell className="font-mono">{item.documentNumber}</TableCell>
                        <TableCell>{item.vendorName}</TableCell>
                        <TableCell className="text-right">฿{formatCurrency(item.subtotal)}</TableCell>
                        <TableCell className="text-right text-orange-600">฿{formatCurrency(item.vat)}</TableCell>
                        <TableCell className="text-right font-medium">฿{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell colSpan={3}>รวม</TableCell>
                      <TableCell className="text-right">฿{formatCurrency(inputVatData.summary.totalPurchases)}</TableCell>
                      <TableCell className="text-right text-orange-600">฿{formatCurrency(inputVatData.summary.totalVat)}</TableCell>
                      <TableCell className="text-right">฿{formatCurrency(inputVatData.summary.totalWithVat)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Output VAT Tab */}
        <TabsContent value="output" className="mt-6">
          {!outputVatData ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">กรุณากดที่แท็บเพื่อโหลดข้อมูล</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>รายงานภาษีขาย (Output Tax)</CardTitle>
                <CardDescription>
                  จำนวนเอกสาร: {outputVatData.summary.documentCount} ใบ | 
                  ยอดรวม: ฿{formatCurrency(outputVatData.summary.totalVat)}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>วันที่</TableHead>
                      <TableHead>เลขที่เอกสาร</TableHead>
                      <TableHead>ลูกค้า</TableHead>
                      <TableHead className="text-right">มูลค่า</TableHead>
                      <TableHead className="text-right">VAT</TableHead>
                      <TableHead className="text-right">รวม</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outputVatData.items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{new Date(item.date).toLocaleDateString('th-TH')}</TableCell>
                        <TableCell className="font-mono">{item.documentNumber}</TableCell>
                        <TableCell>{item.customerName}</TableCell>
                        <TableCell className="text-right">฿{formatCurrency(item.subtotal)}</TableCell>
                        <TableCell className="text-right text-green-600">฿{formatCurrency(item.vat)}</TableCell>
                        <TableCell className="text-right font-medium">฿{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell colSpan={3}>รวม</TableCell>
                      <TableCell className="text-right">฿{formatCurrency(outputVatData.summary.totalSales)}</TableCell>
                      <TableCell className="text-right text-green-600">฿{formatCurrency(outputVatData.summary.totalVat)}</TableCell>
                      <TableCell className="text-right">฿{formatCurrency(outputVatData.summary.totalWithVat)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

