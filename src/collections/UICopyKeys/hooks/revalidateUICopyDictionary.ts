import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { SUPPORTED_LOCALES } from '@/i18n/config'

const safeRevalidateTag = (tag: string) => {
  try {
    revalidateTag(tag, 'max')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.includes('static generation store missing')) {
      return
    }

    throw error
  }
}

const revalidateDictionaryTags = () => {
  safeRevalidateTag('ui-copy-dictionary')
  for (const locale of SUPPORTED_LOCALES) {
    safeRevalidateTag(`ui-copy-dictionary-${locale}`)
  }
}

export const revalidateUICopyDictionary: CollectionAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateDictionaryTags()
  }

  return doc
}

export const revalidateUICopyDictionaryDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidateDictionaryTags()
  }

  return doc
}
