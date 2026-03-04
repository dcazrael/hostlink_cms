import type { Block } from 'payload'

import { homepageLink } from '@/fields/link'

export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactComponentBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'footerItems',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      labels: {
        plural: 'Footer Items',
        singular: 'Footer Item',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'kind',
              type: 'select',
              defaultValue: 'text',
              admin: {
                width: '35%',
              },
              options: [
                {
                  label: 'Text',
                  value: 'text',
                },
                {
                  label: 'Link',
                  value: 'link',
                },
                {
                  label: 'Button',
                  value: 'button',
                },
              ],
            },
            {
              name: 'icon',
              type: 'relationship',
              relationTo: 'icons',
              admin: {
                width: '65%',
              },
              filterOptions: {
                isEnabled: {
                  equals: true,
                },
              },
            },
          ],
        },
        {
          name: 'text',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.kind === 'text',
          },
        },
        homepageLink({
          compactDbNames: true,
          name: 'link',
          label: 'Link',
          overrides: {
            admin: {
              condition: (_, siblingData) => siblingData?.kind === 'link' || siblingData?.kind === 'button',
            },
          },
        }),
      ],
    },
  ],
}
