import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

import { DEFAULT_LOCALE } from '@/i18n/config'

type LandingPageDoc = {
  id: number
  sectionItems?: Array<{
    section?: number | { id?: number | null } | null
  }> | null
  sections?: Array<number | { id?: number | null } | null> | null
  slug?: string | null
  title?: string | null
}

const force = process.argv.includes('--force')

const normalizeID = (value: unknown): number | null => {
  if (typeof value === 'number') return value

  if (value && typeof value === 'object') {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'number') return id
  }

  return null
}

const normalizeSectionIDs = (sections: unknown): number[] => {
  if (!Array.isArray(sections)) return []
  return sections
    .map((section) => normalizeID(section))
    .filter((sectionID): sectionID is number => sectionID !== null)
}

const normalizeSectionItemIDs = (items: unknown): number[] => {
  if (!Array.isArray(items)) return []

  return items
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      return normalizeID((item as { section?: unknown }).section)
    })
    .filter((sectionID): sectionID is number => sectionID !== null)
}

const arraysEqual = (left: number[], right: number[]): boolean => {
  if (left.length !== right.length) return false
  return left.every((entry, index) => String(entry) === String(right[index]))
}

const run = async () => {
  const payload = await getPayload({ config })
  payload.logger.info('[migrate-landing-sections-to-section-items] Starting migration...')

  const landingPagesResult = await payload.find({
    collection: 'landing-pages',
    depth: 0,
    draft: true,
    limit: 1000,
    locale: DEFAULT_LOCALE,
    fallbackLocale: DEFAULT_LOCALE,
    pagination: false,
  })

  let updated = 0
  let skipped = 0

  for (const rawDoc of landingPagesResult.docs as LandingPageDoc[]) {
    const doc = rawDoc
    const legacySectionIDs = normalizeSectionIDs(doc.sections)
    const currentSectionItemIDs = normalizeSectionItemIDs(doc.sectionItems)

    if (legacySectionIDs.length === 0) {
      skipped += 1
      continue
    }

    if (arraysEqual(legacySectionIDs, currentSectionItemIDs)) {
      skipped += 1
      continue
    }

    if (currentSectionItemIDs.length > 0 && !force) {
      payload.logger.warn(
        `[migrate-landing-sections-to-section-items] Skipping ${doc.slug || doc.title || doc.id}: sectionItems already set. Re-run with --force to overwrite.`,
      )
      skipped += 1
      continue
    }

    await payload.update({
      collection: 'landing-pages',
      id: doc.id,
      context: {
        disableRevalidate: true,
      },
      data: {
        sectionItems: legacySectionIDs.map((sectionID) => ({
          section: sectionID,
        })),
      },
      draft: true,
      fallbackLocale: DEFAULT_LOCALE,
      locale: DEFAULT_LOCALE,
    })

    updated += 1
    payload.logger.info(
      `[migrate-landing-sections-to-section-items] Updated ${doc.slug || doc.title || doc.id}.`,
    )
  }

  payload.logger.info(
    `[migrate-landing-sections-to-section-items] Complete. updated=${updated}, skipped=${skipped}`,
  )
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
