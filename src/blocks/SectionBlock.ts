import type { Block } from 'payload'

import { CompanyBlock } from '@/blocks/CompanyBlock'
import { ContactBlock } from '@/blocks/ContactBlock'
import { FaqBlock } from '@/blocks/FaqBlock'
import { FlowBlock } from '@/blocks/FlowBlock'
import { GridBlock } from '@/blocks/GridBlock/config'
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
      type: 'textarea',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
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
      type: 'row',
      fields: [
        {
          name: 'disclaimer',
          type: 'group',
          admin: {
            width: '33%',
          },
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
          name: 'readMoreLink',
          type: 'group',
          admin: {
            description: 'Optional internal page or post shown as a read-more button.',
            hideGutter: true,
            width: '33%',
          },
          fields: [
            {
              name: 'target',
              type: 'relationship',
              relationTo: ['pages', 'posts'],
            },
          ],
        },
        {
          type: 'group',
          admin: {
            width: '34%',
          },
          fields: [
            {
              name: 'showInProgress',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'progressLabel',
              type: 'text',
            },
          ],
        },
      ],
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
        GridBlock,
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
