import { describe, expect, it } from 'vitest'

import { VISUAL_SLOTS, resolveVisualSlot } from '@/components/patterns/visualSlots'

const REQUIRED_SLOTS = ['hero', 'operations', 'pricing', 'proof', 'contact'] as const

describe('visual slots contract', () => {
  it('exposes the required hardcoded slot set in stable order', () => {
    const exportedSlotNames = VISUAL_SLOTS.map((definition) => definition.slot)

    expect(exportedSlotNames).toEqual([...REQUIRED_SLOTS])
  })

  it('gives each definition a slot, label, and description suitable for docs', () => {
    VISUAL_SLOTS.forEach((definition) => {
      expect(typeof definition.slot).toBe('string')
      expect(definition.slot.length).toBeGreaterThan(0)

      expect(typeof definition.label).toBe('string')
      expect(definition.label.trim().length).toBeGreaterThan(0)

      expect(typeof definition.description).toBe('string')
      expect(definition.description.trim().length).toBeGreaterThan(0)
    })
  })

  it('makes every definition slot key match a known VisualSlot', () => {
    const allowedSlots = new Set<string>(REQUIRED_SLOTS)

    VISUAL_SLOTS.forEach((definition) => {
      expect(allowedSlots.has(definition.slot)).toBe(true)
    })
  })

  it('falls back to the hero definition for null and unknown slot requests', () => {
    const heroDefinition = VISUAL_SLOTS.find((definition) => definition.slot === 'hero')
    expect(heroDefinition).toBeDefined()
    if (!heroDefinition) return

    expect(resolveVisualSlot(null)).toEqual(heroDefinition)
    expect(resolveVisualSlot(undefined)).toEqual(heroDefinition)
    expect(resolveVisualSlot('not-a-real-slot')).toEqual(heroDefinition)
    expect(resolveVisualSlot('')).toEqual(heroDefinition)
  })

  it('resolves each allowed slot to its matching definition', () => {
    REQUIRED_SLOTS.forEach((slot) => {
      const resolved = resolveVisualSlot(slot)
      expect(resolved.slot).toBe(slot)
    })
  })
})
