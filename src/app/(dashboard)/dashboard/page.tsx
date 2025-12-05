'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, FileText, DollarSign, AlertCircle, Users } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const result = await response.json()
      if (result.success) {
        setStats(result.data)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount)
  }

  const statusLabels: Record<string, string> = {
    draft: 'ฉบับร่าง',
    sent: 'ส่งแล้ว',
    paid: 'ชำระแล้ว',
    partial: 'ชำระบางส่วน',
    overdue: 'เกินกำหนด',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center py-8">ไม่สามารถโหลดข้อมูลได้</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">ภาพรวมธุรกิจของคุณ</p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เงินเข้า (เดือนนี้)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.payments.receive.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.payments.receive.count} รายการ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เงินออก (เดือนนี้)</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.payments.make.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.payments.make.count} รายการ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สุทธิ</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.payments.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.payments.net)}
            </div>
            <p className="text-xs text-muted-foreground">กระแสเงินสด</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ค้างชำระ</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats.outstanding.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.outstanding.count} เอกสาร
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Lists */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>รายได้ 6 เดือนล่าสุด</CardTitle>
            <CardDescription>กระแสเงินสดรับ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.monthlyRevenue.map((item: any, i: number) => {
                const maxAmount = Math.max(...stats.monthlyRevenue.map((m: any) => m.amount))
                const percentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0
                
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.month}</span>
                      <span className="font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>ลูกค้าชั้นนำ</CardTitle>
            <CardDescription>5 อันดับแรกตามยอดขาย</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topCustomers.length > 0 ? (
                stats.topCustomers.map((customer: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">{i + 1}</span>
                      </div>
                      <span className="text-sm">{customer.name}</span>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(customer.amount)}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">ยังไม่มีข้อมูล</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle>เอกสารล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.documents.length > 0 ? (
                stats.recentActivities.documents.map((doc: any) => (
                  <Link key={doc.id} href={`/dashboard/documents/${doc.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.number}</p>
                          <p className="text-xs text-muted-foreground">{doc.contact}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(doc.amount)}</p>
                        <Badge variant="secondary" className="text-xs">
                          {statusLabels[doc.status] || doc.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">ยังไม่มีเอกสาร</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>รายการรับ-จ่ายล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.payments.length > 0 ? (
                stats.recentActivities.payments.map((payment: any) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      {payment.type === 'receive' ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{payment.number}</p>
                        <p className="text-xs text-muted-foreground">{payment.contact}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-medium ${payment.type === 'receive' ? 'text-green-600' : 'text-red-600'}`}>
                      {payment.type === 'receive' ? '+' : '-'}{formatCurrency(payment.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">ยังไม่มีรายการ</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/documents/new?type=quotation" className="p-4 border rounded-lg hover:bg-muted transition-colors text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">ใบเสนอราคา</p>
            </Link>
            <Link href="/dashboard/documents/new?type=invoice" className="p-4 border rounded-lg hover:bg-muted transition-colors text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">ใบแจ้งหนี้</p>
            </Link>
            <Link href="/dashboard/payments/new?type=receive" className="p-4 border rounded-lg hover:bg-muted transition-colors text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">รับเงิน</p>
            </Link>
            <Link href="/dashboard/reports" className="p-4 border rounded-lg hover:bg-muted transition-colors text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">รายงาน</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
