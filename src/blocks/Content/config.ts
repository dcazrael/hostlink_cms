import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { FaqBlock } from '@/blocks/FaqBlock'
import { GridBlock } from '@/blocks/GridBlock/config'
import { link } from '@/fields/link'
import { manualAnchorField } from '@/fields/pageAnchor'

const hasShowTableOfContentsEnabled = (data: unknown): boolean => {
  if (!data || typeof data !== 'object') return false

  return (data as { showTableOfContents?: unknown }).showTableOfContents === true
}

export const columnFields: Field[] = [
  {
    name: 'tocTitle',
    type: 'text',
    label: 'ToC Title',
    required: true,
    admin: {
      condition: (data) => hasShowTableOfContentsEnabled(data),
      description:
        'Title shown in the page Table of Contents. Required when the page has Show Table of Contents enabled.',
    },
  },
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        label: 'One Third',
        value: 'oneThird',
      },
      {
        label: 'Half',
        value: 'half',
      },
      {
        label: 'Two Thirds',
        value: 'twoThirds',
      },
      {
        label: 'Full',
        value: 'full',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ]
      },
    }),
    label: false,
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => {
          return Boolean(siblingData?.enableLink)
        },
      },
    },
  }),
  {
    name: 'divider',
    type: 'checkbox',
    admin: {
      description: 'Show a divider after this column',
    },
  },
  {
    name: 'embeddedComponent',
    type: 'blocks',
    maxRows: 1,
    admin: {
      description: 'Embed a component after the rich text',
    },
    blocks: [GridBlock, FaqBlock],
  },
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    manualAnchorField(),
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
  ],
}
