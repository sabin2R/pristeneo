// src/app/(site)/benefits/page.tsx
import type { Metadata } from 'next'
import BenefitsContent from './BenefitsContent'

export const metadata: Metadata = {
  title: 'Benefits of Pristeneo Mustard Oil',
  description:
    'Discover the everyday cooking and wellness benefits of cold-pressed, lab-tested Pristeneo mustard oil.',
}

export default function BenefitsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 lg:px-6">
      <BenefitsContent />
    </main>
  )
}
