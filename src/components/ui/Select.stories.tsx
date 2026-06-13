import type { Meta, StoryObj } from '@storybook/react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select'

const meta = {
  title: 'Primitives/Select',
  component: Select,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    defaultValue: 'Professional',
  },
  argTypes: {
    defaultValue: {
      control: 'select',
      options: ['Starter', 'Professional', 'Enterprise'],
      description: 'Pre-selected value for the preselected story.',
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-72">
        <SelectValue placeholder="Choose a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Plans</SelectLabel>
          <SelectItem value="Starter">Starter</SelectItem>
          <SelectItem value="Professional">Professional</SelectItem>
          <SelectItem value="Enterprise">Enterprise</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const WithPreselected: Story = {
  render: (args) => (
    <Select defaultValue={args.defaultValue}>
      <SelectTrigger className="w-72">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Plans</SelectLabel>
          <SelectItem value="Starter">Starter</SelectItem>
          <SelectItem value="Professional">Professional</SelectItem>
          <SelectItem value="Enterprise">Enterprise</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}
