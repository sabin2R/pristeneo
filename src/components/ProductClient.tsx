'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { urlFor } from '@/lib/sanity.image'
import type { Product } from '@/types/product'
import ProductCard from './ProductCard'

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

const CART_KEY = 'pristeneo_cart'

interface CartItem {
  id: string
  slug: string
  title: string
  size?: string
  price?: number
  salePrice?: number
  quantity: number
}

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CartItem).id === 'string' &&
        typeof (item as CartItem).slug === 'string' &&
        typeof (item as CartItem).title === 'string' &&
        typeof (item as CartItem).quantity === 'number',
    )
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export default function ProductClient({
  product,
  similarProducts = [],
}: {
  product: Product
  similarProducts?: Product[]
}) {
  const router = useRouter()

  const basePrice = product.price
  const salePrice = product.salePrice
  const formattedBase = formatPrice(basePrice)
  const formattedSale = formatPrice(salePrice)
  const discountPercent = getDiscountPercent(basePrice, salePrice)
  const hasDiscount = !!discountPercent && !!formattedSale

  // Treat undefined as in stock (backwards compatible)
  const inStock = product.inStock !== false

  const handleAddToCart = () => {
    const items = loadCart()
    const existingIndex = items.findIndex(item => item.id === product._id)

    const item: CartItem = {
      id: product._id,
      slug: product.slug,
      title: product.title,
      size: product.size,
      price: product.price,
      salePrice: product.salePrice,
      quantity: 1,
    }

    if (existingIndex >= 0) {
      items[existingIndex].quantity += 1
    } else {
      items.push(item)
    }

    saveCart(items)
    router.push('/cart')
  }

  const contactSubject = inStock
    ? `Inquiry: ${product.title}`
    : `Out of stock inquiry: ${product.title}`

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--background)] text-[var(--color-ink)]">
      <div className="container mx-auto px-4 py-8 md:py-20">
        {/* Breadcrumb / Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-ink)/0.6] transition-colors hover:text-[var(--color-mustard)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Collection
          </Link>
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-24">
          {/* LEFT: Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--color-ink)/0.05] bg-[var(--color-bone)] shadow-[var(--shadow-soft)]"
          >
            {product.image ? (
              <Image
                src={urlFor(product.image).width(1200).height(1200).url()}
                alt={product.title}
                fill
                className="object-contain p-8 transition-transform duration-700 ease-in-out hover:scale-105 md:p-16"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[color:var(--color-ink)/0.3] italic">
                Image coming soon
              </div>
            )}

            {/* Organic badge */}
            <div className="absolute left-6 top-6 rounded-full bg-[var(--color-leaf)] px-3 py-1.5 text-xs font-bold tracking-wide text-[var(--color-bone)] shadow-sm">
              100% ORGANIC
            </div>

            {/* Discount badge */}
            {hasDiscount && inStock && (
              <div className="absolute right-6 top-6 rounded-full bg-[var(--color-mustard)] px-3 py-1.5 text-xs font-bold tracking-wide text-[var(--color-ink)] shadow-sm">
                Save {discountPercent}%
              </div>
            )}

            {!inStock && (
              <div className="absolute right-6 top-6 rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-bold tracking-wide text-white shadow-sm">
                Out of stock
              </div>
            )}
          </motion.div>

          {/* RIGHT: Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex h-full flex-col justify-center pt-4"
          >
            <span className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--color-mustard-dark)]">
              Premium Selection
            </span>

            <h1 className="mb-4 text-4xl font-bold leading-[1.1] text-[var(--color-ink)] md:text-5xl lg:text-6xl">
              {product.title}
            </h1>

            {/* Price block */}
            {(formattedBase || formattedSale) && (
              <div className="mb-6 flex flex-wrap items-center gap-3">
                {hasDiscount ? (
                  <>
                    <span
                      className={`text-3xl font-bold md:text-4xl ${
                        inStock
                          ? 'text-[var(--color-leaf)]'
                          : 'text-[color:var(--color-ink)/0.7]'
                      }`}
                    >
                      {formattedSale}
                    </span>
                    <span className="text-sm text-[color:var(--color-ink)/0.5] line-through md:text-base">
                      {formattedBase}
                    </span>
                    {inStock && (
                      <span className="rounded-full bg-[var(--color-mustard)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]">
                        Limited-time offer
                      </span>
                    )}
                  </>
                ) : (
                  <span
                    className={`text-3xl font-bold md:text-4xl ${
                      inStock
                        ? 'text-[var(--color-leaf)]'
                        : 'text-[color:var(--color-ink)/0.7]'
                    }`}
                  >
                    {formattedBase}
                  </span>
                )}
              </div>
            )}

            {/* Size + stock status */}
            <div className="mb-8 flex items-center gap-4 border-b border-[color:var(--color-ink)/0.1] pb-8">
              {product.size && (
                <span className="inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[color:var(--color-ink)/0.05] px-4 py-1.5 text-sm font-medium text-[var(--color-ink)]">
                  {product.size}
                </span>
              )}

              {inStock ? (
                <span className="flex items-center gap-1 text-sm font-medium text-[var(--color-leaf)]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-leaf)]" />
                  In Stock &amp; Ready to Ship
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm font-medium text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Currently out of stock – new batch coming soon
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-lg mb-10 max-w-none text-[color:var(--color-ink)/0.7]">
                <p className="leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Benefits Grid */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="mb-12">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[color:var(--color-ink)/0.4]">
                  Highlights
                </h3>
                <ul className="grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="group flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-mustard)] transition-transform group-hover:scale-150" />
                      <span className="font-medium text-[color:var(--color-ink)/0.9]">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="mt-auto flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex h-14 flex-1 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink)] text-lg font-bold text-[var(--color-bone)] transition-all duration-300 hover:bg-[var(--color-leaf)] hover:shadow-[var(--shadow-strong)] active:scale-[0.98]"
              >
                Add to Cart
              </button>
              <Link
                href={`/contact?subject=${encodeURIComponent(contactSubject)}`}
                className="flex h-14 items-center justify-center rounded-[var(--radius-md)] border border-[color:var(--color-ink)/0.2] px-8 font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)] hover:bg-[var(--color-bone)]"
              >
                Contact Us
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-[color:var(--color-ink)/0.4] sm:text-left">
              Online payment gateway will be available soon. For now, add items
              to cart and submit your order – we&apos;ll email you to confirm
              payment and delivery.
            </p>
          </motion.div>
        </div>

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <section className="mt-16 border-t border-[color:var(--color-ink)/0.06] pt-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-[var(--color-ink)] md:text-2xl">
                You may also like
              </h2>
              <Link
                href="/products"
                className="text-sm font-medium text-mustard hover:brightness-110"
              >
                View all products
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarProducts.map(item => (
                <ProductCard key={item._id} p={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
