import localFont from 'next/font/local'

export const ZenKakuGothicNew = localFont({
  src: [
    {
      path: '../../public/fonts/Zen_Kaku_Gothic_New/ZenKakuGothicNew-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Zen_Kaku_Gothic_New/ZenKakuGothicNew-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Zen_Kaku_Gothic_New/ZenKakuGothicNew-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Zen_Kaku_Gothic_New/ZenKakuGothicNew-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Zen_Kaku_Gothic_New/ZenKakuGothicNew-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-zen-kaku',
  display: 'swap',
})
