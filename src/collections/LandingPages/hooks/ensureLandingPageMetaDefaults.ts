import type { CollectionBeforeValidateHook } from 'payload'

import type { LandingPage } from '@/payload-types'

const normalizeText = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

export const ensureLandingPageMetaDefaults: CollectionBeforeValidateHook<LandingPage> = async ({
  data,
  originalDoc,
}) => {
  if (!data) return data

  const title = normalizeText(data.title) || normalizeText(originalDoc?.title)
  if (!title) return data

  const nextMeta =
    data.meta && typeof data.meta === 'object' ? { ...(data.meta as Record<string, unknown>) } : {}
  const incomingMetaTitle = normalizeText((nextMeta as { title?: unknown }).title)
  const existingMetaTitle = normalizeText(originalDoc?.meta?.title)

  if (!incomingMetaTitle && !existingMetaTitle) {
    nextMeta.title = title
    return {
      ...data,
      meta: nextMeta,
    }
  }

  return data
}
