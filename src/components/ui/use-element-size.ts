'use client'

import * as React from 'react'

export function useElementSize<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null)
  const [size, setSize] = React.useState({ width: 0, height: 0 })

  React.useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    let frame = 0

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width)
      const height = Math.round(entry.contentRect.height)

      cancelAnimationFrame(frame)

      frame = requestAnimationFrame(() => {
        setSize((current) => {
          if (current.width === width && current.height === height) {
            return current
          }
          return { width, height }
        })
      })
    })

    observer.observe(element)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return [ref, size] as const
}
