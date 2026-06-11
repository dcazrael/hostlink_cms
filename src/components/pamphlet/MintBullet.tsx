import * as React from 'react'
import { cn } from '@/utilities/ui'

export type MintBulletShape = 'square' | 'diamond' | 'bar' | 'circle'

/**
 * `MintBullet` is the small mint marker that begins each row in a
 * pamphlet list — a tilted square, a short mint bar, a diamond, or a
 * dot. It is rendered as a span-like decorative block. Callers compose
 * it into their own list markup so that the marker is positioned
 * relative to the row text the consumer provides via `children`.
 */
export const MintBullet: React.FC<{
  shape?: MintBulletShape
  /**
   * Marker size in Tailwind spacing units (square diamond / circle) or
   * dimensions expressed as width × height (bar). Defaults to `size-2.5`.
   */
  sizeClassName?: string
  className?: string
  /**
   * Readable label announced by screen readers in place of the marker.
   * When omitted the marker is `aria-hidden` and the row text owns the
   * semantics.
   */
  ariaLabel?: string
}> = ({ shape = 'square', sizeClassName = 'size-2.5', className, ariaLabel }) => {
  const wrapperClass = cn('inline-block shrink-0 bg-(--accent)', className)

  if (shape === 'bar') {
    return (
      <span
        aria-hidden={ariaLabel ? undefined : true}
        aria-label={ariaLabel}
        className={cn('inline-block h-1 w-6 -skew-x-12 bg-(--accent)', className)}
        data-testid="pamphlet-mint-bullet"
      />
    )
  }

  if (shape === 'diamond') {
    return (
      <span
        aria-hidden={ariaLabel ? undefined : true}
        aria-label={ariaLabel}
        className={cn(wrapperClass, sizeClassName, 'rotate-45')}
        data-testid="pamphlet-mint-bullet"
      />
    )
  }

  if (shape === 'circle') {
    return (
      <span
        aria-hidden={ariaLabel ? undefined : true}
        aria-label={ariaLabel}
        className={cn(wrapperClass, sizeClassName, 'rounded-full')}
        data-testid="pamphlet-mint-bullet"
      />
    )
  }

  return (
    <span
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cn(wrapperClass, sizeClassName)}
      data-testid="pamphlet-mint-bullet"
    />
  )
}

export const MintBulletList: React.FC<{
  items: Array<{ title: string; body?: string }>
  shape?: MintBulletShape
  className?: string
}> = ({ items, shape = 'square', className }) => (
  <ul className={cn('flex flex-col gap-3', className)}>
    {items.map((item) => (
      <li key={item.title} className="flex items-start gap-3">
        <span className="inline-flex h-5 items-center">
          <MintBullet shape={shape} />
        </span>
        <span className="grid gap-1">
          <span className="text-sm font-semibold text-current">{item.title}</span>
          {item.body ? <span className="text-sm text-current/75">{item.body}</span> : null}
        </span>
      </li>
    ))}
  </ul>
)
