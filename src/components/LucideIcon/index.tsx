import * as Lucide from 'lucide-react'
import type React from 'react'

const toPascalCase = (value: string) => {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

const resolveLucideComponent = (name: string) => {
  const moduleMap = Lucide as Record<string, unknown>

  const candidates = [name, toPascalCase(name)]

  for (const candidate of candidates) {
    const comp = moduleMap[candidate]

    if (comp && (typeof comp === 'function' || typeof comp === 'object')) {
      return comp as React.ComponentType<React.SVGProps<SVGSVGElement>>
    }
  }

  return null
}

export const LucideIcon: React.FC<
  {
    name?: string | null
  } & React.SVGProps<SVGSVGElement>
> = ({ name, ...props }) => {
  if (!name) return null

  const IconComponent = resolveLucideComponent(name)
  if (!IconComponent) return null

  return <IconComponent {...props} />
}
