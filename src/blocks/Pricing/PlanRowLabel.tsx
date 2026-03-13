'use client'

import { RowLabelProps, useRowLabel } from '@payloadcms/ui'
import React from 'react'

type PlanRow = {
  planName?: string | null
  stylePreset?: string | null
}

const stylePresetLabelMap: Record<string, string> = {
  style1: 'Style 1 - Emerald',
  style2: 'Style 2 - Blue',
  style3: 'Style 3 - Amber',
  style4: 'Style 4 - Violet',
  style5: 'Style 5 - Orange',
}

export const PlanRowLabel: React.FC<RowLabelProps> = () => {
  const row = useRowLabel<PlanRow>()
  const rowNumber = typeof row.rowNumber === 'number' ? row.rowNumber + 1 : undefined
  const planName = row.data?.planName?.trim()
  const stylePresetLabel =
    typeof row.data?.stylePreset === 'string' && stylePresetLabelMap[row.data.stylePreset]
      ? stylePresetLabelMap[row.data.stylePreset]
      : stylePresetLabelMap.style1

  if (planName) {
    return <span>{`${rowNumber ? `${rowNumber}. ` : ''}${planName} • ${stylePresetLabel}`}</span>
  }

  return <span>{`${rowNumber ? `Plan ${rowNumber}` : 'Plan'} • ${stylePresetLabel}`}</span>
}
