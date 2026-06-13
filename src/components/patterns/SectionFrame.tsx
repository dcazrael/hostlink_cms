import * as React from 'react'
import { cn } from '@/utilities/ui'

export type SectionFrameTone = 'default' | 'even' | 'subtle' | 'navy' | 'card'

/**
 * `SectionFrame` is the editorial wrapper used for a single pamphlet
 * section: a stacked, slightly inset container with a thin top hairline, a
 * small caption eyebrow, an optional title row, and a body slot. It
 * composes with `DiagonalBand` consumers can place above it but is fully
 * independent — the frame itself never imports or renders another
 * primitive, keeping each story testable in isolation.
 */
export const SectionFrame: React.FC<{
  tone?: SectionFrameTone
  /** Optional eyebrow caption shown above the title. */
  eyebrow?: string
  /** Optional title text. */
  title?: string
  /** Optional supporting text shown next to or under the title. */
  description?: string
  /** Body content rendered inside the framed region. */
  children?: React.ReactNode
  className?: string
  innerClassName?: string
  /** Accessible heading level for the title. Defaults to `2`. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /**
   * When true, renders a thin top accent line above the eyebrow using the
   * `--accent` (mint) token. Mirrors the thin utility bar that opens each
   * pamphlet spread.
   */
  showAccentRule?: boolean
}> = ({
  tone = 'default',
  eyebrow,
  title,
  description,
  children,
  className,
  innerClassName,
  headingLevel = 2,
  showAccentRule = true,
}) => {
  const toneClass: Record<SectionFrameTone, string> = {
    default: 'bg-background text-foreground',
    even: 'bg-(--even-background) text-foreground',
    subtle: 'bg-(--subtle-background) text-(--heading)',
    navy: 'bg-(--secondary) text-(--secondary-foreground)',
    card: 'bg-card text-card-foreground',
  }

  const mutedTextClass: Record<SectionFrameTone, string> = {
    default: 'text-muted-foreground',
    even: 'text-muted-foreground',
    subtle: 'text-(--heading)/75',
    navy: 'text-(--secondary-foreground)/80',
    card: 'text-muted-foreground',
  }

  const headingClass: Record<
    NonNullable<React.ComponentProps<typeof SectionFrame>['headingLevel']>,
    string
  > = {
    1: 'text-4xl md:text-5xl',
    2: 'text-3xl md:text-4xl',
    3: 'text-2xl md:text-3xl',
    4: 'text-xl md:text-2xl',
    5: 'text-lg md:text-xl',
    6: 'text-base md:text-lg',
  }

  const HeadingTag = `h${headingLevel}` as const

  return (
    <section className={cn('relative w-full border-t border-border', toneClass[tone], className)}>
      <div className={cn('container py-12 md:py-16', innerClassName)}>
        {(eyebrow || title || description) && (
          <header className="flex flex-col gap-3 pb-8">
            {showAccentRule ? (
              <div aria-hidden className="h-1 w-12 -skew-x-12 bg-(--accent)" />
            ) : null}
            {eyebrow ? (
              <p
                className={cn('font-mono text-xs uppercase tracking-widest', mutedTextClass[tone])}
              >
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <HeadingTag
                className={cn('font-semibold tracking-tight', headingClass[headingLevel])}
              >
                {title}
              </HeadingTag>
            ) : null}
            {description ? (
              <p className={cn('max-w-2xl text-sm md:text-base', mutedTextClass[tone])}>
                {description}
              </p>
            ) : null}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
