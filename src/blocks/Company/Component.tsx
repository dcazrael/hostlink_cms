import React from 'react'

import type { CompanyComponentBlock } from '@/payload-types'

type Props = {
  block: CompanyComponentBlock
}

export const CompanyBlockComponent: React.FC<Props> = ({ block }) => {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <article className="rounded-xl border border-border bg-background">
        <div className="grid grid-cols-[0.5fr_1fr] md:grid-cols-[12em_1fr] rounded-2xl w-full text-sm md:text-base">
          {block.companyName ? (
            <>
              <div className="rounded-tl-xl p-3.5 md:p-5 flex items-center">Company Name</div>
              <div className="bg-card rounded-tr-xl text-muted-foreground p-3.5 md:p-5 whitespace-pre-line">
                {block.companyName}
              </div>
              <hr className="col-span-2" />
            </>
          ) : null}
          {block.ceo ? (
            <>
              <div className="p-3.5 md:p-5 flex items-center">CEO</div>
              <div className="bg-card text-muted-foreground p-3.5 md:p-5">{block.ceo}</div>
              <hr className="col-span-2" />
            </>
          ) : null}
          {block.address ? (
            <>
              <div className="p-3.5 md:p-5 flex items-center">Address</div>
              <div className="bg-card text-muted-foreground p-3.5 md:p-5 whitespace-pre-line">
                {block.address}
              </div>
              <hr className="col-span-2" />
            </>
          ) : null}
          {block.contact ? (
            <>
              <div className="p-3.5 md:p-5 flex items-center">Contact</div>
              <div className="bg-card text-muted-foreground p-3.5 md:p-5 whitespace-pre-line">
                {block.contact}
              </div>
              <hr className="col-span-2" />
            </>
          ) : null}
          {block.services && block.services.length > 0 ? (
            <>
              <div className="rounded-bl-xl p-3.5 md:p-5 flex items-center">Services</div>
              <div className="bg-card rounded-br-xl text-muted-foreground p-3.5 md:p-5">
                <div className="flex flex-col gap-2">
                  {(block.services || []).map((service, index) => {
                    return <span key={service.id || index}>{service.text}</span>
                  })}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </article>
    </div>
  )
}
