import type { Block, Field, TextField } from 'payload'
import { cleanup, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { HeroBlock } from '@/blocks/HeroBlock'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { SectionBlock } from '@/blocks/SectionBlock'
import { CMSLink } from '@/components/Link'
import { Pages } from '@/collections/Pages'
import { validatePageLayoutAnchors } from '@/collections/Pages/hooks/validatePageLayoutAnchors'
import { populateTableOfContents } from '@/hooks/populateTableOfContents'
import type { Page } from '@/payload-types'

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

const fieldHasTabs = (field: Field): field is Field & { tabs: Array<{ fields?: Field[] }> } =>
  'tabs' in field && Array.isArray(field.tabs)

const fieldHasName = <TName extends string>(
  field: Field,
  name: TName,
): field is Field & { name: TName } => 'name' in field && field.name === name

const blockHasFieldNamed = (block: Block, name: string): boolean => {
  const fieldsContainName = (fields: Field[]): boolean =>
    fields.some(
      (field) =>
        fieldHasName(field, name) ||
        (fieldHasNestedFields(field) && fieldsContainName(field.fields)) ||
        (fieldHasTabs(field) &&
          field.tabs.some((tab) => Array.isArray(tab.fields) && fieldsContainName(tab.fields))),
    )

  return fieldsContainName(block.fields)
}

const getPageLayoutBlocks = (): Block[] => {
  for (const field of Pages.fields) {
    if (!fieldHasTabs(field)) continue

    for (const tab of field.tabs) {
      const layoutField = tab.fields?.find(
        (candidate): candidate is Field & { blocks: Block[]; name: 'layout'; type: 'blocks' } =>
          fieldHasName(candidate, 'layout') &&
          candidate.type === 'blocks' &&
          'blocks' in candidate &&
          Array.isArray(candidate.blocks),
      )

      if (layoutField) return layoutField.blocks
    }
  }

  throw new Error('Pages.layout blocks field was not found')
}

const getManualAnchorField = (block: Block): TextField => {
  const field = block.fields.find(
    (candidate): candidate is TextField =>
      'name' in candidate && candidate.name === 'manualAnchor' && candidate.type === 'text',
  )

  if (!field) throw new Error(`${block.slug} is missing manualAnchor`)
  return field
}

const getPayloadValidationMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'data' in error) {
    const errors = (error as { data?: { errors?: Array<{ message?: unknown }> } }).data?.errors
    const message = errors?.[0]?.message
    if (typeof message === 'string') return message
  }

  if (error instanceof Error) return error.message
  return String(error)
}

const validateLayout = (layout: unknown) => {
  try {
    validatePageLayoutAnchors({
      data: { layout },
      req: {} as never,
    } as unknown as Parameters<typeof validatePageLayoutAnchors>[0])
    return true
  } catch (error) {
    return getPayloadValidationMessage(error)
  }
}

const populateTocForLayout = (layout: unknown): Page['tableOfContentsHeadings'] => {
  const result = populateTableOfContents({
    data: { layout },
    originalDoc: {},
  } as unknown as Parameters<typeof populateTableOfContents>[0]) as Page

  return result.tableOfContentsHeadings
}

describe('Page layout manual anchors', () => {
  it('adds manualAnchor to Page layout blocks except Hero', () => {
    const pageLayoutBlocks = getPageLayoutBlocks()
    const nonHeroPageLayoutBlocks = pageLayoutBlocks.filter(
      (block) => block.slug !== HeroBlock.slug,
    )

    expect(pageLayoutBlocks.map((block) => block.slug)).toContain(HeroBlock.slug)
    expect(nonHeroPageLayoutBlocks.length).toBeGreaterThan(0)

    for (const block of nonHeroPageLayoutBlocks) {
      const field = getManualAnchorField(block)

      expect(field.required).not.toBe(true)
      expect(field.admin?.description).toContain('lowercase')
    }

    expect(blockHasFieldNamed(HeroBlock, 'manualAnchor')).toBe(false)
  })

  it('does not add manualAnchor to shared block definitions outside Pages.layout', () => {
    expect(blockHasFieldNamed(MediaBlock, 'manualAnchor')).toBe(false)
    expect(blockHasFieldNamed(SectionBlock, 'manualAnchor')).toBe(false)
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
    ).toBe(
      'Manual anchors must be unique within a page. Duplicate anchor: services also appears at layout.0.manualAnchor.',
    )
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

  it('uses a manualAnchor for only the first ToC item in a multi-column Content block', () => {
    expect(
      populateTocForLayout([
        {
          blockType: 'content',
          manualAnchor: 'overview',
          columns: [{ tocTitle: 'Overview' }, { tocTitle: 'Details' }],
        },
      ]),
    ).toEqual([
      { id: 'overview', text: 'Overview' },
      { id: 'details', text: 'Details' },
    ])
  })

  it('appends page anchors to Page reference links only', () => {
    render(
      React.createElement(React.Fragment, null, [
        React.createElement(CMSLink, {
          key: 'page-section',
          label: 'Page section',
          pageAnchor: '#pricing',
          reference: { relationTo: 'pages', value: { slug: 'services' } as Page },
          type: 'reference',
        }),
        React.createElement(CMSLink, {
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
