import { cn } from '@/utilities/ui'
import * as React from 'react'

export type BulletShape = 'square' | 'diamond' | 'polygon' | 'circle' | 'bar'

const BULLET_SHAPE_CLASSES: Record<BulletShape, string> = {
  square: '',
  diamond: 'rotate-45',
  polygon: 'h-2 w-6 -skew-x-12',
  circle: 'rounded-full',
  bar: 'h-5 w-2',
}

export const Bullet: React.FC<{
  shape?: BulletShape
  sizeClassName?: string
  className?: string
  ariaLabel?: string
}> = ({ shape = 'square', sizeClassName = 'size-2.5', className, ariaLabel }) => {
  const shapeClassName = BULLET_SHAPE_CLASSES[shape]
  const usesFixedSize = shape === 'polygon' || shape === 'bar'

  return (
    <span
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cn(
        'inline-block shrink-0 bg-accent',
        usesFixedSize ? undefined : sizeClassName,
        shapeClassName,
        className,
      )}
      data-testid="pattern-mint-bullet"
    />
  )
}

export const BulletList: React.FC<{
  items: React.ReactNode[]
  shape?: BulletShape
  className?: string
  itemClassName?: string
}> = ({ items, shape = 'square', className, itemClassName }) => (
  <ul className={cn('flex flex-col gap-3', className)}>
    {items.map((item, index) => (
      <li className={cn('flex items-start gap-3', itemClassName)} key={index}>
        <span className="inline-flex h-5 items-center">
          <Bullet shape={shape} />
        </span>
        <span className="text-sm text-current">{item}</span>
      </li>
    ))}
  </ul>
)

export const FeatureList: React.FC<{
  items: Array<{ title: string; text?: React.ReactNode }>
  shape?: BulletShape
  className?: string
}> = ({ items, shape = 'square', className }) => (
  <ul className={cn('flex flex-col gap-3', className)}>
    {items.map((item) => (
      <li key={item.title} className="flex items-start gap-3">
        <span className="inline-flex h-5 items-center">
          <Bullet shape={shape} />
        </span>
        <span className="grid gap-1">
          <span className="text-sm font-semibold text-current">{item.title}</span>
          {item.text ? <span className="text-sm text-current/75">{item.text}</span> : null}
        </span>
      </li>
    ))}
  </ul>
)

export default BulletList
