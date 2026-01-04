import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity.image'
import { Product } from '@/types/product'

function formatPrice(value?: number | null) {
  if (typeof value !== 'number') return null
  return `Rs ${value.toFixed(0)}`
}

function getDiscountPercent(price?: number, salePrice?: number) {
  if (
    typeof price !== 'number' ||
    typeof salePrice !== 'number' ||
    salePrice >= price
  ) {
    return null
  }
  return Math.round(((price - salePrice) / price) * 100)
}

export default function ProductCard({ p }: { p: Product }) {
  const href = `/products/${p.slug}`

  const basePrice = p.price
  const salePrice = p.salePrice
  const formattedBase = formatPrice(basePrice)
  const formattedSale = formatPrice(salePrice)
  const discountPercent = getDiscountPercent(basePrice, salePrice)
  const hasDiscount = !!discountPercent && !!formattedSale

  // Treat undefined as in stock (backwards compatible)
  const inStock = p.inStock !== false

  return (
    <Link
      href={href}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border bg-white/70 backdrop-blur transition hover:-translate-y-1 hover:shadow-[var(--shadow-strong)] ${
        inStock ? '' : 'opacity-80'
      }`}
    >
      <div className="relative aspect-square">
        {p.image && (
          <Image
            src={urlFor(p.image).width(800).height(800).url()}
            alt={p.title}
            fill
            className="object-contain p-6"
          />
        )}

        {hasDiscount && inStock && (
          <div className="absolute left-4 top-4 rounded-full bg-[var(--color-mustard)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)] shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {!inStock && (
          <div className="absolute left-4 top-4 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Out of stock
          </div>
        )}
      </div>

      <div className="px-5 pb-5">
        <h3 className="font-semibold">{p.title}</h3>
        {p.size && <p className="text-sm opacity-70">{p.size}</p>}

        {(formattedBase || formattedSale) && (
          <div className="mt-2 flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span
                  className={`text-base font-semibold ${
                    inStock ? 'text-[var(--color-leaf)]' : 'text-[color:var(--color-ink)/0.6]'
                  }`}
                >
                  {formattedSale}
                </span>
                <span className="text-xs text-[color:var(--color-ink)/0.5] line-through">
                  {formattedBase}
                </span>
              </>
            ) : (
              <span
                className={`text-base font-semibold ${
                  inStock ? 'text-[var(--color-leaf)]' : 'text-[color:var(--color-ink)/0.6]'
                }`}
              >
                {formattedBase}
              </span>
            )}
          </div>
        )}

        {!formattedBase && !formattedSale && (
          <p className="mt-2 text-xs text-[color:var(--color-ink)/0.6]">
            View details
          </p>
        )}

        {!inStock && (
          <p className="mt-2 text-xs font-medium text-red-600">
            Currently unavailable — tap for details
          </p>
        )}
      </div>

      {/* subtle shine */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(120deg, transparent, rgba(255,255,255,.25), transparent)',
          transform: 'translateX(-100%)',
        }}
      />
    </Link>
  )
}
