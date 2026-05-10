# Page Layout Implementation Plan

This plan outlines the implementation of hero titles and block components for the HostLink CMS pages system.

## Context

The Pages collection in PayloadCMS uses a blocks-based layout system. This implementation plan addresses:

1. **Page title not displaying** - The `title` field on Pages is not rendered anywhere
2. **Missing block components** - RenderBlocks.tsx doesn't render most block types (Faq, Services, Problems, Flow, etc.)
3. **ContentBlock limitations** - Cannot embed section blocks (like FAQ) within ContentBlock columns
4. **Code duplication** - Homepage sections and page blocks are separate implementations

---

## Phase 1: Hero Title

### Goal
Display the Page `title` as an H1 in all hero types (HighImpact, MediumImpact, LowImpact).

### Files to Modify

| File | Change |
|------|--------|
| `src/heros/HighImpact/index.tsx` | Add `title?: string` prop, render as h1 overlay on full-bleed image |
| `src/heros/MediumImpact/index.tsx` | Add `title?: string` prop, render as h1 below 3x2 image |
| `src/heros/LowImpact/index.tsx` | Add `title?: string` prop, render as h1 heading |
| `src/heros/RenderHero.tsx` | Accept and forward `title` prop to hero component |
| `src/app/(frontend)/[slug]/page.tsx` | Pass `title={page.title}` to RenderHero |

### Visual Verification
- [ ] HighImpact: Title visible as overlay on full-bleed image with gradient
- [ ] MediumImpact: Title visible below image with clear hierarchy
- [ ] LowImpact: Title visible as main heading

### Run Fallback After Phase 1

---

## Phase 2: GridBlock (Unified Services + Problems)

### Goal
Create a unified GridBlock that replaces ProblemsBlock and ServicesBlock. Supports 2 or 3 column layouts with optional sub-heading.

### Files to Create

| File | Purpose |
|------|---------|
| `src/blocks/GridBlock/config.ts` | Block config with `items`, `columns`, `sub` fields |
| `src/blocks/GridBlock/Component.tsx` | Renders grid of items with column configuration |

### Block Config Fields
```ts
{
  items: [
    { icon?, title, description }  // icon is relationship to icons collection
  ],
  columns: 2 | 3,
  sub?: string  // optional subheading
}
```

### Files to Modify

| File | Change |
|------|--------|
| `src/collections/Pages/index.ts` | Add GridBlock to layout blocks array |
| `src/blocks/RenderBlocks.tsx` | Add GridBlock case + `<hr>` dividers between all blocks |

### Styling
- Grid: `grid-cols-1 lg:grid-cols-2` for 2 columns, `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3` for 3 columns
- Cards: Similar to existing ServicesSection/ProblemsSection styling
- Divider: `border-border my-8`

### Visual Verification
- [ ] GridBlock renders with correct column count
- [ ] Items display with proper card styling
- [ ] Dividers appear between blocks

### Run Fallback After Phase 2

---

## Phase 3: Other Block Components

### Goal
Add rendering support for all remaining block types in RenderBlocks.tsx.

### Files to Create

| Component | File |
|-----------|------|
| Faq | `src/blocks/Faq/Component.tsx` |
| Flow | `src/blocks/Flow/Component.tsx` |
| Testimonials | `src/blocks/Testimonials/Component.tsx` |
| Pricing | `src/blocks/Pricing/Component.tsx` |
| Company | `src/blocks/Company/Component.tsx` |
| Contact | `src/blocks/Contact/Component.tsx` |

### Notes
- Reference existing homepage sections for styling (e.g., `src/components/homepage/sections/FaqSection.tsx`)
- Components should match homepage section styling
- Add to RenderBlocks.tsx switch statement

### Files to Modify

| File | Change |
|------|--------|
| `src/blocks/RenderBlocks.tsx` | Add cases for all new block types |

### Block Types to Add
- `faq` → FaqComponentBlock
- `flow` → FlowComponentBlock
- `testimonials` → TestimonialsComponentBlock
- `pricing` → PricingComponentBlock
- `company` → CompanyComponentBlock
- `contact` → ContactComponentBlock
- `banner` → Already exists
- `code` → Already exists

### Visual Verification
- [ ] All block types render correctly
- [ ] Styling matches homepage sections
- [ ] Dividers between all blocks

### Run Fallback After Phase 3

---

## Phase 4: ContentBlock with Dividers + Embedded Components

### Goal
Allow ContentBlock columns to have:
1. Optional divider after the column
2. Optional embedded component (any block type) after richText

### Files to Modify

| File | Change |
|------|--------|
| `src/blocks/Content/config.ts` | Add `divider?: boolean` and `component?: blocks([])` to column fields |
| `src/blocks/Content/Component.tsx` | Render embedded component after richText, render `<hr>` if divider is true |

### Column Fields (Updated)
```ts
{
  size: 'oneThird' | 'half' | 'twoThirds' | 'full',
  richText: RichText,
  enableLink: boolean,
  link: {...},
  divider: boolean,       // NEW: optional divider after this column
  component: blocks([])   // NEW: optional embedded component (any block type)
}
```

### Rendering Logic (ContentBlock/Component.tsx)
1. Render `richText` if present
2. Render `link` if `enableLink` and link is set
3. Render `component` after if present
4. Render `<hr>` after column if `divider: true`

### Visual Verification
- [ ] RichText renders correctly
- [ ] Embedded component renders after richText
- [ ] Divider appears after column when `divider: true`
- [ ] Component-only columns (no richText) work

### Run Fallback After Phase 4

---

## Phase 5: LandingPage Component Unification

### Goal
Refactor homepage sections to use the same block components created in phases 2-3, eliminating code duplication.

### Architecture
- `src/blocks/*/Component.tsx` - Core block components (used in Pages)
- `src/components/homepage/sections/*.tsx` - Wrap block components with type adapters if needed

### Components to Unify
- ServicesSection → GridBlock/Component (or shared)
- ProblemsSection → GridBlock/Component (or shared)
- FaqSection → Faq/Component
- FlowSection → Flow/Component
- TestimonialsSection → Testimonials/Component
- PricingSection → Pricing/Component
- CompanySection → Company/Component
- ContactSection → Contact/Component

### Files to Modify (TBD based on analysis)
- `src/components/homepage/sections/*.tsx` - May need type adapters
- `src/components/homepage/RenderHomepageLayout.tsx` - May need updates

### Approach
1. Create block components in `src/blocks/*/Component.tsx`
2. Homepage sections either:
   - Use block components directly (if types match)
   - Create lightweight type adapters
3. Ensure same visual output as current implementation

### Visual Verification
- [ ] Homepage renders identically after refactor
- [ ] No duplication between homepage and page blocks
- [ ] Consistent styling across both

### Run Fallback After Phase 5

---

## Notes

### Pre-existing ContentBlock Patterns
Legacy ContentBlock/column patterns created before this plan are ignored. Focus is on correct implementation going forward.

### Code Quality
After each phase, run `fallow` to check for:
- Unused code
- Code duplication
- Complexity hotspots
- Architecture boundary violations

### Testing Approach
1. Visual verification after each phase
2. Code verification with `fallow`
3. TypeScript compilation check: `npx tsc --noEmit`
4. Linting: `./node_modules/.bin/oxlint src/`
5. Formatting: `./node_modules/.bin/oxfmt src/`

---

## Order
1. Phase 1: Hero Title
2. Phase 2: GridBlock
3. Phase 3: Other Block Components
4. Phase 4: ContentBlock with Dividers + Embedded Components
5. Phase 5: LandingPage Component Unification