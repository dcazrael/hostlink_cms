import React from 'react'

import { resolveLucideName } from '@/components/homepage/utils'
import type { GridComponentBlock, Icon } from '@/payload-types'
import { GridBlockCard } from './GridBlockCard'

type GridItem = {
  id?: string | null
  icon?: number | Icon | null
  title: string
  sub?: string | null
  description?: string | null
}

type Props = {
  block: GridComponentBlock
}

const COLUMN_CLASSES: Record<string, string> = {
  '2': 'grid-cols-1 lg:grid-cols-2',
  '3': 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
}

export const GridBlockComponent: React.FC<Props> = ({ block }) => {
  const { items, columns = '3' } = block
  const gridClass = COLUMN_CLASSES[columns] || COLUMN_CLASSES['3']

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className={`grid gap-4 ${gridClass}`}>
        {(items || []).map((item: GridItem, index: number) => {
          const iconName = resolveLucideName(item.icon)

          return (
            <GridBlockCard
              description={item.description}
              iconName={iconName}
              key={item.id || index}
              sub={item.sub}
              title={item.title}
            />
          )
        })}
      </div>
    </div>
  )
}
