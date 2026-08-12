import "server-only";
import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

/**
 * Build-time index of every lesson/problem figure: where it is served from,
 * its intrinsic pixel size, and any sidecar metadata.
 *
 * Intrinsic dimensions are the reason this exists. Emitting `width` and
 * `height` on the `<img>` lets the browser reserve the right box before the
 * bytes arrive, which is what keeps figures from shoving the lesson text
 * around as they load.
 *
 * Dimensions come from `image-size` rather than a hand-rolled header parser.
 * That is not a dependency taken lightly — it is a correctness requirement.
 * All three JPEGs in this repo are progressive (SOF2), which a naive scan for
 * the SOF0 marker misses entirely, and EXIF-rotated photos report their
 * pre-rotation dimensions unless the orientation tag is applied.
 *
 * Everything is read once and memoised at module scope. Pages are statically
 * generated, so this runs during `next build` and never in a request path.
 */

/**
 * The one and only home for figure files. They live under `public/` so the
 * browser fetches them straight off the CDN as static assets, with no build
 * step copying them anywhere and no second copy to drift out of sync.
 */
const IMAGES_DIR = path.join(process.cwd(), "public", "lesson-images");

/** Root-relative URL prefix, matching the directory above. */
export const IMAGES_URL_PREFIX = "/lesson-images";

/** Optional sidecar for the things the inline pipe syntax cannot carry.
 *  Lives beside the images it describes. */
const FIGURES_JSON = path.join(IMAGES_DIR, "figures.json");

export interface FigureInfo {
  /** Path relative to IMAGES_DIR, e.g. "bfs-rings.png". */
  relativePath: string;
  /** Root-relative URL of the static file. */
  url: string;
  /** Intrinsic pixel width, orientation applied. */
  width: number;
  /** Intrinsic pixel height, orientation applied. */
  height: number;
  /** SVGs bypass the optimizer — it cannot usefully rasterise them, and
   *  enabling `dangerouslyAllowSVG` to let it try is an XSS surface for zero
   *  benefit. */
  isSvg: boolean;
  /** Optional caption, keyed by locale, from figures.json. */
  caption?: Record<string, string>;
}

type Sidecar = Record<string, { caption?: Record<string, string> }>;

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
]);

/** Extract width/height from an SVG's own attributes, falling back to the
 *  viewBox. Many hand-authored SVGs carry only a viewBox, or express
 *  width/height as percentages, which say nothing about aspect ratio. */
function svgDimensions(file: string): { width: number; height: number } | null {
  let source: string;
  try {
    source = fs.readFileSync(file, "utf8").slice(0, 4096);
  } catch {
    return null;
  }

  const attr = (name: string): number | null => {
    const match = new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i").exec(
      source,
    );
    if (!match) return null;
    const value = parseFloat(match[1]);
    // A percentage is relative to the viewport, not an intrinsic size.
    if (!Number.isFinite(value) || match[1].includes("%")) return null;
    return value;
  };

  const width = attr("width");
  const height = attr("height");
  if (width && height) return { width, height };

  const viewBox = /\bviewBox\s*=\s*["']([^"']+)["']/i.exec(source);
  if (viewBox) {
    const parts = viewBox[1].trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
      return { width: parts[2], height: parts[3] };
    }
  }

  return null;
}

function readSidecar(): Sidecar {
  let raw: string;
  try {
    raw = fs.readFileSync(FIGURES_JSON, "utf8");
  } catch {
    return {}; // absent, which is the normal case
  }

  try {
    return JSON.parse(raw) as Sidecar;
  } catch (err) {
    // Present but malformed. Failing loudly beats silently dropping every
    // caption on the site.
    throw new Error(
      `figures.json is not valid JSON: ${(err as Error).message}`,
    );
  }
}

function walk(dir: string, base: string = dir): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const out: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(abs, base));
    else if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      out.push(abs);
    }
  }
  return out;
}

function build(): Map<string, FigureInfo> {
  const sidecar = readSidecar();
  const index = new Map<string, FigureInfo>();

  for (const abs of walk(IMAGES_DIR)) {
    const relativePath = path
      .relative(IMAGES_DIR, abs)
      .split(path.sep)
      .join("/");
    const basename = path.basename(relativePath);

    // Obsidian embeds address images by basename alone — `![[graph.png]]`
    // carries no directory — so two files sharing a basename could never be
    // told apart. Fail rather than silently resolve to whichever was walked
    // first.
    const clash = index.get(basename);
    if (clash && clash.relativePath !== relativePath) {
      throw new Error(
        `Two figures share the basename "${basename}" ` +
          `(${clash.relativePath} and ${relativePath}). Wikilink embeds cannot ` +
          `distinguish them — rename one.`,
      );
    }
    const isSvg = path.extname(relativePath).toLowerCase() === ".svg";

    let width = 0;
    let height = 0;

    if (isSvg) {
      const dims = svgDimensions(abs);
      if (dims) ({ width, height } = dims);
    } else {
      try {
        const result = imageSize(fs.readFileSync(abs));
        width = result.width;
        height = result.height;
        // image-size reports the EXIF orientation but deliberately does not
        // apply it. Values 5-8 mean the image is stored rotated a quarter
        // turn, so the stored width is the displayed height.
        if (result.orientation && result.orientation >= 5) {
          [width, height] = [height, width];
        }
      } catch {
        // Unreadable or corrupt — leave at 0 so buildFigure omits the
        // dimension attributes rather than asserting a wrong aspect ratio.
      }
    }

    index.set(basename, {
      relativePath,
      url: `${IMAGES_URL_PREFIX}/${relativePath
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`,
      width,
      height,
      isSvg,
      caption: sidecar[basename]?.caption,
    });
  }

  return index;
}

let cache: Map<string, FigureInfo> | null = null;

/** The whole index, built on first use. */
export function figureIndex(): Map<string, FigureInfo> {
  if (!cache) cache = build();
  return cache;
}

/**
 * Look up a figure by the basename an Obsidian embed refers to.
 *
 * Basename addressing is a constraint inherited from the wikilink syntax:
 * `![[graph.png]]` carries no directory, so two files sharing a basename could
 * never be told apart. `build()` throws when that happens, which is why this
 * can safely key on basename alone.
 */
export function getFigure(basename: string): FigureInfo | undefined {
  return figureIndex().get(basename);
}
