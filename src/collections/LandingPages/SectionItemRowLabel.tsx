'use client'

import { RowLabelProps, useRowLabel } from '@payloadcms/ui'
import React from 'react'

type SectionValue = {
  id?: number | string | null
  title?: string | null
  value?: number | string | { id?: number | string | null; title?: string | null } | null
}

const extractSectionTitle = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') return null

  const direct = value as SectionValue
  if (typeof direct.title === 'string' && direct.title.trim().length > 0) {
    return direct.title.trim()
  }

  if (direct.value && typeof direct.value === 'object') {
    const nestedTitle = (direct.value as { title?: unknown }).title
    if (typeof nestedTitle === 'string' && nestedTitle.trim().length > 0) {
      return nestedTitle.trim()
    }
  }

  return null
}

export const SectionItemRowLabel: React.FC<RowLabelProps> = () => {
  const row = useRowLabel<{ section?: unknown }>()
  const rowNumber = typeof row.rowNumber === 'number' ? row.rowNumber + 1 : undefined
  const sectionTitle = extractSectionTitle(row?.data?.section)

  if (sectionTitle) {
    return <span>{`${rowNumber ? `${rowNumber}. ` : ''}${sectionTitle}`}</span>
  }

  return <span>{rowNumber ? `Section ${rowNumber}` : 'Section item'}</span>
}
