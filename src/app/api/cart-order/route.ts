// src/app/api/cart-order/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'

interface CartItem {
  id: string
  slug: string
  title: string
  size?: string
  price?: number
  salePrice?: number
  quantity: number
}

interface CustomerInfo {
  name: string
  email: string
  phone?: string
  note?: string
}

interface OrderPayload {
  items: CartItem[]
  customer: CustomerInfo
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

function isPositiveInt(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v) && Number.isInteger(v) && v > 0
}

function isOptionalNumber(v: unknown): v is number | undefined {
  return v === undefined || (typeof v === 'number' && Number.isFinite(v) && v >= 0)
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false
  const o = value as Record<string, unknown>

  return (
    isNonEmptyString(o.id) &&
    isNonEmptyString(o.slug) &&
    isNonEmptyString(o.title) &&
    isPositiveInt(o.quantity) &&
    (o.size === undefined || typeof o.size === 'string') &&
    isOptionalNumber(o.price) &&
    isOptionalNumber(o.salePrice)
  )
}

function isOrderPayload(value: unknown): value is OrderPayload {
  if (typeof value !== 'object' || value === null) return false
  const o = value as Record<string, unknown>

  const items = o.items
  const customer = o.customer

  if (!Array.isArray(items) || items.length === 0) return false
  if (!items.every(isCartItem)) return false

  if (typeof customer !== 'object' || customer === null) return false
  const c = customer as Record<string, unknown>

  if (!isNonEmptyString(c.name) || !isNonEmptyString(c.email)) return false
  if (c.phone !== undefined && typeof c.phone !== 'string') return false
  if (c.note !== undefined && typeof c.note !== 'string') return false

  return true
}

function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatMoney(amount: number): string {
  // Prices stored in Nepali Rupees (NPR)
  return `Rs ${Math.round(amount)}`
}

function getUnitPrice(item: CartItem): number {
  const base = item.price ?? 0
  const sale = item.salePrice
  // Only treat salePrice as valid if < base (your rule). If base missing, allow sale if > 0.
  if (typeof sale === 'number' && sale > 0 && (base === 0 || sale < base)) return sale
  return base
}

const TO_OWNER = 'pristeneo@gmail.com'

// ✅ Now that your domain is verified: always use your verified domain sender
const FROM = 'Pristeneo <no-reply@pristeneo.com>'

export async function POST(req: Request) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  if (!isOrderPayload(json)) {
    return NextResponse.json({ ok: false, error: 'Invalid order payload' }, { status: 400 })
  }

  const items = json.items.map((i) => ({
    ...i,
    title: i.title.trim(),
    slug: i.slug.trim(),
    size: typeof i.size === 'string' ? i.size.trim() : undefined,
  }))

  const customer: CustomerInfo = {
    name: json.customer.name.trim(),
    email: json.customer.email.trim(),
    phone: typeof json.customer.phone === 'string' ? json.customer.phone.trim() : undefined,
    note: typeof json.customer.note === 'string' ? json.customer.note.trim() : undefined,
  }

  const apiKey = process.env.RESEND_API_KEY

  // Dev-friendly: do not fail UI if key missing
  if (!apiKey) {
    console.warn('[cart-order] RESEND_API_KEY missing; returning ok:true. Summary:', {
      customer: { name: customer.name, email: customer.email, phone: customer.phone },
      itemCount: items.length,
    })
    return NextResponse.json({ ok: true })
  }

  const resend = new Resend(apiKey)

  const lineItems = items.map((item) => {
    const unit = getUnitPrice(item)
    const lineTotal = unit * item.quantity
    return { ...item, unit, lineTotal }
  })

  const total = lineItems.reduce((sum, li) => sum + li.lineTotal, 0)

  const adminSubject = `New cart order from ${customer.name}`
  const customerSubject = 'We received your order – Pristeneo'

  const linesText = lineItems.map((li) => {
    const size = li.size ? ` (${li.size})` : ''
    return `• ${li.title}${size} — qty ${li.quantity} — unit ${formatMoney(li.unit)} — approx ${formatMoney(li.lineTotal)}`
  })

  const adminText = [
    `New cart order received.`,
    ``,
    `Customer details:`,
    `Name: ${customer.name}`,
    `Email: ${customer.email}`,
    ...(customer.phone ? [`Phone: ${customer.phone}`] : []),
    ...(customer.note ? [`Note: ${customer.note}`] : []),
    ``,
    `Items:`,
    ...linesText,
    ``,
    `Approximate total: ${formatMoney(total)}`,
    ``,
    `Online payment gateway is not yet active.`,
    `Please contact the customer to confirm final price, shipping, and payment method.`,
  ].join('\n')

  const customerText = [
    `Hi ${customer.name},`,
    ``,
    `Thanks for your order with Pristeneo.`,
    `This email confirms we’ve received your cart details.`,
    ``,
    `Your order summary:`,
    ...linesText,
    ``,
    `Approximate total: ${formatMoney(total)}`,
    ``,
    `What happens next:`,
    `- Our team will review your order.`,
    `- We’ll contact you by email (and phone if provided) to confirm final price, shipping, and payment method.`,
    `- No online payment has been processed yet — this is confirmation only.`,
    ``,
    `If you need to update anything, reply to this email.`,
    ``,
    `Warm regards,`,
    `Pristeneo`,
  ].join('\n')

  const adminHtml = (() => {
    const safeName = escapeHtml(customer.name)
    const safeEmail = escapeHtml(customer.email)
    const safePhone = customer.phone ? escapeHtml(customer.phone) : ''
    const safeNote = customer.note ? escapeHtml(customer.note) : ''

    const rows = lineItems
      .map((li) => {
        const title = escapeHtml(li.title)
        const size = li.size ? ` <span style="color:#666">(${escapeHtml(li.size)})</span>` : ''
        return `
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid #eee;">
              <strong>${title}</strong>${size}<br/>
              <span style="color:#666; font-size:13px;">Qty ${li.quantity} • Unit ${escapeHtml(
                formatMoney(li.unit),
              )}</span>
            </td>
            <td style="padding:10px 0; border-bottom:1px solid #eee; text-align:right;">
              ${escapeHtml(formatMoney(li.lineTotal))}
            </td>
          </tr>
        `.trim()
      })
      .join('')

    return `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height:1.5; color:#111;">
        <h2 style="margin:0 0 12px;">New cart order</h2>

        <div style="margin:0 0 14px; padding:12px; background:#f6f6f6; border-radius:12px;">
          <div><strong>Name:</strong> ${safeName}</div>
          <div><strong>Email:</strong> ${safeEmail}</div>
          ${customer.phone ? `<div><strong>Phone:</strong> ${safePhone}</div>` : ''}
          ${customer.note ? `<div style="margin-top:8px;"><strong>Note:</strong><br/>${safeNote}</div>` : ''}
        </div>

        <table style="width:100%; max-width:680px; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left; padding:8px 0; border-bottom:2px solid #111;">Item</th>
              <th style="text-align:right; padding:8px 0; border-bottom:2px solid #111;">Approx</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr>
              <td style="padding:12px 0; text-align:right;"><strong>Total</strong></td>
              <td style="padding:12px 0; text-align:right;"><strong>${escapeHtml(formatMoney(total))}</strong></td>
            </tr>
          </tbody>
        </table>

        <p style="margin-top:14px; color:#666; font-size:13px;">
          Online payment gateway is not yet active. Follow up with the customer to confirm final price, shipping, and payment method.
        </p>
      </div>
    `.trim()
  })()

  const customerHtml = (() => {
    const safeName = escapeHtml(customer.name)

    const rows = lineItems
      .map((li) => {
        const title = escapeHtml(li.title)
        const size = li.size ? ` <span style="color:#666">(${escapeHtml(li.size)})</span>` : ''
        return `
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid #eee;">
              <strong>${title}</strong>${size}<br/>
              <span style="color:#666; font-size:13px;">Qty ${li.quantity} • Unit ${escapeHtml(
                formatMoney(li.unit),
              )}</span>
            </td>
            <td style="padding:10px 0; border-bottom:1px solid #eee; text-align:right;">
              ${escapeHtml(formatMoney(li.lineTotal))}
            </td>
          </tr>
        `.trim()
      })
      .join('')

    return `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height:1.5; color:#111;">
        <h2 style="margin:0 0 12px;">We received your order</h2>
        <p style="margin:0 0 14px;">Hi ${safeName},</p>
        <p style="margin:0 0 14px;">
          Thanks for your order with Pristeneo. This email confirms we’ve received your cart details.
        </p>

        <table style="width:100%; max-width:680px; border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left; padding:8px 0; border-bottom:2px solid #111;">Item</th>
              <th style="text-align:right; padding:8px 0; border-bottom:2px solid #111;">Approx</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr>
              <td style="padding:12px 0; text-align:right;"><strong>Total</strong></td>
              <td style="padding:12px 0; text-align:right;"><strong>${escapeHtml(formatMoney(total))}</strong></td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top:14px; padding:12px; background:#fff7d6; border-radius:12px;">
          <strong>What happens next</strong>
          <ul style="margin:8px 0 0; padding-left:18px;">
            <li>We’ll review your order.</li>
            <li>We’ll contact you to confirm final price, shipping, and payment method.</li>
            <li>No online payment has been processed yet — this is confirmation only.</li>
          </ul>
        </div>

        <p style="margin-top:14px;">
          If you need to update anything, just reply to this email.
        </p>

        <p style="margin-top:14px; color:#666; font-size:13px;">
          Pristeneo • Mustard Oil
        </p>
      </div>
    `.trim()
  })()

  try {
    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: TO_OWNER,
        replyTo: customer.email,
        subject: adminSubject,
        text: adminText,
        html: adminHtml,
      }),
      resend.emails.send({
        from: FROM,
        to: customer.email,
        replyTo: TO_OWNER,
        subject: customerSubject,
        text: customerText,
        html: customerHtml,
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Email failed'
    console.error('[cart-order] resend failed', msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
