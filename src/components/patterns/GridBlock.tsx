/**
 * GridBlock renders items in a responsive CSS grid (1–4 columns).
 * Each item is rendered via GridBlockItem with configurable border radius
 * and accent tone. Use for service listings, feature grids, or card catalogs.
 *
 * @summary responsive feature grid
 */
import { cn } from '@/utilities/ui'
import * as React from 'react'
import { GridBlockItem } from './GridBlockItem'
import type {
  GridBlockItemAccentTone,
  GridBlockItemData,
  GridBlockItemRadius,
} from './GridBlockItem'

export type GridBlockColumns = '1' | '2' | '3' | '4'

const COLUMN_CLASSES: Record<GridBlockColumns, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 lg:grid-cols-2',
  '3': 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

export type GridBlockProps = {
  columns: GridBlockColumns
  items: GridBlockItemData[]
  borderRadius?: GridBlockItemRadius
  accentTone?: GridBlockItemAccentTone
  className?: string
}

export const GridBlock: React.FC<GridBlockProps> = ({
  columns,
  items,
  borderRadius = 'xl',
  accentTone = 'accent',
  className,
}) => (
  <div
    className={cn('grid gap-5', COLUMN_CLASSES[columns], className)}
    data-testid="pattern-grid-block"
  >
    {items.map((item, index) => (
      <GridBlockItem
        accentTone={item.accentTone ?? accentTone}
        borderRadius={item.borderRadius ?? borderRadius}
        iconName={item.iconName}
        infoItems={item.infoItems}
        key={item.title ?? index}
        text={item.text}
        title={item.title}
        variant={item.variant}
      />
    ))}
  </div>
)
