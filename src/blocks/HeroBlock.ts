import type { Block } from 'payload'

import { homepageLink } from '@/fields/link'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HomepageHeroBlock',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'sub',
      type: 'textarea',
      required: true,
    },
    {
      name: 'highlights',
      type: 'array',
      maxRows: 6,
      admin: {
        initCollapsed: true,
      },
      labels: {
        singular: 'Highlight',
        plural: 'Highlights',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        homepageLink({
          name: 'primaryCTA',
          label: 'Primary CTA',
          required: true,
          overrides: {
            admin: {
              width: '50%',
            },
          },
        }),
        homepageLink({
          name: 'secondaryCTA',
          label: 'Secondary CTA',
          overrides: {
            admin: {
              width: '50%',
            },
          },
        }),
      ],
    },
    {
      name: 'rightVisual',
      type: 'radio',
      defaultValue: 'chat',
      options: [
        {
          label: 'Chat',
          value: 'chat',
        },
        {
          label: 'Image',
          value: 'image',
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.rightVisual === 'image',
      },
      validate: (
        value: unknown,
        { siblingData }: { siblingData?: { rightVisual?: 'chat' | 'image' } },
      ) => {
        if (siblingData?.rightVisual === 'image' && !value) {
          return 'An image is required when right visual is set to image.'
        }

        return true
      },
    },
  ],
}
