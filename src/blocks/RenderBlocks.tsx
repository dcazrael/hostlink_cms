import React, { Fragment } from 'react'

import type {
  ArchiveBlock as ArchiveBlockData,
  CallToActionBlock as CallToActionBlockData,
  ContentBlock as ContentBlockData,
  MediaBlock as MediaBlockData,
  Page,
} from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const key = typeof block.id === 'string' ? block.id : `${block.blockType}-${index}`
          const normalizedId = typeof block.id === 'string' ? block.id : undefined

          switch (block.blockType) {
            case 'archive':
              return (
                <div className="my-16" key={key}>
                  <ArchiveBlock {...(block as ArchiveBlockData)} id={normalizedId} />
                </div>
              )
            case 'content':
              return (
                <div className="my-16" key={key}>
                  <ContentBlock {...(block as ContentBlockData)} />
                </div>
              )
            case 'cta':
              return (
                <div className="my-16" key={key}>
                  <CallToActionBlock {...(block as CallToActionBlockData)} />
                </div>
              )
            case 'formBlock':
              if (typeof block.form !== 'object' || block.form === null) {
                return null
              }

              return (
                <div className="my-16" key={key}>
                  <FormBlock
                    blockName={block.blockName ?? undefined}
                    blockType="formBlock"
                    enableIntro={Boolean(block.enableIntro)}
                    form={block.form}
                    id={normalizedId}
                    introContent={block.introContent ?? undefined}
                  />
                </div>
              )
            case 'mediaBlock':
              return (
                <div className="my-16" key={key}>
                  <MediaBlock {...(block as MediaBlockData)} />
                </div>
              )
            default:
              return null
          }
        })}
      </Fragment>
    )
  }

  return null
}
