import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Marketing',
  },
  fields: [
    {
      name: 'showLoginCTA',
      type: 'checkbox',
      label: 'Show Login CTA',
      defaultValue: true,
    },
    link({
      appearances: false,
      enableHomepageAnchor: true,
      overrides: {
        name: 'loginCTA',
        label: 'Login CTA',
        admin: {
          condition: (_, siblingData) => siblingData?.showLoginCTA !== false,
        },
      },
    }),
    {
      name: 'showConsultationCTA',
      type: 'checkbox',
      label: 'Show Consultation CTA',
      defaultValue: true,
    },
    link({
      appearances: false,
      enableHomepageAnchor: true,
      overrides: {
        name: 'consultationCTA',
        label: 'Consultation CTA',
        admin: {
          condition: (_, siblingData) => siblingData?.showConsultationCTA !== false,
        },
      },
    }),
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
          enableHomepageAnchor: true,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
