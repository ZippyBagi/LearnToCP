import "server-only";
import fs from "node:fs";
import { findEmbeds } from "@/app/utils/figureSyntax.mjs";
import { getFigure } from "@/app/utils/imageManifest";
import { SITE_URL } from "@/app/utils/seo";

/**
 * Extract the figures a lesson embeds, resolved to absolute URLs, without
 * rendering the markdown. Feeds `app/sitemap.ts` (image entries per lesson) and
 * the lesson page's `ImageObject` structured data.
 *
 * Discovery is the point: crawlers do not execute the page to find figures, so
 * the sitemap is the most direct signal that these images belong to this page.
 */

export interface MarkdownFigure {
  /** Absolute URL of the static image file. */
  url: string;
  /** Author-supplied alt text. Empty for decorative figures. */
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

/**
 * @param filePath Absolute path to a markdown file.
 * @param locale   Used to pick the caption from figures.json.
 */
export function figuresInMarkdown(
  filePath: string,
  locale: string,
): MarkdownFigure[] {
  let source: string;
  try {
    source = fs.readFileSync(filePath, "utf8");
  } catch {
    return [];
  }

  return figuresInSource(source, locale);
}

/** Same, for markdown already in memory. */
export function figuresInSource(
  source: string,
  locale: string,
): MarkdownFigure[] {
  const out: MarkdownFigure[] = [];
  const seen = new Set<string>();

  // Embeds inside code samples are shown as code, not rendered, so they must
  // not be advertised either. Matches how mdToHTML protects fences first.
  const prose = source
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "")
    .replace(/`[^`\n]+`/g, "");

  for (const embed of findEmbeds(prose)) {
    const figure = getFigure(embed.basename);
    if (!figure) continue;

    // Decorative figures carry alt="" and are hidden from assistive tech, so
    // advertising them for image search would be inconsistent.
    if (embed.decorative) continue;

    // A lesson may embed the same figure more than once. One sitemap entry.
    if (seen.has(figure.url)) continue;
    seen.add(figure.url);

    out.push({
      url: `${SITE_URL}${figure.url}`,
      alt: embed.alt ?? "",
      width: figure.width,
      height: figure.height,
      caption: figure.caption?.[locale],
    });
  }

  return out;
}
