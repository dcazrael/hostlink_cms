import { ValidationError, type CollectionBeforeValidateHook } from 'payload'

import { SUPPORTED_LOCALES } from '@/i18n/config'

const keyPattern = /^[a-z0-9]+(?:\.[a-z0-9]+)*$/

const normalizeText = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const normalizeUsedIn = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined

  const normalized = value
    .map((entry) => {
      if (typeof entry === 'string') return normalizeText(entry)

      if (!entry || typeof entry !== 'object') return undefined

      return normalizeText((entry as { area?: unknown }).area)
    })
    .filter((entry): entry is string => typeof entry === 'string' && entry.length > 0)

  return normalized
}

export const normalizeAndValidateUICopyKey: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const nextKeyRaw = normalizeText(data?.key) ?? normalizeText(originalDoc?.key)
  const nextKey = nextKeyRaw?.toLowerCase()

  const errors: Array<{ message: string; path: string }> = []

  if (nextKey && !keyPattern.test(nextKey)) {
    errors.push({
      path: 'key',
      message: 'Key must use dot.case (e.g. homepage.hero.chat.title).',
    })
  }

  const incomingTranslations = Array.isArray(data?.translations)
    ? data.translations
    : Array.isArray(originalDoc?.translations)
      ? originalDoc.translations
      : []

  const localeSeen = new Set<string>()

  for (const translation of incomingTranslations) {
    const locale = normalizeText(translation?.locale)

    if (!locale) continue

    if (!SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
      errors.push({
        path: 'translations',
        message: `Unsupported locale "${locale}".`,
      })
      continue
    }

    if (localeSeen.has(locale)) {
      errors.push({
        path: 'translations',
        message: `Duplicate locale "${locale}" in translations.`,
      })
      continue
    }

    localeSeen.add(locale)
  }

  if (errors.length > 0) {
    throw new ValidationError({
      collection: 'ui-copy-keys',
      errors,
      req,
    })
  }

  const normalizedUsedIn =
    normalizeUsedIn(data?.usedIn) ?? normalizeUsedIn(originalDoc?.usedIn) ?? data?.usedIn

  return {
    ...data,
    key: nextKey,
    usedIn: normalizedUsedIn,
  }
}
