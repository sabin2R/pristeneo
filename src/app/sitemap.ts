import type { MetadataRoute } from 'next'
import { sanityClient } from '@/lib/sanity.client'
import { groq } from 'next-sanity'

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productSlugs: string[] = await sanityClient.fetch(
    groq`*[_type=="product" && defined(slug.current)][].slug.current`
  )
  const pageSlugs: string[] = await sanityClient.fetch(
    groq`*[_type=="page" && defined(slug.current)][].slug.current`
  )

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site}/`, lastModified: new Date() },
    { url: `${site}/products`, lastModified: new Date() },
  ]

  const productUrls = productSlugs.map((s) => ({ url: `${site}/products/${s}`, lastModified: new Date() }))
  const cmsUrls = pageSlugs
    .filter((s) => !['products', 'studio', 'api'].includes(s))
    .map((s) => ({ url: `${site}/${s}`, lastModified: new Date() }))

  return [...staticPages, ...productUrls, ...cmsUrls]
}
