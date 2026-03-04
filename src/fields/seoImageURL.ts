import type { Field } from 'payload'

const absoluteHTTPPattern = /^https?:\/\/\S+$/i

export const seoImageURLField: Field = {
  name: 'imageURL',
  type: 'text',
  label: 'Meta Image URL',
  admin: {
    description:
      'Optional override for SEO image. Use an absolute URL (https://...) or a public path (for example /logo.svg).',
  },
  validate: (value: unknown) => {
    if (typeof value !== 'string') return true

    const trimmed = value.trim()
    if (!trimmed) return true

    if (trimmed.startsWith('/')) return true
    if (absoluteHTTPPattern.test(trimmed)) return true

    return 'Use an absolute URL (https://...) or a path that starts with /.'
  },
}

