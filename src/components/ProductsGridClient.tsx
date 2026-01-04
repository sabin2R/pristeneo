'use client'

import { useMemo, useState } from 'react'
import type { Product } from '@/types/product'
import ProductCard from './ProductCard'

type SortOption = 'default' | 'price-asc' | 'price-desc'

function getEffectivePrice(p: Product): number | null {
  if (typeof p.salePrice === 'number' && p.salePrice > 0) return p.salePrice
  if (typeof p.price === 'number' && p.price > 0) return p.price
  return null
}

interface ProductsGridClientProps {
  products: Product[]
}

export default function ProductsGridClient({ products }: ProductsGridClientProps) {
  const [search, setSearch] = useState('')
  const [sizeFilter, setSizeFilter] = useState<string>('all')
  const [sort, setSort] = useState<SortOption>('default')

  // Unique sizes for filter dropdown
  const sizes = useMemo(() => {
    const set = new Set<string>()
    for (const p of products) {
      if (p.size) set.add(p.size)
    }
    return Array.from(set)
  }, [products])

  const filtered = useMemo(() => {
    let result = [...products]

    // Search by title / description
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p => {
        const title = p.title?.toLowerCase() ?? ''
        const desc = p.description?.toLowerCase() ?? ''
        return title.includes(q) || desc.includes(q)
      })
    }

    // Filter by size
    if (sizeFilter !== 'all') {
      result = result.filter(p => p.size === sizeFilter)
    }

    // Sort by price
    if (sort !== 'default') {
      result.sort((a, b) => {
        const pa = getEffectivePrice(a)
        const pb = getEffectivePrice(b)
        if (pa === null && pb === null) return 0
        if (pa === null) return 1
        if (pb === null) return -1
        if (sort === 'price-asc') return pa - pb
        if (sort === 'price-desc') return pb - pa
        return 0
      })
    }

    return result
  }, [products, search, sizeFilter, sort])

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 lg:px-6">
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Our Mustard Oil Range
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-ink)/0.7] md:text-base">
            Search by size or name, and quickly find the right bottle for your kitchen or store.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-ink)/0.2] bg-white/70 px-3 py-2 text-sm outline-none transition focus:border-[var(--color-mustard-dark)] focus:ring-1 focus:ring-[var(--color-mustard-dark)]"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[color:var(--color-ink)/0.4]">
              ⌘K
            </span>
          </div>

          {/* Size filter */}
          <select
            value={sizeFilter}
            onChange={e => setSizeFilter(e.target.value)}
            className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-ink)/0.2] bg-white/70 px-3 py-2 text-sm md:w-40"
          >
            <option value="all">All sizes</option>
            {sizes.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-ink)/0.2] bg-white/70 px-3 py-2 text-sm md:w-44"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Results info */}
      <p className="mb-4 text-xs text-[color:var(--color-ink)/0.5]">
        Showing {filtered.length} of {products.length} products
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(p => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[var(--radius-md)] border border-dashed border-[color:var(--color-ink)/0.2] bg-white/60 px-4 py-10 text-center text-sm text-[color:var(--color-ink)/0.7]">
          No products match your search. Try clearing filters or using a different keyword.
        </div>
      )}
    </section>
  )
}
