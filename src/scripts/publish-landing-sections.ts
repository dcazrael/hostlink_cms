import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

import { DEFAULT_LOCALE } from '@/i18n/config'
type LandingPageLike = {
  sectionItems?: Array<{
    section?: number | { id?: number | null } | null
  }> | null
  sections?: Array<number | { id?: number | null } | null> | null
}

const normalizeSectionID = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (!value || typeof value !== 'object') return null
  const id = (value as { id?: unknown }).id
  return typeof id === 'number' ? id : null
}

const collectIDsFromLandingPages = async (payload: Awaited<ReturnType<typeof getPayload>>) => {
  const pages = await payload.find({
    collection: 'landing-pages',
    depth: 0,
    draft: true,
    fallbackLocale: DEFAULT_LOCALE,
    limit: 1000,
    locale: DEFAULT_LOCALE,
    pagination: false,
  })

  const ids = new Set<number>()
  for (const rawDoc of pages.docs as LandingPageLike[]) {
    const sectionItems = Array.isArray(rawDoc.sectionItems) ? rawDoc.sectionItems : []
    for (const item of sectionItems) {
      const id = normalizeSectionID(item?.section)
      if (id !== null) ids.add(id)
    }

    const sections = Array.isArray(rawDoc.sections) ? rawDoc.sections : []
    for (const section of sections) {
      const id = normalizeSectionID(section)
      if (id !== null) ids.add(id)
    }
  }

  return [...ids]
}

const run = async () => {
  const payload = await getPayload({ config })
  payload.logger.info('[publish-landing-sections] Starting...')

  const fromFind = await payload.find({
    collection: 'landing-sections',
    depth: 0,
    draft: true,
    fallbackLocale: DEFAULT_LOCALE,
    limit: 1000,
    locale: DEFAULT_LOCALE,
    pagination: false,
  })
  const ids: number[] =
    fromFind.docs.length > 0 ? fromFind.docs.map((doc) => doc.id) : await collectIDsFromLandingPages(payload)

  let published = 0
  let skipped = 0

  for (const id of ids) {
    try {
      await payload.update({
        collection: 'landing-sections',
        id,
        context: {
          disableRevalidate: true,
        },
        data: {},
        draft: false,
        fallbackLocale: DEFAULT_LOCALE,
        locale: DEFAULT_LOCALE,
      })

      published += 1
    } catch (error) {
      skipped += 1
      payload.logger.warn(
        `[publish-landing-sections] Could not publish section ${String(id)}: ${String(error)}`,
      )
    }
  }

  payload.logger.info(
    `[publish-landing-sections] Complete. source=${fromFind.docs.length > 0 ? 'payload.find' : 'landing-pages-relations'} published=${published}, skipped=${skipped}`,
  )
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
