import type { Block } from 'payload'

import { homepageLink } from '@/fields/link'

const pricingStylePresetFieldOptions = [
  { label: '🟢 Style 1 - Emerald', value: 'style1' },
  { label: '🔵 Style 2 - Blue', value: 'style2' },
  { label: '🟡 Style 3 - Amber', value: 'style3' },
  { label: '🟣 Style 4 - Violet', value: 'style4' },
  { label: '🟠 Style 5 - Orange', value: 'style5' },
]

export const PricingBlock: Block = {
  slug: 'pricing',
  interfaceName: 'PricingComponentBlock',
  fields: [
    {
      name: 'plans',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/Pricing/PlanRowLabel#PlanRowLabel',
        },
      },
      labels: {
        singular: 'Plan',
        plural: 'Plans',
      },
      fields: [
        {
          type: 'tabs',
          tabs: [
            {
              label: 'Overview',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'planName',
                      type: 'text',
                      required: true,
                      admin: {
                        width: '70%',
                      },
                    },
                    {
                      name: 'recommended',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        style: {
                          alignSelf: 'flex-end',
                        },
                        width: '30%',
                      },
                    },
                  ],
                },
                {
                  name: 'planSub',
                  type: 'text',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'price',
                      type: 'number',
                      required: true,
                      admin: {
                        width: '35%',
                      },
                    },
                    {
                      name: 'priceDisclaimer',
                      type: 'textarea',
                      admin: {
                        width: '65%',
                      },
                    },
                  ],
                },
                {
                  name: 'stylePreset',
                  type: 'select',
                  defaultValue: 'style1',
                  options: pricingStylePresetFieldOptions,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              label: 'Includes',
              fields: [
                {
                  name: 'contents',
                  type: 'array',
                  required: true,
                  minRows: 1,
                  maxRows: 12,
                  admin: {
                    initCollapsed: true,
                    components: {
                      RowLabel: '@/blocks/Pricing/IncludedItemRowLabel#IncludedItemRowLabel',
                    },
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
                    {
                      name: 'tooltip',
                      type: 'textarea',
                    },
                  ],
                },
              ],
            },
            {
              label: 'CTA',
              fields: [
                homepageLink({
                  name: 'cta',
                  label: 'CTA',
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
}
