import type { Decorator, Preview } from '@storybook/react'
import { useLayoutEffect } from 'react'

import './preview.css'

import MockDate from 'mockdate'
import { mswLoader } from 'msw-storybook-addon/csf3'
import { setupWorker } from 'msw/browser'
import { HeaderThemeProvider } from '../src/providers/HeaderTheme'
import { ThemeProvider } from '../src/providers/Theme'
import { mswHandlers } from './msw-handlers'

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
  tags: ['autodocs'],
  loaders: [
    mswLoader(async () => {
      const worker = setupWorker()
      await worker.start({ onUnhandledRequest: 'bypass' })
      return worker
    }),
  ],
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
