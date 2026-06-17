import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ArrowRight } from 'lucide-react'
import { expect } from 'storybook/test'
import { Button } from './button'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    children: 'Order now',
    variant: 'default',
    size: 'default',
    chamferCorner: 'top-right',
    chamferDepth: 0,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
    chamferCorner: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      description: 'Corner that receives the 45° chamfer cut.',
    },
    chamferDepth: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Chamfer depth in Tailwind spacing units (4 = 1rem). 0 = no cut.',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Primary variant — filled button with chamfered corner.
 * Use for the primary call-to-action on a page. Only one per view.
 *
 * @summary primary call-to-action with chamfer detail
 */
export const Primary: Story = {
  args: {
    children: 'Order now',
    chamferDepth: 7,
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /order now/i })
    await expect(button).toBeVisible()
  },
}

/**
 * Secondary variant — lower visual weight.
 * Use alongside a primary button for secondary actions.
 *
 * @summary secondary action button
 */
export const Secondary: Story = {
  args: {
    children: 'Learn more',
    variant: 'secondary',
    chamferDepth: 5,
  },
}

/**
 * Destructive variant — red background for irreversible actions.
 * Use for delete, remove, or reset operations.
 *
 * @summary delete or reset action
 */
export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
    chamferDepth: 5,
  },
}

/**
 * Outline variant — bordered, transparent background.
 * Use for tertiary actions that should not compete with primary/secondary.
 *
 * @summary bordered tertiary action
 */
export const Outline: Story = {
  args: {
    children: 'Cancel',
    variant: 'outline',
    chamferDepth: 5,
  },
}

/**
 * Ghost variant — no border or background until hovered.
 * Use in tight spaces or when the action is supplementary.
 *
 * @summary minimal ghost button for supplementary actions
 */
export const Ghost: Story = {
  args: { children: 'Dismiss', variant: 'ghost' },
}

/**
 * Link variant — renders as an inline link, no button chrome.
 * Use for navigation or less prominent actions.
 *
 * @summary inline link-style action
 */
export const Link: Story = {
  args: { children: 'Terms apply', variant: 'link' },
}

/**
 * Small size variant — compact button for tight layouts.
 * Use in tables, cards, or inline button groups.
 *
 * @summary compact button for tight layouts
 */
export const Small: Story = {
  args: {
    children: 'OK',
    size: 'sm',
    chamferDepth: 5,
  },
}

/**
 * Large size variant — taller button for prominent calls-to-action.
 * Use on landing pages, hero sections, or full-width CTAs.
 *
 * @summary prominent large button for hero CTAs
 */
export const Large: Story = {
  args: {
    children: 'Submit',
    size: 'lg',
    chamferDepth: 5,
  },
}

/**
 * Button with an inline-end icon (ArrowRight).
 * Use when the action involves forward navigation or submission.
 *
 * @summary action with trailing icon
 */
export const WithIcon: Story = {
  args: {
    children: (
      <>
        Continue
        <ArrowRight aria-hidden data-icon="inline-end" />
      </>
    ),
    chamferDepth: 5,
  },
}

/**
 * Disabled state — non-interactive, reduced opacity.
 * Use to indicate an action is unavailable until conditions are met.
 *
 * @summary disabled non-interactive state
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
    chamferDepth: 5,
  },
}

/**
 * Chamfered variant rendered via SVG overlay.
 * Demonstrates the SVG-based chamfer with top-right cut and depth 3.
 * Prefer the CSS clip-path approach in CssCheck for new work.
 *
 * @summary SVG chamfer overlay demonstration
 */
export const Chamfered: Story = {
  name: 'Chamfered (SVG, top-right, depth 3)',
  args: {
    children: 'Get started',
    variant: 'default',
    chamferCorner: 'top-right',
    chamferDepth: 3,
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /get started/i })
    const svg = button.querySelector('svg')
    await expect(svg).not.toBeNull()
    await expect(button).toBeVisible()
  },
}

/**
 * Proves that Tailwind v4 utilities and globals.css styles resolve.
 * Verifies inline-flex display is applied, confirming CSS is loaded.
 *
 * @summary CSS integration smoke-test
 */
export const CssCheck: Story = {
  args: { children: 'Check' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /check/i })
    const style = getComputedStyle(button)
    // inline-flex confirms the Tailwind v4 utility resolved
    await expect(style.display).toBe('inline-flex')
  },
}
