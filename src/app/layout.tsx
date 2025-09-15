// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Pristeneo Mustard Oil',
  description: 'Pure, cold-pressed mustard oil for health and taste.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />   {/* ✅ now included globally */}
        <main>{children}</main>
      </body>
    </html>
  )
}
