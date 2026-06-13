import * as React from 'react'
import { cn } from '@/utilities/ui'

export type VerticalAccentTone = 'mint' | 'navy' | 'border' | 'muted'

/**
 * `VerticalAccent` is the thin vertical stroke that runs alongside a
 * pamphlet column — a mint rule to the left of a quote, a navy line
 * separating two columns, or a muted hairline between list rows. It
 * is decorative by default; pass `ariaLabel` if it carries meaning
 * (e.g. a section divider that should be announced).
 */
export const VerticalAccent: React.FC<{
  tone?: VerticalAccentTone
  /** Stroke thickness as a Tailwind width class. Defaults to `w-1`. */
  widthClassName?: string
  /** Stroke height as a Tailwind height class. Defaults to `h-full`. */
  heightClassName?: string
  /**
   * Whether to render the stroke with a slight skew so it visually
   * matches the diagonal accents in the pamphlet. Defaults to `true`.
   */
  skew?: boolean
  className?: string
  ariaLabel?: string
}> = ({
  tone = 'mint',
  widthClassName = 'w-1',
  heightClassName = 'h-full',
  skew = true,
  className,
  ariaLabel,
}) => {
  const toneClass: Record<VerticalAccentTone, string> = {
    mint: 'bg-(--accent)',
    navy: 'bg-(--secondary)',
    border: 'bg-border',
    muted: 'bg-muted-foreground/40',
  }

  return (
    <span
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cn(
        'inline-block',
        widthClassName,
        heightClassName,
        toneClass[tone],
        skew ? '-skew-x-12' : '',
        className,
      )}
    />
  )
}
