import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero'] & { title?: string }> = ({
  links,
  media,
  richText,
  title,
}) => {
  return (
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center text-white"
      data-theme="dark"
    >
      <div className="container z-10 -mx-96 relative flex items-center justify-center mt-auto pt-16">
        <div className="max-w-180 md:text-center">
          {title && (
            <h1 className="mb-6 text-3xl lg:text-4xl xl:text-5xl font-bold whitespace-pre-line text-center">
              {title}
            </h1>
          )}
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
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
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <>
            <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
            <div className="absolute inset-0 -z-10 bg-linear-to-b from-transparent via-40% via-transparent to-black/80" />
          </>
        )}
      </div>
    </div>
  )
}
