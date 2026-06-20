/**
 * Barrel exports for the hostlink pattern layer.
 *
 * Each export is a self-contained, type-safe React component that draws
 * one specific visual cue (diagonal masks, navy bands, chamfered cards,
 * mint bullets, numbered badges, etc.). The primitives are independent
 * of Payload and the homepage renderer; higher-level sections compose them.
 */

export { Bullet, BulletList, FeatureList, type BulletShape } from './BulletList'
export { ChamferedCard, type ChamferedCardCorner, type ChamferedCardTone } from './ChamferedCard'
export { DiagonalBand, type DiagonalBandOrientation, type DiagonalBandTone } from './DiagonalBand'

export { NumberBadge, type NumberBadgeShape, type NumberBadgeTone } from './NumberBadge'
export { FAQStack, type FAQItem, type FAQStackProps } from './FAQ'
export { GridBlock, type GridBlockColumns, type GridBlockProps } from './GridBlock'
export {
  GridBlockItem,
  type GridBlockItemAccentTone,
  type GridBlockItemData,
  type GridBlockItemProps,
  type GridBlockItemRadius,
  type GridBlockItemVariant,
} from './GridBlockItem'

export { Card, ContactPanel, FlowSteps, SectionShape, type SectionShapeVariant } from './Patterns'
export { ContentPageHero } from './ContentPageHero'
export { LandingPageHero, type LandingPageHeroVariant } from './LandingPageHero'
export { ImageFrame } from './ImageFrame'
export { SectionFrame, type SectionFrameTone } from './SectionFrame'
export {
  CompanyInfoTable,
  type CompanyInfoItem,
  type CompanyInfoTableProps,
} from './CompanyInfoTable'
export { Table, type TableProps } from './Table'
export {
  PATTERN_TONES,
  PATTERN_TONE_CLASSES,
  type PatternTone,
  type PatternToneClasses,
} from './tones'
export { ShapeMask, type ShapeMaskDirection, type ShapeMaskTone } from './ShapeMask'
export { VerticalAccent, type VerticalAccentTone } from './VerticalAccent'

// Re-export the slot contract so consumers can pair primitives with the
// named slots in `visualSlots.ts` without an extra import.
export {
  resolveVisualSlot,
  VISUAL_SLOTS,
  type VisualDefinition,
  type VisualSlot,
} from './visualSlots'
