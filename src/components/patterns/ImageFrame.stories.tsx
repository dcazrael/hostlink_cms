import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ImageFrame } from './ImageFrame'
import type { Media as MediaType } from '@/payload-types'

const SAMPLE_SRC = '/sample-photo.jpg'
const SAMPLE_ALT = 'A sample photograph for the hostlink image frame'

const SAMPLE_MEDIA: MediaType = {
  id: 1,
  alt: 'Loft-style luxury living room with built-in bookshelf and modern seating',
  url: '/media/loft-luxury-living-room-with-bookshelf-1.jpg',
  filename: 'loft-luxury-living-room-with-bookshelf-1.jpg',
  mimeType: 'image/jpeg',
  filesize: 647199,
  width: 2560,
  height: 1440,
  focalX: 50,
  focalY: 50,
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  sizes: {
    thumbnail: {
      url: '/media/loft-luxury-living-room-with-bookshelf-1-300x169.jpg',
      width: 300,
      height: 169,
      mimeType: 'image/jpeg',
      filesize: 13561,
      filename: 'loft-luxury-living-room-with-bookshelf-1-300x169.jpg',
    },
    square: {
      url: '/media/loft-luxury-living-room-with-bookshelf-1-500x500.jpg',
      width: 500,
      height: 500,
      mimeType: 'image/jpeg',
      filesize: 48749,
      filename: 'loft-luxury-living-room-with-bookshelf-1-500x500.jpg',
    },
    small: {
      url: '/media/loft-luxury-living-room-with-bookshelf-1-600x338.jpg',
      width: 600,
      height: 338,
      mimeType: 'image/jpeg',
      filesize: 43750,
      filename: 'loft-luxury-living-room-with-bookshelf-1-600x338.jpg',
    },
    medium: {
      url: '/media/loft-luxury-living-room-with-bookshelf-1-900x506.jpg',
      width: 900,
      height: 506,
      mimeType: 'image/jpeg',
      filesize: 89165,
      filename: 'loft-luxury-living-room-with-bookshelf-1-900x506.jpg',
    },
    large: {
      url: '/media/loft-luxury-living-room-with-bookshelf-1-1400x788.jpg',
      width: 1400,
      height: 788,
      mimeType: 'image/jpeg',
      filesize: 198818,
      filename: 'loft-luxury-living-room-with-bookshelf-1-1400x788.jpg',
    },
    xlarge: {
      url: '/media/loft-luxury-living-room-with-bookshelf-1-1920x1080.jpg',
      width: 1920,
      height: 1080,
      mimeType: 'image/jpeg',
      filesize: 364177,
      filename: 'loft-luxury-living-room-with-bookshelf-1-1920x1080.jpg',
    },
    og: {
      url: '/media/loft-luxury-living-room-with-bookshelf-1-1200x630.jpg',
      width: 1200,
      height: 630,
      mimeType: 'image/jpeg',
      filesize: 141607,
      filename: 'loft-luxury-living-room-with-bookshelf-1-1200x630.jpg',
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
    zoom: 1,
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
    zoom: {
      control: { type: 'range', min: 0.5, max: 3, step: 0.1 },
      description: 'Photo zoom factor. 1.0 = natural cover. > 1.0 zooms in around the focal point.',
    },
  },
  render: ({ objectPositionX, objectPositionY, zoom, ...rest }) => (
    <div className="mx-auto max-w-2xl">
      <ImageFrame
        {...rest}
        objectPosition={toObjectPosition(objectPositionX, objectPositionY)}
        zoom={zoom}
      />
    </div>
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
    objectPositionX: 39,
    objectPositionY: 70,
    src: '/loft-luxury-living-room-with-bookshelf-1',
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
 * URL from `media.sizes`. The sample Media points at a real
 * PayloadCMS-generated image under `public/media/`, so the story
 * renders the actual photo in the browser.
 *
 * @summary hero-stripe with Payload Media focal point
 */
export const WithMediaFocalPoint: Story = {
  args: { variant: 'hero-stripe', media: SAMPLE_MEDIA },
}

/**
 * Hero-stripe variant with a higher zoom — demonstrates the `zoom` prop
 * scaling the image around the focal point. Use the X/Y range sliders
 * and the Zoom slider to compose the photo.
 *
 * @summary hero-stripe with zoom applied
 */
export const ZoomedIn: Story = {
  args: { variant: 'hero-stripe', zoom: 1.5 },
}
