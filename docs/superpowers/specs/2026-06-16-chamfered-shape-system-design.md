# Chamfered Shape System — SVG-based rendering

## Problem

CSS `clip-path` cuts a shape but does not produce a proper border stroke along chamfered edges. A regular CSS border is drawn around the rectangular box and then clipped — diagonal edges have no true stroke. SVG `<path>` with `fill` + `stroke` solves this.

## Scope

Replace CSS `clip-path` + CSS `border` with real SVG `<path>` rendering in four components:

1. **ChamferedCard** — chamfered corners (was clip-path + border class)
2. **Button** — chamfered corner (was inline clip-path style)
3. **NumberBadge** — chamfered shape variant (was inline clip-path)
4. **DiagonalBand** — slanted trapezoid bar (was clip-path polygon)

## Architecture

```
chamfer.ts (extended)
├── buildChamferSvgPath()  — SVG path string from corner cuts
├── resolveChamferCut()    — existing, keep
├── oppositeChamfer()      — existing, keep
├── toneMap                — fill/stroke/textClass per tone
└── depth caps             — component-specific max values

useElementSize() hook      — ResizeObserver + RAF for fixed mode

Components using these:
├── ChamferedCard   — proportional (default) | fixed
├── Button          — fixed only (depth 0-5)
├── NumberBadge     — proportional only
└── DiagonalBand    — proportional only
```

## Sizing modes

| Mode           | viewBox             | ResizeObserver | Use Case                                |
| -------------- | ------------------- | -------------- | --------------------------------------- |
| `proportional` | `0 0 100 100`       | No             | Cards, decorative blocks, badges, bands |
| `fixed`        | `0 0 ${pxW} ${pxH}` | Yes            | Buttons, pixel-critical components      |

**Depth caps:**

- Button: 0–5 (inclusive, clamped)
- Card: 0–10
- Shapes (DiagonalBand, NumberBadge): 0–20

## Unit mapping

- **Proportional mode:** `chamferDepth = 4` → 4 viewBox units (4% of 100)
- **Fixed mode:** `chamferDepth = 4` → `4 * 4px = 16px`

## Path builder

`buildChamferSvgPath()` walks clockwise from top-left. Each corner has `{x, y}` cut distances. When a cut is `0,0` the corner stays sharp.

```ts
M {tl.x} 0
H {width - tr.x}
L {width} {tr.y}           // only if tr has a cut
V {height - br.y}
L {width - br.x} {height}  // only if br has a cut
H {bl.x}
L 0 {height - bl.y}        // only if bl has a cut
V {tl.y}
L {tl.x} 0                 // only if tl has a cut
Z
```

## Tone / color system

SVG `fill` and `stroke` reference CSS custom properties directly. No dynamic Tailwind class construction.

```ts
const toneMap = {
  card: {
    textClass: "text-card-foreground",
    fill: "var(--card)",
    stroke: "var(--border)",
  },
  subtle: {
    textClass: "text-(--heading)",
    fill: "var(--subtle-background)",
    stroke: "var(--border)",
  },
  background: {
    textClass: "text-foreground",
    fill: "var(--background)",
    stroke: "var(--border)",
  },
  navy: {
    textClass: "text-(--secondary-foreground)",
    fill: "var(--secondary)",
    stroke: "var(--secondary)",
  },
  mint: {
    textClass: "text-(--accent-foreground)",
    fill: "var(--accent)",
    stroke: "var(--accent)",
  },
};
```

Button variant → fill/stroke:

| Variant     | SVG fill             | SVG stroke           |
| ----------- | -------------------- | -------------------- |
| default     | `var(--primary)`     | `var(--primary)`     |
| outline     | `transparent`        | `var(--border)`      |
| secondary   | `var(--secondary)`   | `var(--secondary)`   |
| ghost       | `transparent`        | `transparent`        |
| destructive | `var(--destructive)` | `var(--destructive)` |
| link        | — (no chamfer)       | —                    |

## Component designs

### ChamferedCard

- Wrapper `div.relative` with text color class
- Absolutely positioned `<svg>` with `pointer-events-none`
- Content `div.relative.z-10`
- Default: `sizing="proportional"`, `strokeWidth={1}`
- No CSS `border` class, no `bg-*` on wrapper
- Same public props — fully backward compatible

### Button

- SVG rendered **inside** the button element when `chamferDepth > 0`
- Always uses `fixed` sizing (ResizeObserver for measured dimensions)
- `pointer-events-none` on SVG so clicks pass through
- Content wrapped in `span.relative.z-10`
- `chamferDepth` clamped to 0–5
- When depth = 0, no SVG, normal button

### NumberBadge

- SVG inside the `<span>` for `shape="chamfered"`
- Proportional viewBox `0 0 100 100`
- Default chamfer depth = 30 (30% cut, matching current clip-path)
- `square` and `circle` shapes keep existing CSS classes

### DiagonalBand

- SVG `<path>` draws the trapezoid instead of clip-path polygon
- Orientation `left`: `M 0 0 L 100 0 L 100 100 L {tilt} 100 Z` (adjusted)
- Orientation `right`: `M {tilt} 0 L 100 0 L 100 100 L 0 100 Z`
- Solid fill, no stroke
- Proportional mode, viewBox `0 0 100 100`
- `heightClassName` still controls outer wrapper height
- `--tilt` still controls cut offset (mapped to viewBox units)

## Accessibility

- SVG always `aria-hidden="true"`, `pointer-events-none`
- Same decorative detection: no `children` + no `ariaLabel` → `aria-hidden`
- Content above SVG via `relative z-10`

## Files touched

- `src/components/ui/chamfer.ts` — add `buildChamferSvgPath`, `toneMap`, `useElementSize`
- `src/components/patterns/ChamferedCard.tsx` — refactor to SVG
- `src/components/ui/button.tsx` — add SVG chamfer rendering
- `src/components/patterns/NumberBadge.tsx` — SVG for chamfered shape
- `src/components/patterns/DiagonalBand.tsx` — SVG for trapezoid
- `src/components/patterns/index.ts` — update exports if needed
- `tests/int/chamfer-geometry.int.spec.ts` — update/add SVG path tests
- `tests/int/patterns.int.spec.tsx` — update clip-path assertions to SVG
- `tests/int/button.int.spec.tsx` — update clip-path assertions
- `src/components/patterns/Cards.stories.tsx` — add sizing & tone stories
- `src/components/ui/Button.stories.tsx` — add stories

## Non-goals

- No CSS variable-based dynamic Tailwind class construction
- No `grid` sizing mode (deferred)
- No ImageFrame changes (component needs redesign, out of scope)
- No new abstraction beyond the shared path builder and hook
- No CSS `border` removal on wrapper (it may still be needed for layout)
