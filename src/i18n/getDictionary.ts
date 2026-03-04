import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import configPromise from '@payload-config'
import { type AppLocale, DEFAULT_LOCALE } from '@/i18n/config'

type TranslationDoc = {
  isActive?: boolean | null
  key?: string | null
  translations?: Array<{
    locale?: string | null
    value?: string | null
  }> | null
}

const textOrUndefined = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const buildDictionaryForLocale = async (locale: AppLocale): Promise<Record<string, string>> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'ui-copy-keys',
    depth: 0,
    limit: 5000,
    pagination: false,
    overrideAccess: false,
    where: {
      isActive: {
        equals: true,
      },
    },
  })

  const dictionary: Record<string, string> = {}

  for (const rawDoc of result.docs as TranslationDoc[]) {
    const key = textOrUndefined(rawDoc.key)
    if (!key) continue

    const translations = Array.isArray(rawDoc.translations) ? rawDoc.translations : []
    const localeValue = textOrUndefined(
      translations.find((entry) => entry?.locale === locale)?.value,
    )
    const defaultValue = textOrUndefined(
      translations.find((entry) => entry?.locale === DEFAULT_LOCALE)?.value,
    )

    const resolved = localeValue ?? defaultValue
    if (resolved) {
      dictionary[key] = resolved
    }
  }

  return dictionary
}

const getCachedDictionaryByLocale = (locale: AppLocale) =>
  unstable_cache(async () => buildDictionaryForLocale(locale), ['ui-copy-dictionary', locale], {
    tags: ['ui-copy-dictionary', `ui-copy-dictionary-${locale}`],
  })

export const getDictionary = async (locale: AppLocale): Promise<Record<string, string>> =>
  getCachedDictionaryByLocale(locale)()

