'use client'
import { useState } from 'react'

export default function ContactForm() {
  const [state, setState] = useState<'idle'|'loading'|'sent'|'error'>('idle')
  const [error, setError] = useState<string>('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading'); setError('')
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) { setState('sent'); form.reset() }
    else { setState('error'); setError((await res.json()).error || 'Something went wrong') }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4 max-w-xl">
      <input name="name" placeholder="Name" required className="border rounded px-3 py-2" />
      <input name="email" type="email" placeholder="Email" required className="border rounded px-3 py-2" />
      <textarea name="message" placeholder="Message" rows={5} required className="border rounded px-3 py-2" />
      <button disabled={state==='loading'} className="bg-mustard text-ink font-medium px-4 py-2 rounded">
        {state==='loading' ? 'Sending…' : 'Send'}
      </button>
      {state==='sent' && <p className="text-green-700">Thanks! We’ll get back to you.</p>}
      {state==='error' && <p className="text-red-700">{error}</p>}
    </form>
  )
}
