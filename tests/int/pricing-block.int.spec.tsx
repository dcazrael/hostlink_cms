import * as React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { PricingComponentBlock } from '@/payload-types'
import { PricingBlockComponent } from '@/blocks/Pricing/Component'

afterEach(() => {
  cleanup()
})

const block: PricingComponentBlock = {
  blockType: 'pricing',
  plans: [
    {
      planName: '24時間電話対応プラン',
      planSub: '24時間電話対応をサポートします。',
      price: 3000,
      stylePreset: 'style4',
      contents: [{ text: '24時間電話対応（近隣含む）' }],
      cta: {
        label: '見積り相談する',
        variant: 'primary',
        icon: 'arrowRight',
        withIcon: true,
        type: 'external',
        url: '/contact',
      },
    },
  ],
}

describe('PricingBlockComponent CTA adapter', () => {
  it('renders the CTA from the homepageLink-shaped payload data', () => {
    const { container } = render(<PricingBlockComponent block={block} />)

    const cta = container.querySelector('.pricing-card__cta')
    expect(cta).not.toBeNull()
    expect(screen.getByText('見積り相談する')).toBeTruthy()
    expect(cta?.getAttribute('href')).toContain('/contact')
    expect(cta?.getAttribute('href')).toContain(
      'plan=24%E6%99%82%E9%96%93%E9%9B%BB%E8%A9%B1%E5%AF%BE%E5%BF%9C%E3%83%97%E3%83%A9%E3%83%B3',
    )
  })
})
