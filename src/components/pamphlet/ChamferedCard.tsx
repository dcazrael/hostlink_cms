import * as React from 'react'
import { cn } from '@/utilities/ui'

export type ChamferedCardCorner = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export type ChamferedCardTone = 'card' | 'subtle' | 'background' | 'navy' | 'mint'

/**
 * `ChamferedCard` is the small polygon card on the pamphlet — a rectangle
 * with a single corner cut at 45° and a hairline border on the remaining
 * edges. It is meant to host compact content rows (label + value, step
 * number + description) and stays semantically neutral: callers wrap it in
 * whatever landmark fits, and the card itself renders a `<div>` so it does
 * not impose structure.
 *
 * Accessibility:
 *  - When the card is purely decorative — no `children` and no
 *    `ariaLabel` — it renders as `aria-hidden` so screen readers skip it.
 *  - When `children` are provided, the card stays in the accessibility
 *    tree and the descendant content is announced normally.
 *  - When `ariaLabel` is supplied, the card is treated as a labelled
 *    region (decorative or otherwise) and announced with that label.
 */
export const ChamferedCard: React.FC<{
  tone?: ChamferedCardTone
  /** Which corner receives the chamfer. Defaults to top-right. */
  corner?: ChamferedCardCorner
  /**
   * Chamfer depth as a percentage of the shorter side. 0 disables the cut
   * and renders a regular rounded rectangle. Clamped to `[0, 30]`.
   */
  depth?: number
  /**
   * Optional content rendered inside the card. When present, the wrapper
   * is NOT marked `aria-hidden` and descendant content is announced by
   * assistive tech.
   */
  children?: React.ReactNode
  className?: string
  innerClassName?: string
  /**
   * Accessible label for the card. When supplied, the card is treated as
   * a labelled region and the descendants are still announced. The card
   * is only `aria-hidden` when both this prop and `children` are absent.
   */
  ariaLabel?: string
}> = ({
  tone = 'card',
  corner = 'top-right',
  depth = 10,
  children,
  className,
  innerClassName,
  ariaLabel,
}) => {
  const safeDepth = Math.max(0, Math.min(30, depth))
  const d = `${safeDepth}%`

  const clipPath = (() => {
    if (safeDepth === 0) return undefined
    switch (corner) {
      case 'top-right':
        return `polygon(0% 0%, calc(100% - ${d}) 0%, 100% ${d}, 100% 100%, 0% 100%)`
      case 'top-left':
        return `polygon(0% ${d}, ${d} 0%, 100% 0%, 100% 100%, 0% 100%)`
      case 'bottom-right':
        return `polygon(0% 0%, 100% 0%, 100% calc(100% - ${d}), calc(100% - ${d}) 100%, 0% 100%)`
      case 'bottom-left':
        return `polygon(0% 0%, 100% 0%, 100% 100%, ${d} 100%, 0% calc(100% - ${d}))`
    }
  })()

  const toneClass: Record<ChamferedCardTone, string> = {
    card: 'bg-card text-card-foreground border-border',
    subtle: 'bg-(--subtle-background) text-(--heading) border-border',
    background: 'bg-background text-foreground border-border',
    navy: 'bg-(--secondary) text-(--secondary-foreground) border-(--secondary)',
    mint: 'bg-(--accent) text-(--accent-foreground) border-(--accent)',
  }

  // Decorative only when there is no label AND no children to announce.
  const isDecorative = !ariaLabel && children == null

  return (
    <div
      aria-hidden={isDecorative || undefined}
      aria-label={ariaLabel}
      className={cn('relative w-full border', toneClass[tone], className)}
      style={clipPath ? { clipPath } : undefined}
    >
      <div className={cn('px-5 py-5 md:px-6 md:py-6', innerClassName)}>{children}</div>
    </div>
  )
}
