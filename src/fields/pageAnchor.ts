import type { Block, CheckboxField } from 'payload'

export const manualAnchorPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const manualAnchorValidationMessage =
  'Manual anchors must use lowercase letters, numbers, and hyphens only, with no leading or trailing hyphen.'

export const normalizeManualAnchor = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

export const isValidManualAnchor = (value: string): boolean => manualAnchorPattern.test(value)

export const manualAnchorField = (): CheckboxField => ({
  name: 'anchor',
  type: 'checkbox',
  admin: {
    condition: (_data, _siblingData, { path }) =>
      path[0] === 'layout' && !path.includes('component'),
    description: 'If enabled, this section is used as an anchor target.',
  },
  label: 'Anchor',
  validate: (value, { siblingData }) => {
    if (value === true) {
      const block = siblingData as { blockName?: unknown; heading?: unknown }
      const hasName = typeof block.blockName === 'string' && block.blockName.trim().length > 0
      const hasHeading = typeof block.heading === 'string' && block.heading.trim().length > 0
      if (!hasName && !hasHeading) {
        return 'Block must have a name or heading when used as an anchor.'
      }
    }
    return true
  },
})

export const withManualAnchorField = (block: Block): Block => block
