import React from 'react'

import { PricingPlanCard } from '@/components/pricing/PricingPlanCard'
import {
  appendQueryParamsToHomepageHref,
  resolveHomepageLinkHref,
} from '@/components/homepage/utils'
import type { PricingComponentBlock } from '@/payload-types'
import { cn } from '@/utilities/ui'

const resolvePricingPlanCta = (
  cta: PricingComponentBlock['plans'][number]['cta'] | null | undefined,
  planName: string,
) => {
  if (!cta) return null

  const href = resolveHomepageLinkHref(cta)
  const hrefWithQuery = href ? appendQueryParamsToHomepageHref(href, { plan: planName }) : href

  if (!hrefWithQuery || !cta.label) return null

  return {
    href: hrefWithQuery,
    label: cta.label,
    variant: cta.variant,
    icon: cta.icon,
    withIcon: cta.withIcon,
  }
}

type Props = {
  block: PricingComponentBlock
}

export const PricingBlockComponent: React.FC<Props> = ({ block }) => {
  const plans = block.plans || []

  if (plans.length === 0) return null

  return (
    <div className="pricing-section">
      <div
        className={cn(
          'pricing-section__grid',
          plans.length === 1 ? 'pricing-section__grid--single' : 'pricing-section__grid--multi',
        )}
      >
        {plans.map((plan, planIndex) => (
          <PricingPlanCard
            cta={resolvePricingPlanCta(plan.cta, plan.planName)}
            contents={plan.contents}
            planName={plan.planName}
            planSub={plan.planSub}
            price={plan.price}
            priceDisclaimer={plan.priceDisclaimer}
            recommended={plans.length > 1 && planIndex === 0 ? true : plan.recommended}
            stylePreset={plan.stylePreset}
            key={plan.id || planIndex}
          />
        ))}
      </div>
    </div>
  )
}
