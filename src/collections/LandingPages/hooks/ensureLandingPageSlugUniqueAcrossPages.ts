import type { LandingPage } from '@/payload-types'

import { ensureSlugUniqueAcrossCollections } from '@/hooks/ensureSlugUnique'

export const ensureLandingPageSlugUniqueAcrossPages =
  ensureSlugUniqueAcrossCollections<LandingPage>({
    collectionSlug: 'landing-pages',
    otherCollectionSlug: 'pages',
    errorMessage: 'Slug "{slug}" is already used by a page.',
  })
