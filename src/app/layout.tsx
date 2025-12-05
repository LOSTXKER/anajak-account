import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import './globals.css'

const sarabun = Sarabun({ 
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
})

export const metadata: Metadata = {
  title: 'Account Pro - ระบบบัญชีครบวงจร',
  description: 'ระบบบัญชีสำหรับมืออาชีพ ใช้งานง่าย แม้ไม่เคยทำบัญชี',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${sarabun.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
