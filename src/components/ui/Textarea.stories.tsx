import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Textarea } from './textarea'

const meta = {
  title: 'Primitives/Textarea',
  component: Textarea,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    placeholder: 'Write your message here…',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    'aria-invalid': { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Write your message here…' },
  play: async ({ canvas }) => {
    const textarea = canvas.getByPlaceholderText('Write your message here…')
    await expect(textarea).toBeVisible()
  },
}

export const WithContent: Story = {
  args: { defaultValue: 'This is a saved note.', readOnly: true },
}

export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Disabled textarea' },
}
