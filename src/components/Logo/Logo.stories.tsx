import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Logo } from './Logo'

const meta = {
  component: Logo,
  tags: ['ai-generated'],
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const img = canvas.getByRole('img', { name: /hostlink logo/i })
    await expect(img).toBeVisible()
    await expect(img).toHaveAttribute('src', '/logo.svg')
    await expect(img).toHaveAttribute('width', '300')
  },
}
