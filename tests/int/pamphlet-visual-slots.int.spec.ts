import { describe, expect, it } from 'vitest'

import { PAMPHLET_VISUAL_SLOTS, resolvePamphletVisualSlot } from '@/components/pamphlet/visualSlots'

const REQUIRED_SLOTS = ['hero', 'operations', 'pricing', 'proof', 'contact'] as const

describe('pamphlet visual slots contract', () => {
  it('exposes the required hardcoded slot set in stable order', () => {
    const exportedSlotNames = PAMPHLET_VISUAL_SLOTS.map((definition) => definition.slot)

    expect(exportedSlotNames).toEqual([...REQUIRED_SLOTS])
  })

  it('gives each definition a slot, label, and description suitable for docs', () => {
    PAMPHLET_VISUAL_SLOTS.forEach((definition) => {
      expect(typeof definition.slot).toBe('string')
      expect(definition.slot.length).toBeGreaterThan(0)

      expect(typeof definition.label).toBe('string')
      expect(definition.label.trim().length).toBeGreaterThan(0)

      expect(typeof definition.description).toBe('string')
      expect(definition.description.trim().length).toBeGreaterThan(0)
    })
  })

  it('makes every definition slot key match a known PamphletVisualSlot', () => {
    const allowedSlots = new Set<string>(REQUIRED_SLOTS)

    PAMPHLET_VISUAL_SLOTS.forEach((definition) => {
      expect(allowedSlots.has(definition.slot)).toBe(true)
    })
  })

  it('falls back to the hero definition for null and unknown slot requests', () => {
    const heroDefinition = PAMPHLET_VISUAL_SLOTS.find((definition) => definition.slot === 'hero')
    expect(heroDefinition).toBeDefined()
    if (!heroDefinition) return

    expect(resolvePamphletVisualSlot(null)).toEqual(heroDefinition)
    expect(resolvePamphletVisualSlot(undefined)).toEqual(heroDefinition)
    expect(resolvePamphletVisualSlot('not-a-real-slot')).toEqual(heroDefinition)
    expect(resolvePamphletVisualSlot('')).toEqual(heroDefinition)
  })

  it('resolves each allowed slot to its matching definition', () => {
    REQUIRED_SLOTS.forEach((slot) => {
      const resolved = resolvePamphletVisualSlot(slot)
      expect(resolved.slot).toBe(slot)
    })
  })
})
