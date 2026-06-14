import type { Block } from 'payload'

import { manualAnchorField } from '@/fields/pageAnchor'

export const GridBlock: Block = {
  slug: 'grid',
  interfaceName: 'GridComponentBlock',
  fields: [
    manualAnchorField(),
    {
      name: 'columns',
      type: 'select',
      required: true,
      defaultValue: '3',
      options: [
        {
          label: '2 Columns',
          value: '2',
        },
        {
          label: '3 Columns',
          value: '3',
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 12,
      admin: {
        initCollapsed: true,
      },
      labels: {
        singular: 'Grid Item',
        plural: 'Grid Items',
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
          name: 'sub',
          type: 'textarea',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
}
