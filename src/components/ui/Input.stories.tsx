import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Input } from './input'

const meta = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    placeholder: 'Enter your email',
    type: 'email',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
    'aria-invalid': { control: 'boolean' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Enter your email' },
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Enter your email')
    await expect(input).toBeVisible()
  },
}

export const WithValue: Story = {
  args: { defaultValue: 'hello@example.com', readOnly: true },
}

export const Password: Story = {
  args: { type: 'password', placeholder: '••••••••' },
}

export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Disabled input' },
}

export const WithError: Story = {
  args: { 'aria-invalid': true, defaultValue: 'bad-email' },
}
