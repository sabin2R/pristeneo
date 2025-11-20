// src/app/api/contact/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs' // ensure Node runtime (not edge) on Vercel

type ContactPayload = {
  name: string
  email: string
  message: string
  phone?: string
}

function isContactPayload(x: unknown): x is ContactPayload {
  if (typeof x !== 'object' || x === null) return false
  const o = x as Record<string, unknown>
  return (
    typeof o.name === 'string' &&
    typeof o.email === 'string' &&
    typeof o.message ===  `string` &&
    (o.phone === undefined || typeof o.phone === 'string')
  )
}

const TO = 'pristeneo@gmail.com'

export async function POST(req: Request) {
    let body: unknown
    try { body = await req.json() } catch { 
      return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
    }
    if (!isContactPayload(body)) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }
  
    const { name, email, message, phone } = body
    const apiKey = process.env.RESEND_API_KEY
  
    // No key yet? Don’t fail the user—log and succeed.
    if (!apiKey) {
      console.log('[CONTACT]', { name, email, message })
      return NextResponse.json({ ok: true })
    }
  
    const resend = new Resend(apiKey)
    const from =
      process.env.NODE_ENV === 'production'
        ? 'Pristeneo <no-reply@pristeneo.com>' // use a verified sender domain in Resend
        : 'onboarding@resend.dev'               // dev-safe fallback
  
    try {
      await resend.emails.send({
        from,
        to: TO,
        replyTo: email,
        subject: `New contact from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `
          <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
            <h2>New Website Contact</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
             ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p style="white-space:pre-line">${message}</p>
          </div>
        `.trim(),
      })
      return NextResponse.json({ ok: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Email failed'
      return NextResponse.json({ ok: false, error: msg }, { status: 500 })
    }
  }