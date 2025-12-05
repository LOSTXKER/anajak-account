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
  BarChart3,
  PieChart,
  TrendingUp,
  Calculator,
  Printer
} from 'lucide-react'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('trial-balance')
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  
  const [trialBalance, setTrialBalance] = useState<any>(null)
  const [balanceSheet, setBalanceSheet] = useState<any>(null)
  const [profitLoss, setProfitLoss] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchReport = async (type: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('startDate', startDate)
      params.append('endDate', endDate)
      
      const response = await fetch(`/api/reports/${type}?${params}`)
      const result = await response.json()
      
      if (result.success) {
        switch (type) {
          case 'trial-balance':
            setTrialBalance(result.data)
            break
          case 'balance-sheet':
            setBalanceSheet(result.data)
            break
          case 'profit-loss':
            setProfitLoss(result.data)
            break
        }
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH').format(amount)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">รายงาน</h1>
          <p className="text-muted-foreground">รายงานทางการเงินและบัญชี</p>
        </div>
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          พิมพ์
        </Button>
      </div>

      {/* Date Filter */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            ช่วงเวลา
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label>วันที่เริ่มต้น</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-44"
              />
            </div>
            <div className="space-y-2">
              <Label>วันที่สิ้นสุด</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-44"
              />
            </div>
            <Button onClick={() => fetchReport(activeTab)} disabled={loading}>
              {loading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <BarChart3 className="mr-2 h-4 w-4" />
              )}
              สร้างรายงาน
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="trial-balance" className="gap-2">
            <FileText className="h-4 w-4" />
            งบทดลอง
          </TabsTrigger>
          <TabsTrigger value="balance-sheet" className="gap-2">
            <PieChart className="h-4 w-4" />
            งบดุล
          </TabsTrigger>
          <TabsTrigger value="profit-loss" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            กำไรขาดทุน
          </TabsTrigger>
        </TabsList>

        {/* Trial Balance Tab */}
        <TabsContent value="trial-balance" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="text-center border-b pb-6">
              <CardTitle className="text-xl">งบทดลอง</CardTitle>
              <CardDescription>
                ณ วันที่ {new Date(endDate).toLocaleDateString('th-TH', { dateStyle: 'long' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-24">รหัส</TableHead>
                    <TableHead>ชื่อบัญชี</TableHead>
                    <TableHead className="text-right">เดบิต</TableHead>
                    <TableHead className="text-right">เครดิต</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!trialBalance ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                        กรุณากด "สร้างรายงาน" เพื่อดูข้อมูล
                      </TableCell>
                    </TableRow>
                  ) : trialBalance.accounts?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                        ไม่พบข้อมูล
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {trialBalance.accounts?.map((account: any) => (
                        <TableRow key={account.code} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">{account.code}</TableCell>
                          <TableCell>{account.name}</TableCell>
                          <TableCell className="text-right">
                            {account.debit > 0 ? `฿${formatCurrency(account.debit)}` : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {account.credit > 0 ? `฿${formatCurrency(account.credit)}` : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-bold">
                        <TableCell colSpan={2}>รวม</TableCell>
                        <TableCell className="text-right">฿{formatCurrency(trialBalance.totalDebit || 0)}</TableCell>
                        <TableCell className="text-right">฿{formatCurrency(trialBalance.totalCredit || 0)}</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Balance Sheet Tab */}
        <TabsContent value="balance-sheet" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="text-center border-b pb-6">
              <CardTitle className="text-xl">งบดุล</CardTitle>
              <CardDescription>
                ณ วันที่ {new Date(endDate).toLocaleDateString('th-TH', { dateStyle: 'long' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {!balanceSheet ? (
                <div className="text-center py-12 text-muted-foreground">
                  กรุณากด "สร้างรายงาน" เพื่อดูข้อมูล
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Assets */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 pb-2 border-b flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      สินทรัพย์
                    </h3>
                    <div className="space-y-2">
                      {balanceSheet.assets?.map((item: any) => (
                        <div key={item.code} className="flex justify-between py-1">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-medium">฿{formatCurrency(item.balance)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t font-bold">
                        <span>รวมสินทรัพย์</span>
                        <span className="text-blue-600">฿{formatCurrency(balanceSheet.totalAssets || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Liabilities & Equity */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 pb-2 border-b flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      หนี้สินและส่วนของผู้ถือหุ้น
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground mb-2">หนี้สิน</p>
                      {balanceSheet.liabilities?.map((item: any) => (
                        <div key={item.code} className="flex justify-between py-1">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-medium">฿{formatCurrency(item.balance)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between py-1 text-sm">
                        <span>รวมหนี้สิน</span>
                        <span>฿{formatCurrency(balanceSheet.totalLiabilities || 0)}</span>
                      </div>
                      
                      <p className="text-sm font-medium text-muted-foreground mb-2 mt-4">ส่วนของผู้ถือหุ้น</p>
                      {balanceSheet.equity?.map((item: any) => (
                        <div key={item.code} className="flex justify-between py-1">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-medium">฿{formatCurrency(item.balance)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between py-1 text-sm">
                        <span>รวมส่วนของผู้ถือหุ้น</span>
                        <span>฿{formatCurrency(balanceSheet.totalEquity || 0)}</span>
                      </div>

                      <div className="flex justify-between pt-2 border-t font-bold">
                        <span>รวมหนี้สิน+ทุน</span>
                        <span className="text-orange-600">฿{formatCurrency((balanceSheet.totalLiabilities || 0) + (balanceSheet.totalEquity || 0))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profit & Loss Tab */}
        <TabsContent value="profit-loss" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="text-center border-b pb-6">
              <CardTitle className="text-xl">งบกำไรขาดทุน</CardTitle>
              <CardDescription>
                สำหรับงวด {new Date(startDate).toLocaleDateString('th-TH')} - {new Date(endDate).toLocaleDateString('th-TH')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {!profitLoss ? (
                <div className="text-center py-12 text-muted-foreground">
                  กรุณากด "สร้างรายงาน" เพื่อดูข้อมูล
                </div>
              ) : (
                <div className="max-w-lg mx-auto space-y-6">
                  {/* Revenue */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 pb-2 border-b flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      รายได้
                    </h3>
                    <div className="space-y-2">
                      {profitLoss.revenues?.map((item: any) => (
                        <div key={item.code} className="flex justify-between py-1">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-medium">฿{formatCurrency(item.balance)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t font-bold">
                        <span>รวมรายได้</span>
                        <span className="text-green-600">฿{formatCurrency(profitLoss.totalRevenue || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expenses */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 pb-2 border-b flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      ค่าใช้จ่าย
                    </h3>
                    <div className="space-y-2">
                      {profitLoss.expenses?.map((item: any) => (
                        <div key={item.code} className="flex justify-between py-1">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-medium">฿{formatCurrency(item.balance)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t font-bold">
                        <span>รวมค่าใช้จ่าย</span>
                        <span className="text-red-600">฿{formatCurrency(profitLoss.totalExpense || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Profit */}
                  <div className={`p-4 rounded-lg ${(profitLoss.netProfit || 0) >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">กำไร (ขาดทุน) สุทธิ</span>
                      <span className={`text-2xl font-bold ${(profitLoss.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ฿{formatCurrency(profitLoss.netProfit || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
