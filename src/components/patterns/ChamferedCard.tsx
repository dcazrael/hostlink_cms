'use client'

import * as React from 'react'
import {
  buildChamferSvgPath,
  chamferCardToneMap,
  CHAMFER_DEPTH_CAPS,
  clampChamferDepth,
  oppositeChamfer,
  resolveChamferCut,
  type ChamferCorner,
  type ChamferSizing,
} from '@/components/ui/chamfer'
import { useElementSize } from '@/components/ui/use-element-size'
import { cn } from '@/utilities/ui'

export type ChamferedCardCorner = ChamferCorner

export type ChamferedCardTone = 'card' | 'subtle' | 'background' | 'navy' | 'mint'

/**
 * `ChamferedCard` is a rectangle with optional chamfered corners. The
 * primary cut is symmetric when `chamferDepth > 0`; otherwise the
 * asymmetric `chamferX`/`chamferY` values are used. The same rule
 * applies to the opposite-corner cut. The card is purely decorative
 * when no `children` and no `ariaLabel` are provided.
 *
 * The chamfer is rendered as an SVG `<path>` with explicit `fill` and
 * `stroke` so the visible outline follows the chamfered edges. In
 * `proportional` mode the chamfer values are unitless and the SVG
 * scales with the wrapper. In `fixed` mode the chamfer is measured in
 * Tailwind spacing units (4px per unit) and the SVG matches the
 * wrapper's pixel dimensions exactly.
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
   * How the chamfer is mapped to viewBox units. `proportional` keeps
   * the chamfer values as viewBox units inside a 0 0 100 100 box, so
   * the cut scales with the card. `fixed` uses the wrapper's measured
   * pixel dimensions and converts each unit to 4px.
   */
  sizing?: ChamferSizing
  /** Stroke width applied to the chamfer outline. */
  strokeWidth?: number
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
  sizing = 'proportional',
  strokeWidth = 1,
  children,
  className,
  innerClassName,
  ariaLabel,
}) => {
  const [containerRef, containerSize] = useElementSize<HTMLDivElement>()

  const primaryCut = resolveChamferCut(corner, {
    depth: clampChamferDepth(chamferDepth, CHAMFER_DEPTH_CAPS.card),
    x: chamferX,
    y: chamferY,
  })
  const cuts = [primaryCut]

  if (hasOppositeCorner) {
    cuts.push(
      resolveChamferCut(oppositeChamfer(corner), {
        depth: clampChamferDepth(oppositeChamferDepth, CHAMFER_DEPTH_CAPS.card),
        x: oppositeChamferX,
        y: oppositeChamferY,
      }),
    )
  }

  const cornersByPosition = {
    'top-left': { x: 0, y: 0 },
    'top-right': { x: 0, y: 0 },
    'bottom-right': { x: 0, y: 0 },
    'bottom-left': { x: 0, y: 0 },
  }
  for (const cut of cuts) {
    cornersByPosition[cut.corner] = { x: cut.x, y: cut.y }
  }

  // Convert chamfer units to viewBox units.
  // proportional: 1 unit = 1 viewBox unit (viewBox is 0 0 100 100)
  // fixed: 1 unit = 4 px (matching Tailwind 0.25rem = 4px at 16px root)
  const toViewBoxUnits = (units: number) => (sizing === 'fixed' ? units * 4 : units)

  const viewBoxWidth = sizing === 'fixed' ? containerSize.width : 100
  const viewBoxHeight = sizing === 'fixed' ? containerSize.height : 100

  const path = buildChamferSvgPath({
    width: viewBoxWidth,
    height: viewBoxHeight,
    topLeft: {
      x: toViewBoxUnits(cornersByPosition['top-left'].x),
      y: toViewBoxUnits(cornersByPosition['top-left'].y),
    },
    topRight: {
      x: toViewBoxUnits(cornersByPosition['top-right'].x),
      y: toViewBoxUnits(cornersByPosition['top-right'].y),
    },
    bottomRight: {
      x: toViewBoxUnits(cornersByPosition['bottom-right'].x),
      y: toViewBoxUnits(cornersByPosition['bottom-right'].y),
    },
    bottomLeft: {
      x: toViewBoxUnits(cornersByPosition['bottom-left'].x),
      y: toViewBoxUnits(cornersByPosition['bottom-left'].y),
    },
  })

  const toneDef = chamferCardToneMap[tone]

  // Decorative only when there is no label AND no children to announce.
  const isDecorative = !ariaLabel && children == null

  return (
    <div
      ref={containerRef}
      aria-hidden={isDecorative || undefined}
      aria-label={ariaLabel}
      className={cn('relative w-full', toneDef.textClass, className)}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="none"
      >
        <path d={path} fill={toneDef.fill} stroke={toneDef.stroke} strokeWidth={strokeWidth} />
      </svg>
      <div className={cn('relative z-10 px-5 py-5 md:px-6 md:py-6', innerClassName)}>
        {children}
      </div>
    </div>
  )
}
