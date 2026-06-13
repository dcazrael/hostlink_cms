import type { Meta, StoryObj } from '@storybook/react'
import { GridBlock, type GridBlockColumns, type GridBlockProps } from './GridBlock'
import {
  type GridBlockItemAccentTone,
  type GridBlockItemData,
  type GridBlockItemRadius,
  type GridBlockItemVariant,
} from './GridBlockItem'

type GridBlockStoryArgs = Partial<React.ComponentProps<typeof GridBlock>> & {
  variant: GridBlockItemVariant
  borderRadius: GridBlockItemRadius
  accentTone: GridBlockItemAccentTone
}

const VARIANT_OPTIONS = ['compact', 'summary', 'service'] satisfies GridBlockItemVariant[]
const RADIUS_OPTIONS = ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']
const ACCENT_OPTIONS = [
  'accent',
  'muted',
  'secondary',
  'primary',
  'subtle',
] satisfies GridBlockItemAccentTone[]

const meta: Meta<GridBlockStoryArgs> = {
  title: 'Patterns/GridBlock',
  component: GridBlock as unknown as React.ComponentType<GridBlockStoryArgs>,
  parameters: { layout: 'padded' },
  args: {
    columns: '2',
    variant: 'service',
    borderRadius: 'xl',
    accentTone: 'accent',
  },
  argTypes: {
    columns: {
      control: 'inline-radio',
      options: ['2', '3', '4'],
      table: { disable: true },
    },
    variant: {
      control: 'inline-radio',
      options: VARIANT_OPTIONS,
    },
    borderRadius: {
      control: 'inline-radio',
      options: RADIUS_OPTIONS,
    },
    accentTone: {
      control: 'inline-radio',
      options: ACCENT_OPTIONS,
    },
    items: {
      table: { disable: true },
    },
    className: {
      table: { disable: true },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

const GRID_ITEM_CONTENT: GridBlockItemData[] = [
  {
    variant: 'service',
    iconName: 'mail',
    title: 'メッセージサポート',
    infoItems: ['Airbnb対応', 'Booking.com対応', '24時間対応', '日本語・英語対応'],
    text: 'ゲストからの問い合わせに24時間対応し、迅速かつ丁寧なコミュニケーションを提供します。',
  },
  {
    variant: 'service',
    iconName: 'headphones',
    title: '電話サポート',
    infoItems: ['ゲストからの電話対応', '緊急時の一次対応', 'チェックインサポート', 'トラブル受付'],
    text: '深夜や休日の電話にも対応し、オーナー様の負担を軽減します。',
  },
  {
    variant: 'service',
    iconName: 'wifi',
    title: '情報管理サポート',
    infoItems: ['Wi-Fi情報管理', '設備情報管理', 'ハウスルール管理', 'チェックイン情報管理'],
    text: '物件ごとの情報を整理し、問い合わせ対応に必要な情報を一元管理します。',
  },
  {
    variant: 'service',
    iconName: 'users-round',
    title: '対応品質の標準化',
    infoItems: ['回答テンプレート管理', '対応履歴の確認', '担当者間の共有', 'エスカレーション整理'],
    text: '担当者ごとの回答品質のばらつきを抑え、安定したゲスト対応を実現します。',
  },
]

const buildGridItems = (count: 2 | 3 | 4, args: GridBlockStoryArgs): GridBlockItemData[] =>
  GRID_ITEM_CONTENT.slice(0, count).map((item) => ({
    ...item,
    variant: args.variant,
    borderRadius: args.borderRadius,
    accentTone: args.accentTone,
  }))

export const GridTwoItems: Story = {
  name: 'Grid · 2 items',
  args: {
    columns: '2',
    variant: 'compact',
    borderRadius: 'sm',
  },
  render: (args) => (
    <GridBlock
      accentTone={args.accentTone}
      borderRadius={args.borderRadius}
      columns="2"
      items={buildGridItems(2, args)}
    />
  ),
}

export const GridThreeItems: Story = {
  name: 'Grid · 3 items',
  args: {
    columns: '3',
    variant: 'compact',
  },
  render: (args) => (
    <GridBlock
      accentTone={args.accentTone}
      borderRadius={args.borderRadius}
      columns="3"
      items={buildGridItems(3, args)}
    />
  ),
}

export const GridFourItems: Story = {
  name: 'Grid · 4 items',
  args: {
    columns: '4',
    borderRadius: '2xl',
    accentTone: 'primary',
  },
  render: (args) => (
    <GridBlock
      accentTone={args.accentTone}
      borderRadius={args.borderRadius}
      columns="4"
      items={buildGridItems(4, args)}
    />
  ),
}
