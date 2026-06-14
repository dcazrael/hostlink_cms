import type { Block, Field, TextField } from 'payload'
import { cleanup, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Archive } from '@/blocks/ArchiveBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { CompanyBlock } from '@/blocks/CompanyBlock'
import { ContactBlock } from '@/blocks/ContactBlock'
import { Content } from '@/blocks/Content/config'
import { FaqBlock } from '@/blocks/FaqBlock'
import { FlowBlock } from '@/blocks/FlowBlock'
import { FormBlock } from '@/blocks/Form/config'
import { GridBlock } from '@/blocks/GridBlock/config'
import { HeroBlock } from '@/blocks/HeroBlock'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { PricingBlock } from '@/blocks/PricingBlock'
import { ProblemsBlock } from '@/blocks/ProblemsBlock'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { SectionBlock } from '@/blocks/SectionBlock'
import { ServicesBlock } from '@/blocks/ServicesBlock'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock'
import { CMSLink } from '@/components/Link'
import { validatePageLayoutAnchors } from '@/collections/Pages/hooks/validatePageLayoutAnchors'
import type { Page } from '@/payload-types'

const CMSLinkWithFutureAnchor = CMSLink as React.ComponentType<
  React.ComponentProps<typeof CMSLink> & { pageAnchor?: string | null }
>

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('@/components/RichText', () => ({
  default: ({ data }: { data: unknown }) =>
    React.createElement('div', { 'data-testid': 'rich-text' }, JSON.stringify(data)),
}))

vi.mock('@/blocks/Content/Component', () => ({
  ContentBlock: () => React.createElement('div', null, 'Content block body'),
}))

afterEach(() => {
  cleanup()
})

const fieldHasNestedFields = (field: Field): field is Field & { fields: Field[] } =>
  'fields' in field && Array.isArray(field.fields)

const fieldHasName = <TName extends string>(
  field: Field,
  name: TName,
): field is Field & { name: TName } => 'name' in field && field.name === name

const blockHasFieldNamed = (block: Block, name: string): boolean => {
  const fieldsContainName = (fields: Field[]): boolean =>
    fields.some(
      (field) =>
        fieldHasName(field, name) ||
        (fieldHasNestedFields(field) && fieldsContainName(field.fields)),
    )

  return fieldsContainName(block.fields)
}

const getManualAnchorField = (block: Block): TextField => {
  const field = block.fields.find(
    (candidate): candidate is TextField =>
      'name' in candidate && candidate.name === 'manualAnchor' && candidate.type === 'text',
  )

  if (!field) throw new Error(`${block.slug} is missing manualAnchor`)
  return field
}

const validateLayout = (layout: unknown) =>
  validatePageLayoutAnchors({ data: { layout } } as Parameters<typeof validatePageLayoutAnchors>[0])

describe('Page layout manual anchors', () => {
  it('adds manualAnchor to Page layout blocks except Hero', () => {
    const nonHeroPageLayoutBlocks = [
      SectionBlock,
      CallToAction,
      Content,
      MediaBlock,
      Archive,
      FormBlock,
      ProblemsBlock,
      ServicesBlock,
      GridBlock,
      FlowBlock,
      PricingBlock,
      FaqBlock,
      TestimonialsBlock,
      CompanyBlock,
      ContactBlock,
    ]

    for (const block of nonHeroPageLayoutBlocks) {
      const field = getManualAnchorField(block)

      expect(field.required).not.toBe(true)
      expect(field.admin?.description).toContain('lowercase')
    }

    expect(blockHasFieldNamed(HeroBlock, 'manualAnchor')).toBe(false)
  })

  it('accepts empty and unique slug-like anchors', () => {
    expect(
      validateLayout([
        { blockType: 'content', manualAnchor: 'intro' },
        { blockType: 'cta', manualAnchor: '' },
        { blockType: 'mediaBlock', manualAnchor: 'pricing-2026' },
      ]),
    ).toBe(true)
  })

  it('rejects invalid manual anchors', () => {
    expect(validateLayout([{ blockType: 'content', manualAnchor: 'Intro Section' }])).toBe(
      'Manual anchors must use lowercase letters, numbers, and hyphens only, with no leading or trailing hyphen.',
    )
    expect(validateLayout([{ blockType: 'content', manualAnchor: '-intro' }])).toBe(
      'Manual anchors must use lowercase letters, numbers, and hyphens only, with no leading or trailing hyphen.',
    )
  })

  it('rejects duplicate anchors on the same Page', () => {
    expect(
      validateLayout([
        { blockType: 'content', manualAnchor: 'services' },
        { blockType: 'cta', manualAnchor: 'services' },
      ]),
    ).toBe('Manual anchors must be unique within a page. Duplicate anchor: services.')
  })

  it('renders manual anchors as Page layout wrapper ids', () => {
    render(
      React.createElement(RenderBlocks, {
        blocks: [
          {
            blockType: 'content',
            manualAnchor: 'overview',
            columns: [{ richText: { root: { children: [] } } }],
          },
        ] as unknown as Page['layout'],
      }),
    )

    expect(document.getElementById('overview')).not.toBeNull()
    expect(screen.getByText('Content block body')).toBeDefined()
  })

  it('uses ToC title ids as a Content fallback when manualAnchor is empty', () => {
    render(
      React.createElement(RenderBlocks, {
        blocks: [
          {
            blockType: 'content',
            columns: [{ tocTitle: 'Feature List', richText: { root: { children: [] } } }],
          },
        ] as unknown as Page['layout'],
      }),
    )

    expect(document.getElementById('feature-list')).not.toBeNull()
  })

  it('appends page anchors to Page reference links only', () => {
    render(
      React.createElement(React.Fragment, null, [
        React.createElement(CMSLinkWithFutureAnchor, {
          key: 'page-section',
          label: 'Page section',
          pageAnchor: '#pricing',
          reference: { relationTo: 'pages', value: { slug: 'services' } as Page },
          type: 'reference',
        }),
        React.createElement(CMSLinkWithFutureAnchor, {
          key: 'home-section',
          label: 'Home section',
          pageAnchor: 'intro',
          reference: { relationTo: 'pages', value: { slug: 'home' } as Page },
          type: 'reference',
        }),
      ]),
    )

    expect(screen.getByRole('link', { name: 'Page section' }).getAttribute('href')).toBe(
      '/services#pricing',
    )
    expect(screen.getByRole('link', { name: 'Home section' }).getAttribute('href')).toBe('/#intro')
  })
})
