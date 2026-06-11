import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

type DocWithSlug = { slug?: string | null; _status?: string | null }

type TypeWithID = { id: string | number }

export const createRevalidateHooks = <T extends TypeWithID & DocWithSlug>(
  collectionLabel: string,
) => {
  const revalidate: CollectionAfterChangeHook<T> = ({
    doc,
    previousDoc,
    req: { context, payload },
  }) => {
    if (!context.disableRevalidate) {
      if (doc._status === 'published') {
        const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
        payload.logger.info(`Revalidating ${collectionLabel} at path: ${path}`)
        revalidatePath(path, 'page')
        revalidateTag('pages-sitemap', 'max')
      }

      if (previousDoc?._status === 'published' && doc._status !== 'published') {
        const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`
        payload.logger.info(`Revalidating old ${collectionLabel} at path: ${oldPath}`)
        revalidatePath(oldPath, 'page')
        revalidateTag('pages-sitemap', 'max')
      }
    }

    return doc
  }

  const revalidateDelete: CollectionAfterDeleteHook<T> = ({ doc, req: { context } }) => {
    if (!context.disableRevalidate) {
      const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
      revalidatePath(path, 'page')
      revalidateTag('pages-sitemap', 'max')
    }

    return doc
  }

  return { revalidate, revalidateDelete }
}
