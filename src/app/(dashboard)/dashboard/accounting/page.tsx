'use client'

import { useState, useEffect } from 'react'
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
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search,
  BookOpen,
  FileSpreadsheet,
  Calculator,
  Layers
} from 'lucide-react'

const accountTypes = [
  { value: 'asset', label: 'สินทรัพย์', color: 'text-blue-600' },
  { value: 'liability', label: 'หนี้สิน', color: 'text-orange-600' },
  { value: 'equity', label: 'ส่วนของผู้ถือหุ้น', color: 'text-purple-600' },
  { value: 'revenue', label: 'รายได้', color: 'text-green-600' },
  { value: 'expense', label: 'ค่าใช้จ่าย', color: 'text-red-600' },
]

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState('accounts')
  const [search, setSearch] = useState('')
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
  const [isJournalDialogOpen, setIsJournalDialogOpen] = useState(false)
  
  const [accounts, setAccounts] = useState<any[]>([])
  const [journalEntries, setJournalEntries] = useState<any[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [loadingJournal, setLoadingJournal] = useState(true)

  const [accountForm, setAccountForm] = useState({
    code: '',
    name: '',
    type: 'asset',
    description: '',
  })

  const [journalForm, setJournalForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    debitAccountId: '',
    creditAccountId: '',
    amount: 0,
  })

  useEffect(() => {
    fetchAccounts()
    fetchJournalEntries()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts')
      const result = await response.json()
      if (result.success) setAccounts(result.data)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoadingAccounts(false)
    }
  }

  const fetchJournalEntries = async () => {
    try {
      const response = await fetch('/api/journal-entries')
      const result = await response.json()
      if (result.success) setJournalEntries(result.data)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoadingJournal(false)
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountForm),
      })
      const result = await response.json()
      if (result.success) {
        setIsAccountDialogOpen(false)
        setAccountForm({ code: '', name: '', type: 'asset', description: '' })
        fetchAccounts()
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleCreateJournal = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/journal-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(journalForm),
      })
      const result = await response.json()
      if (result.success) {
        setIsJournalDialogOpen(false)
        setJournalForm({
          date: new Date().toISOString().split('T')[0],
          description: '',
          debitAccountId: '',
          creditAccountId: '',
          amount: 0,
        })
        fetchJournalEntries()
      }
    } catch (err) {
      console.error('Error:', err)
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

  const filteredAccounts = accounts.filter(a => 
    a.code?.toLowerCase().includes(search.toLowerCase()) ||
    a.name?.toLowerCase().includes(search.toLowerCase())
  )

  const accountStats = {
    total: accounts.length,
    asset: accounts.filter(a => a.type?.name === 'asset').length,
    liability: accounts.filter(a => a.type?.name === 'liability').length,
    revenue: accounts.filter(a => a.type?.name === 'revenue').length,
    expense: accounts.filter(a => a.type?.name === 'expense').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ระบบบัญชี</h1>
          <p className="text-muted-foreground">ผังบัญชีและรายการบันทึกบัญชี</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="accounts" className="gap-2">
            <BookOpen className="h-4 w-4" />
            ผังบัญชี
          </TabsTrigger>
          <TabsTrigger value="journal" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            บันทึกบัญชี
          </TabsTrigger>
        </TabsList>

        {/* Chart of Accounts Tab */}
        <TabsContent value="accounts" className="space-y-6 mt-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">ทั้งหมด</CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accountStats.total}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-600">สินทรัพย์</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{accountStats.asset}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-orange-600">หนี้สิน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{accountStats.liability}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-green-600">รายได้</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{accountStats.revenue}</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-red-600">ค่าใช้จ่าย</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{accountStats.expense}</div>
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
                    placeholder="ค้นหารหัส, ชื่อบัญชี..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      เพิ่มบัญชี
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>เพิ่มบัญชีใหม่</DialogTitle>
                      <DialogDescription>สร้างบัญชีในผังบัญชี</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateAccount} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>รหัสบัญชี *</Label>
                          <Input
                            value={accountForm.code}
                            onChange={(e) => setAccountForm({ ...accountForm, code: e.target.value })}
                            placeholder="1100"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ประเภท *</Label>
                          <Select
                            value={accountForm.type}
                            onValueChange={(value) => setAccountForm({ ...accountForm, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {accountTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>ชื่อบัญชี *</Label>
                        <Input
                          value={accountForm.name}
                          onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                          placeholder="เงินสด"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>คำอธิบาย</Label>
                        <Input
                          value={accountForm.description}
                          onChange={(e) => setAccountForm({ ...accountForm, description: e.target.value })}
                          placeholder="รายละเอียด..."
                        />
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAccountDialogOpen(false)}>ยกเลิก</Button>
                        <Button type="submit">บันทึก</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-24">รหัส</TableHead>
                    <TableHead>ชื่อบัญชี</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead className="text-right">ยอดคงเหลือ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingAccounts ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-muted-foreground">ยังไม่มีบัญชี</p>
                        <Button className="mt-4" onClick={() => setIsAccountDialogOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          เพิ่มบัญชีแรก
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAccounts.map((account) => (
                      <TableRow key={account.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">{account.code}</TableCell>
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={accountTypes.find(t => t.value === account.type?.name)?.color}>
                            {accountTypes.find(t => t.value === account.type?.name)?.label || account.type?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ฿{formatCurrency(account.balance || 0)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Journal Entries Tab */}
        <TabsContent value="journal" className="space-y-6 mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  รายการบันทึกบัญชี
                </CardTitle>
                <Dialog open={isJournalDialogOpen} onOpenChange={setIsJournalDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      บันทึกรายการ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>บันทึกรายการใหม่</DialogTitle>
                      <DialogDescription>บันทึกรายการเดบิต-เครดิต</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateJournal} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>วันที่ *</Label>
                          <Input
                            type="date"
                            value={journalForm.date}
                            onChange={(e) => setJournalForm({ ...journalForm, date: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>จำนวนเงิน *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={journalForm.amount}
                            onChange={(e) => setJournalForm({ ...journalForm, amount: parseFloat(e.target.value) || 0 })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>รายละเอียด *</Label>
                        <Input
                          value={journalForm.description}
                          onChange={(e) => setJournalForm({ ...journalForm, description: e.target.value })}
                          placeholder="รายละเอียดรายการ"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>บัญชีเดบิต *</Label>
                        <Select
                          value={journalForm.debitAccountId}
                          onValueChange={(value) => setJournalForm({ ...journalForm, debitAccountId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกบัญชี" />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map(acc => (
                              <SelectItem key={acc.id} value={acc.id}>
                                {acc.code} - {acc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>บัญชีเครดิต *</Label>
                        <Select
                          value={journalForm.creditAccountId}
                          onValueChange={(value) => setJournalForm({ ...journalForm, creditAccountId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกบัญชี" />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map(acc => (
                              <SelectItem key={acc.id} value={acc.id}>
                                {acc.code} - {acc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsJournalDialogOpen(false)}>ยกเลิก</Button>
                        <Button type="submit">บันทึก</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>วันที่</TableHead>
                    <TableHead>เลขที่</TableHead>
                    <TableHead>รายละเอียด</TableHead>
                    <TableHead className="text-right">เดบิต</TableHead>
                    <TableHead className="text-right">เครดิต</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingJournal ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : journalEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-muted-foreground">ยังไม่มีรายการ</p>
                        <Button className="mt-4" onClick={() => setIsJournalDialogOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          บันทึกรายการแรก
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    journalEntries.map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-muted/50">
                        <TableCell className="text-muted-foreground">{formatDate(entry.date)}</TableCell>
                        <TableCell className="font-mono text-sm">{entry.entryNumber}</TableCell>
                        <TableCell className="font-medium">{entry.description}</TableCell>
                        <TableCell className="text-right font-medium text-blue-600">
                          ฿{formatCurrency(entry.totalDebit || 0)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-orange-600">
                          ฿{formatCurrency(entry.totalCredit || 0)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
