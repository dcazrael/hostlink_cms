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
  pageAnchor?: string | null
  reference?: {
    relationTo: 'landing-pages' | 'pages' | 'posts'
    value: LandingPage | Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'homepageAnchor' | 'reference' | null
  url?: string | null
}

const normalizeAnchor = (value: string | null | undefined): string =>
  typeof value === 'string' ? value.trim().replace(/^#/, '') : ''

const getReferenceHref = (
  reference: CMSLinkType['reference'],
  pageAnchor?: string | null,
): string | null => {
  if (typeof reference?.value !== 'object' || !reference.value.slug) return null

  const basePath =
    reference.relationTo === 'posts'
      ? `/posts/${reference.value.slug}`
      : reference.value.slug === 'home'
        ? '/'
        : `/${reference.value.slug}`

  const normalizedPageAnchor = reference.relationTo === 'pages' ? normalizeAnchor(pageAnchor) : ''
  return normalizedPageAnchor ? `${basePath}#${normalizedPageAnchor}` : basePath
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
    pageAnchor,
    reference,
    size: sizeFromProps,
    url,
  } = props

  const resolvedHomepageAnchor = normalizeAnchor(homepageAnchor)

  const href =
    type === 'homepageAnchor'
      ? resolvedHomepageAnchor
        ? `/#${resolvedHomepageAnchor}`
        : null
      : type === 'reference'
        ? getReferenceHref(reference, pageAnchor)
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
