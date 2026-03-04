import { type AppLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/i18n/config'

const externalLinkPattern = /^(?:[a-z]+:)?\/\//i

const isExternalHref = (href: string): boolean =>
  externalLinkPattern.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')

const isExcludedInternalPath = (path: string): boolean =>
  path.startsWith('/admin') || path.startsWith('/api') || path.startsWith('/_next')

const splitHrefParts = (href: string): { hash: string; pathWithQuery: string } => {
  const hashIndex = href.indexOf('#')

  if (hashIndex < 0) {
    return {
      hash: '',
      pathWithQuery: href,
    }
  }

  return {
    hash: href.slice(hashIndex),
    pathWithQuery: href.slice(0, hashIndex),
  }
}

const splitPathAndQuery = (pathWithQuery: string): { path: string; query: string } => {
  const queryIndex = pathWithQuery.indexOf('?')

  if (queryIndex < 0) {
    return {
      path: pathWithQuery,
      query: '',
    }
  }

  return {
    path: pathWithQuery.slice(0, queryIndex),
    query: pathWithQuery.slice(queryIndex),
  }
}

const stripLocalePrefix = (path: string): string => {
  const segments = path.split('/').filter(Boolean)

  if (segments.length === 0) return '/'

  const [first, ...rest] = segments

  if (SUPPORTED_LOCALES.includes(first as AppLocale)) {
    if (rest.length === 0) return '/'
    return `/${rest.join('/')}`
  }

  return path
}

export const localizedHref = (href: string, locale: AppLocale): string => {
  if (!href || isExternalHref(href)) return href

  if (href.startsWith('#')) return href

  const { hash, pathWithQuery } = splitHrefParts(href)
  const { path, query } = splitPathAndQuery(pathWithQuery)

  if (!path.startsWith('/')) return href

  if (isExcludedInternalPath(path)) return href

  const normalizedPath = stripLocalePrefix(path)

  if (locale === DEFAULT_LOCALE) {
    return `${normalizedPath}${query}${hash}`
  }

  if (normalizedPath === '/') {
    return `/${locale}${query}${hash}`
  }

  return `/${locale}${normalizedPath}${query}${hash}`
}
