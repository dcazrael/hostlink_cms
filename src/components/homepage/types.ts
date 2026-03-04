import type { LandingPage, Page } from '@/payload-types'

export type LayoutBlock = Page['layout'][number]
export type HeroLayoutBlock = Extract<LayoutBlock, { blockType: 'hero' }>
export type SectionLayoutBlock = Extract<LayoutBlock, { blockType: 'section' }>
export type SectionComponentBlock = NonNullable<SectionLayoutBlock['component']>[number]

export type HomepageLinkLike = {
  anchor?: string | null
  icon?: 'arrowRight' | 'mail' | 'phone' | null
  label?: string | null
  page?:
    | number
    | Page
    | LandingPage
    | {
        relationTo?: 'landing-pages' | 'pages' | null
        value?: number | LandingPage | Page | null
      }
    | null
  type?: 'anchor' | 'external' | 'internal' | null
  url?: string | null
  variant?: 'ghost' | 'outline' | 'primary' | 'secondary' | null
  withIcon?: boolean | null
}

export type IconTextValue = {
  icon?: unknown
  text?: string
}

export type DecoratedBlock = {
  anchor?: string
  block: LayoutBlock
  dotIndex: number | null
  index: number
  sectionIndex: number | null
}
