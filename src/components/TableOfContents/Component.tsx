'use client'

import { TableOfContents as TOCIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

type TableOfContentsHeading = {
  id?: string | null
  text?: string | null
}

type Props = {
  headings: TableOfContentsHeading[]
}

export const TableOfContents: React.FC<Props> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [sheetTranslateY, setSheetTranslateY] = useState(0)
  const dragStartY = useRef(0)
  const isDragging = useRef(false)

  useEffect(() => {
    if (headings.length > 0 && headings[0].id) {
      setActiveId(headings[0].id)
    }
  }, [headings])

  useEffect(() => {
    if (headings.length === 0) return

    const validIds = new Set(headings.map((h) => h.id))

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && validIds.has(entry.target.id)) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      {
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0,
      },
    )

    for (const { id } of headings) {
      if (!id) continue
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el)
      }
    }

    return () => {
      observer.disconnect()
    }
  }, [headings])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true
    dragStartY.current = 'touches' in e ? e.touches[0].clientY : e.clientY
  }

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return
    e.preventDefault()
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const delta = currentY - dragStartY.current
    if (delta > 0) {
      setSheetTranslateY(delta)
    }
  }

  const handleDragEnd = () => {
    isDragging.current = false
    if (sheetTranslateY > 100) {
      setIsMobileOpen(false)
    }
    setSheetTranslateY(0)
  }

  if (headings.length === 0) return null

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <nav className="self-start top-4 lg:sticky lg:pt-4 hidden lg:block">
        <ul className="space-y-0">
          {headings.map((heading) => {
            const { id, text } = heading
            const isActive = activeId === id
            return (
              <li
                key={id}
                className={`first:pt-1 last:pb-1 pl-3.5 py-2 border-l-3 ${isActive ? 'border-primary' : 'border-muted'}`}
              >
                <a
                  href={`#${id}`}
                  className={`block text-base transition-colors scroll-mt-28 ${
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {text}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <button
        type="button"
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open table of contents"
      >
        <TOCIcon className="w-6 h-6" />
      </button>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={() => setIsMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl p-6 pb-8 max-h-[70vh] overflow-y-auto"
            style={{
              transform: `translateY(${sheetTranslateY}px)`,
              transition:
                sheetTranslateY === 0 && !isDragging.current ? 'transform 0.3s ease-out' : 'none',
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseMove={(e) => {
              if (e.buttons === 1) {
                e.preventDefault()
                handleDragMove(e as unknown as React.TouchEvent)
              }
            }}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4 cursor-grab active:cursor-grabbing" />
            <h3 className="text-lg font-semibold mb-4">On this page</h3>
            <ul className="space-y-2">
              {headings.map((heading) => {
                const { id, text } = heading
                const isActive = activeId === id
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={`block py-2 px-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-foreground hover:bg-muted'
                      }`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {text}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
