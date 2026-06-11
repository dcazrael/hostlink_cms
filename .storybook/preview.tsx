import type { Preview, Decorator } from '@storybook/react'
import React, { useLayoutEffect } from 'react'

// Import the project's global stylesheet so Tailwind v4 tokens
// (e.g. `bg-background`, `text-foreground`, `border-border`, `bg-primary`,
// `text-primary-foreground`) are available inside Storybook.
import '../src/app/(frontend)/globals.css'

// Inject the `--font-geist-sans` / `--font-geist-mono` CSS variables on
// `:root` so Tailwind's `--font-sans: var(--font-geist-sans)` and
// `--font-mono: var(--font-geist-mono)` mappings in `globals.css` resolve
// inside Storybook.
//
// The frontend layout sets these variables via `next/font/local` from the
// `geist` package. We can't use that loader here (Storybook runs on Vite,
// and the `geist` package's `exports` field blocks deep imports into the
// woff2 files), so we fall back to a system font stack with a similar
// geometric feel. The frontend uses real Geist; this is a development
// harness where the system stack keeps typography legible without
// pulling in a new font package.
function useFrontendCanvasGlobals(): void {
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return

    // Defeat the frontend's `html { opacity: 0 }` guard. The CSS only
    // restores opacity for `html[data-theme='light']` and
    // `html[data-theme='dark']`, so we set `data-theme="light"` on the
    // document element to match the frontend's `defaultTheme`.
    document.documentElement.setAttribute('data-theme', 'light')

    // Inject CSS variable definitions exactly once.
    if (!document.getElementById('storybook-frontend-canvas-styles')) {
      const style = document.createElement('style')
      style.id = 'storybook-frontend-canvas-styles'
      style.textContent = `
:root {
  --font-geist-sans: 'Geist', 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-geist-mono: 'Geist Mono', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
`
      document.head.appendChild(style)
    }
  }, [])
}

// Storybook renders stories inside `#storybook-root` (or `.sb-host` for
// the docs canvas). The frontend globals.css forces `html { opacity: 0 }`
// and only restores it when `data-theme` is explicitly set on `<html>`,
// so this decorator:
//   - sets `data-theme="light"` on the document element (via the effect
//     above) so the opacity guard is lifted
//   - injects the `--font-geist-*` CSS variables on `:root`
//   - wraps the story in a frontend-like shell using the same Tailwind
//     tokens the homepage uses: `main-gradient min-h-screen
//     bg-background text-foreground font-sans`
const withFrontendCanvas: Decorator = (Story) => {
  useFrontendCanvasGlobals()

  return (
    <div
      data-theme="light"
      className="main-gradient min-h-screen w-full bg-background text-foreground font-sans"
    >
      <div className="container py-10">
        <Story />
      </div>
    </div>
  )
}

const preview: Preview = {
  decorators: [withFrontendCanvas],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
  },
}

export default preview
