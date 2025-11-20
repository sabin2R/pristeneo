// src/app/(site)/process/ProcessContent.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const steps = [
  {
    id: 1,
    title: 'Traceable Seeds',
    description:
      'We partner with trusted farmers and source only high-quality, traceable mustard seeds.',
    image: '/process/trace-seed.jpg',
  },
  {
    id: 2,
    title: 'Cold-Press Extraction',
    description:
      'Seeds are cold-pressed at low temperatures to retain natural flavour, aroma, and nutrients.',
    image: '/features/cold-pressed.png',
  },
  {
    id: 3,
    title: 'Lab Testing',
    description:
      'Every batch is tested in accredited labs for purity, safety, and quality benchmarks.',
    image: '/features/lab-test.png',
  },
  {
    id: 4,
    title: 'Fresh Packaging',
    description:
      'Oil is bottled quickly in food-grade containers to lock in freshness from press to plate.',
    image: '/process/fresh.jpg',
  },
]

export default function ProcessContent() {
  return (
    <section className="flex flex-col gap-12">
      <header className="text-center">
        <motion.h1
          className="text-3xl font-semibold tracking-tight md:text-4xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          From Seed to Bottle
        </motion.h1>
        <motion.p
          className="mt-4 text-sm text-muted-foreground md:text-base"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Every drop of Pristeneo mustard oil follows a transparent, carefully
          controlled journey — so you always know what you&apos;re serving.
        </motion.p>
      </header>

      <ol className="relative space-y-10 border-l border-border/50 pl-6">
        {steps.map((step, index) => (
          <li key={step.id} className="relative">
            <div className="absolute -left-[0.6rem] top-2 h-3 w-3 rounded-full border-[3px] border-primary bg-background" />
            <motion.div
              className="grid gap-6 rounded-3xl border border-border/60 bg-background/70 p-5 shadow-sm backdrop-blur md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-primary/80">
                  Step {step.id}
                </p>
                <h2 className="mt-2 text-lg font-semibold md:text-xl">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground md:text-base">
                  {step.description}
                </p>
              </div>

              <div className="relative h-40 overflow-hidden rounded-2xl md:h-44">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 260px, 100vw"
                  priority={index === 0}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-background/40 mix-blend-multiply" />
              </div>
            </motion.div>
          </li>
        ))}
      </ol>
    </section>
  )
}
