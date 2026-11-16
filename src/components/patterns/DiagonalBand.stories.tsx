import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DiagonalBand } from './DiagonalBand'

const meta: Meta<typeof DiagonalBand> = {
  title: 'Patterns/DiagonalBand',
  component: DiagonalBand,
  parameters: { layout: 'padded' },
  args: {
    tone: 'navy',
    orientation: 'left',
    heightClassName: 'h-2',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['navy', 'mint', 'subtle', 'card', 'border'],
    },
    orientation: { control: 'inline-radio', options: ['left', 'right'] },
  },
}

export default meta

type Story = StoryObj<typeof DiagonalBand>

/**
 * Navy diagonal band at default thickness above a section eyebrow.
 * Use as a slim decorative accent above content blocks.
 *
 * @summary default navy decorative band
 */
export const Navy: Story = {
  name: 'Navy band · default thickness',
  render: (args) => (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Section eyebrow
      </p>
      <DiagonalBand {...args} />
      <p className="pt-2 text-sm text-muted-foreground">Thin utility bar above a content block.</p>
    </div>
  ),
}

/**
 * Mint diagonal band with right orientation and aria-label.
 * Use as an accent stroke in mint tone with a known direction.
 *
 * @summary mint right-oriented band with label
 */
export const Mint: Story = {
  name: 'Mint band · right orientation',
  args: { tone: 'mint', orientation: 'right' },
  render: (args) => <DiagonalBand {...args} ariaLabel="Section accent" />,
}

/**
 * Diagonal band containing child text (an aria-announced label).
 * Use when the band doubles as a decorative section divider and label holder.
 *
 * @summary band with announced child label
 */
export const LabelStrip: Story = {
  name: 'With children · announced label',
  args: { tone: 'navy', orientation: 'left' },
  render: (args) => <DiagonalBand {...args}>Operations</DiagonalBand>,
}

/**
 * All five tones (navy, mint, subtle, card, border) shown in a vertical stack.
 * Use to compare tone options before choosing one for a section.
 *
 * @summary tone comparison gallery
 */
export const LabelStripAllTones: Story = {
  name: 'Label strip · all tones',
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(['navy', 'mint', 'subtle', 'card', 'border'] as const).map((tone) => (
        <DiagonalBand key={tone} {...args} tone={tone}>
          {tone}
        </DiagonalBand>
      ))}
    </div>
  ),
}
