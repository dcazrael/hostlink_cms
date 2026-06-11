import type { CollectionBeforeChangeHook } from 'payload'
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

const collectHeadingsFromRichText = (richText: unknown): HeadingItem[] => {
  if (!richText || typeof richText !== 'object') return []
  const root = (richText as { root?: { children?: unknown[] } }).root
  if (!root || !Array.isArray(root.children)) return []

  const out: HeadingItem[] = []
  const walk = (nodes: unknown[]): void => {
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue
      const n = node as { type?: string; tag?: string; children?: unknown[]; text?: string }
      const tag = (n.tag ?? n.type ?? '').toString().toLowerCase()
      if (tag === 'h2' || tag === 'h3' || tag === 'h4') {
        const text = (n.text ?? '').toString().trim()
        if (text) {
          const id = normalizeAnchor(text)
          if (id) out.push({ id, text })
        }
      }
      if (Array.isArray(n.children)) walk(n.children)
    }
  }
  walk(root.children)
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
  let contentCounter = 0

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
      contentCounter += 1
      const columns = Array.isArray(block.columns) ? block.columns : []
      for (const col of columns) {
        if (!col || typeof col !== 'object') continue
        const c = col as ContentColumn
        if (typeof c.tocTitle === 'string' && c.tocTitle.trim().length > 0) {
          const text = c.tocTitle.trim()
          const id = normalizeAnchor(text)
          if (id) collected.push({ id, text })
        }
        const fromRichText = collectHeadingsFromRichText(c.richText)
        for (const h of fromRichText) collected.push(h)
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
