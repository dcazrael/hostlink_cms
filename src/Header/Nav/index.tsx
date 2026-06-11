'use client'

import { Menu, X } from 'lucide-react'
import React, { useState } from 'react'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: Header }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
        {navItems.map((item, i) => {
          return (
            <CMSLink
              className="text-foreground text-base font-medium hover:opacity-80"
              key={i}
              {...(item.link as any)}
              appearance="inline"
            />
          )
        })}
      </nav>

      <button
        type="button"
        className="lg:hidden flex items-center justify-center w-10 h-10"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 w-72 bg-background shadow-xl z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4 border-b border-border">
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col p-4">
          {navItems.map((item, i) => {
            return (
              <div
                className="text-foreground text-lg font-medium py-3 hover:opacity-80 cursor-pointer"
                key={i}
                onClick={() => setIsOpen(false)}
              >
                <CMSLink {...(item.link as any)} appearance="inline" />
              </div>
            )
          })}
        </nav>
      </div>
    </>
  )
}
