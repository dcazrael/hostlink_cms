import * as React from 'react'
import { cn } from '@/utilities/ui'

/**
 * Clamp a numeric value to the [0, 1] range. Used to defensively guard
 * the `navyOpacity` prop against out-of-range values.
 */
const clampOpacity = (value: number): number => Math.max(0, Math.min(1, value))

/**
 * Pre-composed image-frame variants that match the three hostlink
 * pamphlet photo compositions (mint wedge, photo, navy stripe).
 *
 * Each variant specifies three independent polygons (mint, photo clip-path,
 * navy) — they do not tile the frame. Outside the photo's clip-path,
 * the parent figure's background shows through.
 *
 * Variant geometry was exported from Inkscape as SVG, cleaned with svgomg,
 * and embedded in `VARIANTS` below. Each variant has its own viewBox, so
 * each has its own aspect ratio.
 */
export type ImageFrameVariant = 'hero-stripe' | 'stacked-bands' | 'framed-overlay'

/**
 * Geometry for a single variant. Each variant has its own viewBox so
 * the photo's clip-path polygon (CSS percentages) aligns with the
 * mint and navy SVG paths (viewBox units).
 */
type VariantGeometry = {
  /** SVG viewBox width and height for the mint and navy layers. */
  viewBox: { width: number; height: number }
  /** CSS clip-path polygon for the photo (percentage vertices). */
  photoClip: string
  /** SVG path strings for the mint polygon(s), drawn first (bottom). */
  mint: string[]
  /** SVG path strings for the navy polygon(s), drawn last (top). */
  navy: string[]
  /** Default navy overlay opacity (0–1). */
  navyOpacity: number
}

const VARIANTS: Record<ImageFrameVariant, VariantGeometry> = {
  // Reference: living-room photo with navy diagonal stripe + mint wedge.
  'hero-stripe': {
    viewBox: { width: 736.7, height: 1022.4 },
    photoClip:
      'polygon(103.43% 81.67%, 82.80% 81.67%, 8.42% 44.50%, 8.42% 0.29%, 31.22% 0.29%, 103.43% 39.02%)',
    mint: ['m666 1083-664 4V311l60 48v96l548 380h56z', 'm782 479-20-16v-64L302 63V35l480 348z'],
    navy: ['M666 835h-56L62 455v-96l604 420z', 'M762 463 302 123V55l460 344z'],
    navyOpacity: 1.0,
  },
  // Reference: photo of two people with mint top + navy stripe + photo.
  'stacked-bands': {
    viewBox: { width: 623.6, height: 827.7 },
    photoClip:
      'polygon(100.06% 100.04%, 80.02% 100.04%, 9.14% 57.99%, 9.14% 5.44%, 51.48% 5.44%, 100.06% 30.32%)',
    mint: ['M0 828V347l57 39v94l434 340h57v8', 'M560 215 297 38V0l283 189v26'],
    navy: ['M548 820h-57L57 480v-94l491 370'],
    navyOpacity: 0.5,
  },
  // Reference: hands photo with tiny mint corner + semi-transparent navy overlay.
  'framed-overlay': {
    viewBox: { width: 453.5, height: 328.8 },
    photoClip:
      'polygon(12.57% 69.34%, 43.22% 100.06%, 100.11% 100.06%, 100.11% 40.15%, 54.24% 0%, 12.57% 0%)',
    mint: ['M107 265H0V57l57 39v132z'],
    navy: ['M291 265H108l-51-37V96z'],
    navyOpacity: 0.5,
  },
}

/**
 * `ImageFrame` renders a real photograph surrounded by decorative mint and
 * navy polygons. The layers stack as follows:
 *
 * 1. **Mint polygon** (bottom): opaque mint fill drawn as an SVG path.
 * 2. **Photo** (middle): `<img>` clip-pathed to a CSS polygon.
 * 3. **Navy polygon** (top): SVG path, optionally semi-transparent.
 * 4. **Caption** (optional, bottom of figure): rendered as `<figcaption>`
 *    when the `caption` prop is provided.
 *
 * Use `objectPosition` to set the photo's focus point inside its
 * clip-path (e.g., `"70% 30%"` keeps the upper-right of the photo visible
 * when the clip-path crops the rest).
 *
 * @summary layered photo with mint wedge and navy overlay
 */
export const ImageFrame: React.FC<{
  /**
   * Which pre-composed variant to render. Each variant has its own
   * mint/navy geometry, photo clip-path, and default navy opacity.
   */
  variant: ImageFrameVariant
  /**
   * Image source URL passed to the underlying `<img>` element.
   */
  src: string
  /**
   * Alt text for the photo. Required for accessibility — the photo
   * carries the meaning of the composition.
   */
  alt: string
  /**
   * Optional caption rendered as a `<figcaption>` inside the figure.
   * When omitted, no caption element is rendered.
   */
  caption?: string
  /**
   * Override the variant's default navy overlay opacity.
   * 0 = invisible, 1 = fully opaque. Values outside this range are clamped.
   */
  navyOpacity?: number
  /**
   * CSS `object-position` for the photo inside its clip-path.
   * Controls which part of the photo survives the clip-path crop.
   */
  objectPosition?: string
  /**
   * Additional classes appended to the root `<figure>` element.
   */
  className?: string
}> = ({ variant, src, alt, caption, navyOpacity, objectPosition = '50% 50%', className }) => {
  const { viewBox, photoClip, mint, navy, navyOpacity: defaultNavyOpacity } = VARIANTS[variant]
  const opacity = clampOpacity(navyOpacity ?? defaultNavyOpacity)
  const viewBoxAttr = `0 0 ${viewBox.width} ${viewBox.height}`

  return (
    <figure
      className={cn('relative overflow-hidden', className)}
      style={{ aspectRatio: `${viewBox.width} / ${viewBox.height}` }}
    >
      {/* Layer 1: Mint polygon (bottom) */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full"
        viewBox={viewBoxAttr}
        preserveAspectRatio="xMidYMid slice"
      >
        {mint.map((d, index) => (
          <path key={`mint-${index}`} d={d} fill="var(--accent)" />
        ))}
      </svg>

      {/* Layer 2: Photo (middle, clip-pathed) */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 size-full object-cover"
        style={{ clipPath: photoClip, objectPosition }}
      />

      {/* Layer 3: Navy polygon (top) */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full"
        viewBox={viewBoxAttr}
        preserveAspectRatio="xMidYMid slice"
      >
        {navy.map((d, index) => (
          <path key={`navy-${index}`} d={d} fill="var(--secondary)" fillOpacity={opacity} />
        ))}
      </svg>

      {/* Layer 4: Optional caption */}
      {caption ? (
        <figcaption className="absolute bottom-0 left-0 right-0 bg-card/80 p-2 font-mono text-xs uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

export default ImageFrame
