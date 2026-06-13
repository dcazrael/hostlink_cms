import type { Meta, StoryObj } from '@storybook/react'
import { PricingCard } from './Patterns'

const meta: Meta = {
  title: 'Compositions/PricingCards',
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj

const features = [
  'Dedicated production workspace',
  'Managed Payload and Next.js deploys',
  'Bilingual support window',
]

export const MultiTone: Story = {
  name: 'Multi-tone',
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      <PricingCard
        name="Lime"
        price="¥80k"
        tone="lime"
        description="Lime base — default CTA hue."
        features={features}
      />
      <PricingCard
        name="Sora"
        price="¥120k"
        tone="sora"
        description="Blue-cool variant for alternate plans."
        features={features}
      />
      <PricingCard
        name="Amber"
        price="¥140k"
        tone="amber"
        description="Warm amber for mid-tier positioning."
        features={features}
      />
      <PricingCard
        name="Rose"
        price="¥180k"
        tone="rose"
        description="Rose accent for premium positioning."
        features={features}
      />
      <PricingCard
        featured
        name="Purple"
        price="Custom"
        tone="purple"
        description="Purple variant for featured plans."
        features={features}
      />
    </div>
  ),
}
