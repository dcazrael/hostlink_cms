import * as React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ContentPageHero } from '@/components/patterns/ContentPageHero'
import type { Media as MediaType } from '@/payload-types'

afterEach(() => {
  cleanup()
})

const SAMPLE_MEDIA: MediaType = {
  id: 1,
  alt: 'Sample hero photo',
  url: '/media/hero-sample.jpg',
  filename: 'hero-sample.jpg',
  mimeType: 'image/jpeg',
  filesize: 123456,
  width: 2000,
  height: 1200,
  focalX: 50,
  focalY: 50,
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  sizes: {
    large: {
      url: '/media/hero-sample-large.jpg',
      width: 1400,
      height: 840,
      mimeType: 'image/jpeg',
      filesize: 200000,
      filename: 'hero-sample-large.jpg',
    },
  },
}

describe('ContentPageHero', () => {
  it('renders title and subtitle text', () => {
    render(
      <ContentPageHero
        title="Test Hero Title"
        subtitle="Test hero subtitle copy"
        media={SAMPLE_MEDIA}
      />,
    )

    expect(screen.getByText('Test Hero Title')).toBeTruthy()
    expect(screen.getByText('Test hero subtitle copy')).toBeTruthy()
  })

  it('uses ImageFrame as background (find the img inside)', () => {
    const { container } = render(
      <ContentPageHero
        title="Test Hero Title"
        subtitle="Test hero subtitle copy"
        media={SAMPLE_MEDIA}
      />,
    )

    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    // ImageFrame resolves media to its size URL
    expect(img?.getAttribute('src')).toBe('/media/hero-sample-large.jpg')
  })

  it('renders the divider (some element that visually separates title from subtitle)', () => {
    const { container } = render(
      <ContentPageHero
        title="Test Hero Title"
        subtitle="Test hero subtitle copy"
        media={SAMPLE_MEDIA}
      />,
    )

    // The divider is a thin horizontal white rule between the title and
    // the subtitle (h-1 w-36 bg-white in the implementation).
    const divider = container.querySelector('[data-testid="content-page-hero-divider"]')
    expect(divider).not.toBeNull()
    expect(divider?.className).toContain('h-1')
    expect(divider?.className).toContain('bg-white')
  })

  it('positions the text container at the bottom of the image', () => {
    const { container } = render(
      <ContentPageHero
        title="Test Hero Title"
        subtitle="Test hero subtitle copy"
        media={SAMPLE_MEDIA}
      />,
    )

    // The text container is the absolute-positioned div that holds the
    // title, divider, and subtitle. Find it as the ancestor of the title
    // heading that is `absolute`.
    const title = screen.getByText('Test Hero Title')
    const textContainer = title.parentElement
    expect(textContainer).not.toBeNull()
    expect(textContainer?.className).toContain('absolute')
    expect(textContainer?.className).toContain('bottom-0')
  })
})
