import type { Metadata } from 'next'

import type { Config, LandingPage, Media, Page, Post } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getAbsoluteMetaImageURL = (imageURL: unknown, serverURL: string): string | null => {
  if (typeof imageURL !== 'string') return null

  const trimmed = imageURL.trim()
  if (!trimmed) return null

  if (/^https?:\/\//i.test(trimmed)) return trimmed

  if (trimmed.startsWith('/')) return `${serverURL}${trimmed}`

  return null
}

const getImageURL = ({
  image,
  imageURL,
}: {
  image?: Media | Config['db']['defaultIDType'] | null
  imageURL?: unknown
}) => {
  const serverUrl = getServerSideURL()
  const explicitImageURL = getAbsoluteMetaImageURL(imageURL, serverUrl)

  if (explicitImageURL) return explicitImageURL

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<LandingPage> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL({
    image: doc?.meta?.image,
    imageURL: doc?.meta?.imageURL,
  })

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Payload Website Template'
    : 'Payload Website Template'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
