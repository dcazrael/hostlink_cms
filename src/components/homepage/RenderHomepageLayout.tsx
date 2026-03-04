import Link from 'next/link'
import React from 'react'

import { HeroSection } from '@/components/homepage/HeroSection'
import { SectionWrapper } from '@/components/homepage/SectionWrapper'
import type { TranslateFn } from '@/i18n/createTranslator'
import type { Page } from '@/payload-types'
import { decorateBlocks, getProgressItems, isHeroBlock, isSectionBlock } from './utils'

export const RenderHomepageLayout: React.FC<{
  blocks: Page['layout']
  t: TranslateFn
}> = ({ blocks, t }) => {
  const decoratedBlocks = decorateBlocks(blocks)
  const progressItems = getProgressItems(decoratedBlocks, t('homepage.section.progressfallbacklabel', 'Section'))

  return (
    <>
      {decoratedBlocks.map((entry) => {
        const key =
          typeof entry.block.id === 'string'
            ? entry.block.id
            : `${entry.block.blockType}-${entry.index}`

        if (isHeroBlock(entry.block)) {
          return <HeroSection block={entry.block} key={key} t={t} />
        }

        if (isSectionBlock(entry.block) && typeof entry.sectionIndex === 'number') {
          return (
            <SectionWrapper
              anchor={entry.anchor || `section-${entry.sectionIndex}`}
              block={entry.block}
              key={key}
              sectionIndex={entry.sectionIndex}
              t={t}
            />
          )
        }

        return null
      })}

      {progressItems.length > 0 ? (
        <nav className="container py-8 hidden">
          <ol className="flex flex-wrap gap-3">
            {progressItems.map((item) => {
              return (
                <li key={item.anchor}>
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:bg-muted"
                    href={`#${item.anchor}`}
                  >
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {item.dotIndex}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </nav>
      ) : null}
    </>
  )
}
