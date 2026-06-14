# Page Anchors and CTA Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add manual Page layout anchors, expose Page+anchor links, and improve CTA rendering for issues #12 and #13.

**Architecture:** Keep anchor behavior small and shared: one Page-layout anchor field helper, one Page-layout validation hook, one link-field option for Page anchors, and centralized runtime resolution in `CMSLink`. Rendering stays in existing block wrappers and CTA remains a thin presentational component.

**Tech Stack:** Payload CMS 3, Next.js 16, React 19, TypeScript 6, Vitest, Testing Library, pnpm, Fallow, Oxlint/Oxfmt where project commands provide them.

---

## File Structure

- Create `src/fields/pageAnchor.ts`: reusable `manualAnchor` field and validation helpers for slug-like anchors.
- Create `src/collections/Pages/hooks/validatePageLayoutAnchors.ts`: Page collection hook that rejects duplicate or invalid `manualAnchor` values.
- Modify `src/collections/Pages/index.ts`: attach the validation hook and apply `manualAnchor` fields to all Page layout blocks except `HeroBlock`.
- Modify `src/fields/link.ts`: add `enablePageAnchor` support and a `pageAnchor` field under internal reference links.
- Modify `src/fields/linkGroup.ts`: pass `enablePageAnchor` through to `link()`.
- Modify `src/components/Link/index.tsx`: append `#pageAnchor` for Page reference links.
- Modify `src/blocks/RenderBlocks.tsx`: resolve one wrapper `id` per Page layout block using `manualAnchor`, with Content ToC fallback.
- Modify `src/blocks/CallToAction/config.ts`: enable Page anchors for CTA link groups.
- Modify `src/blocks/CallToAction/Component.tsx`: support card mode and button-only mode.
- Modify `src/hooks/populateTableOfContents.ts`: prefer `manualAnchor` for Section and Content ToC ids when present.
- Modify `src/utilities/homepageAnchors.ts`: include manual anchors in current-page anchor options for Page layout links.
- Modify `src/payload-types.ts`: regenerate via `pnpm generate:types`.
- Create `tests/int/page-layout-anchors.int.spec.ts`: schema, hook, rendering, and link tests for #12.
- Create `tests/int/cta-links-rendering.int.spec.tsx`: CTA config and rendering tests for #13.

## Task 1: Add failing tests for Page layout anchors and Page+anchor links

**Files:**
- Create: `tests/int/page-layout-anchors.int.spec.ts`

- [ ] **Step 1: Write the failing test file**

Create `tests/int/page-layout-anchors.int.spec.ts` with:

```tsx
import type { Block, Field, TextField } from 'payload'
import { render, screen, cleanup } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Archive } from '@/blocks/ArchiveBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { HeroBlock } from '@/blocks/HeroBlock'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { CMSLink } from '@/components/Link'
import { validatePageLayoutAnchors } from '@/collections/Pages/hooks/validatePageLayoutAnchors'
import type { Page } from '@/payload-types'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('@/components/RichText', () => ({
  default: ({ data }: { data: unknown }) => <div data-testid="rich-text">{JSON.stringify(data)}</div>,
}))

vi.mock('@/blocks/Content/Component', () => ({
  ContentBlock: () => <div>Content block body</div>,
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
    for (const block of [Archive, CallToAction, Content, MediaBlock]) {
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
      <RenderBlocks
        blocks={[
          {
            blockType: 'content',
            manualAnchor: 'overview',
            columns: [{ richText: { root: { children: [] } } }],
          },
        ] as Page['layout']}
      />,
    )

    expect(document.getElementById('overview')).not.toBeNull()
    expect(screen.getByText('Content block body')).toBeInTheDocument()
  })

  it('uses ToC title ids as a Content fallback when manualAnchor is empty', () => {
    render(
      <RenderBlocks
        blocks={[
          {
            blockType: 'content',
            columns: [{ tocTitle: 'Feature List', richText: { root: { children: [] } } }],
          },
        ] as Page['layout']}
      />,
    )

    expect(document.getElementById('feature-list')).not.toBeNull()
  })

  it('appends page anchors to Page reference links only', () => {
    render(
      <>
        <CMSLink
          label="Page section"
          pageAnchor="#pricing"
          reference={{ relationTo: 'pages', value: { slug: 'services' } as Page }}
          type="reference"
        />
        <CMSLink
          label="Home section"
          pageAnchor="intro"
          reference={{ relationTo: 'pages', value: { slug: 'home' } as Page }}
          type="reference"
        />
      </>,
    )

    expect(screen.getByRole('link', { name: 'Page section' }).getAttribute('href')).toBe(
      '/services#pricing',
    )
    expect(screen.getByRole('link', { name: 'Home section' }).getAttribute('href')).toBe('/#intro')
  })
})
```

- [ ] **Step 2: Run the new tests and verify they fail**

Run:

```bash
pnpm vitest run --config ./vitest.config.mts tests/int/page-layout-anchors.int.spec.ts
```

Expected: FAIL because `src/fields/pageAnchor.ts` and `validatePageLayoutAnchors` do not exist, `manualAnchor` is not on blocks, and `CMSLink` does not accept `pageAnchor`.

## Task 2: Implement Page manual anchor schema and validation

**Files:**
- Create: `src/fields/pageAnchor.ts`
- Create: `src/collections/Pages/hooks/validatePageLayoutAnchors.ts`
- Modify: `src/collections/Pages/index.ts`
- Modify: Page layout block configs imported by `src/collections/Pages/index.ts`
- Test: `tests/int/page-layout-anchors.int.spec.ts`

- [ ] **Step 1: Create the reusable Page anchor field helper**

Create `src/fields/pageAnchor.ts`:

```ts
import type { TextField } from 'payload'

export const manualAnchorPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const manualAnchorValidationMessage =
  'Manual anchors must use lowercase letters, numbers, and hyphens only, with no leading or trailing hyphen.'

export const normalizeManualAnchor = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

export const isValidManualAnchor = (value: string): boolean => manualAnchorPattern.test(value)

export const manualAnchorField = (): TextField => ({
  name: 'manualAnchor',
  type: 'text',
  admin: {
    description:
      'Optional page section anchor. Use lowercase letters, numbers, and hyphens only, like pricing-details.',
  },
  label: 'Manual anchor',
  validate: (value) => {
    const normalized = normalizeManualAnchor(value)
    if (!normalized) return true
    return isValidManualAnchor(normalized) ? true : manualAnchorValidationMessage
  },
})
```

- [ ] **Step 2: Add the Page layout validation hook**

Create `src/collections/Pages/hooks/validatePageLayoutAnchors.ts`:

```ts
import type { CollectionBeforeValidateHook } from 'payload'

import {
  isValidManualAnchor,
  manualAnchorValidationMessage,
  normalizeManualAnchor,
} from '@/fields/pageAnchor'

type LayoutBlockWithManualAnchor = {
  manualAnchor?: unknown
}

export const validatePageLayoutAnchors: CollectionBeforeValidateHook = ({ data }) => {
  const layout = Array.isArray(data?.layout) ? data.layout : []
  const seen = new Set<string>()

  for (const rawBlock of layout) {
    if (!rawBlock || typeof rawBlock !== 'object') continue

    const anchor = normalizeManualAnchor((rawBlock as LayoutBlockWithManualAnchor).manualAnchor)
    if (!anchor) continue

    if (!isValidManualAnchor(anchor)) return manualAnchorValidationMessage

    if (seen.has(anchor)) {
      return `Manual anchors must be unique within a page. Duplicate anchor: ${anchor}.`
    }

    seen.add(anchor)
  }

  return true
}
```

- [ ] **Step 3: Attach `manualAnchorField()` to non-Hero Page layout blocks**

In each non-Hero block config that appears in `src/collections/Pages/index.ts`, import `manualAnchorField` and add it as the first or near-first field.

Example for `src/blocks/CallToAction/config.ts`:

```ts
import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'
import { richTextField } from '../../fields/richTextField'
import { manualAnchorField } from '@/fields/pageAnchor'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    manualAnchorField(),
    richTextField,
    linkGroup({
      appearances: ['default', 'outline'],
      enablePageAnchor: true,
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
```

Apply the same `manualAnchorField()` import and field addition to:

```ts
src/blocks/ArchiveBlock/config.ts
src/blocks/Content/config.ts
src/blocks/MediaBlock/config.ts
src/blocks/Form/config.ts
src/blocks/SectionBlock.ts
src/blocks/GridBlock/config.ts
src/blocks/ProblemsBlock.ts
src/blocks/ServicesBlock.ts
src/blocks/FlowBlock.ts
src/blocks/PricingBlock.ts
src/blocks/FaqBlock.ts
src/blocks/TestimonialsBlock.ts
src/blocks/CompanyBlock.ts
src/blocks/ContactBlock.ts
```

Do not add it to `src/blocks/HeroBlock.ts` or `src/heros/config.ts`.

- [ ] **Step 4: Attach the hook to the Pages collection**

Modify `src/collections/Pages/index.ts` imports:

```ts
import { validatePageLayoutAnchors } from './hooks/validatePageLayoutAnchors'
```

Add `beforeValidate` without removing existing hooks:

```ts
hooks: {
  beforeValidate: [validatePageLayoutAnchors],
  afterChange: [revalidatePage],
  beforeChange: [populatePublishedAt, populateTableOfContents],
  afterDelete: [revalidateDelete],
},
```

If the hook block already differs, preserve all existing hooks and only add `beforeValidate: [validatePageLayoutAnchors]`.

- [ ] **Step 5: Run the Page anchor tests**

Run:

```bash
pnpm vitest run --config ./vitest.config.mts tests/int/page-layout-anchors.int.spec.ts
```

Expected: still FAIL on rendering/link tests until `RenderBlocks` and `CMSLink` are updated, but schema and validation assertions should pass.

- [ ] **Step 6: Commit Task 2**

Run:

```bash
git add src/fields/pageAnchor.ts src/collections/Pages/hooks/validatePageLayoutAnchors.ts src/collections/Pages/index.ts src/blocks tests/int/page-layout-anchors.int.spec.ts
git commit -m "Add page layout manual anchor fields"
```

## Task 3: Render Page layout anchors and expose them in ToC/current-page anchor utilities

**Files:**
- Modify: `src/blocks/RenderBlocks.tsx`
- Modify: `src/hooks/populateTableOfContents.ts`
- Modify: `src/utilities/homepageAnchors.ts`
- Test: `tests/int/page-layout-anchors.int.spec.ts`

- [ ] **Step 1: Update `RenderBlocks` id resolution**

Modify `src/blocks/RenderBlocks.tsx` to add helpers near `slugify`:

```ts
type PageLayoutBlockWithAnchor = Page['layout'][number] & {
  manualAnchor?: string | null
}

const getManualAnchor = (block: PageLayoutBlockWithAnchor): string | undefined => {
  const anchor = typeof block.manualAnchor === 'string' ? block.manualAnchor.trim() : ''
  return anchor || undefined
}

const getContentFallbackAnchor = (block: ContentBlockData & { columns?: { tocTitle?: string }[] }) => {
  const tocTitle = block.columns?.[0]?.tocTitle
  return tocTitle ? slugify(tocTitle) : undefined
}

const getWrapperID = (block: PageLayoutBlockWithAnchor): string | undefined => {
  const manualAnchor = getManualAnchor(block)
  if (manualAnchor) return manualAnchor

  if (block.blockType === 'content') {
    return getContentFallbackAnchor(block as unknown as ContentBlockData & { columns?: { tocTitle?: string }[] })
  }

  return undefined
}
```

Then use `const wrapperID = getWrapperID(block as PageLayoutBlockWithAnchor)` inside the map and pass `id={wrapperID}` to every wrapper `<div>` in each switch case instead of only setting `id` in the Content case.

- [ ] **Step 2: Prefer manual anchors in table-of-contents population**

Modify block typing in `src/hooks/populateTableOfContents.ts`:

```ts
type ContentBlockRow = {
  id?: number | string | null
  manualAnchor?: string | null
  columns?: ContentColumn[] | null
}

type SectionBlockRow = {
  id?: number | string | null
  blockName?: string | null
  heading?: string | null
  manualAnchor?: string | null
}

const getManualAnchor = (value: unknown): string | undefined => {
  const anchor = typeof value === 'string' ? value.trim() : ''
  return anchor || undefined
}
```

In the section branch, replace:

```ts
const id = sectionAnchorFor(block as SectionBlockRow, sectionCounter)
```

with:

```ts
const id = getManualAnchor(block.manualAnchor) || sectionAnchorFor(block as SectionBlockRow, sectionCounter)
```

In the content branch, replace:

```ts
const id = normalizeAnchor(text)
```

with:

```ts
const id = getManualAnchor(block.manualAnchor) || normalizeAnchor(text)
```

- [ ] **Step 3: Include manual anchors in current-page anchor options**

Modify `src/utilities/homepageAnchors.ts` types and layout option logic:

```ts
type LayoutSectionLike = {
  blockName?: string | null
  blockType?: string | null
  heading?: string | null
  id?: number | string | null
  manualAnchor?: string | null
}

const getManualAnchor = (block: LayoutSectionLike): string | undefined => {
  const anchor = typeof block.manualAnchor === 'string' ? block.manualAnchor.trim() : ''
  return anchor || undefined
}
```

In `getAnchorOptionsFromLayout`, remove the `if (block.blockType !== 'section') return` guard and instead include any block with a manual anchor, while preserving generated section anchors for Section blocks:

```ts
const manualAnchor = getManualAnchor(block)
const isSection = block.blockType === 'section'

if (!manualAnchor && !isSection) return

if (isSection) sectionCounter += 1

if (typeof currentLayoutIndex === 'number' && layoutIndex === currentLayoutIndex) return

const labelSource = block.heading || block.blockName || block.blockType
const label = labelSource?.trim() || `Block ${layoutIndex + 1}`

options.push({
  label: isSection ? `${sectionCounter}. ${label}` : label,
  value: manualAnchor || getSectionAnchorValue(block, sectionCounter),
})
```

- [ ] **Step 4: Run the Page anchor tests**

Run:

```bash
pnpm vitest run --config ./vitest.config.mts tests/int/page-layout-anchors.int.spec.ts
```

Expected: rendering assertions should pass; link assertions may still fail until Task 4.

- [ ] **Step 5: Commit Task 3**

Run:

```bash
git add src/blocks/RenderBlocks.tsx src/hooks/populateTableOfContents.ts src/utilities/homepageAnchors.ts tests/int/page-layout-anchors.int.spec.ts
git commit -m "Render page layout manual anchors"
```

## Task 4: Add Page anchor support to shared links and CTA link config

**Files:**
- Modify: `src/fields/link.ts`
- Modify: `src/fields/linkGroup.ts`
- Modify: `src/components/Link/index.tsx`
- Modify: `src/blocks/CallToAction/config.ts`
- Test: `tests/int/page-layout-anchors.int.spec.ts`

- [ ] **Step 1: Add `enablePageAnchor` to `link()`**

Modify `src/fields/link.ts` option type:

```ts
type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  enableHomepageAnchor?: boolean
  enablePageAnchor?: boolean
  overrides?: Partial<GroupField>
}) => Field
```

Destructure the option:

```ts
export const link: LinkType = ({
  appearances,
  disableLabel = false,
  enableHomepageAnchor = false,
  enablePageAnchor = false,
  overrides = {},
} = {}) => {
```

After the `reference` relationship field in `linkTypes`, add:

```ts
...(enablePageAnchor
  ? [
      {
        name: 'pageAnchor',
        type: 'text' as const,
        admin: {
          condition: (_data, siblingData) => siblingData?.type === 'reference',
          description:
            'Optional anchor on the selected Page. Use the Page block manual anchor without #.',
        },
        label: 'Page anchor',
      },
    ]
  : []),
```

Keep the field optional and do not require it for Post links.

- [ ] **Step 2: Pass `enablePageAnchor` through `linkGroup()`**

Modify `src/fields/linkGroup.ts`:

```ts
type LinkGroupType = (options?: {
  appearances?: LinkAppearances[] | false
  enablePageAnchor?: boolean
  overrides?: Partial<ArrayField>
}) => Field

export const linkGroup: LinkGroupType = ({ appearances, enablePageAnchor = false, overrides = {} } = {}) => {
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    fields: [
      link({
        appearances,
        enablePageAnchor,
      }),
    ],
    admin: {
      initCollapsed: true,
    },
  }

  return deepMerge(generatedLinkGroup, overrides)
}
```

- [ ] **Step 3: Append Page anchors in `CMSLink`**

Modify `src/components/Link/index.tsx` type and href resolution:

```ts
type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  homepageAnchor?: string | null
  label?: string | null
  newTab?: boolean | null
  pageAnchor?: string | null
  reference?: {
    relationTo: 'landing-pages' | 'pages' | 'posts'
    value: LandingPage | Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'homepageAnchor' | 'reference' | null
  url?: string | null
}

const normalizeAnchor = (value: string | null | undefined): string =>
  typeof value === 'string' ? value.trim().replace(/^#/, '') : ''

const getReferenceHref = (reference: CMSLinkType['reference'], pageAnchor?: string | null) => {
  if (typeof reference?.value !== 'object' || !reference.value.slug) return null

  const basePath =
    reference.relationTo === 'posts'
      ? `/posts/${reference.value.slug}`
      : reference.value.slug === 'home'
        ? '/'
        : `/${reference.value.slug}`

  const normalizedPageAnchor = reference.relationTo === 'pages' ? normalizeAnchor(pageAnchor) : ''
  return normalizedPageAnchor ? `${basePath}#${normalizedPageAnchor}` : basePath
}
```

Destructure `pageAnchor` and replace the `type === 'reference'` branch with:

```ts
: type === 'reference'
  ? getReferenceHref(reference, pageAnchor)
  : url
```

- [ ] **Step 4: Enable Page anchors for CTA link groups**

Ensure `src/blocks/CallToAction/config.ts` has:

```ts
linkGroup({
  appearances: ['default', 'outline'],
  enablePageAnchor: true,
  overrides: {
    maxRows: 2,
  },
}),
```

- [ ] **Step 5: Run the Page anchor tests**

Run:

```bash
pnpm vitest run --config ./vitest.config.mts tests/int/page-layout-anchors.int.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Commit Task 4**

Run:

```bash
git add src/fields/link.ts src/fields/linkGroup.ts src/components/Link/index.tsx src/blocks/CallToAction/config.ts tests/int/page-layout-anchors.int.spec.ts
git commit -m "Support page anchors in shared links"
```

## Task 5: Add CTA button-only rendering tests and implementation

**Files:**
- Create: `tests/int/cta-links-rendering.int.spec.tsx`
- Modify: `src/blocks/CallToAction/Component.tsx`

- [ ] **Step 1: Write failing CTA rendering tests**

Create `tests/int/cta-links-rendering.int.spec.tsx`:

```tsx
import { cleanup, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import type { CallToActionBlock as CallToActionBlockType } from '@/payload-types'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('@/components/RichText', () => ({
  default: ({ data, className }: { className?: string; data: unknown }) => (
    <div className={className} data-testid="cta-rich-text">
      {JSON.stringify(data)}
    </div>
  ),
}))

afterEach(() => {
  cleanup()
})

const richTextWithParagraph = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ text: 'Start your project today', type: 'text' }],
      },
    ],
  },
}

const emptyRichText = {
  root: {
    type: 'root',
    children: [],
  },
}

const ctaBlock = (richText: unknown): CallToActionBlockType =>
  ({
    blockType: 'cta',
    richText,
    links: [
      {
        link: {
          type: 'reference',
          label: 'See pricing',
          reference: { relationTo: 'pages', value: { slug: 'services' } },
          pageAnchor: 'pricing',
          appearance: 'default',
        },
      },
    ],
  }) as CallToActionBlockType

describe('CallToActionBlock rendering', () => {
  it('preserves card mode when rich text has content', () => {
    const { container } = render(<CallToActionBlock {...ctaBlock(richTextWithParagraph)} />)

    expect(screen.getByTestId('cta-rich-text')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'See pricing' }).getAttribute('href')).toBe(
      '/services#pricing',
    )
    expect(container.querySelector('.bg-card')).not.toBeNull()
    expect(container.querySelector('.border-border')).not.toBeNull()
  })

  it('renders button-only mode when rich text is empty', () => {
    const { container } = render(<CallToActionBlock {...ctaBlock(emptyRichText)} />)

    expect(screen.queryByTestId('cta-rich-text')).toBeNull()
    expect(screen.getByRole('link', { name: 'See pricing' }).getAttribute('href')).toBe(
      '/services#pricing',
    )
    expect(container.querySelector('.bg-card')).toBeNull()
    expect(container.querySelector('.border-border')).toBeNull()
  })
})
```

- [ ] **Step 2: Run CTA tests and verify they fail**

Run:

```bash
pnpm vitest run --config ./vitest.config.mts tests/int/cta-links-rendering.int.spec.tsx
```

Expected: FAIL because CTA always renders card mode.

- [ ] **Step 3: Implement rich-text content detection and button-only rendering**

Modify `src/blocks/CallToAction/Component.tsx`:

```tsx
import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

const hasTextNodeContent = (node: unknown): boolean => {
  if (!node || typeof node !== 'object') return false

  const text = (node as { text?: unknown }).text
  if (typeof text === 'string' && text.trim().length > 0) return true

  const children = (node as { children?: unknown }).children
  return Array.isArray(children) && children.some(hasTextNodeContent)
}

const hasRichTextContent = (richText: CTABlockProps['richText']): boolean => {
  if (!richText || typeof richText !== 'object') return false
  return hasTextNodeContent(richText)
}

const CTALinks: React.FC<Pick<CTABlockProps, 'links'>> = ({ links }) => (
  <div className="flex flex-col gap-8">
    {(links || []).map(({ link }, i) => {
      return <CMSLink key={i} size="lg" {...link} />
    })}
  </div>
)

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  const hasContent = hasRichTextContent(richText)

  if (!hasContent) {
    return (
      <div className="container">
        <CTALinks links={links} />
      </div>
    )
  }

  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-3xl flex items-center">
          <RichText className="mb-0" data={richText} enableGutter={false} />
        </div>
        <CTALinks links={links} />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run CTA tests**

Run:

```bash
pnpm vitest run --config ./vitest.config.mts tests/int/cta-links-rendering.int.spec.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit Task 5**

Run:

```bash
git add src/blocks/CallToAction/Component.tsx tests/int/cta-links-rendering.int.spec.tsx
git commit -m "Render empty CTA blocks as buttons only"
```

## Task 6: Regenerate types, format/lint, run tests, and run Fallow

**Files:**
- Modify: `src/payload-types.ts`
- Modify if generated: `src/app/(payload)/admin/importMap.js`

- [ ] **Step 1: Regenerate Payload types**

Run:

```bash
pnpm generate:types
```

Expected: `src/payload-types.ts` updates and includes `manualAnchor?: string | null` on non-Hero Page layout blocks and `pageAnchor?: string | null` on enabled link groups.

- [ ] **Step 2: Regenerate import map if Payload reports component import changes**

Run:

```bash
pnpm generate:importmap
```

Expected: command succeeds. Commit `src/app/(payload)/admin/importMap.js` only if it changes.

- [ ] **Step 3: Run focused tests**

Run:

```bash
pnpm vitest run --config ./vitest.config.mts tests/int/page-layout-anchors.int.spec.ts tests/int/cta-links-rendering.int.spec.tsx
```

Expected: PASS.

- [ ] **Step 4: Run full integration tests**

Run:

```bash
pnpm test:int
```

Expected: PASS.

- [ ] **Step 5: Run TypeScript validation**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected: PASS.

- [ ] **Step 6: Run lint**

Run:

```bash
pnpm lint
```

Expected: PASS.

- [ ] **Step 7: Run Fallow changed-file audit**

Run exactly with JSON-safe flags:

```bash
pnpm exec fallow audit --base origin/main --format json --quiet --explain 2>/dev/null || true
```

Expected: command completes with valid JSON on stdout. Exit code 1 means issues were found and must be reviewed; exit code 2 means a Fallow runtime/config error that must be fixed or reported. Summarize any findings and decide whether they are new issues from this change or pre-existing baseline noise.

- [ ] **Step 8: Review git diff**

Run:

```bash
git status --short --branch
git diff --stat
git diff
```

Expected: only issue #12/#13 implementation files, tests, generated Payload types, and this plan/spec history are changed.

- [ ] **Step 9: Commit generated/verification changes**

Run:

```bash
git add src/payload-types.ts src/app/\(payload\)/admin/importMap.js
git commit -m "Regenerate payload types for page anchors"
```

If `src/app/(payload)/admin/importMap.js` did not change, omit it from `git add`. If there are no generated changes beyond files already committed, skip this commit and record that no generated commit was needed.

## Plan Self-Review

- Spec coverage: Tasks cover manual anchors, duplicate validation, frontend ids, Page+anchor links, CTA button-only mode, generated types, tests, and Fallow.
- Placeholder scan: No placeholder markers remain; each code-changing step includes concrete snippets or exact edits.
- Type consistency: `manualAnchor`, `pageAnchor`, `enablePageAnchor`, `validatePageLayoutAnchors`, and `manualAnchorField` names are used consistently across tasks.
