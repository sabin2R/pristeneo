'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity.image'
import type { Product } from '@/types/product'

export default function ProductClient({ product }: { product: Product }) {
  return (
    <div className="min-h-screen w-full bg-[--background] text-[--color-ink] overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 md:py-20">
        
        {/* Breadcrumb / Back */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-sm font-medium text-[--color-ink]/60 hover:text-[--color-mustard] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Collection
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* LEFT: Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full aspect-[4/5] lg:aspect-square rounded-[--radius-lg] bg-[--color-bone] overflow-hidden shadow-[--shadow-soft] border border-[--color-ink]/5"
          >
            {product.image ? (
              <Image
                src={urlFor(product.image).width(1200).height(1200).url()}
                alt={product.title}
                fill
                className="object-contain p-8 md:p-16 hover:scale-105 transition-transform duration-700 ease-in-out"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[--color-ink]/30 italic">
                Image coming soon
              </div>
            )}
            
            {/* Badge */}
            <div className="absolute top-6 left-6 bg-[--color-leaf] text-[--color-bone] text-xs font-bold px-3 py-1.5 rounded-full tracking-wide shadow-sm">
              100% ORGANIC
            </div>
          </motion.div>

          {/* RIGHT: Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center h-full pt-4"
          >
            <span className="text-[--color-mustard-dark] font-bold tracking-widest text-xs uppercase mb-3">
              Premium Selection
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[--color-ink] leading-[1.1]">
              {product.title}
            </h1>

            {/* Price or Size Tag */}
            <div className="flex items-center gap-4 mb-8 border-b border-[--color-ink]/10 pb-8">
              {product.size && (
                <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-[--radius-sm] bg-[--color-ink]/5 text-[--color-ink] font-medium text-sm">
                  {product.size}
                </span>
              )}
              <span className="text-[--color-leaf] font-medium text-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[--color-leaf] animate-pulse"/>
                In Stock & Ready to Ship
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-lg text-[--color-ink]/70 mb-10 max-w-none">
              <p className="leading-relaxed">{product.description}</p>
            </div>

            {/* Benefits Grid */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="mb-12">
                <h3 className="text-sm font-bold uppercase text-[--color-ink]/40 mb-4 tracking-wider">Highlights</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[--color-mustard] group-hover:scale-150 transition-transform"/>
                      <span className="text-[--color-ink]/90 font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Link 
                href={`/contact?subject=Inquiry: ${product.title}`}
                className="flex-1 h-14 bg-[--color-ink] text-[--color-bone] rounded-[--radius-md] font-bold text-lg flex items-center justify-center hover:bg-[--color-leaf] hover:shadow-[--shadow-strong] active:scale-[0.98] transition-all duration-300"
              >
                Order Now
              </Link>
              <Link 
                href="/process"
                className="px-8 h-14 border border-[--color-ink]/20 rounded-[--radius-md] text-[--color-ink] font-semibold flex items-center justify-center hover:border-[--color-ink] hover:bg-[--color-bone] transition-colors"
              >
                How It&apos;s Made
              </Link>
            </div>
            
            <p className="mt-4 text-xs text-[--color-ink]/40 text-center sm:text-left">
              Secure shipping • Lab tested • Satisfaction guaranteed
            </p>

          </motion.div>
        </div>
      </div>
    </div>
  )
}