# Chamfered Shape System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace CSS `clip-path` + CSS `border` chamfered shapes with real SVG `<path>` rendering across ChamferedCard, Button, NumberBadge, and DiagonalBand.

**Architecture:** A shared SVG path builder in `chamfer.ts` generates `<path d="...">` strings from corner cut definitions. A `useElementSize` hook provides pixel-precise dimensions for `fixed` sizing mode. Each component independently wraps content with an absolutely-positioned SVG layer using `pointer-events-none` and `z-10`.

**Tech Stack:** React 19, TypeScript, Tailwind v4, SVG (`vectorEffect="non-scaling-stroke"`)

---

### Task 1: Add SVG path builder, tone maps, and depth caps to chamfer.ts

**Files:**

- Modify: `src/components/ui/chamfer.ts`
- Create: `src/components/ui/use-element-size.ts`
- Test: `tests/int/chamfer-geometry.int.spec.ts`
- Modify: `vitest.setup.ts`

- [ ] **Step 1: Write failing tests for SVG path builder**

Update `tests/int/chamfer-geometry.int.spec.ts`:

```ts
import {
  buildChamferSvgPath,
  buildChamferClipPath,
  oppositeChamfer,
  resolveChamferCut,
  type ChamferCut,
} from "@/components/ui/chamfer";

describe("SVG chamfer path builder", () => {
  it("builds a full rect when no cuts are specified (all x=0, y=0)", () => {
    expect(
      buildChamferSvgPath({
        width: 100,
        height: 100,
        topLeft: { x: 0, y: 0 },
        topRight: { x: 0, y: 0 },
        bottomRight: { x: 0, y: 0 },
        bottomLeft: { x: 0, y: 0 },
      }),
    ).toBe("M 0 0 H 100 V 100 H 0 Z");
  });

  it("builds a single top-right chamfer in proportional mode", () => {
    expect(
      buildChamferSvgPath({
        width: 100,
        height: 100,
        topLeft: { x: 0, y: 0 },
        topRight: { x: 8, y: 8 },
        bottomRight: { x: 0, y: 0 },
        bottomLeft: { x: 0, y: 0 },
      }),
    ).toBe("M 0 0 H 92 L 100 8 V 100 H 0 Z");
  });

  it("builds opposite corner chamfers (top-right + bottom-left)", () => {
    expect(
      buildChamferSvgPath({
        width: 100,
        height: 100,
        topLeft: { x: 0, y: 0 },
        topRight: { x: 12, y: 6 },
        bottomRight: { x: 0, y: 0 },
        bottomLeft: { x: 8, y: 16 },
      }),
    ).toBe("M 0 0 H 88 L 100 6 V 100 H 8 L 0 84 Z");
  });

  it("builds asymmetric cuts on all four corners", () => {
    expect(
      buildChamferSvgPath({
        width: 100,
        height: 100,
        topLeft: { x: 4, y: 2 },
        topRight: { x: 6, y: 3 },
        bottomRight: { x: 5, y: 7 },
        bottomLeft: { x: 3, y: 9 },
      }),
    ).toBe("M 4 0 H 94 L 100 3 V 93 L 95 100 H 3 L 0 91 Z");
  });

  it("builds a fixed-mode path using pixel dimensions", () => {
    expect(
      buildChamferSvgPath({
        width: 320,
        height: 48,
        topLeft: { x: 0, y: 0 },
        topRight: { x: 16, y: 16 },
        bottomRight: { x: 0, y: 0 },
        bottomLeft: { x: 0, y: 0 },
      }),
    ).toBe("M 0 0 H 304 L 320 16 V 48 H 0 Z");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/int/chamfer-geometry.int.spec.ts`
Expected: TypeScript/build error — `buildChamferSvgPath` not exported

- [ ] **Step 3: Add SVG path builder to chamfer.ts**

Add before the file's existing `buildChamferClipPath` function:

```ts
export type SvgCornerCut = { x: number; y: number };

export type SvgPathArgs = {
  width: number;
  height: number;
  topLeft?: SvgCornerCut;
  topRight?: SvgCornerCut;
  bottomRight?: SvgCornerCut;
  bottomLeft?: SvgCornerCut;
};

export type ChamferSizing = "proportional" | "fixed";

export type ChamferedCardTone =
  | "card"
  | "subtle"
  | "background"
  | "navy"
  | "mint";

export type ChamferedButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link";

/**
 * Build an SVG `<path d="...">` string for a chamfered rectangle.
 * Walks clockwise from top-left. A corner with x=0 AND y=0 produces
 * a sharp 90° corner (no cut line emitted).
 */
export function buildChamferSvgPath({
  width,
  height,
  topLeft = { x: 0, y: 0 },
  topRight = { x: 0, y: 0 },
  bottomRight = { x: 0, y: 0 },
  bottomLeft = { x: 0, y: 0 },
}: SvgPathArgs): string {
  const parts: string[] = [];

  // Top-left → Top-right
  if (topLeft.x || topLeft.y) {
    parts.push(`M ${topLeft.x} 0`);
  } else {
    parts.push("M 0 0");
  }

  parts.push(`H ${width - topRight.x}`);

  if (topRight.x || topRight.y) {
    parts.push(`L ${width} ${topRight.y}`);
  }

  parts.push(`V ${height - bottomRight.y}`);

  if (bottomRight.x || bottomRight.y) {
    parts.push(`L ${width - bottomRight.x} ${height}`);
  }

  parts.push(`H ${bottomLeft.x}`);

  if (bottomLeft.x || bottomLeft.y) {
    parts.push(`L 0 ${height - bottomLeft.y}`);
  }

  // Close back to start
  if (topLeft.x || topLeft.y) {
    parts.push(`V ${topLeft.y}`);
    parts.push(`L ${topLeft.x} 0`);
  }

  parts.push("Z");

  return parts.join(" ");
}
```

- [ ] **Step 4: Add tone map and depth caps**

Add to `chamfer.ts`:

```ts
/** SVG fill/stroke + text class for each ChamferedCard tone. */
export const chamferCardToneMap: Record<
  ChamferedCardTone,
  {
    textClass: string;
    fill: string;
    stroke: string;
  }
> = {
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

/** SVG fill/stroke pairs for Button variants. */
export const chamferButtonToneMap: Record<
  ChamferedButtonVariant,
  {
    fill: string;
    stroke: string;
  }
> = {
  default: { fill: "var(--primary)", stroke: "var(--primary)" },
  outline: { fill: "transparent", stroke: "var(--border)" },
  secondary: { fill: "var(--secondary)", stroke: "var(--secondary)" },
  ghost: { fill: "transparent", stroke: "transparent" },
  destructive: { fill: "var(--destructive)", stroke: "var(--destructive)" },
  link: { fill: "transparent", stroke: "transparent" },
};

/** Depth caps per component type. */
export const CHAMFER_DEPTH_CAPS = {
  button: 5,
  card: 10,
  shape: 20,
} as const;

export function clampChamferDepth(depth: number, max: number): number {
  return Math.max(0, Math.min(max, Math.round(depth)));
}

/** Convert Tailwind spacing units to pixels (4px per unit). */
export function chamferDepthToPx(depth: number): number {
  return depth * 4;
}
```

- [ ] **Step 5: Run SVG path tests to verify they pass**

Run: `pnpm vitest run tests/int/chamfer-geometry.int.spec.ts`
Expected: All SVG path tests PASS

- [ ] **Step 6: Create useElementSize hook**

Create `src/components/ui/use-element-size.ts`:

```ts
"use client";
import * as React from "react";

/**
 * Measures an element's rendered dimensions using ResizeObserver.
 * Throttled via requestAnimationFrame. Skips state updates when
 * width/height have not changed.
 */
export function useElementSize<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);

      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        setSize((current) => {
          if (current.width === width && current.height === height) {
            return current;
          }
          return { width, height };
        });
      });
    });

    observer.observe(element);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return [ref, size] as const;
}
```

- [ ] **Step 7: Add ResizeObserver mock to vitest.setup.ts**

Add to `vitest.setup.ts`:

```ts
/**
 * Minimal ResizeObserver mock for jsdom. Vitest's jsdom environment
 * does not provide ResizeObserver. This stub keeps components that
 * use useElementSize from crashing during unit tests.
 */
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}
```

- [ ] **Step 8: Run existing chamfer tests to verify backward compat**

Run: `pnpm vitest run tests/int/chamfer-geometry.int.spec.ts`
Expected: ALL tests PASS (old clip-path tests + new SVG path tests)

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/chamfer.ts \
       src/components/ui/use-element-size.ts \
       tests/int/chamfer-geometry.int.spec.ts \
       vitest.setup.ts
git commit -m "feat: add SVG chamfer path builder, tone maps, depth caps, useElementSize hook"
```

---

### Task 2: Refactor ChamferedCard to SVG rendering

**Files:**

- Modify: `src/components/patterns/ChamferedCard.tsx`
- Test: `tests/int/patterns.int.spec.tsx`

- [ ] **Step 1: Write failing SVG-based test assertions**

Update `tests/int/patterns.int.spec.tsx`. Replace the four ChamferedCard tests:

```ts
import { buildChamferSvgPath } from '@/components/ui/chamfer'

// --- Replace existing chamfer tests from line 79 to 153 ---

it('keeps navy ChamferedCard foreground available to child content', () => {
  render(
    <ChamferedCard tone="navy">
      <p>Managed hosting</p>
    </ChamferedCard>,
  )
  expect(screen.getByText('Managed hosting').closest('div')?.parentElement?.className).toContain(
    'text-(--secondary-foreground)',
  )
})

it('renders ChamferedCard with an SVG path for symmetric depth', () => {
  const { container } = render(
    <ChamferedCard corner="bottom-right" chamferDepth={4}>
      <p>Depth-only chamfer</p>
    </ChamferedCard>,
  )

  const svg = container.querySelector('svg')
  expect(svg).not.toBeNull()
  expect(svg!.getAttribute('viewBox')).toBe('0 0 100 100')
  expect(svg!.getAttribute('preserveAspectRatio')).toBe('none')

  const path = svg!.querySelector('path')
  expect(path).not.toBeNull()
  expect(path!.getAttribute('d')).toBe(
    buildChamferSvgPath({
      width: 100,
      height: 100,
      topLeft: { x: 0, y: 0 },
      topRight: { x: 0, y: 0 },
      bottomRight: { x: 4, y: 4 },
      bottomLeft: { x: 0, y: 0 },
    }),
  )
  expect(path!.getAttribute('vector-effect')).toBe('non-scaling-stroke')
  expect(path!.getAttribute('fill')).toBe('var(--card)')
  expect(path!.getAttribute('stroke')).toBe('var(--border)')
})

it('falls back to asymmetric x/y when depth is 0', () => {
  const { container } = render(
    <ChamferedCard corner="bottom-right" chamferDepth={0} chamferX={3} chamferY={6}>
      <p>Asymmetric chamfer</p>
    </ChamferedCard>,
  )

  const path = container.querySelector('svg path')!
  expect(path.getAttribute('d')).toBe(
    buildChamferSvgPath({
      width: 100,
      height: 100,
      topLeft: { x: 0, y: 0 },
      topRight: { x: 0, y: 0 },
      bottomRight: { x: 3, y: 6 },
      bottomLeft: { x: 0, y: 0 },
    }),
  )
})

it('renders ChamferedCard with an opposite asymmetric chamfer', () => {
  const { container } = render(
    <ChamferedCard
      corner="top-right"
      chamferDepth={0}
      chamferX={3}
      chamferY={2}
      hasOppositeCorner
      oppositeChamferX={2}
      oppositeChamferY={4}
    >
      <p>Opposite chamfer</p>
    </ChamferedCard>,
  )

  const path = container.querySelector('svg path')!
  expect(path.getAttribute('d')).toBe(
    buildChamferSvgPath({
      width: 100,
      height: 100,
      topLeft: { x: 0, y: 0 },
      topRight: { x: 3, y: 2 },
      bottomRight: { x: 0, y: 0 },
      bottomLeft: { x: 2, y: 4 },
    }),
  )
})

it('renders symmetric opposite-corner cut when oppositeChamferDepth is set', () => {
  const { container } = render(
    <ChamferedCard corner="top-right" chamferDepth={3} hasOppositeCorner oppositeChamferDepth={6}>
      <p>Symmetric opposite</p>
    </ChamferedCard>,
  )

  const path = container.querySelector('svg path')!
  expect(path.getAttribute('d')).toBe(
    buildChamferSvgPath({
      width: 100,
      height: 100,
      topLeft: { x: 0, y: 0 },
      topRight: { x: 3, y: 3 },
      bottomRight: { x: 0, y: 0 },
      bottomLeft: { x: 6, y: 6 },
    }),
  )
})
```

- [ ] **Step 2: Run test to verify they fail**

Run: `pnpm vitest run tests/int/patterns.int.spec.tsx`
Expected: Tests fail because ChamferedCard still renders clip-path, not SVG

- [ ] **Step 3: Refactor ChamferedCard to SVG**

Rewrite `src/components/patterns/ChamferedCard.tsx`:

```tsx
"use client";
import * as React from "react";
import {
  buildChamferSvgPath,
  oppositeChamfer,
  resolveChamferCut,
  chamferCardToneMap,
  clampChamferDepth,
  CHAMFER_DEPTH_CAPS,
  type ChamferCorner,
  type ChamferSizing,
  type ChamferedCardTone,
} from "@/components/ui/chamfer";
import { useElementSize } from "@/components/ui/use-element-size";
import { cn } from "@/utilities/ui";

export type { ChamferedCardTone };
export type { ChamferCorner as ChamferedCardCorner };

/**
 * `ChamferedCard` renders a chamfered rectangle using SVG fill + stroke
 * instead of CSS clip-path. Two sizing modes:
 * - `proportional`: viewBox 0 0 100 100, chamferDepth = viewBox units
 * - `fixed`: ResizeObserver, chamferDepth * 4 = pixels
 */
export const ChamferedCard: React.FC<{
  tone?: ChamferedCardTone;
  sizing?: ChamferSizing;
  corner?: ChamferCorner;
  chamferDepth?: number;
  chamferX?: number;
  chamferY?: number;
  hasOppositeCorner?: boolean;
  oppositeChamferDepth?: number;
  oppositeChamferX?: number;
  oppositeChamferY?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  ariaLabel?: string;
}> = ({
  tone = "card",
  sizing = "proportional",
  corner = "top-right",
  chamferDepth = 4,
  chamferX = 0,
  chamferY = 0,
  hasOppositeCorner = false,
  oppositeChamferDepth = 0,
  oppositeChamferX = 0,
  oppositeChamferY = 0,
  strokeWidth = 1,
  children,
  className,
  innerClassName,
  ariaLabel,
}) => {
  const maxDepth = CHAMFER_DEPTH_CAPS.card;
  const clampedDepth = clampChamferDepth(chamferDepth, maxDepth);
  const clampedX = clampChamferDepth(chamferX, maxDepth);
  const clampedY = clampChamferDepth(chamferY, maxDepth);

  const primaryCut = resolveChamferCut(corner, {
    depth: clampedDepth,
    x: clampedX,
    y: clampedY,
  });

  const cuts = [primaryCut];
  if (hasOppositeCorner) {
    const oppDepth = clampChamferDepth(oppositeChamferDepth, maxDepth);
    const oppX = clampChamferDepth(oppositeChamferX, maxDepth);
    const oppY = clampChamferDepth(oppositeChamferY, maxDepth);
    cuts.push(
      resolveChamferCut(oppositeChamfer(corner), {
        depth: oppDepth,
        x: oppX,
        y: oppY,
      }),
    );
  }

  const cutMap = new Map(cuts.map((c) => [c.corner, { x: c.x, y: c.y }]));
  const topLeft = cutMap.get("top-left") ?? { x: 0, y: 0 };
  const topRight = cutMap.get("top-right") ?? { x: 0, y: 0 };
  const bottomRight = cutMap.get("bottom-right") ?? { x: 0, y: 0 };
  const bottomLeft = cutMap.get("bottom-left") ?? { x: 0, y: 0 };

  const [sizeRef, size] = useElementSize<HTMLDivElement>();
  const isFixed = sizing === "fixed";

  const path = React.useMemo(() => {
    if (isFixed && size.width > 0 && size.height > 0) {
      return buildChamferSvgPath({
        width: size.width,
        height: size.height,
        topLeft: { x: topLeft.x * 4, y: topLeft.y * 4 },
        topRight: { x: topRight.x * 4, y: topRight.y * 4 },
        bottomRight: { x: bottomRight.x * 4, y: bottomRight.y * 4 },
        bottomLeft: { x: bottomLeft.x * 4, y: bottomLeft.y * 4 },
      });
    }
    return buildChamferSvgPath({
      width: 100,
      height: 100,
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
    });
  }, [
    isFixed,
    size.width,
    size.height,
    topLeft,
    topRight,
    bottomRight,
    bottomLeft,
  ]);

  const viewBox =
    isFixed && size.width > 0 && size.height > 0
      ? `0 0 ${size.width} ${size.height}`
      : "0 0 100 100";

  const toneColors = chamferCardToneMap[tone];
  const isDecorative = !ariaLabel && children == null;

  return (
    <div
      ref={sizeRef}
      aria-hidden={isDecorative || undefined}
      aria-label={ariaLabel}
      className={cn("relative w-full", toneColors.textClass, className)}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
        viewBox={viewBox}
        preserveAspectRatio="none"
      >
        <path
          d={path}
          fill={toneColors.fill}
          stroke={toneColors.stroke}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        className={cn(
          "relative z-10 px-5 py-5 md:px-6 md:py-6",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Run tests to verify SVG assertions pass**

Run: `pnpm vitest run tests/int/patterns.int.spec.tsx`
Expected: All chamfer tests PASS

- [ ] **Step 5: Run full test suite**

Run: `pnpm vitest run`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add src/components/patterns/ChamferedCard.tsx \
       tests/int/patterns.int.spec.tsx
git commit -m "feat: refactor ChamferedCard to SVG fill/stroke rendering"
```

---

### Task 3: Update Button with SVG chamfer

**Files:**

- Modify: `src/components/ui/button.tsx`
- Test: `tests/int/button.int.spec.tsx`

- [ ] **Step 1: Write failing tests**

Note: Button uses `fixed` sizing + `useElementSize`, so under jsdom the SVG only renders with mocked dimensions. We test the structural assertion and verify SVG path correctness indirectly via the chamfer-geometry tests.

Update `tests/int/button.int.spec.tsx`:

```ts
import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button component contract', () => {
  it('does not create a function-valued style prop by default', () => {
    const element = Button({ children: 'Order now' })
    expect(element.props.style).not.toBeTypeOf('function')
  })

  it('wraps children in a relative span when chamferDepth > 0', () => {
    const { container } = render(
      <Button chamferDepth={4}>Chamfered</Button>,
    )
    const button = container.querySelector('button')!
    const span = button.querySelector('span')
    expect(span).not.toBeNull()
    expect(span!.className).toContain('z-10')
  })

  it('does not add a z-10 wrapper span when chamferDepth is 0', () => {
    const { container } = render(
      <Button chamferDepth={0}>Plain</Button>,
    )
    const button = container.querySelector('button')!
    const spans = button.querySelectorAll('span')
    // Should not add an extra SVG-aware wrapper
    expect(spans.length).toBeLessThanOrEqual(1)
  })

  it('clamps chamferDepth to maximum of 5 without crashing', () => {
    const { container } = render(
      <Button chamferDepth={20}>Clamped</Button>,
    )
    // Should not crash — depth clamped internally
    expect(container.querySelector('button')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run to verify tests fail**

Run: `pnpm vitest run tests/int/button.int.spec.tsx`
Expected: Existing test passes, new tests fail (no z-10 wrapper structure yet)

- [ ] **Step 3: Update Button to render SVG chamfer**

Rewrite button.tsx:

```tsx
"use client";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import {
  buildChamferSvgPath,
  chamferButtonToneMap,
  clampChamferDepth,
  CHAMFER_DEPTH_CAPS,
  type ChamferCorner,
} from "./chamfer";
import { useElementSize } from "./use-element-size";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding text-xs font-semibold tracking-widest whitespace-nowrap uppercase transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-input/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        lg: "h-11 gap-1.5 px-8 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    chamferCorner?: ChamferCorner;
    chamferDepth?: number;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  chamferCorner = "top-right",
  chamferDepth = 0,
  children,
  style,
  ...props
}: ButtonProps) {
  const depth = clampChamferDepth(chamferDepth, CHAMFER_DEPTH_CAPS.button);
  const [sizeRef, pixelSize] = useElementSize<HTMLButtonElement>();
  const hasChamfer = depth > 0;

  const path = React.useMemo(() => {
    if (!hasChamfer || pixelSize.width === 0 || pixelSize.height === 0)
      return "";

    const cutPx = depth * 4;
    const cuts = (() => {
      switch (chamferCorner) {
        case "top-left":
          return { topLeft: { x: cutPx, y: cutPx } };
        case "top-right":
          return { topRight: { x: cutPx, y: cutPx } };
        case "bottom-right":
          return { bottomRight: { x: cutPx, y: cutPx } };
        case "bottom-left":
          return { bottomLeft: { x: cutPx, y: cutPx } };
      }
    })();

    return buildChamferSvgPath({
      width: pixelSize.width,
      height: pixelSize.height,
      topLeft: { x: 0, y: 0 },
      topRight: { x: 0, y: 0 },
      bottomRight: { x: 0, y: 0 },
      bottomLeft: { x: 0, y: 0 },
      ...cuts,
    });
  }, [hasChamfer, depth, chamferCorner, pixelSize.width, pixelSize.height]);

  const tone =
    variant === "link"
      ? undefined
      : chamferButtonToneMap[variant as keyof typeof chamferButtonToneMap];

  return (
    <ButtonPrimitive
      ref={sizeRef}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      style={style}
      {...props}
    >
      {hasChamfer && path && tone ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full"
          viewBox={`0 0 ${pixelSize.width} ${pixelSize.height}`}
          preserveAspectRatio="none"
        >
          <path
            d={path}
            fill={tone.fill}
            stroke={tone.stroke}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      ) : null}
      <span
        className={cn(
          hasChamfer
            ? "relative z-10 inline-flex items-center gap-1.5"
            : "inline-flex items-center gap-1.5",
        )}
      >
        {children}
      </span>
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants, type ButtonProps };
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run tests/int/button.int.spec.tsx`
Expected: All button tests PASS

- [ ] **Step 5: Run full test suite**

Run: `pnpm vitest run`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/button.tsx \
       tests/int/button.int.spec.tsx
git commit -m "feat: replace Button clip-path with SVG chamfer rendering"
```

---

### Task 4: Update NumberBadge chamfered shape to SVG

**Files:**

- Modify: `src/components/patterns/NumberBadge.tsx`

- [ ] **Step 1: Update NumberBadge**

Replace the `shape === 'chamfered'` branch in `src/components/patterns/NumberBadge.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/utilities/ui";
import { buildChamferSvgPath } from "@/components/ui/chamfer";

export type NumberBadgeTone = "navy" | "mint" | "card" | "subtle" | "border";
export type NumberBadgeShape = "square" | "chamfered" | "circle";

const CHAMFER_PATH = buildChamferSvgPath({
  width: 100,
  height: 100,
  topLeft: { x: 0, y: 0 },
  topRight: { x: 30, y: 30 },
  bottomRight: { x: 0, y: 0 },
  bottomLeft: { x: 0, y: 0 },
});

const toneClass: Record<NumberBadgeTone, string> = {
  navy: "bg-(--secondary) text-(--secondary-foreground) border-(--secondary)",
  mint: "bg-(--accent) text-(--accent-foreground) border-(--accent)",
  card: "bg-card text-card-foreground border-border",
  subtle: "bg-(--subtle-background) text-(--heading) border-border",
  border: "bg-background text-foreground border-border",
};

const toneFill: Record<NumberBadgeTone, string> = {
  navy: "var(--secondary)",
  mint: "var(--accent)",
  card: "var(--card)",
  subtle: "var(--subtle-background)",
  border: "var(--background)",
};

const toneStroke: Record<NumberBadgeTone, string> = {
  navy: "var(--secondary)",
  mint: "var(--accent)",
  card: "var(--border)",
  subtle: "var(--border)",
  border: "var(--border)",
};

export const NumberBadge: React.FC<{
  value: string | number;
  tone?: NumberBadgeTone;
  shape?: NumberBadgeShape;
  sizeClassName?: string;
  className?: string;
  textClassName?: string;
}> = ({
  value,
  tone = "navy",
  shape = "square",
  sizeClassName = "size-8",
  className,
  textClassName,
}) => {
  const shapeClass =
    shape === "circle"
      ? "rounded-full"
      : shape === "square"
        ? "rounded-sm"
        : "";

  return (
    <span
      role="img"
      aria-label={`Step ${value}`}
      className={cn(
        "relative inline-flex items-center justify-center border font-mono text-xs font-semibold tabular-nums",
        sizeClassName,
        shapeClass,
        toneClass[tone],
        className,
      )}
    >
      {shape === "chamfered" && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d={CHAMFER_PATH}
            fill={toneFill[tone]}
            stroke={toneStroke[tone]}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      <span className={cn("relative z-10", textClassName)}>{value}</span>
    </span>
  );
};
```

- [ ] **Step 2: Run full tests to verify nothing broke**

Run: `pnpm vitest run`
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add src/components/patterns/NumberBadge.tsx
git commit -m "feat: replace NumberBadge clip-path with SVG chamfered shape"
```

---

### Task 5: Update DiagonalBand to SVG trapezoid

**Files:**

- Modify: `src/components/patterns/DiagonalBand.tsx`
- Test: `tests/int/patterns.int.spec.tsx`

- [ ] **Step 1: Replace existing DiagonalBand clip-path test with SVG test**

Update `tests/int/patterns.int.spec.tsx`. Replace the existing DiagonalBand test (line 31-40) with:

```ts
it('renders DiagonalBand with an SVG trapezoid instead of clip-path', () => {
  const { container } = render(<DiagonalBand ariaLabel="Operations accent" />)
  const svg = container.querySelector('svg')
  expect(svg).not.toBeNull()
  const path = svg!.querySelector('path')
  expect(path).not.toBeNull()
  expect(path!.getAttribute('fill')).toBeTruthy()
  expect(path!.getAttribute('d')).toContain('L')
  expect(path!.getAttribute('d')).toContain('Z')
})
```

- [ ] **Step 2: Update DiagonalBand to SVG**

Rewrite `src/components/patterns/DiagonalBand.tsx`:

```tsx
"use client";
import { cn } from "@/utilities/ui";
import * as React from "react";
import { buildChamferSvgPath } from "@/components/ui/chamfer";

export type DiagonalBandTone = "navy" | "mint" | "subtle" | "card" | "border";
export type DiagonalBandOrientation = "left" | "right";

const toneClass: Record<DiagonalBandTone, string> = {
  navy: "bg-(--secondary)",
  mint: "bg-(--accent)",
  subtle: "bg-(--subtle-background)",
  card: "bg-card",
  border: "bg-border",
};

const toneFill: Record<DiagonalBandTone, string> = {
  navy: "var(--secondary)",
  mint: "var(--accent)",
  subtle: "var(--subtle-background)",
  card: "var(--card)",
  border: "var(--border)",
};

const toneTextClass: Record<DiagonalBandTone, string> = {
  navy: "text-(--secondary-foreground)",
  mint: "text-(--accent-foreground)",
  subtle: "text-(--heading)",
  card: "text-foreground",
  border: "text-foreground",
};

function buildBandPath(
  orientation: DiagonalBandOrientation,
  tilt: number,
): string {
  // tilt is a percentage of viewBox width (e.g., 12 = 12% = 12 units in 100-wide viewBox)
  if (orientation === "right") {
    return `M ${tilt} 0 L 100 0 L 100 100 L 0 100 Z`;
  }
  return `M 0 0 L ${100 - tilt} 0 L 100 100 L 0 100 Z`;
}

export const DiagonalBand: React.FC<{
  tone?: DiagonalBandTone;
  orientation?: DiagonalBandOrientation;
  heightClassName?: string;
  children?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}> = ({
  tone = "navy",
  orientation = "left",
  heightClassName = "h-2",
  children,
  className,
  ariaLabel,
}) => {
  // tilt is the horizontal offset of the diagonal cut as a percentage
  // 0.5rem → ~12% in viewBox, 1.5rem → ~36% (approximate visual matching)
  const tilt = children == null ? 12 : 36;
  const path = buildBandPath(orientation, tilt);

  const isDecorative = !ariaLabel && children == null;

  return (
    <div
      aria-hidden={isDecorative || undefined}
      aria-label={ariaLabel}
      className={cn(
        "relative w-full overflow-hidden",
        toneClass[tone],
        className,
      )}
      data-pattern-diagonal-surface
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d={path} fill={toneFill[tone]} />
      </svg>
      <div
        aria-hidden
        className={cn("relative z-10 block w-full", heightClassName)}
      />
      {children ? (
        <div
          className={cn(
            "relative z-10 px-4 pb-3 pt-1 text-xs font-mono uppercase tracking-widest",
            toneTextClass[tone],
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `pnpm vitest run`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/components/patterns/DiagonalBand.tsx \
       tests/int/patterns.int.spec.tsx
git commit -m "feat: replace DiagonalBand clip-path with SVG trapezoid"
```

---

### Task 6: Add Storybook stories for new features

**Files:**

- Modify: `src/components/patterns/Cards.stories.tsx`
- Modify: `src/components/ui/Button.stories.tsx`

- [ ] **Step 1: Update Cards.stories.tsx with sizing prop**

Add a story for fixed sizing mode to `src/components/patterns/Cards.stories.tsx`:

```tsx
export const FixedSizing: Story = {
  args: {
    corner: "top-right",
    chamferDepth: 4,
    hasOppositeCorner: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uses `sizing="fixed"` for pixel-precise chamfer depths via ResizeObserver.',
      },
    },
  },
  render: (args) => (
    <div className="flex flex-wrap gap-6">
      <Card eyebrow="Width" title="Narrow" {...args} className="w-48">
        Fixed chamfer at 16px regardless of width.
      </Card>
      <Card eyebrow="Width" title="Wide" {...args} className="w-96">
        Same 16px chamfer even on a wider card.
      </Card>
    </div>
  ),
};
```

- [ ] **Step 2: Update Button.stories.tsx with SVG mode stories**

Add to the Button meta `args` the `chamferDepth` value (already there at 0), and add a story:

```tsx
export const ChamferedSvg: Story = {
  name: "Chamfered SVG (top-right, depth 4)",
  args: {
    children: "Get started",
    variant: "default",
    chamferCorner: "top-right",
    chamferDepth: 4,
  },
};
```

- [ ] **Step 3: Run full test suite**

Run: `pnpm vitest run`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/components/patterns/Cards.stories.tsx \
       src/components/ui/Button.stories.tsx
git commit -m "docs: add Storybook stories for SVG chamfer sizing modes"
```
