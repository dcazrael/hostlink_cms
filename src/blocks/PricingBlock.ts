import type { Block } from 'payload'

import { homepageLink } from '@/fields/link'

export const PricingBlock: Block = {
  slug: 'pricing',
  interfaceName: 'PricingComponentBlock',
  fields: [
    {
      name: 'planName',
      type: 'text',
      required: true,
    },
    {
      name: 'planSub',
      type: 'text',
    },
    {
      name: 'recommended',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'priceDisclaimer',
      type: 'textarea',
    },
    {
      name: 'contents',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 12,
      admin: {
        initCollapsed: true,
      },
      labels: {
        singular: 'Included item',
        plural: 'Included items',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    homepageLink({
      name: 'cta',
      label: 'CTA',
    }),
  ],
}
