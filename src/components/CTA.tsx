import Link from 'next/link'

export default function CTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -skew-y-1" style={{ background: 'linear-gradient(135deg, var(--color-mustard), var(--color-leaf))', opacity: .15 }} />
      <div className="container section relative">
        <div className="card p-8 md:flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Ready to stock Pristeneo in your store?</h3>
            <p className="opacity-80">Wholesale pricing, consistent supply, and marketing support.</p>
          </div>
          <Link href="/contact" className="mt-4 md:mt-0 rounded-lg bg-mustard text-ink px-5 py-3 font-semibold hover:brightness-110">
            Become a Distributor
          </Link>
        </div>
      </div>
    </section>
  )
}
