import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { LocalizedLink } from '@/components/LocalizedLink'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

export const dynamic = 'force-dynamic'

export async function Header() {
  const headerData: Header | null = await getCachedGlobal('header', 1)()

  if (!headerData) {
    return null
  }

  const showLoginCTA = headerData.showLoginCTA !== false
  const showConsultationCTA = headerData.showConsultationCTA !== false
  const showActionArea = showLoginCTA || showConsultationCTA

  return (
    <header className="relative z-20 border-b border-border bg-background">
      <div className="container flex items-center justify-between gap-6 py-5">
        <LocalizedLink className="shrink-0" href="/">
          <Logo loading="eager" priority="high" />
        </LocalizedLink>

        <HeaderNav data={headerData} />

        {showActionArea ? (
          <div className="hidden lg:flex items-center gap-3">
            {showLoginCTA ? (
              <CMSLink
                {...headerData.loginCTA}
                appearance="outline"
                className="rounded-full px-6"
              />
            ) : null}
            {showConsultationCTA ? (
              <CMSLink
                {...headerData.consultationCTA}
                appearance="default"
                className="rounded-full px-6"
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  )
}
