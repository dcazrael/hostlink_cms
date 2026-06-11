import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { HeroBlock } from '@/blocks/HeroBlock'
import { SectionBlock } from '@/blocks/SectionBlock'
import { GridBlock } from '@/blocks/GridBlock/config'
import { ProblemsBlock } from '@/blocks/ProblemsBlock'
import { ServicesBlock } from '@/blocks/ServicesBlock'
import { FlowBlock } from '@/blocks/FlowBlock'
import { PricingBlock } from '@/blocks/PricingBlock'
import { FaqBlock } from '@/blocks/FaqBlock'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock'
import { CompanyBlock } from '@/blocks/CompanyBlock'
import { ContactBlock } from '@/blocks/ContactBlock'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { populateTableOfContents } from '../../hooks/populateTableOfContents'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { seoFields } from '@/fields/seoFields'
import { ensurePageSlugUniqueAcrossLandingPages } from './hooks/ensurePageSlugUniqueAcrossLandingPages'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    group: 'Content',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'textarea',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                HeroBlock,
                SectionBlock,
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                ProblemsBlock,
                ServicesBlock,
                GridBlock,
                FlowBlock,
                PricingBlock,
                FaqBlock,
                TestimonialsBlock,
                CompanyBlock,
                ContactBlock,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        seoFields,
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showTableOfContents',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show a table of contents on the side of this page',
      },
    },
    {
      name: 'tableOfContentsHeadings',
      type: 'array',
      admin: {
        hidden: true,
        disabled: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    beforeValidate: [ensurePageSlugUniqueAcrossLandingPages],
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt, populateTableOfContents],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 800,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
