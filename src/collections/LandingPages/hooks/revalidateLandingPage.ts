import type { LandingPage } from '@/payload-types'

import { createRevalidateHooks } from '@/hooks/revalidatePath'

const { revalidate, revalidateDelete } = createRevalidateHooks<LandingPage>('landing page')

export const revalidateLandingPage = revalidate
export { revalidateDelete as revalidateLandingPageDelete }
