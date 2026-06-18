import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ImageFrame } from './ImageFrame'
import type { Media as MediaType } from '@/payload-types'

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
    variant: 'hero-stripe',
    objectPositionX: 50,
    objectPositionY: 50,
    zoom: 1,
    media: SAMPLE_MEDIA,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['hero-stripe', 'stacked-bands', 'framed-overlay'],
    },
    objectPositionX: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Horizontal focal point (%). 0 = left, 100 = right.',
    },
    objectPositionY: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Vertical focal point (%). 0 = top, 100 = bottom.',
    },
    zoom: {
      control: { type: 'range', min: 0.3, max: 1.5, step: 0.01 },
      description: 'Photo zoom factor. 1.0 = natural cover. > 1.0 zooms in around the focal point.',
    },
    navyOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    alt: { table: { disable: true } },
    src: { table: { disable: true } },
    media: { table: { disable: true } },
    size: { table: { disable: true } },
    className: { table: { disable: true } },
    caption: { table: { disable: true } },
    objectPosition: { table: { disable: true } },
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
 * Default story — switch variant, drag focal point sliders, set zoom.
 *
 * @summary switch variant, drag focal point sliders, set zoom
 */
export const Default: Story = {}
