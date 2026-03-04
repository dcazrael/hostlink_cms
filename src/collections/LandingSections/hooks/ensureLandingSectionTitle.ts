import type { CollectionBeforeValidateHook } from 'payload'

import type { LandingSection } from '@/payload-types'
import { buildLandingSectionTitle } from './buildLandingSectionTitle'

export const ensureLandingSectionTitle: CollectionBeforeValidateHook<LandingSection> = ({
  data,
  originalDoc,
}) => {
  const nextContent = Array.isArray(data?.content) ? data.content : originalDoc?.content
  const firstBlock = nextContent?.[0] || null
  const fallbackTitle = buildLandingSectionTitle(firstBlock)
  const existingTitle = typeof data?.title === 'string' ? data.title.trim() : ''

  return {
    ...data,
    title: existingTitle || fallbackTitle,
  }
}
