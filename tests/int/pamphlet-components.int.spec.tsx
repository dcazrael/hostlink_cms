import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  ChamferedCard,
  ContactPanel,
  DiagonalBand,
  FAQStack,
  FlowSteps,
  GridBlockItem,
  ImageFrame,
  MintBullet,
  MintBulletList,
  PamphletButton,
  PamphletCard,
  PamphletTable,
  PricingCard,
  SectionFrame,
  SectionShape,
  SectionWithImage,
} from '@/components/pamphlet'

describe('pamphlet component contracts', () => {
  it('renders DiagonalBand with an actual clipped/slanted visible surface', () => {
    const { container } = render(<DiagonalBand ariaLabel="Operations accent" />)
    const slantedSurface = container.querySelector('[data-pamphlet-diagonal-surface]')

    expect(slantedSurface).not.toBeNull()
    expect((slantedSurface as HTMLElement | null)?.style.clipPath).toBe(
      'polygon(0 0, calc(100% - 1.5rem) 0, 100% 100%, 0 100%)',
    )
  })

  it('renders MintBulletList rows with the marker aligned to the title line', () => {
    render(
      <MintBulletList
        items={[
          {
            title: 'Dedicated workspace',
            body: 'A managed environment per team.',
          },
        ]}
        shape="diamond"
      />,
    )

    const marker = screen.getByTestId('pamphlet-mint-bullet')
    const row = screen.getByText('Dedicated workspace').closest('li')

    expect(marker.className).toContain('rotate-45')
    expect(row?.className).toContain('items-start')
    expect(marker.parentElement?.className).toContain('h-5')
    expect(marker.parentElement?.className).toContain('items-center')
  })

  it('keeps navy ChamferedCard foreground available to child content', () => {
    render(
      <ChamferedCard tone="navy">
        <p>Managed hosting</p>
      </ChamferedCard>,
    )

    expect(screen.getByText('Managed hosting').closest('div')?.parentElement?.className).toContain(
      'text-(--secondary-foreground)',
    )
  })

  it('renders SectionFrame heading levels with distinct visual sizes', () => {
    const { rerender } = render(<SectionFrame headingLevel={1} title="Hero title" />)
    const h1ClassName = screen.getByRole('heading', { level: 1 }).className

    rerender(<SectionFrame headingLevel={4} title="Section title" />)
    const h4ClassName = screen.getByRole('heading', { level: 4 }).className

    expect(h1ClassName).toContain('text-4xl')
    expect(h4ClassName).toContain('text-xl')
    expect(h1ClassName).not.toEqual(h4ClassName)
  })

  it('exports the second-pass pamphlet pattern components', () => {
    expect(PamphletButton).toBeTypeOf('function')
    expect(PricingCard).toBeTypeOf('function')
    expect(GridBlockItem).toBeTypeOf('function')
    expect(FlowSteps).toBeTypeOf('function')
    expect(FAQStack).toBeTypeOf('function')
    expect(PamphletTable).toBeTypeOf('function')
    expect(PamphletCard).toBeTypeOf('function')
    expect(ContactPanel).toBeTypeOf('function')
    expect(MintBulletList).toBeTypeOf('function')
    expect(ImageFrame).toBeTypeOf('function')
    expect(SectionShape).toBeTypeOf('function')
    expect(SectionWithImage).toBeTypeOf('function')
    expect(MintBullet).toBeTypeOf('function')
  })
})
