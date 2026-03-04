import { ValidationError, type CollectionBeforeValidateHook } from 'payload'

import type { Page } from '@/payload-types'

export const ensurePageSlugUniqueAcrossLandingPages: CollectionBeforeValidateHook<Page> = async ({
  data,
  originalDoc,
  req,
}) => {
  const nextSlug =
    typeof data?.slug === 'string'
      ? data.slug.trim()
      : typeof originalDoc?.slug === 'string'
        ? originalDoc.slug.trim()
        : ''

  if (!nextSlug) return data

  const existingLandingPage = await req.payload.find({
    collection: 'landing-pages',
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

  if (existingLandingPage.docs.length > 0) {
    throw new ValidationError({
      collection: 'pages',
      errors: [
        {
          path: 'slug',
          message: `Slug "${nextSlug}" is already used by a landing page.`,
        },
      ],
      req,
    })
  }

  return data
}
