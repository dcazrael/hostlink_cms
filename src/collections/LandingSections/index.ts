import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { HeroBlock } from '@/blocks/HeroBlock'
import { SectionBlock } from '@/blocks/SectionBlock'
import { ensureLandingSectionTitle } from './hooks/ensureLandingSectionTitle'
import {
  revalidateLinkedLandingPagesAfterSectionChange,
  revalidateLinkedLandingPagesAfterSectionDelete,
} from './hooks/revalidateLinkedLandingPages'

export const LandingSections: CollectionConfig<'landing-sections'> = {
  slug: 'landing-sections',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Marketing',
    defaultColumns: ['title', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'blocks',
      localized: true,
      required: true,
      minRows: 1,
      maxRows: 1,
      admin: {
        description: 'Localized field. If EN appears empty, switch admin locale to JA or enable fallback.',
      },
      blocks: [HeroBlock, SectionBlock],
    },
  ],
  hooks: {
    beforeValidate: [ensureLandingSectionTitle],
    afterChange: [revalidateLinkedLandingPagesAfterSectionChange],
    afterDelete: [revalidateLinkedLandingPagesAfterSectionDelete],
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
