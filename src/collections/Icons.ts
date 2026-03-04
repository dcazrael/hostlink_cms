import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Icons: CollectionConfig = {
  slug: 'icons',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'System',
    defaultColumns: ['name', 'lucideName', 'isEnabled'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'lucideName',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Messaging', value: 'messaging' },
        { label: 'Alerts', value: 'alerts' },
        { label: 'Time', value: 'time' },
      ],
    },
    {
      name: 'isEnabled',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
