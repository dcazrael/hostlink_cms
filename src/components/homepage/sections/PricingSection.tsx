import { ArrowRight, CircleCheckBig, CircleHelp, Mail, Phone, Star } from 'lucide-react'
import React from 'react'

import { LocalizedLink } from '@/components/LocalizedLink'
import type { SectionComponentBlock } from '@/components/homepage/types'
import {
  appendQueryParamsToHomepageHref,
  resolveHomepageLinkHref,
} from '@/components/homepage/utils'
import type { TranslateFn } from '@/i18n/createTranslator'
import { cn } from '@/utilities/ui'

type PricingBlock = Extract<SectionComponentBlock, { blockType: 'pricing' }>
type PricingPlan = PricingBlock['plans'][number]
type PricingCTAVariant = NonNullable<PricingPlan['cta']>['variant']
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

const resolveCtaVariant = (value: PricingCTAVariant | null | undefined) => {
  if (value === 'secondary' || value === 'outline' || value === 'ghost') return value
  return 'primary'
}

const resolveStylePresetClassName = (
  value: PricingPlan['stylePreset'] | null | undefined,
): (typeof pricingStylePresetClassMap)[keyof typeof pricingStylePresetClassMap] => {
  if (value && value in pricingStylePresetClassMap) {
    return pricingStylePresetClassMap[value as keyof typeof pricingStylePresetClassMap]
  }

  return pricingStylePresetClassMap.style1
}

const formatPrice = (price: number, t: TranslateFn): string => {
  const numberLocale = t('homepage.pricing.numberlocale', 'ja-JP')
  const currency = t('homepage.pricing.currency', 'JPY')

  try {
    return new Intl.NumberFormat(numberLocale, {
      style: 'currency',
      currency,
    }).format(price)
  } catch {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price)
  }
}

const PricingPlanCTA: React.FC<{
  link?: PricingPlan['cta']
  planName: string
}> = ({ link, planName }) => {
  if (!link) return null

  const href = resolveHomepageLinkHref(link)
  const hrefWithQuery =
    href && planName ? appendQueryParamsToHomepageHref(href, { plan: planName }) : href

  if (!hrefWithQuery || !link.label) return null

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
      href={hrefWithQuery}
    >
      <span>{link.label}</span>
      {Icon ? <Icon className="pricing-card__cta-icon" /> : null}
    </LocalizedLink>
  )
}

export const PricingSection: React.FC<{ block: PricingBlock; t: TranslateFn }> = ({ block, t }) => {
  const legacyBlock = block as PricingBlock & {
    planName?: string
    planSub?: string | null
    recommended?: boolean | null
    stylePreset?: PricingPlan['stylePreset']
    price?: number
    priceDisclaimer?: string | null
    contents?: { id?: string | null; text: string; tooltip?: string | null }[]
    cta?: PricingPlan['cta']
  }

  const plans: PricingPlan[] =
    block.plans && block.plans.length > 0
      ? block.plans
      : legacyBlock.planName && typeof legacyBlock.price === 'number'
        ? [
            {
              planName: legacyBlock.planName,
              planSub: legacyBlock.planSub,
              recommended: legacyBlock.recommended,
              stylePreset: legacyBlock.stylePreset,
              price: legacyBlock.price,
              priceDisclaimer: legacyBlock.priceDisclaimer,
              contents: legacyBlock.contents || [],
              cta: legacyBlock.cta,
            },
          ]
        : []

  if (plans.length === 0) return null
  return (
    <div className="pricing-section">
      <div
        className={cn(
          'pricing-section__grid',
          plans.length === 1 ? 'pricing-section__grid--single' : 'pricing-section__grid--multi',
        )}
      >
        {plans.map((plan, planIndex) => {
          const stylePresetClassName = resolveStylePresetClassName(plan.stylePreset)
          const formattedPrice = formatPrice(plan.price, t)
          const isPrimaryCard = plans.length > 1 && planIndex === 0

          return (
            <div
              className={cn(
                'pricing-card',
                stylePresetClassName,
                isPrimaryCard && 'pricing-card--featured',
              )}
              key={plan.id || planIndex}
            >
              <div className="pricing-card__surface">
                <div className="pricing-card__header">
                  <div className="pricing-card__heading">
                    <h3 className="pricing-card__title">{plan.planName}</h3>
                    {plan.planSub ? <p className="pricing-card__plan-sub">{plan.planSub}</p> : null}
                  </div>
                  {plan.recommended ? (
                    <span className="pricing-card__chip">
                      <div className="pricing-card__chip-icon-wrap">
                        <Star className="pricing-card__chip-icon" />
                      </div>
                      {t('homepage.pricing.recommendedlabel', 'Popular')}
                    </span>
                  ) : null}
                </div>

                <div className="pricing-card__divider" />

                <p className="pricing-card__includes-label">
                  {t('homepage.pricing.includeslabel', 'Includes')}
                </p>

                <ul className="pricing-card__list">
                  {(plan.contents || []).map((item, itemIndex) => {
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
                    {formattedPrice}{' '}
                    <span className="pricing-card__price-period">
                      {t('homepage.pricing.perperiodlabel', '/月')}
                    </span>
                  </p>
                  {plan.priceDisclaimer ? (
                    <p className="pricing-card__price-disclaimer">{plan.priceDisclaimer}</p>
                  ) : null}
                </div>
              </div>
              <PricingPlanCTA link={plan.cta} planName={plan.planName} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
