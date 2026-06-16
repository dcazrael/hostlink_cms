import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { buildChamferSvgPath } from '@/components/ui/chamfer'

import {
  Bullet,
  BulletList,
  Card,
  CompanyInfoTable,
  FeatureList,
  ChamferedCard,
  ContactPanel,
  DiagonalBand,
  FAQStack,
  FlowSteps,
  GridBlock,
  GridBlockItem,
  ImageFrame,
  PricingCard,
  SectionFrame,
  SectionShape,
  SectionWithImage,
  Table,
  type PatternTone,
} from '@/components/patterns'

afterEach(() => {
  cleanup()
})

describe('pattern component contracts', () => {
  it('renders DiagonalBand with an SVG trapezoid instead of clip-path', () => {
    const { container } = render(<DiagonalBand ariaLabel="Operations accent" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    const path = svg!.querySelector('path')
    expect(path).not.toBeNull()
    expect(path!.getAttribute('fill')).toBeTruthy()
    expect(path!.getAttribute('d')).toContain('L')
    expect(path!.getAttribute('d')).toContain('Z')
  })

  it('renders primitive BulletList rows with shaped bullets', () => {
    render(<BulletList items={['Airbnb対応', 'Booking.com対応']} shape="diamond" />)

    const markers = screen.getAllByTestId('pattern-mint-bullet')
    const row = screen.getByText('Airbnb対応').closest('li')

    expect(markers).toHaveLength(2)
    expect(markers[0]?.className).toContain('rotate-45')
    expect(row?.className).toContain('items-start')
    expect(row?.textContent).toBe('Airbnb対応')
  })

  it('renders FeatureList rows with the marker aligned to the title line', () => {
    render(
      <FeatureList
        items={[
          {
            title: 'Dedicated workspace',
            text: 'A managed environment per team.',
          },
        ]}
        shape="diamond"
      />,
    )

    const marker = screen.getByTestId('pattern-mint-bullet')
    const row = screen.getByText('Dedicated workspace').closest('li')

    expect(marker.className).toContain('rotate-45')
    expect(row?.className).toContain('items-start')
    expect(marker.parentElement?.className).toContain('h-5')
    expect(marker.parentElement?.className).toContain('items-center')
    expect(screen.getByText('A managed environment per team.').className).toContain(
      'text-current/75',
    )
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

  it('renders ChamferedCard with an SVG path for symmetric depth', () => {
    const { container } = render(
      <ChamferedCard corner="bottom-right" chamferDepth={4}>
        <p>Depth-only chamfer</p>
      </ChamferedCard>,
    )

    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg!.getAttribute('viewBox')).toBe('0 0 100 100')
    expect(svg!.getAttribute('preserveAspectRatio')).toBe('none')

    const path = svg!.querySelector('path')
    expect(path).not.toBeNull()
    expect(path!.getAttribute('d')).toBe(
      buildChamferSvgPath({
        width: 100,
        height: 100,
        topLeft: { x: 0, y: 0 },
        topRight: { x: 0, y: 0 },
        bottomRight: { x: 4, y: 4 },
        bottomLeft: { x: 0, y: 0 },
      }),
    )
    expect(path!.getAttribute('fill')).toBe('var(--card)')
    expect(path!.getAttribute('stroke')).toBe('var(--border)')
  })

  it('falls back to asymmetric x/y when depth is 0', () => {
    const { container } = render(
      <ChamferedCard corner="bottom-right" chamferDepth={0} chamferX={3} chamferY={6}>
        <p>Asymmetric chamfer</p>
      </ChamferedCard>,
    )

    const path = container.querySelector('svg path')!
    expect(path.getAttribute('d')).toBe(
      buildChamferSvgPath({
        width: 100,
        height: 100,
        topLeft: { x: 0, y: 0 },
        topRight: { x: 0, y: 0 },
        bottomRight: { x: 3, y: 6 },
        bottomLeft: { x: 0, y: 0 },
      }),
    )
  })

  it('renders ChamferedCard with an opposite asymmetric chamfer', () => {
    const { container } = render(
      <ChamferedCard
        corner="top-right"
        chamferDepth={0}
        chamferX={3}
        chamferY={2}
        hasOppositeCorner
        oppositeChamferX={2}
        oppositeChamferY={4}
      >
        <p>Opposite chamfer</p>
      </ChamferedCard>,
    )

    const path = container.querySelector('svg path')!
    expect(path.getAttribute('d')).toBe(
      buildChamferSvgPath({
        width: 100,
        height: 100,
        topLeft: { x: 0, y: 0 },
        topRight: { x: 3, y: 2 },
        bottomRight: { x: 0, y: 0 },
        bottomLeft: { x: 2, y: 4 },
      }),
    )
  })

  it('renders symmetric opposite-corner cut when oppositeChamferDepth is set', () => {
    const { container } = render(
      <ChamferedCard corner="top-right" chamferDepth={3} hasOppositeCorner oppositeChamferDepth={6}>
        <p>Symmetric opposite</p>
      </ChamferedCard>,
    )

    const path = container.querySelector('svg path')!
    expect(path.getAttribute('d')).toBe(
      buildChamferSvgPath({
        width: 100,
        height: 100,
        topLeft: { x: 0, y: 0 },
        topRight: { x: 3, y: 3 },
        bottomRight: { x: 0, y: 0 },
        bottomLeft: { x: 6, y: 6 },
      }),
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

  it('renders FAQStack with the shared accordion preset slots', () => {
    render(
      <FAQStack
        items={[
          {
            question: '夜間の問い合わせにも対応できますか？',
            answer: '24時間365日の問い合わせ対応でゲストとのやり取りを支援します。',
          },
        ]}
      />,
    )

    expect(document.querySelector('[data-slot="accordion"]')).not.toBeNull()
    expect(document.querySelector('[data-slot="accordion-item"]')).not.toBeNull()
    expect(screen.getByRole('button', { name: /夜間の問い合わせ/ }).getAttribute('data-slot')).toBe(
      'accordion-trigger',
    )
  })

  it('renders CompanyInfoTable as a fixed label/value pattern', () => {
    render(
      <CompanyInfoTable
        items={[
          { label: '会社名', value: 'HostLink' },
          { label: '対応言語', value: '日本語・英語' },
        ]}
      />,
    )

    expect(screen.getByTestId('pattern-company-info-table')).not.toBeNull()
    expect(screen.getByText('会社名').className).toContain('bg-accent')
    expect(screen.getByText('HostLink').className).toContain('font-mono')
  })

  it('renders the matrix Table with a tone-controlled header', () => {
    render(
      <Table
        columns={['Service', 'Launch']}
        rows={[['Production hosting', 'Included']]}
        tone="mint"
      />,
    )

    const header = screen.getAllByRole('columnheader')[0]
    expect(header.closest('thead')?.className).toContain('bg-accent')
  })

  it('renders section shape variants with image-mapped geometry hooks', () => {
    const { rerender } = render(<SectionShape variant="diagonal-bands" />)

    expect(screen.getByTestId('pattern-section-shape-diagonal-bands')).not.toBeNull()
    expect(screen.getByTestId('pattern-section-shape-navy-band')).not.toBeNull()

    rerender(<SectionShape variant="stepped-field" />)
    expect(screen.getByTestId('pattern-section-shape-stepped-field')).not.toBeNull()

    rerender(<SectionShape variant="half-field" />)
    expect(screen.getByTestId('pattern-section-shape-half-field')).not.toBeNull()
  })

  it('renders the summary GridBlockItem with accent border and top badge', () => {
    render(
      <GridBlockItem
        variant="summary"
        iconName="wifi"
        title="情報の一元管理"
        text="設備情報を一元管理。"
      />,
    )

    const item = screen.getByTestId('pattern-grid-item-summary')
    expect(item).not.toBeNull()
    expect(item.className).toContain('border-accent')
    expect(screen.getByText('情報の一元管理').nextElementSibling?.className).toContain('border-t')
  })

  it('renders the compact GridBlockItem with the inlined card surface', () => {
    render(
      <GridBlockItem
        variant="compact"
        iconName="moon-star"
        title="夜間対応の負担"
        text="深夜の問い合わせに目が覚め、睡眠不足が続く。"
      />,
    )

    const item = screen.getByTestId('pattern-grid-item-compact')
    expect(item).not.toBeNull()
    expect(item.className).toContain('bg-linear-to-br')
  })

  it('renders the service GridBlockItem with shaped bullet middle content', () => {
    render(
      <GridBlockItem
        variant="service"
        iconName="mail"
        title="メッセージサポート"
        infoItems={['Airbnb対応', 'Booking.com対応']}
        text="ゲストからの問い合わせに24時間対応します。"
      />,
    )

    expect(screen.getByTestId('pattern-grid-item-service')).not.toBeNull()
    expect(screen.getByText('Airbnb対応')).not.toBeNull()
  })

  it('renders a GridBlock with the chosen column count and shared item props', () => {
    render(
      <GridBlock
        columns="3"
        items={[
          { variant: 'summary', iconName: 'wifi', title: 'A', text: 'a' },
          {
            variant: 'summary',
            iconName: 'users-round',
            title: 'B',
            text: 'b',
          },
          { variant: 'summary', iconName: 'zap', title: 'C', text: 'c' },
          { variant: 'summary', iconName: 'mail', title: 'D', text: 'd' },
        ]}
      />,
    )

    const block = screen.getByTestId('pattern-grid-block')
    expect(block.className.split(/\s+/)).toContain('grid-cols-1')
    expect(block.querySelectorAll('[data-testid="pattern-grid-item-summary"]')).toHaveLength(4)
  })

  it('exports the second-pass pattern components', () => {
    expect(PricingCard).toBeTypeOf('function')
    expect(GridBlock).toBeTypeOf('function')
    expect(GridBlockItem).toBeTypeOf('function')
    expect(FlowSteps).toBeTypeOf('function')
    expect(FAQStack).toBeTypeOf('function')
    expect(Table).toBeTypeOf('function')
    expect(Card).toBeTypeOf('function')
    expect(ContactPanel).toBeTypeOf('function')
    expect(BulletList).toBeTypeOf('function')
    expect(CompanyInfoTable).toBeTypeOf('function')
    expect(FeatureList).toBeTypeOf('function')
    expect(ImageFrame).toBeTypeOf('function')
    expect(SectionShape).toBeTypeOf('function')
    expect(SectionWithImage).toBeTypeOf('function')
    expect(Bullet).toBeTypeOf('function')
  })
})
