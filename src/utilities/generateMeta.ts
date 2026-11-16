import type { Metadata } from 'next'

import type { Config, LandingPage, Media, Page, Post } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const svgPattern = /\.svg(\?|#|\/|$)/i
const svgMimePattern = /^image\/svg\+xml(\s|$)/i
const allowedImageExtensionPattern = /\.(png|jpe?g|webp)(\?|#|\/|$)/i

const getAbsoluteMetaImageURL = (imageURL: unknown, serverURL: string): string | null => {
  if (typeof imageURL !== 'string') return null

  const trimmed = imageURL.trim()
  if (!trimmed) return null

  if (svgPattern.test(trimmed) || svgMimePattern.test(trimmed)) return null

  if (!allowedImageExtensionPattern.test(trimmed)) return null

  if (/^https?:\/\//i.test(trimmed)) return trimmed

  if (trimmed.startsWith('/')) return `${serverURL}${trimmed}`

  return null
}

const isSvgImage = (image: Media): boolean => {
  if (image.url && svgPattern.test(image.url)) return true
  if (image.mimeType && (svgPattern.test(image.mimeType) || svgMimePattern.test(image.mimeType)))
    return true
  return false
}

const getImageURL = ({
  image,
  imageURL,
}: {
  image?: Media | Config['db']['defaultIDType'] | null
  imageURL?: unknown
}): { url: string; dimensions?: { width: number; height: number } } | null => {
  const serverUrl = getServerSideURL()
  const explicitImageURL = getAbsoluteMetaImageURL(imageURL, serverUrl)

  if (explicitImageURL && !svgPattern.test(explicitImageURL) && !svgMimePattern.test(explicitImageURL)) {
    return { url: explicitImageURL }
  }

  if (image && typeof image === 'object' && 'url' in image && !isSvgImage(image)) {
    const ogUrl = image.sizes?.og?.url
    const url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url

    const width = image.sizes?.og?.width ?? image.width
    const height = image.sizes?.og?.height ?? image.height

    let dimensions: { width: number; height: number } | undefined
    if (typeof width === 'number' && typeof height === 'number') {
      dimensions = { width, height }
    }

    return { url, dimensions }
  }

  return null
}

const getCanonicalPath = (slug: unknown): string => {
  if (slug === 'home' || slug === null || slug === undefined) return '/'

  if (typeof slug === 'string') {
    const trimmed = slug.trim().replace(/^\/+|\/+$/g, '')
    if (!trimmed) return '/'
    return `/${trimmed}`
  }

  if (Array.isArray(slug)) {
    const joined = slug
      .filter((part) => typeof part === 'string' && part.trim())
      .map((part) => (part as string).replace(/^\/+|\/+$/g, ''))
      .filter((part) => part.length > 0)
      .join('/')
    if (!joined) return '/'
    return `/${joined}`
  }

  return '/'
}

const stripTrailingHostLink = (value: string): string => {
  let result = value
  while (/\s*\|\s*HostLink\s*$/i.test(result)) {
    result = result.replace(/\s*\|\s*HostLink\s*$/i, '').trimEnd()
  }
  return result
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<LandingPage> | null
}): Promise<Metadata> => {
  const { doc } = args

  const rawTitle = doc?.meta?.title?.trim() ?? ''
  const sanitizedTitle = rawTitle ? stripTrailingHostLink(rawTitle) : ''
  const title = sanitizedTitle ? `${sanitizedTitle} | HostLink` : 'HostLink'

  const ogImage = getImageURL({
    image: doc?.meta?.image,
    imageURL: doc?.meta?.imageURL,
  })

  const canonical = getCanonicalPath(doc?.slug)

  const images: NonNullable<Metadata['openGraph']>['images'] = ogImage
    ? [
        {
          url: ogImage.url,
          width: ogImage.dimensions?.width,
          height: ogImage.dimensions?.height,
        },
      ]
    : undefined

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images,
      title,
      url: canonical,
    }),
    alternates: {
      canonical,
    },
    title,
  }
}
