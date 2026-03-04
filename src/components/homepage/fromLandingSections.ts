import type { LayoutBlock } from '@/components/homepage/types'
import type { LandingPage, LandingSection } from '@/payload-types'

const isLayoutBlock = (value: unknown): value is LayoutBlock => {
  if (!value || typeof value !== 'object') return false

  const block = value as { blockType?: string }
  return block.blockType === 'hero' || block.blockType === 'section'
}

const resolveSectionDocument = (section: unknown): LandingSection | null => {
  if (!section || typeof section !== 'object') return null

  if ('content' in section) {
    return section as LandingSection
  }

  const relationValue = (section as { value?: unknown }).value
  if (relationValue && typeof relationValue === 'object' && 'content' in relationValue) {
    return relationValue as LandingSection
  }

  return null
}

const getSectionBlock = (section: unknown) => {
  const doc = resolveSectionDocument(section)
  if (!doc) return null

  const firstBlock = Array.isArray(doc.content) ? doc.content[0] : null

  if (!isLayoutBlock(firstBlock)) return null

  if (
    firstBlock.blockType === 'section' &&
    typeof doc.title === 'string' &&
    doc.title.trim().length > 0
  ) {
    return {
      ...firstBlock,
      blockName: doc.title,
    }
  }

  return firstBlock
}

export const layoutBlocksFromLandingSections = (
  sections: unknown[] | null | undefined,
): LayoutBlock[] => {
  if (!Array.isArray(sections)) return []

  return sections.flatMap((section) => {
    const block = getSectionBlock(section)
    return block ? [block] : []
  })
}

const getSectionRelationshipsInOrder = (landingPage: LandingPage): unknown[] => {
  const sectionItems = (landingPage as LandingPage & { sectionItems?: unknown }).sectionItems

  if (Array.isArray(sectionItems) && sectionItems.length > 0) {
    return sectionItems
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        const relation = (item as { section?: unknown }).section
        return relation ?? null
      })
      .filter((value) => value !== null)
  }

  return Array.isArray(landingPage.sections) ? landingPage.sections : []
}

export const layoutBlocksFromLandingPage = (landingPage: LandingPage | null | undefined): LayoutBlock[] => {
  if (!landingPage) return []
  return layoutBlocksFromLandingSections(getSectionRelationshipsInOrder(landingPage))
}
