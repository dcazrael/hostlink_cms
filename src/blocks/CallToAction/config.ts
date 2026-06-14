import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'
import { richTextField } from '../../fields/richTextField'
import { manualAnchorField } from '@/fields/pageAnchor'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    manualAnchorField(),
    richTextField,
    linkGroup({
      appearances: ['default', 'outline'],
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
