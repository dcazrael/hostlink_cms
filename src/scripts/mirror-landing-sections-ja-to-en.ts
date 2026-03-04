import config from '@payload-config'
import { getPayload } from 'payload'

import { DEFAULT_LOCALE } from '@/i18n/config'

const TARGET_LOCALE = 'en' as const

const run = async () => {
  const payload = await getPayload({ config })
  payload.logger.info('[mirror-landing-sections-ja-to-en] Starting...')

  const source = await payload.find({
    collection: 'landing-sections',
    draft: true,
    depth: 2,
    fallbackLocale: false,
    limit: 1000,
    locale: DEFAULT_LOCALE,
    pagination: false,
  })

  let mirrored = 0
  let skipped = 0

  for (const section of source.docs) {
    if (!Array.isArray(section.content) || section.content.length === 0) {
      skipped += 1
      continue
    }

    await payload.update({
      collection: 'landing-sections',
      id: section.id,
      context: {
        disableRevalidate: true,
      },
      data: {
        content: section.content,
      },
      draft: true,
      fallbackLocale: false,
      locale: TARGET_LOCALE,
    })

    mirrored += 1
  }

  payload.logger.info(
    `[mirror-landing-sections-ja-to-en] Complete. mirrored=${mirrored}, skipped=${skipped}`,
  )
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
