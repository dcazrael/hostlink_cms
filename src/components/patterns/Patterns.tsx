import { cn } from '@/utilities/ui'
import * as React from 'react'
import { Button } from '../ui/button'
import { BulletList } from './BulletList'
import { ChamferedCard, type ChamferedCardCorner } from './ChamferedCard'
import { DiagonalBand } from './DiagonalBand'
import { ShapeMask } from './ShapeMask'

/**
 * Card is a content container with an eyebrow label, title, and body slot.
 * Wraps ChamferedCard with chamfer controls. Use for feature cards,
 * process steps, or any card-based layout.
 *
 * @summary chamfered content card
 */
export const Card: React.FC<{
  eyebrow?: string
  title: string
  children: React.ReactNode
  tone?: 'card' | 'navy' | 'mint'
  corner?: ChamferedCardCorner
  chamferDepth?: number
  chamferX?: number
  chamferY?: number
  hasOppositeCorner?: boolean
  oppositeChamferDepth?: number
  oppositeChamferX?: number
  oppositeChamferY?: number
  /** Stroke width of the chamfered outline in pixels. Defaults to 1. */
  strokeWidth?: number
  className?: string
}> = ({
  eyebrow,
  title,
  children,
  tone = 'card',
  corner,
  chamferDepth,
  chamferX,
  chamferY,
  hasOppositeCorner,
  oppositeChamferDepth,
  oppositeChamferX,
  oppositeChamferY,
  strokeWidth,
  className,
}) => (
  <ChamferedCard
    tone={tone}
    corner={corner}
    chamferDepth={chamferDepth}
    chamferX={chamferX}
    chamferY={chamferY}
    hasOppositeCorner={hasOppositeCorner}
    oppositeChamferDepth={oppositeChamferDepth}
    oppositeChamferX={oppositeChamferX}
    oppositeChamferY={oppositeChamferY}
    strokeWidth={strokeWidth}
    className={className}
  >
    {eyebrow ? (
      <p className="font-mono text-xs uppercase tracking-widest text-current/70">{eyebrow}</p>
    ) : null}
    <h3 className="mt-3 text-xl font-semibold tracking-tight text-current">{title}</h3>
    <div className="mt-3 text-sm leading-6 text-current/75">{children}</div>
  </ChamferedCard>
)

export type PricingCardTone = 'lime' | 'sora' | 'rose' | 'amber' | 'purple'

/**
 * Named accent hues that match the `--lime` / `--sora` / `--rose` /
 * `--amber-shade` / `--purple` tokens in globals.css.
 * All share the same lightness (0.7492) and chroma (0.1353) — only
 * the hue angle changes.
 */
const PRICING_TONES: Record<PricingCardTone, number> = {
  lime: 131.08,
  sora: 257.62,
  rose: 24,
  amber: 82,
  purple: 306,
}

export const PricingCard: React.FC<{
  name: string
  price: string
  description: string
  features: string[]
  featured?: boolean
  tone?: PricingCardTone
}> = ({ name, price, description, features, featured = false, tone = 'lime' }) => {
  const hue = PRICING_TONES[tone]
  const accentColor = `oklch(0.7492 0.1353 ${hue})`

  return (
    <article
      className="relative flex flex-col rounded-3xl border border-border bg-card shadow-sm"
      style={{ '--pricing-hue': hue } as React.CSSProperties}
    >
      <div className="h-1.5 w-full rounded-t-3xl" style={{ backgroundColor: accentColor }} />

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {featured ? 'Featured plan' : 'Plan'}
        </p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight" style={{ color: accentColor }}>
          {name}
        </h3>
        <p className="mt-2 font-mono text-3xl font-semibold tracking-tight text-foreground">
          {price}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        <BulletList className="mt-5" items={features} shape="diamond" />
        <Button className="mt-6" variant="default">
          Request quote
        </Button>
      </div>
    </article>
  )
}

/**
 * FlowSteps renders a horizontal process row with DiagonalBand accents
 * and Card containers. Use for 3-step process overviews (audit → build → launch).
 *
 * @summary horizontal process step row
 */
export const FlowSteps: React.FC<{
  steps: Array<{ title: string; body: string }>
}> = ({ steps }) => (
  <ol className="grid gap-4 md:grid-cols-3">
    {steps.map((step, index) => (
      <li key={step.title} className="relative">
        <DiagonalBand
          tone={index === 1 ? 'mint' : 'navy'}
          orientation={index % 2 === 0 ? 'left' : 'right'}
        />
        <Card eyebrow={`Step ${index + 1}`} title={step.title}>
          {step.body}
        </Card>
      </li>
    ))}
  </ol>
)

/**
 * ContactPanel renders a Card-wrapped inquiry form with name, email,
 * and message fields. Use for contact or consultation request sections.
 *
 * @summary inquiry contact form panel
 */
export const ContactPanel: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={className} eyebrow="Contact" title="Start a managed workspace" tone="navy">
    <form className="grid gap-4">
      <label className="grid gap-2 text-sm">
        Name
        <input className="border border-(--secondary-foreground)/30 bg-transparent px-3 py-2 text-current" />
      </label>
      <label className="grid gap-2 text-sm">
        Email
        <input className="border border-(--secondary-foreground)/30 bg-transparent px-3 py-2 text-current" />
      </label>
      <label className="grid gap-2 text-sm">
        Message
        <textarea className="min-h-28 border border-(--secondary-foreground)/30 bg-transparent px-3 py-2 text-current" />
      </label>
      <Button variant="default">Send inquiry</Button>
    </form>
  </Card>
)

export type SectionShapeVariant = 'corner-mask' | 'diagonal-bands' | 'stepped-field' | 'half-field'

/**
 * SectionShape renders a decorative background geometry for pamphlet sections.
 * Four variants available: diagonal-bands, stepped-field, half-field, corner-mask.
 * Each uses CSS clip-path for the shape.
 *
 * @summary decorative section background shape
 */
export const SectionShape: React.FC<{
  variant?: SectionShapeVariant
  tone?: 'navy' | 'mint' | 'subtle'
  children?: React.ReactNode
}> = ({ variant = 'corner-mask', tone = 'subtle', children }) => {
  if (variant === 'diagonal-bands') {
    return (
      <div
        className="relative aspect-11/7 overflow-hidden border border-border bg-card"
        data-testid="pattern-section-shape-diagonal-bands"
      >
        <div className="absolute inset-0 bg-primary/50 [clip-path:polygon(0_100%,100%_0,100%_100%,0_100%)]" />
        <div
          className="absolute inset-y-0 right-0 w-[80%] bg-secondary [clip-path:polygon(10%_100%,100%_30%,100%_80%,100%_100%)]"
          data-testid="pattern-section-shape-navy-band"
        />
        <div className="absolute bottom-0 right-0 h-[60%] w-[50%] bg-accent [clip-path:polygon(10%_100%,100%_30%,100%_80%,100%_100%)]" />
        <div className="relative">{children}</div>
      </div>
    )
  }

  if (variant === 'stepped-field') {
    return (
      <div
        className="relative aspect-10/12 overflow-hidden border border-border bg-card"
        data-testid="pattern-section-shape-stepped-field"
      >
        <div className="absolute inset-x-0 top-[20%] h-[35%] bg-primary/50 [clip-path:polygon(0_60%,55%_0,100%_0,100%_100%,0_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-accent [clip-path:polygon(0_35%,55%_5%,100%_5%,100%_80%,60%_100%,0_100%)]" />
        <div className="relative">{children}</div>
      </div>
    )
  }

  if (variant === 'half-field') {
    return (
      <div
        className="relative aspect-square overflow-hidden border border-border bg-card"
        data-testid="pattern-section-shape-half-field"
      >
        <div className="absolute inset-x-0 bottom-0 h-[72%] bg-accent" />
        <div className="relative">{children}</div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden border border-border bg-background p-8">
      <ShapeMask
        className="absolute right-0 top-0 h-24 w-48 opacity-80"
        tone={tone}
        direction="top-left"
      />
      <div className="relative">{children}</div>
    </div>
  )
}
