import { Circle, Moon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import type { TranslateFn } from '@/i18n/createTranslator'

export const ChatMock: React.FC<{ t: TranslateFn }> = ({ t }) => {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm antialiased">
      <div className="rounded-t-2xl border-b bg-background px-5 py-3 flex items-center justify-between text-gray-700">
        <div className="flex gap-2">
          <Circle className="text-red-300 fill-red-300 size-3.5" />
          <Circle className="text-amber-300 fill-amber-300 size-3.5" />
          <Circle className="text-green-300 fill-green-300 size-3.5" />
        </div>
        <p className="text-sm font-medium">{t('homepage.hero.chat.title')}</p>
      </div>
      <div className="mt-4 space-y-6 p-4">
        <div className="max-w-[85%] space-y-2">
          <div className="flex gap-2 items-center">
            <Image
              src="/account_avatars/user_1.svg"
              alt="Guest Avatar"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="w-fit rounded-xl bg-background px-3 py-2">
              {t('homepage.hero.chat.message1')}
            </div>
          </div>
          <div className="text-xs text-muted w-fit">{t('homepage.hero.chat.time1')}</div>
        </div>
        <div className="ml-auto space-y-1.5">
          <div className="flex gap-2 items-center">
            <Image
              src="/hostlink-icon.svg"
              alt="HostLink Operator Avatar"
              width={44}
              height={44}
              className="rounded-full"
            />
            <div className="w-fit max-w-[85%] rounded-xl bg-primary px-3 py-2 ">
              {t('homepage.hero.chat.message2')}
            </div>
          </div>
          <div className="text-xs text-muted ml-auto w-fit">{t('homepage.hero.chat.time2')}</div>
        </div>
        <div className="max-w-[85%] space-y-2">
          <div className="flex gap-2 items-center">
            <Image
              src="/account_avatars/user_1.svg"
              alt="Guest Avatar"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="w-fit rounded-xl bg-background px-3 py-2">
              {t('homepage.hero.chat.message3')}
            </div>
          </div>
          <div className="text-xs text-muted w-fit">{t('homepage.hero.chat.time3')}</div>
        </div>
      </div>
      <div className="rounded-b-2xl relative border-t bg-background px-5 py-3 flex items-center justify-between text-gray-700">
        <input
          className="rounded-full w-full border border-border bg-card px-3 py-2 text-sm text-foreground"
          placeholder={t('homepage.hero.chat.inputplaceholder')}
        />
        <div className="flex items-center gap-3 absolute right-2 md:-right-4 2xl:-right-16 -bottom-16 bg-card px-4 py-3 md:px-6 md:py-4.5 xl:px-8 xl:py-6 rounded-2xl border-border border shadow-lg text-foreground cursor-pointer">
          <Moon className="size-6" />
          <div className="flex flex-col">
            <div className="font-bold text-base md:text-lg tracking-widest">
              {t('homepage.hero.chat.overlay.headline')}
            </div>
            <div className="text-sm md:text-base text-muted-foreground">
              {t('homepage.hero.chat.overlay.text')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
