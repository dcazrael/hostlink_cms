import * as React from 'react'
import { cn } from '@/utilities/ui'
import { ChamferedCard } from './ChamferedCard'
import { DiagonalBand } from './DiagonalBand'
import { MintBulletList, type MintBulletShape } from './MintBullet'
import { NumberBadge } from './NumberBadge'
import { SectionFrame } from './SectionFrame'
import { ShapeMask } from './ShapeMask'

export const PamphletButton: React.FC<{
  children: React.ReactNode
  href?: string
  tone?: 'navy' | 'mint' | 'outline'
  className?: string
}> = ({ children, href, tone = 'navy', className }) => {
  const toneClass = {
    navy: 'bg-(--secondary) text-(--secondary-foreground) border-(--secondary)',
    mint: 'bg-(--accent) text-(--accent-foreground) border-(--accent)',
    outline: 'bg-transparent text-foreground border-border hover:bg-(--subtle-background)',
  }[tone]

  const contentClass = cn(
    'inline-flex items-center justify-center border px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors',
    toneClass,
    className,
  )

  if (href) {
    return (
      <a className={contentClass} href={href}>
        {children}
      </a>
    )
  }

  return <button className={contentClass}>{children}</button>
}

export const PamphletCard: React.FC<{
  eyebrow?: string
  title: string
  children: React.ReactNode
  tone?: 'card' | 'navy' | 'mint'
  className?: string
}> = ({ eyebrow, title, children, tone = 'card', className }) => (
  <ChamferedCard tone={tone} className={className}>
    {eyebrow ? (
      <p className="font-mono text-xs uppercase tracking-widest text-current/70">{eyebrow}</p>
    ) : null}
    <h3 className="mt-3 text-xl font-semibold tracking-tight text-current">{title}</h3>
    <div className="mt-3 text-sm leading-6 text-current/75">{children}</div>
  </ChamferedCard>
)

export const PricingCard: React.FC<{
  name: string
  price: string
  description: string
  features: string[]
  featured?: boolean
}> = ({ name, price, description, features, featured = false }) => (
  <PamphletCard eyebrow="Plan" title={name} tone={featured ? 'navy' : 'card'}>
    <p className="font-mono text-3xl font-semibold tracking-tight text-current">{price}</p>
    <p className="mt-2">{description}</p>
    <MintBulletList className="mt-5" items={features.map((title) => ({ title }))} shape="diamond" />
    <PamphletButton className="mt-6" tone={featured ? 'mint' : 'outline'}>
      Request quote
    </PamphletButton>
  </PamphletCard>
)

export const GridBlockItem: React.FC<{
  number?: string
  title: string
  children: React.ReactNode
}> = ({ number, title, children }) => (
  <div className="border-t border-border pt-5">
    <div className="flex items-center gap-3">
      {number ? <NumberBadge value={number} shape="chamfered" /> : null}
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
    </div>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">{children}</p>
  </div>
)

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
        <PamphletCard eyebrow={`Step ${index + 1}`} title={step.title}>
          {step.body}
        </PamphletCard>
      </li>
    ))}
  </ol>
)

export const FAQStack: React.FC<{
  items: Array<{ question: string; answer: string }>
}> = ({ items }) => (
  <div className="divide-y divide-border border-y border-border">
    {items.map((item) => (
      <details key={item.question} className="group py-5">
        <summary className="cursor-pointer list-none text-base font-semibold tracking-tight">
          {item.question}
        </summary>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{item.answer}</p>
      </details>
    ))}
  </div>
)

export const PamphletTable: React.FC<{
  columns: string[]
  rows: string[][]
}> = ({ columns, rows }) => (
  <div className="overflow-hidden border border-border bg-card">
    <table className="w-full border-collapse text-left text-sm">
      <thead className="bg-(--secondary) text-(--secondary-foreground)">
        <tr>
          {columns.map((column) => (
            <th key={column} className="px-4 py-3 font-mono text-xs uppercase tracking-widest">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((row) => (
          <tr key={row.join('|')}>
            {row.map((cell) => (
              <td key={cell} className="px-4 py-4 text-muted-foreground">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const ContactPanel: React.FC<{ className?: string }> = ({ className }) => (
  <PamphletCard
    className={className}
    eyebrow="Contact"
    title="Start a managed workspace"
    tone="navy"
  >
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
      <PamphletButton tone="mint">Send inquiry</PamphletButton>
    </form>
  </PamphletCard>
)

export const ImageFrame: React.FC<{
  alt: string
  caption?: string
  className?: string
}> = ({ alt, caption, className }) => (
  <figure className={cn('relative border border-border bg-card p-3', className)}>
    <div className="aspect-video bg-(--subtle-background)">
      <ShapeMask ariaLabel={alt} className="h-full" tone="mint" direction="top-right" />
    </div>
    {caption ? (
      <figcaption className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {caption}
      </figcaption>
    ) : null}
  </figure>
)

export const SectionShape: React.FC<{
  tone?: 'navy' | 'mint' | 'subtle'
  children?: React.ReactNode
}> = ({ tone = 'subtle', children }) => (
  <div className="relative overflow-hidden border border-border bg-background p-8">
    <ShapeMask
      className="absolute right-0 top-0 h-24 w-48 opacity-80"
      tone={tone}
      direction="top-left"
    />
    <div className="relative">{children}</div>
  </div>
)

export const SectionWithImage: React.FC<{
  eyebrow?: string
  title: string
  description: string
  bullets?: Array<{ title: string; body?: string }>
  bulletShape?: MintBulletShape
}> = ({ eyebrow, title, description, bullets = [], bulletShape = 'square' }) => (
  <SectionFrame eyebrow={eyebrow} title={title} description={description} tone="subtle">
    <div className="grid gap-8 md:grid-cols-2 md:items-center">
      <div>{bullets.length ? <MintBulletList items={bullets} shape={bulletShape} /> : null}</div>
      <ImageFrame alt={title} caption="Pamphlet visual slot" />
    </div>
  </SectionFrame>
)
