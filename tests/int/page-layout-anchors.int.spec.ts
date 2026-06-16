import type { Block, CheckboxField, Field, TextField } from 'payload'
import type { GroupField, RowField } from 'payload'
import { cleanup, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CallToAction } from '@/blocks/CallToAction/config'
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

const mockSetParams = vi.fn()

vi.mock('@payloadcms/ui', () => ({
  SelectInput: ({ options, value, placeholder, ...props }: Record<string, unknown>) =>
    React.createElement('select', {
      'data-testid': 'page-anchor-select',
      'data-options': JSON.stringify(options ?? []),
      'data-value': String(value ?? ''),
      placeholder: placeholder ?? null,
      ...props,
    }),
  useField: vi.fn(() => ({ setValue: vi.fn(), showError: false, value: undefined })),
  useFormFields: vi.fn(() => undefined),
  usePayloadAPI: vi.fn(() => [{ data: { docs: [] } }, { setParams: mockSetParams }]),
  useWatchForm: vi.fn(() => ({
    getData: () => ({
      links: [
        {
          link: {
            type: 'reference',
            reference: { relationTo: 'pages', value: 'page-123' },
            label: 'Test link',
          },
        },
      ],
    }),
  })),
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

const blockHasTopLevelCheckboxNamed = (block: Block, name: string): boolean =>
  block.fields.some((field) => 'name' in field && field.name === name && field.type === 'checkbox')

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

const getAnchorField = (block: Block): CheckboxField => {
  const field = block.fields.find(
    (candidate): candidate is CheckboxField =>
      'name' in candidate && candidate.name === 'anchor' && candidate.type === 'checkbox',
  )

  if (!field) throw new Error(`${block.slug} is missing anchor field`)
  return field
}

const getPageTableOfContentsField = (): Field & {
  fields: Field[]
  name: 'tableOfContentsHeadings'
  type: 'array'
} => {
  const field = Pages.fields.find(
    (
      candidate,
    ): candidate is Field & {
      fields: Field[]
      name: 'tableOfContentsHeadings'
      type: 'array'
    } =>
      fieldHasName(candidate, 'tableOfContentsHeadings') &&
      candidate.type === 'array' &&
      fieldHasNestedFields(candidate),
  )

  if (!field) throw new Error('Pages.tableOfContentsHeadings field was not found')
  return field
}

const getSectionComponentBlocks = (): Block[] => {
  const componentField = SectionBlock.fields.find(
    (field): field is Field & { blocks: Block[]; name: 'component'; type: 'blocks' } =>
      fieldHasName(field, 'component') &&
      field.type === 'blocks' &&
      'blocks' in field &&
      Array.isArray(field.blocks),
  )

  if (!componentField) throw new Error('Section.component blocks field was not found')
  return componentField.blocks
}

const blockFieldShape = (block: Block): string =>
  block.fields
    .map((field) => ('name' in field ? `${field.type}:${field.name}` : field.type))
    .join('|')

const getCtaLinkField = (): GroupField => {
  const linksField = CallToAction.fields.find(
    (field): field is Field & { fields: Field[]; name: 'links'; type: 'array' } =>
      fieldHasName(field, 'links') && field.type === 'array' && fieldHasNestedFields(field),
  )
  if (!linksField) throw new Error('CTA links array was not found')

  const linkField = linksField.fields.find(
    (field): field is GroupField => fieldHasName(field, 'link') && field.type === 'group',
  )
  if (!linkField) throw new Error('CTA link group was not found')

  return linkField
}

const getCtaPageAnchorField = (): TextField => {
  const rows = getCtaLinkField().fields.filter(
    (field): field is RowField => field.type === 'row' && fieldHasNestedFields(field),
  )
  const pageAnchorField = rows
    .flatMap((row) => row.fields)
    .find((field): field is TextField => fieldHasName(field, 'pageAnchor') && field.type === 'text')
  if (!pageAnchorField) throw new Error('CTA pageAnchor field was not found')

  return pageAnchorField
}

const validateTextField = (field: TextField, value: string, siblingData: unknown) => {
  const validate = field.validate as ((value: unknown, options: unknown) => unknown) | undefined
  return validate?.(value, { siblingData })
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
  it('adds anchor checkbox to Page layout blocks except Hero', () => {
    const pageLayoutBlocks = getPageLayoutBlocks()
    const nonHeroPageLayoutBlocks = pageLayoutBlocks.filter(
      (block) => block.slug !== HeroBlock.slug,
    )

    expect(pageLayoutBlocks.map((block) => block.slug)).toContain(HeroBlock.slug)
    expect(nonHeroPageLayoutBlocks.length).toBeGreaterThan(0)

    for (const block of nonHeroPageLayoutBlocks) {
      const field = getAnchorField(block)

      expect(field.required).not.toBe(true)
      expect(field.admin?.description).toContain('anchor target')
    }

    expect(blockHasTopLevelCheckboxNamed(HeroBlock, 'anchor')).toBe(false)
  })

  it('shows anchor only for top-level Page layout blocks', () => {
    const mediaAnchor = getAnchorField(MediaBlock)
    const sectionAnchor = getAnchorField(SectionBlock)

    expect(blockHasFieldNamed(MediaBlock, 'anchor')).toBe(true)
    expect(blockHasFieldNamed(SectionBlock, 'anchor')).toBe(true)
    expect(
      mediaAnchor.admin?.condition?.({}, {}, {
        path: ['layout', 0, 'anchor'],
      } as never),
    ).toBe(true)
    expect(
      mediaAnchor.admin?.condition?.({}, {}, {
        path: ['layout', 'anchor'],
      } as never),
    ).toBe(true)
    expect(
      sectionAnchor.admin?.condition?.({}, {}, {
        path: ['layout', 0, 'component', 0, 'anchor'],
      } as never),
    ).toBe(false)
    expect(
      sectionAnchor.admin?.condition?.({}, {}, {
        path: ['sections', 0, 'anchor'],
      } as never),
    ).toBe(false)
  })

  it('uses one field shape for repeated block slugs under Pages to avoid split block tables', () => {
    const blocksBySlug = new Map<string, Set<string>>()

    for (const block of [...getPageLayoutBlocks(), ...getSectionComponentBlocks()]) {
      const shapes = blocksBySlug.get(block.slug) ?? new Set<string>()
      shapes.add(blockFieldShape(block))
      blocksBySlug.set(block.slug, shapes)
    }

    const duplicateShapeSlugs = [...blocksBySlug.entries()]
      .filter(([, shapes]) => shapes.size > 1)
      .map(([slug]) => slug)

    expect(duplicateShapeSlugs).toEqual([])
  })

  it('does not use id as the stored ToC anchor field name', () => {
    const tocField = getPageTableOfContentsField()
    const fieldNames = tocField.fields
      .filter((field): field is Field & { name: string } => 'name' in field)
      .map((field) => field.name)

    expect(fieldNames).toContain('anchor')
  })

  it('requires blockName when anchor checkbox is checked', () => {
    expect(
      validateLayout([
        { blockType: 'content', anchor: true, blockName: 'Intro' },
        { blockType: 'cta', anchor: true, blockName: 'Pricing' },
        { blockType: 'mediaBlock', anchor: true, blockName: 'Gallery' },
      ]),
    ).toBe(true)
    expect(validateLayout([{ blockType: 'content', anchor: true, blockName: '' }])).toBe(
      'Block must have a name or heading when used as an anchor.',
    )
    expect(validateLayout([{ blockType: 'content', anchor: true }])).toBe(
      'Block must have a name or heading when used as an anchor.',
    )
  })

  it('validates using heading when blockName is empty', () => {
    expect(validateLayout([{ blockType: 'content', anchor: true, heading: 'Features' }])).toBe(true)
  })

  it('rejects duplicate anchors on the same Page', () => {
    expect(
      validateLayout([
        { blockType: 'content', anchor: true, blockName: 'Services' },
        { blockType: 'cta', anchor: true, blockName: 'Services' },
      ]),
    ).toBe(
      'Anchors must be unique within a page. Duplicate anchor: services also appears at layout.0.anchor.',
    )
  })

  it('renders anchor blocks as Page layout wrapper ids', () => {
    render(
      React.createElement(RenderBlocks, {
        blocks: [
          {
            blockType: 'content',
            anchor: true,
            blockName: 'Overview',
            columns: [{ richText: { root: { children: [] } } }],
          },
        ] as unknown as Page['layout'],
      }),
    )

    expect(document.getElementById('overview')).not.toBeNull()
    expect(screen.getByText('Content block body')).toBeDefined()
  })

  it('uses ToC title ids as a Content fallback when anchor is not checked', () => {
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

  it('uses an anchor checkbox for only the first ToC item in a multi-column Content block', () => {
    expect(
      populateTocForLayout([
        {
          blockType: 'content',
          anchor: true,
          blockName: 'Overview',
          columns: [{ tocTitle: 'Overview' }, { tocTitle: 'Details' }],
        },
      ]),
    ).toEqual([
      { anchor: 'overview', text: 'Overview' },
      { anchor: 'details', text: 'Details' },
    ])
  })

  it('shows and validates CTA pageAnchor only for Page reference links', () => {
    const pageAnchorField = getCtaPageAnchorField()

    expect(
      pageAnchorField.admin?.condition?.(
        {},
        { type: 'reference', reference: { relationTo: 'pages' } },
        {} as never,
      ),
    ).toBe(true)
    expect(
      pageAnchorField.admin?.condition?.(
        {},
        { type: 'reference', reference: { relationTo: 'posts' } },
        {} as never,
      ),
    ).toBe(false)
    expect(
      validateTextField(pageAnchorField, 'pricing', {
        type: 'reference',
        reference: { relationTo: 'pages' },
      }),
    ).toBe(true)
    expect(
      validateTextField(pageAnchorField, '対応範囲', {
        type: 'reference',
        reference: { relationTo: 'pages' },
      }),
    ).toBe(true)
    expect(
      validateTextField(pageAnchorField, 'pricing', {
        type: 'reference',
        reference: { relationTo: 'posts' },
      }),
    ).toBe('Page anchors can only be used with Page links.')
  })

  it('uses a custom admin component for the CTA pageAnchor field', () => {
    const pageAnchorField = getCtaPageAnchorField()
    expect(pageAnchorField.admin?.components?.Field).toBe(
      '@/fields/components/PageAnchorSelect#PageAnchorSelect',
    )
  })

  it('renders PageAnchorSelect with anchor options from the referenced Page API', async () => {
    const { PageAnchorSelect } = await import('@/fields/components/PageAnchorSelect')
    const { useField, usePayloadAPI, useWatchForm } = await import('@payloadcms/ui')

    const mockSetValue = vi.fn()
    vi.mocked(useField).mockReturnValueOnce({
      setValue: mockSetValue,
      showError: false,
      value: 'intro',
    } as never)
    vi.mocked(useWatchForm).mockReturnValueOnce({
      getData: () => ({
        links: [
          {
            link: {
              type: 'reference',
              reference: { relationTo: 'pages', value: 'page-456' },
              label: 'Test link',
            },
          },
        ],
      }),
    } as never)
    vi.mocked(usePayloadAPI).mockReset()
    vi.mocked(usePayloadAPI).mockReturnValueOnce([
      {
        data: {
          docs: [
            {
              id: 'page-456',
              layout: [
                {
                  blockType: 'content',
                  anchor: true,
                  blockName: 'Intro',
                  heading: 'Intro',
                  id: 'b1',
                },
                {
                  blockType: 'cta',
                  anchor: true,
                  blockName: 'Pricing 2026',
                  heading: 'Pricing',
                  id: 'b2',
                },
                { blockType: 'mediaBlock', anchor: true, blockName: 'Gallery', id: 'b3' },
              ],
            },
          ],
        },
        isError: false,
        isLoading: false,
      } as never,
      { setParams: mockSetParams as never },
    ])

    render(
      React.createElement(PageAnchorSelect, {
        field: { name: 'pageAnchor', type: 'text', label: 'Page anchor' },
        path: 'links.0.link.pageAnchor',
        readOnly: false,
      }),
    )

    const select = screen.getByTestId('page-anchor-select')
    const options = JSON.parse(select.getAttribute('data-options') ?? '[]') as Array<{
      label: string
      value: string
    }> as Array<{ label: string; value: string }>
    const values = options.map((o) => o.value)

    expect(values).toContain('intro')
    expect(values).toContain('pricing-2026')
    expect(values).toContain('gallery')
    expect(select.getAttribute('data-value')).toBe('intro')
  })

  it('shows a placeholder when no Page is selected for the anchor selector', async () => {
    const { PageAnchorSelect } = await import('@/fields/components/PageAnchorSelect')
    const { useField, usePayloadAPI, useWatchForm } = await import('@payloadcms/ui')

    vi.mocked(useField).mockReturnValueOnce({
      setValue: vi.fn(),
      showError: false,
      value: undefined,
    } as never)
    // No page selected (reference is posts, not pages)
    vi.mocked(useWatchForm).mockReturnValueOnce({
      getData: () => ({
        links: [
          {
            link: {
              type: 'reference',
              reference: { relationTo: 'posts', value: 'post-789' },
              label: 'Test link',
            },
          },
        ],
      }),
    } as never)
    vi.mocked(usePayloadAPI).mockReset()
    vi.mocked(usePayloadAPI).mockReturnValueOnce([
      { data: { docs: [] }, isError: false, isLoading: false } as never,
      { setParams: mockSetParams as never },
    ])

    render(
      React.createElement(PageAnchorSelect, {
        field: { name: 'pageAnchor', type: 'text', label: 'Page anchor' },
        path: 'links.0.link.pageAnchor',
        readOnly: false,
      }),
    )

    const select = screen.getByTestId('page-anchor-select')
    expect(select.getAttribute('placeholder')).toBe('Select a Page link first')
    expect(select.getAttribute('data-value')).toBe('')
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
