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

## Path Data (from user's cleaned SVG exports)

The user provided cleaned SVG exports (via svgomg) for all three variants. Path data below is **already in viewBox-space coordinates** (no transform applied). Each variant has its own viewBox, so each has its own aspect ratio.

### `hero-stripe` (viewBox 0 0 736.7 1022.4)

User SVG:

```svg
<svg viewBox="0 0 736.7 1022.4">
  <path fill="#87bfb3" d="m666 1083-664 4V311l60 48v96l548 380h56z"/>
  <path fill="#253956" d="M666 835h-56L62 455v-96l604 420z"/>
  <path fill="#87bfb3" d="m782 479-20-16v-64L302 63V35l480 348z"/>
  <path fill="#253956" d="M762 463 302 123V55l460 344z"/>
  <path fill="#83b75b" fill-opacity=".2" d="M762 835H610L62 455V3h168l532 396"/>
</svg>
```

Parsed:

- **mint paths** (2): `m666 1083-664 4V311l60 48v96l548 380h56z` and `m782 479-20-16v-64L302 63V35l480 348z`
- **navy paths** (2): `M666 835h-56L62 455v-96l604 420z` and `M762 463 302 123V55l460 344z`
- **photo clip-path** (1, the `#83b75b` reference): `M762 835H610L62 455V3h168l532 396`
- **navy opacity**: 1.0 (fully opaque, fill-opacity removed)

### `stacked-bands` (viewBox 0 0 623.6 827.7)

User SVG:

```svg
<svg viewBox="0 0 623.6 827.7">
  <path fill="#80b558" fill-opacity=".2" d="M624 828H499L57 480V45h264l303 206"/>
  <path fill="#87bfb3" d="M0 828V347l57 39v94l434 340h57v8"/>
  <path fill="#253956" fill-opacity=".5" d="M548 820h-57L57 480v-94l491 370"/>
  <path fill="#87bfb3" d="M560 215 297 38V0l283 189v26"/>
</svg>
```

Parsed:

- **mint paths** (2): `M0 828V347l57 39v94l434 340h57v8` and `M560 215 297 38V0l283 189v26`
- **navy paths** (1): `M548 820h-57L57 480v-94l491 370`
- **photo clip-path** (1, the `#80b558` reference): `M624 828H499L57 480V45h264l303 206`
- **navy opacity**: 0.5

### `framed-overlay` (viewBox 0 0 453.5 328.8)

User SVG:

```svg
<svg viewBox="0 0 453.5 328.8">
  <path fill="#80b558" fill-opacity=".2" d="m57 228 139 101h258V132L246 0H57"/>
  <path fill="#87bfb3" d="M107 265H0V57l57 39v132z"/>
  <path fill="#253956" fill-opacity=".5" d="M291 265H108l-51-37V96z"/>
</svg>
```

Parsed:

- **mint paths** (1): `M107 265H0V57l57 39v132z`
- **navy paths** (1): `M291 265H108l-51-37V96z`
- **photo clip-path** (1, the `#80b558` reference): `m57 228 139 101h258V132L246 0H57`
- **navy opacity**: 0.5

### Photo clip-path polygon (CSS percentages)

CSS `clip-path: polygon(...)` uses percentages of the element's bounding box. Since each variant's figure aspect ratio matches its viewBox aspect ratio, viewBox percentages map directly to figure-box percentages:

`percentX = (x / viewBoxW) * 100`
`percentY = (y / viewBoxH) * 100`

Computed values (rounded to 2 decimals):

**`hero-stripe`** photo clip-path polygon:

```
(762/736.7, 835/1022.4) = (103.43%, 81.67%)
(610/736.7, 835/1022.4) = (82.80%, 81.67%)
(62/736.7, 455/1022.4) = (8.42%, 44.50%)
(62/736.7, 3/1022.4) = (8.42%, 0.29%)
(230/736.7, 3/1022.4) = (31.22%, 0.29%)
(762/736.7, 399/1022.4) = (103.43%, 39.02%)
```

**`stacked-bands`** photo clip-path polygon:

```
(624/623.6, 828/827.7) = (100.06%, 100.04%)
(499/623.6, 828/827.7) = (80.02%, 100.04%)
(57/623.6, 480/827.7) = (9.14%, 57.99%)
(57/623.6, 45/827.7) = (9.14%, 5.44%)
(321/623.6, 45/827.7) = (51.48%, 5.44%)
(624/623.6, 251/827.7) = (100.06%, 30.32%)
```

**`framed-overlay`** photo clip-path polygon:

```
(57/453.5, 228/328.8) = (12.57%, 69.34%)
(196/453.5, 329/328.8) = (43.22%, 100.06%)
(454/453.5, 329/328.8) = (100.11%, 100.06%)
(454/453.5, 132/328.8) = (100.11%, 40.15%)
(246/453.5, 0/328.8) = (54.24%, 0%)
(57/453.5, 0/328.8) = (12.57%, 0%)
```

Percentages > 100% are intentional — they push the polygon edge slightly beyond the figure box, ensuring clean corners where the user's reference shows the polygon extending past the viewBox. CSS clips to the element bounds.

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
    // hero-stripe uses viewBox 736.7 × 1022.4 — aspect ratio is set inline
    expect(figure?.className).toMatch(/relative/);
    expect(figure?.className).toMatch(/overflow-hidden/);
    const style = figure?.getAttribute("style") || "";
    expect(style).toMatch(/aspect-ratio/i);
    expect(style).toContain("736.7");
    expect(style).toContain("1022.4");
  });

  it("uses each variant\u2019s own viewBox aspect ratio", () => {
    const { container: c1 } = render(
      <ImageFrame variant="stacked-bands" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    );
    const f1 = c1.querySelector("figure");
    expect(f1?.getAttribute("style")).toContain("623.6");
    expect(f1?.getAttribute("style")).toContain("827.7");

    const { container: c2 } = render(
      <ImageFrame variant="framed-overlay" src={SAMPLE_SRC} alt={SAMPLE_ALT} />,
    );
    const f2 = c2.querySelector("figure");
    expect(f2?.getAttribute("style")).toContain("453.5");
    expect(f2?.getAttribute("style")).toContain("328.8");
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

### Task 2: Implement `ImageFrame` component with user's SVG data

**Files:**

- Create: `src/components/patterns/ImageFrame.tsx`

- [ ] **Step 1: Create the component file with the user's exact SVG data**

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
 *
 * Variant geometry was exported from Inkscape as SVG, cleaned with svgomg,
 * and embedded in `VARIANTS` below. Each variant has its own viewBox, so
 * each has its own aspect ratio.
 */
export type ImageFrameVariant =
  | "hero-stripe"
  | "stacked-bands"
  | "framed-overlay";

/**
 * Geometry for a single variant. Each variant has its own viewBox so
 * the photo's clip-path polygon (CSS percentages) aligns with the
 * mint and navy SVG paths (viewBox units).
 */
type VariantGeometry = {
  /** SVG viewBox width and height for the mint and navy layers. */
  viewBox: { width: number; height: number };
  /** CSS clip-path polygon for the photo (percentage vertices). */
  photoClip: string;
  /** SVG path strings for the mint polygon(s), drawn first (bottom). */
  mint: string[];
  /** SVG path strings for the navy polygon(s), drawn last (top). */
  navy: string[];
  /** Default navy overlay opacity (0–1). */
  navyOpacity: number;
};

const VARIANTS: Record<ImageFrameVariant, VariantGeometry> = {
  // Reference: living-room photo with navy diagonal stripe + mint wedge.
  "hero-stripe": {
    viewBox: { width: 736.7, height: 1022.4 },
    photoClip:
      "polygon(103.43% 81.67%, 82.80% 81.67%, 8.42% 44.50%, 8.42% 0.29%, 31.22% 0.29%, 103.43% 39.02%)",
    mint: [
      "m666 1083-664 4V311l60 48v96l548 380h56z",
      "m782 479-20-16v-64L302 63V35l480 348z",
    ],
    navy: ["M666 835h-56L62 455v-96l604 420z", "M762 463 302 123V55l460 344z"],
    navyOpacity: 1.0,
  },
  // Reference: photo of two people with mint top + navy stripe + photo.
  "stacked-bands": {
    viewBox: { width: 623.6, height: 827.7 },
    photoClip:
      "polygon(100.06% 100.04%, 80.02% 100.04%, 9.14% 57.99%, 9.14% 5.44%, 51.48% 5.44%, 100.06% 30.32%)",
    mint: ["M0 828V347l57 39v94l434 340h57v8", "M560 215 297 38V0l283 189v26"],
    navy: ["M548 820h-57L57 480v-94l491 370"],
    navyOpacity: 0.5,
  },
  // Reference: hands photo with tiny mint corner + semi-transparent navy overlay.
  "framed-overlay": {
    viewBox: { width: 453.5, height: 328.8 },
    photoClip:
      "polygon(12.57% 69.34%, 43.22% 100.06%, 100.11% 100.06%, 100.11% 40.15%, 54.24% 0%, 12.57% 0%)",
    mint: ["M107 265H0V57l57 39v132z"],
    navy: ["M291 265H108l-51-37V96z"],
    navyOpacity: 0.5,
  },
};

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
    viewBox,
    photoClip,
    mint,
    navy,
    navyOpacity: defaultNavyOpacity,
  } = VARIANTS[variant];
  const opacity = navyOpacity ?? defaultNavyOpacity;
  const viewBoxAttr = `0 0 ${viewBox.width} ${viewBox.height}`;

  return (
    <figure
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio: `${viewBox.width} / ${viewBox.height}` }}
    >
      {/* Layer 1: Mint polygon (bottom) */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full"
        viewBox={viewBoxAttr}
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
        viewBox={viewBoxAttr}
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

Expected: PASS (all 12 tests). The actual SVG path data renders correctly with the test assertions.

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`

Expected: clean (no new errors).

- [ ] **Step 4: Commit**

```bash
git add src/components/patterns/ImageFrame.tsx tests/int/image-frame.int.spec.tsx
git commit -m "feat(image-frame): add layered ImageFrame v2 with placeholder polygon data"
```

---

### Task 3: Verify visual fidelity in Storybook

**Files:**

- No file changes — verification only.

- [ ] **Step 1: Start Storybook if not running**

Run: `pnpm storybook -p 6007` (if not already running in another terminal)

- [ ] **Step 2: Open each variant URL and verify against the user's references**

Open these URLs in a browser and visually compare against the user's reference images:

- `http://localhost:6007/?path=/story/components-imageframe--hero-stripe`
- `http://localhost:6007/?path=/story/components-imageframe--stacked-bands`
- `http://localhost:6007/?path=/story/components-imageframe--framed-overlay`

For each variant verify:

- Mint polygon is visible in the correct region (matches reference).
- Photo is visible in the polygon defined by `photoClip`.
- Navy polygon sits on top of the photo with the expected opacity.

If polygons look wrong, check the path data in `VARIANTS` against the user's reference SVG and re-derive if needed.

- [ ] **Step 3: Run tests to verify nothing regressed**

Run: `npx vitest run tests/int/image-frame.int.spec.tsx`

Expected: PASS (the contract tests check structure, not exact polygon coordinates).

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

Expected: All previously-passing tests still pass. The new `image-frame.int.spec.tsx` adds 12 new passing tests.

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

Expected: All tests pass (existing + 12 new ImageFrame tests).

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
- `vitest run`: 89 existing tests + 12 new ImageFrame tests, all pass.
- `storybook build`: succeeds.
- Live Storybook at `http://localhost:6007/?path=/story/components-imageframe--*` renders all three variants.
- `Patterns.tsx` no longer exports `ImageFrame` (cleaned up).
- `ImageFrames.stories.tsx` uses the new component.

## Risks

1. **Path data accuracy** depends on the user exporting correct viewBox-space coordinates from Inkscape. If the user's exports are in different viewBoxes, the conversion (matrix transform) must be applied correctly.
2. **`fillOpacity` on SVG paths** — some browsers may render slightly differently. The component uses `fillOpacity` (SVG attribute) for opacity, which is well-supported.
3. **`<img>` with `object-cover` and `object-position`** combined with `clip-path` may have minor rendering differences across browsers (Chrome, Firefox, Safari). Tested in Chrome via Storybook; cross-browser testing is out of scope for this plan.
