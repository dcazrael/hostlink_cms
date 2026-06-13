import React from 'react'

import { LucideIcon } from '@/components/LucideIcon'
import { cn } from '@/utilities/ui'

export type GridBlockCardProps = {
  icon?: React.ReactNode
  iconName?: string | null
  title: string
  sub?: string | null
  description?: React.ReactNode
  className?: string
}

export const GridBlockCard: React.FC<GridBlockCardProps> = ({
  icon,
  iconName,
  title,
  sub,
  description,
  className,
}) => (
  <div
    className={cn(
      'rounded-xl border border-border from-bg-card to-primary/10 bg-linear-to-br from-50% to-150% p-5 transition-colors duration-300 hover:from-0% hover:to-100%',
      className,
    )}
  >
    <h3 className="inline-flex items-center gap-4 text-lg font-semibold">
      {icon ?? (iconName ? <LucideIcon className="size-6 text-primary" name={iconName} /> : null)}
      <span className="whitespace-pre-line">{title}</span>
    </h3>
    {sub ? <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{sub}</p> : null}
    {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
  </div>
)
