import React from 'react'

import { IconText } from '@/components/homepage/IconText'
import { SectionContent } from '@/components/homepage/SectionContent'
import { SectionShell, type SectionBackground } from '@/components/homepage/SectionShell'
import type { SectionLayoutBlock } from '@/components/homepage/types'
import type { TranslateFn } from '@/i18n/createTranslator'

export const SectionWrapper: React.FC<{
  anchor: string
  block: SectionLayoutBlock
  sectionIndex: number
  t: TranslateFn
}> = ({ anchor, block, sectionIndex, t }) => {
  const inner = block.component?.[0]
  const isContactSection = inner?.blockType === 'contact'
  const resolvedBackground: SectionBackground =
    block.background === 'subtle' || isContactSection
      ? 'subtle'
      : sectionIndex % 2 === 0
        ? 'even'
        : 'default'

  return (
    <SectionShell
      background={resolvedBackground}
      className="scroll-mt-28 py-14"
      innerClassName=" flex flex-col items-center"
      id={anchor}
    >
      {anchor !== `section-${sectionIndex}` ? (
        <span aria-hidden className="block scroll-mt-28" id={`section-${sectionIndex}`} />
      ) : null}

      {/* <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {t('homepage.section.sectionlabel', 'Section')} {sectionIndex}
        </span>
      </div> */}

      <h2 className="whitespace-pre-line text-2xl font-semibold md:text-4xl">{block.heading}</h2>
      {block.subheading ? (
        <p className="mt-3 max-w-[70ch] whitespace-pre-line text-muted-foreground">
          {block.subheading}
        </p>
      ) : null}

      <div className="mt-8 w-full">
        <SectionContent component={inner} t={t} />
      </div>

      <IconText
        containerClassName="mt-6 flex items-center justify-center gap-2"
        iconClassName="size-4 text-muted-foreground"
        textClassName="text-center text-xs text-muted-foreground"
        value={block.disclaimer}
      />
    </SectionShell>
  )
}
