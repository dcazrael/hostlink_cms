import type { LandingSection } from '@/payload-types'

type SectionContentBlock = NonNullable<LandingSection['content']>[number]

type HeroLike = {
  blockType?: 'hero'
  title?: string | null
}

type SectionLike = {
  blockType?: 'section'
  heading?: string | null
  component?: Array<{ blockType?: string | null }> | null
}

type TitleSourceBlock = SectionContentBlock | HeroLike | SectionLike

export const buildLandingSectionTitle = (block?: TitleSourceBlock | null): string => {
  if (!block) return 'Section'

  if (block.blockType === 'hero') {
    const hero = block as HeroLike
    const title = typeof hero.title === 'string' ? hero.title.trim() : ''
    return title ? `Hero · ${title}` : 'Hero'
  }

  if (block.blockType === 'section') {
    const section = block as SectionLike
    const heading = typeof section.heading === 'string' ? section.heading.trim() : ''
    const sectionType = section.component?.[0]?.blockType
    const suffix = typeof sectionType === 'string' && sectionType.length > 0 ? ` · ${sectionType}` : ''

    return heading ? `Section · ${heading}${suffix}` : `Section${suffix}`
  }

  return 'Section'
}
