import type { Meta, StoryObj } from '@storybook/react'
import { NumberBadge } from './NumberBadge'

const meta: Meta<typeof NumberBadge> = {
  title: 'Pamphlet/Primitives/NumberBadge',
  component: NumberBadge,
  parameters: { layout: 'padded' },
  args: {
    value: '01',
    tone: 'navy',
    shape: 'square',
    sizeClassName: 'size-8',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['navy', 'mint', 'card', 'subtle', 'border'],
    },
    shape: {
      control: 'inline-radio',
      options: ['square', 'chamfered', 'circle'],
    },
  },
}

export default meta

type Story = StoryObj<typeof NumberBadge>

export const StepRow: Story = {
  name: 'Step row',
  args: { value: '01' },
  render: (args) => (
    <div className="flex items-start gap-4">
      <NumberBadge {...args} />
      <div>
        <p className="text-sm font-semibold text-foreground">Discovery</p>
        <p className="text-sm text-muted-foreground">
          A 30-minute call to align on goals, timeline, and access.
        </p>
      </div>
    </div>
  ),
}

export const Sequence: Story = {
  name: 'Sequenced 01–05',
  render: (args) => (
    <div className="flex items-center gap-3">
      {['01', '02', '03', '04', '05'].map((n) => (
        <NumberBadge key={n} {...args} value={n} />
      ))}
    </div>
  ),
}

export const ShapeGallery: Story = {
  name: 'Shape gallery',
  render: (args) => (
    <div className="flex items-end gap-6">
      {(['square', 'chamfered', 'circle'] as const).map((shape) => (
        <div key={shape} className="flex flex-col items-center gap-2">
          <NumberBadge {...args} shape={shape} value="01" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {shape}
          </span>
        </div>
      ))}
    </div>
  ),
}
