import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const navLinks = [
    { href: '/products', label: 'Products' },
    { href: '/process', label: 'Process' },
    { href: '/benefits', label: 'Benefits' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <footer className="mt-16 border-t border-black/5 bg-[var(--color-bone)]/80">
      <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        {/* Brand + blurb */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg shadow-sm">
              <Image
                src="/logo.png"
                alt="Pristeneo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-base font-semibold tracking-tight">
              Pristeneo
            </span>
          </div>
          <p className="max-w-md text-xs text-[var(--color-ink)]/70 md:text-sm">
            Cold-pressed, lab-tested mustard oil crafted from traceable seeds
            for real kitchens, every day.
          </p>
        </div>

        {/* Links + contact */}
        <div className="grid gap-6 text-sm md:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]/70">
              Explore
            </h3>
            <ul className="mt-3 space-y-2">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-[var(--color-ink)]/80 hover:text-[var(--color-leaf)] md:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]/70">
              Contact
            </h3>
            <ul className="mt-3 space-y-2 text-xs md:text-sm">
              {/* mailto + external are fine as <a>, rule only cares about /internal paths */}
              <li>
                <a
                  href="mailto:pristeneo@gmail.com"
                  className="text-[var(--color-ink)]/80 hover:text-[var(--color-leaf)]"
                >
                  pristeneo@gmail.com
                </a>
              </li>
              <li className="text-[var(--color-ink)]/70">
                Kathmandu, Nepal
              </li>
            </ul>

            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-leaf)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--color-mustard-dark)] md:text-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/5 bg-[var(--color-bone)]/90">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-4 text-[10px] text-[var(--color-ink)]/60 md:flex-row md:text-xs">
          <p>© {new Date().getFullYear()} Pristeneo. All rights reserved.</p>
          <p>Crafted with care for mustard oil lovers.</p>
        </div>
      </div>
    </footer>
  )
}
