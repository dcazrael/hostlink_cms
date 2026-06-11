'use client'

import {
  DefaultNodeTypes,
  SerializedLinkNode,
  SerializedBlockNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import React from 'react'

import { cn } from '@/utilities/ui'

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

type BlockNode = SerializedBlockNode<DefaultNodeTypes>

const DefaultBlockConverters: JSXConvertersFunction<DefaultNodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    banner: ({ node }: { node: BlockNode }) => {
      const content = (node.fields as any)?.content
      const style = (node.fields as any)?.style as string | undefined
      if (!content) return null
      return (
        <div
          className={cn('border py-3 px-6 flex items-center rounded my-4', {
            'border-border bg-card': style === 'info',
            'border-error bg-error/30': style === 'error',
            'border-success bg-success/30': style === 'success',
            'border-warning bg-warning/30': style === 'warning',
          })}
        >
          <div className="flex-1 rich-text-content">
            <ConvertRichText data={content} />
          </div>
        </div>
      )
    },
    cta: ({ node }: { node: BlockNode }) => {
      const richText = (node.fields as any)?.richText
      const links = (node.fields as any)?.links as
        | Array<{ label?: string; url?: string; reference?: { value?: { slug: string } } }>
        | undefined
      return (
        <div className="my-4 flex flex-wrap gap-2 items-center">
          {richText && <ConvertRichText data={richText} />}
          {Array.isArray(links) &&
            links.map((link, i) => {
              const href =
                link.url || (link.reference?.value?.slug ? `/${link.reference.value.slug}` : '#')
              return (
                <a
                  key={i}
                  href={href}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded inline-block"
                >
                  {link.label}
                </a>
              )
            })}
        </div>
      )
    },
    mediaBlock: ({ node }: { node: BlockNode }) => {
      const media = (node.fields as any)?.media as { url?: string; alt?: string } | undefined
      const caption = (node.fields as any)?.caption as string | undefined
      const alignment = (node.fields as any)?.alignment as string | undefined
      if (!media?.url) return null
      return (
        <figure
          className={cn(
            'my-4',
            alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : '',
          )}
        >
          <img src={media.url} alt={media.alt || ''} className="max-w-full h-auto mx-auto" />
          {caption && (
            <figcaption className="text-sm text-muted-foreground mt-2">{caption}</figcaption>
          )}
        </figure>
      )
    },
    code: ({ node }: { node: BlockNode }) => {
      const code = (node.fields as any)?.code as string | undefined
      const language = (node.fields as any)?.language as string | undefined
      if (!code) return null
      return (
        <pre className="bg-muted p-4 rounded overflow-x-auto my-4 text-sm">
          <code className={language ? `language-${language}` : ''}>{code}</code>
        </pre>
      )
    },
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  className?: string
}

export default function RichText({
  data,
  enableGutter = true,
  enableProse = true,
  className,
}: Props) {
  return (
    <ConvertRichText
      converters={DefaultBlockConverters}
      data={data}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
    />
  )
}
