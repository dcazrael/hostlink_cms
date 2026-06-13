import * as React from 'react'
import {
  buildChamferClipPath,
  oppositeChamfer,
  resolveChamferCut,
  type ChamferCorner,
} from '@/components/ui/chamfer'
import { cn } from '@/utilities/ui'

export type ChamferedCardCorner = ChamferCorner

export type ChamferedCardTone = 'card' | 'subtle' | 'background' | 'navy' | 'mint'

/**
 * `ChamferedCard` is a rectangle with optional chamfered corners. The
 * primary cut is symmetric when `chamferDepth > 0`; otherwise the
 * asymmetric `chamferX`/`chamferY` values are used. The same rule
 * applies to the opposite-corner cut. The card is purely decorative
 * when no `children` and no `ariaLabel` are provided.
 */
export const ChamferedCard: React.FC<{
  tone?: ChamferedCardTone
  /** Which corner receives the primary chamfer. Defaults to top-right. */
  corner?: ChamferedCardCorner
  /** Symmetric cut depth in Tailwind spacing units. >0 wins over x/y. */
  chamferDepth?: number
  /** Horizontal edge position in Tailwind spacing units. Used when depth is 0. */
  chamferX?: number
  /** Vertical edge position in Tailwind spacing units. Used when depth is 0. */
  chamferY?: number
  /** Whether the opposite corner also gets a chamfer. */
  hasOppositeCorner?: boolean
  /** Symmetric depth for the opposite-corner cut. >0 wins over x/y. */
  oppositeChamferDepth?: number
  /** Horizontal edge position for the opposite-corner cut. */
  oppositeChamferX?: number
  /** Vertical edge position for the opposite-corner cut. */
  oppositeChamferY?: number
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
  chamferDepth = 4,
  chamferX = 0,
  chamferY = 0,
  hasOppositeCorner = false,
  oppositeChamferDepth = 0,
  oppositeChamferX = 0,
  oppositeChamferY = 0,
  children,
  className,
  innerClassName,
  ariaLabel,
}) => {
  const primaryCut = resolveChamferCut(corner, {
    depth: chamferDepth,
    x: chamferX,
    y: chamferY,
  })
  const cuts = [primaryCut]

  if (hasOppositeCorner) {
    cuts.push(
      resolveChamferCut(oppositeChamfer(corner), {
        depth: oppositeChamferDepth,
        x: oppositeChamferX,
        y: oppositeChamferY,
      }),
    )
  }

  const clipPath = buildChamferClipPath(cuts)

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
