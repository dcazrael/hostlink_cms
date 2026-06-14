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
