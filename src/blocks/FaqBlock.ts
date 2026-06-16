import type { Block } from 'payload'

import { manualAnchorField } from '@/fields/pageAnchor'

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FaqComponentBlock',
  fields: [
    manualAnchorField(),
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 20,
      admin: {
        initCollapsed: true,
      },
      labels: {
        singular: 'FAQ item',
        plural: 'FAQ items',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
