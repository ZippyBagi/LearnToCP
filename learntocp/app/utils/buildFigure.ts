import "server-only";
import { getFigure, IMAGES_URL_PREFIX } from "@/app/utils/imageManifest";

/**
 * Turn a parsed image embed into the final `<figure>` HTML.
 *
 * Lesson bodies are injected with `dangerouslySetInnerHTML`, so `next/image`
 * (a React component) cannot be used. `/_next/image` is a plain HTTP endpoint
 * though, so building its URL by hand gets AVIF/WebP conversion and responsive
 * resizing without restructuring the markdown pipeline into React.
 *
 * The optimizer returns 400 unless next.config.ts agrees: DEVICE_SIZES must be
 * a subset of `images.deviceSizes`, and QUALITY must appear in
 * `images.qualities`. Keep both in sync.
 */

export interface ParsedEmbed {
  target: string;
  basename: string;
  alt?: string;
  decorative: boolean;
  width?: number;
  height?: number;
  indent: number;
}

const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048] as const;
const QUALITY = 75;

/** Lesson column width: full bleed under the navbar on phones, minus the
 *  sidebar and padding on desktop. Only lesson content embeds figures. */
const FIGURE_SIZES =
  "(max-width: 767px) calc(100vw - 1.5rem), (max-width: 1200px) calc(100vw - 20rem), 900px";

const escapeAttr = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function optimizedUrl(src: string, width: number): string {
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(QUALITY),
  });
  return `/_next/image?${params.toString()}`;
}

/**
 * Every device size up to and including the first that reaches the intrinsic
 * width. Going further re-encodes the same pixels into a bigger file; stopping
 * one step short leaves high-DPI screens without the sharpest option the
 * source can actually support.
 */
function candidateWidths(intrinsicWidth: number): number[] {
  const widths: number[] = [];
  for (const size of DEVICE_SIZES) {
    widths.push(size);
    if (size >= intrinsicWidth) break;
  }
  return widths;
}

/**
 * Throws during `next build`, warns in `next dev` so an author is not
 * interrupted mid-edit. There is deliberately no alt-text fallback: a filename
 * turned into prose ("bfs-rings.png" → "BFS rings") is keyword mush that reads
 * as intentional to a crawler while describing nothing.
 */
function reportProblem(message: string): void {
  if (process.env.NODE_ENV === "production") throw new Error(message);
  console.warn(`[figures] ${message}`);
}

export interface BuildFigureOptions {
  /** Locale, used to pick the caption from figures.json. */
  locale: string;
  /** Rem of left offset per leading tab in the source. */
  indentRemPerTab: number;
}

/**
 * Render one embed as `<figure>` HTML.
 *
 * Every image is `loading="lazy"`, with no exceptions. Marking the first figure
 * eager is tempting, but on a lesson page it is usually several screens below
 * the fold, and a high-priority fetch for an offscreen image competes with the
 * real LCP element. Promote a specific page only after measuring it.
 */
export function buildFigure(
  embed: ParsedEmbed,
  options: BuildFigureOptions,
): string {
  const { locale, indentRemPerTab } = options;
  const found = getFigure(embed.basename);

  if (!found) {
    reportProblem(
      `![[${embed.target}]] refers to an image that does not exist in ` +
        `public/lesson-images.`,
    );
  } else if (!embed.decorative && !embed.alt) {
    reportProblem(
      `![[${embed.target}]] has no alt text. Write it as ` +
        `![[${embed.basename}|what the figure shows]], or mark the image ` +
        `ornamental with ![[${embed.basename}|!decorative]].`,
    );
  }

  const src =
    found?.url ?? `${IMAGES_URL_PREFIX}/${encodeURIComponent(embed.basename)}`;

  // Unreadable dimensions mean no width/height at all: a wrong aspect ratio
  // shifts layout worse than reserving nothing. SVGs keep their dimensions but
  // skip the optimizer, which cannot usefully rasterise them.
  const intrinsic = found && found.width > 0 && found.height > 0 ? found : null;
  const optimizable = intrinsic && !intrinsic.isSvg ? intrinsic : null;

  const attrs: string[] = [];

  if (!optimizable) {
    attrs.push(`src="${escapeAttr(src)}"`);
  } else {
    const widths = candidateWidths(optimizable.width);
    attrs.push(
      `src="${escapeAttr(optimizedUrl(src, widths[widths.length - 1]))}"`,
    );
    // One candidate is just the src restated, so skip srcset/sizes entirely.
    if (widths.length > 1) {
      const srcset = widths
        .map((w) => `${escapeAttr(optimizedUrl(src, w))} ${w}w`)
        .join(", ");
      attrs.push(`srcset="${srcset}"`, `sizes="${FIGURE_SIZES}"`);
    }
  }

  // Author-supplied display size wins over intrinsic, but intrinsic still
  // supplies the aspect ratio when only a width was given.
  if (embed.width && embed.height) {
    attrs.push(`width="${embed.width}"`, `height="${embed.height}"`);
  } else if (embed.width && intrinsic) {
    const height = Math.round(
      (embed.width * intrinsic.height) / intrinsic.width,
    );
    attrs.push(`width="${embed.width}"`, `height="${height}"`);
  } else if (intrinsic) {
    attrs.push(`width="${intrinsic.width}"`, `height="${intrinsic.height}"`);
  }

  attrs.push(`alt="${escapeAttr(embed.decorative ? "" : (embed.alt ?? ""))}"`);
  attrs.push(`loading="lazy"`, `decoding="async"`);
  if (embed.decorative) attrs.push(`role="presentation"`);
  attrs.push(`class="lesson-figure-img"`);

  const caption = found?.caption?.[locale];
  const captionHtml = caption
    ? `<figcaption class="lesson-figure-caption">${escapeAttr(caption)}</figcaption>`
    : "";

  const indentStyle =
    embed.indent > 0
      ? ` style="margin-left:${embed.indent * indentRemPerTab}rem"`
      : "";

  return (
    `<figure class="lesson-figure" data-indent="${embed.indent}"${indentStyle}>` +
    `<img ${attrs.join(" ")}>` +
    captionHtml +
    `</figure>`
  );
}
