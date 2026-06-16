import type { Block } from 'payload'

import { manualAnchorField } from '@/fields/pageAnchor'

export const CompanyBlock: Block = {
  slug: 'company',
  interfaceName: 'CompanyComponentBlock',
  fields: [
    manualAnchorField(),
    {
      name: 'companyName',
      type: 'text',
    },
    {
      name: 'ceo',
      type: 'text',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'contact',
      type: 'text',
    },
    {
      name: 'services',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      labels: {
        singular: 'Service line',
        plural: 'Service lines',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
