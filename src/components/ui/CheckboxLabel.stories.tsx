import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './checkbox'
import { Label } from './label'
import React from 'react'

const meta = {
  title: 'Primitives/Checkbox & Label',
  component: Checkbox,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
  },
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" disabled={args.disabled} />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const Checked: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="remember" defaultChecked disabled={args.disabled} />
      <Label htmlFor="remember">Remember me</Label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="disabled-option" disabled />
      <Label htmlFor="disabled-option">Disabled option</Label>
    </div>
  ),
}

export const DisabledChecked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="disabled-checked" disabled defaultChecked />
      <Label htmlFor="disabled-checked">Disabled & checked</Label>
    </div>
  ),
}
