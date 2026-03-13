import 'dotenv/config'
import { buildLandingSectionTitle } from '@/collections/LandingSections/hooks/buildLandingSectionTitle'
import { DEFAULT_LOCALE } from '@/i18n/config'
import type { LandingPage, LandingSection, Page } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

type HomeBlock = {
  blockType?: string
  id?: string | null
}

const isHomepageBlock = (block: unknown): block is HomeBlock => {
  if (!block || typeof block !== 'object') return false
  const value = block as HomeBlock
  return value.blockType === 'hero' || value.blockType === 'section'
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

const extractHomepageBlocksFromLayout = (layout: unknown): unknown[] => {
  if (!Array.isArray(layout)) return []

  return layout
    .filter(isHomepageBlock)
    .map((block: HomeBlock) => stripUnsafeKeysForCreate(block))
}

const findFirstPageBySlug = async ({
  collection,
  payload,
  slug,
}: {
  collection: 'landing-pages' | 'pages'
  payload: Awaited<ReturnType<typeof getPayload>>
  slug: string
}) => {
  const attempts: Array<{ draft: boolean; locale?: 'ja' | 'en'; note: string }> = [
    { draft: true, locale: DEFAULT_LOCALE, note: 'draft/default-locale' },
    { draft: false, locale: DEFAULT_LOCALE, note: 'published/default-locale' },
    { draft: true, note: 'draft/no-locale' },
    { draft: false, note: 'published/no-locale' },
  ]

  for (const attempt of attempts) {
    const result = await payload.find({
      collection,
      depth: 0,
      draft: attempt.draft,
      limit: 1,
      locale: attempt.locale,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    if (result.docs[0]) {
      return { doc: result.docs[0], note: attempt.note }
    }
  }

  return null
}

const pickSourcePage = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<{ doc: Page; note: string } | null> => {
  const legacy = await findFirstPageBySlug({
    collection: 'pages',
    payload,
    slug: 'home-legacy',
  })
  if (legacy?.doc) return { doc: legacy.doc as Page, note: legacy.note }

  const home = await findFirstPageBySlug({
    collection: 'pages',
    payload,
    slug: 'home',
  })

  if (home?.doc) return { doc: home.doc as Page, note: home.note }

  return null
}

const pickSourceFromPageVersions = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<{ note: string; pageLike: Pick<Page, 'layout' | 'title'> } | null> => {
  const attempts: Array<{ locale?: 'ja' | 'en'; slug: 'home' | 'home-legacy' }> = [
    { locale: DEFAULT_LOCALE, slug: 'home-legacy' },
    { locale: DEFAULT_LOCALE, slug: 'home' },
    { slug: 'home-legacy' },
    { slug: 'home' },
  ]

  for (const attempt of attempts) {
    const versions = await payload.findVersions({
      collection: 'pages',
      depth: 0,
      limit: 50,
      locale: attempt.locale,
      pagination: false,
      sort: '-updatedAt',
      where: {
        'version.slug': {
          equals: attempt.slug,
        },
      },
    })

    for (const versionDoc of versions.docs) {
      const version = (versionDoc as { version?: Page }).version
      if (!version) continue

      const sourceBlocks = extractHomepageBlocksFromLayout(version.layout)
      if (sourceBlocks.length === 0) continue

      return {
        note: `pages versions (slug=${attempt.slug}, locale=${attempt.locale || 'none'})`,
        pageLike: {
          layout: version.layout,
          title: version.title,
        },
      }
    }
  }

  return null
}

const run = async () => {
  const payload = await getPayload({ config })
  payload.logger.info('[restore-landing-home-content] Starting restore...')

  const sourceResult: { doc: Page; note: string } | null = await pickSourcePage(payload)
  let sourcePageLike: Pick<Page, 'layout' | 'title'> | null = sourceResult?.doc || null
  let sourceNote = sourceResult?.note || ''

  if (!sourcePageLike) {
    const sourceFromVersions = await pickSourceFromPageVersions(payload)
    if (sourceFromVersions) {
      sourcePageLike = sourceFromVersions.pageLike
      sourceNote = sourceFromVersions.note
    }
  }

  if (!sourcePageLike) {
    payload.logger.error(
      '[restore-landing-home-content] Could not find source page content in pages docs or pages versions. Aborting.',
    )
    process.exit(1)
  }
  payload.logger.info(`[restore-landing-home-content] Source content resolved via ${sourceNote}.`)

  const sourceBlocks = extractHomepageBlocksFromLayout(sourcePageLike.layout)

  if (sourceBlocks.length === 0) {
    payload.logger.error(
      '[restore-landing-home-content] Source page has no hero/section blocks in layout. Aborting.',
    )
    process.exit(1)
  }

  const landingHomeResult = await findFirstPageBySlug({
    collection: 'landing-pages',
    payload,
    slug: 'home',
  })
  const landingHome = (landingHomeResult?.doc as LandingPage | undefined) || null
  if (landingHomeResult?.doc) {
    payload.logger.info(
      `[restore-landing-home-content] Landing home resolved via ${landingHomeResult.note}.`,
    )
  } else {
    payload.logger.warn('[restore-landing-home-content] Landing home not found. Will create a new one.')
  }

  const sectionIDs: number[] = []
  for (const block of sourceBlocks) {
    const section = await payload.create({
      collection: 'landing-sections',
      context: {
        disableRevalidate: true,
      },
      data: {
        content: [block as NonNullable<LandingSection['content']>[number]],
        title: buildLandingSectionTitle(block as NonNullable<LandingSection['content']>[number]),
      },
      locale: DEFAULT_LOCALE,
    })

    sectionIDs.push(section.id)
  }

  if (landingHome) {
    await payload.update({
      collection: 'landing-pages',
      id: landingHome.id,
      context: {
        disableRevalidate: true,
      },
      data: {
        sectionItems: sectionIDs.map((sectionID) => ({ section: sectionID })),
        sections: sectionIDs,
        title: landingHome.title || sourcePageLike.title || 'Home',
      },
      draft: true,
      locale: DEFAULT_LOCALE,
    })
  } else {
    await payload.create({
      collection: 'landing-pages',
      context: {
        disableRevalidate: true,
      },
      data: {
        sectionItems: sectionIDs.map((sectionID) => ({ section: sectionID })),
        sections: sectionIDs,
        slug: 'home',
        title: sourcePageLike.title || 'Home',
      },
      draft: true,
      locale: DEFAULT_LOCALE,
    })
  }

  payload.logger.info(
    `[restore-landing-home-content] Restored ${sectionIDs.length} sections to landing-pages/home (${DEFAULT_LOCALE}).`,
  )
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
