import React from 'react'

import { LocalizedLink } from '@/components/LocalizedLink'
import { Button } from '@/components/ui/button'
import { createTranslator } from '@/i18n/createTranslator'
import { getActiveLocale } from '@/i18n/getActiveLocale'

export default async function NotFound() {
  const locale = await getActiveLocale()
  const t = await createTranslator(locale)

  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">{t('shared.notfound.description', 'This page could not be found.')}</p>
      </div>
      <Button asChild variant="default">
        <LocalizedLink href="/">{t('shared.notfound.gohome', 'Go home')}</LocalizedLink>
      </Button>
    </div>
  )
}
