# ImageFrame v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder `ImageFrame` (mint `ShapeMask` only) with a layered component that renders a real photo clipped by a polygon, with mint and navy decorative polygons above and below.

**Architecture:** Three absolutely-positioned layers inside a `relative` figure — mint (SVG `<path>`, bottom) → photo (`<img>` with CSS `clip-path: polygon(...)`, middle) → navy (SVG `<path>`, top, optionally semi-transparent). A static `VARIANTS` map holds the geometry for the three pre-composed variants.

**Tech Stack:** React 19, TypeScript, Tailwind v4, SVG `<path>`, CSS `clip-path`

---

## File Structure

```
src/components/patterns/ImageFrame.tsx          ← new layered component
src/components/patterns/ImageFrame.stories.tsx  ← 5 stories (3 variants + 2 derived)
tests/int/image-frame.int.spec.tsx              ← component contract tests
src/components/patterns/Patterns.tsx            ← remove old placeholder ImageFrame
src/components/patterns/ImageFrames.stories.tsx ← repoint to new component
```

The current placeholder `ImageFrame` in `Patterns.tsx` is removed. The only consumer is `ImageFrames.stories.tsx`, which is repointed to the new export.

---

## Path Data (Placeholder Polygon Coordinates)

The exact polygon data for each variant must be derived from the user's Inkscape SVG exports. Until the user provides viewBox-space coordinates, the implementation uses the **placeholder polygon data below**. Each task notes which variant's data must be replaced with the user's actual geometry.

**Placeholder polygon data (replace with user-provided values during implementation Task 3):**

```ts
// ViewBox-space coordinates for the combined SVG (viewBox="0 0 736.7 1022.4")
// Replace with the user's actual exported path data.

const PLACEHOLDER_VARIANTS = {
  "hero-stripe": {
    mint: [
      // Subpath 1: upper-left wedge
      "M 4 311 H 62 V 359 L 25 455 H 4 Z",
      // Subpath 2: small lower-left accent
      "M 4 480 H 25 V 510 L 4 530 Z",
    ],
    photoClip: "polygon(0% 0%, 100% 0%, 100% 100%, 30% 100%, 0% 50%)",
    navy: [
      // Thick diagonal stripe in the upper-right
      "M 500 0 H 736.7 V 200 L 500 350 Z",
    ],
    navyOpacity: 1.0,
  },
  "stacked-bands": {
    mint: [
      // Top wedge
      "M 0 0 H 736.7 V 150 L 400 280 H 0 Z",
    ],
    photoClip: "polygon(0% 30%, 100% 30%, 100% 100%, 0% 100%)",
    navy: [
      // Diagonal stripe through middle
      "M 200 450 H 736.7 V 600 L 200 750 Z",
    ],
    navyOpacity: 0.6,
  },
  "framed-overlay": {
    mint: [
      // Tiny bottom-left corner
      "M 0 950 H 80 V 1022.4 H 0 Z",
    ],
    photoClip: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    navy: [
      // Full-frame overlay (placeholder — will be replaced with semi-transparent fill
      // applied to the same viewBox via fill-opacity, not a polygon)
    ],
    navyOpacity: 0.4,
  },
} as const;
```

These placeholder polygons render sensible-looking compositions but **do not match the user's references**. Task 3 (Pin Exact Path Data) replaces them with the user's actual SVG exports.

---

### Task 1: Add failing render tests for `ImageFrame`

**Files:**

- Create: `tests/int/image-frame.int.spec.tsx`

- [ ] **Step 1: Write failing tests for component contract**

Create `tests/int/image-frame.int.spec.tsx`:

```tsx
import * as React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ImageFrame } from "@/components/patterns/ImageFrame";

const SAMPLE_SRC = "/sample-photo.jpg";
const SAMPLE_ALT = "A sample photograph";

describe("ImageFrame component contract", () => {
  it("renders a figure with the configured src and alt", () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe(SAMPLE_SRC);
    expect(img?.getAttribute("alt")).toBe(SAMPLE_ALT);
  });

  it("wraps the photo in a figure with the configured aspect ratio", () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    );
    const figure = container.querySelector("figure");
    expect(figure).not.toBeNull();
    expect(figure?.className).toMatch(/aspect-video/);
    expect(figure?.className).toMatch(/relative/);
    expect(figure?.className).toMatch(/overflow-hidden/);
  });

  it("renders decorative mint and navy SVG layers with aria-hidden", () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(2); // mint + navy
    svgs.forEach((svg) => {
      expect(svg.getAttribute("aria-hidden")).toBe("true");
    });
  });

  it("applies a CSS clip-path to the photo img", () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    );
    const img = container.querySelector("img");
    const style = img?.getAttribute("style") || "";
    expect(style).toContain("clip-path");
    expect(style).toContain("polygon");
  });

  it("sets object-position on the photo from the objectPosition prop", () => {
    const { container } = render(
      <ImageFrame
        variant="hero-stripe"
        src={SAMPLE_SRC}
        alt={SAMPLE_ALT}
        objectPosition="70% 30%"
      />,
    );
    const img = container.querySelector("img");
    expect(img?.style.objectPosition).toBe("70% 30%");
  });

  it('defaults object-position to "50% 50%" when not provided', () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    );
    const img = container.querySelector("img");
    expect(img?.style.objectPosition).toBe("50% 50%");
  });

  it("applies the navy overlay opacity from the variant default", () => {
    const { container } = render(
      <ImageFrame variant="stacked-bands" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    );
    const navySvg = container.querySelectorAll("svg")[1];
    const navyPath = navySvg?.querySelector("path");
    // stacked-bands default navyOpacity is 0.6 — encoded via fill-opacity attribute
    expect(navyPath?.getAttribute("fill-opacity")).toBe("0.6");
  });

  it("overrides the navy overlay opacity when navyOpacity prop is provided", () => {
    const { container } = render(
      <ImageFrame
        variant="hero-stripe"
        src={SAMPLE_SRC}
        alt={SAMPLE_ALT}
        navyOpacity={0.3}
      />,
    );
    const navySvg = container.querySelectorAll("svg")[1];
    const navyPath = navySvg?.querySelector("path");
    expect(navyPath?.getAttribute("fill-opacity")).toBe("0.3");
  });

  it("renders a figcaption when caption prop is provided", () => {
    const { container } = render(
      <ImageFrame
        variant="hero-stripe"
        src={SAMPLE_SRC}
        alt={SAMPLE_ALT}
        caption="Operations visual"
      />,
    );
    const figcaption = container.querySelector("figcaption");
    expect(figcaption).not.toBeNull();
    expect(figcaption?.textContent).toBe("Operations visual");
  });

  it("omits figcaption when caption prop is absent", () => {
    const { container } = render(
      <ImageFrame variant="hero-stripe" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    );
    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("forwards className to the figure element", () => {
    const { container } = render(
      <ImageFrame
        variant="hero-stripe"
        src={SAMPLE_SRC}
        alt={SAMPLE_ALT}
        className="custom-class"
      />,
    );
    const figure = container.querySelector("figure");
    expect(figure?.className).toContain("custom-class");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/int/image-frame.int.spec.tsx`

Expected: FAIL with "Cannot find module '@/components/patterns/ImageFrame'" or similar module-resolution error.

---

### Task 2: Implement `ImageFrame` component with placeholder geometry

**Files:**

- Create: `src/components/patterns/ImageFrame.tsx`

- [ ] **Step 1: Create the component file with placeholder data**

Create `src/components/patterns/ImageFrame.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/utilities/ui";

/**
 * Pre-composed image-frame variants that match the three hostlink
 * pamphlet photo compositions (mint wedge, photo, navy stripe).
 *
 * Each variant specifies three independent polygons (mint, photo clip-path,
 * navy) — they do not tile the frame. Outside the photo's clip-path,
 * the parent figure's background shows through.
 */
export type ImageFrameVariant =
  | "hero-stripe"
  | "stacked-bands"
  | "framed-overlay";

const VIEWBOX_WIDTH = 736.7;
const VIEWBOX_HEIGHT = 1022.4;

/**
 * Placeholder polygon data. Replace with the user's actual SVG exports
 * during Task 3.
 *
 * Each variant defines:
 *   - mint: SVG path strings for the mint polygon(s), drawn first (bottom).
 *   - photoClip: CSS clip-path polygon for the photo (percentage vertices
 *     relative to the photo's bounding box).
 *   - navy: SVG path strings for the navy polygon(s), drawn last (top).
 *   - navyOpacity: 0–1, applied via fill-opacity on the navy path(s).
 */
const VARIANTS: Record<
  ImageFrameVariant,
  {
    mint: string[];
    photoClip: string;
    navy: string[];
    navyOpacity: number;
  }
> = {
  "hero-stripe": {
    mint: ["M 4 311 H 62 V 359 L 25 455 H 4 Z", "M 4 480 H 25 V 510 L 4 530 Z"],
    photoClip: "polygon(0% 0%, 100% 0%, 100% 100%, 30% 100%, 0% 50%)",
    navy: ["M 500 0 H 736.7 V 200 L 500 350 Z"],
    navyOpacity: 1.0,
  },
  "stacked-bands": {
    mint: ["M 0 0 H 736.7 V 150 L 400 280 H 0 Z"],
    photoClip: "polygon(0% 30%, 100% 30%, 100% 100%, 0% 100%)",
    navy: ["M 200 450 H 736.7 V 600 L 200 750 Z"],
    navyOpacity: 0.6,
  },
  "framed-overlay": {
    mint: ["M 0 950 H 80 V 1022.4 H 0 Z"],
    photoClip: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    // Full-frame overlay: a single rectangle path with viewBox dimensions.
    navy: [`M 0 0 H ${VIEWBOX_WIDTH} V ${VIEWBOX_HEIGHT} H 0 Z`],
    navyOpacity: 0.4,
  },
} as const;

/**
 * `ImageFrame` renders a real photograph surrounded by decorative mint and
 * navy polygons. The three layers stack:
 *
 * 1. **Mint polygon** (bottom): opaque mint fill drawn as an SVG path.
 * 2. **Photo** (middle): `<img>` clip-pathed to a CSS polygon.
 * 3. **Navy polygon** (top): SVG path, optionally semi-transparent.
 *
 * Use `objectPosition` to set the photo's focus point inside its
 * clip-path (e.g., `"70% 30%"` keeps the upper-right of the photo visible
 * when the clip-path crops the rest).
 *
 * @summary layered photo with mint wedge and navy overlay
 */
export const ImageFrame: React.FC<{
  variant: ImageFrameVariant;
  src: string;
  alt: string;
  caption?: string;
  /**
   * Override the variant's default navy overlay opacity. 0 = invisible,
   * 1 = fully opaque.
   */
  navyOpacity?: number;
  /**
   * CSS `object-position` for the photo inside its clip-path.
   * Controls which part of the photo survives the clip-path crop.
   */
  objectPosition?: string;
  className?: string;
}> = ({
  variant,
  src,
  alt,
  caption,
  navyOpacity,
  objectPosition = "50% 50%",
  className,
}) => {
  const {
    mint,
    photoClip,
    navy,
    navyOpacity: defaultNavyOpacity,
  } = VARIANTS[variant];
  const opacity = navyOpacity ?? defaultNavyOpacity;

  return (
    <figure className={cn("relative aspect-video overflow-hidden", className)}>
      {/* Layer 1: Mint polygon (bottom) */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
      >
        {mint.map((d, index) => (
          <path key={`mint-${index}`} d={d} fill="var(--accent)" />
        ))}
      </svg>

      {/* Layer 2: Photo (middle, clip-pathed) */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 size-full object-cover"
        style={{ clipPath: photoClip, objectPosition }}
      />

      {/* Layer 3: Navy polygon (top) */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
      >
        {navy.map((d, index) => (
          <path
            key={`navy-${index}`}
            d={d}
            fill="var(--secondary)"
            fillOpacity={opacity}
          />
        ))}
      </svg>

      {/* Layer 4: Optional caption */}
      {caption ? (
        <figcaption className="absolute bottom-0 left-0 right-0 bg-card/80 p-2 font-mono text-xs uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
};

export default ImageFrame;
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `npx vitest run tests/int/image-frame.int.spec.tsx`

Expected: PASS (all 11 tests). The placeholder polygons render correctly with the test assertions.

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`

Expected: clean (no new errors).

- [ ] **Step 4: Commit**

```bash
git add src/components/patterns/ImageFrame.tsx tests/int/image-frame.int.spec.tsx
git commit -m "feat(image-frame): add layered ImageFrame v2 with placeholder polygon data"
```

---

### Task 3: Pin exact polygon data from the user's SVG exports

**Files:**

- Modify: `src/components/patterns/ImageFrame.tsx` (replace `VARIANTS` values)

This task is **manual data entry**, not automated. It converts the user's Inkscape SVG exports into viewBox-space polygon coordinates and replaces the placeholder values.

- [ ] **Step 1: Confirm SVG exports from the user**

Ask the user to provide the Inkscape SVG files for each of the three variants. Each variant needs:

- Mint polygon's SVG path data, transformed to viewBox space.
- Photo clip-path polygon's vertex coordinates (in % of the photo's bounding box).
- Navy polygon's SVG path data, transformed to viewBox space.

If the user has already shared viewBox-space coordinates during brainstorming, use those. Otherwise, convert each path's local coordinates to viewBox-space by applying the SVG's `transform` attribute (e.g., `matrix(4 0 0 4 -38 -57)` multiplies x by 4 then subtracts 38, same for y).

- [ ] **Step 2: Replace placeholder polygon data**

In `src/components/patterns/ImageFrame.tsx`, replace the three placeholder polygon sets in `VARIANTS`:

- `'hero-stripe'.mint`, `'hero-stripe'.photoClip`, `'hero-stripe'.navy`
- `'stacked-bands'.mint`, `'stacked-bands'.photoClip`, `'stacked-bands'.navy`
- `'framed-overlay'.mint`, `'framed-overlay'.photoClip`, `'framed-overlay'.navy`

Use the actual user-provided viewBox-space path data.

- [ ] **Step 3: Verify visual fidelity in Storybook**

Run: `pnpm storybook -p 6007`

Open `http://localhost:6007/?path=/story/components-imageframes--hero-stripe` in a browser. Verify:

- The mint polygon is visible in the correct region.
- The photo is visible in the polygon defined by `photoClip`.
- The navy polygon sits on top of the photo with the expected opacity.

If the polygons look wrong, re-derive the coordinates and re-run.

- [ ] **Step 4: Run tests**

Run: `npx vitest run tests/int/image-frame.int.spec.tsx`

Expected: PASS (the contract tests check structure, not exact polygon coordinates).

- [ ] **Step 5: Commit**

```bash
git add src/components/patterns/ImageFrame.tsx
git commit -m "feat(image-frame): pin exact polygon data from user SVG exports"
```

---

### Task 4: Add Storybook stories

**Files:**

- Create: `src/components/patterns/ImageFrame.stories.tsx`

- [ ] **Step 1: Create the stories file**

Create `src/components/patterns/ImageFrame.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ImageFrame } from "./ImageFrame";

const SAMPLE_SRC = "/sample-photo.jpg";
const SAMPLE_ALT = "A sample photograph for the hostlink image frame";

const meta: Meta<typeof ImageFrame> = {
  title: "Components/ImageFrame",
  component: ImageFrame,
  parameters: { layout: "padded" },
  args: {
    src: SAMPLE_SRC,
    alt: SAMPLE_ALT,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["hero-stripe", "stacked-bands", "framed-overlay"],
    },
    navyOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    objectPosition: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Hero-stripe variant — small mint wedge in the upper-left, photo
 * filling the diagonal complement, navy diagonal stripe across the upper-right.
 *
 * @summary navy diagonal stripe with mint accent
 */
export const HeroStripe: Story = {
  args: { variant: "hero-stripe" },
};

/**
 * Stacked-bands variant — mint wedge on top, photo extending downward,
 * navy diagonal stripe through the middle (semi-transparent).
 *
 * @summary mint top + navy stripe + photo
 */
export const StackedBands: Story = {
  args: { variant: "stacked-bands" },
};

/**
 * Framed-overlay variant — tiny mint corner, photo covering almost the
 * full frame, semi-transparent navy overlay on top.
 *
 * @summary mint corner + navy overlay
 */
export const FramedOverlay: Story = {
  args: { variant: "framed-overlay" },
};

/**
 * No-caption variant — confirms the figcaption is absent when not provided.
 *
 * @summary without figcaption
 */
export const NoCaption: Story = {
  args: { variant: "hero-stripe", caption: undefined },
};

/**
 * Custom-opacity variant — overrides the variant's default navy opacity.
 * Demonstrates the `navyOpacity` prop.
 *
 * @summary with overridden navy opacity
 */
export const CustomOpacity: Story = {
  args: { variant: "hero-stripe", navyOpacity: 0.25 },
};
```

- [ ] **Step 2: Verify stories load in Storybook**

Run: `pnpm storybook -p 6007` (if not already running)

Open each story URL and confirm it renders:

- `http://localhost:6007/?path=/story/components-imageframe--hero-stripe`
- `http://localhost:6007/?path=/story/components-imageframe--stacked-bands`
- `http://localhost:6007/?path=/story/components-imageframe--framed-overlay`
- `http://localhost:6007/?path=/story/components-imageframe--no-caption`
- `http://localhost:6007/?path=/story/components-imageframe--custom-opacity`

- [ ] **Step 3: Verify the story index registers all 5 stories**

Run: `curl -s http://localhost:6007/index.json | python3 -c "import sys,json; d=json.load(sys.stdin); ids=[k for k in d['entries'] if k.startswith('components-imageframe--')]; print(ids)"`

Expected: 5 entries: `components-imageframe--docs`, `components-imageframe--hero-stripe`, `components-imageframe--stacked-bands`, `components-imageframe--framed-overlay`, `components-imageframe--no-caption`, `components-imageframe--custom-opacity`.

- [ ] **Step 4: Run tsc**

Run: `npx tsc --noEmit`

Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/patterns/ImageFrame.stories.tsx
git commit -m "feat(image-frame): add Storybook stories for 3 variants + edge cases"
```

---

### Task 5: Remove the old placeholder `ImageFrame` from `Patterns.tsx`

**Files:**

- Modify: `src/components/patterns/Patterns.tsx` (delete the `ImageFrame` export and its JSDoc)

- [ ] **Step 1: Read the current `Patterns.tsx` to find the exact text**

Run: `grep -n "ImageFrame" src/components/patterns/Patterns.tsx`

Expected output: 3 matches — the JSDoc block, the `export const ImageFrame` line, and possibly an internal usage.

- [ ] **Step 2: Delete the JSDoc block and the `ImageFrame` export**

In `src/components/patterns/Patterns.tsx`, delete lines containing the `ImageFrame` JSDoc comment and the `export const ImageFrame: React.FC<...> = (...)` block (everything from the JSDoc opener through the closing `);` of the `ImageFrame` component).

The block to delete starts with `/**` for the `ImageFrame` JSDoc and ends with the `);` that closes the `ImageFrame` const declaration.

- [ ] **Step 3: Run tsc**

Run: `npx tsc --noEmit`

Expected: clean. The deleted `ImageFrame` had no other internal references.

- [ ] **Step 4: Commit**

```bash
git add src/components/patterns/Patterns.tsx
git commit -m "refactor(patterns): remove placeholder ImageFrame from Patterns.tsx"
```

---

### Task 6: Repoint `ImageFrames.stories.tsx` to the new `ImageFrame`

**Files:**

- Modify: `src/components/patterns/ImageFrames.stories.tsx`

- [ ] **Step 1: Update the import**

In `src/components/patterns/ImageFrames.stories.tsx`, change the import:

```tsx
// Before
import { ImageFrame } from "./Patterns";

// After
import { ImageFrame } from "./ImageFrame";
```

- [ ] **Step 2: Add the `variant` prop to the existing story**

The existing `Default` story in `ImageFrames.stories.tsx` renders `<ImageFrame>` without a `variant` prop. Add `variant="hero-stripe"` to it (or another variant — pick the one that best matches the story's purpose).

Find the existing render in the file and add `variant="hero-stripe"` (or similar) to each `<ImageFrame>`:

```tsx
<ImageFrame
  alt="Abstract hostlink workspace visual"
  caption="Operations visual"
  variant="hero-stripe"
  src="/sample-photo.jpg"
/>
```

Add the `src` prop (it was missing because the old placeholder didn't need a real photo). Use the same sample image URL as the new stories file.

- [ ] **Step 3: Run tsc**

Run: `npx tsc --noEmit`

Expected: clean.

- [ ] **Step 4: Verify the legacy story still loads in Storybook**

Run: `curl -s http://localhost:6007/index.json | python3 -c "import sys,json; d=json.load(sys.stdin); print([k for k in d['entries'] if k.startswith('components-imageframes--')])"`

Expected: `components-imageframes--docs` and `components-imageframes--default`.

- [ ] **Step 5: Run full test suite**

Run: `npx vitest run`

Expected: All previously-passing tests still pass. The new `image-frame.int.spec.tsx` adds 11 new passing tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/patterns/ImageFrames.stories.tsx
git commit -m "refactor(image-frames-stories): repoint to new ImageFrame and add variant prop"
```

---

### Task 7: Run final verification

**Files:**

- No file changes — verification only.

- [ ] **Step 1: Run full TypeScript check**

Run: `npx tsc --noEmit`

Expected: clean.

- [ ] **Step 2: Run full Vitest suite**

Run: `npx vitest run`

Expected: All tests pass (existing + 11 new ImageFrame tests).

- [ ] **Step 3: Run Storybook build**

Run: `NODE_OPTIONS=--no-deprecation npx storybook build 2>&1 | tail -20`

Expected: "Storybook build completed successfully".

- [ ] **Step 4: Verify all 3 variants render correctly in Storybook**

Start Storybook if not running: `pnpm storybook -p 6007`

Open each variant URL and visually confirm:

- `http://localhost:6007/?path=/story/components-imageframe--hero-stripe`
- `http://localhost:6007/?path=/story/components-imageframe--stacked-bands`
- `http://localhost:6007/?path=/story/components-imageframe--framed-overlay`

Verify the polygons match the user's reference images (mint, photo, navy in correct positions with correct opacities).

---

## Verification Summary

After all tasks complete:

- `tsc --noEmit`: clean.
- `vitest run`: 89 existing tests + 11 new ImageFrame tests, all pass.
- `storybook build`: succeeds.
- Live Storybook at `http://localhost:6007/?path=/story/components-imageframe--*` renders all three variants.
- `Patterns.tsx` no longer exports `ImageFrame` (cleaned up).
- `ImageFrames.stories.tsx` uses the new component.

## Risks

1. **Path data accuracy** depends on the user exporting correct viewBox-space coordinates from Inkscape. If the user's exports are in different viewBoxes, the conversion (matrix transform) must be applied correctly.
2. **`fillOpacity` on SVG paths** — some browsers may render slightly differently. The component uses `fillOpacity` (SVG attribute) for opacity, which is well-supported.
3. **`<img>` with `object-cover` and `object-position`** combined with `clip-path` may have minor rendering differences across browsers (Chrome, Firefox, Safari). Tested in Chrome via Storybook; cross-browser testing is out of scope for this plan.
