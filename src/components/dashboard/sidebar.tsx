'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  CreditCard,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Building2,
  Warehouse,
  Receipt,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'ลูกค้า/คู่ค้า',
    href: '/dashboard/contacts',
    icon: Users,
  },
  {
    name: 'สินค้า/บริการ',
    href: '/dashboard/products',
    icon: Package,
  },
  {
    name: 'เอกสาร',
    href: '/dashboard/documents',
    icon: FileText,
  },
  {
    name: 'รับ-จ่ายเงิน',
    href: '/dashboard/payments',
    icon: CreditCard,
  },
  {
    name: 'คลังสินค้า',
    href: '/dashboard/inventory',
    icon: Warehouse,
  },
  {
    name: 'ระบบบัญชี',
    href: '/dashboard/accounting',
    icon: BookOpen,
  },
  {
    name: 'รายงานภาษี',
    href: '/dashboard/tax',
    icon: Receipt,
  },
  {
    name: 'รายงาน',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-border">
        <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-sm">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-foreground">Account</span>
          <span className="text-lg font-bold text-primary">Pro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          เมนูหลัก
        </p>
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* Bottom Section */}
      <div className="p-3 space-y-1">
        <Link
          href="/dashboard/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
            pathname.startsWith('/dashboard/settings')
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Settings className="h-5 w-5" />
          ตั้งค่า
        </Link>
        
        <button
          onClick={() => {
            document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
            window.location.href = '/login'
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          ออกจากระบบ
        </button>
      </div>

      {/* User Info */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">User</p>
            <p className="text-xs text-muted-foreground truncate">บริษัทของคุณ</p>
          </div>
        </div>
      </div>
    </div>
  )
}
