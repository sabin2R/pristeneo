// src/app/(site)/process/page.tsx
import type { Metadata } from 'next'
import ProcessContent from './ProcessContent'

export const metadata: Metadata = {
  title: 'Our Cold-Pressed Process | Pristeneo Mustard Oil',
  description:
    'From traceable seeds to lab-tested, cold-pressed mustard oil. Discover the Pristeneo process.',
}

export default function ProcessPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 lg:px-6">
      <ProcessContent />
    </main>
  )
}
