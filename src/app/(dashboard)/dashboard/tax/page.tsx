'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { 
  FileText,
  Calculator,
  AlertCircle,
  Construction
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TaxReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">รายงานภาษี</h1>
        <p className="text-muted-foreground">สรุปภาษีมูลค่าเพิ่มและภาษีหัก ณ ที่จ่าย</p>
      </div>

      {/* Coming Soon Notice */}
      <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Construction className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">กำลังพัฒนา</CardTitle>
          <CardDescription className="text-base">
            ฟีเจอร์รายงานภาษีกำลังอยู่ในระหว่างการพัฒนา
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Preview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ภ.พ.30</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              แบบแสดงรายการภาษีมูลค่าเพิ่ม
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ภาษีซื้อ (Input VAT)</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">-</div>
            <p className="text-xs text-muted-foreground">
              รายงานภาษีซื้อ
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ภาษีขาย (Output VAT)</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">-</div>
            <p className="text-xs text-muted-foreground">
              รายงานภาษีขาย
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Coming */}
      <Card>
        <CardHeader>
          <CardTitle>ฟีเจอร์ที่กำลังพัฒนา</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">ภ.พ.30 - แบบแสดงรายการภาษีมูลค่าเพิ่ม</p>
                <p className="text-sm text-muted-foreground">สรุปภาษีซื้อ-ขาย และคำนวณภาษีที่ต้องชำระ/ขอคืน</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">รายงานภาษีซื้อ-ขาย</p>
                <p className="text-sm text-muted-foreground">รายละเอียดภาษีจากเอกสารขายและซื้อ</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">50 ทวิ - หนังสือรับรองหัก ณ ที่จ่าย</p>
                <p className="text-sm text-muted-foreground">พิมพ์หนังสือรับรองภาษีหัก ณ ที่จ่าย</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/documents">ดูเอกสาร</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/reports">รายงานการเงิน</Link>
        </Button>
      </div>
    </div>
  )
}
