import { ArrowRight, Mail, Phone } from 'lucide-react'
import React from 'react'

import { LocalizedLink } from '@/components/LocalizedLink'
import type { HomepageLinkLike } from '@/components/homepage/types'
import { resolveHomepageLinkHref } from '@/components/homepage/utils'
import { Button, type ButtonProps } from '@/components/ui/button'

const buttonVariantMap: Record<NonNullable<HomepageLinkLike['variant']>, ButtonProps['variant']> = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
}

const linkIconMap = {
  arrowRight: ArrowRight,
  mail: Mail,
  phone: Phone,
} as const

export const HomepageLinkButton: React.FC<{ link?: HomepageLinkLike | null }> = ({ link }) => {
  if (!link) return null

  const href = resolveHomepageLinkHref(link)

  if (!href || !link.label) return null

  const Icon = link.withIcon && link.icon ? linkIconMap[link.icon] : null
  const variant = buttonVariantMap[link.variant || 'primary']

  return (
    <Button asChild size="lg" variant={variant}>
      <LocalizedLink href={href}>
        {link.label}
        {Icon ? <Icon className="size-4" /> : null}
      </LocalizedLink>
    </Button>
  )
}
