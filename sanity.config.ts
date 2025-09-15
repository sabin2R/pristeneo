import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, // set in .env.local
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  title: 'Pristeneo Studio',
  basePath: '/studio',            // Studio will live at /studio
  plugins: [deskTool(), visionTool()],
  schema: { types: schemaTypes },
})
