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
) => {
  throw new ValidationError({
    collection: 'pages',
    errors: [
      {
        path: 'layout',
        message,
      },
    ],
    req,
  })
}

export const validatePageLayoutAnchors: CollectionBeforeValidateHook = ({ data, req }) => {
  const layout = Array.isArray(data?.layout) ? data.layout : []
  const seen = new Set<string>()

  for (const rawBlock of layout) {
    if (!rawBlock || typeof rawBlock !== 'object') continue

    const anchor = normalizeManualAnchor((rawBlock as LayoutBlockWithManualAnchor).manualAnchor)
    if (!anchor) continue

    if (!isValidManualAnchor(anchor)) {
      throwLayoutValidationError(manualAnchorValidationMessage, req)
    }

    if (seen.has(anchor)) {
      throwLayoutValidationError(
        `Manual anchors must be unique within a page. Duplicate anchor: ${anchor}.`,
        req,
      )
    }

    seen.add(anchor)
  }

  return data
}
