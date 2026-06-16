import { ValidationError, type CollectionBeforeValidateHook } from 'payload'

import { getDerivedAnchor } from '@/utilities/homepageAnchors'

type LayoutBlockWithAnchor = {
  anchor?: unknown
  blockName?: unknown
  heading?: unknown
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

const hasBlockName = (block: LayoutBlockWithAnchor): boolean =>
  typeof block.blockName === 'string' && block.blockName.trim().length > 0

const hasHeading = (block: LayoutBlockWithAnchor): boolean =>
  typeof block.heading === 'string' && block.heading.trim().length > 0

export const validatePageLayoutAnchors: CollectionBeforeValidateHook = ({ data, req }) => {
  const layout = Array.isArray(data?.layout) ? data.layout : []
  const seen = new Map<string, number>()

  for (const [index, rawBlock] of layout.entries()) {
    if (!rawBlock || typeof rawBlock !== 'object') continue

    const block = rawBlock as LayoutBlockWithAnchor
    if (block.anchor !== true) continue

    const path = `layout.${index}.anchor`

    if (!hasBlockName(block) && !hasHeading(block)) {
      throwLayoutValidationError(
        'Block must have a name or heading when used as an anchor.',
        req,
        path,
      )
    }

    const derived = getDerivedAnchor(block as Parameters<typeof getDerivedAnchor>[0])
    if (!derived) {
      throwLayoutValidationError(
        'Could not derive an anchor value from the block name or heading.',
        req,
        path,
      )
    }

    const firstIndex = seen.get(derived as string)
    if (firstIndex !== undefined) {
      throwLayoutValidationError(
        `Anchors must be unique within a page. Duplicate anchor: ${derived as string} also appears at layout.${firstIndex}.anchor.`,
        req,
        path,
      )
    }

    seen.set(derived as string, index)
  }

  return data
}
