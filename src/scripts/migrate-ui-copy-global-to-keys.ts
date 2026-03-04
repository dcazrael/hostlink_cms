import config from '@payload-config'
import { getPayload } from 'payload'

import { DEFAULT_LOCALE, isSupportedLocale } from '@/i18n/config'

type KeySeed = {
  defaultValue: string
  description?: string
  group: string
  key: string
  usedIn?: string[]
}

type ExistingKeyDoc = {
  description?: string | null
  group?: string | null
  id: number
  isActive?: boolean | null
  key?: string | null
  translations?: Array<{
    id?: string | null
    locale?: string | null
    value?: string | null
  }> | null
  usedIn?: Array<string | { area?: string | null; id?: string | null }> | null
}

const force = process.argv.includes('--force')
const nonNullable = <T>(value: T | null | undefined): value is T => value != null

const normalizeText = (value: unknown, fallback = ''): string => {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

const normalizeKey = (value: string): string => normalizeText(value).toLowerCase()

const normalizeUsedInValues = (
  values: ExistingKeyDoc['usedIn'] | undefined,
  fallback: string[] = [],
): string[] => {
  if (!Array.isArray(values)) return fallback

  return values
    .map((value) => {
      if (typeof value === 'string') return normalizeText(value)
      if (!value || typeof value !== 'object') return ''
      return normalizeText(value.area)
    })
    .filter((value) => value.length > 0)
}

const buildSeeds = (uiCopy?: unknown): KeySeed[] => {
  const homepage = (uiCopy as { homepage?: unknown })?.homepage as
    | {
        company?: { ceoLabel?: unknown; servicesHeading?: unknown }
        pricing?: {
          currency?: unknown
          numberLocale?: unknown
          perPeriodLabel?: unknown
          recommendedLabel?: unknown
        }
        section?: { dotLabel?: unknown; progressFallbackLabel?: unknown; sectionLabel?: unknown }
      }
    | undefined

  return [
    {
      key: 'homepage.section.sectionlabel',
      group: 'homepage.section',
      usedIn: ['SectionWrapper'],
      defaultValue: normalizeText(homepage?.section?.sectionLabel, 'Section'),
    },
    {
      key: 'homepage.section.dotlabel',
      group: 'homepage.section',
      usedIn: ['SectionWrapper'],
      defaultValue: normalizeText(homepage?.section?.dotLabel, 'Dot'),
    },
    {
      key: 'homepage.section.progressfallbacklabel',
      group: 'homepage.section',
      usedIn: ['RenderHomepageLayout'],
      defaultValue: normalizeText(homepage?.section?.progressFallbackLabel, 'Section'),
    },
    {
      key: 'homepage.pricing.recommendedlabel',
      group: 'homepage.pricing',
      usedIn: ['PricingSection'],
      defaultValue: normalizeText(homepage?.pricing?.recommendedLabel, 'Recommended'),
    },
    {
      key: 'homepage.pricing.perperiodlabel',
      group: 'homepage.pricing',
      usedIn: ['PricingSection'],
      defaultValue: normalizeText(homepage?.pricing?.perPeriodLabel, '/月'),
    },
    {
      key: 'homepage.pricing.numberlocale',
      group: 'homepage.pricing',
      usedIn: ['PricingSection'],
      defaultValue: normalizeText(homepage?.pricing?.numberLocale, 'ja-JP'),
    },
    {
      key: 'homepage.pricing.currency',
      group: 'homepage.pricing',
      usedIn: ['PricingSection'],
      defaultValue: normalizeText(homepage?.pricing?.currency, 'JPY'),
    },
    {
      key: 'homepage.company.ceolabel',
      group: 'homepage.company',
      usedIn: ['CompanySection'],
      defaultValue: normalizeText(homepage?.company?.ceoLabel, 'CEO'),
    },
    {
      key: 'homepage.company.servicesheading',
      group: 'homepage.company',
      usedIn: ['CompanySection'],
      defaultValue: normalizeText(homepage?.company?.servicesHeading, 'Services'),
    },
    {
      key: 'homepage.hero.chat.title',
      group: 'homepage.hero',
      usedIn: ['ChatMock'],
      defaultValue: 'HostLink ゲストサポート',
    },
    {
      key: 'homepage.hero.chat.message1',
      group: 'homepage.hero',
      usedIn: ['ChatMock'],
      defaultValue: 'Hi, can you help me get started?',
    },
    {
      key: 'homepage.hero.chat.message2',
      group: 'homepage.hero',
      usedIn: ['ChatMock'],
      defaultValue: 'Absolutely. Tell us your goal and we will map the next steps.',
    },
    {
      key: 'homepage.hero.chat.message3',
      group: 'homepage.hero',
      usedIn: ['ChatMock'],
      defaultValue: 'Great, I need the onboarding flow and pricing details.',
    },
    {
      key: 'shared.notfound.description',
      group: 'shared.notFound',
      usedIn: ['NotFound'],
      defaultValue: 'This page could not be found.',
    },
    {
      key: 'shared.notfound.gohome',
      group: 'shared.notFound',
      usedIn: ['NotFound'],
      defaultValue: 'Go home',
    },
    {
      key: 'shared.search.title',
      group: 'shared.search',
      usedIn: ['SearchPage'],
      defaultValue: 'Search',
    },
    {
      key: 'shared.search.noresults',
      group: 'shared.search',
      usedIn: ['SearchPage'],
      defaultValue: 'No results found.',
    },
    {
      key: 'shared.search.metatitle',
      group: 'shared.search',
      usedIn: ['SearchPage'],
      defaultValue: 'HostLink Search',
    },
  ]
}

const run = async () => {
  const payload = await getPayload({ config })
  payload.logger.info('[migrate-ui-copy-global-to-keys] Starting migration...')

  const keySeeds = buildSeeds()

  for (const seed of keySeeds) {
    const normalizedSeedKey = normalizeKey(seed.key)

    const existing = await payload.find({
      collection: 'ui-copy-keys',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        key: {
          equals: normalizedSeedKey,
        },
      },
    })

    const existingDoc = existing.docs[0] as ExistingKeyDoc | undefined

    if (!existingDoc) {
      await payload.create({
        collection: 'ui-copy-keys',
        context: {
          disableRevalidate: true,
        },
        data: {
          key: normalizedSeedKey,
          group: seed.group,
          isActive: true,
          description: seed.description,
          usedIn: seed.usedIn || [],
          translations: [
            {
              locale: DEFAULT_LOCALE,
              value: seed.defaultValue,
            },
          ],
        },
      })

      payload.logger.info(`[migrate-ui-copy-global-to-keys] Created key: ${normalizedSeedKey}`)
      continue
    }

    const existingTranslations = Array.isArray(existingDoc.translations) ? existingDoc.translations : []
    const defaultLocaleIndex = existingTranslations.findIndex(
      (entry) => normalizeText(entry?.locale) === DEFAULT_LOCALE,
    )

    const nextTranslations = [...existingTranslations]

    if (defaultLocaleIndex < 0) {
      nextTranslations.push({
        locale: DEFAULT_LOCALE,
        value: seed.defaultValue,
      })
    } else if (force) {
      nextTranslations[defaultLocaleIndex] = {
        ...nextTranslations[defaultLocaleIndex],
        value: seed.defaultValue,
      }
    }

    await payload.update({
      collection: 'ui-copy-keys',
      id: existingDoc.id,
      context: {
        disableRevalidate: true,
      },
      data: {
        key: normalizedSeedKey,
        group: force ? seed.group : normalizeText(existingDoc.group, seed.group),
        isActive: existingDoc.isActive ?? true,
        description: force ? seed.description : normalizeText(existingDoc.description, seed.description || ''),
        usedIn: force
          ? (seed.usedIn || [])
          : normalizeUsedInValues(existingDoc.usedIn, seed.usedIn || []),
        translations: nextTranslations
          .map((entry) => {
            const locale = normalizeText(entry?.locale)
            if (!isSupportedLocale(locale)) return null

            return {
              locale,
              value: normalizeText(entry?.value),
            }
          })
          .filter(nonNullable),
      },
    })

    payload.logger.info(`[migrate-ui-copy-global-to-keys] Updated key: ${normalizedSeedKey}`)
  }

  payload.logger.info('[migrate-ui-copy-global-to-keys] Migration complete.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
