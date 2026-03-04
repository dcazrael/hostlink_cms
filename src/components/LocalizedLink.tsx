'use client'

import { type AppLocale, DEFAULT_LOCALE, getLocaleFromPathname } from '@/i18n/config'
import { localizedHref } from '@/i18n/localizedHref'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

type LocalizedLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  href: string
  locale?: AppLocale
}

export const LocalizedLink: React.FC<LocalizedLinkProps> = ({ href, locale, ...props }) => {
  const pathname = usePathname()
  const activeLocale = locale || (pathname ? getLocaleFromPathname(pathname) : DEFAULT_LOCALE)

  return <Link href={localizedHref(href, activeLocale)} {...props} />
}

