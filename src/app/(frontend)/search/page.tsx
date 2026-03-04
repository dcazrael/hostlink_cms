import type { Metadata } from 'next/types'

import { CardPostData } from '@/components/Card'
import { CollectionArchive } from '@/components/CollectionArchive'
import { createTranslator } from '@/i18n/createTranslator'
import { getActiveLocale } from '@/i18n/getActiveLocale'
import { Search } from '@/search/Component'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import PageClient from './page.client'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const locale = await getActiveLocale()
  const t = await createTranslator(locale)
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">{t('shared.search.title', 'Search')}</h1>

          <div className="max-w-200 mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as CardPostData[]} />
      ) : (
        <div className="container">{t('shared.search.noresults', 'No results found.')}</div>
      )}
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getActiveLocale()
  const t = await createTranslator(locale)

  return {
    title: t('shared.search.metatitle', 'HostLink Search'),
  }
}
