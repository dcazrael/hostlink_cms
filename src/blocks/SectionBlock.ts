import type { Block } from 'payload'

import { CompanyBlock } from '@/blocks/CompanyBlock'
import { ContactBlock } from '@/blocks/ContactBlock'
import { FaqBlock } from '@/blocks/FaqBlock'
import { FlowBlock } from '@/blocks/FlowBlock'
import { PricingBlock } from '@/blocks/PricingBlock'
import { ProblemsBlock } from '@/blocks/ProblemsBlock'
import { ServicesBlock } from '@/blocks/ServicesBlock'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock'

export const SectionBlock: Block = {
  slug: 'section',
  interfaceName: 'HomepageSectionBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'text',
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Subtle',
          value: 'subtle',
        },
      ],
    },
    {
      name: 'disclaimer',
      type: 'group',
      fields: [
        {
          name: 'icon',
          type: 'relationship',
          relationTo: 'icons',
          filterOptions: {
            isEnabled: {
              equals: true,
            },
          },
        },
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'showInProgress',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'progressLabel',
      type: 'text',
    },
    {
      name: 'component',
      type: 'blocks',
      minRows: 1,
      maxRows: 1,
      admin: {
        initCollapsed: true,
      },
      blocks: [
        ProblemsBlock,
        ServicesBlock,
        FlowBlock,
        PricingBlock,
        FaqBlock,
        TestimonialsBlock,
        CompanyBlock,
        ContactBlock,
      ],
    },
  ],
}
