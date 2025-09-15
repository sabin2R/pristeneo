// src/app/products/page.tsx
import { sanityClient } from '@/lib/sanity.client'
import { productsQuery } from '@/lib/queries'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/types/product'

export const revalidate = 60

export default async function ProductsPage() {
  // 👇 explicitly type the fetch result
  const products: Product[] = await sanityClient.fetch(productsQuery)

  return (
    <section className="section">
      <div className="container">
        <h1 className="text-4xl font-bold">Products</h1>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
