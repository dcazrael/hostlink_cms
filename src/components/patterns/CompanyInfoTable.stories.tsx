import type { Meta, StoryObj } from '@storybook/react'
import { CompanyInfoTable } from './CompanyInfoTable'

const meta: Meta<typeof CompanyInfoTable> = {
  title: 'Components/CompanyInfoTable',
  component: CompanyInfoTable,
  parameters: { layout: 'padded' },
  args: {
    items: [
      { label: '会社名', value: 'HostLink' },
      { label: '代表者', value: '代表取締役　前田 真実' },
      { label: '所在地', value: '〒901-1511\n沖縄県南城市\n知念久手堅-737-1' },
      { label: 'サービス内容', value: 'ゲストサポート・\n電話対応・\nレビュー支援' },
      { label: '対応言語', value: '日本語・英語' },
      { label: '対応時間', value: '24時間365日' },
      { label: '対応OTA', value: 'Airbnb・\nBooking.com' },
    ],
    labelHeader: '項目',
    valueHeader: '内容',
  },
  argTypes: {
    items: { control: 'object' },
    labelHeader: { control: 'text' },
    valueHeader: { control: 'text' },
    className: { table: { disable: true } },
  },
}

export default meta

type Story = StoryObj<typeof CompanyInfoTable>

export const HostlinkInfo: Story = {
  name: 'Hostlink company info',
}
