import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRight } from "lucide-react";
import { expect } from "storybook/test";
import { Button } from "./button";

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["ai-generated"],
  parameters: { layout: "centered" },
  args: {
    children: "Order now",
    variant: "default",
    size: "default",
    chamferCorner: "top-right",
    chamferDepth: 0,
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
    },
    chamferCorner: {
      control: "select",
      options: ["top-right", "top-left", "bottom-right", "bottom-left"],
      description: "Corner that receives the 45° chamfer cut.",
    },
    chamferDepth: {
      control: { type: "range", min: 0, max: 24, step: 1 },
      description:
        "Chamfer depth in Tailwind spacing units (4 = 1rem). 0 = no cut.",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Order now",
    chamferDepth: 4,
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /order now/i });
    await expect(button).toBeVisible();
  },
};

export const Secondary: Story = {
  args: {
    children: "Learn more",
    variant: "secondary",
    chamferDepth: 5,
  },
};

export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
    chamferDepth: 5,
  },
};

export const Outline: Story = {
  args: {
    children: "Cancel",
    variant: "outline",
    chamferDepth: 5,
  },
};

export const Ghost: Story = {
  args: { children: "Dismiss", variant: "ghost" },
};

export const Link: Story = {
  args: { children: "Terms apply", variant: "link" },
};

export const Small: Story = {
  args: {
    children: "OK",
    size: "sm",
    chamferDepth: 5,
  },
};

export const Large: Story = {
  args: {
    children: "Submit",
    size: "lg",
    chamferDepth: 5,
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        Continue
        <ArrowRight aria-hidden data-icon="inline-end" />
      </>
    ),
    chamferDepth: 5,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
    chamferDepth: 5,
  },
};

export const Chamfered: Story = {
  name: "Chamfered (top-right, 0.75em)",
  args: {
    children: "Get started",
    variant: "default",
    chamferCorner: "top-right",
    chamferDepth: 3,
  },
};

/**
 * Proves globals.css and Tailwind tokens actually loaded.
 * The default button variant uses `inline-flex items-center justify-center`,
 * so without CSS the display would be the UA default (inline-block).
 */
export const CssCheck: Story = {
  args: { children: "Check" },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /check/i });
    const style = getComputedStyle(button);
    // inline-flex confirms the Tailwind v4 utility resolved
    await expect(style.display).toBe("inline-flex");
  },
};
