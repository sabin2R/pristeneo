import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { name, email, message } = body || {}
  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
  }

  // TODO: plug into email (Resend/Nodemailer). For now, just log:
  console.log('[CONTACT]', { name, email, message })

  return NextResponse.json({ ok: true })
}
