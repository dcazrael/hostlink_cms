'use client'

import { SelectInput, useField, usePayloadAPI, useWatchForm } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import React, { useEffect, useMemo } from 'react'

import { getAnchorOptionsFromLayout } from '@/utilities/homepageAnchors'

const getValueAtPath = (obj: unknown, path: string): unknown => {
  if (!path) return obj

  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return current
}

const normalizeSelectValueToString = (value: unknown): string => {
  if (Array.isArray(value)) {
    return normalizeSelectValueToString(value[0])
  }

  if (typeof value === 'string') return value

  if (value && typeof value === 'object' && 'value' in value) {
    const optionValue = (value as { value?: unknown }).value
    return typeof optionValue === 'string' ? optionValue : ''
  }

  return ''
}

const getParentPath = (path: string): string => {
  const parts = path.split('.')
  parts.pop()
  return parts.join('.')
}

const getReferenceFieldPath = (parentPath: string): string =>
  parentPath ? `${parentPath}.reference` : 'reference'

const getPageId = (referenceValue: unknown): string | number | undefined => {
  if (!referenceValue || typeof referenceValue !== 'object') return undefined

  const ref = referenceValue as { relationTo?: unknown; value?: unknown }
  if (ref.relationTo !== 'pages') return undefined

  const val = ref.value
  if (typeof val === 'number') return val
  if (typeof val === 'string' && val.length > 0) return val
  if (val && typeof val === 'object') {
    const id = (val as { id?: unknown }).id
    if (typeof id === 'number') return id
    if (typeof id === 'string' && id.length > 0) return id
  }

  return undefined
}

export const PageAnchorSelect: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { getData } = useWatchForm()
  const { setValue, showError, value } = useField<unknown>({ path })
  const normalizedValue = normalizeSelectValueToString(value)

  const parentPath = useMemo(() => getParentPath(path), [path])
  const referenceFieldPath = useMemo(() => getReferenceFieldPath(parentPath), [parentPath])

  const referenceValue = useMemo(
    () => getValueAtPath(getData(), referenceFieldPath),
    [getData, referenceFieldPath],
  )
  const pageID = useMemo(() => getPageId(referenceValue), [referenceValue])
  const shouldFetch = pageID !== undefined

  const [pageResponse, { setParams }] = usePayloadAPI(shouldFetch ? '/api/pages' : '')

  useEffect(() => {
    if (!shouldFetch || pageID === undefined) return

    setParams({
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        id: { equals: pageID },
      },
    })
  }, [shouldFetch, pageID, setParams])

  const options = useMemo(() => {
    const pageDoc = Array.isArray(pageResponse?.data?.docs) ? pageResponse.data.docs[0] : undefined
    const layout = pageDoc?.layout

    const baseOptions = Array.isArray(layout) ? getAnchorOptionsFromLayout(layout) : []

    if (normalizedValue && !baseOptions.some((opt) => opt.value === normalizedValue)) {
      return [{ label: `Current: ${normalizedValue}`, value: normalizedValue }, ...baseOptions]
    }

    return baseOptions
  }, [pageResponse, normalizedValue])

  return (
    <SelectInput
      isClearable={!field.required}
      label={field.label}
      name={path}
      onChange={(nextValue) => {
        if (Array.isArray(nextValue)) {
          setValue(normalizeSelectValueToString(nextValue[0]))
          return
        }

        setValue(normalizeSelectValueToString(nextValue))
      }}
      options={options}
      path={path}
      placeholder={pageID ? 'Select page anchor' : 'Select a Page link first'}
      readOnly={readOnly || !pageID}
      required={field.required}
      showError={showError}
      value={normalizedValue}
    />
  )
}
