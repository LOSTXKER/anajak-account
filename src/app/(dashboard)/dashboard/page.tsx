'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Users, Package, Wallet, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const result = await response.json()
      if (result.success) {
        setData(result.data)
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
    }).format(amount || 0)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    })
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    draft: { label: 'ฉบับร่าง', color: 'bg-gray-100 text-gray-700' },
    sent: { label: 'ส่งแล้ว', color: 'bg-blue-100 text-blue-700' },
    paid: { label: 'ชำระแล้ว', color: 'bg-green-100 text-green-700' },
    partial: { label: 'ชำระบางส่วน', color: 'bg-yellow-100 text-yellow-700' },
    overdue: { label: 'เกินกำหนด', color: 'bg-red-100 text-red-700' },
    cancelled: { label: 'ยกเลิก', color: 'bg-red-100 text-red-700' },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">ไม่สามารถโหลดข้อมูลได้</p>
        <Button onClick={() => window.location.reload()}>ลองใหม่</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">ภาพรวมธุรกิจของคุณ</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/documents/new?type=invoice">
            <Plus className="mr-2 h-4 w-4" />
            สร้างเอกสารใหม่
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ลูกค้า/คู่ค้า</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.stats?.totalContacts || 0}</div>
            <Link href="/dashboard/contacts" className="text-xs text-primary hover:underline">
              ดูทั้งหมด →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สินค้า/บริการ</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.stats?.totalProducts || 0}</div>
            <Link href="/dashboard/products" className="text-xs text-primary hover:underline">
              ดูทั้งหมด →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เอกสาร</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.stats?.totalDocuments || 0}</div>
            <Link href="/dashboard/documents" className="text-xs text-primary hover:underline">
              ดูทั้งหมด →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายการรับ-จ่าย</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.stats?.totalPayments || 0}</div>
            <Link href="/dashboard/payments" className="text-xs text-primary hover:underline">
              ดูทั้งหมด →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle>เอกสารล่าสุด</CardTitle>
            <CardDescription>5 รายการล่าสุด</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentDocuments && data.recentDocuments.length > 0 ? (
                data.recentDocuments.map((doc: any) => (
                  <Link key={doc.id} href={`/dashboard/documents/${doc.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer border">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.documentNumber}</p>
                          <p className="text-xs text-muted-foreground">{doc.contactName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(Number(doc.totalAmount))}</p>
                        <Badge className={`text-xs ${statusLabels[doc.status]?.color || 'bg-gray-100'}`}>
                          {statusLabels[doc.status]?.label || doc.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>ยังไม่มีเอกสาร</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/dashboard/documents/new?type=quotation">สร้างเอกสารแรก</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>รายการรับ-จ่ายล่าสุด</CardTitle>
            <CardDescription>5 รายการล่าสุด</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentPayments && data.recentPayments.length > 0 ? (
                data.recentPayments.map((payment: any) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${payment.type === 'receive' ? 'bg-green-100' : 'bg-orange-100'}`}>
                        <Wallet className={`h-4 w-4 ${payment.type === 'receive' ? 'text-green-600' : 'text-orange-600'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{payment.paymentNumber}</p>
                        <p className="text-xs text-muted-foreground">{payment.contactName}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-medium ${payment.type === 'receive' ? 'text-green-600' : 'text-orange-600'}`}>
                      {payment.type === 'receive' ? '+' : '-'}{formatCurrency(Number(payment.amount))}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>ยังไม่มีรายการรับ-จ่าย</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/dashboard/payments/new?type=receive">บันทึกรายการแรก</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>ทางลัดไปยังฟังก์ชันที่ใช้บ่อย</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/documents/new?type=quotation" className="p-4 border rounded-lg hover:bg-muted hover:border-primary transition-all text-center group">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium">ใบเสนอราคา</p>
            </Link>
            <Link href="/dashboard/documents/new?type=invoice" className="p-4 border rounded-lg hover:bg-muted hover:border-primary transition-all text-center group">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">ใบแจ้งหนี้</p>
            </Link>
            <Link href="/dashboard/payments/new?type=receive" className="p-4 border rounded-lg hover:bg-muted hover:border-primary transition-all text-center group">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">รับเงิน</p>
            </Link>
            <Link href="/dashboard/reports" className="p-4 border rounded-lg hover:bg-muted hover:border-primary transition-all text-center group">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium">รายงาน</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
