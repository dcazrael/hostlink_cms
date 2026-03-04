import React from 'react'

import { ChatMock } from '@/components/homepage/ChatMock'
import { HomepageLinkButton } from '@/components/homepage/HomepageLinkButton'
import { SectionShell } from '@/components/homepage/SectionShell'
import type { HeroLayoutBlock } from '@/components/homepage/types'
import { Media } from '@/components/Media'
import type { TranslateFn } from '@/i18n/createTranslator'
import { CircleCheck } from 'lucide-react'

export const HeroSection: React.FC<{ block: HeroLayoutBlock; t: TranslateFn }> = ({ block, t }) => {
  return (
    <SectionShell
      background="subtle"
      className="py-20 pb-32"
      innerClassName="grid gap-12 md:grid-cols-1 lg:grid-cols-2 xl:items-stretch xl:grid-cols-[1.3fr_1fr] xl:gap-32"
    >
      <div className="flex h-full flex-col justify-center gap-8">
        <div>
          {block.tagline ? (
            <p className="mb-3 inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs uppercase tracking-wide text-accent">
              {block.tagline}
            </p>
          ) : null}
          <h1 className="text-4xl font-semibold md:text-5xl leading-18">{block.title}</h1>
        </div>
        <p className="mt-5 max-w-[60ch] text-lg text-muted-foreground">{block.sub}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <HomepageLinkButton link={block.primaryCTA} />
          <HomepageLinkButton link={block.secondaryCTA} />
        </div>
        {block.highlights?.length ? (
          <div className="flex text-sm text-muted-foreground gap-8">
            {block.highlights.map((item, index) => {
              return (
                <div className="flex items-center gap-2" key={item.id || index}>
                  <CircleCheck className="size-4 text-primary" />
                  <span>{item.text}</span>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>

      <div>
        {block.rightVisual === 'image' && block.image && typeof block.image === 'object' ? (
          <div className="relative h-85 overflow-hidden rounded-2xl border border-border">
            <Media fill imgClassName="object-cover" priority resource={block.image} />
          </div>
        ) : (
          <ChatMock t={t} />
        )}
      </div>
    </SectionShell>
  )
}
