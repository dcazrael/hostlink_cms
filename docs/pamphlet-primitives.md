# Pattern Primitives

Self-contained React primitives that mirror the visual cues from the hostlink pamphlet. Each primitive ships with at least one Storybook story, is independent of Payload, and is independent of the homepage renderer.

## Reference material

`docs/hostlink_pamphlet.pdf` is the design reference. It is read-only for this work. Do not edit, regenerate, or move it. The primitives only borrow visual cues (proportions, tones, cuts, skews) from the PDF; they are not pixel-perfect recreations.

If you need to confirm a tone, a chamfer depth, or a band orientation, open the PDF and read the corresponding page. The slot-to-cue mapping below is the canonical record of which primitive covers which cue.

## Source layout

All primitives live in `src/components/patterns/`:

- One component file per primitive: `ShapeMask.tsx`, `DiagonalBand.tsx`, `ChamferedCard.tsx`, `SectionFrame.tsx`, `BulletList.tsx`, `VerticalAccent.tsx`, `NumberBadge.tsx`.
- `Patterns.tsx` contains second-pass pattern compositions built from the primitives: buttons, cards, pricing panels, flow steps, FAQ, tables, contact panel, image frame, and section compositions.
- One co-located stories file per primitive: `*.stories.tsx`.
- `visualSlots.ts` defines the slot contract and resolver.
- `index.ts` re-exports the components, types, and slot helpers as a single barrel.
- `StorybookSmoke.stories.tsx` and `ThemeTokens.stories.tsx` are support stories that exercise the Tailwind v4 token pipeline rather than a specific primitive.

The barrel is the only intended import path for consumers:

```ts
import {
  ShapeMask,
  DiagonalBand,
  resolveVisualSlot,
} from "@/components/patterns";
```

## Primitive inventory

| Primitive        | Component            | Story                        | What it draws                                                                                                            |
| ---------------- | -------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `ShapeMask`      | `ShapeMask.tsx`      | `ShapeMask.stories.tsx`      | Rectangular slab with a single diagonal cut on one corner. Slanted panels on the cover and inside spreads.               |
| `DiagonalBand`   | `DiagonalBand.tsx`   | `DiagonalBand.stories.tsx`   | Thin angled slab (skewed) that runs across the top of a section. Cover navy bar, thin utility bar above a content block. |
| `ChamferedCard`  | `ChamferedCard.tsx`  | `ChamferedCard.stories.tsx`  | Small polygon card with a single corner cut at 45° and a hairline border. Hosts compact label-and-value rows.            |
| `SectionFrame`   | `SectionFrame.tsx`   | `SectionFrame.stories.tsx`   | Editorial section wrapper: top hairline, mint accent rule, eyebrow, title, description, body slot.                       |
| `Bullet`         | `BulletList.tsx` | `BulletList.stories.tsx` | Small mint marker that begins a list row. `square`, `diamond`, `bar`, `circle`, or `polygon`.                            |
| `BulletList`     | `BulletList.tsx` | `BulletList.stories.tsx` | Primitive semantic `ul` that pairs simple row content with one shaped mint marker per item.                              |
| `VerticalAccent` | `VerticalAccent.tsx` | `VerticalAccent.stories.tsx` | Thin vertical stroke alongside a column. Mint rule by a quote, navy line between columns, muted hairline between rows.   |
| `NumberBadge`    | `NumberBadge.tsx`    | `NumberBadge.stories.tsx`    | Compact numbered chip. `square`, `chamfered`, or `circle`. Always exposes the number as readable text.                   |

## Pattern inventory

| Pattern            | Component        | Story                  | What it composes                                                        |
| ------------------ | ---------------- | ---------------------- | ----------------------------------------------------------------------- |
| `Button`           | `Patterns.tsx`   | `Patterns.stories.tsx` | Token-backed CTA button in navy, mint, and outline tones.               |
| `Card`             | `Patterns.tsx`   | `Patterns.stories.tsx` | Chamfered editorial card with eyebrow, title, and body content.         |
| `PricingCard`      | `Patterns.tsx`   | `Patterns.stories.tsx` | Pricing panel with features and CTA, including a featured navy variant. |
| `GridBlockItem`    | `Patterns.tsx`   | `Patterns.stories.tsx` | Numbered grid item for service or operations summaries.                 |
| `FlowSteps`        | `Patterns.tsx`   | `Patterns.stories.tsx` | Three-step flow using diagonal bands and pattern cards.                 |
| `FAQStack`         | `Patterns.tsx`   | `Patterns.stories.tsx` | Bordered FAQ stack using native `details` / `summary` semantics.        |
| `Table`            | `Patterns.tsx`   | `Patterns.stories.tsx` | High-contrast comparison table for service tiers or operations details. |
| `ContactPanel`     | `Patterns.tsx`   | `Patterns.stories.tsx` | Navy contact form panel with token-backed inputs and mint CTA.          |
| `FeatureList`      | `BulletList.tsx` | `BulletList.stories.tsx` | Title-and-supporting-text feature rows built on the shaped bullet marker. |
| `ImageFrame`       | `Patterns.tsx`   | `Patterns.stories.tsx` | Framed abstract image placeholder for hardcoded pattern visual slots.   |
| `SectionShape`     | `Patterns.tsx`   | `Patterns.stories.tsx` | Section shell with inset geometric background mask.                     |
| `SectionWithImage` | `Patterns.tsx`   | `Patterns.stories.tsx` | Full section composition combining copy, bullets, and a visual frame.   |

Pattern stories are review surfaces, not CMS schemas. They do not add Payload fields, block types, or editor-selectable visual variants.

Every primitive reads its colors from the Tailwind v4 tokens declared in `src/app/(frontend)/globals.css`. None of them hardcode hex values, and none of them import the Payload config or generated types.

## Support stories

- `StorybookSmoke.stories.tsx` is a one-page token sanity check. It renders `bg-card`, `bg-primary`, and a bordered control so you can confirm the Storybook pipeline (CSS import, `data-theme="light"` decorator, font variables) is wired up before doing real visual work. Title in the sidebar: `Patterns/StorybookSmoke`.
- `ThemeTokens.stories.tsx` is the swatch grid for the full token set: `background`, `card`, `primary`, `secondary`, `accent`, `muted`, `border`, `foreground`, `muted-foreground`. It also exposes a `Tokens (raw list)` story that prints the token-to-class map as a plain list. Title in the sidebar: `Patterns/ThemeTokens`. Use it to confirm a token pairs with the right utility before picking a tone for a primitive.

## Slot contract

`src/components/patterns/visualSlots.ts` is the single source of truth for which slots exist. The contract:

```ts
export type VisualSlot = 'hero' | 'operations' | 'pricing' | 'proof' | 'contact'

export type VisualDefinition = {
  slot: VisualSlot
  label: string
  description: string
}

export const VISUAL_SLOTS: readonly VisualDefinition[] = [/* ... */]
export const resolveVisualSlot(
  slot: VisualSlot | string | null | undefined,
): VisualDefinition
```

Slot meanings:

- `hero`: top-of-page visual that anchors the brand and primary message.
- `operations`: visual supporting the operations or "how it works" section.
- `pricing`: visual paired with the pricing tiers and call-to-action.
- `proof`: visual backing social proof, testimonials, or case-study callouts.
- `contact`: visual closing the contact or next-step block.

`resolveVisualSlot` is defensive by design. It falls back to the `hero` definition for `null`, `undefined`, the empty string, and any string that is not a known slot. Callers never have to null-check the result.

## Decision: hardcoded-by-slot first

Pattern visuals are resolved by a fixed slot name. There is no editor-selectable Payload field, no select-option list, and no CMS-driven variant picker. The slot name is the contract; the primitive composition that fills it is hand-written in code.

This is the explicit first-pass decision:

1. **Hardcoded-by-slot first.** Each slot maps to a hand-composed sequence of primitives. Composition lives in the component code that consumes the slot, not in Payload data.
2. **Editor-selectable visuals later, only if a concrete CMS or editor workflow requires it.** When (and only when) a real editor workflow needs to pick a visual variant from the admin UI, we add a Payload select field on the relevant block, constrain the options to the slot vocabulary, and route resolution through `resolveVisualSlot`. That is a follow-up, not part of the current issue.

The rationale: editor-selectable visuals are a maintenance and review burden (every new variant needs a Payload field, a schema migration, type regeneration, and an admin preview path). Until a concrete editor need shows up, hardcoded composition is cheaper, more deterministic, and easier to keep visually consistent with the pamphlet.

## Out of scope for the current issue

The following are explicitly **not** part of this work. They are recorded here so future tickets can pick them up without re-deriving the boundary.

- **Phase 1 SEO and content pages.** Metadata, JSON-LD, OpenGraph, sitemap, and per-page SEO blocks are tracked separately.
- **Homepage migration to landing-pages.** The `landing-pages` refactor (replacing the homepage-specific section components with the unified block layout) is a separate phase.
- **Payload schema and admin redesign.** No Payload collections, globals, blocks, or generated types are touched by this work. `pnpm generate:types` is not required to run Storybook or to author pattern stories.
- **shadcn / base-ui rewrite.** The primitives render with Tailwind v4 utilities and a small `cn()` helper from `src/utilities/ui.ts`. There is no shadcn primitive, no Radix Slot, and no base-ui dependency in any pattern file.

## Adding a new primitive

1. Create `src/components/patterns/<Name>.tsx`. Read colors from the Tailwind v4 tokens; do not hardcode hex.
2. Create a co-located `src/components/patterns/<Name>.stories.tsx` with at least one default story and enough variants to cover every public prop.
3. If the primitive is meant to be consumed by name (for example, from a slot), add it to the barrel in `src/components/patterns/index.ts`.
4. If a new visual slot is needed (and only if a hardcoded slot is not enough), extend `VisualSlot` and the `VISUAL_SLOTS` array in `visualSlots.ts`. Update the `resolveVisualSlot` fallback if the new slot should not be the default.
5. Run `pnpm storybook` and confirm the new story renders inside the frontend canvas.
