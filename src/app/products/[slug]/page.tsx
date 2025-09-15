import Image from 'next/image'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity.client'
import { singleProductQuery, productSlugsQuery } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'
import type { Product } from '@/types/product'

export const revalidate = 60

type PageProps = { params: { slug: string } }

// (optional but nice) prebuild known slugs
export async function generateStaticParams() {
  const slugs: string[] = await sanityClient.fetch(productSlugsQuery)
  return slugs.map((slug) => ({ slug }))
}

export default async function ProductPage({ params }: PageProps) {
  const data: Product | null = await sanityClient.fetch(singleProductQuery, { slug: params.slug })

  if (!data) return notFound()

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-2 gap-10">
      <div>
        {data.image && (
          <Image
            src={urlFor(data.image).width(1000).height(1000).url()}
            alt={data.title}
            width={1000}
            height={1000}
            className="w-full h-auto object-contain"
          />
        )}
      </div>
      <div>
        <h1 className="text-4xl font-bold">{data.title}</h1>
        {data.size && <p className="mt-2 opacity-70">{data.size}</p>}
        {data.description && <p className="mt-6">{data.description}</p>}
        {data.benefits?.length ? (
          <ul className="mt-6 list-disc pl-5 space-y-1">
            {data.benefits.map((b) => <li key={b}>{b}</li>)}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
