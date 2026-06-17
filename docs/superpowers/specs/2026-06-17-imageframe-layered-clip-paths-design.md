# ImageFrame v2 — Photo + Layered Clip-Paths

## Problem

The current `ImageFrame` is a placeholder (a `ShapeMask` mint slab with no image). The design intent — visible on the hostlink pamphlet cover and inside pages — is a real photo with **layered decorative shapes on top**, each composed via CSS `clip-path` polygons. Three distinct compositions recur:

1. **hero-stripe** — photo + a single navy diagonal stripe
2. **stacked-bands** — mint band on top + photo + navy stripe across the middle
3. **framed-overlay** — photo + mint outer shape (lower-left) + navy semi-transparent overlay

Without a real photo, the existing component cannot express the cover compositions.

## Scope

Replace the placeholder `ImageFrame` with a real-photo-aware component that ships three pre-composed variants matching the references.

**Out of scope:**

- Animation between variants
- Custom-shape upload or dynamic geometry
- Caller-defined variants (the three are hard-coded)
- `ShapeMask` is not touched — it remains for solid-slab use cases
- The earlier `data-chamfer` system is not used (clip-paths here are decorative compositions, not chamfered borders)

## Architecture

A `relative` figure container holds three absolutely-positioned layers:

```
<figure class="relative aspect-video overflow-hidden">
  ├─ <div class="absolute inset-0 bg-{mintTone}" />            ← mint base
  ├─ <img  class="absolute inset-0 w-full h-full object-cover"
  │         style={{ clipPath: <variant-clip> }} />             ← photo (clipped)
  └─ <div class="absolute inset-0 bg-{navyTone}"
            style={{ clipPath: <variant-clip>, opacity }} />    ← navy overlay
</figure>
```

**Key invariant: the photo and the navy overlay share the same `clip-path`** so the navy sits perfectly along the photo's edge. The mint fills the negative space where the photo's clip-path doesn't show through.

**No new clip-path helper is extracted from `ShapeMask`.** The shapes here are decorative compositions (often multiple polygons per variant), not single diagonal cuts. `ShapeMask`'s formula stays in its component.

## Component API

```ts
type ImageFrameVariant = "hero-stripe" | "stacked-bands" | "framed-overlay";

type ImageFrameProps = {
  /** Public image source (URL or local path). */
  src: string;
  /** Alternative text — required for accessibility. */
  alt: string;
  /** Composition variant. Defaults to `'hero-stripe'`. */
  variant?: ImageFrameVariant;
  /** Optional caption rendered below the figure. */
  caption?: string;
  /** Base tone for the mint layer (token-backed). Defaults to `'mint'`. */
  baseTone?: PatternTone;
  /** Overlay tone for the navy layer (token-backed). Defaults to `'navy'`. */
  overlayTone?: PatternTone;
  /** Navy overlay opacity 0–1. Defaults to `0.5`. Per-variant recommendation in spec. */
  overlayOpacity?: number;
  /** Optional className for the outer figure. */
  className?: string;
};
```

`PatternTone` is the existing tone enum from `@/components/patterns/tones` (`navy | mint | subtle | card | border | background`).

## Three variants

Geometries are visual approximations of the Inkscape references, simplified to CSS `polygon(...)` clips with 4–6 vertices. Tweak the polygon numbers to fine-tune per variant.

### `hero-stripe` (Reference 1)

Single navy diagonal stripe across the photo. The polygon is the same chamfer pattern used elsewhere in the design system (top-right cut), so it composes visually with `NumberBadge` and `ChamferedCard`.

- Mint base: full rectangle, tone `mint`
- Photo + navy clip-path: `polygon(0% 0%, 70% 0%, 100% 30%, 100% 100%, 0% 100%)`
- Navy overlay opacity: `0.5`

### `stacked-bands` (Reference 2)

Mint band sits on top of the photo (the photo is partly hidden by it), navy diagonal stripe cuts across the middle.

- Mint base: full rectangle, tone `mint`
- Photo: full rectangle (no clip)
- Navy + clip-path: `polygon(0% 35%, 100% 15%, 100% 45%, 0% 65%)` (a parallelogram going slightly upward to the right)

### `framed-overlay` (Reference 3)

Mint frames the lower-left corner; photo + navy overlay occupies the upper-right triangle.

- Mint base: full rectangle, tone `mint`
- Photo + navy clip-path: `polygon(0% 0%, 100% 0%, 100% 50%, 50% 100%, 0% 100%)`
- Navy overlay opacity: `0.4`

These polygons are illustrative — final values get tuned in Storybook against the reference photos.

## Accessibility

- `<figure>` wraps the layers, `<img alt={alt}>` for the photo
- Mint and navy decorative layers are `aria-hidden="true"`
- `<figcaption>` rendered when `caption` is supplied
- Focus styles apply only to the figure (no interactive children)

## Aspect ratio & sizing

- Default container: `aspect-video` (16:9), overridable via `className`
- Photo uses `object-cover` to fill the container while preserving aspect ratio
- Layers use `inset-0` so they fill the figure without separate sizing props

## File layout

`ImageFrame` moves out of `Patterns.tsx` into its own file:

```
src/components/patterns/ImageFrame.tsx
src/components/patterns/ImageFrame.stories.tsx   ← three variant stories + one with caption
```

`Patterns.tsx` keeps `ShapeMask`-related exports (`SectionShape`, `DiagonalBand`, etc.) but no longer defines `ImageFrame`. Existing imports (`./Patterns`) in `ImageFrames.stories.tsx` and any other consumer get updated to `./ImageFrame`.

## Stories

`ImageFrame.stories.tsx` ships four stories:

- **`HeroStripe`** — `variant="hero-stripe"`, hero photo (the living-room reference), caption optional
- **`StackedBands`** — `variant="stacked-bands"`, photo with two people reference
- **`FramedOverlay`** — `variant="framed-overlay"`, hands-on-table reference
- **`WithCaption`** — any variant with `caption` set, demonstrating the figcaption path

All four stories use real `src` URLs from the hostlink image assets (`/photo-hero.jpg` etc. in `/public`). If the assets aren't available at implementation time, the stories fall back to a placeholder via `<img src="..." onError={...}>` or a small inline data URI of a grey rectangle — but the production paths stay clean.

## Out of scope (re-stated)

- No new `ClipPath` helper extracted from `ShapeMask`
- No motion / animation
- No aspect-ratio prop (overridable via `className`)
- No dark mode handling — the clip-paths are tone-driven via tokens, so theme changes flow naturally

## Acceptance criteria

1. `<ImageFrame src="..." alt="..." />` renders a real photo (not a placeholder) with three layered decorative divs
2. Each of the three variants produces a visually distinct composition matching the Inkscape references
3. Photo and navy overlay share the same `clip-path` so they align perfectly
4. `caption` prop renders a `<figcaption>` below the image
5. Decorative layers are `aria-hidden`; the `<img>` has the required `alt`
6. `tsc --noEmit` clean
7. `vitest run` shows no regression (89 unit tests still pass)
8. Storybook build succeeds; new stories appear at `Components/ImageFrames`
9. Existing call sites of `<ImageFrame>` (only `ImageFrames.stories.tsx` after this change) compile without changes
