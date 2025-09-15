import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity.client'
import { pageSlugsQuery, pageBySlugQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs: string[] = await sanityClient.fetch(pageSlugsQuery)
  // Avoid clashing with existing routes like "products"
  return slugs
    .filter((s) => !['products', 'studio', 'api'].includes(s))
    .map((slug) => ({ page: slug }))
}

export default async function CMSPage({ params }: { params: { page: string } }) {
  const data = await sanityClient.fetch(pageBySlugQuery, { slug: params.page })
  if (!data) return notFound()

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <h1 className="text-4xl font-bold">{data.title}</h1>
      <div className="mt-6">
        <PortableText value={data.content} />
      </div>
    </section>
  )
}
