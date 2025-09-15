'use client'
import { motion } from 'framer-motion'

const items = [
  { title: 'Cold-Pressed', body: 'Low-temperature extraction to retain natural pungency & nutrients.' },
  { title: 'Lab Tested', body: 'Every batch tested for purity, peroxide value & moisture.' },
  { title: 'Traceable Seeds', body: 'Sourced from trusted farms with documented origin.' },
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
              viewport={{ once: true, amount: .3 }}
              transition={{ delay: i * 0.05 }}
              className="card p-6 hover:shadow-[var(--shadow-strong)] transition-shadow"
            >
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 opacity-80">{f.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
