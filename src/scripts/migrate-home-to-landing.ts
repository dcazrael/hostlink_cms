import 'dotenv/config'
import { buildLandingSectionTitle } from '@/collections/LandingSections/hooks/buildLandingSectionTitle'
import type { LandingSection } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

type HomeBlock = {
  blockType?: string
  id?: string | null
}

const force = process.argv.includes('--force')

const isHomepageBlock = (block: unknown): block is HomeBlock => {
  if (!block || typeof block !== 'object') return false
  const value = block as HomeBlock

  return value.blockType === 'hero' || value.blockType === 'section'
}

const stripBlockID = <T extends HomeBlock>(block: T): Omit<T, 'id'> => {
  const { id: _ignore, ...rest } = block
  return rest
}

const stripUnsafeKeysForCreate = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((entry) => stripUnsafeKeysForCreate(entry))
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const entries = Object.entries(value as Record<string, unknown>)
  const next: Record<string, unknown> = {}

  for (const [key, currentValue] of entries) {
    if (currentValue === undefined) continue
    if (key === 'id' || key === 'createdAt' || key === 'updatedAt') continue

    next[key] = stripUnsafeKeysForCreate(currentValue)
  }

  return next
}

const slugExistsInCollection = async ({
  collection,
  payload,
  slug,
}: {
  collection: 'landing-pages' | 'pages'
  payload: Awaited<ReturnType<typeof getPayload>>
  slug: string
}) => {
  const result = await payload.find({
    collection,
    depth: 0,
    draft: true,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs.length > 0
}

const getAvailableLegacySlug = async (payload: Awaited<ReturnType<typeof getPayload>>) => {
  let suffix = 0

  while (true) {
    const candidate = suffix === 0 ? 'home-legacy' : `home-legacy-${suffix + 1}`

    const [existsInPages, existsInLandingPages] = await Promise.all([
      slugExistsInCollection({
        collection: 'pages',
        payload,
        slug: candidate,
      }),
      slugExistsInCollection({
        collection: 'landing-pages',
        payload,
        slug: candidate,
      }),
    ])

    if (!existsInPages && !existsInLandingPages) return candidate
    suffix += 1
  }
}

const run = async () => {
  const payload = await getPayload({ config })

  payload.logger.info('[migrate-home-to-landing] Starting migration...')

  const [
    homePageDraftResult,
    homePagePublishedResult,
    legacyHomePageDraftResult,
    legacyHomePagePublishedResult,
    landingHomeResult,
  ] = await Promise.all([
    payload.find({
      collection: 'pages',
      depth: 0,
      draft: true,
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: 'home',
        },
      },
    }),
    payload.find({
      collection: 'pages',
      depth: 0,
      draft: false,
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: 'home',
        },
      },
    }),
    payload.find({
      collection: 'pages',
      depth: 0,
      draft: true,
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: 'home-legacy',
        },
      },
    }),
    payload.find({
      collection: 'pages',
      depth: 0,
      draft: false,
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: 'home-legacy',
        },
      },
    }),
    payload.find({
      collection: 'landing-pages',
      depth: 1,
      draft: true,
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: 'home',
        },
      },
    }),
  ])

  const homePageDraft = homePageDraftResult.docs[0]
  const homePagePublished = homePagePublishedResult.docs[0]
  const legacyHomePageDraft = legacyHomePageDraftResult.docs[0]
  const legacyHomePagePublished = legacyHomePagePublishedResult.docs[0]
  const existingLandingHome = landingHomeResult.docs[0]
  const sourcePage =
    homePageDraft || homePagePublished || legacyHomePageDraft || legacyHomePagePublished

  if (!sourcePage) {
    payload.logger.info('[migrate-home-to-landing] No source homepage found in pages collection. Exiting.')
    return
  }

  if (existingLandingHome && !force) {
    payload.logger.info(
      '[migrate-home-to-landing] Landing home already exists. Exiting. Re-run with --force to remap sections.',
    )
    return
  }

  const sourceBlocks = Array.isArray(sourcePage.layout)
    ? sourcePage.layout
        .filter(isHomepageBlock)
        .map((block) => stripUnsafeKeysForCreate(stripBlockID(block as HomeBlock)))
    : []

  if (sourceBlocks.length === 0) {
    payload.logger.info(
      '[migrate-home-to-landing] Source homepage has no hero/section blocks to migrate. Exiting.',
    )
    return
  }

  const sectionIDs: number[] = []

  for (const block of sourceBlocks) {
    const section = await payload.create({
      collection: 'landing-sections',
      context: {
        disableRevalidate: true,
      },
      data: {
        title: buildLandingSectionTitle(block as NonNullable<LandingSection['content']>[number]),
        content: [block as NonNullable<LandingSection['content']>[number]],
      },
    })

    sectionIDs.push(section.id)
  }

  const pagesUsingHomeSlug = [homePageDraft, homePagePublished].filter(Boolean)

  if (pagesUsingHomeSlug.length > 0) {
    const legacySlug = await getAvailableLegacySlug(payload)
    const uniquePageIDs = [...new Set(pagesUsingHomeSlug.map((doc) => doc.id))]

    for (const pageID of uniquePageIDs) {
      const updateArgs = {
        collection: 'pages' as const,
        id: pageID,
        context: {
          disableRevalidate: true,
        },
        data: {
          slug: legacySlug,
          _status: 'draft' as const,
        },
      }

      try {
        await payload.update({
          ...updateArgs,
          draft: false,
        })
      } catch (error) {
        payload.logger.warn(
          `[migrate-home-to-landing] Could not update published state for page ${String(pageID)}: ${String(error)}`,
        )
      }

      try {
        await payload.update({
          ...updateArgs,
          draft: true,
        })
      } catch (error) {
        payload.logger.warn(
          `[migrate-home-to-landing] Could not update draft state for page ${String(pageID)}: ${String(error)}`,
        )
      }
    }

    payload.logger.info(`[migrate-home-to-landing] Moved pages/home to pages/${legacySlug}.`)
  }

  if (existingLandingHome) {
    await payload.update({
      collection: 'landing-pages',
      id: existingLandingHome.id,
      context: {
        disableRevalidate: true,
      },
      data: {
        sectionItems: sectionIDs.map((sectionID) => ({ section: sectionID })),
        title: existingLandingHome.title || sourcePage.title || 'Home',
        sections: sectionIDs,
      },
      draft: true,
    })

    payload.logger.info('[migrate-home-to-landing] Updated existing landing home with migrated sections.')
  } else {
    await payload.create({
      collection: 'landing-pages',
      context: {
        disableRevalidate: true,
      },
      data: {
        sectionItems: sectionIDs.map((sectionID) => ({ section: sectionID })),
        title: sourcePage.title || 'Home',
        slug: 'home',
        sections: sectionIDs,
      },
      draft: true,
    })

    payload.logger.info('[migrate-home-to-landing] Created landing home.')
  }

  payload.logger.info('[migrate-home-to-landing] Migration complete.')
}

run().catch((error) => {
  console.error(error)
  const maybeData = (error as { data?: unknown })?.data

  if (maybeData) {
    console.error('[migrate-home-to-landing] Validation details:', JSON.stringify(maybeData, null, 2))
  }
  process.exit(1)
})
