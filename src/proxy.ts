import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_HEADER_NAME,
  isSupportedLocale,
} from '@/i18n/config'

const publicFilePattern = /\.[^/]+$/
const excludedPrefixes = ['/admin', '/api', '/_next']

const shouldBypassMiddleware = (pathname: string): boolean => {
  if (publicFilePattern.test(pathname)) return true

  return excludedPrefixes.some((prefix) => pathname.startsWith(prefix))
}

const withLocale = ({
  locale,
  request,
  rewritePathname,
}: {
  locale: string
  request: NextRequest
  rewritePathname?: string
}) => {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(LOCALE_HEADER_NAME, locale)

  const response = rewritePathname
    ? NextResponse.rewrite(
        new URL(
          `${rewritePathname}${request.nextUrl.search}`,
          request.url,
        ),
        {
          request: {
            headers: requestHeaders,
          },
        },
      )
    : NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })

  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: '/',
    sameSite: 'lax',
  })

  return response
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (shouldBypassMiddleware(pathname)) {
    return NextResponse.next()
  }

  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (isSupportedLocale(firstSegment)) {
    if (firstSegment === DEFAULT_LOCALE) {
      const redirectedPath = `/${segments.slice(1).join('/')}`
      const redirectURL = request.nextUrl.clone()
      redirectURL.pathname = redirectedPath === '/' ? '/' : redirectedPath

      return NextResponse.redirect(redirectURL)
    }

    const internalPath = `/${segments.slice(1).join('/')}`

    return withLocale({
      locale: firstSegment,
      request,
      rewritePathname: internalPath === '/' ? '/' : internalPath,
    })
  }

  return withLocale({
    locale: DEFAULT_LOCALE,
    request,
  })
}

export const config = {
  matcher: '/:path*',
}
