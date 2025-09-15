import { groq } from 'next-sanity'

export const productsQuery = groq`*[_type == "product"] | order(title asc){
  _id,
  title,
  "slug": slug.current,
  size,
  description,
  benefits,
  image
}`

//single product by slug
export const singleProductQuery = groq`*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  size,
  description,
  benefits,
  image
}`
//(optional) all product slugs for static params
export const productSlugsQuery = groq`*[_type == "product" && defined(slug.current)][].slug.current`

export const pageSlugsQuery = groq`*[_type=="page" && defined(slug.current)][].slug.current`


export const pageBySlugQuery = groq`*[_type=="page" && slug.current==$slug][0]{
    _id, title, "slug": slug.current, content
  }`