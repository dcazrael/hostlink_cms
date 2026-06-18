import * as React from 'react'
import { cn } from '@/utilities/ui'
import type { Media as MediaType } from '@/payload-types'

/**
 * Pre-generated size names from the Payload `Media` collection's
 * `imageSizes` config (see `src/collections/Media.ts`). Each name maps
 * to a server-rendered derivative in `media.sizes[name].url`.
 */
export type ImageSize = 'thumbnail' | 'square' | 'small' | 'medium' | 'large' | 'xlarge' | 'og'

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
  /**
   * Default `object-position` for the photo inside its clip-path.
   * The `objectPosition` prop overrides this. All three variants use
   * `50% 50%` for now; per-variant focal points can be tuned later.
   */
  objectPosition: string
}

const VARIANTS: Record<ImageFrameVariant, VariantGeometry> = {
  // Reference: living-room photo with navy diagonal stripe + mint wedge.
  'hero-stripe': {
    viewBox: { width: 1043.2, height: 632.2 },
    photoClip:
      'polygon(99.21% 89.37%, 87.52% 89.37%, 8.24% 52.51%, 8.24% 0%, 31.35% 0%, 99.21% 33.37%)',
    mint: ['M957 631 0 632V270l86 27v35l827 233h44z', 'm1043 238-8 12v-39L431 36V19l612 183z'],
    navy: ['M957 565h-44L86 332v-35l871 246z', 'M1035 250 431 71V31l604 180z'],
    navyOpacity: 1.0,
    objectPosition: '50% 50%',
  },
  // Reference: photo of two people with mint top + navy stripe + photo.
  'stacked-bands': {
    viewBox: { width: 1122.5, height: 631.4 },
    photoClip:
      'polygon(100.04% 99.94%, 80.00% 99.94%, 9.09% 57.97%, 9.09% 5.54%, 51.49% 5.54%, 100.04% 30.41%)',
    mint: ['M0 631V296l102 30v40l782 260h102v5', 'M1008 164 534 29V0l511 144v20'],
    navy: ['M986 626H884L102 366v-40l884 282'],
    navyOpacity: 0.5,
    objectPosition: '50% 50%',
  },
  // Reference: hands photo with tiny mint corner + semi-transparent navy overlay.
  'framed-overlay': {
    viewBox: { width: 453.5, height: 328.8 },
    photoClip:
      'polygon(12.57% 69.34%, 43.22% 100.06%, 100.11% 100.06%, 100.11% 40.15%, 54.24% 0%, 12.57% 0%)',
    mint: ['M107 265H0V57l57 39v132z'],
    navy: ['M291 265H108l-51-37V96z'],
    navyOpacity: 0.5,
    objectPosition: '50% 50%',
  },
}

/**
 * `ImageFrame` renders a real photograph surrounded by decorative mint and
 * navy polygons. The three layers stack:
 *
 * 1. **Mint polygon** (bottom): opaque mint fill drawn as an SVG path.
 * 2. **Photo** (middle): `<img>` rendered with `object-fit: cover` so it
 *    scales to fill the figure. The `objectPosition` (driven by the
 *    Media's focal point or the variant default) controls which part of
 *    the photo is visible. The `zoom` prop applies a `transform: scale()`
 *    on top of cover, allowing the user to zoom in/out around the focal
 *    point.
 * 3. **Navy polygon** (top): SVG path, optionally semi-transparent.
 * 4. (Optional) `<figcaption>` overlay.
 *
 * The figure's aspect ratio is set per-variant from the variant's viewBox.
 *
 * Use `objectPosition` to set the photo's focal point inside its
 * clip-path (e.g., `"70% 30%"` keeps the upper-right of the photo visible
 * when the clip-path crops the rest). Use `zoom` to scale the image
 * around the focal point (e.g., `zoom={1.5}` zooms 1.5x toward the focal
 * point).
 *
 * @summary layered photo with mint wedge and navy overlay
 */

/**
 * Compute the image's width/height/left/top so the focal point sits
 * at the wrapper's center. The image is rendered at its natural size
 * scaled by `zoom`, positioned so the focal point is anchored to the
 * wrapper's center.
 *
 * Without this, `object-fit: cover` constrains the image to the wrapper
 * box and `transform: scale()` distorts the clip-path. Sizing the image
 * explicitly gives full 2D control.
 */
const getImageStyle = (
  src: string,
  focalPoint: string,
  zoom: number,
  naturalSize: { width: number; height: number } | null,
): React.CSSProperties => {
  // If we don't know the natural size, fall back to 100% (won't have
  // 2D focal control, but at least renders)
  if (!naturalSize) {
    return {
      width: '100%',
      height: '100%',
      inset: '0px',
      objectPosition: focalPoint,
    }
  }

  const [fxPct, fyPct] = focalPoint.split(' ').map((s) => parseFloat(s) || 0)
  // Round to integers to avoid floating-point noise in the rendered
  // style (e.g. 1400 * 0.7 = 979.9999999999999 in JS). CSS subpixel
  // precision is invisible in practice.
  const displayW = Math.round(naturalSize.width * zoom)
  const displayH = Math.round(naturalSize.height * zoom)
  const offsetX = Math.round(displayW * (fxPct / 100))
  const offsetY = Math.round(displayH * (fyPct / 100))

  return {
    width: `${displayW}px`,
    height: `${displayH}px`,
    // Center the focal point in the wrapper
    left: `calc(50% - ${offsetX}px)`,
    top: `calc(50% - ${offsetY}px)`,
    objectPosition: focalPoint,
    maxWidth: 'none', // override the class default
  }
}

export const ImageFrame: React.FC<{
  /**
   * Which pre-composed variant to render. Each variant has its own
   * mint/navy geometry, photo clip-path, and default navy opacity.
   */
  variant: ImageFrameVariant
  /**
   * Image source: a Payload `Media` object (with focal point and
   * pre-generated sizes) OR a plain URL string. When a Media object is
   * provided, the focal point (`focalX`/`focalY`) and the size URL are
   * auto-extracted unless overridden via `objectPosition` or `size`.
   */
  media?: MediaType | string | null
  /**
   * Plain URL fallback. Used when `media` is a string or null. For new
   * code, prefer passing the Media object via `media`.
   */
  src?: string
  /**
   * Alt text. Required for accessibility. Falls back to `media.alt` when
   * `media` is a Media object and `alt` is not explicitly provided.
   */
  alt?: string
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
   * CSS `object-position` for the photo inside its clip-path. Controls
   * which part of the photo survives the clip-path crop. Overrides the
   * focal point from a Media object's `focalX`/`focalY`.
   */
  objectPosition?: string
  /**
   * Zoom factor for the photo. 1.0 = natural size relative to the figure
   * (via `object-fit: cover`). Values > 1.0 zoom in (giving the focal
   * point more room to move in both axes). Values < 1.0 zoom out.
   *
   * Applied as `transform: scale(zoom)` on the image, with `transform-origin`
   * set to the focal point. The focal point stays fixed as the image scales.
   *
   * Clamped to [0.3, 1.5] to prevent extreme values.
   *
   * @summary photo zoom factor
   */
  zoom?: number
  /**
   * Which pre-generated Payload size to use. Only applies when `media` is
   * a Media object. Default: 'large'. Each variant of `sizes` is generated
   * server-side by Payload based on `src/collections/Media.ts`.
   */
  size?: ImageSize
  /**
   * Additional classes appended to the root `<figure>` element.
   */
  className?: string
}> = ({
  variant,
  media,
  src,
  alt,
  caption,
  navyOpacity,
  objectPosition,
  zoom = 1,
  size = 'large',
  className,
}) => {
  // Resolve source: prefer the Media object's pre-generated size URL,
  // then the Media's original URL, then a string `media`, then the `src` prop.
  const isMediaObject = typeof media === 'object' && media !== null && !Array.isArray(media)

  const resolvedSrc: string | undefined = isMediaObject
    ? (media.sizes?.[size]?.url ?? media.url ?? undefined)
    : typeof media === 'string'
      ? media
      : src

  // Resolve alt: explicit `alt` prop wins, then `media.alt`, then fall
  // back to `src` so the rendered img always has an `alt` attribute.
  const resolvedAlt: string | undefined = alt ?? (isMediaObject ? media.alt : undefined) ?? src

  // Resolve focal point: explicit `objectPosition` prop wins, then the
  // Media object's `focalX`/`focalY` (as percentages).
  const resolvedFocal: string | undefined =
    objectPosition ??
    (isMediaObject && media.focalX != null && media.focalY != null
      ? `${media.focalX}% ${media.focalY}%`
      : undefined)

  const {
    viewBox,
    photoClip,
    mint,
    navy,
    navyOpacity: defaultNavyOpacity,
    objectPosition: variantDefaultObjectPosition,
  } = VARIANTS[variant]
  const opacity = clampOpacity(navyOpacity ?? defaultNavyOpacity)
  // Resolution order for the photo's object-position:
  //   1. Explicit `objectPosition` prop
  //   2. Media focal point (`focalX`/`focalY`)
  //   3. Variant default
  const focusPoint = resolvedFocal ?? variantDefaultObjectPosition
  const viewBoxAttr = `0 0 ${viewBox.width} ${viewBox.height}`
  // Clamp zoom to a sensible range so users can't break the layout by
  // accidentally zooming 1000x. Scale happens around the focal point
  // (see img style below), so the focal point stays anchored as the
  // image scales.
  const clampedZoom = Math.max(0.3, Math.min(1.5, zoom))

  // Determine the natural size from the Media object (best) or fall back
  // to the requested size's width/height (less accurate but works for
  // string URLs where we don't know the source).
  const naturalSize: { width: number; height: number } | null = isMediaObject
    ? media.sizes?.[size]?.width && media.sizes?.[size]?.height
      ? { width: media.sizes[size].width!, height: media.sizes[size].height! }
      : media.width && media.height
        ? { width: media.width, height: media.height }
        : null
    : null // unknown for string URLs

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

      {/* Layer 2: Photo (middle, clip-pathed)
       *
       * The wrapper holds the clip-path in figure coordinates. The inner
       * image is rendered at a calculated size and position so the focal
       * point sits at the wrapper's center. The wrapper's overflow + clip-path
       * then crop the result. No transform is used (transform would also
       * scale the clip-path, breaking the variant geometry).
       */}
      <div className="absolute inset-0" style={{ clipPath: photoClip }}>
        {resolvedSrc ? (
          <img
            src={resolvedSrc}
            alt={resolvedAlt ?? ''}
            className="absolute max-w-none"
            style={getImageStyle(resolvedSrc, focusPoint, clampedZoom, naturalSize)}
          />
        ) : null}
      </div>

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
