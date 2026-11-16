import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
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
    // hero-stripe uses viewBox 1043.2 × 632.2 — aspect ratio is set inline
    expect(figure?.className).toMatch(/relative/)
    expect(figure?.className).toMatch(/overflow-hidden/)
    const style = figure?.getAttribute('style') || ''
    expect(style).toMatch(/aspect-ratio/i)
    expect(style).toContain('1043.2')
    expect(style).toContain('632.2')
  })

  it("uses each variant's own viewBox aspect ratio", () => {
    const { container: c1 } = render(
      <ImageFrame variant="stacked-bands" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    )
    const f1 = c1.querySelector('figure')
    expect(f1?.getAttribute('style')).toContain('1122.5')
    expect(f1?.getAttribute('style')).toContain('631.4')

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

  it('applies a CSS clip-path to the photo wrapper', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    )
    // The clip-path lives on a wrapper div, not the img — this keeps
    // the variant geometry stable while the img's transform: scale()
    // handles zoom around the focal point.
    const wrapper = container.querySelector('div[style*="clip-path"]')
    expect(wrapper).not.toBeNull()
    const style = wrapper?.getAttribute('style') || ''
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

  it('renders the inner image as absolutely positioned with explicit sizing', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    )
    const img = container.querySelector('img')
    // The image is absolutely positioned and sized via inline style, not
    // via object-fit: cover. The wrapper's clip-path + overflow:hidden
    // crop the result. No transform is used (transform would scale the
    // clip-path and distort the variant geometry).
    expect(img?.className).toContain('absolute')
    expect(img?.className).not.toContain('object-cover')
  })

  it('sizes the image to its natural dimensions times zoom (when Media is provided)', () => {
    // Use a Media object so we know the natural size.
    const { container } = render(
      <ImageFrame variant="hero-stripe" media={SAMPLE_MEDIA} zoom={1.5} />,
    )
    const img = container.querySelector('img')
    // SAMPLE_MEDIA.large has width 1400, height 1050
    expect(img?.style.width).toBe('2100px') // 1400 * 1.5
    expect(img?.style.height).toBe('1575px') // 1050 * 1.5
  })

  it('centers the focal point at 50%/50% with default zoom', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" media={SAMPLE_MEDIA} objectPosition="50% 50%" />,
    )
    const img = container.querySelector('img')
    // 1400 wide × 0.5 = 700, 1050 tall × 0.5 = 525; focal 50%/50%
    expect(img?.style.left).toBe('calc(50% - 700px)')
    expect(img?.style.top).toBe('calc(50% - 525px)')
  })

  it('offsets the focal point when objectPosition is set', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" media={SAMPLE_MEDIA} objectPosition="70% 30%" />,
    )
    const img = container.querySelector('img')
    // 1400 * 0.7 = 980 (focal X)
    // 1050 * 0.3 = 315 (focal Y)
    expect(img?.style.left).toBe('calc(50% - 980px)')
    expect(img?.style.top).toBe('calc(50% - 315px)')
  })

  it('falls back to 100%/100% when natural size is unknown', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} zoom={2} />,
    )
    const img = container.querySelector('img')
    // No Media → no natural size → falls back to inset:0 + 100%
    expect(img?.style.width).toBe('100%')
    expect(img?.style.height).toBe('100%')
    expect(img?.style.inset).toBe('0px')
  })

  it('clamps zoom to the [0.3, 1.5] range', () => {
    const { container: c1 } = render(
      <ImageFrame variant="hero-stripe" media={SAMPLE_MEDIA} zoom={10} />,
    )
    expect(c1.querySelector('img')?.style.width).toBe('2100px') // 1400 * 1.5

    const { container: c2 } = render(
      <ImageFrame variant="hero-stripe" media={SAMPLE_MEDIA} zoom={0.1} />,
    )
    expect(c2.querySelector('img')?.style.width).toBe('420px') // 1400 * 0.3
  })

  it('clamps the effective zoom to at least cover the figure when the figure exceeds the natural size', () => {
    // Min-zoom safety: when the figure is larger than the photo's natural
    // size, the user-passed zoom (even at 0.1) is ignored and the image is
    // rendered at the zoom needed to fill the figure. This prevents
    // whitespace around the variant's clip-path geometry.
    //
    // In jsdom, getBoundingClientRect returns 0,0 by default, so we spy
    // on the prototype to simulate a figure larger than the natural
    // image (2000×1500 vs. natural 1400×1050).
    const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 2000,
      height: 1500,
      top: 0,
      left: 0,
      right: 2000,
      bottom: 1500,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    try {
      const { container } = render(
        <ImageFrame variant="hero-stripe" media={SAMPLE_MEDIA} zoom={0.1} />,
      )
      const img = container.querySelector('img')
      // minForWidth = 2000/1400 ≈ 1.43, minForHeight = 1500/1050 ≈ 1.43
      // minZoom = max(1.43, 1.43, 0.3) = 1.43
      // effectiveZoom = max(1.43, min(1.5, 0.1)) = 1.43
      // img width = 1400 * 1.43 ≈ 2002
      const imgWidth = parseFloat(img?.style.width || '0')
      expect(imgWidth).toBeGreaterThan(1400 * 1.0)
    } finally {
      spy.mockRestore()
    }
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
