import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { VerticalAccent } from './VerticalAccent'

const meta: Meta<typeof VerticalAccent> = {
  title: 'Patterns/VerticalAccent',
  component: VerticalAccent,
  parameters: { layout: 'padded' },
  args: {
    tone: 'mint',
    widthClassName: 'w-1',
    heightClassName: 'h-16',
    skew: true,
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['mint', 'navy', 'border', 'muted'],
    },
  },
}

export default meta

type Story = StoryObj<typeof VerticalAccent>

/**
 * Mint skewed vertical accent alongside a pull-quote layout.
 * Use to add a decorative vertical stroke beside quoted text or sidebar content.
 *
 * @summary mint skewed accent with pull-quote
 */
export const MintSkew: Story = {
  name: 'Mint · skewed',
  render: (args) => (
    <div className="flex items-stretch gap-6">
      <VerticalAccent {...args} />
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Pull-quote
        </p>
        <p className="mt-2 max-w-md text-base italic text-foreground">
          "We were able to ship the rebuilt storefront in two weeks — half the time our previous
          agency estimated."
        </p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          — Operations lead, retail client
        </p>
      </div>
    </div>
  ),
}

/**
 * All four tones (mint, navy, border, muted) shown in a grid.
 * Use to compare tone options for the vertical accent bar.
 *
 * @summary tone comparison gallery
 */
export const ToneGallery: Story = {
  name: 'Tone gallery',
  render: (args) => (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {(['mint', 'navy', 'border', 'muted'] as const).map((tone) => (
        <div key={tone} className="flex flex-col items-start gap-3">
          <VerticalAccent {...args} tone={tone} />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {tone}
          </span>
        </div>
      ))}
    </div>
  ),
}
