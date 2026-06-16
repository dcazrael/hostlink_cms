import type { Block, Field, GroupField, RowField, RelationshipField } from 'payload'
import { cleanup, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { HeroBlock } from '@/blocks/HeroBlock'
import { SectionBlock } from '@/blocks/SectionBlock'
import { SectionWrapper } from '@/components/homepage/SectionWrapper'
import type { SectionLayoutBlock } from '@/components/homepage/types'
import { resolveHomepageLinkHref, resolveReadMoreHref } from '@/components/homepage/utils'
import type { Page, Post } from '@/payload-types'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

afterEach(() => {
  cleanup()
})

const fieldHasNestedFields = (field: Field): field is Field & { fields: Field[] } =>
  'fields' in field && Array.isArray(field.fields)

const fieldHasName = <TName extends string>(
  field: Field,
  name: TName,
): field is Field & { name: TName } => 'name' in field && field.name === name

const blockHasFieldNamed = (block: Block, name: string): boolean => {
  const fieldsContainName = (fields: Field[]): boolean =>
    fields.some(
      (field) =>
        fieldHasName(field, name) ||
        (fieldHasNestedFields(field) && fieldsContainName(field.fields)),
    )

  return fieldsContainName(block.fields)
}

const pageWithSlug = (slug: string): Page => ({ slug }) as Page

const postWithSlug = (slug: string): Post => ({ slug }) as Post

const sectionBlockWithReadMoreTarget = (target: unknown): SectionLayoutBlock =>
  ({
    blockType: 'section',
    heading: 'Services',
    readMoreLink: {
      target,
    },
  }) as SectionLayoutBlock

const getCondensedAdminLayoutRow = (): RowField => {
  const row = SectionBlock.fields.find(
    (field): field is RowField =>
      field.type === 'row' && field.fields.some((child) => fieldHasName(child, 'readMoreLink')),
  )
  if (!row) throw new Error('Condensed admin layout row was not found')
  return row
}

const getCondensedAdminRowField = (name: string): Field => {
  const field = getCondensedAdminLayoutRow().fields.find((candidate) =>
    fieldHasName(candidate, name),
  )
  if (!field) throw new Error(`Condensed admin layout row is missing ${name}`)
  return field
}

const getReadMoreLinkField = (): GroupField => {
  const field = getCondensedAdminRowField('readMoreLink')
  if (field.type !== 'group') throw new Error('SectionBlock.readMoreLink must be a group field')
  return field
}

const getProgressLayoutColumn = (): Field & { fields: Field[] } => {
  const field = getCondensedAdminLayoutRow().fields.find(
    (candidate): candidate is Field & { fields: Field[] } =>
      fieldHasNestedFields(candidate) &&
      candidate.fields.some((child) => fieldHasName(child, 'showInProgress')),
  )
  if (!field) throw new Error('Progress layout column was not found')
  return field
}

const getReadMoreTargetField = (): RelationshipField => {
  const group = getReadMoreLinkField()
  const field = group.fields.find((candidate) => fieldHasName(candidate, 'target'))
  if (!field || field.type !== 'relationship') {
    throw new Error('SectionBlock.readMoreLink.target must be a relationship field')
  }
  return field
}

describe('landing section read-more links', () => {
  it('exposes an optional pages/posts target on shared section blocks', () => {
    const readMoreLink = getReadMoreLinkField()
    const target = getReadMoreTargetField()

    expect(readMoreLink.required).not.toBe(true)
    expect(target.required).not.toBe(true)
    expect(target.relationTo).toEqual(['pages', 'posts'])
  })

  it('condenses disclaimer, read-more, and progress controls into three admin columns', () => {
    const row = getCondensedAdminLayoutRow()
    const progressColumn = getProgressLayoutColumn()

    expect(row.fields.map((field) => ('name' in field ? field.name : field.type))).toEqual([
      'disclaimer',
      'readMoreLink',
      'group',
    ])
    expect(
      progressColumn.fields.map((field) => ('name' in field ? field.name : field.type)),
    ).toEqual(['showInProgress', 'progressLabel'])
    expect(getCondensedAdminRowField('disclaimer').admin?.width).toBe('33%')
    expect(getCondensedAdminRowField('readMoreLink').admin?.width).toBe('33%')
    expect(progressColumn.admin?.width).toBe('34%')
  })

  it('does not expose read-more links on Hero blocks', () => {
    expect(blockHasFieldNamed(HeroBlock, 'readMoreLink')).toBe(false)
  })

  it('resolves page and post read-more targets', () => {
    expect(resolveReadMoreHref({ relationTo: 'pages', value: pageWithSlug('home') })).toBe('/')
    expect(resolveReadMoreHref({ relationTo: 'pages', value: pageWithSlug('about') })).toBe(
      '/about',
    )
    expect(resolveReadMoreHref({ relationTo: 'posts', value: postWithSlug('news-update') })).toBe(
      '/posts/news-update',
    )
  })

  it('returns undefined for empty, unpopulated, or malformed targets', () => {
    expect(resolveReadMoreHref(null)).toBeUndefined()
    expect(resolveReadMoreHref(12)).toBeUndefined()
    expect(resolveReadMoreHref({ relationTo: 'posts', value: 44 })).toBeUndefined()
    expect(resolveReadMoreHref({ relationTo: 'posts', value: postWithSlug('') })).toBeUndefined()
  })

  it('normalizes existing homepage link URLs defensively', () => {
    expect(resolveHomepageLinkHref({ type: 'anchor', anchor: ' pricing ' })).toBe('#pricing')
    expect(resolveHomepageLinkHref({ type: 'external', url: '   ' })).toBeUndefined()
    expect(resolveHomepageLinkHref({ type: 'external', url: ' https://example.com ' })).toBe(
      'https://example.com',
    )
    expect(
      resolveHomepageLinkHref({
        type: 'internal',
        page: { relationTo: 'pages', value: pageWithSlug('   ') },
      }),
    ).toBeUndefined()
  })

  it('renders a localized small outline read-more button for configured targets', () => {
    render(
      React.createElement(SectionWrapper, {
        anchor: 'services',
        block: sectionBlockWithReadMoreTarget({ relationTo: 'posts', value: postWithSlug('news') }),
        sectionIndex: 1,
        t: (key) => (key === 'homepage.section.readmore' ? 'もっと読む' : key),
      }),
    )

    const link = screen.getByRole('link', { name: 'もっと読む' })

    expect(link.getAttribute('href')).toBe('/posts/news')
    expect(link.getAttribute('data-slot')).toBe('button')
    expect(link.className).toContain('border')
    expect(link.className).toContain('h-9')
  })

  it('does not render a read-more button without a valid target', () => {
    render(
      React.createElement(SectionWrapper, {
        anchor: 'services',
        block: sectionBlockWithReadMoreTarget({ relationTo: 'posts', value: postWithSlug('') }),
        sectionIndex: 1,
        t: (key) => (key === 'homepage.section.readmore' ? 'もっと読む' : key),
      }),
    )

    expect(screen.queryByRole('link', { name: 'もっと読む' })).toBeNull()
  })
})
