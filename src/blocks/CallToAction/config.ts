import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'
import { richTextField } from '../../fields/richTextField'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    richTextField,
    linkGroup({
      appearances: ['default', 'outline'],
      enablePageAnchor: true,
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
