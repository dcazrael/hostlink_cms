'use client'

import { RowLabelProps, useRowLabel } from '@payloadcms/ui'
import React from 'react'

type IncludedItemRow = {
  text?: string | null
}

export const IncludedItemRowLabel: React.FC<RowLabelProps> = () => {
  const row = useRowLabel<IncludedItemRow>()
  const rowNumber = typeof row.rowNumber === 'number' ? row.rowNumber + 1 : undefined
  const itemText = row.data?.text?.trim()

  if (itemText) {
    return <span>{`${rowNumber ? `${rowNumber}. ` : ''}${itemText}`}</span>
  }

  return <span>{rowNumber ? `Included item ${rowNumber}` : 'Included item'}</span>
}
