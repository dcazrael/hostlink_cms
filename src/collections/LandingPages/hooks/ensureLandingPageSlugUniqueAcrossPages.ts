import { ValidationError, type CollectionBeforeValidateHook } from 'payload'

import type { LandingPage } from '@/payload-types'

export const ensureLandingPageSlugUniqueAcrossPages: CollectionBeforeValidateHook<LandingPage> =
  async ({ data, originalDoc, req }) => {
    const nextSlug =
      typeof data?.slug === 'string'
        ? data.slug.trim()
        : typeof originalDoc?.slug === 'string'
          ? originalDoc.slug.trim()
          : ''

    if (!nextSlug) return data

    const existingPage = await req.payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1,
      pagination: false,
      req,
      where: {
        slug: {
          equals: nextSlug,
        },
      },
    })

    if (existingPage.docs.length > 0) {
      throw new ValidationError({
        collection: 'landing-pages',
        errors: [
          {
            path: 'slug',
            message: `Slug "${nextSlug}" is already used by a page.`,
          },
        ],
        req,
      })
    }

    return data
  }
