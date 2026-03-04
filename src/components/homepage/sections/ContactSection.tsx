import type { Form as PluginForm } from '@payloadcms/plugin-form-builder/types'
import React from 'react'

import { FormBlock as EmbeddedFormBlock } from '@/blocks/Form/Component'
import { LocalizedLink } from '@/components/LocalizedLink'
import { LucideIcon } from '@/components/LucideIcon'
import { IconText } from '@/components/homepage/IconText'
import type { HomepageLinkLike, SectionComponentBlock } from '@/components/homepage/types'
import { resolveHomepageLinkHref, resolveLucideName } from '@/components/homepage/utils'
import { Button, type ButtonProps } from '@/components/ui/button'

type ContactBlock = Extract<SectionComponentBlock, { blockType: 'contact' }>
type ContactFooterItem = NonNullable<ContactBlock['footerItems']>[number]
const SECTION_MAX_WIDTH_CLASS = 'mx-auto w-full max-w-[40rem]'

const buttonVariantMap: Record<NonNullable<HomepageLinkLike['variant']>, ButtonProps['variant']> = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
}

const renderFooterItem = (item: ContactFooterItem, index: number) => {
  const kind = item.kind || 'text'
  const key = item.id || index

  if (kind === 'link' || kind === 'button') {
    const link = item.link as HomepageLinkLike | null | undefined
    const href = resolveHomepageLinkHref(link)
    const label = typeof link?.label === 'string' ? link.label.trim() : ''

    if (href && label) {
      const iconNameFromFooterItem = resolveLucideName(item.icon)
      const iconNameFromLinkField =
        link?.withIcon && typeof link.icon === 'string' ? link.icon : undefined
      const iconName = iconNameFromFooterItem || iconNameFromLinkField
      const icon = iconName ? <LucideIcon className="size-4" name={iconName} /> : null

      if (kind === 'button') {
        const variant = buttonVariantMap[link?.variant || 'primary']

        return (
          <Button asChild key={key} size="lg" variant={variant}>
            <LocalizedLink href={href}>
              {icon}
              <span>{label}</span>
            </LocalizedLink>
          </Button>
        )
      }

      return (
        <LocalizedLink
          className="mx-auto inline-flex max-w-full items-center gap-2 text-sm font-medium underline decoration-border underline-offset-4 transition hover:opacity-80"
          href={href}
          key={key}
        >
          {icon}
          <span>{label}</span>
        </LocalizedLink>
      )
    }
  }

  const text = typeof item.text === 'string' ? item.text.trim() : ''
  if (!text) return null

  return (
    <IconText
      containerClassName="mx-auto flex max-w-full items-center justify-center gap-2"
      iconClassName="size-4 text-muted-foreground"
      key={key}
      textClassName="text-xs text-muted-foreground"
      value={{ icon: item.icon, text }}
    />
  )
}

export const ContactSection: React.FC<{ block: ContactBlock }> = ({ block }) => {
  const form = block.form && typeof block.form === 'object' ? block.form : null
  const footerItems = Array.isArray(block.footerItems) ? block.footerItems : []
  const renderedFooterItems = footerItems
    .map((item, index) => renderFooterItem(item, index))
    .filter(Boolean)
  const hasFooterContent = renderedFooterItems.length > 0

  return (
    // Section max width is design-owned in component (not CMS).
    <div
      className={`${SECTION_MAX_WIDTH_CLASS} space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8`}
    >
      {form ? <EmbeddedFormBlock enableIntro={false} form={form as unknown as PluginForm} /> : null}

      {hasFooterContent ? (
        <div className="flex flex-col items-center space-y-4 border-t border-border pt-5">
          {renderedFooterItems}
        </div>
      ) : null}
    </div>
  )
}
