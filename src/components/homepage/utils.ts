import type {
  DecoratedBlock,
  HeroLayoutBlock,
  HomepageLinkLike,
  IconTextValue,
  LayoutBlock,
  SectionLayoutBlock,
} from '@/components/homepage/types'
import { getSectionAnchorValue } from '@/utilities/homepageAnchors'

export const isHeroBlock = (block: LayoutBlock): block is HeroLayoutBlock => block.blockType === 'hero'

export const isSectionBlock = (block: LayoutBlock): block is SectionLayoutBlock =>
  block.blockType === 'section'

export const resolveLucideName = (icon: unknown): string | undefined => {
  if (!icon || typeof icon !== 'object') return undefined

  const iconDoc = icon as {
    isEnabled?: boolean | null
    lucideName?: string | null
  }

  if (iconDoc.isEnabled === false) return undefined

  if (typeof iconDoc.lucideName === 'string' && iconDoc.lucideName.length > 0) {
    return iconDoc.lucideName
  }

  return undefined
}

export const normalizeIconTextValue = (value: unknown): IconTextValue | null => {
  if (!value) return null

  if (typeof value === 'string') {
    const text = value.trim()
    return text ? { text } : null
  }

  if (typeof value !== 'object') return null

  const iconText = value as { icon?: unknown; text?: unknown }
  const text = typeof iconText.text === 'string' ? iconText.text.trim() : ''

  if (!text) return null

  return {
    icon: iconText.icon,
    text,
  }
}

export const resolveHomepageLinkHref = (link?: HomepageLinkLike | null) => {
  if (!link) return undefined

  if (link.type === 'anchor') {
    if (typeof link.anchor !== 'string' || link.anchor.trim().length === 0) return undefined
    return `#${link.anchor}`
  }

  if (link.type === 'external') {
    return link.url || undefined
  }

  if (link.type === 'internal' && link.page) {
    const pageValue =
      typeof link.page === 'object' &&
      link.page !== null &&
      'value' in link.page &&
      link.page.value &&
      typeof link.page.value === 'object'
        ? link.page.value
        : link.page

    if (!pageValue || typeof pageValue !== 'object' || !('slug' in pageValue)) return undefined

    if (pageValue.slug === 'home') {
      return '/'
    }

    return `/${pageValue.slug}`
  }

  return undefined
}

export const decorateBlocks = (blocks: LayoutBlock[]): DecoratedBlock[] => {
  const decoratedBlocks: DecoratedBlock[] = []

  let sectionCounter = 0
  let dotCounter = 0

  blocks.forEach((block, index) => {
    if (isSectionBlock(block)) {
      sectionCounter += 1

      const includeInProgress = block.showInProgress !== false
      const dotIndex = includeInProgress ? ++dotCounter : null
      const anchor = getSectionAnchorValue(block, sectionCounter)

      decoratedBlocks.push({
        anchor,
        block,
        dotIndex,
        index,
        sectionIndex: sectionCounter,
      })
      return
    }

    decoratedBlocks.push({
      block,
      dotIndex: null,
      index,
      sectionIndex: null,
    })
  })

  return decoratedBlocks
}

export const getProgressItems = (
  decoratedBlocks: DecoratedBlock[],
  fallbackPrefix = 'Section',
) => {
  return decoratedBlocks.flatMap((entry) => {
    if (
      !isSectionBlock(entry.block) ||
      !entry.anchor ||
      typeof entry.sectionIndex !== 'number' ||
      typeof entry.dotIndex !== 'number'
    ) {
      return []
    }

    return [
      {
        anchor: entry.anchor,
        dotIndex: entry.dotIndex,
        label: entry.block.progressLabel || entry.block.heading || `${fallbackPrefix} ${entry.sectionIndex}`,
      },
    ]
  })
}
