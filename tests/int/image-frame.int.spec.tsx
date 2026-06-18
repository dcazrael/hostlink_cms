import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { ImageFrame } from '@/components/patterns/ImageFrame'
import type { Media as MediaType } from '@/payload-types'

const SAMPLE_SRC = '/sample-photo.jpg'
const SAMPLE_ALT = 'A sample photograph'

const SAMPLE_MEDIA: MediaType = {
  id: 1,
  alt: 'A media object with focal point',
  url: '/media/original.jpg',
  width: 4000,
  height: 3000,
  focalX: 25,
  focalY: 75,
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  sizes: {
    small: {
      url: '/media/small.jpg',
      width: 600,
      height: 450,
      mimeType: 'image/jpeg',
      filesize: 50000,
      filename: 'small.jpg',
    },
    large: {
      url: '/media/large.jpg',
      width: 1400,
      height: 1050,
      mimeType: 'image/jpeg',
      filesize: 200000,
      filename: 'large.jpg',
    },
  },
}

describe('ImageFrame component contract', () => {
  it('renders a figure with the configured src and alt', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    )
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toBe(SAMPLE_SRC)
    expect(img?.getAttribute('alt')).toBe(SAMPLE_ALT)
  })

  it('wraps the photo in a figure with the configured aspect ratio', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    )
    const figure = container.querySelector('figure')
    expect(figure).not.toBeNull()
    // hero-stripe uses viewBox 736.7 × 1022.4 — aspect ratio is set inline
    expect(figure?.className).toMatch(/relative/)
    expect(figure?.className).toMatch(/overflow-hidden/)
    const style = figure?.getAttribute('style') || ''
    expect(style).toMatch(/aspect-ratio/i)
    expect(style).toContain('736.7')
    expect(style).toContain('1022.4')
  })

  it("uses each variant's own viewBox aspect ratio", () => {
    const { container: c1 } = render(
      <ImageFrame variant="stacked-bands" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    )
    const f1 = c1.querySelector('figure')
    expect(f1?.getAttribute('style')).toContain('623.6')
    expect(f1?.getAttribute('style')).toContain('827.7')

    const { container: c2 } = render(
      <ImageFrame variant="framed-overlay" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    )
    const f2 = c2.querySelector('figure')
    expect(f2?.getAttribute('style')).toContain('453.5')
    expect(f2?.getAttribute('style')).toContain('328.8')
  })

  it('renders decorative mint and navy SVG layers with aria-hidden', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    )
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBe(2) // mint + navy
    svgs.forEach((svg) => {
      expect(svg.getAttribute('aria-hidden')).toBe('true')
    })
  })

  it('applies a CSS clip-path to the photo img', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    )
    const img = container.querySelector('img')
    const style = img?.getAttribute('style') || ''
    expect(style).toContain('clip-path')
    expect(style).toContain('polygon')
  })

  it('sets object-position on the photo from the objectPosition prop', () => {
    const { container } = render(
      <ImageFrame
        variant="hero-stripe"
        src={SAMPLE_SRC}
        alt={SAMPLE_ALT}
        objectPosition="70% 30%"
      />,
    )
    const img = container.querySelector('img')
    expect(img?.style.objectPosition).toBe('70% 30%')
  })

  it('defaults object-position to "50% 50%" when not provided', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    )
    const img = container.querySelector('img')
    expect(img?.style.objectPosition).toBe('50% 50%')
  })

  it('uses the variant default objectPosition when no prop is provided', () => {
    // hero-stripe default
    const { container: c1 } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    )
    expect(c1.querySelector('img')?.style.objectPosition).toBe('50% 50%')
  })

  it("uses each variant's own default objectPosition when no prop is provided", () => {
    const variants = ['hero-stripe', 'stacked-bands', 'framed-overlay'] as const
    variants.forEach((variant) => {
      const { container } = render(
        <ImageFrame variant={variant} src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
      )
      expect(container.querySelector('img')?.style.objectPosition).toBe('50% 50%')
    })
  })

  it('applies the navy overlay opacity from the variant default', () => {
    const { container } = render(
      <ImageFrame variant="stacked-bands" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    )
    const navySvg = container.querySelectorAll('svg')[1]
    const navyPath = navySvg?.querySelector('path')
    // stacked-bands default navyOpacity is 0.5 (was 0.6 in earlier plan revisions)
    expect(navyPath?.getAttribute('fill-opacity')).toBe('0.5')
  })

  it('overrides the navy overlay opacity when navyOpacity prop is provided', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} navyOpacity={0.3} />,
    )
    const navySvg = container.querySelectorAll('svg')[1]
    const navyPath = navySvg?.querySelector('path')
    expect(navyPath?.getAttribute('fill-opacity')).toBe('0.3')
  })

  it('renders a figcaption when caption prop is provided', () => {
    const { container } = render(
      <ImageFrame
        variant="hero-stripe"
        src={SAMPLE_SRC}
        alt={SAMPLE_ALT}
        caption="Operations visual"
      />,
    )
    const figcaption = container.querySelector('figcaption')
    expect(figcaption).not.toBeNull()
    expect(figcaption?.textContent).toBe('Operations visual')
  })

  it('omits figcaption when caption prop is absent', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    )
    expect(container.querySelector('figcaption')).toBeNull()
  })

  it('forwards className to the figure element', () => {
    const { container } = render(
      <ImageFrame
        variant="hero-stripe"
        src={SAMPLE_SRC}
        alt={SAMPLE_ALT}
        className="custom-class"
      />,
    )
    const figure = container.querySelector('figure')
    expect(figure?.className).toContain('custom-class')
  })

  it('uses object-fit: none so objectPosition works in both axes', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    )
    const img = container.querySelector('img')
    // Tailwind v4's `object-none` class sets `object-fit: none`.
    // With `object-fit: cover`, the Y axis of object-position is invisible
    // when the photo is wider than the box (only X axis overflows).
    expect(img?.className).toContain('object-none')
    expect(img?.className).not.toContain('object-cover')
  })
})

describe('ImageFrame with Payload Media', () => {
  it('uses the Media url as the photo src when media is an object', () => {
    const { container } = render(<ImageFrame variant="hero-stripe" media={SAMPLE_MEDIA} />)
    // No size prop → defaults to 'large' → uses sizes.large.url
    const img = container.querySelector('img')
    expect(img?.getAttribute('src')).toBe('/media/large.jpg')
  })

  it('selects the correct size URL based on the size prop', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" media={SAMPLE_MEDIA} size="small" />,
    )
    const img = container.querySelector('img')
    expect(img?.getAttribute('src')).toBe('/media/small.jpg')
  })

  it('falls back to media.url when the chosen size is not available', () => {
    const mediaWithoutSmall: MediaType = {
      ...SAMPLE_MEDIA,
      sizes: { large: SAMPLE_MEDIA.sizes!.large! },
    }
    const { container } = render(
      <ImageFrame variant="hero-stripe" media={mediaWithoutSmall} size="small" />,
    )
    const img = container.querySelector('img')
    // small is not in sizes, so falls back to media.url
    expect(img?.getAttribute('src')).toBe('/media/original.jpg')
  })

  it('applies the Media focal point as objectPosition', () => {
    const { container } = render(<ImageFrame variant="hero-stripe" media={SAMPLE_MEDIA} />)
    const img = container.querySelector('img')
    // focalX: 25, focalY: 75 → '25% 75%'
    expect(img?.style.objectPosition).toBe('25% 75%')
  })

  it('uses explicit objectPosition prop over Media focal point', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" media={SAMPLE_MEDIA} objectPosition="50% 50%" />,
    )
    const img = container.querySelector('img')
    expect(img?.style.objectPosition).toBe('50% 50%')
  })

  it('falls back to media.alt when no alt prop is provided', () => {
    const { container } = render(<ImageFrame variant="hero-stripe" media={SAMPLE_MEDIA} />)
    const img = container.querySelector('img')
    expect(img?.getAttribute('alt')).toBe('A media object with focal point')
  })

  it('uses the explicit alt prop over media.alt', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" media={SAMPLE_MEDIA} alt="Custom alt text" />,
    )
    const img = container.querySelector('img')
    expect(img?.getAttribute('alt')).toBe('Custom alt text')
  })

  it('falls back to src when media is null', () => {
    const { container } = render(<ImageFrame variant="hero-stripe" media={null} src={SAMPLE_SRC} />)
    const img = container.querySelector('img')
    expect(img?.getAttribute('src')).toBe(SAMPLE_SRC)
  })

  it('uses the string media as src directly when media is a string', () => {
    const { container } = render(<ImageFrame variant="hero-stripe" media="/string-url.jpg" />)
    const img = container.querySelector('img')
    expect(img?.getAttribute('src')).toBe('/string-url.jpg')
  })

  it('uses the variant default objectPosition when no Media focal point and no prop', () => {
    const mediaNoFocal: MediaType = {
      ...SAMPLE_MEDIA,
      focalX: null,
      focalY: null,
    }
    const { container } = render(<ImageFrame variant="hero-stripe" media={mediaNoFocal} />)
    const img = container.querySelector('img')
    // hero-stripe variant default is '50% 50%'
    expect(img?.style.objectPosition).toBe('50% 50%')
  })
})
