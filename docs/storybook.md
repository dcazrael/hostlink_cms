# Storybook

Visual development harness for the hostlink pamphlet primitives and theme tokens. Runs alongside Next.js without touching the Payload schema, generated types, or the production build.

## Commands

Run from the project root.

```bash
pnpm storybook          # dev server at http://localhost:6006
pnpm build-storybook    # static export to ./storybook-static/
```

Both scripts are defined in `package.json` and forward `NODE_OPTIONS=--no-deprecation` via `cross-env`.

- `pnpm storybook` runs `storybook dev -p 6006` (port pinned in the script).
- `pnpm build-storybook` runs `storybook build` and emits a fully static site.

`@storybook/react` 10.4.x, `@storybook/nextjs-vite` 10.4.x, and `@storybook/addon-docs` 10.4.x are the Storybook packages wired into the project. The `storybook` 10.4.x CLI is installed alongside them and is what the `storybook`/`build-storybook` scripts invoke.

## Configuration

Two files in `.storybook/`:

- `.storybook/main.ts` declares the framework, the docs addon, and the story glob. `typescript.check` and `typescript.reactDocgen` are both disabled so stories do not require a full type pass to render.
- `.storybook/preview.tsx` imports the frontend stylesheet, sets up the canvas decorator, and defines preview parameters (`layout: 'fullscreen'`, color/date control matchers).

The story glob (`'../src/**/*.mdx'`, `'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'`) picks up every MDX and stories file under `src/`. No extra path aliases or Vite plugins are required.

## Loading the frontend stylesheet

`.storybook/preview.tsx` imports the production stylesheet directly:

```ts
import "../src/app/(frontend)/globals.css";
```

That single import gives Storybook access to every Tailwind v4 token the homepage relies on, including `bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, and the custom `--secondary`, `--accent`, and `--subtle-background` variables the pamphlet primitives read from.

## Frontend canvas and `data-theme="light"`

The frontend layout sets `html { opacity: 0 }` as a flash-of-unstyled-content guard and only restores opacity when `<html data-theme="light">` or `<html data-theme="dark">` is set. Storybook runs on Vite and does not go through the Next.js layout, so the preview decorator does three things to make stories look like the real homepage:

1. Sets `document.documentElement.setAttribute('data-theme', 'light')` on mount, which matches the frontend's `defaultTheme` and lifts the opacity guard.
2. Injects `--font-geist-sans` and `--font-geist-mono` on `:root` (once, guarded by a `<style id="storybook-frontend-canvas-styles">` element). The frontend sets these via `next/font/local` from the `geist` package; the deep imports into the woff2 files are blocked by the package's `exports` field, so Storybook falls back to a system stack that includes Geist names with `Inter` and the platform sans-serif as fallbacks. The system stack keeps typography legible without pulling in a new font dependency.
3. Wraps every story in a div that uses the same Tailwind tokens the homepage shell uses: `main-gradient min-h-screen w-full bg-background text-foreground font-sans` with a `container py-10` inner wrapper. This is what you see framing each story in the canvas.

Net effect: stories render with the same theme, surface, and font stack as the frontend. If you need to inspect the dark theme, add a `data-theme="dark"` attribute at the story level (or in a new decorator); the light/dark tokens live in `src/app/(frontend)/globals.css` under `[data-theme='dark']`.

## Static build output

`pnpm build-storybook` writes a self-contained site to `./storybook-static/`. The directory is git-ignored:

```
# .gitignore
/storybook-static/
```

The output is purely a developer artifact. It is not deployed and is not part of the Next.js production bundle. Delete it with `rm -rf storybook-static` to reclaim disk; the build is reproducible from the current source.

## What's not wired up

- No Payload admin preview. Storybook only consumes frontend CSS and theme tokens. It does not pull from collections or globals.
- No type generation step is required for the storybook to run. `pnpm generate:types` is a Payload command and is unrelated to stories.
- No visual regression runner. Verification is manual through the Storybook UI and the static export.

## Troubleshooting

- Stories render as a blank page: confirm `data-theme` is being set. The canvas root inherits the document attribute set by the `useFrontendCanvasGlobals` effect in the preview decorator.
- Tailwind classes look unstyled: the `globals.css` import in `preview.tsx` must succeed. If you move the file, update the import path.
- Font looks like a default browser serif: the `--font-geist-sans` injection is gated on a single `<style>` element with id `storybook-frontend-canvas-styles`. If you strip that id, the effect re-injects it once on the next mount.
