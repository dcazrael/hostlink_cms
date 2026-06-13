import type { Meta, StoryObj } from '@storybook/react'

/**
 * Minimal smoke story used to validate the Storybook foundation.
 * Renders the frontend Tailwind design tokens declared in
 * `src/app/(frontend)/globals.css` so we can confirm the Storybook
 * pipeline is wired correctly before adding more components.
 */
function PamphletTokenSwatch() {
  return (
    <div className="space-y-4 p-6 bg-background text-foreground">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">
          Storybook smoke — pamphlet tokens
        </h1>
        <p className="text-sm text-muted-foreground">
          Verifies the frontend Tailwind v4 tokens render correctly.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-4 text-card-foreground">
          Surface token: <code>bg-card</code>
        </div>
        <div className="rounded-md border border-border bg-primary p-4 text-primary-foreground">
          Action token: <code>bg-primary</code> / <code>text-primary-foreground</code>
        </div>
      </div>

      <button
        type="button"
        className="rounded-md border border-border bg-background px-4 py-2 text-foreground hover:bg-accent"
      >
        Bordered control
      </button>
    </div>
  )
}

const meta: Meta<typeof PamphletTokenSwatch> = {
  title: 'Tests/StorybookSmoke',
  component: PamphletTokenSwatch,
  parameters: {
    layout: 'padded',
  },
}

export default meta

type Story = StoryObj<typeof PamphletTokenSwatch>

export const Smoke: Story = {}
