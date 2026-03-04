'use client'

import { toast, useConfig, usePayloadAPI } from '@payloadcms/ui'
import React, { useEffect, useMemo, useState } from 'react'

type TranslationRow = {
  locale?: string | null
  value?: string | null
}

type FrontendCopyDoc = {
  group?: string | null
  id: number
  key?: string | null
  translations?: TranslationRow[] | null
  updatedAt?: string | null
}

type DocsResponse = {
  docs?: FrontendCopyDoc[]
}

type EditableTranslations = {
  en: string
  ja: string
}

const getTranslationValue = (doc: FrontendCopyDoc, locale: 'en' | 'ja'): string => {
  const translations = Array.isArray(doc.translations) ? doc.translations : []
  const value = translations.find((row) => row?.locale === locale)?.value
  return typeof value === 'string' ? value : ''
}

const toEditableMap = (docs: FrontendCopyDoc[]): Record<number, EditableTranslations> => {
  return docs.reduce<Record<number, EditableTranslations>>((acc, doc) => {
    acc[doc.id] = {
      en: getTranslationValue(doc, 'en'),
      ja: getTranslationValue(doc, 'ja'),
    }
    return acc
  }, {})
}

export const FrontendCopyWorkbench: React.FC = () => {
  const { config } = useConfig()
  const adminRoute = config?.routes?.admin || '/admin'
  const apiRoute = config?.routes?.api || '/api'

  const [selectedGroup, setSelectedGroup] = useState('')
  const [refreshTick, setRefreshTick] = useState(0)
  const [savingID, setSavingID] = useState<number | null>(null)
  const [editableByID, setEditableByID] = useState<Record<number, EditableTranslations>>({})

  const [groupsResponse, { setParams: setGroupsParams }] = usePayloadAPI('/api/ui-copy-keys')
  const [entriesResponse, { setParams: setEntriesParams }] = usePayloadAPI(
    selectedGroup ? '/api/ui-copy-keys' : '',
  )

  useEffect(() => {
    setGroupsParams({
      depth: 0,
      limit: 5000,
      pagination: false,
      sort: 'group',
    })
  }, [setGroupsParams])

  const groups = useMemo(() => {
    const docs = Array.isArray((groupsResponse.data as DocsResponse | undefined)?.docs)
      ? ((groupsResponse.data as DocsResponse).docs ?? [])
      : []
    return [
      ...new Set(
        docs
          .map((doc: FrontendCopyDoc) => doc.group?.trim())
          .filter(Boolean) as string[],
      ),
    ].sort()
  }, [groupsResponse.data?.docs])

  useEffect(() => {
    if (groups.length === 0) return
    if (!selectedGroup || !groups.includes(selectedGroup)) {
      setSelectedGroup(groups[0])
    }
  }, [groups, selectedGroup])

  useEffect(() => {
    if (!selectedGroup) return

    setEntriesParams({
      depth: 0,
      limit: 500,
      pagination: false,
      sort: 'key',
      where: {
        group: {
          equals: selectedGroup,
        },
      },
    })
  }, [refreshTick, selectedGroup, setEntriesParams])

  const entries = useMemo(
    () =>
      Array.isArray((entriesResponse.data as DocsResponse | undefined)?.docs)
        ? (((entriesResponse.data as DocsResponse).docs ?? []) as FrontendCopyDoc[])
        : [],
    [entriesResponse.data?.docs],
  )

  useEffect(() => {
    setEditableByID(toEditableMap(entries))
  }, [entries])

  const updateTranslation = (id: number, locale: 'en' | 'ja', next: string) => {
    setEditableByID((prev) => ({
      ...prev,
      [id]: {
        en: prev[id]?.en ?? '',
        ja: prev[id]?.ja ?? '',
        [locale]: next,
      },
    }))
  }

  const saveRow = async (doc: FrontendCopyDoc) => {
    const editable = editableByID[doc.id]
    if (!editable) return

    setSavingID(doc.id)
    try {
      const response = await fetch(`${apiRoute}/ui-copy-keys/${doc.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          translations: [
            { locale: 'ja', value: editable.ja },
            { locale: 'en', value: editable.en },
          ],
        }),
      })

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as { message?: string } | null
        throw new Error(error?.message || 'Failed to save key.')
      }

      toast.success(`Saved ${doc.key}`)
      setRefreshTick((tick) => tick + 1)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save key.')
    } finally {
      setSavingID(null)
    }
  }

  if (groups.length === 0) return null

  return (
    <section
      style={{
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 'var(--style-radius-m)',
        marginTop: 'var(--base)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          background: 'var(--theme-elevation-50)',
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
        }}
      >
        <strong>Group Workbench</strong>
        <label style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
          <span>Group</span>
          <select onChange={(event) => setSelectedGroup(event.target.value)} value={selectedGroup}>
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left', width: '25%' }}>Key</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', width: '30%' }}>JA</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', width: '30%' }}>EN</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', width: '15%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((doc) => {
              const editable = editableByID[doc.id] || { en: '', ja: '' }
              const fullEditHref = `${adminRoute}/collections/ui-copy-keys/${doc.id}`

              return (
                <tr
                  key={doc.id}
                  style={{
                    borderTop: '1px solid var(--theme-elevation-100)',
                    verticalAlign: 'top',
                  }}
                >
                  <td style={{ padding: '0.75rem' }}>
                    <a href={fullEditHref}>{doc.key}</a>
                    <div style={{ color: 'var(--theme-text-secondary)', fontSize: '0.8rem' }}>
                      {selectedGroup}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <textarea
                      onChange={(event) => updateTranslation(doc.id, 'ja', event.target.value)}
                      style={{ minHeight: '4.5rem', width: '100%' }}
                      value={editable.ja}
                    />
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <textarea
                      onChange={(event) => updateTranslation(doc.id, 'en', event.target.value)}
                      style={{ minHeight: '4.5rem', width: '100%' }}
                      value={editable.en}
                    />
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button
                      disabled={savingID === doc.id}
                      onClick={() => void saveRow(doc)}
                      type="button"
                    >
                      {savingID === doc.id ? 'Saving...' : 'Save row'}
                    </button>
                    <div style={{ marginTop: '0.5rem' }}>
                      <a href={fullEditHref}>Open full edit</a>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default FrontendCopyWorkbench
