# Pricing Cards — Reuse Real Website System

## Problem

The Storybook `PricingCard` in `src/components/patterns/Patterns.tsx` is a separate mini-system that does not use the real pricing card structure and token system already implemented for the website in:

- `src/app/(frontend)/globals.css`
- `src/blocks/Pricing/Component.tsx`

As a result, the story cards feel visually disconnected from the live site and from the newer editorial / geometric direction.

## Goal

Make Storybook pricing cards use the **same real pricing card system** as the website, with the **same Japanese plan content and structure**.

## Scope

In scope:

- Stop using the fake story-only `PricingCard` layout from `src/components/patterns/Patterns.tsx`
- Extract the reusable presentational pricing card markup from `src/blocks/Pricing/Component.tsx`
- Reuse that presentational component in Storybook
- Use the real Japanese plan names, descriptions, includes, prices, and featured state
- Keep the existing pricing color management from `globals.css`

Out of scope:

- Changing the live website pricing content
- Redesigning the pricing token system in CSS
- Adding multiple experimental colorways in Storybook
- Reworking CTA copy or pricing logic

## Architecture

Create one shared presentational component for a single pricing card and let both:

- the website pricing block
- Storybook pricing stories

render through it.

This shared component should consume the existing pricing-card CSS classes already defined in `globals.css` (`pricing-card`, `pricing-card__surface`, `pricing-card__header`, `pricing-card__chip`, `pricing-card__divider`, `pricing-card__list`, `pricing-card__price`, `pricing-card__cta`, etc.).

## File direction

- Extract shared pricing card UI into a dedicated component file (not `Patterns.tsx`)
- Keep `src/blocks/Pricing/Component.tsx` responsible for mapping Payload block data to the shared presentational component
- Update Storybook pricing stories to render the shared presentational component with the real Japanese plans
- Remove the old fake `PricingCard` export from `src/components/patterns/Patterns.tsx`

## Storybook direction

Keep Storybook simple:

- one main story with the full real pricing set
- optionally one single-card story only if needed for inspection

No multi-tone fake demo set.

## Acceptance criteria

- Storybook pricing cards visually match the real website pricing system
- Popular chip placement comes from the real pricing header layout
- Card structure, spacing, CTA treatment, and color behavior are no longer a separate fake system
- The old `PricingCard` story implementation in `Patterns.tsx` is removed

## Risks

- If the pricing block markup is extracted carelessly, live-site behavior could drift
- Shared extraction must stay presentational only; website-specific block wiring should remain in the block component
