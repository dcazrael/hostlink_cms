import { CircleCheck } from 'lucide-react'
import React from 'react'

import { HomepageLinkButton } from '@/components/homepage/HomepageLinkButton'
import type { SectionComponentBlock } from '@/components/homepage/types'
import type { TranslateFn } from '@/i18n/createTranslator'

type PricingBlock = Extract<SectionComponentBlock, { blockType: 'pricing' }>
const SECTION_MAX_WIDTH_CLASS = 'mx-auto w-full max-w-[48rem]'

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

export const PricingSection: React.FC<{ block: PricingBlock; t: TranslateFn }> = ({ block, t }) => {
  const formattedPrice = formatPrice(block.price, t)

  return (
    // Section max width is design-owned in component (not CMS).
    <div className={SECTION_MAX_WIDTH_CLASS}>
      <div className="mx-auto flex w-full max-w-md flex-col rounded-2xl border border-border bg-card shadow-md">
        <div className="relative flex items-center justify-center gap-4 rounded-t-2xl bg-primary p-6 md:p-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-foreground">{block.planName}</h3>
            {block.planSub ? <p className="mt-1 text-foreground">{block.planSub}</p> : null}
          </div>
          {block.recommended ? (
            <span className="absolute -top-2 -right-2 rotate-35 rounded-full border border-primary-foreground bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground shadow-md">
              {t('homepage.pricing.recommendedlabel', 'Recommended')}
            </span>
          ) : null}
        </div>

        <div className="p-6 md:p-8">
          <div className="mt-6 flex items-end justify-center gap-2">
            <p className="text-4xl font-semibold">
              {formattedPrice}{' '}
              <span className="text-xl text-muted/60">{t('homepage.pricing.perperiodlabel', '/月')}</span>
            </p>
          </div>

          {block.priceDisclaimer ? (
            <p className="mt-1 text-center text-sm text-muted-foreground">{block.priceDisclaimer}</p>
          ) : null}

          <ul className="mt-6 space-y-2">
            {(block.contents || []).map((item, index) => {
              return (
                <li className="flex items-center gap-2" key={item.id || index}>
                  <CircleCheck className="size-4 text-primary" />
                  <span>{item.text}</span>
                </li>
              )
            })}
          </ul>

          <div className="mt-8 text-center">
            <HomepageLinkButton link={block.cta} />
          </div>
        </div>
      </div>
    </div>
  )
}
