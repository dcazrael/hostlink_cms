import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PricingPlanCard } from '@/components/pricing/PricingPlanCard'

const realPlans = [
  {
    planName: '24時間電話対応プラン',
    planSub: '24時間電話対応をサポートします。',
    price: 3000,
    priceDisclaimer: '価格は税抜きです',
    stylePreset: 'style4' as const,
    contents: [
      { text: '24時間電話対応（近隣含む）' },
      { text: 'ゲストからの緊急電話対応' },
      { text: 'トラブル発生時の一次対応' },
      { text: '必要に応じたホスト様への連絡' },
    ],
    cta: {
      label: '見積り相談する',
      href: '/contact',
      variant: 'primary' as const,
      icon: 'arrowRight' as const,
    },
  },
  {
    planName: '電話+夜間プラン',
    planSub: '夜間の対応をお任せいただけます。',
    price: 13000,
    priceDisclaimer: '価格は税抜きです',
    stylePreset: 'style3' as const,
    contents: [
      { text: '21:00〜翌06:00' },
      { text: '24時間電話対応（近隣含む）' },
      { text: '滞在中トラブル一次対応' },
      { text: 'ホスト様へのエスカレーション' },
      { text: 'レビューサポート' },
      { text: '運営改善アドバイス' },
    ],
    cta: {
      label: '見積り相談する',
      href: '/contact',
      variant: 'primary' as const,
      icon: 'arrowRight' as const,
    },
  },
  {
    planName: '電話 + メッセージ\nフルサポートプラン',
    planSub: 'ゲスト対応をトータルでサポートします。',
    price: 18000,
    priceDisclaimer: '価格は税抜きです',
    recommended: true,
    stylePreset: 'style2' as const,
    contents: [
      { text: '24時間電話対応（近隣含む）' },
      { text: '24時間メッセージ返信' },
      { text: 'チェックインサポート' },
      { text: '滞在中トラブル一次対応' },
      { text: 'ホスト様へのエスカレーション' },
      { text: 'レビューサポート' },
      { text: '運営改善アドバイス' },
    ],
    cta: {
      label: '今すぐ無料で相談する',
      href: '/contact',
      variant: 'primary' as const,
      icon: 'arrowRight' as const,
    },
  },
]

const meta: Meta = {
  title: 'Compositions/PricingCards',
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj

/**
 * Real Japanese pricing plans using the same pricing-card system as the website.
 * Use this story to review the actual hierarchy, chip placement, spacing, and CTA treatment.
 *
 * @summary real website pricing plans using shared pricing card system
 */
export const RealPlans: Story = {
  render: () => (
    <div className="pricing-section">
      <div className="pricing-section__grid pricing-section__grid--multi">
        {realPlans.map((plan, index) => (
          <PricingPlanCard key={index} {...plan} />
        ))}
      </div>
    </div>
  ),
}
