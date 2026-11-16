import type { Meta, StoryObj } from '@storybook/nextjs-vite'

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
  title: 'Atoms/Select',
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

/**
 * Default select with no pre-selected value, showing placeholder text.
 * Use for choosing a plan or option from a list when no default applies.
 *
 * @summary unselected dropdown with placeholder
 */
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

/**
 * Select with a pre-selected default value.
 * Use when the form has a sensible default that most users will accept.
 *
 * @summary pre-selected default value
 */
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
