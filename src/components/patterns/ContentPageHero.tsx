import type { Media as MediaType } from '@/payload-types'
import * as React from 'react'
import { ImageFrame } from './ImageFrame'

/**
 * Full-bleed hero used at the top of an inner content page. Renders an
 * `ImageFrame` (hero-stripe variant) as a full-width background, then
 * overlays the title, a short divider rule, and a subtitle on top of
 * the mint wedge area.
 *
 * The text container is positioned absolutely over the ImageFrame using
 * viewBox-percentage coordinates (top 42.7%, left 0%, width 91.7%, bottom 0%).
 * Text uses white with a drop-shadow for legibility over the photo and
 * mint background.
 *
 * @summary full-bleed image hero with overlaid title and subtitle
 */
export const ContentPageHero: React.FC<{
  title: string
  subtitle: string
  media: MediaType
  className?: string
}> = ({ title, subtitle, media, className }) => (
  <section className={className}>
    <div className="relative">
      <ImageFrame variant="hero-stripe" media={media} className="w-full" />
      <div className="absolute flex flex-col gap-3 p-6 md:p-8 2xl:p-10 bottom-0">
        <h1
          className="whitespace-pre-line text-4xl font-bold text-white drop-shadow-lg md:text-5xl
        max-w-[20ch]"
        >
          {title}
        </h1>
        <div
          aria-hidden
          data-testid="content-page-hero-divider"
          className="h-1 rounded-xs w-36 bg-white drop-shadow"
        />
        <p className="text-base whitespace-pre-line text-white/90 drop-shadow md:text-lg max-w-[80ch]">
          {subtitle}
        </p>
      </div>
    </div>
  </section>
)

export default ContentPageHero
