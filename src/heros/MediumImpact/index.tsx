import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const MediumImpactHero: React.FC<Page['hero'] & { title?: string }> = ({
  links,
  media,
  richText,
  title,
}) => {
  return (
    <>
      <div className="container mb-8">
        {title && (
          <h1 className="mb-6 mx-auto max-w-5xl text-3xl lg:text-4xl xl:text-5xl leading-14 whitespace-pre-line text-center">
            {title}
          </h1>
        )}
        {richText && <RichText className="mb-6 max-w-3xl" data={richText} enableGutter={false} />}

        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex gap-4">
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <div className="container my-8">
        {media && typeof media === 'object' && (
          <div>
            <Media
              className="-mx-4 md:-mx-8 2xl:-mx-16"
              imgClassName="rounded-2xl max-h-[50vh] object-cover"
              priority
              resource={media}
            />
            {media?.caption && (
              <div className="mt-3">
                <RichText data={media.caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
