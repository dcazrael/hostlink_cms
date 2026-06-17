import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FAQStack } from './FAQ'

const meta: Meta<typeof FAQStack> = {
  title: 'Components/FAQ',
  component: FAQStack,
  parameters: { layout: 'padded' },
  args: {
    items: [
      {
        question: '夜間や休日も問い合わせ対応できますか？',
        answer: '24時間365日の体制で、ゲストからのメッセージやトラブル連絡を受け付けます。',
      },
      {
        question: '英語の問い合わせも任せられますか？',
        answer: '日本語と英語の両方で、AirbnbやBooking.comのゲスト対応を支援します。',
      },
      {
        question: '対応内容はどこまで含まれますか？',
        answer:
          'チェックイン案内、レビュー返信、緊急時の一次対応、オーナー様へのエスカレーションまで対応します。',
      },
    ],
  },
  argTypes: {
    items: {
      control: 'object',
    },
  },
}

export default meta

type Story = StoryObj<typeof FAQStack>

/**
 * Accordion-style FAQ stack with expandable questions.
 * Use for frequently-asked-questions sections that need a compact collapsed state.
 *
 * @summary expandable accordion FAQ list
 */
export const Accordion: Story = {
  name: 'Accordion preset',
}
