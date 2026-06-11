import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
      title?: string
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
      title?: string
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText, title }) => {
  return (
    <div className="container mt-16">
      <div className="max-w-[48rem]">
        {title && <h1 className="mb-6 whitespace-pre-line">{title}</h1>}
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
