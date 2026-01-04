'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const CART_KEY = 'pristeneo_cart'

interface CartItem {
  id: string
  slug: string
  title: string
  size?: string
  price?: number
  salePrice?: number
  quantity: number
}

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CartItem).id === 'string' &&
        typeof (item as CartItem).slug === 'string' &&
        typeof (item as CartItem).title === 'string' &&
        typeof (item as CartItem).quantity === 'number',
    )
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CART_KEY, JSON.stringify(items))
}

function clearCart() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(CART_KEY)
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    note: '',
  })

  useEffect(() => {
    setItems(loadCart())
  }, [])

  const total = items.reduce((sum, item) => {
    const price = item.salePrice ?? item.price ?? 0
    return sum + price * item.quantity
  }, 0)

  const handleQuantityChange = (id: string, quantity: number) => {
    setItems(prev => {
      const next = prev
        .map(item =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
        )
        .filter(item => item.quantity > 0)
      saveCart(next)
      return next
    })
  }

  const handleRemove = (id: string) => {
    setItems(prev => {
      const next = prev.filter(item => item.id !== id)
      saveCart(next)
      return next
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!items.length) {
      setError('Your cart is empty.')
      return
    }
    if (!form.name || !form.email) {
      setError('Please enter your name and email.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/cart-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: form,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error || 'Failed to submit order')
      }

      setSubmitted(true)
      clearCart()
      setItems([])
      // don’t wipe form completely so success message can still show email/name
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const hasItems = items.length > 0

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        {/* Outer card / shell */}
        <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-ink)/0.06] bg-white/75 shadow-[var(--shadow-soft)] backdrop-blur-md px-4 py-6 md:px-8 md:py-8">
          {/* Header + mini steps */}
          <div className="flex flex-col gap-4 border-b border-[color:var(--color-ink)/0.06] pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Your Cart
              </h1>
              <p className="mt-2 max-w-xl text-sm text-[color:var(--color-ink)/0.7]">
                Review your selection and share your details. Online payment
                gateway will be available soon – for now, we&apos;ll confirm
                payment and delivery with you by email.
              </p>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2 text-xs font-medium text-[color:var(--color-ink)/0.6]">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-mustard)] text-[var(--color-ink)]">
                  1
                </span>
                <span>Cart</span>
              </div>
              <span className="mx-1 h-px w-5 bg-[color:var(--color-ink)/0.2]" />
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--color-ink)/0.06]">
                  2
                </span>
                <span>Details</span>
              </div>
              <span className="mx-1 h-px w-5 bg-[color:var(--color-ink)/0.15]" />
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--color-ink)/0.06]">
                  3
                </span>
                <span>Confirmation</span>
              </div>
            </div>
          </div>

          {/* Main content grid */}
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.7fr,1.3fr]">
            {/* Left: items / empty / success */}
            <div className="space-y-4">
              {!hasItems && !submitted && (
                <div className="rounded-[var(--radius-md)] border border-dashed border-[color:var(--color-ink)/0.2] bg-[var(--color-bone)]/80 px-4 py-10 text-center text-sm text-[color:var(--color-ink)/0.7]">
                  <p className="font-medium">Your cart is empty.</p>
                  <p className="mt-2">
                    Browse our{' '}
                    <Link
                      href="/products"
                      className="font-semibold text-mustard hover:brightness-110"
                    >
                      products
                    </Link>{' '}
                    to start your Pristeneo selection.
                  </p>
                </div>
              )}

              {submitted && (
                <div className="rounded-[var(--radius-md)] border border-[color:var(--color-leaf)/0.4] bg-emerald-50/80 px-4 py-6 text-sm text-[color:var(--color-ink)/0.8]">
                  <p className="text-sm font-semibold">
                    Order received – thank you.
                  </p>
                  <p className="mt-2 text-xs md:text-sm">
  We&apos;ve recorded your order and sent a confirmation email to{' '}
  <span className="font-medium">
    {form.email || 'your email'}
  </span>
  . We&apos;ll follow up shortly to confirm final price, payment method, and delivery timing.
</p>
                </div>
              )}

              {hasItems && (
                <div className="space-y-3">
                  {items.map(item => {
                    const price = item.salePrice ?? item.price ?? 0
                    const lineTotal = price * item.quantity
                    const unitLabel =
                      price > 0
                        ? `Rs ${price.toFixed(0)} each`
                        : 'Price on enquiry'

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[color:var(--color-ink)/0.08] bg-white/90 px-4 py-3"
                      >
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/products/${item.slug}`}
                            className="block truncate text-sm font-semibold hover:underline"
                          >
                            {item.title}
                          </Link>
                          {item.size && (
                            <p className="text-xs text-[color:var(--color-ink)/0.6]">
                              {item.size}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-[color:var(--color-ink)/0.6]">
                            {unitLabel}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 text-right">
                          {/* Qty controls */}
                          <div className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-[color:var(--color-ink)/0.2] bg-[var(--color-bone)]/80 px-2 py-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantity - 1,
                                )
                              }
                              className="px-1 text-sm text-[color:var(--color-ink)/0.7]"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={e =>
                                handleQuantityChange(
                                  item.id,
                                  Number(e.target.value) || 1,
                                )
                              }
                              className="w-10 border-none bg-transparent text-center text-sm outline-none"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantity + 1,
                                )
                              }
                              className="px-1 text-sm text-[color:var(--color-ink)/0.7]"
                            >
                              +
                            </button>
                          </div>

                          {/* Line total + remove */}
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold text-[var(--color-ink)]">
                              Rs {lineTotal.toFixed(0)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemove(item.id)}
                              className="mt-1 text-[10px] font-medium text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Right: summary + form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[color:var(--color-ink)/0.08] bg-gradient-to-b from-[var(--color-bone)]/95 to-white px-4 py-5 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink)/0.6]">
                    Order summary
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--color-ink)/0.7]">
                    {hasItems
                      ? `You have ${items.length} product${
                          items.length > 1 ? 's' : ''
                        } in your cart.`
                      : 'No items yet.'}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--color-mustard)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-mustard-dark)]">
                  Payment gateway coming soon
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between border-b border-[color:var(--color-ink)/0.08] pb-4">
                <span className="text-sm text-[color:var(--color-ink)/0.7]">
                  Approximate total
                </span>
                <span className="text-xl font-semibold text-[var(--color-ink)]">
                  Rs {total.toFixed(0)}
                </span>
              </div>

              <p className="text-[11px] leading-relaxed text-[color:var(--color-ink)/0.6]">
                Final price may vary slightly based on shipping location and
                seasonal promotions. We&apos;ll confirm everything with you
                before any payment is made.
              </p>

              {/* Details fields */}
              <div className="mt-2 grid gap-3">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full rounded-[var(--radius-sm)] border border-[color:var(--color-ink)/0.18] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-mustard-dark)] focus:ring-1 focus:ring-[var(--color-mustard-dark)]"
                  required
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full rounded-[var(--radius-sm)] border border-[color:var(--color-ink)/0.18] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-mustard-dark)] focus:ring-1 focus:ring-[var(--color-mustard-dark)]"
                  required
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number (optional)"
                  className="w-full rounded-[var(--radius-sm)] border border-[color:var(--color-ink)/0.18] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-mustard-dark)] focus:ring-1 focus:ring-[var(--color-mustard-dark)]"
                />
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="Any notes about delivery, timing, or questions (optional)"
                  className="min-h-[90px] w-full rounded-[var(--radius-sm)] border border-[color:var(--color-ink)/0.18] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-mustard-dark)] focus:ring-1 focus:ring-[var(--color-mustard-dark)]"
                />
              </div>

              {error && (
                <p className="text-xs font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !hasItems}
                className="mt-2 flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-ink)] text-sm font-semibold text-[var(--color-bone)] transition hover:bg-[var(--color-leaf)] disabled:cursor-not-allowed disabled:bg-[color:var(--color-ink)/0.35]"
              >
                {submitting ? 'Sending order...' : 'Submit order'}
              </button>

              <p className="text-[10px] text-[color:var(--color-ink)/0.6]">
                By submitting, you&apos;re just sending us your order details –
                no online payment is processed yet. Our team will get in touch
                to finalise everything.
              </p>
            </form>
          </div>
        </div>

        {/* Back link under card for mobile */}
        <div className="mt-6 text-center text-xs text-[color:var(--color-ink)/0.6] md:text-left">
          <Link
            href="/products"
            className="font-medium text-mustard hover:brightness-110"
          >
            ← Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
