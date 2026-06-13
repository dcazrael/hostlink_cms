/**
 * Hardcoded-by-slot visual contract for the hostlink pattern visuals.
 *
 * Decision: pattern visuals are resolved by a fixed slot name (no editor-selectable
 * schema field, no Payload select option list). This module is the single source of
 * truth for which slots exist and what each one represents.
 *
 * `resolveVisualSlot` is intentionally defensive: it falls back to the
 * `hero` definition for `null`, `undefined`, empty strings, and any unknown slot
 * name, so callers never have to null-check the result.
 */

export type VisualSlot = 'hero' | 'operations' | 'pricing' | 'proof' | 'contact'

export type VisualDefinition = {
  slot: VisualSlot
  label: string
  description: string
}

const HERO_DEFINITION: VisualDefinition = {
  slot: 'hero',
  label: 'Hero',
  description: 'Top-of-page visual that anchors the brand and primary message.',
}

const OPERATIONS_DEFINITION: VisualDefinition = {
  slot: 'operations',
  label: 'Operations',
  description: 'Visual supporting the operations or "how it works" section.',
}

const PRICING_DEFINITION: VisualDefinition = {
  slot: 'pricing',
  label: 'Pricing',
  description: 'Visual paired with the pricing tiers and call-to-action.',
}

const PROOF_DEFINITION: VisualDefinition = {
  slot: 'proof',
  label: 'Proof',
  description: 'Visual backing social proof, testimonials, or case-study callouts.',
}

const CONTACT_DEFINITION: VisualDefinition = {
  slot: 'contact',
  label: 'Contact',
  description: 'Visual closing the page alongside the contact / next-step block.',
}

export const VISUAL_SLOTS: readonly VisualDefinition[] = [
  HERO_DEFINITION,
  OPERATIONS_DEFINITION,
  PRICING_DEFINITION,
  PROOF_DEFINITION,
  CONTACT_DEFINITION,
]

const SLOT_BY_NAME: ReadonlyMap<string, VisualDefinition> = new Map(
  VISUAL_SLOTS.map((definition) => [definition.slot, definition]),
)

/**
 * Resolve a visual definition by slot name. Falls back to the `hero` definition
 * for `null`, `undefined`, empty strings, and any string that is not a known
 * VisualSlot. Never returns `undefined`.
 */
export const resolveVisualSlot = (
  slot: VisualSlot | string | null | undefined,
): VisualDefinition => {
  if (typeof slot !== 'string') return HERO_DEFINITION
  const definition = SLOT_BY_NAME.get(slot)
  if (definition) return definition
  return HERO_DEFINITION
}
