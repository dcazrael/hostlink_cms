import type { Page } from '../../../payload-types'

import { createRevalidateHooks } from '../../../hooks/revalidatePath'

const { revalidate, revalidateDelete } = createRevalidateHooks<Page>('page')

export const revalidatePage = revalidate
export { revalidateDelete }
