import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ImageFrame } from './ImageFrame'

const SAMPLE_SRC = '/sample-photo.jpg'
const SAMPLE_ALT = 'A sample photograph for the hostlink image frame'

const meta: Meta<typeof ImageFrame> = {
  title: 'Components/ImageFrame',
  component: ImageFrame,
  parameters: { layout: 'padded' },
  args: {
    src: SAMPLE_SRC,
    alt: SAMPLE_ALT,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['hero-stripe', 'stacked-bands', 'framed-overlay'],
    },
    navyOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    objectPosition: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof meta>

/**
 * Hero-stripe variant — small mint wedge in the upper-left, photo
 * filling the diagonal complement, navy diagonal stripe across the upper-right.
 * Uses the sample photo at `/sample-photo.jpg` (served from `public/`).
 *
 * @summary navy diagonal stripe with mint accent
 */
export const HeroStripe: Story = {
  args: { variant: 'hero-stripe' },
}

/**
 * Stacked-bands variant — mint wedge on top, photo extending downward,
 * navy diagonal stripe through the middle (semi-transparent).
 * Uses the sample photo at `/sample-photo.jpg` (served from `public/`).
 *
 * @summary mint top + navy stripe + photo
 */
export const StackedBands: Story = {
  args: { variant: 'stacked-bands' },
}

/**
 * Framed-overlay variant — tiny mint corner, photo covering almost the
 * full frame, semi-transparent navy overlay on top.
 * Uses the sample photo at `/sample-photo.jpg` (served from `public/`).
 *
 * @summary mint corner + navy overlay
 */
export const FramedOverlay: Story = {
  args: { variant: 'framed-overlay' },
}

/**
 * No-caption variant — confirms the figcaption is absent when not provided.
 *
 * @summary without figcaption
 */
export const NoCaption: Story = {
  args: { variant: 'hero-stripe', caption: undefined },
}

/**
 * Custom-opacity variant — overrides the variant's default navy opacity.
 * Demonstrates the `navyOpacity` prop.
 *
 * @summary with overridden navy opacity
 */
export const CustomOpacity: Story = {
  args: { variant: 'hero-stripe', navyOpacity: 0.25 },
}
