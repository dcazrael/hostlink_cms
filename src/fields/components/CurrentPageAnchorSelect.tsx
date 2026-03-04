'use client'

import { SelectInput, useDocumentInfo, useField, usePayloadAPI, useWatchForm } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import React, { useEffect, useMemo } from 'react'

import {
  getAnchorOptionsFromLandingSections,
  getAnchorOptionsFromLayout,
} from '@/utilities/homepageAnchors'

const parseLayoutIndexFromPath = (path: string): number | undefined => {
  const match = path.match(/(?:^|\.)layout\.(\d+)\./)
  if (!match) return undefined

  const parsed = Number(match[1])
  return Number.isNaN(parsed) ? undefined : parsed
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

const normalizeDocumentID = (value: unknown): number | string | undefined => {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.length > 0) return value
  return undefined
}

const resolveSectionID = (value: unknown): number | string | undefined => {
  const normalized = normalizeDocumentID(value)
  if (normalized !== undefined) return normalized

  if (value && typeof value === 'object') {
    const relationValue = (value as { value?: unknown }).value
    return resolveSectionID(relationValue)
  }

  return undefined
}

const getSectionIDsInOrder = (sections: unknown): Array<number | string> => {
  if (!Array.isArray(sections)) return []

  return sections.flatMap((section) => {
    const id = resolveSectionID(section)
    return id !== undefined ? [id] : []
  })
}

const getSectionRelationshipsInOrder = (value: unknown): unknown[] => {
  if (!value || typeof value !== 'object') return []

  const data = value as { sectionItems?: unknown; sections?: unknown }

  if (Array.isArray(data.sectionItems) && data.sectionItems.length > 0) {
    return data.sectionItems
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        return (item as { section?: unknown }).section ?? null
      })
      .filter((item) => item !== null)
  }

  if (Array.isArray(data.sections)) return data.sections
  return []
}

const orderSectionsByRelationship = (
  relationSections: unknown,
  fetchedDocs: unknown,
): unknown[] => {
  if (!Array.isArray(relationSections)) {
    return Array.isArray(fetchedDocs) ? fetchedDocs : []
  }

  const docs = Array.isArray(fetchedDocs) ? fetchedDocs : []
  const docsByID = new Map<string, unknown>()

  docs.forEach((doc) => {
    if (!doc || typeof doc !== 'object') return
    const id = normalizeDocumentID((doc as { id?: unknown }).id)
    if (id === undefined) return

    docsByID.set(String(id), doc)
  })

  return relationSections.map((section) => {
    if (section && typeof section === 'object' && 'content' in section) {
      return section
    }

    const sectionID = resolveSectionID(section)
    if (sectionID === undefined) return section

    return docsByID.get(String(sectionID)) || section
  })
}

export const CurrentPageAnchorSelect: TextFieldClientComponent = ({ field, path, readOnly }) => {
  const { collectionSlug, id: documentID } = useDocumentInfo()
  const { getData } = useWatchForm()
  const { setValue, showError, value } = useField<unknown>({ path })

  const currentLayoutIndex = parseLayoutIndexFromPath(path)
  const data = getData()
  const normalizedValue = normalizeSelectValueToString(value)
  const sectionRelationships = useMemo(() => getSectionRelationshipsInOrder(data), [data])
  const sectionIDs = useMemo(
    () => getSectionIDsInOrder(sectionRelationships),
    [sectionRelationships],
  )
  const serializedSectionIDs = sectionIDs.map(String).join(',')
  const shouldFetchSectionsForLandingPage =
    collectionSlug === 'landing-pages' && sectionIDs.length > 0 && !Array.isArray(data?.layout)
  const currentSectionID = normalizeDocumentID(documentID)
  const shouldFetchParentLandingPage =
    collectionSlug === 'landing-sections' && currentSectionID !== undefined

  const [landingSectionsResponse, { setParams: setLandingSectionsParams }] = usePayloadAPI(
    shouldFetchSectionsForLandingPage ? '/api/landing-sections' : '',
  )

  const [landingPagesResponse, { setParams: setLandingPagesParams }] = usePayloadAPI(
    shouldFetchParentLandingPage ? '/api/landing-pages' : '',
  )

  useEffect(() => {
    if (!shouldFetchSectionsForLandingPage) return

    setLandingSectionsParams({
      depth: 1,
      limit: sectionIDs.length,
      pagination: false,
      where: {
        id: {
          in: sectionIDs,
        },
      },
    })
  }, [
    serializedSectionIDs,
    setLandingSectionsParams,
    sectionIDs,
    shouldFetchSectionsForLandingPage,
  ])

  useEffect(() => {
    if (!shouldFetchParentLandingPage || currentSectionID === undefined) return

    setLandingPagesParams({
      depth: 2,
      limit: 1,
      pagination: false,
      where: {
        or: [
          {
            sections: {
              in: [currentSectionID],
            },
          },
          {
            'sectionItems.section': {
              in: [currentSectionID],
            },
          },
        ],
      },
    })
  }, [currentSectionID, setLandingPagesParams, shouldFetchParentLandingPage])

  const options = useMemo(() => {
    let baseOptions = getAnchorOptionsFromLayout(data?.layout, currentLayoutIndex)

    if (baseOptions.length === 0) {
      if (collectionSlug === 'landing-pages') {
        const orderedSections = orderSectionsByRelationship(sectionRelationships, landingSectionsResponse.data?.docs)

        baseOptions = getAnchorOptionsFromLandingSections(orderedSections)
      } else if (collectionSlug === 'landing-sections') {
        const parentPageSections = getSectionRelationshipsInOrder(landingPagesResponse.data?.docs?.[0])
        baseOptions = getAnchorOptionsFromLandingSections(parentPageSections, currentSectionID)
      }
    }

    if (normalizedValue && !baseOptions.some((option) => option.value === normalizedValue)) {
      return [{ label: `Current: ${normalizedValue}`, value: normalizedValue }, ...baseOptions]
    }

    return baseOptions
  }, [
    collectionSlug,
    currentLayoutIndex,
    currentSectionID,
    data?.layout,
    landingPagesResponse.data?.docs,
    landingSectionsResponse.data?.docs,
    normalizedValue,
    sectionRelationships,
  ])

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
      placeholder="Select section anchor"
      readOnly={readOnly}
      required={field.required}
      showError={showError}
      value={normalizedValue}
    />
  )
}
