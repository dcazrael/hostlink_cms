# Chamfered Card Two Corners Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the chamfered card pattern so Storybook can control two opposite chamfered corners with independent depths.

**Architecture:** Reuse `ChamferedCard` as the single geometry implementation. Add optional `secondaryCorner` and `secondaryDepth` props, generate one `clip-path` polygon from one or two cuts, and pass the same controls through `PamphletCard` for the Cards pattern story.

**Tech Stack:** React, TypeScript, Tailwind v4, Storybook, Vitest + Testing Library.

---

### Task 1: Lock Two-Corner Geometry With Tests

**Files:**

- Modify: `tests/int/pamphlet-components.int.spec.tsx`

- [ ] **Step 1: Add failing tests for secondary chamfer support**

Append these tests inside the existing `describe('pamphlet component contracts', ...)` block:

```tsx
it("renders ChamferedCard with opposite top-right and bottom-left chamfers", () => {
  const { container } = render(
    <ChamferedCard
      corner="top-right"
      depth={12}
      secondaryCorner="bottom-left"
      secondaryDepth={20}
    >
      <p>Dual chamfer</p>
    </ChamferedCard>,
  );

  const card = container.firstElementChild as HTMLElement | null;

  expect(card?.style.clipPath).toBe(
    "polygon(0% 0%, calc(100% - 12%) 0%, 100% 12%, 100% 100%, 20% 100%, 0% calc(100% - 20%))",
  );
});

it("ignores non-opposite secondary chamfer corners", () => {
  const { container } = render(
    <ChamferedCard
      corner="top-right"
      depth={12}
      secondaryCorner="top-left"
      secondaryDepth={20}
    >
      <p>Single chamfer</p>
    </ChamferedCard>,
  );

  const card = container.firstElementChild as HTMLElement | null;

  expect(card?.style.clipPath).toBe(
    "polygon(0% 0%, calc(100% - 12%) 0%, 100% 12%, 100% 100%, 0% 100%)",
  );
});
```

- [ ] **Step 2: Run test and verify it fails**

Run: `pnpm vitest run --config ./vitest.config.mts tests/int/pamphlet-components.int.spec.tsx`

Expected: TypeScript/test failure because `secondaryCorner` and `secondaryDepth` do not exist on `ChamferedCard` yet.

### Task 2: Add Two-Corner Clip-Path Support

**Files:**

- Modify: `src/components/pamphlet/ChamferedCard.tsx`

- [ ] **Step 1: Add prop types and helpers**

Replace the current inline `clipPath` IIFE with helper functions that support one or two opposite cuts:

```tsx
function oppositeCorner(corner: ChamferedCardCorner): ChamferedCardCorner {
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

function clampDepth(depth: number): number {
  return Math.max(0, Math.min(30, depth));
}

function buildChamferClipPath(
  corner: ChamferedCardCorner,
  depth: number,
  secondaryCorner?: ChamferedCardCorner,
  secondaryDepth = 0,
): string | undefined {
  const primaryDepth = clampDepth(depth);
  const validSecondaryCorner =
    secondaryCorner === oppositeCorner(corner) ? secondaryCorner : undefined;
  const secondDepth = validSecondaryCorner ? clampDepth(secondaryDepth) : 0;

  if (primaryDepth === 0 && secondDepth === 0) return undefined;

  const cuts: Partial<Record<ChamferedCardCorner, string>> = {};
  if (primaryDepth > 0) cuts[corner] = `${primaryDepth}%`;
  if (validSecondaryCorner && secondDepth > 0)
    cuts[validSecondaryCorner] = `${secondDepth}%`;

  const topLeft = cuts["top-left"];
  const topRight = cuts["top-right"];
  const bottomRight = cuts["bottom-right"];
  const bottomLeft = cuts["bottom-left"];

  const points = [
    topLeft ? `0% ${topLeft}` : "0% 0%",
    topLeft ? `${topLeft} 0%` : undefined,
    topRight ? `calc(100% - ${topRight}) 0%` : "100% 0%",
    topRight ? `100% ${topRight}` : undefined,
    bottomRight ? `100% calc(100% - ${bottomRight})` : "100% 100%",
    bottomRight ? `calc(100% - ${bottomRight}) 100%` : undefined,
    bottomLeft ? `${bottomLeft} 100%` : "0% 100%",
    bottomLeft ? `0% calc(100% - ${bottomLeft})` : undefined,
  ].filter(Boolean);

  return `polygon(${points.join(", ")})`;
}
```

- [ ] **Step 2: Add the new props to `ChamferedCard`**

Add these props next to the existing `corner` / `depth` props:

```tsx
  /** Optional second chamfer. Only the corner opposite `corner` is applied. */
  secondaryCorner?: ChamferedCardCorner
  /** Independent depth for the optional second chamfer. Clamped to `[0, 30]`. */
  secondaryDepth?: number
```

Destructure them with defaults:

```tsx
  secondaryCorner,
  secondaryDepth = 0,
```

Use the helper:

```tsx
const clipPath = buildChamferClipPath(
  corner,
  depth,
  secondaryCorner,
  secondaryDepth,
);
```

- [ ] **Step 3: Run tests and verify they pass**

Run: `pnpm vitest run --config ./vitest.config.mts tests/int/pamphlet-components.int.spec.tsx`

Expected: PASS.

### Task 3: Expose Controls in Stories and Pattern Wrapper

**Files:**

- Modify: `src/components/pamphlet/ChamferedCard.stories.tsx`
- Modify: `src/components/pamphlet/Patterns.tsx`
- Modify: `src/components/pamphlet/Patterns.stories.tsx`

- [ ] **Step 1: Update `PamphletCard` prop pass-through**

In `src/components/pamphlet/Patterns.tsx`, extend `PamphletCard` props:

```tsx
  corner?: ChamferedCardCorner
  depth?: number
  secondaryCorner?: ChamferedCardCorner
  secondaryDepth?: number
```

Import `type ChamferedCardCorner` from `./ChamferedCard`, then pass props to `ChamferedCard`:

```tsx
}> = ({ eyebrow, title, children, tone = 'card', corner, depth, secondaryCorner, secondaryDepth, className }) => (
  <ChamferedCard
    tone={tone}
    corner={corner}
    depth={depth}
    secondaryCorner={secondaryCorner}
    secondaryDepth={secondaryDepth}
    className={className}
  >
```

- [ ] **Step 2: Update `ChamferedCard` story controls**

In `src/components/pamphlet/ChamferedCard.stories.tsx`, add defaults and controls:

```tsx
    secondaryCorner: 'bottom-left',
    secondaryDepth: 0,
```

```tsx
    secondaryCorner: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
    },
    secondaryDepth: { control: { type: 'range', min: 0, max: 30, step: 1 } },
```

Add a `TwoOppositeCorners` story:

```tsx
export const TwoOppositeCorners: Story = {
  name: "Two opposite corners",
  args: {
    corner: "top-right",
    depth: 12,
    secondaryCorner: "bottom-left",
    secondaryDepth: 20,
  },
  render: (args) => (
    <ChamferedCard {...args}>
      <p className="font-mono text-xs uppercase tracking-widest">
        Pattern card
      </p>
      <p className="mt-3 text-base font-semibold">
        Two independent chamfer depths
      </p>
      <p className="mt-1 text-sm">
        The opposite corner can be cut deeper than the primary corner.
      </p>
    </ChamferedCard>
  ),
};
```

- [ ] **Step 3: Update Cards pattern story controls**

In `src/components/pamphlet/Patterns.stories.tsx`, give the meta a lightweight `argTypes` block for Cards pattern controls if not already present, or create a controlled Cards story render using `args`:

```tsx
export const Cards: Story = {
  args: {
    corner: "top-right",
    depth: 12,
    secondaryCorner: "bottom-left",
    secondaryDepth: 20,
  },
  argTypes: {
    corner: {
      control: "select",
      options: ["top-right", "top-left", "bottom-right", "bottom-left"],
    },
    depth: { control: { type: "range", min: 0, max: 30, step: 1 } },
    secondaryCorner: {
      control: "select",
      options: ["top-right", "top-left", "bottom-right", "bottom-left"],
    },
    secondaryDepth: { control: { type: "range", min: 0, max: 30, step: 1 } },
  },
  render: (args) => (
    <div className="grid gap-6 md:grid-cols-3">
      <PamphletCard eyebrow="Hosting" title="Managed infrastructure" {...args}>
        Production hosting, CMS maintenance, and deploy support in one
        predictable workflow.
      </PamphletCard>
      <PamphletCard
        eyebrow="Support"
        title="Human handoff"
        tone="mint"
        {...args}
      >
        A direct support path for launch questions, content updates, and
        operational changes.
      </PamphletCard>
      <PamphletCard
        eyebrow="SLA"
        title="Priority response"
        tone="navy"
        {...args}
      >
        Critical issues get a clear escalation path and bilingual status
        updates.
      </PamphletCard>
    </div>
  ),
};
```

- [ ] **Step 4: Run diagnostics**

Run LSP diagnostics on:

- `src/components/pamphlet/ChamferedCard.tsx`
- `src/components/pamphlet/ChamferedCard.stories.tsx`
- `src/components/pamphlet/Patterns.tsx`
- `src/components/pamphlet/Patterns.stories.tsx`

Expected: no diagnostics.

### Task 4: Remove Completed Feedback Item and Verify Build

**Files:**

- Modify: `docs/storybook_feedback.md`

- [ ] **Step 1: Remove Cards item from feedback doc**

Delete this completed section from `docs/storybook_feedback.md`:

```markdown
### Cards

The cards I like, however I should also have the same controls like I have in the "primitives" There should be a way to have 2 champfered corners on oposite sites at different heights.
```

- [ ] **Step 2: Run focused tests**

Run: `pnpm vitest run --config ./vitest.config.mts tests/int/pamphlet-components.int.spec.tsx tests/int/button.int.spec.tsx`

Expected: PASS.

- [ ] **Step 3: Build Storybook**

Run: `pnpm build-storybook`

Expected: build completes successfully. Existing Vite warnings about Base UI `"use client"` directives are acceptable if the build exits 0.

- [ ] **Step 4: Report remaining feedback item**

The next feedback item after Cards should be `### Pricing Cards`.
