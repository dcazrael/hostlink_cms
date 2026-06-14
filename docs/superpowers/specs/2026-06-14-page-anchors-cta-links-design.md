# Page Anchors and CTA Links Design

## Scope

Implement GitHub issues #12 and #13 on `main` without creating a new branch or worktree.

Issue #12 adds manual anchors to Page layout blocks and exposes those anchors to internal links. Issue #13 improves Call to Action links so CTAs can target internal pages, page anchors, and external URLs, and can render as buttons only when there is no rich text content.

## Goals

- Add editor-managed, slug-like manual anchors to Page layout blocks except Hero blocks.
- Prevent duplicate manual anchors within a single Page layout.
- Render manual anchors as frontend DOM `id` attributes.
- Allow internal links to target a Page plus an optional manual anchor.
- Keep anchor-link behavior scoped to Pages.
- Update generated Payload types after schema changes.
- Preserve CTA card rendering when rich text content exists.
- Render CTA buttons without the card wrapper when rich text is empty.

## Non-goals

- Do not add anchors to Posts, Landing Pages, or other collections.
- Do not replace the homepage section anchor system.
- Do not build a generalized cross-collection anchor registry.
- Do not change Hero block link behavior unless needed for type compatibility.

## Data Model

Add a reusable Page layout anchor field named `manualAnchor` to all blocks available in `pages.layout` except `HeroBlock`.

The field will be optional and stored on each block instance. Its value must be slug-like ASCII: lowercase letters, numbers, and hyphens, with no leading or trailing hyphen. Empty values are allowed and ignored by duplicate checks.

The Page collection will validate `layout` during create and update. Validation will collect non-empty `manualAnchor` values and reject duplicates within that Page. The validation should return a Payload field validation message rather than silently modifying data.

## Link Model

Extend the shared `link()` field helper in `src/fields/link.ts` with an option for Page anchors on internal Page references.

When enabled, internal links can store:

- `reference`: the selected Page or Post relationship, as today.
- `pageAnchor`: an optional text/select value shown only when the reference targets `pages`.

The anchor selector should use the current Page anchor component pattern where practical. If the admin component can only select anchors from the current document, implementation may start with a text field and keep validation/rendering robust. The stored anchor should not include a leading `#`.

Runtime link resolution in `CMSLink` will append `#anchor` only for Page references and only when a non-empty anchor is present. Post links and custom URLs keep existing behavior.

## Frontend Rendering

`RenderBlocks` will wrap each block with an `id` when a manual anchor is present. Hero layout blocks will not receive a manual anchor field. For Content blocks, the existing ToC-title-derived id can remain as a fallback when no manual anchor is provided.

Wrapper behavior should remain stable:

- Preserve existing margins and keys.
- Preserve `data-block-index` where currently used.
- Avoid duplicate `id` attributes by choosing one resolved id per wrapper.

## CTA Rendering

`CallToAction` config will continue using `linkGroup`, but the link fields inside it will enable Page anchor support.

`CallToActionBlock` rendering will detect whether `richText` has meaningful content:

- If rich text has content, render the existing card-style CTA container with rich text and buttons.
- If rich text is empty or absent, render only the CTA buttons in a simple container without the card background, border, or empty rich text column.

CTA links will be rendered through `CMSLink` so internal Page, Page anchor, Post, and custom URL behavior remains centralized.

## Error Handling and Validation

- Duplicate manual anchors on the same Page return a clear validation error.
- Invalid manual anchor values return a clear validation error.
- Empty anchors are allowed.
- Missing or unresolved link references continue to render `null` through `CMSLink`, matching current behavior.
- Link anchors with a leading `#` should be normalized at render time defensively.

## Testing and Verification

Add or update integration tests for:

- Page layout blocks can store unique manual anchors.
- Duplicate anchors on the same Page are rejected.
- Frontend block rendering outputs manual anchor ids.
- `CMSLink` renders Page reference links with `#anchor` when provided.
- CTA card mode is preserved when rich text has content.
- CTA button-only mode renders without the card wrapper when rich text is empty.

Run project verification using existing project commands:

- `pnpm generate:types` after schema changes.
- `pnpm lint` or the project-provided oxlint workflow.
- `pnpm tsc --noEmit` if available through project scripts or direct package command.
- Relevant integration tests, preferably through the existing Docker/container setup when required by the project.

## Implementation Boundaries

Expected files include:

- `src/fields/link.ts`
- `src/fields/linkGroup.ts`
- `src/components/Link/index.tsx`
- `src/collections/Pages/index.ts`
- `src/blocks/RenderBlocks.tsx`
- Page layout block config files that are part of `pages.layout`
- `src/blocks/CallToAction/config.ts`
- `src/blocks/CallToAction/Component.tsx`
- `src/payload-types.ts`
- Relevant tests under `tests/`

The implementation should keep changes scoped to issues #12 and #13 and should not create a branch or worktree.
