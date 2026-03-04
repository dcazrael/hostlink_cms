import { type AppLocale } from './config'
import { getDictionary } from './getDictionary'

export type TranslateFn = (key: string, fallback?: string) => string

export const createTranslator = async (locale: AppLocale): Promise<TranslateFn> => {
  const dictionary = await getDictionary(locale)

  return (key, fallback) => {
    const value = dictionary[key]
    if (typeof value === 'string' && value.length > 0) return value

    if (typeof fallback === 'string' && fallback.length > 0) return fallback

    return key
  }
}

