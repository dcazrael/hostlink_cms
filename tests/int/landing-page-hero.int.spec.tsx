import * as React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LandingPageHero } from '@/components/patterns/LandingPageHero'

afterEach(() => {
  cleanup()
})

const baseProps = {
  variant: 'image' as const,
  eyebrow: 'Test Eyebrow',
  title: 'Test Title',
  description: 'Test description copy',
  primaryCta: { label: 'Primary CTA', href: '#primary' },
  slot: <div data-testid="test-slot">SLOT</div>,
}

describe('LandingPageHero', () => {
  it('renders eyebrow, title, description in the text side', () => {
    render(<LandingPageHero {...baseProps} />)

    expect(screen.getByText('Test Eyebrow')).toBeTruthy()
    expect(screen.getByText('Test Title')).toBeTruthy()
    expect(screen.getByText('Test description copy')).toBeTruthy()
  })

  it('renders the primary CTA with the correct label', () => {
    render(<LandingPageHero {...baseProps} />)

    const cta = screen.getByText('Primary CTA')
    expect(cta).toBeTruthy()
    expect(cta.closest('button, a')).not.toBeNull()
  })

  it('renders the secondary CTA when provided', () => {
    render(
      <LandingPageHero
        {...baseProps}
        secondaryCta={{ label: 'Secondary CTA', href: '#secondary' }}
      />,
    )

    expect(screen.getByText('Secondary CTA')).toBeTruthy()
  })

  it('hides the secondary CTA when not provided', () => {
    render(<LandingPageHero {...baseProps} />)

    expect(screen.queryByText('Secondary CTA')).toBeNull()
  })

  it('image variant renders the slot', () => {
    const { container } = render(<LandingPageHero {...baseProps} variant="image" />)

    expect(container.querySelector('[data-testid="test-slot"]')).not.toBeNull()
  })

  it('component variant renders the slot', () => {
    const { container } = render(<LandingPageHero {...baseProps} variant="component" />)

    expect(container.querySelector('[data-testid="test-slot"]')).not.toBeNull()
  })

  it('displays features as flex column on >=md (md:flex-col on the list)', () => {
    const { container } = render(
      <LandingPageHero
        {...baseProps}
        features={[{ title: 'Feature A' }, { title: 'Feature B' }]}
      />,
    )

    const ul = container.querySelector('ul')
    expect(ul).not.toBeNull()
    expect(ul?.className).toMatch(/md:flex-col/)
  })

  it('displays features as flex row on <md (flex-row on the list)', () => {
    const { container } = render(
      <LandingPageHero
        {...baseProps}
        features={[{ title: 'Feature A' }, { title: 'Feature B' }]}
      />,
    )

    const ul = container.querySelector('ul')
    expect(ul).not.toBeNull()
    expect(ul?.className).toMatch(/flex-row/)
  })

  it('CTA container stacks on mobile and sits side-by-side on >=sm (sm:flex-row)', () => {
    const { container } = render(
      <LandingPageHero
        {...baseProps}
        secondaryCta={{ label: 'Secondary CTA', href: '#secondary' }}
      />,
    )

    const buttons = screen.getAllByRole('button')
    const ctaContainer = buttons[0].parentElement
    expect(ctaContainer).not.toBeNull()
    expect(ctaContainer?.className).toContain('flex-col')
    expect(ctaContainer?.className).toContain('sm:flex-row')
  })
})
