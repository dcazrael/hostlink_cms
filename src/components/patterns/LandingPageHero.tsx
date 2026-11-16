import * as React from 'react'
import { LocalizedLink } from '@/components/LocalizedLink'
import { Button } from '../ui/button'
import { FeatureList, type BulletShape } from './BulletList'
import { SectionFrame } from './SectionFrame'

/**
 * Discriminator for the visual slot the hero pairs its text with.
 * - `image`: the slot is an `ImageFrame` showing a photograph
 * - `component`: the slot is any ReactNode (e.g. a chat mock, a card)
 *
 * The variant only documents intent; the slot is rendered as-is in both
 * cases.
 */
export type LandingPageHeroVariant = 'image' | 'component'

/**
 * Single hero used at the top of a landing page. Wraps a `SectionFrame`
 * with a 2-column layout (text on the left, slot on the right) that
 * stacks on small viewports.
 *
 * Text side reads top-to-bottom: eyebrow → title → description → CTAs →
 * features. CTAs always render (primary first, then optional secondary).
 * Features are an optional FeatureList whose row direction is
 * `flex-row` on <md and `flex-col` on >=md.
 *
 * @summary landing page hero with text + visual slot
 */
export const LandingPageHero: React.FC<{
  variant: LandingPageHeroVariant
  eyebrow: string
  title: string
  description: string
  features?: Array<{ title: string; text?: string }>
  featureShape?: BulletShape
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  slot: React.ReactNode
  className?: string
}> = ({
  variant: _variant,
  eyebrow,
  title,
  description,
  features,
  featureShape = 'square',
  primaryCta,
  secondaryCta,
  slot,
  className,
}) => (
  <SectionFrame tone="subtle" className={className}>
    <div className="grid gap-8 md:grid-cols-2 md:items-center">
      <div className="flex flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-widest text-(--heading)/75">{eyebrow}</p>
        <h2 className="whitespace-pre-line text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="max-w-2xl whitespace-pre-line text-sm text-(--heading)/75 md:text-base">
          {description}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button variant="default">
            <LocalizedLink href={primaryCta.href}>{primaryCta.label}</LocalizedLink>
          </Button>
          {secondaryCta ? (
            <Button variant="outline">
              <LocalizedLink href={secondaryCta.href}>{secondaryCta.label}</LocalizedLink>
            </Button>
          ) : null}
        </div>
        {features?.length ? (
          <FeatureList items={features} shape={featureShape} className="flex-row md:flex-col" />
        ) : null}
      </div>
      <div>{slot}</div>
    </div>
  </SectionFrame>
)

export default LandingPageHero
