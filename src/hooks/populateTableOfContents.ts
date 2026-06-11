import type {
  CollectionBeforeChangeHook,
  CollectionBeforeValidateHook,
  ValidationError as PayloadValidationError,
} from 'payload'
import type { Page as PageType } from '../payload-types'

type ContentColumn = {
  richText?: unknown
  tocTitle?: string | null
}

type ContentBlockRow = {
  id?: number | string | null
  columns?: ContentColumn[] | null
}

type SectionBlockRow = {
  id?: number | string | null
  blockName?: string | null
  heading?: string | null
}

type HeadingItem = {
  id: string
  text: string
}

const normalizeAnchor = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_-]+/gu, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

const dedupe = (items: HeadingItem[]): HeadingItem[] => {
  const seen = new Set<string>()
  const out: HeadingItem[] = []
  for (const item of items) {
    if (!item.id || !item.text) continue
    if (seen.has(item.id)) continue
    seen.add(item.id)
    out.push(item)
  }
  return out
}

const sectionAnchorFor = (block: SectionBlockRow, sectionIndex: number): string => {
  const semantic =
    (typeof block.blockName === 'string' && block.blockName.trim().length > 0
      ? block.blockName
      : typeof block.heading === 'string' && block.heading.trim().length > 0
        ? block.heading
        : null) || null
  if (semantic) {
    const normalized = normalizeAnchor(semantic)
    if (normalized) return `section-${normalized}`
  }
  if (typeof block.id === 'string' && block.id.trim().length > 0) {
    const normalized = normalizeAnchor(block.id)
    if (normalized) return `section-${normalized}`
  }
  if (typeof block.id === 'number') return `section-${block.id}`
  return `section-${sectionIndex}`
}

const collectFromLayout = (layout: unknown): HeadingItem[] => {
  if (!Array.isArray(layout)) return []

  const collected: HeadingItem[] = []
  let sectionCounter = 0

  for (const raw of layout) {
    if (!raw || typeof raw !== 'object') continue
    const block = raw as {
      blockType?: string
      id?: number | string | null
      blockName?: string | null
      heading?: string | null
      columns?: ContentColumn[] | null
    }

    if (block.blockType === 'section') {
      sectionCounter += 1
      const text = (block.heading || block.blockName || `Section ${sectionCounter}`)
        .toString()
        .trim()
      if (text) {
        const id = sectionAnchorFor(block as SectionBlockRow, sectionCounter)
        collected.push({ id, text })
      }
      continue
    }

    if (block.blockType === 'content') {
      const columns = Array.isArray(block.columns) ? block.columns : []
      for (const col of columns) {
        if (!col || typeof col !== 'object') continue
        const c = col as ContentColumn
        if (typeof c.tocTitle === 'string' && c.tocTitle.trim().length > 0) {
          const text = c.tocTitle.trim()
          const id = normalizeAnchor(text)
          if (id) collected.push({ id, text })
        }
      }
    }
  }

  return dedupe(collected)
}

const sameHeadings = (a: HeadingItem[] | null | undefined, b: HeadingItem[]): boolean => {
  if (!a || a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].id !== b[i].id || a[i].text !== b[i].text) return false
  }
  return true
}

export const populateTableOfContents: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const next = collectFromLayout((data as PageType | null)?.layout)
  const current = (originalDoc as PageType | null)?.tableOfContentsHeadings as
    | HeadingItem[]
    | null
    | undefined

  if (sameHeadings(current ?? undefined, next)) {
    return data
  }

  return {
    ...(data as PageType),
    tableOfContentsHeadings: next,
  }
}

export const enforceTocTitle: CollectionBeforeValidateHook = ({ data, req }) => {
  const page = (data ?? {}) as PageType
  if (page.showTableOfContents !== true) return data

  const layout = Array.isArray(page.layout) ? page.layout : []
  const errors: { path: string; message: string }[] = []

  for (let i = 0; i < layout.length; i += 1) {
    const block = layout[i] as { blockType?: string; columns?: ContentColumn[] | null } | null
    if (!block || block.blockType !== 'content') continue
    const columns = Array.isArray(block.columns) ? block.columns : []
    for (let c = 0; c < columns.length; c += 1) {
      const col = columns[c] as ContentColumn | null
      const title = typeof col?.tocTitle === 'string' ? col.tocTitle.trim() : ''
      if (!title) {
        errors.push({
          path: `layout.${i}.columns.${c}.tocTitle`,
          message: 'ToC Title is required when Show Table of Contents is enabled.',
        })
      }
    }
  }

  if (errors.length === 0) return data

  const ValidationErrorCtor = (
    req.payload as unknown as {
      errors?: { APIError?: new (data: unknown) => unknown }
    }
  ).errors?.APIError
  const err = ValidationErrorCtor
    ? new ValidationErrorCtor({ collection: 'pages', errors, req })
    : Object.assign(new Error('Validation failed'), { data: { collection: 'pages', errors } })

  throw err as PayloadValidationError
}
