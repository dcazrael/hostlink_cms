/**
 * Button is the primary action trigger for user interactions that do not
 * navigate to another route. Supports eight variants (default, outline,
 * secondary, ghost, destructive, link) plus optional CSS clip-path chamfer
 * on any corner.
 *
 * For navigation actions, use `<a>` or a routing component instead.
 *
 * @summary action trigger with variant and chamfer support
 */
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import {
  buildChamferClipPath,
  CHAMFER_DEPTH_CAPS,
  chamferButtonToneMap,
  clampChamferDepth,
  type ChamferCorner,
} from '@/components/ui/chamfer'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding text-xs font-semibold tracking-widest whitespace-nowrap uppercase transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        outline:
          'border-border bg-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-input/30',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        link: 'text-primary underline underline-offset-4 hover:underline',
      },
      size: {
        default:
          'h-10 gap-1.5 px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        xs: "h-7 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-9 gap-1 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        lg: 'h-11 gap-1.5 px-8 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5',
        icon: 'size-10',
        'icon-xs': "size-7 [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-9',
        'icon-lg': 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** Which corner receives the 45° chamfer cut. Defaults to `top-right`. */
    chamferCorner?: ChamferCorner
    /** Chamfer depth in Tailwind spacing units (4 = 1rem). 0 = no cut. Max depends on variant. */
    chamferDepth?: number
  }

function Button({
  className,
  variant = 'default',
  size = 'default',
  chamferCorner = 'top-right',
  chamferDepth = 0,
  style,
  children,
  ...props
}: ButtonProps) {
  const depth = clampChamferDepth(chamferDepth, CHAMFER_DEPTH_CAPS.button)
  const isChamfered = depth > 0 && variant !== 'link'

  const clipPath = isChamfered
    ? buildChamferClipPath([{ corner: chamferCorner, x: depth, y: depth }])
    : undefined

  const tone = chamferButtonToneMap[variant ?? 'default']

  return (
    <ButtonPrimitive
      data-slot="button"
      data-chamfer={isChamfered ? '' : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      style={
        isChamfered
          ? ({
              '--cf-fill': tone.fill,
              '--cf-stroke': tone.stroke,
              '--cf-inset': '1px',
              '--cf-clip': clipPath,
              background: 'transparent',
              ...style,
            } as React.CSSProperties & Record<string, string | undefined>)
          : style
      }
      {...props}
    >
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants, type ButtonProps }
