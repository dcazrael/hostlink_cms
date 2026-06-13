import type { Meta, StoryObj } from '@storybook/react'
import { ShapeMask } from './ShapeMask'

const meta: Meta<typeof ShapeMask> = {
  title: 'Patterns/ShapeMask',
  component: ShapeMask,
  parameters: { layout: 'padded' },
  args: {
    tone: 'navy',
    direction: 'top-left',
    depth: 12,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['navy', 'mint', 'subtle', 'card', 'background'],
    },
    direction: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    },
    depth: { control: { type: 'range', min: 0, max: 40, step: 1 } },
  },
}

export default meta

type Story = StoryObj<typeof ShapeMask>

export const NavyTopLeft: Story = {
  name: 'Navy · top-left cut',
  args: {
    tone: 'navy',
    direction: 'top-left',
    depth: 14,
  },
  render: (args) => (
    <ShapeMask {...args}>
      <p className="font-mono text-xs uppercase tracking-widest">Hero</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">Diagonal split, deep navy.</h2>
      <p className="mt-3 max-w-md text-sm opacity-90">
        Use the top-left cut to anchor a hero panel. The cut is built from CSS{' '}
        <code>clip-path</code>, so the underlying element stays a normal block for layout.
      </p>
    </ShapeMask>
  ),
}

export const AllDirections: Story = {
  name: 'All four directions',
  render: (args) => (
    <div className="grid gap-6 md:grid-cols-2">
      <ShapeMask {...args} tone="navy" direction="top-left" depth={14}>
        <p className="text-sm opacity-90">top-left</p>
      </ShapeMask>
      <ShapeMask {...args} tone="mint" direction="top-right" depth={14}>
        <p className="text-sm">top-right</p>
      </ShapeMask>
      <ShapeMask {...args} tone="subtle" direction="bottom-left" depth={14}>
        <p className="text-sm">bottom-left</p>
      </ShapeMask>
      <ShapeMask {...args} tone="card" direction="bottom-right" depth={14}>
        <p className="text-sm">bottom-right</p>
      </ShapeMask>
    </div>
  ),
}
