# UI Chamfer Geometry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move chamfer geometry into a shared UI-system utility and support asymmetric edge-position controls for cards while preserving Button's current symmetric `chamferDepth` shorthand.

**Architecture:** Create `src/components/ui/chamfer.ts` as the single geometry source. `Button` and `ChamferedCard` import the same types/helpers. `ChamferedCard` exposes asymmetric position props and a boolean opposite-corner toggle; stories expose those controls instead of manually selecting a secondary corner.

**Tech Stack:** React, TypeScript, Tailwind v4, Storybook, Vitest.

---

### Task 1: Shared Chamfer Geometry Utility

**Files:**

- Create: `src/components/ui/chamfer.ts`
- Create: `tests/int/chamfer-geometry.int.spec.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/int/chamfer-geometry.int.spec.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  buildChamferClipPath,
  oppositeChamfer,
  symmetricChamfer,
} from "@/components/ui/chamfer";

describe("UI chamfer geometry", () => {
  it("converts symmetric depth into equal edge positions", () => {
    expect(symmetricChamfer("bottom-right", 30)).toEqual({
      corner: "bottom-right",
      x: 70,
      y: 70,
    });
  });

  it("builds an asymmetric bottom-right chamfer clip path", () => {
    expect(
      buildChamferClipPath([{ corner: "bottom-right", x: 90, y: 50 }]),
    ).toBe("polygon(0% 0%, 100% 0%, 100% 50%, 90% 100%, 0% 100%)");
  });

  it("builds two opposite asymmetric chamfers", () => {
    expect(
      buildChamferClipPath([
        { corner: "top-right", x: 88, y: 20 },
        { corner: "bottom-left", x: 16, y: 82 },
      ]),
    ).toBe("polygon(0% 0%, 88% 0%, 100% 20%, 100% 100%, 16% 100%, 0% 82%)");
  });

  it("returns the opposite corner", () => {
    expect(oppositeChamfer("top-right")).toBe("bottom-left");
    expect(oppositeChamfer("bottom-right")).toBe("top-left");
  });
});
```

- [ ] **Step 2: Run red test**

Run: `pnpm vitest run --config ./vitest.config.mts tests/int/chamfer-geometry.int.spec.ts`

Expected: fails because `src/components/ui/chamfer.ts` does not exist yet.

- [ ] **Step 3: Implement utility**

Create `src/components/ui/chamfer.ts`:

```ts
export type ChamferCorner =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export type ChamferCut = {
  corner: ChamferCorner;
  x: number;
  y: number;
};

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function formatPercent(value: number): string {
  return `${clampPercent(value)}%`;
}

export function oppositeChamfer(corner: ChamferCorner): ChamferCorner {
  switch (corner) {
    case "top-right":
      return "bottom-left";
    case "top-left":
      return "bottom-right";
    case "bottom-right":
      return "top-left";
    case "bottom-left":
      return "top-right";
  }
}

export function symmetricChamfer(
  corner: ChamferCorner,
  depth: number,
): ChamferCut {
  const position = 100 - Math.max(0, Math.min(30, depth));
  return { corner, x: position, y: position };
}

export function buildChamferClipPath(cuts: ChamferCut[]): string | undefined {
  if (cuts.length === 0) return undefined;

  const cutMap = new Map<ChamferCorner, ChamferCut>();
  for (const cut of cuts) {
    cutMap.set(cut.corner, {
      corner: cut.corner,
      x: clampPercent(cut.x),
      y: clampPercent(cut.y),
    });
  }

  const topLeft = cutMap.get("top-left");
  const topRight = cutMap.get("top-right");
  const bottomRight = cutMap.get("bottom-right");
  const bottomLeft = cutMap.get("bottom-left");

  const points = [
    topLeft ? `0% ${formatPercent(topLeft.y)}` : "0% 0%",
    topLeft ? `${formatPercent(topLeft.x)} 0%` : undefined,
    topRight ? `${formatPercent(topRight.x)} 0%` : "100% 0%",
    topRight ? `100% ${formatPercent(topRight.y)}` : undefined,
    bottomRight ? `100% ${formatPercent(bottomRight.y)}` : "100% 100%",
    bottomRight ? `${formatPercent(bottomRight.x)} 100%` : undefined,
    bottomLeft ? `${formatPercent(bottomLeft.x)} 100%` : "0% 100%",
    bottomLeft ? `0% ${formatPercent(bottomLeft.y)}` : undefined,
  ].filter((point): point is string => Boolean(point));

  return `polygon(${points.join(", ")})`;
}
```

- [ ] **Step 4: Run green test**

Run: `pnpm vitest run --config ./vitest.config.mts tests/int/chamfer-geometry.int.spec.ts`

Expected: PASS.

### Task 2: Refactor Button to Shared Geometry

**Files:**

- Modify: `src/components/ui/button.tsx`
- Modify: `tests/int/button.int.spec.tsx`

- [ ] **Step 1: Add Button symmetric geometry test**

Append to `tests/int/button.int.spec.tsx`:

```tsx
it("uses symmetric chamfer geometry for chamferDepth shorthand", () => {
  const element = Button({
    children: "Order now",
    chamferCorner: "bottom-right",
    chamferDepth: 30,
  });

  expect(element.props.style).toEqual({
    clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 70% 100%, 0% 100%)",
  });
});
```

- [ ] **Step 2: Run red/confirmation test**

Run: `pnpm vitest run --config ./vitest.config.mts tests/int/button.int.spec.tsx`

Expected: either fails with old `calc(100% - 30%)` string or passes if equivalent implementation already changed.

- [ ] **Step 3: Update Button imports and implementation**

In `src/components/ui/button.tsx`, import:

```ts
import {
  buildChamferClipPath,
  symmetricChamfer,
  type ChamferCorner,
} from "./chamfer";
```

Replace `ButtonChamferCorner` type with:

```ts
export type ButtonChamferCorner = ChamferCorner;
```

Remove local `buildChamferClipPath` helper and use:

```ts
const clipPath =
  chamferDepth > 0
    ? buildChamferClipPath([symmetricChamfer(chamferCorner, chamferDepth)])
    : undefined;
```

- [ ] **Step 4: Verify Button tests**

Run: `pnpm vitest run --config ./vitest.config.mts tests/int/button.int.spec.tsx`

Expected: PASS.

### Task 3: Refactor ChamferedCard to Asymmetric UI Geometry

**Files:**

- Modify: `src/components/pamphlet/ChamferedCard.tsx`
- Modify: `tests/int/pamphlet-components.int.spec.tsx`

- [ ] **Step 1: Update ChamferedCard tests to asymmetric positions**

Replace the two dual-chamfer tests with:

```tsx
it("renders ChamferedCard with asymmetric bottom-right chamfer positions", () => {
  const { container } = render(
    <ChamferedCard corner="bottom-right" chamferX={90} chamferY={50}>
      <p>Asymmetric chamfer</p>
    </ChamferedCard>,
  );

  const card = container.firstElementChild as HTMLElement | null;

  expect(card?.style.clipPath).toBe(
    "polygon(0% 0%, 100% 0%, 100% 50%, 90% 100%, 0% 100%)",
  );
});

it("renders ChamferedCard with an automatically opposite secondary chamfer", () => {
  const { container } = render(
    <ChamferedCard
      corner="top-right"
      chamferX={88}
      chamferY={20}
      hasOppositeCorner
      oppositeChamferX={16}
      oppositeChamferY={82}
    >
      <p>Opposite chamfer</p>
    </ChamferedCard>,
  );

  const card = container.firstElementChild as HTMLElement | null;

  expect(card?.style.clipPath).toBe(
    "polygon(0% 0%, 88% 0%, 100% 20%, 100% 100%, 16% 100%, 0% 82%)",
  );
});
```

- [ ] **Step 2: Run red test**

Run: `pnpm vitest run --config ./vitest.config.mts tests/int/pamphlet-components.int.spec.tsx -t "ChamferedCard"`

Expected: fails because new props do not exist yet.

- [ ] **Step 3: Update ChamferedCard props and clip-path construction**

In `src/components/pamphlet/ChamferedCard.tsx`, import shared types/helpers:

```ts
import {
  buildChamferClipPath,
  oppositeChamfer,
  symmetricChamfer,
  type ChamferCorner,
  type ChamferCut,
} from "@/components/ui/chamfer";
```

Export card corner alias:

```ts
export type ChamferedCardCorner = ChamferCorner;
```

Remove local geometry helpers. Add props:

```tsx
  chamferX?: number
  chamferY?: number
  hasOppositeCorner?: boolean
  oppositeChamferX?: number
  oppositeChamferY?: number
```

Keep `depth` as backward-compatible shorthand. Build cuts:

```tsx
const primaryCut: ChamferCut =
  chamferX == null || chamferY == null
    ? symmetricChamfer(corner, depth)
    : { corner, x: chamferX, y: chamferY };
const cuts = [primaryCut];

if (hasOppositeCorner) {
  const oppositeCorner = oppositeChamfer(corner);
  cuts.push(
    oppositeChamferX == null || oppositeChamferY == null
      ? symmetricChamfer(oppositeCorner, secondaryDepth)
      : { corner: oppositeCorner, x: oppositeChamferX, y: oppositeChamferY },
  );
}

const clipPath = buildChamferClipPath(cuts);
```

- [ ] **Step 4: Verify ChamferedCard tests**

Run: `pnpm vitest run --config ./vitest.config.mts tests/int/pamphlet-components.int.spec.tsx -t "ChamferedCard"`

Expected: PASS.

### Task 4: Update Stories and Feedback State

**Files:**

- Modify: `src/components/pamphlet/ChamferedCard.stories.tsx`
- Modify: `src/components/pamphlet/Patterns.tsx`
- Modify: `src/components/pamphlet/Patterns.stories.tsx`
- Modify: `docs/storybook_feedback.md`

- [ ] **Step 1: Replace secondary corner select with checkbox and position controls**

In stories, remove `secondaryCorner` controls. Expose:

```ts
hasOppositeCorner: { control: 'boolean' },
chamferX: { control: { type: 'range', min: 0, max: 100, step: 1 } },
chamferY: { control: { type: 'range', min: 0, max: 100, step: 1 } },
oppositeChamferX: { control: { type: 'range', min: 0, max: 100, step: 1 } },
oppositeChamferY: { control: { type: 'range', min: 0, max: 100, step: 1 } },
```

- [ ] **Step 2: Update PamphletCard pass-through props**

Replace secondary corner/depth props with:

```tsx
  chamferX?: number
  chamferY?: number
  hasOppositeCorner?: boolean
  oppositeChamferX?: number
  oppositeChamferY?: number
```

Pass them to `ChamferedCard`.

- [ ] **Step 3: Ensure feedback doc still has Cards removed**

Confirm `docs/storybook_feedback.md` no longer contains `### Cards`.

- [ ] **Step 4: Verify**

Run:

- LSP diagnostics on changed TS/TSX files
- `pnpm vitest run --config ./vitest.config.mts tests/int/chamfer-geometry.int.spec.ts tests/int/button.int.spec.ts tests/int/pamphlet-components.int.spec.tsx -t "ChamferedCard|Button|UI chamfer geometry"`
- `pnpm build-storybook`

Expected: changed tests pass, Storybook exits 0. Note unrelated full-suite failures separately.
