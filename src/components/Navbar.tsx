'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/process', label: 'Process' },
  { href: '/benefits', label: 'Benefits' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-[--color-background]/70 border-b border-black/10">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="inline-flex items-center gap-2 font-bold">
          <span className="size-2 rounded-full bg-mustard inline-block" />
          Pristeneo
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative transition-colors ${active ? 'text-mustard' : 'hover:text-mustard'}`}
              >
                {l.label}
                {active && <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-mustard" />}
              </Link>
            )
          })}
          <Link
            href="/contact"
            className="rounded-lg bg-mustard text-ink px-3 py-2 font-medium hover:brightness-110"
          >
            Contact
          </Link>
        </nav>

        <button className="md:hidden" onClick={() => setOpen(v=>!v)} aria-label="Menu">☰</button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/10">
          <div className="container py-3 grid gap-3">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={()=>setOpen(false)} className="hover:text-mustard">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
