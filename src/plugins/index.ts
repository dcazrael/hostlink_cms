import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import type { Block, Field, Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import {
  beforeChangeStripFormSubmissionAntiSpamMetadata,
  beforeValidateFormSubmissionAntiSpam,
} from './formSubmissionAntiSpamHooks'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const FORM_PLACEHOLDER_BLOCK_SLUGS = new Set(['text', 'email', 'textarea', 'number'])

const fieldHasName = (field: Field, name: string): boolean => {
  if (!field || typeof field !== 'object' || !('name' in field)) return false
  return field.name === name
}

const blockHasPlaceholderField = (block: Block): boolean => {
  if (!Array.isArray(block.fields)) return false

  return block.fields.some((field) => {
    if (fieldHasName(field, 'placeholder')) return true

    if (field.type !== 'row' || !Array.isArray(field.fields)) return false
    return field.fields.some((nestedField) => fieldHasName(nestedField, 'placeholder'))
  })
}

const withPlaceholderField = (block: Block): Block => {
  if (!FORM_PLACEHOLDER_BLOCK_SLUGS.has(block.slug)) return block
  if (!Array.isArray(block.fields)) return block
  if (blockHasPlaceholderField(block)) return block

  const placeholderRow: Field = {
    type: 'row',
    fields: [
      {
        name: 'placeholder',
        type: 'text',
        label: 'Placeholder',
        localized: true,
      },
    ],
  }

  const requiredIndex = block.fields.findIndex((field) => fieldHasName(field, 'required'))
  const nextFields = [...block.fields]
  const insertAt = requiredIndex >= 0 ? requiredIndex : nextFields.length

  nextFields.splice(insertAt, 0, placeholderRow)

  return {
    ...block,
    fields: nextFields,
  }
}

const withSubmitButtonIcon = (fields: Field[]): Field[] => {
  const hasSubmitButtonIcon = fields.some((field) => fieldHasName(field, 'submitButtonIcon'))
  if (hasSubmitButtonIcon) return fields

  const submitButtonIconField: Field = {
    name: 'submitButtonIcon',
    type: 'relationship',
    relationTo: 'icons',
    filterOptions: {
      isEnabled: {
        equals: true,
      },
    },
  }

  const submitLabelIndex = fields.findIndex((field) => fieldHasName(field, 'submitButtonLabel'))

  if (submitLabelIndex < 0) {
    return [...fields, submitButtonIconField]
  }

  const nextFields = [...fields]
  nextFields.splice(submitLabelIndex + 1, 0, submitButtonIconField)
  return nextFields
}

const withEnhancedFormFields = (fields: Field[]): Field[] => {
  const fieldsWithPlaceholders = fields.map((field) => {
    if (!fieldHasName(field, 'fields')) return field
    if (field.type !== 'blocks' || !Array.isArray(field.blocks)) return field

    return {
      ...field,
      blocks: field.blocks.map((block) => withPlaceholderField(block)),
    }
  })

  return withSubmitButtonIcon(fieldsWithPlaceholders)
}

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        const patchedFields = withEnhancedFormFields(defaultFields)

        return patchedFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      hooks: {
        beforeChange: [beforeChangeStripFormSubmissionAntiSpamMetadata],
        beforeValidate: [beforeValidateFormSubmissionAntiSpam],
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
