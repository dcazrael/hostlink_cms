import React, { Fragment } from 'react'

import type {
  ArchiveBlock as ArchiveBlockData,
  CallToActionBlock as CallToActionBlockData,
  CompanyComponentBlock,
  ContactComponentBlock,
  ContentBlock as ContentBlockData,
  FaqComponentBlock,
  FlowComponentBlock,
  GridComponentBlock,
  MediaBlock as MediaBlockData,
  Page,
  PricingComponentBlock,
  TestimonialsComponentBlock,
} from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CompanyBlockComponent } from '@/blocks/Company/Component'
import { ContactBlockComponent } from '@/blocks/Contact/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FaqBlockComponent } from '@/blocks/Faq/Component'
import { FlowBlockComponent } from '@/blocks/Flow/Component'
import { FormBlock, type FormBlockType } from '@/blocks/Form/Component'
import { GridBlockComponent } from '@/blocks/GridBlock/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PricingBlockComponent } from '@/blocks/Pricing/Component'
import { TestimonialsBlockComponent } from '@/blocks/Testimonials/Component'
type RenderBlocksProps = {
  blocks: Page['layout'][0][]
}

type PageLayoutBlockWithAnchor = Page['layout'][number] & {
  anchor?: boolean | null
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const getManualAnchor = (block: PageLayoutBlockWithAnchor): string | undefined => {
  if (block.anchor !== true) return undefined
  const blockWithHeading = block as { blockName?: string | null; heading?: string | null }
  const source = blockWithHeading.blockName || blockWithHeading.heading
  if (source && typeof source === 'string' && source.trim().length > 0) {
    return slugify(source)
  }
  return undefined
}

const getContentFallbackAnchor = (
  block: ContentBlockData & { columns?: { tocTitle?: string | null }[] | null },
): string | undefined => {
  const tocTitle = block.columns?.[0]?.tocTitle
  return tocTitle ? slugify(tocTitle) : undefined
}

const getWrapperID = (block: PageLayoutBlockWithAnchor): string | undefined => {
  const manualAnchor = getManualAnchor(block)
  if (manualAnchor) return manualAnchor

  if (block.blockType === 'content') {
    return getContentFallbackAnchor(
      block as unknown as ContentBlockData & { columns?: { tocTitle?: string | null }[] | null },
    )
  }

  return undefined
}

export const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks }) => {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const key = typeof block.id === 'string' ? block.id : `${block.blockType}-${index}`
          const isLastBlock = index === blocks.length - 1
          const wrapperID = getWrapperID(block as PageLayoutBlockWithAnchor)
          const wrapperClassName = isLastBlock ? '' : 'mb-8'
          const wrapperProps = {
            className: wrapperClassName,
            'data-block-index': index,
            id: wrapperID,
          }
          const contentWrapperProps = {
            className: wrapperClassName,
            id: wrapperID,
          }

          switch (block.blockType) {
            case 'archive':
              return (
                <div {...wrapperProps} key={key}>
                  <ArchiveBlock {...(block as ArchiveBlockData)} id={block.id ?? undefined} />
                </div>
              )
            case 'content': {
              const contentBlock = block as unknown as ContentBlockData & {
                columns?: { tocTitle?: string }[]
              }
              return (
                <div {...contentWrapperProps} key={key}>
                  <ContentBlock {...contentBlock} />
                </div>
              )
            }
            case 'cta':
              return (
                <div {...wrapperProps} key={key}>
                  <CallToActionBlock {...(block as CallToActionBlockData)} />
                </div>
              )
            case 'formBlock':
              if (typeof block.form !== 'object' || block.form === null) {
                return null
              }

              return (
                <div {...wrapperProps} key={key}>
                  <FormBlock
                    blockName={block.blockName ?? undefined}
                    blockType="formBlock"
                    enableIntro={Boolean(block.enableIntro)}
                    form={block.form as FormBlockType['form']}
                    introContent={block.introContent as FormBlockType['introContent']}
                  />
                </div>
              )
            case 'grid':
              return (
                <div {...wrapperProps} key={key}>
                  <GridBlockComponent block={block as unknown as GridComponentBlock} />
                </div>
              )
            case 'mediaBlock':
              return (
                <div {...wrapperProps} key={key}>
                  <MediaBlock {...(block as MediaBlockData)} id={block.id ?? undefined} />
                </div>
              )
            case 'faq':
              return (
                <div {...wrapperProps} key={key}>
                  <FaqBlockComponent block={block as FaqComponentBlock} />
                </div>
              )
            case 'flow':
              return (
                <div {...wrapperProps} key={key}>
                  <FlowBlockComponent block={block as FlowComponentBlock} />
                </div>
              )
            case 'testimonials':
              return (
                <div {...wrapperProps} key={key}>
                  <TestimonialsBlockComponent block={block as TestimonialsComponentBlock} />
                </div>
              )
            case 'pricing':
              return (
                <div {...wrapperProps} key={key}>
                  <PricingBlockComponent block={block as PricingComponentBlock} />
                </div>
              )
            case 'company':
              return (
                <div {...wrapperProps} key={key}>
                  <CompanyBlockComponent block={block as CompanyComponentBlock} />
                </div>
              )
            case 'contact':
              return (
                <div {...wrapperProps} key={key}>
                  <ContactBlockComponent block={block as ContactComponentBlock} />
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
