import { sanityClient } from '@/lib/sanity.client'
import { pageBySlugQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import ContactForm from '@/components/ContactForm'

export const revalidate = 60

export default async function ContactPage() {
  const data = await sanityClient.fetch(pageBySlugQuery, { slug: 'contact' })
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold">{data?.title || 'Contact'}</h1>
      <div className="prose mt-4"><PortableText value={data?.content} /></div>
      <ContactForm />
    </section>
  )
}
// Later, to actually email submissions, add Resend:

// npm i resend

// set RESEND_API_KEY in .env.local

// call Resend’s API inside the /api/contact route.