import type { TextField } from 'payload'

export const manualAnchorPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const manualAnchorValidationMessage =
  'Manual anchors must use lowercase letters, numbers, and hyphens only, with no leading or trailing hyphen.'

export const normalizeManualAnchor = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

export const isValidManualAnchor = (value: string): boolean => manualAnchorPattern.test(value)

export const manualAnchorField = (): TextField => ({
  name: 'manualAnchor',
  type: 'text',
  admin: {
    description:
      'Optional page section anchor. Use lowercase letters, numbers, and hyphens only, like pricing-details.',
  },
  label: 'Manual anchor',
  validate: (value) => {
    const normalized = normalizeManualAnchor(value)
    if (!normalized) return true

    return isValidManualAnchor(normalized) ? true : manualAnchorValidationMessage
  },
})
