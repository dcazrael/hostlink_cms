import React from 'react'

import type { TranslateFn } from '@/i18n/createTranslator'

import { ChatMockClient, type ChatMessage } from './ChatMockClient'

export const ChatMock: React.FC<{ t: TranslateFn }> = ({ t }) => {
  const messages: ChatMessage[] = [
    {
      avatarAlt: 'Guest Avatar',
      avatarClassName: 'size-9',
      avatarSrc: '/account_avatars/user_1.svg',
      id: 'guest-1',
      side: 'guest',
      text: t('homepage.hero.chat.message1'),
      time: t('homepage.hero.chat.time1'),
    },
    {
      avatarAlt: 'HostLink Operator Avatar',
      avatarClassName: 'size-11',
      avatarSrc: '/hostlink-icon.svg',
      id: 'hostlink-1',
      side: 'host',
      text: t('homepage.hero.chat.message2'),
      time: t('homepage.hero.chat.time2'),
    },
    {
      avatarAlt: 'Guest Avatar',
      avatarClassName: 'size-9',
      avatarSrc: '/account_avatars/user_1.svg',
      id: 'guest-2',
      side: 'guest',
      text: t('homepage.hero.chat.message3'),
      time: t('homepage.hero.chat.time3'),
    },
  ]

  return (
    <ChatMockClient
      inputPlaceholder={t('homepage.hero.chat.inputplaceholder')}
      messages={messages}
      overlayHeadline={t('homepage.hero.chat.overlay.headline')}
      overlayText={t('homepage.hero.chat.overlay.text')}
      title={t('homepage.hero.chat.title')}
    />
  )
}
