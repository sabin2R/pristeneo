'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/process', label: 'Process' },
  { href: '/benefits', label: 'Benefits' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[var(--background)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-lg shadow-sm">
            <Image
              src="/logo.png"
              alt="Pristeneo"
              fill
              className="object-cover"
            />
          </div>
          <span>Pristeneo</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[var(--color-leaf)] ${
                  active
                    ? 'text-[var(--color-leaf)] font-semibold'
                    : 'text-[var(--color-ink)]/80'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/contact"
            className="rounded-full bg-[var(--color-leaf)] px-5 py-2 text-sm font-medium text-white transition-transform hover:bg-[var(--color-mustard-dark)] active:scale-95"
          >
            Contact Us
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="relative z-50 p-2 md:hidden"
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle Menu"
          aria-expanded={open}
        >
          <div className="flex h-6 w-6 flex-col items-center justify-center">
            <span
              className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                open ? 'translate-y-0.5 rotate-45' : '-translate-y-1'
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                open ? '-translate-y-1.5 -rotate-45' : 'translate-y-1'
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="
            fixed inset-x-0 top-16 z-50
            flex flex-col gap-2
            border-b border-black/5
            bg-[var(--background)] shadow-xl
            md:hidden
            p-4
          "
        >
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)} // ✅ close when clicking a link
              className="block border-b border-gray-100 p-4 text-lg font-medium last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <Link
              href="/contact"
              onClick={() => setOpen(false)} // ✅ also closes
              className="block w-full rounded-xl bg-[var(--color-leaf)] py-3 text-center font-bold text-white"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      )}

      {/* Backdrop behind menu */}
      {open && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  )
}
