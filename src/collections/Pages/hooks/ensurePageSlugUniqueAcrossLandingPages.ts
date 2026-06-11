import type { Page } from '@/payload-types'

import { ensureSlugUniqueAcrossCollections } from '@/hooks/ensureSlugUnique'

export const ensurePageSlugUniqueAcrossLandingPages = ensureSlugUniqueAcrossCollections<Page>({
  collectionSlug: 'pages',
  otherCollectionSlug: 'landing-pages',
  errorMessage: 'Slug "{slug}" is already used by a landing page.',
})
