import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { ensureLandingPageMetaDefaults } from './hooks/ensureLandingPageMetaDefaults'
import { ensureLandingPageSlugUniqueAcrossPages } from './hooks/ensureLandingPageSlugUniqueAcrossPages'
import { revalidateLandingPage, revalidateLandingPageDelete } from './hooks/revalidateLandingPage'

export const LandingPages: CollectionConfig<'landing-pages'> = {
  slug: 'landing-pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    group: 'Marketing',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'landing-pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'landing-pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'sections',
      type: 'relationship',
      relationTo: 'landing-sections',
      hasMany: true,
      admin: {
        description: 'Legacy section relationship field. Replaced by Section Items.',
        hidden: true,
      },
    },
    {
      name: 'sectionItems',
      type: 'array',
      labels: {
        singular: 'Section Item',
        plural: 'Section Items',
      },
      admin: {
        description: 'Drag and drop to reorder rendered section order.',
        initCollapsed: false,
        components: {
          RowLabel: '@/collections/LandingPages/SectionItemRowLabel#SectionItemRowLabel',
        },
      },
      fields: [
        {
          name: 'section',
          type: 'relationship',
          relationTo: 'landing-sections',
          required: true,
        },
      ],
    },
    {
      name: 'meta',
      label: 'SEO',
      type: 'group',
      fields: [
        OverviewField({
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
          imagePath: 'meta.image',
        }),
        MetaTitleField({
          hasGenerateFn: false,
        }),
        MetaImageField({
          relationTo: 'media',
        }),

        MetaDescriptionField({}),
        PreviewField({
          hasGenerateFn: false,
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
        }),
      ],
    },
    slugField(),
  ],
  hooks: {
    beforeValidate: [ensureLandingPageMetaDefaults, ensureLandingPageSlugUniqueAcrossPages],
    afterChange: [revalidateLandingPage],
    afterDelete: [revalidateLandingPageDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
