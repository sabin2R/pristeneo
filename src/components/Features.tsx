'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'

const items = [
  {
    title: 'Cold-Pressed',
    body: 'Low-temperature extraction to retain natural pungency & nutrients.',
    img: '/features/cold-pressed.png',
  },
  {
    title: 'Lab Tested',
    body: 'Every batch tested for purity, peroxide value & moisture.',
    img: '/features/lab-test.png',
  },
  {
    title: 'Traceable Seeds',
    body: 'Sourced from trusted farms with documented origin.',
    img: '/features/trace-seeds.png',
  },
]

export default function Features() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="text-3xl font-bold">Why Pristeneo</h2>

        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-black/10 shadow-[var(--shadow-soft)]"
            >
              {/* Background image */}
              <div className="absolute inset-0 -z-10">
                <Image
                  src={f.img}
                  alt=""                 // decorative
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  priority={i === 0}
                />
              </div>

              {/* Brand tint + legibility gradient */}
              <div
                className="absolute inset-0 -z-10 mix-blend-multiply"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-mustard), var(--color-leaf))',
                  opacity: 0.18,
                }}
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

              {/* Soft glow on hover */}
              <div className="pointer-events-none absolute -right-16 -bottom-16 size-64 rounded-full bg-mustard/25 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-80" />

              {/* Content */}
              <div className="relative p-6">
                <h3 className="text-xl font-semibold text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                  {f.title}
                </h3>
                <p className="mt-2 text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                  {f.body}
                </p>

                {/* Underline accent on hover */}
                <span className="mt-4 inline-block h-[2px] w-0 bg-mustard transition-all duration-300 group-hover:w-16" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
