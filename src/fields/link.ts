import type { Field, GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'

export type LinkAppearances = 'default' | 'outline'

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  default: {
    label: 'Default',
    value: 'default',
  },
  outline: {
    label: 'Outline',
    value: 'outline',
  },
}

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  enableHomepageAnchor?: boolean
  overrides?: Partial<GroupField>
}) => Field

export const link: LinkType = ({
  appearances,
  disableLabel = false,
  enableHomepageAnchor = false,
  overrides = {},
} = {}) => {
  const linkTypeOptions: Array<{ label: string; value: string }> = [
    {
      label: 'Internal link',
      value: 'reference',
    },
    {
      label: 'Custom URL',
      value: 'custom',
    },
  ]

  if (enableHomepageAnchor) {
    linkTypeOptions.push({
      label: 'Homepage anchor',
      value: 'homepageAnchor',
    })
  }

  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: linkTypeOptions,
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      relationTo: ['pages', 'posts'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
    },
  ]

  if (enableHomepageAnchor) {
    linkTypes.push({
      name: 'homepageAnchor',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'homepageAnchor',
        components: {
          Field: '@/fields/components/HomepageAnchorSelect#HomepageAnchorSelect',
        },
      },
      label: 'Homepage section anchor',
      required: true,
    })
  }

  if (!disableLabel) {
    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [appearanceOptions.default, appearanceOptions.outline]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}

type HomepageLinkFieldType = (options?: {
  compactDbNames?: boolean
  name?: string
  label?: string
  required?: boolean
  overrides?: Partial<GroupField>
}) => Field

type HomepageLinkSiblingData = {
  anchor?: string | null
  label?: string | null
  page?: unknown
  type?: 'anchor' | 'internal' | 'external'
  url?: string | null
}

const hasOptionalHomepageLinkContent = (siblingData?: HomepageLinkSiblingData): boolean => {
  if (!siblingData) return false

  const hasLabel = typeof siblingData.label === 'string' && siblingData.label.trim().length > 0
  const hasAnchor = typeof siblingData.anchor === 'string' && siblingData.anchor.trim().length > 0
  const hasURL = typeof siblingData.url === 'string' && siblingData.url.trim().length > 0
  const hasPage = Boolean(siblingData.page)

  return hasLabel || hasAnchor || hasURL || hasPage
}

export const homepageLink: HomepageLinkFieldType = ({
  compactDbNames = false,
  name = 'link',
  label = 'Link',
  required = false,
  overrides = {},
} = {}) => {
  const dbNameMap = compactDbNames
    ? {
        anchor: 'a',
        icon: 'i',
        label: 'l',
        page: 'p',
        type: 't',
        url: 'u',
        variant: 'v',
        withIcon: 'wi',
      }
    : null

  const homepageLinkField: GroupField = {
    name,
    type: 'group',
    label,
    required,
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'label',
            type: 'text',
            ...(dbNameMap ? { dbName: dbNameMap.label } : {}),
            required,
            admin: {
              width: '50%',
            },
            validate: (value: unknown, { siblingData }: { siblingData?: HomepageLinkSiblingData }) => {
              if (!required && !hasOptionalHomepageLinkContent(siblingData)) return true

              if (typeof value === 'string' && value.trim().length > 0) return true

              return 'Label is required.'
            },
          },
          {
            name: 'variant',
            type: 'select',
            ...(dbNameMap ? { dbName: dbNameMap.variant } : {}),
            admin: {
              width: '30%',
            },
            ...(required ? { defaultValue: 'primary' } : {}),
            options: [
              { label: 'Primary', value: 'primary' },
              { label: 'Secondary', value: 'secondary' },
              { label: 'Outline', value: 'outline' },
              { label: 'Ghost', value: 'ghost' },
            ],
          },
          {
            name: 'withIcon',
            type: 'checkbox',
            ...(dbNameMap ? { dbName: dbNameMap.withIcon } : {}),
            defaultValue: false,
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '20%',
            },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            name: 'icon',
            type: 'select',
            ...(dbNameMap ? { dbName: dbNameMap.icon } : {}),
            admin: {
              width: '30%',
              condition: (_, siblingData) => Boolean(siblingData?.withIcon),
            },
            options: [
              { label: 'Arrow Right', value: 'arrowRight' },
              { label: 'Mail', value: 'mail' },
              { label: 'Phone', value: 'phone' },
            ],
          },
          {
            name: 'type',
            type: 'radio',
            ...(dbNameMap ? { dbName: dbNameMap.type } : {}),
            admin: {
              layout: 'horizontal',
              width: '70%',
            },
            ...(required ? { defaultValue: 'internal' } : {}),
            required,
            options: [
              { label: 'Anchor', value: 'anchor' },
              { label: 'Internal', value: 'internal' },
              { label: 'External', value: 'external' },
            ],
            validate: (value: unknown, { siblingData }: { siblingData?: HomepageLinkSiblingData }) => {
              if (!required && !hasOptionalHomepageLinkContent(siblingData)) return true

              if (value === 'anchor' || value === 'internal' || value === 'external') return true

              return 'Select link type.'
            },
          },
        ],
      },
      {
        name: 'anchor',
        type: 'text',
        ...(dbNameMap ? { dbName: dbNameMap.anchor } : {}),
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'anchor',
          components: {
            Field: '@/fields/components/CurrentPageAnchorSelect#CurrentPageAnchorSelect',
          },
        },
        validate: (
          value: unknown,
          { siblingData }: { siblingData?: HomepageLinkSiblingData },
        ) => {
          if (!required && !hasOptionalHomepageLinkContent(siblingData)) return true

          if (siblingData?.type === 'anchor') {
            if (typeof value === 'string' && value.trim().length > 0) return true
            return 'Select a section anchor.'
          }

          return true
        },
      },
      {
        name: 'page',
        type: 'relationship',
        ...(dbNameMap ? { dbName: dbNameMap.page } : {}),
        relationTo: ['pages', 'landing-pages'],
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'internal',
        },
        validate: (
          value: unknown,
          { siblingData }: { siblingData?: HomepageLinkSiblingData },
        ) => {
          if (!required && !hasOptionalHomepageLinkContent(siblingData)) return true

          if (siblingData?.type === 'internal' && !value) {
            return 'Select a page for internal links.'
          }

          return true
        },
      },
      {
        name: 'url',
        type: 'text',
        ...(dbNameMap ? { dbName: dbNameMap.url } : {}),
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'external',
        },
        validate: (
          value: unknown,
          { siblingData }: { siblingData?: HomepageLinkSiblingData },
        ) => {
          if (!required && !hasOptionalHomepageLinkContent(siblingData)) return true

          if (siblingData?.type === 'external' && !value) {
            return 'Enter a URL for external links.'
          }

          return true
        },
      },
    ],
  }

  return deepMerge(homepageLinkField, overrides)
}
