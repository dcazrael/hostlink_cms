/**
 * Barrel exports for the hostlink pamphlet primitive layer.
 *
 * Each export is a self-contained, type-safe React component that draws
 * one specific visual cue from the hostlink pamphlet (diagonal masks,
 * navy bands, chamfered cards, mint bullets, numbered badges, etc.).
 * The primitives are independent of Payload and the homepage renderer;
 * higher-level sections compose them. Stories in
 * `src/components/pamphlet/*.stories.tsx` exercise every primitive.
 */

export { ShapeMask, type ShapeMaskDirection, type ShapeMaskTone } from './ShapeMask'
export { DiagonalBand, type DiagonalBandTone, type DiagonalBandOrientation } from './DiagonalBand'
export { ChamferedCard, type ChamferedCardCorner, type ChamferedCardTone } from './ChamferedCard'
export { SectionFrame, type SectionFrameTone } from './SectionFrame'
export { MintBullet, type MintBulletShape } from './MintBullet'
export { MintBulletList } from './MintBullet'
export { VerticalAccent, type VerticalAccentTone } from './VerticalAccent'
export { NumberBadge, type NumberBadgeTone, type NumberBadgeShape } from './NumberBadge'
export {
  ContactPanel,
  FAQStack,
  FlowSteps,
  GridBlockItem,
  ImageFrame,
  PamphletButton,
  PamphletCard,
  PamphletTable,
  PricingCard,
  SectionShape,
  SectionWithImage,
} from './Patterns'

// Re-export the slot contract so consumers can pair primitives with the
// named slots in `visualSlots.ts` without an extra import.
export {
  PAMPHLET_VISUAL_SLOTS,
  resolvePamphletVisualSlot,
  type PamphletVisualSlot,
  type PamphletVisualDefinition,
} from './visualSlots'
