'use client'

import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import React from 'react'

import { useTheme } from '..'

export const ThemeToggle: React.FC = () => {
  const { setTheme, theme } = useTheme()

  const isDark = theme === 'dark'

  const handleClick = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="text-foreground"
      onClick={handleClick}
      size="icon"
      type="button"
      variant="ghost"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
