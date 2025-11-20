import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity.client'
import { singleProductQuery, productSlugsQuery } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'
import type { Product } from '@/types/product'
import JsonLd from '@/components/JsonLd'
import ProductClient from '../../../components/ProductClient' // Adjusted the relative path

export const revalidate = 60

type PageProps = { 
  params: Promise<{ slug: string }> // Updated for Next 15
}

export async function generateStaticParams() {
  const slugs: string[] = await sanityClient.fetch(productSlugsQuery)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params
  const data: Product | null = await sanityClient.fetch(singleProductQuery, { slug })
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const canonical = `${site}/products/${slug}`

  if (!data) {
    return {
      title: 'Product Not Found',
      alternates: { canonical },
    }
  }

  const description = data.description || `${data.title} by Pristeneo — pure, cold-pressed oil.`
  const ogImage = data.image
    ? urlFor(data.image).width(1200).height(630).url()
    : undefined

  return {
    title: `${data.title} | Pristeneo`,
    description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: data.title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: data.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const data: Product | null = await sanityClient.fetch(singleProductQuery, { slug })
  
  if (!data) return notFound()

  // JSON-LD Logic
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const ogImage = data.image ? urlFor(data.image).width(1200).height(630).url() : undefined
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title,
    description: data.description,
    image: ogImage ? [ogImage] : undefined,
    brand: { '@type': 'Brand', name: 'Pristeneo' },
    sku: data.slug,
    url: `${site}/products/${slug}`,
  }

  return (
    <>
      <JsonLd data={productJsonLd} />
      {/* Pass data to the Client Component for the rich UI */}
      <ProductClient product={data} />
    </>
  )
}