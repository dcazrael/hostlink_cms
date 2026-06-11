import React from 'react'

import { resolveLucideName } from '@/components/homepage/utils'
import { LucideIcon } from '@/components/LucideIcon'
import type { GridComponentBlock, Icon } from '@/payload-types'

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
            <article
              className="rounded-xl border border-border from-bg-card to-primary/10 bg-linear-to-br from-50% to-150% hover:from-0% hover:to-100% p-5 transition-colors duration-300"
              key={item.id || index}
            >
              <h3 className="inline-flex items-center gap-4 text-lg font-semibold">
                {iconName ? <LucideIcon className="size-6 text-primary" name={iconName} /> : null}
                <span className="whitespace-pre-line">{item.title}</span>
              </h3>
              {item.sub && (
                <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{item.sub}</p>
              )}
              {item.description && <p className="mt-2 text-muted-foreground">{item.description}</p>}
            </article>
          )
        })}
      </div>
    </div>
  )
}
