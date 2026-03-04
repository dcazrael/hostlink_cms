import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { SUPPORTED_LOCALES } from '@/i18n/config'
import { normalizeAndValidateUICopyKey } from './hooks/normalizeAndValidateUICopyKey'
import {
  revalidateUICopyDictionary,
  revalidateUICopyDictionaryDelete,
} from './hooks/revalidateUICopyDictionary'

export const UICopyKeys: CollectionConfig = {
  slug: 'ui-copy-keys',
  labels: {
    plural: 'Frontend Copy',
    singular: 'Frontend Copy Entry',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Marketing',
    components: {
      afterList: ['@/components/admin/frontend-copy/FrontendCopyWorkbench'],
      edit: {
        beforeDocumentControls: [
          '@/components/admin/frontend-copy/FrontendCopyGroupNavigator#FrontendCopyGroupNavigator',
        ],
      },
    },
    defaultColumns: ['key', 'group', 'isActive', 'updatedAt'],
    listSearchableFields: ['key', 'group'],
    useAsTitle: 'key',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: {
            description: 'Dot-case key, e.g. homepage.hero.chat.title',
            width: '65%',
          },
        },
        {
          name: 'group',
          type: 'text',
          required: true,
          index: true,
          admin: {
            description: 'Where this key appears, e.g. homepage.hero',
            width: '35%',
          },
        },
      ],
    },
    {
      name: 'usedIn',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Optional manual usage hints (component/screen names).',
        placeholder: 'HeroSection',
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional context for translators.',
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'translations',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Localized values for this key.',
        initCollapsed: false,
      },
      labels: {
        singular: 'Translation',
        plural: 'Translations',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'locale',
              type: 'select',
              required: true,
              admin: {
                width: '30%',
              },
              options: SUPPORTED_LOCALES.map((locale) => ({
                label: locale.toUpperCase(),
                value: locale,
              })),
            },
            {
              name: 'value',
              type: 'textarea',
              required: true,
              admin: {
                width: '70%',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [normalizeAndValidateUICopyKey],
    afterChange: [revalidateUICopyDictionary],
    afterDelete: [revalidateUICopyDictionaryDelete],
  },
}
