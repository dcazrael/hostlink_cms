import { Button, type ButtonProps } from '@/components/ui/button'
import { LocalizedLink } from '@/components/LocalizedLink'
import { cn } from '@/utilities/ui'
import React from 'react'

import type { LandingPage, Page, Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  homepageAnchor?: string | null
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'landing-pages' | 'pages' | 'posts'
    value: LandingPage | Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'homepageAnchor' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    homepageAnchor,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const resolvedHomepageAnchor =
    typeof homepageAnchor === 'string' ? homepageAnchor.trim().replace(/^#/, '') : ''

  const href =
    type === 'homepageAnchor'
      ? resolvedHomepageAnchor
        ? `/#${resolvedHomepageAnchor}`
        : null
      : type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
        ? `${reference?.relationTo && !['landing-pages', 'pages'].includes(reference.relationTo) ? `/${reference.relationTo}` : ''}/${
            reference.value.slug
          }`
        : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <LocalizedLink className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </LocalizedLink>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <LocalizedLink className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </LocalizedLink>
    </Button>
  )
}
