// src/app/(site)/benefits/BenefitsContent.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const benefits = [
  {
    title: 'Cold-Pressed Goodness',
    body: 'Low-temperature extraction helps retain natural antioxidants, aroma, and the sharp flavour mustard oil is known for.',
    image: '/features/cold-pressed.png',
  },
  {
    title: 'Lab-Tested for Peace of Mind',
    body: 'Every batch is lab-tested so you can trust that what goes into your kitchen is safe, pure, and consistent.',
    image: '/features/lab-test.png',
  },
  {
    title: 'Versatile in the Kitchen',
    body: 'From tadka and pickles to deep frying and marinades, Pristeneo mustard oil stands up to high-heat cooking while delivering bold flavour.',
    image: '/features/kitchen.jpg',
  },
]

export default function BenefitsContent() {
  return (
    <section className="flex flex-col gap-12">
      <header className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
        <div>
          <motion.h1
            className="text-3xl font-semibold tracking-tight md:text-4xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Everyday benefits, from pan to plate
          </motion.h1>
          <motion.p
            className="mt-4 text-sm text-muted-foreground md:text-base"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Pristeneo mustard oil is crafted for real kitchens — bold enough for
            traditional recipes, clean enough for daily use, and transparent
            enough to trust.
          </motion.p>
        </div>

        <motion.div
          className="relative h-48 overflow-hidden rounded-3xl border border-border/60 bg-background/60 shadow-sm backdrop-blur md:h-60"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Image
            src="/features/ctaBenefit.PNG"
            alt="Pristeneo mustard oil bottle"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 320px, 100vw"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-background/60 mix-blend-multiply" />
        </motion.div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {benefits.map((benefit, idx) => (
          <motion.article
            key={benefit.title}
            className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-background/70 shadow-sm backdrop-blur"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
          >
            <div className="relative h-32">
              <Image
                src={benefit.image}
                alt={benefit.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(min-width: 768px) 260px, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-background/50 mix-blend-multiply" />
            </div>
            <div className="flex flex-1 flex-col px-4 py-4">
              <h2 className="text-sm font-semibold md:text-base">
                {benefit.title}
              </h2>
              <p className="mt-2 text-xs text-muted-foreground md:text-sm">
                {benefit.body}
              </p>
            </div>
          </motion.article>
        ))}
      </section>
    </section>
  )
}
