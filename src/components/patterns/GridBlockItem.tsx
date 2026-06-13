import { cn } from '@/utilities/ui'
import {
  CircleAlert,
  Headphones,
  Mail,
  MoonStar,
  PencilLine,
  SquareArrowOutUpRight,
  UsersRound,
  Wifi,
  Zap,
} from 'lucide-react'
import * as React from 'react'
import { BulletList } from './BulletList'

export type GridBlockItemVariant = 'compact' | 'summary' | 'service'

export type GridBlockItemAccentTone = 'accent' | 'muted' | 'secondary' | 'primary' | 'subtle'

export type GridBlockItemRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

const PATTERN_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  'circle-alert': CircleAlert,
  headphones: Headphones,
  mail: Mail,
  'moon-star': MoonStar,
  'pencil-line': PencilLine,
  'square-arrow-out-up-right': SquareArrowOutUpRight,
  'users-round': UsersRound,
  wifi: Wifi,
  zap: Zap,
}

const RADIUS_CLASSES: Record<GridBlockItemRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
}

const ACCENT_CLASSES: Record<
  GridBlockItemAccentTone,
  {
    border: string
    text: string
    stroke: string
    gradientTo: string
  }
> = {
  accent: {
    border: 'border-accent',
    text: 'text-accent',
    stroke: 'stroke-accent',
    gradientTo: 'to-accent/10',
  },
  muted: {
    border: 'border-muted',
    text: 'text-muted',
    stroke: 'stroke-muted',
    gradientTo: 'to-muted/10',
  },
  secondary: {
    border: 'border-secondary',
    text: 'text-secondary',
    stroke: 'stroke-secondary',
    gradientTo: 'to-secondary/10',
  },
  primary: {
    border: 'border-primary',
    text: 'text-primary',
    stroke: 'stroke-primary',
    gradientTo: 'to-primary/10',
  },
  subtle: {
    border: 'border-border',
    text: 'text-muted-foreground',
    stroke: 'stroke-muted-foreground',
    gradientTo: 'to-border/10',
  },
}

const HexBadge: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="currentColor"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      fill="currentColor"
    />
  </svg>
)

const PatternIcon: React.FC<{ className?: string; name?: string | null }> = ({
  className,
  name,
}) => {
  if (!name) return null
  const Icon = PATTERN_ICONS[name]
  return Icon ? <Icon aria-hidden="true" className={className} /> : null
}

const CompactBody: React.FC<{
  iconName?: string | null
  title: string
  text: string
  accentTone: GridBlockItemAccentTone
  radius: GridBlockItemRadius
  className?: string
}> = ({ iconName, title, text, accentTone, radius, className }) => {
  const accent = ACCENT_CLASSES[accentTone]

  return (
    <div
      className={cn(
        'border border-border from-card bg-linear-to-br from-50% to-150% p-5 transition-colors duration-300 hover:from-0% hover:to-100%',
        accent.gradientTo,
        RADIUS_CLASSES[radius],
        className,
      )}
      data-testid="pattern-grid-item-compact"
    >
      <h3 className="inline-flex items-center gap-4 text-lg font-semibold">
        {iconName ? <PatternIcon className={cn('size-6', accent.stroke)} name={iconName} /> : null}
        <span className="whitespace-pre-line">{title}</span>
      </h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-muted-foreground">{text}</p>
    </div>
  )
}

const SummaryBody: React.FC<{
  iconName?: string | null
  title: string
  text: string
  accentTone: GridBlockItemAccentTone
  radius: GridBlockItemRadius
  className?: string
}> = ({ iconName, title, text, accentTone, radius, className }) => {
  const accent = ACCENT_CLASSES[accentTone]

  return (
    <div
      className={cn(
        'relative border-2 bg-card px-6 pb-7 pt-9 text-center',
        RADIUS_CLASSES[radius],
        accent.border,
        className,
      )}
      data-testid="pattern-grid-item-summary"
    >
      {iconName ? (
        <div
          className={cn(
            'absolute left-1/2 top-0 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 bg-card text-(--heading)',
            accent.border,
          )}
        >
          <PatternIcon className="size-8 stroke-[1.5]" name={iconName} />
        </div>
      ) : null}

      <h3 className="text-xl font-medium text-(--heading)">{title}</h3>

      <p
        className={cn(
          'mt-4 border-t pt-4 text-left text-sm leading-7 text-(--heading)',
          accent.border,
        )}
      >
        {text}
      </p>
    </div>
  )
}

const ServiceBody: React.FC<{
  iconName?: string | null
  title: string
  infoItems?: React.ReactNode[]
  text: string
  accentTone: GridBlockItemAccentTone
  radius: GridBlockItemRadius
  className?: string
}> = ({ iconName, title, infoItems, text, accentTone, radius, className }) => {
  const accent = ACCENT_CLASSES[accentTone]

  return (
    <div
      className={cn(
        'relative border-2 bg-card px-8 pb-8 pt-10 text-center',
        RADIUS_CLASSES[radius],
        accent.border,
        className,
      )}
      data-testid="pattern-grid-item-service"
    >
      {iconName ? (
        <div className="absolute left-1/2 top-0 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center">
          <HexBadge className={cn('absolute inset-0 h-full w-full', accent.text)} />
          <PatternIcon
            className="relative z-10 size-8 stroke-1 text-secondary-foreground"
            name={iconName}
          />
        </div>
      ) : null}

      <h3 className="text-2xl font-medium text-(--heading)">{title}</h3>

      {infoItems && infoItems.length > 0 ? (
        <div
          className={cn(
            'mx-auto mt-4 max-w-64 border-y py-3 text-left text-sm font-medium text-(--heading)',
            accent.border,
          )}
        >
          <BulletList items={infoItems} shape="circle" />
        </div>
      ) : null}

      <p className="mt-4 text-left text-base leading-8 text-(--heading)">{text}</p>
    </div>
  )
}

export type GridBlockItemProps = {
  variant: GridBlockItemVariant
  iconName?: string | null
  title: string
  text: string
  infoItems?: React.ReactNode[]
  borderRadius?: GridBlockItemRadius
  accentTone?: GridBlockItemAccentTone
  className?: string
}

export type GridBlockItemData = Omit<GridBlockItemProps, 'className'>

export const GridBlockItem: React.FC<GridBlockItemProps> = ({
  variant,
  iconName,
  title,
  text,
  infoItems,
  borderRadius = 'xl',
  accentTone = 'accent',
  className,
}) => {
  if (variant === 'compact') {
    return (
      <CompactBody
        className={className}
        iconName={iconName}
        text={text}
        title={title}
        accentTone={accentTone}
        radius={borderRadius}
      />
    )
  }
  if (variant === 'service') {
    return (
      <ServiceBody
        accentTone={accentTone}
        className={className}
        iconName={iconName}
        infoItems={infoItems}
        radius={borderRadius}
        text={text}
        title={title}
      />
    )
  }
  return (
    <SummaryBody
      accentTone={accentTone}
      className={className}
      iconName={iconName}
      radius={borderRadius}
      text={text}
      title={title}
    />
  )
}
