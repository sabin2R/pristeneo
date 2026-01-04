// src/app/(site)/products/page.tsx
import type { Metadata } from 'next'
import { sanityClient } from '@/lib/sanity.client'
import { productsQuery } from '@/lib/queries'
import type { Product } from '@/types/product'
import ProductsGridClient from '@/components/ProductsGridClient'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Pristeneo Mustard Oil Products',
  description:
    'Explore Pristeneo cold-pressed mustard oil sizes for home kitchens, restaurants, and wholesale.',
}

export default async function ProductsPage() {
  const products = await sanityClient.fetch<Product[]>(productsQuery)

  return <ProductsGridClient products={products} />
}
