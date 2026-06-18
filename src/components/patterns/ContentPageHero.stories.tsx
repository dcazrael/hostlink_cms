import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ContentPageHero } from './ContentPageHero'
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
    large: {
      url: '/media/loft-luxury-living-room-with-bookshelf-1-1400x788.jpg',
      width: 1400,
      height: 788,
      mimeType: 'image/jpeg',
      filesize: 198818,
      filename: 'loft-luxury-living-room-with-bookshelf-1-1400x788.jpg',
    },
  },
}

const meta: Meta<typeof ContentPageHero> = {
  title: 'Compositions/Heroes/ContentPageHero',
  component: ContentPageHero,
  parameters: { layout: 'fullscreen' },
  args: {
    title: '宿泊施設向け\n24時間ゲストサポート',
    subtitle: '夜間対応・メッセージ対応・電話対応を代行し、宿泊運営の負担を軽減します。',
    media: SAMPLE_MEDIA,
  },
  argTypes: {
    media: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <div className="mx-auto max-w-2xl">
      <ContentPageHero {...args} />
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

/**
 * Default story — full-bleed hero with overlaid title, divider, and
 * subtitle. Edit the title and subtitle text to preview the layout.
 *
 * @summary full-bleed image hero with overlaid title and subtitle
 */
export const Default: Story = {}
