'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { LocalizedLink } from '@/components/LocalizedLink'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const showLoginCTA = data.showLoginCTA !== false
  const showConsultationCTA = data.showConsultationCTA !== false
  const showActionArea = showLoginCTA || showConsultationCTA

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="relative z-20 border-b border-border bg-background"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container flex items-center justify-between gap-6 py-5">
        <LocalizedLink className="shrink-0" href="/">
          <Logo loading="eager" priority="high" />
        </LocalizedLink>

        <div className="hidden flex-1 justify-center lg:flex">
          <HeaderNav data={data} />
        </div>

        {showActionArea ? (
          <div className="flex items-center gap-3">
            {showLoginCTA ? (
              <CMSLink {...data.loginCTA} appearance="outline" className="rounded-full px-6" />
            ) : null}
            {showConsultationCTA ? (
              <CMSLink {...data.consultationCTA} appearance="default" className="rounded-full px-6" />
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  )
}
