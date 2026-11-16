import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NumberBadge } from './NumberBadge'

const meta: Meta<typeof NumberBadge> = {
  title: 'Atoms/NumberBadge',
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

/**
 * NumberBadge placed inline with a step heading and description.
 * Use this layout when numbering steps in a vertical process list.
 *
 * @summary inline badge with step heading
 */
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

/**
 * A horizontal row of sequential badges from 01 to 05.
 * Use to preview all badges at once in a stepper or numbered list.
 *
 * @summary sequenced badge row 01–05
 */
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

/**
 * All available badge shapes (square, chamfered, circle) compared side-by-side.
 * Use to choose the right shape for your layout context.
 *
 * @summary shape comparison gallery
 */
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
