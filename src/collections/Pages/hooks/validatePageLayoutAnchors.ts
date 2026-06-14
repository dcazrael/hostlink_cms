import { ValidationError, type CollectionBeforeValidateHook } from 'payload'

import {
  isValidManualAnchor,
  manualAnchorValidationMessage,
  normalizeManualAnchor,
} from '@/fields/pageAnchor'

type LayoutBlockWithManualAnchor = {
  manualAnchor?: unknown
}

const throwLayoutValidationError = (
  message: string,
  req: Parameters<CollectionBeforeValidateHook>[0]['req'],
  path: string,
) => {
  throw new ValidationError({
    collection: 'pages',
    errors: [
      {
        path,
        message,
      },
    ],
    req,
  })
}

export const validatePageLayoutAnchors: CollectionBeforeValidateHook = ({ data, req }) => {
  const layout = Array.isArray(data?.layout) ? data.layout : []
  const seen = new Map<string, number>()

  for (const [index, rawBlock] of layout.entries()) {
    if (!rawBlock || typeof rawBlock !== 'object') continue

    const anchor = normalizeManualAnchor((rawBlock as LayoutBlockWithManualAnchor).manualAnchor)
    if (!anchor) continue

    const path = `layout.${index}.manualAnchor`

    if (!isValidManualAnchor(anchor)) {
      throwLayoutValidationError(manualAnchorValidationMessage, req, path)
    }

    const firstIndex = seen.get(anchor)
    if (firstIndex !== undefined) {
      throwLayoutValidationError(
        `Manual anchors must be unique within a page. Duplicate anchor: ${anchor} also appears at layout.${firstIndex}.manualAnchor.`,
        req,
        path,
      )
    }

    seen.set(anchor, index)
  }

  return data
}
