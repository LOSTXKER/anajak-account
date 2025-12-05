'use client'

import { useState, useEffect } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react'

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState('movements')
  const [search, setSearch] = useState('')
  const [movements, setMovements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovements()
  }, [])

  const fetchMovements = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/inventory/movements')
      const result = await response.json()
      if (result.success) {
        setMovements(result.data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const movementTypeConfig: Record<string, { label: string; icon: any; color: string }> = {
    in: { label: 'รับเข้า', icon: ArrowDownLeft, color: 'text-green-600' },
    out: { label: 'จ่ายออก', icon: ArrowUpRight, color: 'text-red-600' },
    adjust: { label: 'ปรับปรุง', icon: RefreshCw, color: 'text-blue-600' },
  }

  const filteredMovements = movements.filter(m => 
    m.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.reference?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">คลังสินค้า</h1>
          <p className="text-muted-foreground">ติดตามความเคลื่อนไหวและสต็อกสินค้า</p>
        </div>
        <Button onClick={fetchMovements}>
          <RefreshCw className="mr-2 h-4 w-4" />
          รีเฟรช
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">รายการเคลื่อนไหว</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movements.length}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-600">รับเข้า</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {movements.filter(m => m.type === 'in').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-600">จ่ายออก</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {movements.filter(m => m.type === 'out').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">ปรับปรุง</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {movements.filter(m => m.type === 'adjust').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ค้นหาสินค้า..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>วันที่</TableHead>
                <TableHead>สินค้า</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead className="text-right">จำนวน</TableHead>
                <TableHead>เอกสารอ้างอิง</TableHead>
                <TableHead>หมายเหตุ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredMovements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">ยังไม่มีความเคลื่อนไหว</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMovements.map((movement) => {
                  const config = movementTypeConfig[movement.type]
                  const Icon = config?.icon || Package
                  
                  return (
                    <TableRow key={movement.id} className="hover:bg-muted/50">
                      <TableCell className="text-muted-foreground">
                        {formatDate(movement.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{movement.product?.name || '-'}</div>
                        <div className="text-xs text-muted-foreground">{movement.product?.sku || ''}</div>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-2 ${config?.color}`}>
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{config?.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${config?.color}`}>
                        {movement.type === 'in' || movement.type === 'adjust' ? '+' : '-'}
                        {movement.quantity}
                      </TableCell>
                      <TableCell>
                        {movement.reference || movement.document?.documentNumber || '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {movement.notes || '-'}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

