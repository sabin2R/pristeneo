import Link from 'next/link'
import Image from 'next/image'

export default function CTA() {
  return (
    <section className="section">
      <div className="container">
        {/* curved, image-backed banner */}
        <div className="group relative overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)]">
          {/* background image */}
          <Image
            src="/cta2.png"   // put your image in /public
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />

          {/* brand tint */}
          <div
            className="absolute inset-0 -skew-y-1 pointer-events-none mix-blend-multiply"
            style={{ background: 'linear-gradient(135deg, var(--color-mustard), var(--color-leaf))', opacity: .28 }}
          />
          {/* soft dark for legibility */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

          {/* content */}
          <div className="relative z-10 px-6 py-10 md:px-12 md:py-14 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              {/* <div className="inline-flex items-center gap-2 font-bold text-lg mix-blend-overlay">
                <span className="size-2 rounded-full bg-mustard" />
                Pristeneo
              </div> */}
              <h3 className="mt-2 text-3xl md:text-4xl font-extrabold drop-shadow-[0_6px_20px_rgba(0,0,0,0.55)]">
                Ready to stock Pristeneo in your store?
              </h3>
              <p className="mt-2 opacity-95 drop-shadow-[0_3px_12px_rgba(0,0,0,0.6)]">
                Wholesale pricing, consistent supply, and marketing support.
              </p>
            </div>

            {/* brand hover — no gray */}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-mustard text-ink px-5 py-3 font-semibold transition-colors duration-200 hover:bg-mustard-dark focus:outline-none focus:ring-2 focus:ring-mustard-dark focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Become a Distributor
            </Link>
          </div>

          {/* optional: subtle tint shift on hover */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20"
            style={{ background: 'radial-gradient(closest-side, var(--color-leaf), transparent)' }}
          />
        </div>
      </div>
    </section>
  )
}
