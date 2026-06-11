/**
 * Hardcoded-by-slot visual contract for the hostlink pamphlet.
 *
 * Decision: pamphlet visuals are resolved by a fixed slot name (no editor-selectable
 * schema field, no Payload select option list). This module is the single source of
 * truth for which slots exist and what each one represents. Task 4 (primitives &
 * stories) consumes this contract to render the visuals.
 *
 * `resolvePamphletVisualSlot` is intentionally defensive: it falls back to the
 * `hero` definition for `null`, `undefined`, empty strings, and any unknown slot
 * name, so callers never have to null-check the result.
 */

export type PamphletVisualSlot = 'hero' | 'operations' | 'pricing' | 'proof' | 'contact'

export type PamphletVisualDefinition = {
  slot: PamphletVisualSlot
  label: string
  description: string
}

const HERO_DEFINITION: PamphletVisualDefinition = {
  slot: 'hero',
  label: 'Hero',
  description: 'Top-of-pamphlet visual that anchors the brand and primary message.',
}

const OPERATIONS_DEFINITION: PamphletVisualDefinition = {
  slot: 'operations',
  label: 'Operations',
  description: 'Visual supporting the operations or "how it works" section.',
}

const PRICING_DEFINITION: PamphletVisualDefinition = {
  slot: 'pricing',
  label: 'Pricing',
  description: 'Visual paired with the pricing tiers and call-to-action.',
}

const PROOF_DEFINITION: PamphletVisualDefinition = {
  slot: 'proof',
  label: 'Proof',
  description: 'Visual backing social proof, testimonials, or case-study callouts.',
}

const CONTACT_DEFINITION: PamphletVisualDefinition = {
  slot: 'contact',
  label: 'Contact',
  description: 'Visual closing the pamphlet alongside the contact / next-step block.',
}

export const PAMPHLET_VISUAL_SLOTS: readonly PamphletVisualDefinition[] = [
  HERO_DEFINITION,
  OPERATIONS_DEFINITION,
  PRICING_DEFINITION,
  PROOF_DEFINITION,
  CONTACT_DEFINITION,
]

const SLOT_BY_NAME: ReadonlyMap<string, PamphletVisualDefinition> = new Map(
  PAMPHLET_VISUAL_SLOTS.map((definition) => [definition.slot, definition]),
)

/**
 * Resolve a visual definition by slot name. Falls back to the `hero` definition
 * for `null`, `undefined`, empty strings, and any string that is not a known
 * PamphletVisualSlot. Never returns `undefined`.
 */
export const resolvePamphletVisualSlot = (
  slot: PamphletVisualSlot | string | null | undefined,
): PamphletVisualDefinition => {
  if (typeof slot !== 'string') return HERO_DEFINITION
  const definition = SLOT_BY_NAME.get(slot)
  if (definition) return definition
  return HERO_DEFINITION
}
