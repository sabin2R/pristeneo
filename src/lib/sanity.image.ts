import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/asset-utils'
import { sanityClient } from './sanity.client'

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
