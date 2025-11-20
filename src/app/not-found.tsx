// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container text-center">
        <h1 className="text-5xl font-bold">404</h1>
        <p className="mt-2 opacity-80">We couldn’t find that page.</p>

        <Link
          href="/"
          className="mt-6 inline-block rounded bg-mustard text-ink px-4 py-2 font-medium"
        >
          Go Home
        </Link>
      </div>
    </section>
  )
}
