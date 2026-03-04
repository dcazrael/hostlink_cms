import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const FormRateLimits: CollectionConfig<'form-rate-limits'> = {
  slug: 'form-rate-limits',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'System',
    defaultColumns: ['key', 'window', 'count', 'blockedUntil', 'updatedAt'],
    useAsTitle: 'key',
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'ipHash',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'window',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Minute',
          value: 'minute',
        },
        {
          label: 'Hour',
          value: 'hour',
        },
      ],
    },
    {
      name: 'windowStart',
      type: 'date',
      required: true,
    },
    {
      name: 'count',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'blockedUntil',
      type: 'date',
    },
  ],
}
