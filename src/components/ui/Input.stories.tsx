import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { Input } from './input'

const meta = {
  title: 'Atoms/Input',
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

/**
 * Default input with placeholder text.
 * Use as the baseline representation of an email input field.
 *
 * @summary default email input with placeholder
 */
export const Default: Story = {
  args: { placeholder: 'Enter your email' },
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Enter your email')
    await expect(input).toBeVisible()
  },
}

/**
 * Pre-filled input with a readOnly value.
 * Use to show existing data or read-only field content.
 *
 * @summary pre-filled read-only value
 */
export const WithValue: Story = {
  args: { defaultValue: 'hello@example.com', readOnly: true },
}

/**
 * Password input with masked characters.
 * Use for password or sensitive data entry.
 *
 * @summary masked password input
 */
export const Password: Story = {
  args: { type: 'password', placeholder: '••••••••' },
}

/**
 * Disabled input — non-interactive, reduced styling.
 * Use to indicate a field is temporarily unavailable.
 *
 * @summary disabled non-interactive field
 */
export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Disabled input' },
}

/**
 * Input in an error state with aria-invalid.
 * Use to highlight validation failures after form submission.
 *
 * @summary validation error state
 */
export const WithError: Story = {
  args: { 'aria-invalid': true, defaultValue: 'bad-email' },
}
