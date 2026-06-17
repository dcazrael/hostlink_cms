import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Checkbox } from './checkbox'
import { Label } from './label'
import React from 'react'

const meta = {
  title: 'Atoms/Checkbox & Label',
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

/**
 * Unchecked checkbox with a visible label.
 * Use as the default state for an optional agreement or toggle.
 *
 * @summary unchecked checkbox with label
 */
export const Default: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" disabled={args.disabled} />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

/**
 * Checked checkbox in its default (enabled) state.
 * Use to show a pre-accepted term or remembered preference.
 *
 * @summary checked enabled state
 */
export const Checked: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="remember" defaultChecked disabled={args.disabled} />
      <Label htmlFor="remember">Remember me</Label>
    </div>
  ),
}

/**
 * Disabled unchecked checkbox — non-interactive.
 * Use to indicate the option exists but cannot be changed.
 *
 * @summary disabled state
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="disabled-option" disabled />
      <Label htmlFor="disabled-option">Disabled option</Label>
    </div>
  ),
}

/**
 * Disabled and checked together — a committed setting that cannot be undone.
 * Use for mandatory terms or system-enforced options.
 *
 * @summary disabled and checked together
 */
export const DisabledChecked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="disabled-checked" disabled defaultChecked />
      <Label htmlFor="disabled-checked">Disabled & checked</Label>
    </div>
  ),
}
