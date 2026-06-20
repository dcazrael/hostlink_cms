import * as React from 'react'
import { ArrowRight, CircleCheckBig, CircleHelp, Mail, Phone, Star } from 'lucide-react'
import { LocalizedLink } from '@/components/LocalizedLink'
import { cn } from '@/utilities/ui'

export type PricingPlanCardStylePreset = 'style1' | 'style2' | 'style3' | 'style4' | 'style5'

export type PricingPlanCardContent = {
  id?: string | null
  text: string
  tooltip?: string | null
}

export type PricingPlanCardCTA = {
  label?: string | null
  href?: string | null
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | null
  icon?: 'arrowRight' | 'mail' | 'phone' | null
  withIcon?: boolean | null
}

export type PricingPlanCardProps = {
  planName: string
  planSub?: string | null
  recommended?: boolean | null
  stylePreset?: PricingPlanCardStylePreset | null
  price: number
  priceDisclaimer?: string | null
  contents?: PricingPlanCardContent[] | null
  cta?: PricingPlanCardCTA | null
}

const pricingStylePresetClassMap = {
  style1: 'pricing-card--style1',
  style2: 'pricing-card--style2',
  style3: 'pricing-card--style3',
  style4: 'pricing-card--style4',
  style5: 'pricing-card--style5',
} as const

const linkIconMap = {
  arrowRight: ArrowRight,
  mail: Mail,
  phone: Phone,
} as const

const resolveCtaVariant = (value: PricingPlanCardCTA['variant']) => {
  if (value === 'secondary' || value === 'outline' || value === 'ghost') return value
  return 'primary'
}

const resolveStylePresetClassName = (
  value: PricingPlanCardStylePreset | null | undefined,
): (typeof pricingStylePresetClassMap)[keyof typeof pricingStylePresetClassMap] => {
  if (value && value in pricingStylePresetClassMap) {
    return pricingStylePresetClassMap[value]
  }
  return pricingStylePresetClassMap.style1
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price)

const PricingPlanCTAButton: React.FC<{
  link?: PricingPlanCardCTA | null
}> = ({ link }) => {
  if (!link?.href || !link.label) return null

  const variant = resolveCtaVariant(link.variant)
  const Icon = link.withIcon === false ? null : link.icon ? linkIconMap[link.icon] : ArrowRight

  return (
    <LocalizedLink
      className={cn(
        'pricing-card__cta',
        variant === 'secondary' && 'pricing-card__cta--secondary',
        variant === 'outline' && 'pricing-card__cta--outline',
        variant === 'ghost' && 'pricing-card__cta--ghost',
      )}
      href={link.href}
    >
      <span>{link.label}</span>
      {Icon ? <Icon className="pricing-card__cta-icon" /> : null}
    </LocalizedLink>
  )
}

/**
 * Shared pricing card presentation using the real website pricing-card CSS system.
 * This is the single source of truth for Storybook and the live Pricing block.
 *
 * @summary shared pricing card that reuses the real website pricing CSS
 */
export const PricingPlanCard: React.FC<PricingPlanCardProps> = ({
  planName,
  planSub,
  recommended,
  stylePreset,
  price,
  priceDisclaimer,
  contents,
  cta,
}) => {
  const formattedPrice = formatPrice(price)
  const stylePresetClassName = resolveStylePresetClassName(stylePreset)

  return (
    <div
      className={cn('pricing-card', stylePresetClassName, recommended && 'pricing-card--featured')}
    >
      <div className="pricing-card__surface">
        <div className="pricing-card__header">
          <div className="pricing-card__heading">
            <h3 className="pricing-card__title whitespace-pre-line">{planName}</h3>
            {planSub ? (
              <p className="pricing-card__plan-sub whitespace-pre-line">{planSub}</p>
            ) : null}
          </div>
          {recommended ? (
            <span className="pricing-card__chip">
              <div className="pricing-card__chip-icon-wrap">
                <Star className="pricing-card__chip-icon" />
              </div>
              <span>Popular</span>
            </span>
          ) : null}
        </div>

        <div className="pricing-card__divider" />

        <p className="pricing-card__includes-label">Includes</p>

        <ul className="pricing-card__list">
          {(contents || []).map((item, itemIndex) => {
            const hasTooltip = Boolean(item.tooltip && item.tooltip.trim().length > 0)
            return (
              <li className="pricing-card__item" key={item.id || itemIndex}>
                <span className="pricing-card__item-main">
                  <CircleCheckBig className="pricing-card__check" />
                  <span>{item.text}</span>
                </span>

                {hasTooltip ? (
                  <span className="pricing-card__tooltip-wrap">
                    <button
                      aria-label={`More information about ${item.text}`}
                      className="pricing-card__tooltip-trigger"
                      type="button"
                    >
                      <CircleHelp className="pricing-card__tooltip-icon" />
                    </button>
                    <span className="pricing-card__tooltip">{item.tooltip}</span>
                  </span>
                ) : null}
              </li>
            )
          })}
        </ul>

        <div className="pricing-card__price-wrap">
          <p className="pricing-card__price">
            {formattedPrice} <span className="pricing-card__price-period">/月</span>
          </p>
          {priceDisclaimer ? (
            <p className="pricing-card__price-disclaimer">{priceDisclaimer}</p>
          ) : null}
        </div>
      </div>
      <PricingPlanCTAButton link={cta} />
    </div>
  )
}
