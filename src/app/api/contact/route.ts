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

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

function isContactPayload(x: unknown): x is ContactPayload {
  if (typeof x !== 'object' || x === null) return false
  const o = x as Record<string, unknown>

  return (
    isNonEmptyString(o.name) &&
    isNonEmptyString(o.email) &&
    isNonEmptyString(o.message) &&
    (o.phone === undefined || typeof o.phone === 'string')
  )
}

function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

const TO = 'pristeneo@gmail.com'

// ✅ Domain verified: always use your verified sender
const FROM = 'Pristeneo <no-reply@pristeneo.com>'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  if (!isContactPayload(body)) {
    return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
  }

  const name = body.name.trim()
  const email = body.email.trim()
  const message = body.message.trim()
  const phone = typeof body.phone === 'string' ? body.phone.trim() : undefined

  const apiKey = process.env.RESEND_API_KEY

  // Dev-friendly: don’t fail UI if key missing
  if (!apiKey) {
    console.warn('[contact] RESEND_API_KEY missing; logging payload and returning ok:true', {
      name,
      email,
      phone,
      message,
    })
    return NextResponse.json({ ok: true })
  }

  const resend = new Resend(apiKey)

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safePhone = phone ? escapeHtml(phone) : ''
  const safeMessage = escapeHtml(message)

  const subject = `New contact from ${name}`

  const text = [
    `New Website Contact`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    ...(phone ? [`Phone: ${phone}`] : []),
    ``,
    `Message:`,
    message,
  ].join('\n')

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height:1.5; color:#111;">
      <h2 style="margin:0 0 12px;">New Website Contact</h2>

      <table style="border-collapse:collapse; width:100%; max-width:640px;">
        <tr>
          <td style="padding:6px 0; width:110px;"><strong>Name</strong></td>
          <td style="padding:6px 0;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Email</strong></td>
          <td style="padding:6px 0;">${safeEmail}</td>
        </tr>
        ${
          phone
            ? `<tr>
                 <td style="padding:6px 0;"><strong>Phone</strong></td>
                 <td style="padding:6px 0;">${safePhone}</td>
               </tr>`
            : ''
        }
      </table>

      <div style="margin-top:16px;">
        <strong>Message</strong>
        <div style="margin-top:8px; padding:12px; background:#f6f6f6; border-radius:12px; white-space:pre-wrap;">
          ${safeMessage}
        </div>
      </div>

      <p style="margin-top:16px; color:#666; font-size:13px;">
        Reply to this email to respond directly to ${safeName} (Reply-To is set).
      </p>
    </div>
  `.trim()

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject,
      text,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Email failed'
    console.error('[contact] resend failed', msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
