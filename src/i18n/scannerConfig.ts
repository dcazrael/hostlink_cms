import path from 'path'

import { DEFAULT_LOCALE, type AppLocale } from '@/i18n/config'

export const SCANNER_SOURCE_LOCALE: AppLocale = 'en'
export const SCANNER_MIRROR_TO_DEFAULT_LOCALE = true

export const SCANNER_INCLUDE_ROOTS = [
  'src/app/(frontend)',
  'src/components/homepage',
  'src/components/CollectionArchive',
  'src/components/Link',
  'src/components/LocalizedLink.tsx',
  'src/components/Logo',
  'src/components/Media',
  'src/components/PageRange',
  'src/components/Pagination',
  'src/components/PayloadRedirects',
  'src/components/RichText',
  'src/Header/Component.tsx',
  'src/Header/Component.client.tsx',
  'src/Header/Nav',
  'src/Footer/Component.tsx',
]

export const SCANNER_EXCLUDE_SUBSTRINGS = [
  '/__tests__/',
  '.test.',
  '.spec.',
  '/app/(payload)/',
  '/components/admin/',
  '/components/AdminBar/',
  '/components/BeforeDashboard/',
  '/components/BeforeLogin/',
  '/collections/',
  '/fields/',
  '/hooks/',
  '/i18n/',
  '/scripts/',
  '/plugins/',
  '/providers/',
  '/search/',
  '/blocks/Form/',
  '/payload-types.ts',
  '/payload.config.ts',
]

export const SCANNER_VISIBLE_PROPS = new Set([
  'title',
  'placeholder',
  'aria-label',
  'aria-description',
  'alt',
  'label',
])

export const SCANNER_REPORT_PATH = path.join('docs', 'i18n', 'hardcoded-report.json')
export const SCANNER_DEFAULT_CI_THRESHOLD = 0
export const SCANNER_DEFAULT_LOCALE: AppLocale = DEFAULT_LOCALE
