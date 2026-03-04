'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-8">
      {navItems.map(({ link }, i) => {
        return <CMSLink className="text-foreground text-base font-medium hover:opacity-80" key={i} {...link} appearance="inline" />
      })}
    </nav>
  )
}
