import type { ArrayField, TextField } from 'payload'
import { describe, expect, it } from 'vitest'

import { Content } from '@/blocks/Content/config'

const getTocTitleField = (): TextField => {
  const columnsField = Content.fields.find(
    (field): field is ArrayField =>
      'name' in field && field.name === 'columns' && field.type === 'array',
  )
  if (!columnsField) throw new Error('Content columns field was not found')

  const tocTitleField = columnsField.fields.find(
    (field): field is TextField =>
      'name' in field && field.name === 'tocTitle' && field.type === 'text',
  )
  if (!tocTitleField) throw new Error('Content tocTitle field was not found')

  return tocTitleField
}

describe('Content ToC title validation', () => {
  it('uses Payload native required validation when page ToC is enabled', () => {
    const tocTitleField = getTocTitleField()

    expect(tocTitleField.required).toBe(true)
    expect(tocTitleField.admin?.condition?.({ showTableOfContents: true }, {}, {} as never)).toBe(
      true,
    )
  })

  it('skips Payload required validation when page ToC is disabled', () => {
    const tocTitleField = getTocTitleField()

    expect(tocTitleField.admin?.condition?.({ showTableOfContents: false }, {}, {} as never)).toBe(
      false,
    )
  })
})
