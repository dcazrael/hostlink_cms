import type { Decorator, Preview } from '@storybook/react'
import React, { useLayoutEffect } from 'react'

import './preview.css'

import { initialize, mswLoader } from 'msw-storybook-addon'
import MockDate from 'mockdate'
import { ThemeProvider } from '../src/providers/Theme'
import { HeaderThemeProvider } from '../src/providers/HeaderTheme'
import { mswHandlers } from './msw-handlers'

initialize({ onUnhandledRequest: 'bypass' })

function useFrontendCanvasGlobals(): void {
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return

    document.documentElement.setAttribute('data-theme', 'light')
  }, [])
}

const withFrontendCanvas: Decorator = (Story) => {
  useFrontendCanvasGlobals()

  return (
    <div
      data-theme="light"
      className="main-gradient min-h-screen w-full bg-background text-foreground font-sans"
    >
      <div className="container py-10">
        <Story />
      </div>
    </div>
  )
}

const withProviders: Decorator = (Story) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <Story />
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}

const preview: Preview = {
  decorators: [withFrontendCanvas, withProviders],
  loaders: [mswLoader],
  parameters: {
    msw: {
      handlers: mswHandlers,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
  },
  async beforeEach() {
    localStorage.setItem('payload-theme', 'light')
    MockDate.set('2025-06-11T12:00:00Z')
  },
}

export default preview
