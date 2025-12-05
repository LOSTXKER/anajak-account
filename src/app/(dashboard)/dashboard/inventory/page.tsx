'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Search,
  Package,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Fetch products for stock view
      const response = await fetch('/api/products')
      const result = await response.json()
      if (result.success && result.data) {
        setProducts(result.data)
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Error:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  // Count low stock products (stock < 10)
  const lowStockProducts = products.filter(p => (p.stockQuantity || 0) < 10 && (p.stockQuantity || 0) > 0)
  const outOfStockProducts = products.filter(p => (p.stockQuantity || 0) <= 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">คลังสินค้า</h1>
          <p className="text-muted-foreground">ติดตามสต็อกสินค้า</p>
        </div>
        <Button onClick={fetchProducts} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          รีเฟรช
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">สินค้าทั้งหมด</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">สต็อกต่ำ</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground">จำนวนน้อยกว่า 10</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-600">หมดสต็อก</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</div>
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
            <Button asChild>
              <Link href="/dashboard/products">จัดการสินค้า</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>รหัสสินค้า</TableHead>
                <TableHead>ชื่อสินค้า</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead className="text-right">สต็อก</TableHead>
                <TableHead>หน่วย</TableHead>
                <TableHead>สถานะ</TableHead>
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
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">ยังไม่มีสินค้า</p>
                    <Button variant="link" asChild className="mt-2">
                      <Link href="/dashboard/products">เพิ่มสินค้าใหม่</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const stock = product.stockQuantity || 0
                  let stockStatus = { label: 'ปกติ', color: 'bg-green-100 text-green-700' }
                  if (stock <= 0) {
                    stockStatus = { label: 'หมด', color: 'bg-red-100 text-red-700' }
                  } else if (stock < 10) {
                    stockStatus = { label: 'ต่ำ', color: 'bg-orange-100 text-orange-700' }
                  }
                  
                  return (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">
                        {product.sku || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{product.name}</div>
                        {product.description && (
                          <div className="text-xs text-muted-foreground truncate max-w-xs">
                            {product.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.category?.name || '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {stock}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.unit || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={stockStatus.color}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle className="text-lg">💡 การติดตามสต็อก</CardTitle>
          <CardDescription>
            สต็อกจะถูกอัพเดทอัตโนมัติเมื่อสร้างเอกสารขาย/ซื้อ (ฟีเจอร์นี้กำลังพัฒนา)
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
