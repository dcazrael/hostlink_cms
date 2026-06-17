import type { Meta, StoryObj } from '@storybook/nextjs-vite'
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

/**
 * Interactive variant controls — use the Controls panel to switch
 * between diagonal-bands, stepped-field, half-field, and corner-mask shapes.
 *
 * @summary interactive variant selector
 */
export const Controls: Story = {
  name: 'Variant controls',
}

/**
 * All four section shapes displayed together with a three-column grid.
 * Use as a reference set when choosing a shape for a pamphlet section.
 *
 * @summary all variants reference grid
 */
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
