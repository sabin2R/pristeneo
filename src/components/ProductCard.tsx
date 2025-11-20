import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity.image'
import { Product } from '@/types/product'

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="group relative overflow-hidden rounded-[var(--radius-lg)] border bg-white/70 backdrop-blur transition hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]">
      <div className="relative aspect-square">
        {p.image && (
          <Image src={urlFor(p.image).width(800).height(800).url()} alt={p.title} fill className="object-contain p-6" />
        )}
      </div>
      <div className="px-5 pb-5">
        <h3 className="font-semibold">{p.title}</h3>
        {p.size && <p className="text-sm opacity-70">{p.size}</p>}
        <Link href={`/products/${p.slug}`} className="mt-3 inline-block text-mustard hover:brightness-110">View</Link>
      </div>

      {/* subtle shine */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition"
           style={{ background: 'linear-gradient(120deg, transparent, rgba(255,255,255,.25), transparent)', transform: 'translateX(-100%)' }} />
    </article>
  )
}
