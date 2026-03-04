import { cn } from '@/utilities/ui'
import React from 'react'

export type SectionBackground = 'default' | 'even' | 'subtle'

const backgroundClassName: Record<SectionBackground, string> = {
  default: 'bg-background',
  even: 'bg-(--even-background)',
  subtle: 'bg-(--subtle-background)',
}

export const SectionShell: React.FC<{
  background?: SectionBackground | null
  children: React.ReactNode
  className?: string
  id?: string
  innerClassName?: string
}> = ({ background = 'default', children, className, id, innerClassName }) => {
  const bg = background ?? 'default'

  return (
    <section className={cn(backgroundClassName[bg], className)} id={id}>
      <div className={cn('container', innerClassName)}>{children}</div>
    </section>
  )
}
