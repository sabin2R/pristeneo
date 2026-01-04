import type { SanityImageSource } from '@sanity/asset-utils'

export interface Product {
  _id: string
  title: string
  slug: string
  size?: string
  description?: string
  benefits?: string[]
  image?: SanityImageSource
  price?: number
  salePrice?: number
  inStock?: boolean
}
