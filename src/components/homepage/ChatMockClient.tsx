'use client'

import { Circle, Moon, SendHorizonal } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

export type ChatMessage = {
  avatarAlt: string
  avatarClassName: string
  avatarSrc: string
  id: string
  side: 'guest' | 'host'
  text: string
  time: string
}

type ChatStage = {
  message: ChatMessage
}

const typingSpeedBySide: Record<ChatMessage['side'], number> = {
  guest: 70,
  host: 46,
}

const pauseBeforeSend = 360
const guestToHostTypingStartDelay = 3000
const guestToHostSendDelay = 10000
const pauseAfterHostMessage = 20000
const resetDelay = 120000

export const ChatMockClient: React.FC<{
  inputPlaceholder: string
  messages: ChatMessage[]
  overlayHeadline: string
  overlayText: string
  title: string
}> = ({ inputPlaceholder, messages, overlayHeadline, overlayText, title }) => {
  const stages = useMemo<ChatStage[]>(() => messages.map((message) => ({ message })), [messages])
  const [cycle, setCycle] = useState(0)
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([])
  const [draftText, setDraftText] = useState('')
  const [draftSide, setDraftSide] = useState<ChatMessage['side'] | null>(null)
  const [typingSide, setTypingSide] = useState<ChatMessage['side'] | null>(null)
  const [isReadyToSend, setIsReadyToSend] = useState(false)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    const clearAllTimers = () => {
      for (const timer of timersRef.current) window.clearTimeout(timer)
      timersRef.current = []
    }

    let isCancelled = false

    const scheduleTimeout = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        if (isCancelled) return
        callback()
      }, delay)

      timersRef.current.push(timer)
    }

    const runStage = (index: number) => {
      if (index >= stages.length) {
        setDraftText('')
        setDraftSide(null)
        setIsReadyToSend(false)
        scheduleTimeout(() => {
          setVisibleMessages([])
          setCycle((current) => current + 1)
        }, resetDelay)
        return
      }

      const { message } = stages[index]
      const previousMessage = index > 0 ? stages[index - 1]?.message : null
      const defaultTypingDuration = message.text.length * typingSpeedBySide[message.side]
      const typingDuration =
        previousMessage?.side === 'guest' && message.side === 'host'
          ? Math.max(guestToHostSendDelay - guestToHostTypingStartDelay - pauseBeforeSend, 800)
          : defaultTypingDuration
      const characterDelay =
        message.text.length > 0 ? Math.max(Math.floor(typingDuration / message.text.length), 24) : 0

      setDraftText('')
      setIsReadyToSend(false)

      if (message.side === 'host') {
        setTypingSide(null)
        setDraftSide('host')
        for (let characterIndex = 1; characterIndex <= message.text.length; characterIndex += 1) {
          scheduleTimeout(() => {
            setDraftText(message.text.slice(0, characterIndex))
          }, characterIndex * characterDelay)
        }

        scheduleTimeout(() => {
          setIsReadyToSend(true)
        }, typingDuration)
      } else {
        setDraftSide(null)
        setTypingSide('guest')
      }

      scheduleTimeout(() => {
        setVisibleMessages((current) => [...current, message])
        setDraftText('')
        setDraftSide(null)
        setTypingSide(null)
        setIsReadyToSend(false)
      }, typingDuration + pauseBeforeSend)

      const pauseAfterSend =
        message.side === 'guest' ? guestToHostTypingStartDelay : pauseAfterHostMessage

      scheduleTimeout(
        () => {
          runStage(index + 1)
        },
        typingDuration + pauseBeforeSend + pauseAfterSend,
      )
    }

    setVisibleMessages([])
    setDraftText('')
    setDraftSide(null)
    setTypingSide(null)
    setIsReadyToSend(false)
    runStage(0)

    return () => {
      isCancelled = true
      clearAllTimers()
    }
  }, [cycle, stages])

  return (
    <>
      <div className="flex h-136 flex-col rounded-2xl border border-border bg-card shadow-sm antialiased">
        <div className="flex items-center justify-between rounded-t-2xl border-b bg-background px-5 py-3 text-gray-700">
          <div className="flex gap-2">
            <Circle className="size-3.5 fill-red-300 text-red-300" />
            <Circle className="size-3.5 fill-amber-300 text-amber-300" />
            <Circle className="size-3.5 fill-green-300 text-green-300" />
          </div>
          <p className="text-sm font-medium">{title}</p>
        </div>

        <div className="mt-4 flex flex-1 flex-col justify-end overflow-hidden p-4">
          <div className="space-y-6">
            {visibleMessages.map((message, index) => {
              const isHost = message.side === 'host'

              return (
                <div
                  className={cn(
                    'max-w-[85%] space-y-2 transition duration-500 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3',
                    isHost && 'ml-auto',
                  )}
                  key={message.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={cn('flex items-end gap-2', isHost && 'flex-row-reverse')}>
                    <Image
                      alt={message.avatarAlt}
                      className={cn('rounded-full ring-1 ring-border/60', message.avatarClassName)}
                      height={44}
                      src={message.avatarSrc}
                      width={44}
                    />
                    <div
                      className={cn(
                        'w-fit rounded-2xl px-3 py-2 shadow-sm',
                        isHost
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border bg-background text-foreground',
                      )}
                    >
                      {message.text}
                    </div>
                  </div>
                  <div className={cn('w-fit text-xs text-muted-foreground', isHost && 'ml-auto')}>
                    {message.time}
                  </div>
                </div>
              )
            })}
            {typingSide === 'guest' ? (
              <div className="max-w-[85%] space-y-2">
                <div className="flex items-end gap-2">
                  <Image
                    alt="Guest Avatar"
                    className="size-9 rounded-full ring-1 ring-border/60"
                    height={36}
                    src="/account_avatars/user_1.svg"
                    width={36}
                  />
                  <div className="rounded-2xl border border-border bg-background px-3 py-2 shadow-sm">
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((dot) => (
                        <span
                          className="size-1.5 rounded-full bg-current opacity-45 motion-safe:animate-bounce"
                          key={dot}
                          style={{ animationDelay: `${dot * 140}ms`, animationDuration: '1s' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="relative flex items-center justify-between rounded-b-2xl border-t bg-background px-5 py-3 text-gray-700">
          <div className="relative w-full">
            <textarea
              className="max-h-28 min-h-11 w-full resize-none overflow-y-auto rounded-3xl border border-border bg-card px-3 py-2.5 pr-12 text-sm leading-5 text-foreground"
              placeholder={inputPlaceholder}
              readOnly
              rows={1}
              value={draftText}
            />
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full transition-colors duration-300',
                  draftSide === 'host'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground',
                  isReadyToSend && 'scale-100 shadow-sm',
                )}
              >
                <SendHorizonal
                  className={cn(
                    'size-4 transition-transform duration-200',
                    isReadyToSend && 'translate-x-0.5 -translate-y-0.5',
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-foreground shadow-lg md:px-6 md:py-4.5 xl:px-8 xl:py-6 w-fit mt-2 ml-auto">
        <Moon className="size-6" />
        <div className="flex flex-col">
          <div className="text-base font-bold tracking-widest md:text-lg">{overlayHeadline}</div>
          <div className="text-sm text-muted-foreground md:text-base">{overlayText}</div>
        </div>
      </div>
    </>
  )
}
