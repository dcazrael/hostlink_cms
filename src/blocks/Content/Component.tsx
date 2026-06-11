import RichText from '@/components/RichText'
import React from 'react'

import type {
  ContentBlock as ContentBlockProps,
  FaqComponentBlock,
  GridComponentBlock,
} from '@/payload-types'

import { FaqBlockComponent } from '@/blocks/Faq/Component'
import { GridBlockComponent } from '@/blocks/GridBlock/Component'
import { CMSLink } from '@/components/Link'

type EmbeddedBlock = GridComponentBlock | FaqComponentBlock

const renderEmbeddedComponent = (block: EmbeddedBlock) => {
  switch (block.blockType) {
    case 'grid':
      return <GridBlockComponent block={block} />
    case 'faq':
      return <FaqBlockComponent block={block} />
    default:
      return null
  }
}

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const sizeClasses = {
    full: 'w-full',
    half: 'w-1/2',
    oneThird: 'w-1/3',
    twoThirds: 'w-2/3',
  }

  return (
    <div className="my-8">
      <div className="flex flex-wrap gap-y-8 gap-x-4 md:gap-x-8">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link: linkData, richText, size, divider, embeddedComponent } = col

            return (
              <div className={sizeClasses[size!]} key={index}>
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && <CMSLink {...linkData} />}

                {embeddedComponent && embeddedComponent.length > 0 && (
                  <div className="mt-4">
                    {embeddedComponent.map((block, blockIndex) => (
                      <div key={blockIndex}>{renderEmbeddedComponent(block)}</div>
                    ))}
                  </div>
                )}

                {divider && <hr className="border-border mt-12" />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
