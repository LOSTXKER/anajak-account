'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
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
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Plus, 
  Search,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Banknote,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

const paymentMethods: Record<string, string> = {
  cash: '💵 เงินสด',
  transfer: '🏦 โอนเงิน',
  check: '📄 เช็ค',
  credit_card: '💳 บัตรเครดิต',
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  completed: { label: 'สำเร็จ', variant: 'default' },
  pending: { label: 'รอดำเนินการ', variant: 'outline' },
  cancelled: { label: 'ยกเลิก', variant: 'destructive' },
}

export default function PaymentsPage() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [search, filterType])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filterType !== 'all') params.append('type', filterType)

      const response = await fetch(`/api/payments?${params}`)
      const result = await response.json()

      if (result.success) {
        setPayments(result.data)
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    })
  }

  const stats = {
    total: payments.length,
    receive: payments.filter(p => p.type === 'receive').length,
    pay: payments.filter(p => p.type === 'pay').length,
    receiveAmount: payments.filter(p => p.type === 'receive' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    payAmount: payments.filter(p => p.type === 'pay' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">การเงิน</h1>
          <p className="text-muted-foreground">บันทึกการรับเงินและจ่ายเงิน</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/dashboard/payments/new?type=pay">
              <ArrowUpRight className="h-4 w-4 text-orange-500" />
              จ่ายเงิน
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/dashboard/payments/new?type=receive">
              <ArrowDownLeft className="h-4 w-4" />
              รับเงิน
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">รายการทั้งหมด</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">รับเงิน</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.receive}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ฿{formatCurrency(stats.receiveAmount)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">จ่ายเงิน</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{stats.pay}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ฿{formatCurrency(stats.payAmount)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">กระแสเงินสด</CardTitle>
            <Banknote className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stats.receiveAmount - stats.payAmount >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {stats.receiveAmount - stats.payAmount >= 0 ? '+' : ''}฿{formatCurrency(stats.receiveAmount - stats.payAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/payments/new?type=receive">
            <CreditCard className="mr-2 h-4 w-4" />
            รับชำระจากลูกค้า
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/payments/new?type=pay">
            <Banknote className="mr-2 h-4 w-4" />
            จ่ายให้คู่ค้า
          </Link>
        </Button>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ค้นหาเลขที่, ชื่อ..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="ประเภท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="receive">รับเงิน</SelectItem>
                <SelectItem value="pay">จ่ายเงิน</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>เลขที่</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>ลูกค้า/คู่ค้า</TableHead>
                <TableHead className="hidden md:table-cell">ช่องทาง</TableHead>
                <TableHead className="hidden md:table-cell">วันที่</TableHead>
                <TableHead className="text-right">จำนวนเงิน</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Wallet className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">ยังไม่มีรายการ</p>
                    <Button className="mt-4" asChild>
                      <Link href="/dashboard/payments/new?type=receive">
                        <Plus className="mr-2 h-4 w-4" />
                        บันทึกรายการแรก
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">
                      {payment.paymentNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {payment.type === 'receive' ? (
                          <ArrowDownLeft className="h-4 w-4 text-primary" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-orange-500" />
                        )}
                        <span className={payment.type === 'receive' ? 'text-primary' : 'text-orange-500'}>
                          {payment.type === 'receive' ? 'รับเงิน' : 'จ่ายเงิน'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{payment.contact?.name || '-'}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {paymentMethods[payment.method] || payment.method}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatDate(payment.paymentDate)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={payment.type === 'receive' ? 'text-primary' : 'text-orange-500'}>
                        {payment.type === 'receive' ? '+' : '-'}฿{formatCurrency(payment.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[payment.status]?.variant || 'secondary'}>
                        {statusConfig[payment.status]?.label || payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
