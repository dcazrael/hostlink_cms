import type { Block } from 'payload'

export const FlowBlock: Block = {
  slug: 'flow',
  interfaceName: 'FlowComponentBlock',
  fields: [
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 6,
      admin: {
        initCollapsed: true,
      },
      labels: {
        singular: 'Step',
        plural: 'Steps',
      },
      fields: [
        {
          name: 'step',
          type: 'number',
          required: true,
          min: 1,
          max: 9,
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
