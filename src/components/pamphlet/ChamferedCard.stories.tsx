import type { Meta, StoryObj } from '@storybook/react'
import { ChamferedCard } from './ChamferedCard'

const meta: Meta<typeof ChamferedCard> = {
  title: 'Pamphlet/Primitives/ChamferedCard',
  component: ChamferedCard,
  parameters: { layout: 'padded' },
  args: {
    tone: 'card',
    corner: 'top-right',
    depth: 12,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['card', 'subtle', 'background', 'navy', 'mint'],
    },
    corner: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
    },
    depth: { control: { type: 'range', min: 0, max: 30, step: 1 } },
  },
}

export default meta

type Story = StoryObj<typeof ChamferedCard>

export const LabelRow: Story = {
  name: 'Label + value row',
  args: { tone: 'card', corner: 'top-right', depth: 12 },
  render: (args) => (
    <ChamferedCard {...args}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Onboarding
        </span>
        <span className="font-mono text-xs text-muted-foreground">02 / 05</span>
      </div>
      <p className="mt-3 text-base font-semibold text-card-foreground">
        Hosted workspace · 24h setup
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        We provision your dedicated environment and walk your team through the first deploy in one
        business day.
      </p>
    </ChamferedCard>
  ),
}

export const AllCorners: Story = {
  name: 'All four corners',
  render: (args) => (
    <div className="grid gap-6 md:grid-cols-2">
      <ChamferedCard {...args} corner="top-right">
        <p className="text-sm">top-right</p>
      </ChamferedCard>
      <ChamferedCard {...args} corner="top-left">
        <p className="text-sm">top-left</p>
      </ChamferedCard>
      <ChamferedCard {...args} corner="bottom-right">
        <p className="text-sm">bottom-right</p>
      </ChamferedCard>
      <ChamferedCard {...args} corner="bottom-left">
        <p className="text-sm">bottom-left</p>
      </ChamferedCard>
    </div>
  ),
}
