'use client'

import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      remove: (widgetID: string) => void
      render: (
        container: HTMLElement,
        options: {
          callback: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
          sitekey: string
          theme?: 'auto' | 'dark' | 'light'
        },
      ) => string
    }
  }
}

type TurnstileChallengeProps = {
  onError?: () => void
  onToken: (token: string) => void
  siteKey: string
}

const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script'
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

const loadTurnstileScript = async (): Promise<void> => {
  if (typeof window === 'undefined') return
  if (window.turnstile) return

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Turnstile')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.id = TURNSTILE_SCRIPT_ID
    script.src = TURNSTILE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Turnstile'))

    document.head.appendChild(script)
  })
}

export const TurnstileChallenge: React.FC<TurnstileChallengeProps> = ({ onError, onToken, siteKey }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIDRef = useRef<string | null>(null)
  const onErrorRef = useRef(onError)
  const onTokenRef = useRef(onToken)

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      if (!siteKey || !containerRef.current) return

      try {
        await loadTurnstileScript()
      } catch {
        if (mounted) onError?.()
        return
      }

      if (!mounted || !window.turnstile || !containerRef.current) return

      widgetIDRef.current = window.turnstile.render(containerRef.current, {
        callback: (token) => {
          onTokenRef.current(token)
        },
        'error-callback': () => {
          onTokenRef.current('')
          onErrorRef.current?.()
        },
        'expired-callback': () => {
          onTokenRef.current('')
        },
        sitekey: siteKey,
        theme: 'auto',
      })
    }

    void init()

    return () => {
      mounted = false
      if (widgetIDRef.current && window.turnstile) {
        window.turnstile.remove(widgetIDRef.current)
        widgetIDRef.current = null
      }
    }
  }, [siteKey])

  return <div ref={containerRef} />
}
