import type { Field } from 'payload'

const absoluteHTTPPattern = /^https?:\/\/\S+$/i
const allowedImageExtensionPattern = /\.(png|jpe?g|webp)(\?|#|\/|$)/i
const svgPattern = /\.svg(\?|#|\/|$)/i
const svgMimePattern = /^image\/svg\+xml(\s|$)/i

export const seoImageURLField: Field = {
  name: 'imageURL',
  type: 'text',
  label: 'Meta Image URL',
  admin: {
    description:
      'Optional override for SEO image. Use a PNG, JPEG, or WebP image via an absolute URL (https://...) or a public path (for example /logo.png). SVG and any other formats are not supported as OG images.',
  },
  validate: (value: unknown) => {
    if (typeof value !== 'string') return true

    const trimmed = value.trim()
    if (!trimmed) return true

    if (svgPattern.test(trimmed) || svgMimePattern.test(trimmed)) {
      return 'SVG images are not supported as OG images. Use PNG, JPEG, or WebP.'
    }

    if (!allowedImageExtensionPattern.test(trimmed)) {
      return 'Only PNG, JPEG, or WebP images are supported. Provide an absolute URL (https://...) or a path that ends with .png, .jpg, .jpeg, or .webp.'
    }

    if (trimmed.startsWith('/')) return true
    if (absoluteHTTPPattern.test(trimmed)) return true

    return 'Use an absolute URL (https://...) or a path that starts with /.'
  },
}
