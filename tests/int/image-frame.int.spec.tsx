import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { ImageFrame } from '@/components/patterns/ImageFrame'

const SAMPLE_SRC = '/sample-photo.jpg'
const SAMPLE_ALT = 'A sample photograph'

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
})
