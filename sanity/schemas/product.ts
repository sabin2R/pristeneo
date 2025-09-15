import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'size', type: 'string', description: 'e.g., 250 ml, 500 ml, 1 L, 5 L' }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'benefits', type: 'array', of: [{ type: 'string' }] }),
  ],
})
