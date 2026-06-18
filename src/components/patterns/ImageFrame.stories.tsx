import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ImageFrame } from './ImageFrame'
import type { Media as MediaType } from '@/payload-types'

const SAMPLE_SRC = '/sample-photo.jpg'
const SAMPLE_ALT = 'A sample photograph for the hostlink image frame'

const SAMPLE_MEDIA: MediaType = {
  id: 1,
  alt: 'Living room with beige sofas, kitchen in background, warm pendant lamp',
  url: SAMPLE_SRC,
  filename: 'sample-photo.jpg',
  mimeType: 'image/jpeg',
  filesize: 3936260,
  width: 7360,
  height: 4912,
  focalX: 60,
  focalY: 30,
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  sizes: {
    thumbnail: {
      url: '/sample-photo-300x200.jpg',
      width: 300,
      height: 200,
      mimeType: 'image/jpeg',
      filesize: 30000,
      filename: 'sample-photo-300x200.jpg',
    },
    large: {
      url: '/sample-photo-1400x933.jpg',
      width: 1400,
      height: 933,
      mimeType: 'image/jpeg',
      filesize: 200000,
      filename: 'sample-photo-1400x933.jpg',
    },
  },
}

const toObjectPosition = (x: number, y: number) => `${x}% ${y}%`

type ImageFrameStoryArgs = React.ComponentProps<typeof ImageFrame> & {
  objectPositionX: number
  objectPositionY: number
}

const meta: Meta<ImageFrameStoryArgs> = {
  title: 'Components/ImageFrame',
  component: ImageFrame,
  parameters: { layout: 'padded' },
  args: {
    src: SAMPLE_SRC,
    alt: SAMPLE_ALT,
    objectPositionX: 50,
    objectPositionY: 50,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['hero-stripe', 'stacked-bands', 'framed-overlay'],
    },
    navyOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    objectPositionX: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Horizontal focal point (%). 0 = left, 100 = right.',
    },
    objectPositionY: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Vertical focal point (%). 0 = top, 100 = bottom.',
    },
  },
  render: ({ objectPositionX, objectPositionY, ...rest }) => (
    <ImageFrame {...rest} objectPosition={toObjectPosition(objectPositionX, objectPositionY)} />
  ),
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
  args: {
    variant: 'hero-stripe',
    navyOpacity: 0.75,
    objectPositionX: 50,
    objectPositionY: 30,
  },
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

/**
 * Hero-stripe variant with a Payload Media object — uses the Media's
 * `focalX`/`focalY` as the photo's `objectPosition` and the `large` size
 * URL from `media.sizes`. The sample Media's size URLs 404 in the
 * browser, but the story still demonstrates the focal-point wiring.
 *
 * @summary hero-stripe with Payload Media focal point
 */
export const WithMediaFocalPoint: Story = {
  args: { variant: 'hero-stripe', media: SAMPLE_MEDIA },
}
