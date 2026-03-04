import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { LandingSection } from '@/payload-types'

const revalidateLinkedLandingPagesBySectionID = async ({
  req,
  sectionID,
}: {
  req: PayloadRequest
  sectionID?: number | string
}) => {
  if (!sectionID) return

  const linkedPages = await req.payload.find({
    collection: 'landing-pages',
    depth: 0,
    limit: 100,
    pagination: false,
    req,
    where: {
      and: [
        {
          _status: {
            equals: 'published',
          },
        },
        {
          or: [
            {
              sections: {
                in: [sectionID],
              },
            },
            {
              'sectionItems.section': {
                in: [sectionID],
              },
            },
          ],
        },
      ],
    },
  })

  for (const page of linkedPages.docs) {
    if (!page.slug) continue

    const path = page.slug === 'home' ? '/' : `/${page.slug}`
    revalidatePath(path, 'page')
  }

  if (linkedPages.docs.length > 0) {
    revalidateTag('pages-sitemap', 'max')
  }
}

export const revalidateLinkedLandingPagesAfterSectionChange: CollectionAfterChangeHook<LandingSection> =
  async ({ doc, req }) => {
    if (!req.context.disableRevalidate) {
      await revalidateLinkedLandingPagesBySectionID({
        req,
        sectionID: doc.id,
      })
    }

    return doc
  }

export const revalidateLinkedLandingPagesAfterSectionDelete: CollectionAfterDeleteHook<LandingSection> =
  async ({ doc, req }) => {
    if (!req.context.disableRevalidate) {
      await revalidateLinkedLandingPagesBySectionID({
        req,
        sectionID: doc?.id,
      })
    }

    return doc
  }
