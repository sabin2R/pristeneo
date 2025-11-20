import type { Metadata } from 'next'
import './globals.css'
import JsonLd from '@/components/JsonLd'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'


// update metadata
export const metadata: Metadata = {
  title: { default: 'Pristeneo Mustard Oil', template: '%s | Pristeneo' },
  description: 'Pure, cold-pressed mustard oil — lab tested, traceable, and delicious.',
  openGraph: {
    type: 'website',
    title: 'Pristeneo Mustard Oil',
    description: 'Pure, cold-pressed mustard oil — lab tested, traceable, and delicious.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Pristeneo',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pristeneo',
    url,
    logo: `${url}/favicon.ico`,
    sameAs: [
      // add socials if any, e.g. 'https://www.facebook.com/yourpage'
    ]
  }

  return (
    <html lang="en">
      <body>
        <Navbar />
        
        <main>{children}</main>
        <Footer />
        <JsonLd data={org} />
      </body>
    </html>
  )
}
