import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: r => r.required(),
    }),
    defineField({
      name: 'size',
      type: 'string',
      description: 'e.g., 250 ml, 500 ml, 1 L, 5 L',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'benefits',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    // 👇 NEW: pricing fields
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Base price (e.g. 499)',
      validation: r => r.min(0),
    }),
    defineField({
      name: 'salePrice',
      title: 'Sale price (optional)',
      type: 'number',
      description: 'Discounted price. Leave empty if there is no sale.',
      validation: r => r.min(0),
    }),
    // ✅ stock
    defineField({
      name: 'inStock',
      title: 'In stock',
      type: 'boolean',
      description: 'Untick when this size is temporarily unavailable.',
      initialValue: true,
    }),
  ],
})
