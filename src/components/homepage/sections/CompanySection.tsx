import React from 'react'

import type { SectionComponentBlock } from '@/components/homepage/types'
import type { TranslateFn } from '@/i18n/createTranslator'

type CompanyBlock = Extract<SectionComponentBlock, { blockType: 'company' }>
const SECTION_MAX_WIDTH_CLASS = 'mx-auto w-full max-w-[56rem]'

export const CompanySection: React.FC<{
  block: CompanyBlock
  t: TranslateFn
}> = ({ block, t }) => {
  return (
    // Section max width is design-owned in component (not CMS).
    <div className={SECTION_MAX_WIDTH_CLASS}>
      <article className="rounded-xl border border-border bg-background ">
        <div className="grid grid-cols[0.5fr_1fr] md:grid-cols-[12em_1fr] rounded-2xl w-full text-sm md:text-base">
          {block.companyName ? (
            <>
              <div className="rounded-tl-xl p-3.5 md:p-5 flex items-center">
                {t('homepage.company.label.companyname', 'Company Name')}
              </div>
              <div className="bg-card rounded-tr-xl text-muted-foreground p-3.5 md:p-5">
                {block.companyName}
              </div>
              <hr className="col-span-2" />
            </>
          ) : null}
          {block.ceo ? (
            <>
              <div className="rounded-xl p-3.5 md:p-5 flex items-center">
                {t('homepage.company.label.ceo', 'CEO')}
              </div>
              <div className="bg-card text-muted-foreground p-3.5 md:p-5">{block.ceo}</div>
              <hr className="col-span-2" />
            </>
          ) : null}
          {block.address ? (
            <>
              <div className="rounded-xl p-3.5 md:p-5 flex items-center">
                {t('homepage.company.label.address', 'Address')}
              </div>
              <div className="bg-card text-muted-foreground p-3.5 md:p-5">{block.address}</div>
              <hr className="col-span-2" />
            </>
          ) : null}
          {block.contact ? (
            <>
              <div className="rounded-xl p-3.5 md:p-5 flex items-center">
                {t('homepage.company.label.contact', 'Contact')}
              </div>
              <div className="bg-card text-muted-foreground p-3.5 md:p-5">{block.contact}</div>
              <hr className="col-span-2" />
            </>
          ) : null}
          {block.services ? (
            <>
              <div className="rounded-bl-xl p-3.5 md:p-5 flex items-center">
                {t('homepage.company.label.services', 'Services')}
              </div>
              {(block.services || []).length > 0 ? (
                <>
                  <div className="bg-card rounded-br-xl text-muted-foreground p-3.5 md:p-5">
                    {(block.services || []).map((service, index) => {
                      return <span key={service.id || index}>{service.text}</span>
                    })}
                  </div>
                </>
              ) : null}
            </>
          ) : null}
        </div>
      </article>
    </div>
  )
}
