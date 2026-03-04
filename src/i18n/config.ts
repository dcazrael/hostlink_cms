export const SUPPORTED_LOCALES = ['ja', 'en'] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'ja'

export const LOCALE_HEADER_NAME = 'x-hostlink-locale'
export const LOCALE_COOKIE_NAME = 'hostlink-locale'

const localeSet = new Set<string>(SUPPORTED_LOCALES)

export const isSupportedLocale = (value: unknown): value is AppLocale =>
  typeof value === 'string' && localeSet.has(value)

export const getLocaleFromPathname = (pathname: string): AppLocale => {
  const firstSegment = pathname.split('/').filter(Boolean)[0]

  if (isSupportedLocale(firstSegment)) return firstSegment

  return DEFAULT_LOCALE
}
