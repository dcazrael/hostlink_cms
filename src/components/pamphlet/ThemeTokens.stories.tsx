import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

/**
 * Single swatch tile used by the grid. Renders a token name, the
 * Tailwind utility class that consumes it, a colored block, and a
 * small foreground sample that shows the matching `*-foreground`
 * utility (where one exists) to prove the token pairing works.
 */
type SwatchToken =
  | 'background'
  | 'card'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'border'
  | 'foreground'
  | 'muted-foreground'

interface Swatch {
  token: SwatchToken
  /** Background utility class applied to the color block. */
  bgClass: string
  /**
   * Foreground utility class for the sample text inside the color
   * block. `null` means the swatch is foreground-on-`bg-background`
   * (e.g. `text-foreground`).
   */
  fgClass: string | null
  /** Token role shown in the small caption. */
  role: string
  /** Optional second caption line, e.g. sample text. */
  sample?: string
  /** Whether the swatch should be drawn as a thin border card (no fill). */
  borderOnly?: boolean
}

const swatches: readonly Swatch[] = [
  {
    token: 'background',
    bgClass: 'bg-background',
    fgClass: 'text-foreground',
    role: 'Page surface',
    sample: 'Aa 0123',
  },
  {
    token: 'card',
    bgClass: 'bg-card',
    fgClass: 'text-card-foreground',
    role: 'Card surface',
    sample: 'A pricing card sits on this tone.',
  },
  {
    token: 'primary',
    bgClass: 'bg-primary',
    fgClass: 'text-primary-foreground',
    role: 'Primary action · lime CTA',
    sample: 'Get started',
  },
  {
    token: 'secondary',
    bgClass: 'bg-secondary',
    fgClass: 'text-secondary-foreground',
    role: 'Secondary action · dark blue',
    sample: 'Learn more',
  },
  {
    token: 'accent',
    bgClass: 'bg-accent',
    fgClass: 'text-accent-foreground',
    role: 'Mint accent',
    sample: 'Subtle highlight',
  },
  {
    token: 'muted',
    bgClass: 'bg-muted',
    fgClass: 'text-muted-foreground',
    role: 'Muted surface',
    sample: 'Quiet supporting area',
  },
  {
    token: 'border',
    bgClass: 'bg-background',
    fgClass: 'text-foreground',
    role: 'Hairline divider',
    borderOnly: true,
  },
  {
    token: 'foreground',
    bgClass: 'bg-foreground',
    fgClass: 'text-background',
    role: 'Body text',
    sample: 'HostLink · Aa 0123',
  },
  {
    token: 'muted-foreground',
    bgClass: 'bg-muted-foreground',
    fgClass: 'text-background',
    role: 'Subdued text',
    sample: 'Caption · helper copy',
  },
]

function TokenSwatch({ swatch }: { swatch: Swatch }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <div
        className={[
          'flex h-20 items-end justify-between rounded-md border border-border px-3 py-2 text-sm font-medium',
          swatch.bgClass,
          swatch.fgClass ?? '',
        ].join(' ')}
        style={swatch.borderOnly ? { backgroundImage: 'none' } : undefined}
      >
        <span className="font-mono text-xs opacity-80">bg-{swatch.token}</span>
        {swatch.sample ? <span className="text-sm">{swatch.sample}</span> : null}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground">{swatch.token}</h3>
        <p className="text-xs text-muted-foreground">{swatch.role}</p>
      </div>
    </article>
  )
}

function ThemeTokensGrid() {
  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-2 border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          HostLink · pamphlet
        </p>
        <h1 className="text-3xl font-semibold text-foreground">Theme tokens</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Each swatch is a Tailwind v4 utility class that maps to a CSS variable declared in{' '}
          <code className="font-mono">src/app/(frontend)/globals.css</code>. The light theme is
          shown here; dark counterparts live under{' '}
          <code className="font-mono">[data-theme=&apos;dark&apos;]</code> in{' '}
          <code className="font-mono">globals.css</code>.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {swatches.map((swatch) => (
          <TokenSwatch key={swatch.token} swatch={swatch} />
        ))}
      </div>
    </section>
  )
}

const meta: Meta<typeof ThemeTokensGrid> = {
  title: 'Pamphlet/ThemeTokens',
  component: ThemeTokensGrid,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof ThemeTokensGrid>

export const Light: Story = {}

export const TokensList: Story = {
  name: 'Tokens (raw list)',
  render: () => (
    <ul className="flex flex-col gap-1 font-mono text-sm text-foreground">
      {swatches.map((s) => (
        <li key={s.token} className="flex items-center justify-between border-b border-border py-1">
          <span>{s.token}</span>
          <span className="text-muted-foreground">{s.bgClass}</span>
        </li>
      ))}
    </ul>
  ),
}
