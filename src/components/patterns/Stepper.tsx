'use client'

import * as React from 'react'
import { cn } from '@/utilities/ui'
import { BulletList } from './BulletList'
import { NumberBadge } from './NumberBadge'

/**
 * A single step in the stepper. Mirrors the CMS `FlowComponentBlock` step
 * schema so the same data shape works for both Payload content and stories.
 */
export type StepperStep = {
  /** Ordinal step number (1-indexed). */
  step: number
  /** Short heading for the step. */
  title: string
  /** Paragraph-length description of what this step entails. */
  description: string
}

export type StepperVariant = 'interactive' | 'auto'

/**
 * Clip-path for the active-step detail card — same 30% top-right
 * chamfer cut used by `NumberBadge`, so all chamfered elements share
 * the same visual language.
 */
const CHAMFER_CLIP = 'polygon(0% 0%, calc(100% - 30%) 0%, 100% 30%, 100% 100%, 0% 100%)'

/**
 * Inline checkmark used by the completed-state badge. Sized at 12×12
 * to fit inside the 28px (size-7) NumberBadge. Inherits `currentColor`
 * so the badge's text colour controls the stroke.
 */
const Checkmark: React.FC = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

/**
 * State → NumberBadge config map. Shape and content are fixed by
 * state (no caller-controlled `indicatorShape` prop) so all steppers
 * look the same: upcoming = circle, active = chamfered, completed =
 * chamfered + checkmark.
 *
 * The NumberBadge's `style` override is what gives the completed
 * state its primary fill (since NumberBadge has no `primary` tone)
 * and the upcoming state its transparent fill.
 */
type IndicatorState = 'upcoming' | 'active' | 'completed'

const INDICATOR_STATE_STYLE: Record<IndicatorState, React.CSSProperties> = {
  upcoming: {
    '--cf-fill': 'transparent',
    '--cf-stroke': 'var(--border)',
  } as React.CSSProperties,
  active: {
    '--cf-fill': 'var(--accent)',
    '--cf-stroke': 'var(--accent)',
  } as React.CSSProperties,
  completed: {
    '--cf-fill': 'var(--primary)',
    '--cf-stroke': 'var(--primary)',
  } as React.CSSProperties,
}

const INDICATOR_STATE_CLASS: Record<IndicatorState, string> = {
  upcoming: 'text-muted-foreground',
  active: '',
  completed: 'text-primary-foreground',
}

/**
 * `Stepper` renders a vertical sequence of numbered steps with connector
 * lines between them. Each step tracks through three visual states —
 * completed, active, and upcoming — driven by the current `activeStep`.
 *
 * Two interaction models are available:
 *
 * - **`interactive`** (default) — click a step to jump to it. Back / Next
 *   buttons at the bottom advance one step at a time. The active step
 *   shows its full content.
 * - **`auto`** — steps advance automatically on a timer. A play / pause
 *   button controls the timer. Useful for walkthroughs, kiosks, or
 *   slideshow-style step presentations.
 */
export const Stepper: React.FC<{
  steps: StepperStep[]
  variant?: StepperVariant
  /** Controlled active step (1-indexed). */
  activeStep?: number
  /** Initial step when uncontrolled (default: 1). */
  defaultActiveStep?: number
  /** Called whenever the active step changes. */
  onChange?: (step: number) => void
  /** Auto-advance interval in ms (default: 5000). */
  autoAdvanceInterval?: number
  className?: string
}> = ({
  steps,
  variant = 'interactive',
  activeStep: controlledStep,
  defaultActiveStep = 1,
  onChange,
  autoAdvanceInterval = 5000,
  className,
}) => {
  // ── state ──────────────────────────────────────────────────────
  const [uncontrolledStep, setUncontrolledStep] = React.useState(defaultActiveStep)
  const isControlled = controlledStep !== undefined
  const currentStep = isControlled ? controlledStep : uncontrolledStep

  const [isPlaying, setIsPlaying] = React.useState(variant === 'auto')
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  /** Ref tracks the current step so the interval closure always reads a fresh value. */
  const stepRef = React.useRef(currentStep)
  stepRef.current = currentStep

  const setStep = (step: number) => {
    const clamped = Math.max(1, Math.min(steps.length, step))
    if (!isControlled) setUncontrolledStep(clamped)
    onChange?.(clamped)
  }

  // ── auto-advance timer ─────────────────────────────────────────
  React.useEffect(() => {
    if (variant !== 'auto' || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      const current = stepRef.current
      const next = current + 1
      setStep(next > steps.length ? 1 : next)
    }, autoAdvanceInterval)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // We intentionally only re-run when isPlaying / variant / interval change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, variant, autoAdvanceInterval, steps.length])

  // ── helpers ────────────────────────────────────────────────────
  const isCompleted = (index: number) => index + 1 < currentStep
  const isActive = (index: number) => index + 1 === currentStep
  const isUpcoming = (index: number) => index + 1 > currentStep
  const hasNext = (index: number) => index < steps.length - 1

  const activeData = steps[currentStep - 1]

  const goNext = () => setStep(currentStep + 1)
  const goPrev = () => setStep(currentStep - 1)
  const togglePlay = () => setIsPlaying((p) => !p)

  const isFirst = currentStep <= 1
  const isLast = currentStep >= steps.length

  // ── keyboard ───────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setStep(index + 1)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="mx-auto w-full max-w-4xl">
        {/* ── Steps list ───────────────────────────────────── */}
        <ol className="space-y-0" role="tablist" aria-label="Progress steps">
          {steps.map((step, index) => {
            const completed = isCompleted(index)
            const active = isActive(index)
            const upcoming = isUpcoming(index)
            const next = hasNext(index)
            const state: IndicatorState = completed ? 'completed' : active ? 'active' : 'upcoming'

            return (
              <li
                key={step.step}
                role="tab"
                aria-selected={active}
                aria-setsize={steps.length}
                aria-posinset={index + 1}
                tabIndex={active ? 0 : -1}
                onClick={() => setStep(index + 1)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  'relative flex cursor-pointer gap-3 outline-none transition-all duration-300',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-sm',
                  upcoming && 'cursor-default',
                )}
              >
                {/* ── Step indicator column ─────────────── */}
                <div className="flex shrink-0 flex-col items-center">
                  <NumberBadge
                    value={step.step}
                    shape={state === 'upcoming' ? 'circle' : 'chamfered'}
                    tone={state === 'active' ? 'mint' : 'border'}
                    sizeClassName="size-7"
                    textClassName="text-[10px] font-bold"
                    className={cn('transition-colors duration-300', INDICATOR_STATE_CLASS[state])}
                    style={INDICATOR_STATE_STYLE[state]}
                  >
                    {completed ? <Checkmark /> : null}
                  </NumberBadge>

                  {/* Connector line */}
                  {next && (
                    <div
                      aria-hidden="true"
                      className={cn(
                        'mt-0 w-0.5 flex-1 transition-colors duration-300',
                        completed || active ? 'bg-primary' : 'bg-border',
                      )}
                      style={{ minHeight: '20px' }}
                    />
                  )}
                </div>

                {/* ── Step label ───────────────────────────── */}
                <div
                  className={cn(
                    'flex-1 pb-7 pt-0.5 transition-all duration-300',
                    upcoming && 'opacity-50',
                  )}
                >
                  <div
                    className={cn(
                      'text-sm font-semibold transition-colors duration-200',
                      completed && 'text-foreground',
                      active && 'text-accent-foreground',
                      upcoming && 'text-muted-foreground',
                    )}
                  >
                    {step.title}
                  </div>
                  <div
                    className={cn(
                      'mt-0.5 text-sm transition-colors duration-200',
                      completed && 'text-muted-foreground',
                      active && 'text-foreground',
                      upcoming && 'text-muted-foreground',
                    )}
                  >
                    {step.description}
                  </div>

                  {/* Expanded detail — chamfered card using BulletList */}
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300 ease-in-out',
                      active && variant === 'interactive'
                        ? 'mt-3 max-h-96 opacity-100'
                        : 'max-h-0 opacity-0',
                    )}
                  >
                    <div
                      data-chamfer
                      className="relative p-3 text-sm text-card-foreground"
                      style={
                        {
                          '--cf-fill': 'var(--card)',
                          '--cf-stroke': 'var(--border)',
                          '--cf-inset': '1px',
                          '--cf-clip': CHAMFER_CLIP,
                          background: 'transparent',
                        } as React.CSSProperties
                      }
                    >
                      <p className="mb-2 font-medium">Current focus</p>
                      <BulletList
                        shape="diamond"
                        items={[
                          `Review requirements for ${step.title.toLowerCase()}`,
                          'Coordinate with the team on timeline',
                          'Track progress against milestones',
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>

        {/* ── Controls ──────────────────────────────────────── */}
        {variant === 'interactive' && (
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isFirst}
                onClick={goPrev}
                className={cn(
                  'rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors',
                  'hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40',
                )}
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={isLast}
                onClick={goNext}
                className={cn(
                  'rounded-md border border-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors',
                  'hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40',
                )}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {variant === 'auto' && (
          <div className="mt-6 flex items-center justify-center gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause auto-advance' : 'Start auto-advance'}
              className={cn(
                'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                isPlaying
                  ? 'bg-accent text-accent-foreground hover:opacity-90'
                  : 'bg-primary text-primary-foreground hover:opacity-90',
              )}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <span className="text-xs text-muted-foreground">
              Step {currentStep} of {steps.length}
              {isPlaying && ` · advancing every ${autoAdvanceInterval / 1000}s`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
