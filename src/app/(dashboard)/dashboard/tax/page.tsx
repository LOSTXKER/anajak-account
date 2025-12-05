'use client'

import { useState, useEffect } from 'react'
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
  RefreshCw
} from 'lucide-react'

export default function TaxReportsPage() {
  const [activeTab, setActiveTab] = useState('pp30')
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM
  const [loading, setLoading] = useState(false)
  
  const [pp30Data, setPp30Data] = useState<any>(null)
  const [inputVatData, setInputVatData] = useState<any>(null)
  const [outputVatData, setOutputVatData] = useState<any>(null)

  useEffect(() => {
    if (activeTab === 'pp30') {
      fetchPP30()
    } else if (activeTab === 'input') {
      fetchInputVAT()
    } else if (activeTab === 'output') {
      fetchOutputVAT()
    }
  }, [activeTab, month])

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

  const fetchInputVAT = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tax/vat-input?month=${month}`)
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

  const fetchOutputVAT = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tax/vat-output?month=${month}`)
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
    return new Intl.NumberFormat('th-TH').format(amount || 0)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">รายงานภาษี</h1>
          <p className="text-muted-foreground">สรุปภาษีมูลค่าเพิ่มและภาษีหัก ณ ที่จ่าย</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          รีเฟรช
        </Button>
      </div>

      {/* Month Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="month">เดือน/ปี</Label>
              <Input
                id="month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
            <Button onClick={() => {
              if (activeTab === 'pp30') fetchPP30()
              else if (activeTab === 'input') fetchInputVAT()
              else fetchOutputVAT()
            }}>
              <Calculator className="mr-2 h-4 w-4" />
              คำนวณ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger value="pp30" className="gap-2">
            <FileText className="h-4 w-4" />
            ภ.พ.30
          </TabsTrigger>
          <TabsTrigger value="input" className="gap-2">
            <TrendingDown className="h-4 w-4" />
            ภาษีซื้อ
          </TabsTrigger>
          <TabsTrigger value="output" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            ภาษีขาย
          </TabsTrigger>
        </TabsList>

        {/* PP30 Tab */}
        <TabsContent value="pp30">
          <Card>
            <CardHeader>
              <CardTitle>ภ.พ.30 - แบบแสดงรายการภาษีมูลค่าเพิ่ม</CardTitle>
              <CardDescription>
                สรุปภาษีซื้อ-ขาย และคำนวณภาษีที่ต้องชำระ/ขอคืน
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">กำลังโหลดข้อมูล...</p>
                </div>
              ) : pp30Data ? (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">ภาษีขาย</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          ฿{formatCurrency(pp30Data.outputVat)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">ภาษีซื้อ</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                          ฿{formatCurrency(pp30Data.inputVat)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          ภาษีสุทธิ ({pp30Data.status})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-2xl font-bold ${pp30Data.netVat > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                          ฿{formatCurrency(Math.abs(pp30Data.netVat))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 opacity-50 mb-4" />
                  <p>กรุณาเลือกเดือน/ปี แล้วกดคำนวณ</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Input VAT Tab */}
        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle>รายงานภาษีซื้อ</CardTitle>
              <CardDescription>
                รายการภาษีซื้อจากเอกสารซื้อ
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : inputVatData && inputVatData.documents.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>วันที่</TableHead>
                        <TableHead>เลขที่เอกสาร</TableHead>
                        <TableHead>คู่ค้า</TableHead>
                        <TableHead className="text-right">ยอดก่อน VAT</TableHead>
                        <TableHead className="text-right">VAT 7%</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inputVatData.documents.map((doc: any) => (
                        <TableRow key={doc.id}>
                          <TableCell>{formatDate(doc.documentDate)}</TableCell>
                          <TableCell className="font-mono">{doc.documentNumber}</TableCell>
                          <TableCell>{doc.contactName}</TableCell>
                          <TableCell className="text-right">฿{formatCurrency(Number(doc.amountBeforeVat))}</TableCell>
                          <TableCell className="text-right font-medium">฿{formatCurrency(Number(doc.vatAmount))}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg text-right">
                    <div className="text-sm text-orange-600">รวมภาษีซื้อ</div>
                    <div className="text-2xl font-bold text-orange-600">฿{formatCurrency(inputVatData.total)}</div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>ไม่มีรายการภาษีซื้อ</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Output VAT Tab */}
        <TabsContent value="output">
          <Card>
            <CardHeader>
              <CardTitle>รายงานภาษีขาย</CardTitle>
              <CardDescription>
                รายการภาษีขายจากเอกสารขาย
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : outputVatData && outputVatData.documents.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>วันที่</TableHead>
                        <TableHead>เลขที่เอกสาร</TableHead>
                        <TableHead>ลูกค้า</TableHead>
                        <TableHead className="text-right">ยอดก่อน VAT</TableHead>
                        <TableHead className="text-right">VAT 7%</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {outputVatData.documents.map((doc: any) => (
                        <TableRow key={doc.id}>
                          <TableCell>{formatDate(doc.documentDate)}</TableCell>
                          <TableCell className="font-mono">{doc.documentNumber}</TableCell>
                          <TableCell>{doc.contactName}</TableCell>
                          <TableCell className="text-right">฿{formatCurrency(Number(doc.amountBeforeVat))}</TableCell>
                          <TableCell className="text-right font-medium">฿{formatCurrency(Number(doc.vatAmount))}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 p-4 bg-green-50 rounded-lg text-right">
                    <div className="text-sm text-green-600">รวมภาษีขาย</div>
                    <div className="text-2xl font-bold text-green-600">฿{formatCurrency(outputVatData.total)}</div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>ไม่มีรายการภาษีขาย</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
