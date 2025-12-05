import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  BarChart3, 
  Shield, 
  Zap,
  Building2,
  Users,
  Receipt,
  TrendingUp,
  Star
} from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      title: 'จัดการเอกสารครบวงจร',
      description: 'ใบเสนอราคา ใบแจ้งหนี้ ใบเสร็จ ใบกำกับภาษี พร้อมคำนวณ VAT และหัก ณ ที่จ่ายอัตโนมัติ',
    },
    {
      icon: Receipt,
      title: 'รับ-จ่ายเงินอัจฉริยะ',
      description: 'เชื่อมกับเอกสาร อัพเดทสถานะอัตโนมัติ รองรับหลายวิธีชำระ ติดตามยอดค้างได้ทันที',
    },
    {
      icon: BarChart3,
      title: 'รายงานการเงินมืออาชีพ',
      description: 'งบทดลอง งบดุล งบกำไรขาดทุน พร้อม Export PDF ได้ทันที',
    },
    {
      icon: Shield,
      title: 'ปลอดภัยระดับธนาคาร',
      description: 'เข้ารหัสข้อมูลทั้งหมด แยกข้อมูลแต่ละบริษัท ตรวจสอบได้ทุกขั้นตอน',
    },
    {
      icon: Zap,
      title: 'ใช้งานง่าย รวดเร็ว',
      description: 'ไม่ต้องมีความรู้บัญชี ระบบนำทางทุกขั้นตอน พร้อมใช้งานทันที',
    },
    {
      icon: TrendingUp,
      title: 'Dashboard อัจฉริยะ',
      description: 'ดูภาพรวมธุรกิจ รายได้-รายจ่าย ลูกค้าชั้นนำ ทุกอย่างในหน้าเดียว',
    },
  ]

  const benefits = [
    'คำนวณภาษี VAT 7% อัตโนมัติ',
    'รองรับหัก ณ ที่จ่าย 1%, 3%, 5%',
    'เลขที่เอกสารวิ่งอัตโนมัติ',
    'พิมพ์และ Export PDF ได้ทันที',
    'รองรับหลายบริษัท (Multi-tenant)',
    'ใช้งานได้ทุกอุปกรณ์',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              Account<span className="text-primary">Pro</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">เข้าสู่ระบบ</Link>
            </Button>
            <Button asChild>
              <Link href="/register">
                ทดลองใช้ฟรี
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            ระบบบัญชีออนไลน์สำหรับธุรกิจไทย
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            จัดการบัญชีธุรกิจ
            <br />
            <span className="text-primary">ง่ายกว่าที่คิด</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            ระบบบัญชีครบวงจรที่ออกแบบมาเพื่อธุรกิจ SME ไทย 
            ออกเอกสาร รับ-จ่ายเงิน รายงานการเงิน ทุกอย่างในที่เดียว
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-12" asChild>
              <Link href="/register">
                เริ่มต้นใช้งานฟรี
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-12" asChild>
              <Link href="/login">
                เข้าสู่ระบบ
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-20">
          {[
            { value: '5+', label: 'ประเภทเอกสาร' },
            { value: '3', label: 'รายงานการเงิน' },
            { value: '100%', label: 'ฟรี' },
            { value: '24/7', label: 'ใช้งานได้ตลอด' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ฟีเจอร์ที่ครบครัน
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ทุกอย่างที่คุณต้องการสำหรับจัดการบัญชีธุรกิจ
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto bg-card rounded-3xl border border-border p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                ทำไมต้องเลือก
                <span className="text-primary"> AccountPro</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                เราออกแบบระบบให้ใช้งานง่าย แม้ไม่มีความรู้ด้านบัญชี 
                ก็สามารถจัดการธุรกิจได้อย่างมืออาชีพ
              </p>
              <Button size="lg" asChild>
                <Link href="/register">
                  เริ่มต้นใช้งาน
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            พร้อมเริ่มต้นหรือยัง?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            สมัครใช้งานฟรีวันนี้ ไม่ต้องใส่บัตรเครดิต
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-12" asChild>
              <Link href="/register">
                สมัครฟรี
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">
                Account<span className="text-primary">Pro</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 AccountPro. ระบบบัญชีสำหรับธุรกิจไทย
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
