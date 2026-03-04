'use client'

import { useConfig, useDocumentInfo, usePayloadAPI, useWatchForm } from '@payloadcms/ui'
import React, { useEffect, useMemo } from 'react'

type FrontendCopyDoc = {
  group?: string | null
  id: number
  key?: string | null
}

type DocsResponse = {
  docs?: FrontendCopyDoc[]
}

export const FrontendCopyGroupNavigator: React.FC = () => {
  const { collectionSlug, id: documentID } = useDocumentInfo()
  const { getData } = useWatchForm()
  const { config } = useConfig()

  const adminRoute = config?.routes?.admin || '/admin'
  const group = typeof getData()?.group === 'string' ? getData().group.trim() : ''

  const [response, { setParams }] = usePayloadAPI(
    collectionSlug === 'ui-copy-keys' && group ? '/api/ui-copy-keys' : '',
  )

  useEffect(() => {
    if (collectionSlug !== 'ui-copy-keys' || !group) return

    setParams({
      depth: 0,
      limit: 1000,
      pagination: false,
      sort: 'key',
      where: {
        group: {
          equals: group,
        },
      },
    })
  }, [collectionSlug, group, setParams])

  const docs = useMemo(
    () =>
      Array.isArray((response.data as DocsResponse | undefined)?.docs)
        ? (((response.data as DocsResponse).docs ?? []) as FrontendCopyDoc[])
        : [],
    [response.data?.docs],
  )
  const currentIndex = docs.findIndex((doc) => String(doc.id) === String(documentID))

  if (collectionSlug !== 'ui-copy-keys' || !group || docs.length <= 1 || currentIndex < 0) {
    return null
  }

  const previous = docs[currentIndex - 1]
  const next = docs[currentIndex + 1]

  return (
    <div
      style={{
        alignItems: 'center',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 'var(--style-radius-m)',
        display: 'inline-flex',
        fontSize: '0.875rem',
        gap: '0.5rem',
        lineHeight: 1.2,
        marginBottom: 0,
        maxWidth: '56vw',
        minWidth: 0,
        padding: '0.375rem 0.625rem',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: 'var(--theme-text-secondary)' }}>Group:</span>
      <strong
        style={{
          maxWidth: '18rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        title={group}
      >
        {group}
      </strong>
      <span style={{ color: 'var(--theme-text-secondary)' }}>
        {currentIndex + 1}/{docs.length}
      </span>
      {previous ? (
        <a href={`${adminRoute}/collections/ui-copy-keys/${previous.id}`}>Previous</a>
      ) : (
        <span style={{ color: 'var(--theme-text-secondary)' }}>Previous</span>
      )}
      {next ? (
        <a href={`${adminRoute}/collections/ui-copy-keys/${next.id}`}>Next</a>
      ) : (
        <span style={{ color: 'var(--theme-text-secondary)' }}>Next</span>
      )}
    </div>
  )
}
