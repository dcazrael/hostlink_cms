import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ImageFrame } from './ImageFrame'

const meta: Meta = {
  title: 'Components/ImageFrames',
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj

/**
 * Two image frames side-by-side, both using the hero-stripe variant.
 * One with a subtle background. Use to preview variant composition
 * and caption placement in a grid.
 *
 * @summary image frame pair using hero-stripe variant
 */
export const Default: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <ImageFrame
        variant="hero-stripe"
        src="/sample-photo.jpg"
        alt="Abstract hostlink workspace visual"
        caption="Operations visual"
      />
      <ImageFrame
        variant="hero-stripe"
        src="/sample-photo.jpg"
        alt="Abstract contact visual"
        caption="Contact visual"
        className="bg-(--subtle-background)"
      />
    </div>
  ),
}
