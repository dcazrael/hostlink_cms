# ImageFrame v2 — Layered clip-path compositions

## Problem

The current `ImageFrame` (in `src/components/patterns/Patterns.tsx`) is a placeholder-only component. It renders a `ShapeMask` mint slab behind a bordered `<figure>` — no real photo, no layered decoration. It cannot represent the visual variety of the hostlink pamphlet, which uses three distinct photo compositions:

1. A photo with a navy diagonal stripe overlay and a small mint corner accent.
2. A photo with a mint wedge on top and a navy diagonal stripe through the middle.
3. A photo with a tiny mint corner and a semi-transparent navy overlay covering most of the frame.

Each composition uses CSS `clip-path` polygons to define three independent layers: a mint polygon (bottom), a photo (clip-pathed to its own polygon), and a navy polygon (top). The polygons do **not** tile the frame — outside the photo's clip-path, whitespace from the parent shows through.

## Scope

Replace the placeholder `ImageFrame` with a layered component that accepts a real photo and renders the three decorative layers around it. Three pre-composed variants match the three pamphlet compositions.

**In scope:**

- New layered `ImageFrame` component (replaces the current placeholder).
- Three variants: `hero-stripe`, `stacked-bands`, `framed-overlay`.
- Real photo as content via `src` + `alt` props.
- Optional `<figcaption>` below the photo.
- Storybook stories for each variant (using a public-domain or hosted sample image).

**Out of scope:**

- Animation between variants.
- Custom shape upload or dynamic geometry (the three variants are hard-coded).
- Lazy-loading or responsive image sources (`srcSet`).
- Aspect-ratio prop (fixed at `aspect-video`).

## Architecture

Three absolutely-positioned layers inside a relative `<figure>`:

```
<figure class="relative aspect-video overflow-hidden">
  ┌─ Layer 1: Mint polygon (bottom) ────────────────┐
  │  <svg><path fill="mint" /></svg>                │
  ├─ Layer 2: Photo (clip-path polygon, on top) ───┤
  │  <img class="absolute inset-0 size-full         │
  │        object-cover" style="clip-path: ..." />  │
  ├─ Layer 3: Navy polygon (top) ───────────────────┤
  │  <svg><path fill="navy" /></svg>                │
  └─────────────────────────────────────────────────┘
</figure>
```

### Hybrid SVG + CSS polygon (chosen approach)

**Approach comparison:**

| Approach                            | Photo clipping | Mint + Navy multi-subpath           | Tailwind-idiomatic | Avoids `<foreignObject>` |
| ----------------------------------- | -------------- | ----------------------------------- | ------------------ | ------------------------ |
| Pure SVG (`<image>` + `<clipPath>`) | ✅ native      | ✅ native                           | ❌                 | ✅                       |
| Pure CSS `clip-path: polygon(...)`  | ✅ native      | ⚠️ multi-subpath needs stacked divs | ✅                 | ✅                       |
| **Hybrid** (this design)            | ✅ CSS polygon | ✅ SVG paths                        | ✅                 | ✅                       |

**Why hybrid wins:**

1. **Photo stays a native `<img>`** — keeps `object-fit: cover`, `object-position`, native lazy-loading, no SVG-vs-HTML sizing quirks.
2. **Mint and Navy stay SVG paths** — preserves the multi-subpath designs (the reference SVGs each have 2 subpaths in the mint and navy) without flattening or stacking decorative divs.
3. **No `<foreignObject>` and no `<image>` inside `<clipPath>`** — the photo's clipping is plain CSS.
4. **Each layer uses its native strength** — polygons for single-clip paths, SVG for multi-subpath fills. The mental model cost is small because the layers are visually and structurally independent.

- **Mint and Navy** are rendered as inline `<svg>` elements with `<path>` fills. SVG handles multi-subpath shapes without flattening.
- **Photo** is rendered as an `<img>` with CSS `clip-path: polygon(...)`. The photo's clip-path is a single polygon with percentage-based vertex coordinates relative to the photo's bounding box.

### Layering semantics

- **Mint polygon** (bottom): opaque mint fill. Visible wherever the photo's clip-path and the navy polygon don't cover it.
- **Photo** (middle): opaque `<img>` clip-pathed to its polygon. Visible wherever the navy polygon doesn't cover it.
- **Navy polygon** (top): navy fill, optionally semi-transparent. Visible wherever the polygon is.
- **Whitespace**: wherever none of the three layers cover, the parent figure's background shows through.

The three polygons are **independent** (not complementary). They overlap in any way the design needs.

## Variants

Each variant specifies:

1. The mint polygon's SVG path data and fill.
2. The photo's CSS clip-path polygon (vertex list, percentage-based).
3. The navy polygon's SVG path data, fill, and opacity.

The variants come directly from the user's reference designs (three SVG files shared during brainstorming).

### `hero-stripe`

Reference: living-room photo with a navy diagonal stripe across the upper-right and a mint accent in the top-left.

- **Mint**: small upper-left wedge (`#87bfb3`, single subpath).
- **Photo clip-path**: large diagonal polygon covering most of the frame, leaving the mint wedge visible in the upper-left.
- **Navy**: thick diagonal stripe across the upper-right portion of the photo. Opaque.

### `stacked-bands`

Reference: photo of two people with a mint section on top and a navy stripe through the middle.

- **Mint**: top wedge (`#87bfb3`, larger than `hero-stripe`).
- **Photo clip-path**: diagonal polygon, photo extends downward/right past the mint.
- **Navy**: diagonal stripe through the middle of the photo. Semi-transparent (`opacity: 0.6`).

### `framed-overlay`

Reference: photo of hands with a tiny mint corner and a semi-transparent navy overlay.

- **Mint**: tiny bottom-left corner wedge (`#87bfb3`).
- **Photo clip-path**: large polygon, photo extends top, right, and bottom — covering almost the full frame.
- **Navy**: full-frame semi-transparent overlay (`opacity: 0.4`).

## Component API

```ts
type ImageFrameVariant = "hero-stripe" | "stacked-bands" | "framed-overlay";

interface ImageFrameProps {
  variant: ImageFrameVariant;
  src: string;
  alt: string;
  caption?: string;
  /**
   * Override the variant's default navy overlay opacity.
   * 0 = invisible, 1 = fully opaque. Valid range: 0–1.
   */
  navyOpacity?: number;
  /**
   * `object-position` for the photo inside its clip-path. Controls which
   * part of the photo survives the clip-path crop (the "focus point").
   *
   * Accepts any valid CSS `object-position` value:
   *   - "50% 50%"      (default — centered)
   *   - "70% 30%"      (upper-right focus)
   *   - "left bottom"  (keyword form)
   *
   * Use this when the clip-path crops out the photo's main subject and
   * you need to keep a specific region visible.
   */
  objectPosition?: string;
  className?: string;
}
```

Defaults (when the optional props are not provided):

| Variant          | Default navy opacity | Default focus point |
| ---------------- | -------------------- | ------------------- |
| `hero-stripe`    | 1.0                  | `50% 50%`           |
| `stacked-bands`  | 0.6                  | `50% 50%`           |
| `framed-overlay` | 0.4                  | `50% 50%`           |

Per-variant focus-point defaults may be tuned during implementation if the references call for them (e.g., the `stacked-bands` photo's subject might sit in the lower portion of the frame, where a `50% 70%` default would fit better).

## File layout

The component lives in its own file:

```
src/components/patterns/ImageFrame.tsx          ← new component
src/components/patterns/ImageFrame.stories.tsx  ← 3 variant stories + 1 docs
```

The current placeholder `ImageFrame` in `src/components/patterns/Patterns.tsx` is **removed**. Callers (none currently in app code) migrate by importing from the new file.

### Internal data

Variant geometry is defined as a static const inside `ImageFrame.tsx`:

```ts
const VARIANTS: Record<ImageFrameVariant, {
  mint: { paths: string[]; fill: string }
  photoClip: string  // CSS polygon string
  navy: { paths: string[]; fill: string; opacity: number }
}> = {
  'hero-stripe': { ... },
  'stacked-bands': { ... },
  'framed-overlay': { ... },
}
```

**Path data is pinned during implementation, not at spec time.** The implementation step extracts the exact viewBox-space path data from the user's Inkscape SVG exports and embeds it in `VARIANTS`. If the user wants to tweak the geometry, they edit the SVG in Inkscape and re-export.

## Accessibility

- `<figure>` wraps the photo, with optional `<figcaption>`.
- `<img alt={alt}>` makes the photo announced by screen readers.
- Mint and navy SVG layers have `aria-hidden="true"` — they're decorative.
- `<figcaption>` is announced in the figure's accessible name when present.

## Testing

- Vitest render tests for each variant:
  - Renders without crashing with `src` + `alt` provided.
  - Mint and navy SVG layers are `aria-hidden`.
  - The `<img>` element has the configured `clip-path` style.
  - `caption` renders a `<figcaption>` when provided.
- Visual snapshot tests against the live Storybook for each variant (covered by story tests).
- A11y tests via `axe-core` (Storybook addon) — focus on the figure having an accessible name from `alt`.

## Storybook stories

`src/components/patterns/ImageFrame.stories.tsx`:

- **`HeroStripe`** — renders the `hero-stripe` variant with a sample photo.
- **`StackedBands`** — renders the `stacked-bands` variant.
- **`FramedOverlay`** — renders the `framed-overlay` variant.
- **`NoCaption`** — renders any variant without `<figcaption>`.
- **`CustomOpacity`** — renders a variant with an overridden `navyOpacity`.

Each story uses a single sample image (a placeholder hosted in `/public/` or a stable CDN URL). One JSDoc summary per story.

## Verification

- `tsc --noEmit`: clean.
- `vitest run`: existing tests pass + new ImageFrame render tests pass.
- `storybook build`: succeeds.
- Live Storybook at `http://localhost:6007/?path=/story/components-imageframes--hero-stripe` renders the photo with mint + navy layers.

## Risks

1. **Polygon coordinates** are not yet pinned. The user will need to export viewBox-space path data from their Inkscape files. Initial implementation may need iteration on the exact paths.
2. **Aspect ratio** is fixed at `aspect-video` (16:9). If a photo with a different ratio is used, `object-cover` will crop it. Document this in the API.
3. **Navy opacity** defaults are taste-based. May need tweaking during visual review.

## Open questions

None. All decisions confirmed during brainstorming.
