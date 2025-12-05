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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  Search, 
  FileText, 
  Eye,
  Copy,
  Trash2,
  MoreHorizontal,
  FileCheck,
  FileClock,
  FileX,
  Receipt
} from 'lucide-react'

const documentTypes = [
  { value: 'quotation', label: 'ใบเสนอราคา', icon: '📄' },
  { value: 'invoice', label: 'ใบแจ้งหนี้', icon: '📃' },
  { value: 'tax_invoice', label: 'ใบกำกับภาษี', icon: '🧾' },
  { value: 'receipt', label: 'ใบเสร็จรับเงิน', icon: '🧾' },
  { value: 'purchase_order', label: 'ใบสั่งซื้อ', icon: '📋' },
]

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'แบบร่าง', variant: 'secondary' },
  pending: { label: 'รอดำเนินการ', variant: 'outline' },
  approved: { label: 'อนุมัติแล้ว', variant: 'default' },
  paid: { label: 'ชำระแล้ว', variant: 'default' },
  partial: { label: 'ชำระบางส่วน', variant: 'outline' },
  overdue: { label: 'เกินกำหนด', variant: 'destructive' },
  cancelled: { label: 'ยกเลิก', variant: 'destructive' },
}

export default function DocumentsPage() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [search, filterType, filterStatus])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filterType !== 'all') params.append('type', filterType)
      if (filterStatus !== 'all') params.append('status', filterStatus)

      const response = await fetch(`/api/documents?${params}`)
      const result = await response.json()

      if (result.success) {
        setDocuments(result.data)
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
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending' || d.status === 'approved').length,
    paid: documents.filter(d => d.status === 'paid').length,
    overdue: documents.filter(d => d.status === 'overdue').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">เอกสาร</h1>
          <p className="text-muted-foreground">จัดการเอกสารทางการเงินทั้งหมด</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              สร้างเอกสาร
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {documentTypes.map((type) => (
              <DropdownMenuItem key={type.value} asChild>
                <Link href={`/dashboard/documents/new?type=${type.value}`} className="cursor-pointer">
                  <span className="mr-2">{type.icon}</span>
                  {type.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ทั้งหมด</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">รอดำเนินการ</CardTitle>
            <FileClock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ชำระแล้ว</CardTitle>
            <FileCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.paid}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">เกินกำหนด</CardTitle>
            <FileX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/documents/new?type=quotation">
            <Receipt className="mr-2 h-4 w-4" />
            ใบเสนอราคา
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/documents/new?type=invoice">
            <FileText className="mr-2 h-4 w-4" />
            ใบแจ้งหนี้
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/documents/new?type=tax_invoice">
            <FileCheck className="mr-2 h-4 w-4" />
            ใบกำกับภาษี
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
                placeholder="ค้นหาเลขที่เอกสาร, ชื่อลูกค้า..."
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
                <SelectItem value="all">ทุกประเภท</SelectItem>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                {Object.entries(statusConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>เลขที่เอกสาร</TableHead>
                <TableHead>ลูกค้า/คู่ค้า</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead className="hidden md:table-cell">วันที่</TableHead>
                <TableHead className="text-right">ยอดรวม</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">การดำเนินการ</TableHead>
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
              ) : documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">ยังไม่มีเอกสาร</p>
                    <Button className="mt-4" asChild>
                      <Link href="/dashboard/documents/new?type=quotation">
                        <Plus className="mr-2 h-4 w-4" />
                        สร้างเอกสารแรก
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Link href={`/dashboard/documents/${doc.id}`} className="font-mono text-sm text-primary hover:underline">
                        {doc.documentNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{doc.contact?.name || '-'}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {documentTypes.find(t => t.value === doc.type)?.label || doc.type}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatDate(doc.issueDate)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ฿{formatCurrency(doc.grandTotal)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[doc.status]?.variant || 'secondary'}>
                        {statusConfig[doc.status]?.label || doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/documents/${doc.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              ดูเอกสาร
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            คัดลอก
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            ลบ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
