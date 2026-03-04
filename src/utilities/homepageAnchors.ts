type LayoutSectionLike = {
  blockName?: string | null
  blockType?: string | null
  heading?: string | null
  id?: number | string | null
}

type LandingSectionLike = {
  content?: unknown
  id?: number | string | null
  title?: string | null
}

export type AnchorOption = {
  label: string
  value: string
}

const normalizeAnchorToken = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    // Keep Unicode letters / numbers so non-Latin titles become readable anchors too.
    .replace(/[^\p{L}\p{N}_-]+/gu, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

export const getSectionAnchorValue = (block: LayoutSectionLike, sectionIndex: number): string => {
  const semanticSource =
    (typeof block.blockName === 'string' && block.blockName.trim().length > 0
      ? block.blockName
      : typeof block.heading === 'string' && block.heading.trim().length > 0
        ? block.heading
        : null) || null

  if (semanticSource) {
    const normalized = normalizeAnchorToken(semanticSource)
    if (normalized) return `section-${normalized}`
  }

  if (typeof block.id === 'string' && block.id.trim().length > 0) {
    const normalized = normalizeAnchorToken(block.id)
    if (normalized) return `section-${normalized}`
  }

  if (typeof block.id === 'number') {
    return `section-${block.id}`
  }

  return `section-${sectionIndex}`
}

export const getAnchorOptionsFromLayout = (
  layout: unknown,
  currentLayoutIndex?: number,
): AnchorOption[] => {
  if (!Array.isArray(layout)) return []

  let sectionCounter = 0
  const options: AnchorOption[] = []

  layout.forEach((rawBlock, layoutIndex) => {
    if (!rawBlock || typeof rawBlock !== 'object') return

    const block = rawBlock as LayoutSectionLike
    if (block.blockType !== 'section') return

    sectionCounter += 1

    // Avoid linking a section CTA to itself.
    if (typeof currentLayoutIndex === 'number' && layoutIndex === currentLayoutIndex) {
      return
    }

    const labelSource = block.heading || block.blockName
    const label = labelSource?.trim() || `Section ${sectionCounter}`

    options.push({
      label: `${sectionCounter}. ${label}`,
      value: getSectionAnchorValue(block, sectionCounter),
    })
  })

  return options
}

const normalizeDocumentID = (value: unknown): string | number | undefined => {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.length > 0) return value
  return undefined
}

const resolveLandingSectionDocument = (rawSection: unknown): LandingSectionLike | null => {
  if (!rawSection || typeof rawSection !== 'object') return null

  const relationValue = (rawSection as { value?: unknown }).value
  if (relationValue && typeof relationValue === 'object') {
    return relationValue as LandingSectionLike
  }

  return rawSection as LandingSectionLike
}

export const getAnchorOptionsFromLandingSections = (
  sections: unknown,
  currentSectionID?: string | number,
): AnchorOption[] => {
  if (!Array.isArray(sections)) return []

  const normalizedCurrentID = normalizeDocumentID(currentSectionID)
  let sectionCounter = 0
  const options: AnchorOption[] = []

  sections.forEach((rawSection) => {
    const sectionDoc = resolveLandingSectionDocument(rawSection)
    if (!sectionDoc) return

    const firstBlock = Array.isArray(sectionDoc.content) ? sectionDoc.content[0] : null
    if (!firstBlock || typeof firstBlock !== 'object') return

    const sectionBlock = firstBlock as LayoutSectionLike
    if (sectionBlock.blockType !== 'section') return

    sectionCounter += 1

    const normalizedSectionID = normalizeDocumentID(sectionDoc.id)
    if (
      normalizedCurrentID !== undefined &&
      normalizedSectionID !== undefined &&
      String(normalizedCurrentID) === String(normalizedSectionID)
    ) {
      return
    }

    const labelSource = sectionDoc.title || sectionBlock.heading || sectionBlock.blockName
    const label = labelSource?.trim() || `Section ${sectionCounter}`
    const sectionBlockWithTitle: LayoutSectionLike =
      typeof sectionDoc.title === 'string' && sectionDoc.title.trim().length > 0
        ? {
            ...sectionBlock,
            blockName: sectionDoc.title,
          }
        : sectionBlock

    options.push({
      label: `${sectionCounter}. ${label}`,
      value: getSectionAnchorValue(sectionBlockWithTitle, sectionCounter),
    })
  })

  return options
}
