/**
 * Shared 5-tone palette for the hostlink pattern layer.
 *
 * The vocabulary is the single source of truth for the five
 * visual tones that the patterns layer uses. Components map these
 * tones to their own surface, text, and border classes; they do
 * not invent new tone names.
 *
 *  card     — neutral surface (card background, muted text)
 *  navy     — high-contrast dark (secondary)
 *  mint     — brand accent (accent / mint)
 *  primary  — link / focus color
 *  subtle   — hairline / muted (border, muted-foreground)
 */
export type PatternTone = 'card' | 'navy' | 'mint' | 'primary' | 'subtle'

export const PATTERN_TONES: readonly PatternTone[] = ['card', 'navy', 'mint', 'primary', 'subtle']

export type PatternToneClasses = {
  background: string
  text: string
  border: string
}

export const PATTERN_TONE_CLASSES: Record<PatternTone, PatternToneClasses> = {
  card: {
    background: 'bg-card',
    text: 'text-card-foreground',
    border: 'border-border',
  },
  navy: {
    background: 'bg-secondary',
    text: 'text-secondary-foreground',
    border: 'border-secondary',
  },
  mint: {
    background: 'bg-accent',
    text: 'text-accent-foreground',
    border: 'border-accent',
  },
  primary: {
    background: 'bg-primary',
    text: 'text-primary-foreground',
    border: 'border-primary',
  },
  subtle: {
    background: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
  },
}
