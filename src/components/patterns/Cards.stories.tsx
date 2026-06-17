import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Card } from './Patterns'

const chamferArgTypes = {
  corner: {
    control: 'select',
    options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
  },
  chamferDepth: { control: { type: 'range', min: 0, max: 24, step: 1 } },
  chamferX: { control: { type: 'range', min: 0, max: 24, step: 1 } },
  chamferY: { control: { type: 'range', min: 0, max: 24, step: 1 } },
  hasOppositeCorner: { control: 'boolean' },
  oppositeChamferDepth: {
    control: { type: 'range', min: 0, max: 24, step: 1 },
  },
  oppositeChamferX: { control: { type: 'range', min: 0, max: 24, step: 1 } },
  oppositeChamferY: { control: { type: 'range', min: 0, max: 24, step: 1 } },
}

const meta: Meta = {
  title: 'Components/Cards',
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj

/**
 * Three-column layout showing Card in three tones (default, mint, navy).
 * Use to preview how Cards look as a grid with varied eyebrow and title content.
 *
 * @summary three-card grid in default, mint, navy tones
 */
export const Default: Story = {
  args: {
    corner: 'top-right',
    chamferDepth: 6,
    chamferX: 0,
    chamferY: 0,
    hasOppositeCorner: false,
    oppositeChamferDepth: 0,
    oppositeChamferX: 3,
    oppositeChamferY: 3,
  },
  argTypes: chamferArgTypes,
  render: (args) => (
    <div className="grid gap-6 md:grid-cols-3">
      <Card eyebrow="Hosting" title="Managed infrastructure" {...args}>
        Production hosting, CMS maintenance, and deploy support in one predictable workflow.
      </Card>
      <Card eyebrow="Support" title="Human handoff" tone="mint" {...args}>
        A direct support path for launch questions, content updates, and operational changes.
      </Card>
      <Card eyebrow="SLA" title="Priority response" tone="navy" {...args}>
        Critical issues get a clear escalation path and bilingual status updates.
      </Card>
    </div>
  ),
}

/**
 * Four cards showing each chamfer corner (top-right, top-left, bottom-right, bottom-left).
 * Use to compare corner placement before choosing one for a design.
 *
 * @summary chamfer corner comparison grid
 */
export const AllCorners: Story = {
  argTypes: chamferArgTypes,
  render: (args) => (
    <div className="grid gap-6 md:grid-cols-2">
      <Card {...args} title="top-right" corner="top-right">
        <p className="text-sm">top-right</p>
      </Card>
      <Card {...args} title="top-left" corner="top-left">
        <p className="text-sm">top-left</p>
      </Card>
      <Card {...args} title="bottom-right" corner="bottom-right">
        <p className="text-sm">bottom-right</p>
      </Card>
      <Card {...args} title="bottom-left" corner="bottom-left">
        <p className="text-sm">bottom-left</p>
      </Card>
    </div>
  ),
}

/**
 * Chamfer rendered via CSS clip-path with narrow and wide containers.
 * Demonstrates that the chamfer depth is independent of card width.
 *
 * @summary CSS clip-path across varying widths
 */
export const CSSClipPath: Story = {
  args: {
    corner: 'top-right',
    chamferDepth: 4,
    hasOppositeCorner: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Chamfer rendered via CSS `clip-path` on `::after` — no ResizeObserver needed.',
      },
    },
  },
  render: (args) => (
    <div className="flex flex-wrap gap-6">
      <Card eyebrow="Width" title="Narrow" {...args} className="w-48">
        Chamfer depth is 1rem regardless of width.
      </Card>
      <Card eyebrow="Width" title="Wide" {...args} className="w-96">
        Same 1rem chamfer on a wider card.
      </Card>
    </div>
  ),
}
