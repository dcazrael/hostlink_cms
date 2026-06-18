import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ImageFrame } from './ImageFrame'
import { LandingPageHero, type LandingPageHeroVariant } from './LandingPageHero'
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

const defaultArgs = {
  variant: 'image' as LandingPageHeroVariant,
  eyebrow: 'プロフェッショナルなゲスト対応代行',
  title: '緊急電話対応（近隣含む）\n24時間メッセージ対応',
  description:
    'HostLinkは、民泊オーナー様に代わってゲストおよび近隣住民の対応を行うサポートサービスです。\n豊富な運営経験を活かし、メッセージ対応から緊急時の電話対応までサポートすることで、オーナー様の負担を軽減します。',
  features: [{ title: 'AIではない、人による丁寧な対応' }, { title: '最短5分以内の返信率を維持' }],
  primaryCta: { label: '今すぐ無料で相談する', href: '#contact' },
  secondaryCta: { label: 'LINEでのお問い合わせ', href: '#line' },
}

const meta: Meta<typeof LandingPageHero> = {
  title: 'Components/LandingPageHero',
  component: LandingPageHero,
  parameters: { layout: 'fullscreen' },
  args: {
    ...defaultArgs,
    slot: <ImageFrame variant="hero-stripe" media={SAMPLE_MEDIA} />,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['image', 'component'],
    },
    primaryCta: { control: 'object' },
    secondaryCta: { control: 'object' },
    features: { table: { disable: true } },
    featureShape: { table: { disable: true } },
    slot: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: ({ primaryCta, secondaryCta, ...rest }) => {
    const slot =
      rest.variant === 'image' ? (
        <ImageFrame variant="hero-stripe" media={SAMPLE_MEDIA} />
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center border border-dashed border-border bg-card text-sm text-muted-foreground">
          Component slot
        </div>
      )
    return (
      <LandingPageHero
        {...rest}
        slot={slot}
        primaryCta={primaryCta ?? defaultArgs.primaryCta}
        secondaryCta={secondaryCta ?? defaultArgs.secondaryCta}
      />
    )
  },
}

export default meta

type Story = StoryObj<typeof meta>

/**
 * Default story — switch between the `image` and `component` slot
 * variants and edit the eyebrow, title, description, and CTA labels.
 *
 * @summary landing page hero with switchable slot variant
 */
export const Default: Story = {}
