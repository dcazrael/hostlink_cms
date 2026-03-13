import type React from 'react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { cache } from 'react'

import { getLucideNameCandidates } from './name'

type IconModule = {
  default: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const iconMap = dynamicIconImports as Record<string, () => Promise<IconModule>>

const resolveIconName = (name: string): string | null => {
  const candidates = getLucideNameCandidates(name)
  for (const candidate of candidates) {
    if (candidate in iconMap) {
      return candidate
    }
  }

  return null
}

const loadIconComponent = cache(async (name: string) => {
  const loader = iconMap[name]
  if (!loader) return null

  const mod = await loader()
  return mod.default
})

export const LucideIcon: React.FC<
  {
    name?: string | null
  } & React.SVGProps<SVGSVGElement>
> = async ({ name, ...props }) => {
  if (!name) return null

  const resolvedName = resolveIconName(name)
  if (!resolvedName) return null

  const IconComponent = await loadIconComponent(resolvedName)
  if (!IconComponent) return null

  return <IconComponent {...props} />
}
