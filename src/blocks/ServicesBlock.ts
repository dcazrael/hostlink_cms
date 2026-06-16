import type { Block } from 'payload'

import { manualAnchorField } from '@/fields/pageAnchor'

export const ServicesBlock: Block = {
  slug: 'services',
  interfaceName: 'ServicesComponentBlock',
  fields: [
    manualAnchorField(),
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 12,
      admin: {
        initCollapsed: true,
      },
      labels: {
        singular: 'Service',
        plural: 'Services',
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
          name: 'title',
          type: 'textarea',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
