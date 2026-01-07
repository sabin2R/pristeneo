'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background ornaments */}
      {/* <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-[800px] rounded-full opacity-40 blur-3xl"
             style={{ background: 'radial-gradient(closest-side, rgba(226,180,1,.25), transparent)' }} />
        <div className="absolute inset-0 opacity-[0.06]"
             style={{ backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div> */}

      <div className="container section grid md:grid-cols-2 items-center gap-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-sm bg-white/70 backdrop-blur">
            <span className="size-2 rounded-full bg-mustard" /> Cold-Pressed • Lab Tested • Traceable
          </div>
          <h1 className="mt-5 text-5xl md:text-6xl font-extrabold leading-tight">
            Pure, Cold-Pressed <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-brand)' }}>Mustard Oil</span>
          </h1>
          <p className="mt-4 max-w-xl opacity-80">
            From carefully selected mustard seeds to a gentle cold-press—Pristeneo preserves aroma, nutrition, and authenticity.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="rounded-lg bg-mustard text-ink px-5 py-3 font-semibold shadow hover:brightness-110">
              Order Now
            </Link>
            <Link href="/process" className="rounded-lg border px-5 py-3 hover:border-mustard hover:text-mustard">
              See Our Process
            </Link>
          </div>

          <ul className="mt-6 grid grid-cols-3 max-w-md text-sm opacity-80">
            <li>• Omega-3 Rich</li>
            <li>• Authentic Pungency</li>
            <li>• No Additives</li>
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          {/* <div className="card p-4"> */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)]">
              <Image src="/Hero.PNG" alt="Pristeneo Mustard Oil Bottle" fill className="object-contain" />
            </div>
            <div className="-mt-6 grid grid-cols-3 gap-3 text-sm">
              {[' 1 L','5 L'].map(s => (
                <div key={s} className="rounded border px-3 py-2 text-center hover:border-mustard">{s}</div>
              ))}
            </div>
          
          {/* Glow */}
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] opacity-50 blur-2xl"
               style={{ background: 'radial-gradient(closest-side, rgba(226,180,1,.35), transparent)' }} />
        </motion.div>
      </div>
    </section>
  )
}
