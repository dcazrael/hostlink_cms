import * as React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { PricingPlanCard } from '@/components/pricing/PricingPlanCard'

afterEach(() => {
  cleanup()
})

const basePlan = {
  planName: '24時間電話対応プラン',
  planSub: '24時間電話対応をサポートします。',
  price: 3000,
  priceDisclaimer: '価格は税抜きです',
  stylePreset: 'style4' as const,
  contents: [
    { id: '1', text: '24時間電話対応（近隣含む）' },
    { id: '2', text: 'ゲストからの緊急電話対応' },
    { id: '3', text: 'トラブル発生時の一次対応' },
  ],
  cta: {
    label: '見積り相談する',
    href: '/contact',
    variant: 'primary' as const,
    icon: 'arrowRight' as const,
    withIcon: true,
  },
}

describe('PricingPlanCard', () => {
  it('renders the real pricing-card shell classes from globals.css', () => {
    const { container } = render(<PricingPlanCard {...basePlan} />)

    const card = container.querySelector('.pricing-card')
    const surface = container.querySelector('.pricing-card__surface')

    expect(card).not.toBeNull()
    expect(surface).not.toBeNull()
  })

  it('renders title, subtitle, includes, and formatted monthly yen price', () => {
    render(<PricingPlanCard {...basePlan} />)

    expect(screen.getByText('24時間電話対応プラン')).toBeTruthy()
    expect(screen.getByText('24時間電話対応をサポートします。')).toBeTruthy()
    expect(screen.getByText('Includes')).toBeTruthy()
    expect(screen.getByText('￥3,000')).toBeTruthy()
    expect(screen.getByText('/月')).toBeTruthy()
  })

  it('renders the recommended chip inside the pricing-card header when recommended', () => {
    const { container } = render(<PricingPlanCard {...basePlan} recommended />)

    const chip = container.querySelector('.pricing-card__chip')
    expect(chip).not.toBeNull()
    expect(screen.getByText('Popular')).toBeTruthy()
  })

  it('applies the style preset class to the root card', () => {
    const { container } = render(<PricingPlanCard {...basePlan} stylePreset="style4" />)

    const card = container.querySelector('.pricing-card')
    expect(card?.className).toContain('pricing-card--style4')
  })

  it('renders the CTA using the pricing-card CTA classes', () => {
    const { container } = render(<PricingPlanCard {...basePlan} />)

    const cta = container.querySelector('.pricing-card__cta')
    expect(cta).not.toBeNull()
    expect(screen.getByText('見積り相談する')).toBeTruthy()
  })

  it('renders tooltip content when an item has a tooltip', () => {
    render(
      <PricingPlanCard
        {...basePlan}
        contents={[
          {
            id: '1',
            text: 'レビューサポート',
            tooltip: '返信テンプレートも含みます。',
          },
        ]}
      />,
    )

    expect(screen.getByText('レビューサポート')).toBeTruthy()
    expect(screen.getByText('返信テンプレートも含みます。')).toBeTruthy()
  })
})
