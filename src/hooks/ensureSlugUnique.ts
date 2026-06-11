import { ValidationError, type CollectionBeforeValidateHook } from 'payload'

type TypeWithID = { id: string | number; slug?: string | null }

export const ensureSlugUniqueAcrossCollections =
  <T extends TypeWithID>(options: {
    collectionSlug: string
    otherCollectionSlug: string
    errorMessage: string
  }): CollectionBeforeValidateHook<T> =>
  async ({ data, originalDoc, req }) => {
    const nextSlug =
      typeof data?.slug === 'string'
        ? data.slug.trim()
        : typeof originalDoc?.slug === 'string'
          ? originalDoc.slug.trim()
          : ''

    if (!nextSlug) return data

    const existing = await req.payload.find({
      collection: options.otherCollectionSlug as any,
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

    if (existing.docs.length > 0) {
      throw new ValidationError({
        collection: options.collectionSlug,
        errors: [
          {
            path: 'slug',
            message: options.errorMessage.replace('{slug}', nextSlug),
          },
        ],
        req,
      })
    }

    return data
  }
