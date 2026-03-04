import { cookies, headers } from 'next/headers'

import { AppLocale, DEFAULT_LOCALE, LOCALE_COOKIE_NAME, LOCALE_HEADER_NAME, isSupportedLocale } from './config'

export const getActiveLocale = async (): Promise<AppLocale> => {
  const requestHeaders = await headers()
  const localeFromHeader = requestHeaders.get(LOCALE_HEADER_NAME)

  if (isSupportedLocale(localeFromHeader)) {
    return localeFromHeader
  }

  const requestCookies = await cookies()
  const localeFromCookie = requestCookies.get(LOCALE_COOKIE_NAME)?.value

  if (isSupportedLocale(localeFromCookie)) {
    return localeFromCookie
  }

  return DEFAULT_LOCALE
}

