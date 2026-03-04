import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { layoutBlocksFromLandingPage } from '@/components/homepage/fromLandingSections'
import { homeStatic } from '@/endpoints/seed/home-static'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHomepageLayout } from '@/blocks/RenderHomepageLayout'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RenderHero } from '@/heros/RenderHero'
import { createTranslator } from '@/i18n/createTranslator'
import { DEFAULT_LOCALE, type AppLocale } from '@/i18n/config'
import { getActiveLocale } from '@/i18n/getActiveLocale'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const [pages, landingPages] = await Promise.all([
    payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    }),
    payload.find({
      collection: 'landing-pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    }),
  ])

  const uniqueSlugs = new Set<string>()

  for (const page of pages.docs) {
    if (page.slug && page.slug !== 'home') uniqueSlugs.add(page.slug)
  }

  for (const page of landingPages.docs) {
    if (page.slug && page.slug !== 'home') uniqueSlugs.add(page.slug)
  }

  const params = [...uniqueSlugs].map((slug) => ({ slug }))

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const locale = await getActiveLocale()
  const url = '/' + decodedSlug
  const landingPage = await queryLandingPageBySlug({
    locale,
    slug: decodedSlug,
  })
  let page: RequiredDataFromCollectionSlug<'pages'> | null = null

  // Remove this code once your website is seeded
  if (!landingPage) {
    page = await queryPageBySlug({
      locale,
      slug: decodedSlug,
    })
  }

  if (!landingPage && !page && slug === 'home') {
    page = homeStatic
  }

  if (!landingPage && !page) {
    return <PayloadRedirects url={url} />
  }

  const landingBlocks = landingPage ? layoutBlocksFromLandingPage(landingPage) : []
  const hasHomepageBlocks =
    landingBlocks.length > 0 ||
    Boolean(
      page?.layout?.some((block) => block.blockType === 'hero' || block.blockType === 'section'),
    )
  const translator = hasHomepageBlocks ? await createTranslator(locale) : null

  return (
    <article className="">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {landingBlocks.length > 0 ? (
        <RenderHomepageLayout blocks={landingBlocks} t={translator!} />
      ) : hasHomepageBlocks && page ? (
        <RenderHomepageLayout blocks={page.layout} t={translator!} />
      ) : page ? (
        <>
          <RenderHero {...page.hero} />
          <RenderBlocks blocks={page.layout} />
        </>
      ) : (
        <PayloadRedirects url={url} />
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const locale = await getActiveLocale()
  const landingPage = await queryLandingPageBySlug({
    locale,
    slug: decodedSlug,
  })

  if (landingPage) {
    return generateMeta({ doc: landingPage })
  }

  const page = await queryPageBySlug({
    locale,
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ locale, slug }: { locale: AppLocale; slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const localeResult = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (localeResult.docs?.[0]) return localeResult.docs[0]

  if (locale !== DEFAULT_LOCALE) {
    const defaultLocaleResult = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      locale: DEFAULT_LOCALE,
      fallbackLocale: DEFAULT_LOCALE,
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    if (defaultLocaleResult.docs?.[0]) return defaultLocaleResult.docs[0]
  }

  const noLocaleResult = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return noLocaleResult.docs?.[0] || null
})

const queryLandingPageBySlug = cache(async ({ locale, slug }: { locale: AppLocale; slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const localeResult = await payload.find({
    collection: 'landing-pages',
    draft,
    depth: 3,
    limit: 1,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (localeResult.docs?.[0]) return localeResult.docs[0]

  if (locale !== DEFAULT_LOCALE) {
    const defaultLocaleResult = await payload.find({
      collection: 'landing-pages',
      draft,
      depth: 3,
      limit: 1,
      locale: DEFAULT_LOCALE,
      fallbackLocale: DEFAULT_LOCALE,
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    if (defaultLocaleResult.docs?.[0]) return defaultLocaleResult.docs[0]
  }

  const noLocaleResult = await payload.find({
    collection: 'landing-pages',
    draft,
    depth: 3,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return noLocaleResult.docs?.[0] || null
})
