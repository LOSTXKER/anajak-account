'use client'

import { useState } from 'react'
import { Building2, User, Bell, Shield, Palette } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">ตั้งค่า</h1>
        <p className="text-muted-foreground">จัดการการตั้งค่าบัญชีและบริษัทของคุณ</p>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            ข้อมูลบริษัท
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            โปรไฟล์
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            การแจ้งเตือน
          </TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลบริษัท</CardTitle>
              <CardDescription>
                ข้อมูลนี้จะแสดงในเอกสารและใบกำกับภาษีของคุณ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">ชื่อบริษัท</Label>
                  <Input id="companyName" placeholder="บริษัท ตัวอย่าง จำกัด" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyNameEn">ชื่อบริษัท (ภาษาอังกฤษ)</Label>
                  <Input id="companyNameEn" placeholder="Example Co., Ltd." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxId">เลขประจำตัวผู้เสียภาษี</Label>
                  <Input id="taxId" placeholder="0123456789012" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchCode">รหัสสาขา</Label>
                  <Input id="branchCode" placeholder="00000" defaultValue="00000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">ที่อยู่</Label>
                <Input id="address" placeholder="123 ถนนตัวอย่าง แขวงตัวอย่าง เขตตัวอย่าง กรุงเทพฯ 10000" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input id="phone" placeholder="02-XXX-XXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input id="email" type="email" placeholder="info@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">เว็บไซต์</Label>
                  <Input id="website" placeholder="www.example.com" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button disabled={saving}>
                  {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลส่วนตัว</CardTitle>
              <CardDescription>
                จัดการข้อมูลบัญชีผู้ใช้ของคุณ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">ชื่อ</Label>
                  <Input id="firstName" placeholder="ชื่อ" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">นามสกุล</Label>
                  <Input id="lastName" placeholder="นามสกุล" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">อีเมล</Label>
                <Input id="userEmail" type="email" placeholder="you@example.com" disabled />
                <p className="text-xs text-muted-foreground">ไม่สามารถเปลี่ยนอีเมลได้</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userPhone">เบอร์โทรศัพท์</Label>
                <Input id="userPhone" placeholder="08X-XXX-XXXX" />
              </div>
              <div className="flex justify-end">
                <Button disabled={saving}>
                  {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>การแจ้งเตือน</CardTitle>
              <CardDescription>
                ตั้งค่าการรับการแจ้งเตือนต่างๆ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">แจ้งเตือนเอกสารใกล้ครบกำหนด</p>
                    <p className="text-sm text-muted-foreground">รับการแจ้งเตือนเมื่อเอกสารใกล้ครบกำหนดชำระ</p>
                  </div>
                  <Button variant="outline" size="sm">เปิดใช้งาน</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">แจ้งเตือนสต็อกต่ำ</p>
                    <p className="text-sm text-muted-foreground">รับการแจ้งเตือนเมื่อสินค้าเหลือน้อย</p>
                  </div>
                  <Button variant="outline" size="sm">เปิดใช้งาน</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">สรุปรายงานรายสัปดาห์</p>
                    <p className="text-sm text-muted-foreground">รับสรุปรายงานทางอีเมลทุกสัปดาห์</p>
                  </div>
                  <Button variant="outline" size="sm">เปิดใช้งาน</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

