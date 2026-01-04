// src/app/api/cart-order/route.ts
import { NextRequest, NextResponse } from 'next/server'
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

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false
  const item = value as CartItem
  return (
    typeof item.id === 'string' &&
    typeof item.slug === 'string' &&
    typeof item.title === 'string' &&
    typeof item.quantity === 'number'
  )
}

function isOrderPayload(value: unknown): value is OrderPayload {
  if (typeof value !== 'object' || value === null) return false
  const data = value as OrderPayload

  if (!Array.isArray(data.items) || data.items.length === 0) return false
  if (!data.items.every(isCartItem)) return false

  const customer = data.customer
  if (!customer || typeof customer !== 'object') return false

  if (
    typeof customer.name !== 'string' ||
    !customer.name.trim() ||
    typeof customer.email !== 'string' ||
    !customer.email.trim()
  ) {
    return false
  }

  return true
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()

    if (!isOrderPayload(json)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid order payload' },
        { status: 400 },
      )
    }

    const { items, customer } = json
    const apiKey = process.env.RESEND_API_KEY

    // Dev-friendly: if no key, log and pretend it's fine
    if (!apiKey) {
      console.warn(
        '[cart-order] RESEND_API_KEY missing. Order emails not sent. Payload:',
        json,
      )
      return NextResponse.json({ ok: true })
    }

    const resend = new Resend(apiKey)
    const from =
      process.env.NODE_ENV === 'production'
        ? 'no-reply@pristeneo.com'
        : 'onboarding@resend.dev'

    // Build lines + total
    const lines = items.map(item => {
      const price = item.salePrice ?? item.price ?? 0
      const lineTotal = price * item.quantity
      return `• ${item.title}${
        item.size ? ` (${item.size})` : ''
      } — qty ${item.quantity} — approx Rs ${lineTotal.toFixed(0)}`
    })

    const total = items.reduce((sum, item) => {
      const price = item.salePrice ?? item.price ?? 0
      return sum + price * item.quantity
    }, 0)

    // ----- Email to YOU (store owner) -----
    const adminSubject = `New cart order from ${customer.name}`
    const adminText = [
      `You received a new cart order from ${customer.name}.`,
      '',
      'Customer details:',
      `Name: ${customer.name}`,
      `Email: ${customer.email}`,
      customer.phone ? `Phone: ${customer.phone}` : null,
      customer.note ? `Note: ${customer.note}` : null,
      '',
      'Items:',
      ...lines,
      '',
      `Approximate total: Rs ${total.toFixed(0)}`,
      '',
      'Online payment gateway is not yet active.',
      'Please contact the customer to confirm final price, payment method, and delivery details.',
    ]
      .filter(Boolean)
      .join('\n')

    // ----- Email to CUSTOMER (confirmation) -----
    const customerSubject = 'We received your order – Pristeneo'
    const customerText = [
      `Hi ${customer.name},`,
      '',
      'Thank you for your order with Pristeneo.',
      'This email confirms that we have received your cart details.',
      '',
      'Your order summary:',
      ...lines,
      '',
      `Approximate total: Rs ${total.toFixed(0)}`,
      '',
      'What happens next:',
      '- Our team will review your order.',
      '- We will contact you by email (and phone if provided) to confirm final price, shipping, and payment method.',
      '- No online payment has been processed yet – this is just a confirmation of your request.',
      '',
      'If you need to update anything, you can reply directly to this email.',
      '',
      'Warm regards,',
      'Pristeneo Mustard Oil',
    ].join('\n')

    // Send both emails in parallel
    await Promise.all([
      resend.emails.send({
        from,
        to: 'pristeneo@gmail.com',
        replyTo: customer.email,
        subject: adminSubject,
        text: adminText,
      }),
      resend.emails.send({
        from,
        to: customer.email,
        subject: customerSubject,
        text: customerText,
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[cart-order] Error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 },
    )
  }
}
