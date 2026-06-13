import type { Meta, StoryObj } from '@storybook/react'
import { SectionShape } from './Patterns'

const meta: Meta<typeof SectionShape> = {
  title: 'Patterns/SectionShapes',
  component: SectionShape,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['diagonal-bands', 'stepped-field', 'half-field', 'corner-mask'],
    },
  },
  args: {
    variant: 'diagonal-bands',
  },
}

export default meta

type Story = StoryObj<typeof SectionShape>

export const Controls: Story = {
  name: 'Variant controls',
}

export const PamphletSet: Story = {
  name: 'Pamphlet reference set',
  render: () => (
    <div className="grid max-w-5xl gap-6 md:grid-cols-3">
      <SectionShape variant="diagonal-bands" />
      <SectionShape variant="stepped-field" />
      <SectionShape variant="half-field" />
    </div>
  ),
}
