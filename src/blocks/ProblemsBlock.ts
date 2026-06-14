import type { Block } from 'payload'

export const ProblemsBlock: Block = {
  slug: 'problems',
  interfaceName: 'ProblemsComponentBlock',
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
      labels: {
        singular: 'Problem',
        plural: 'Problems',
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
          required: true,
        },
      ],
    },
  ],
}
