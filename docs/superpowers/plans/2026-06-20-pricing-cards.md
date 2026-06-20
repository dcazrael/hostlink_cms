# Pricing Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fake Storybook-only `PricingCard` with the real website pricing-card system so Storybook and the live site render the same Japanese pricing structure and CSS tokens.

**Architecture:** Extract the presentational pricing-card markup from `src/blocks/Pricing/Component.tsx` into a reusable shared component under `src/components/pricing/`. The website pricing block becomes a thin mapper from Payload block data to that shared component, and Storybook reuses the same component with real Japanese plan content.

**Tech Stack:** React 19, TypeScript, Tailwind v4, existing `.pricing-card*` CSS system in `src/app/(frontend)/globals.css`, Vitest, Storybook 10

---

## File Structure

- Create: `src/components/pricing/PricingPlanCard.tsx` — shared presentational card using the existing `.pricing-card*` CSS classes
- Create: `tests/int/pricing-plan-card.int.spec.tsx` — focused tests for the shared card
- Modify: `src/blocks/Pricing/Component.tsx` — replace inline markup with the shared component
- Modify: `src/components/patterns/PricingCards.stories.tsx` — replace fake demo cards with one real-Japanese story using the shared component
- Modify: `src/components/patterns/Patterns.tsx` — remove the old fake `PricingCard`

No new design-token work. Reuse the existing CSS only.

---

### Task 1: Create failing tests for the shared pricing card

**Files:**

- Create: `tests/int/pricing-plan-card.int.spec.tsx`

- [ ] **Step 1: Write the failing test file**

Create `tests/int/pricing-plan-card.int.spec.tsx`:

```tsx
import * as React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PricingPlanCard } from "@/components/pricing/PricingPlanCard";

afterEach(() => {
  cleanup();
});

const basePlan = {
  planName: "24時間電話対応プラン",
  planSub: "24時間電話対応をサポートします。",
  price: 3000,
  priceDisclaimer: "価格は税抜きです",
  stylePreset: "style4" as const,
  contents: [
    { id: "1", text: "24時間電話対応（近隣含む）" },
    { id: "2", text: "ゲストからの緊急電話対応" },
    { id: "3", text: "トラブル発生時の一次対応" },
  ],
  cta: {
    label: "見積り相談する",
    href: "/contact",
    variant: "primary" as const,
    icon: "arrowRight" as const,
    withIcon: true,
  },
};

describe("PricingPlanCard", () => {
  it("renders the real pricing-card shell classes from globals.css", () => {
    const { container } = render(<PricingPlanCard {...basePlan} />);

    const card = container.querySelector(".pricing-card");
    const surface = container.querySelector(".pricing-card__surface");

    expect(card).not.toBeNull();
    expect(surface).not.toBeNull();
  });

  it("renders title, subtitle, includes, and formatted monthly yen price", () => {
    render(<PricingPlanCard {...basePlan} />);

    expect(screen.getByText("24時間電話対応プラン")).toBeTruthy();
    expect(screen.getByText("24時間電話対応をサポートします。")).toBeTruthy();
    expect(screen.getByText("Includes")).toBeTruthy();
    expect(screen.getByText("￥3,000")).toBeTruthy();
    expect(screen.getByText("/月")).toBeTruthy();
  });

  it("renders the recommended chip inside the pricing-card header when recommended", () => {
    const { container } = render(<PricingPlanCard {...basePlan} recommended />);

    const chip = container.querySelector(".pricing-card__chip");
    expect(chip).not.toBeNull();
    expect(screen.getByText("Popular")).toBeTruthy();
  });

  it("applies the style preset class to the root card", () => {
    const { container } = render(
      <PricingPlanCard {...basePlan} stylePreset="style4" />,
    );

    const card = container.querySelector(".pricing-card");
    expect(card?.className).toContain("pricing-card--style4");
  });

  it("renders the CTA using the pricing-card CTA classes", () => {
    const { container } = render(<PricingPlanCard {...basePlan} />);

    const cta = container.querySelector(".pricing-card__cta");
    expect(cta).not.toBeNull();
    expect(screen.getByText("見積り相談する")).toBeTruthy();
  });

  it("renders tooltip content when an item has a tooltip", () => {
    render(
      <PricingPlanCard
        {...basePlan}
        contents={[
          {
            id: "1",
            text: "レビューサポート",
            tooltip: "返信テンプレートも含みます。",
          },
        ]}
      />,
    );

    expect(screen.getByText("レビューサポート")).toBeTruthy();
    expect(screen.getByText("返信テンプレートも含みます。")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
`npx vitest run tests/int/pricing-plan-card.int.spec.tsx`

Expected: FAIL with module resolution error for `@/components/pricing/PricingPlanCard`.

---

### Task 2: Extract the shared pricing card component

**Files:**

- Create: `src/components/pricing/PricingPlanCard.tsx`
- Test: `tests/int/pricing-plan-card.int.spec.tsx`

- [ ] **Step 1: Create the shared component**

Create `src/components/pricing/PricingPlanCard.tsx`:

```tsx
import * as React from "react";
import {
  ArrowRight,
  CircleCheckBig,
  CircleHelp,
  Mail,
  Phone,
  Star,
} from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { cn } from "@/utilities/ui";

export type PricingPlanCardStylePreset =
  | "style1"
  | "style2"
  | "style3"
  | "style4"
  | "style5";

export type PricingPlanCardContent = {
  id?: string | null;
  text: string;
  tooltip?: string | null;
};

export type PricingPlanCardCTA = {
  label?: string | null;
  href?: string | null;
  variant?: "primary" | "secondary" | "outline" | "ghost" | null;
  icon?: "arrowRight" | "mail" | "phone" | null;
  withIcon?: boolean | null;
};

export type PricingPlanCardProps = {
  planName: string;
  planSub?: string | null;
  recommended?: boolean | null;
  stylePreset?: PricingPlanCardStylePreset | null;
  price: number;
  priceDisclaimer?: string | null;
  contents?: PricingPlanCardContent[] | null;
  cta?: PricingPlanCardCTA | null;
};

const pricingStylePresetClassMap = {
  style1: "pricing-card--style1",
  style2: "pricing-card--style2",
  style3: "pricing-card--style3",
  style4: "pricing-card--style4",
  style5: "pricing-card--style5",
} as const;

const linkIconMap = {
  arrowRight: ArrowRight,
  mail: Mail,
  phone: Phone,
} as const;

const resolveCtaVariant = (value: string | undefined) => {
  if (value === "secondary" || value === "outline" || value === "ghost")
    return value;
  return "primary";
};

const resolveStylePresetClassName = (
  value: PricingPlanCardStylePreset | null | undefined,
): (typeof pricingStylePresetClassMap)[keyof typeof pricingStylePresetClassMap] => {
  if (value && value in pricingStylePresetClassMap) {
    return pricingStylePresetClassMap[value];
  }
  return pricingStylePresetClassMap.style1;
};

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(
    price,
  );

const PricingPlanCTAButton: React.FC<{
  link?: PricingPlanCardCTA | null;
  planName: string;
}> = ({ link, planName }) => {
  if (!link?.href || !link.label) return null;

  const variant = resolveCtaVariant(link.variant || undefined);
  const Icon =
    link.withIcon === false
      ? null
      : link.icon
        ? linkIconMap[link.icon as keyof typeof linkIconMap]
        : ArrowRight;

  return (
    <LocalizedLink
      className={cn(
        "pricing-card__cta",
        variant === "secondary" && "pricing-card__cta--secondary",
        variant === "outline" && "pricing-card__cta--outline",
        variant === "ghost" && "pricing-card__cta--ghost",
      )}
      href={link.href}
    >
      <span>{link.label}</span>
      {Icon ? <Icon className="pricing-card__cta-icon" /> : null}
    </LocalizedLink>
  );
};

/**
 * Shared pricing card presentation using the real website pricing-card CSS system.
 * This is the single source of truth for Storybook and the live Pricing block.
 *
 * @summary shared pricing card that reuses the real website pricing CSS
 */
export const PricingPlanCard: React.FC<PricingPlanCardProps> = ({
  planName,
  planSub,
  recommended,
  stylePreset,
  price,
  priceDisclaimer,
  contents,
  cta,
}) => {
  const formattedPrice = formatPrice(price);
  const stylePresetClassName = resolveStylePresetClassName(stylePreset);

  return (
    <div
      className={cn(
        "pricing-card",
        stylePresetClassName,
        recommended && "pricing-card--featured",
      )}
    >
      <div className="pricing-card__surface">
        <div className="pricing-card__header">
          <div className="pricing-card__heading">
            <h3 className="pricing-card__title whitespace-pre-line">
              {planName}
            </h3>
            {planSub ? (
              <p className="pricing-card__plan-sub whitespace-pre-line">
                {planSub}
              </p>
            ) : null}
          </div>
          {recommended ? (
            <span className="pricing-card__chip">
              <div className="pricing-card__chip-icon-wrap">
                <Star className="pricing-card__chip-icon" />
              </div>
              <span>Popular</span>
            </span>
          ) : null}
        </div>

        <div className="pricing-card__divider" />

        <p className="pricing-card__includes-label">Includes</p>

        <ul className="pricing-card__list">
          {(contents || []).map((item, itemIndex) => {
            const hasTooltip = Boolean(
              item.tooltip && item.tooltip.trim().length > 0,
            );
            return (
              <li className="pricing-card__item" key={item.id || itemIndex}>
                <span className="pricing-card__item-main">
                  <CircleCheckBig className="pricing-card__check" />
                  <span>{item.text}</span>
                </span>

                {hasTooltip ? (
                  <span className="pricing-card__tooltip-wrap">
                    <button
                      aria-label={`More information about ${item.text}`}
                      className="pricing-card__tooltip-trigger"
                      type="button"
                    >
                      <CircleHelp className="pricing-card__tooltip-icon" />
                    </button>
                    <span className="pricing-card__tooltip">
                      {item.tooltip}
                    </span>
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="pricing-card__price-wrap">
          <p className="pricing-card__price">
            {formattedPrice}{" "}
            <span className="pricing-card__price-period">/月</span>
          </p>
          {priceDisclaimer ? (
            <p className="pricing-card__price-disclaimer">{priceDisclaimer}</p>
          ) : null}
        </div>
      </div>
      <PricingPlanCTAButton link={cta} planName={planName} />
    </div>
  );
};
```

- [ ] **Step 2: Run the focused test to verify it passes**

Run:
`npx vitest run tests/int/pricing-plan-card.int.spec.tsx`

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/pricing/PricingPlanCard.tsx tests/int/pricing-plan-card.int.spec.tsx
git commit -m "feat(pricing-cards): extract shared PricingPlanCard from website system"
```

---

### Task 3: Refactor the live Pricing block to use the shared card

**Files:**

- Modify: `src/blocks/Pricing/Component.tsx`
- Test: `tests/int/pricing-plan-card.int.spec.tsx`

- [ ] **Step 1: Replace inline markup with the shared component**

In `src/blocks/Pricing/Component.tsx`:

1. Delete these local helpers and types:
   - `PricingPlan` type
   - `pricingStylePresetClassMap`
   - `linkIconMap`
   - `resolveCtaVariant`
   - `resolveStylePresetClassName`
   - `formatPrice`
   - `PricingPlanCTA`
2. Import the shared component:

```tsx
import { PricingPlanCard } from "@/components/pricing/PricingPlanCard";
```

3. Replace each inline card render block (currently lines 129-198) with:

```tsx
<PricingPlanCard
  cta={plan.cta}
  contents={plan.contents}
  planName={plan.planName}
  planSub={plan.planSub}
  price={plan.price}
  priceDisclaimer={plan.priceDisclaimer}
  recommended={plans.length > 1 && planIndex === 0 ? true : plan.recommended}
  stylePreset={plan.stylePreset}
  key={plan.id || planIndex}
/>
```

Keep the surrounding `pricing-section` and grid logic unchanged.

- [ ] **Step 2: Run the focused test again**

Run:
`npx vitest run tests/int/pricing-plan-card.int.spec.tsx`

Expected: still PASS.

- [ ] **Step 3: Run typecheck**

Run:
`npx tsc --noEmit`

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/blocks/Pricing/Component.tsx
git commit -m "refactor(pricing-cards): reuse shared PricingPlanCard in Pricing block"
```

---

### Task 4: Replace the fake Storybook pricing cards with the real Japanese plans

**Files:**

- Modify: `src/components/patterns/PricingCards.stories.tsx`
- Modify: `src/components/patterns/Patterns.tsx`

- [ ] **Step 1: Replace the Storybook story with one real-plans story**

Update `src/components/patterns/PricingCards.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PricingPlanCard } from "@/components/pricing/PricingPlanCard";

const realPlans = [
  {
    planName: "24時間電話対応プラン",
    planSub: "24時間電話対応をサポートします。",
    price: 3000,
    priceDisclaimer: "価格は税抜きです",
    stylePreset: "style4" as const,
    contents: [
      { text: "24時間電話対応（近隣含む）" },
      { text: "ゲストからの緊急電話対応" },
      { text: "トラブル発生時の一次対応" },
      { text: "必要に応じたホスト様への連絡" },
    ],
    cta: {
      label: "見積り相談する",
      href: "/contact",
      variant: "primary",
      icon: "arrowRight" as const,
    },
  },
  {
    planName: "電話+夜間プラン",
    planSub: "夜間の対応をお任せいただけます。",
    price: 13000,
    priceDisclaimer: "価格は税抜きです",
    stylePreset: "style3" as const,
    contents: [
      { text: "21:00〜翌06:00" },
      { text: "24時間電話対応（近隣含む）" },
      { text: "滞在中トラブル一次対応" },
      { text: "ホスト様へのエスカレーション" },
      { text: "レビューサポート" },
      { text: "運営改善アドバイス" },
    ],
    cta: {
      label: "見積り相談する",
      href: "/contact",
      variant: "primary",
      icon: "arrowRight" as const,
    },
  },
  {
    planName: "電話 + メッセージ\nフルサポートプラン",
    planSub: "ゲスト対応をトータルでサポートします。",
    price: 18000,
    priceDisclaimer: "価格は税抜きです",
    recommended: true,
    stylePreset: "style2" as const,
    contents: [
      { text: "24時間電話対応（近隣含む）" },
      { text: "24時間メッセージ返信" },
      { text: "チェックインサポート" },
      { text: "滞在中トラブル一次対応" },
      { text: "ホスト様へのエスカレーション" },
      { text: "レビューサポート" },
      { text: "運営改善アドバイス" },
    ],
    cta: {
      label: "今すぐ無料で相談する",
      href: "/contact",
      variant: "primary",
      icon: "arrowRight" as const,
    },
  },
];

const meta: Meta = {
  title: "Compositions/PricingCards",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

/**
 * Real Japanese pricing plans using the same pricing-card system as the website.
 * Use this story to review the actual hierarchy, chip placement, spacing, and CTA treatment.
 *
 * @summary real website pricing plans using shared pricing card system
 */
export const RealPlans: Story = {
  render: () => (
    <div className="pricing-section">
      <div className="pricing-section__grid pricing-section__grid--multi">
        {realPlans.map((plan, index) => (
          <PricingPlanCard key={index} {...plan} />
        ))}
      </div>
    </div>
  ),
};
```

Delete the old `features` constant and the old `MultiTone` story.

- [ ] **Step 2: Remove the fake `PricingCard` from `Patterns.tsx`**

Delete from `src/components/patterns/Patterns.tsx`:

- `PricingCardTone` type
- `PRICING_TONES` constant
- entire `PricingCard` export block

Keep other exports unchanged.

- [ ] **Step 3: Run typecheck**

Run:
`npx tsc --noEmit`

Expected: clean.

- [ ] **Step 4: Run Storybook build**

Run:
`NODE_OPTIONS=--no-deprecation npx storybook build -o /tmp/pricing-build`

Expected: build succeeds and only `RealPlans` exists under `Compositions/PricingCards`.

- [ ] **Step 5: Commit**

```bash
git add src/components/patterns/PricingCards.stories.tsx src/components/patterns/Patterns.tsx
git commit -m "refactor(pricing-cards): replace fake Storybook cards with real Japanese pricing plans"
```

---

### Task 5: Final verification

**Files:**

- No new files

- [ ] **Step 1: Run focused pricing tests**

Run:
`npx vitest run tests/int/pricing-plan-card.int.spec.tsx`

Expected: PASS.

- [ ] **Step 2: Run full typecheck**

Run:
`npx tsc --noEmit`

Expected: clean.

- [ ] **Step 3: Run Storybook build**

Run:
`NODE_OPTIONS=--no-deprecation npx storybook build -o /tmp/pricing-build`

Expected: build succeeds.

- [ ] **Step 4: Verify story registration**

Run:
`python3 - <<'PY'
import json
from pathlib import Path
data = json.loads(Path('/tmp/pricing-build/index.json').read_text())
print([k for k in sorted(data['entries']) if k.startswith('compositions-pricingcards--')])
PY`

Expected: `['compositions-pricingcards--docs', 'compositions-pricingcards--real-plans']`

---

## Self-review notes

- The plan removes the fake pricing card system rather than layering more design tweaks on top of it.
- Storybook stays minimal: one real-plans story only.
- Live website and Storybook share the same presentational markup and CSS classes.
