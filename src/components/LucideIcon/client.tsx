'use client'

import type React from 'react'
import { DynamicIcon, iconNames, type IconName } from 'lucide-react/dynamic'

import { getLucideNameCandidates } from './name'

const iconNameSet = new Set<string>(iconNames)

const resolveIconName = (name: string): IconName | null => {
  const candidates = getLucideNameCandidates(name)

  for (const candidate of candidates) {
    if (iconNameSet.has(candidate)) {
      return candidate as IconName
    }
  }

  return null
}

export const LucideIconClient: React.FC<
  {
    name?: string | null
  } & React.SVGProps<SVGSVGElement>
> = ({ name, ...props }) => {
  if (!name) return null

  const resolvedName = resolveIconName(name)
  if (!resolvedName) return null

  return <DynamicIcon name={resolvedName} {...props} />
}
