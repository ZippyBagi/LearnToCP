/**
 * Canonical parser for Obsidian image embeds: `![[file.png|...|...]]`.
 *
 * Shared by `mdToHTML.tsx` (rendering) and `figuresInMarkdown.ts` (sitemap and
 * structured data) so both always agree on what an embed means.
 *
 * Plain `.mjs` rather than `.ts` so it can run under bare `node` when debugging
 * content. `tsconfig.json` has `allowJs` and includes .mjs, so it is still
 * type-checked.
 *
 * Syntax, with order-insensitive pipe segments — a bare number (or NxN) is a
 * size, `!decorative` is the ornamental marker, the first remaining segment is
 * alt text. That matches Obsidian, where a non-numeric pipe value is the
 * embed's display text, so an embed reads the same in the vault and on the site:
 *
 *   ![[graph.png|A tree of 7 cities]]       alt text
 *   ![[graph.png|A tree of 7 cities|420]]   alt + width
 *   ![[graph.png|!decorative]]              alt="" + role="presentation"
 */

/** Marks a purely ornamental image: renders alt="" so screen readers skip it.
 *  Distinct from an author forgetting alt text, which fails the build. */
export const DECORATIVE = "!decorative";

export const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "svg", "webp"];

/**
 * Captures leading tabs (the indent) and the raw inner body.
 *
 * Three parts do real work:
 *   - `[^|\]\n]+?\.(ext)` is the target. Barring `]` here is what keeps a note
 *     embed on the same line from being swallowed into an image match, and the
 *     extension is what separates the two syntaxes in the first place.
 *   - `\|[^\n]*?` is the pipe body, lazy and permissive: alt text describing
 *     code is full of brackets ("labelled a[0] through a[4]").
 *   - `\]\](?!\])` closes on the last `]]` of a run rather than the first, so
 *     alt text ending in a bracket keeps it instead of losing it to the
 *     terminator.
 */
const EMBED_SOURCE = String.raw`(^[\t]*)?!\[\[([^|\]\n]+?\.(?:${IMAGE_EXTENSIONS.join(
  "|",
)})(?:\|[^\n]*?)?)\]\](?!\])`;

/** A fresh regex per call. Global regexes carry a mutable `lastIndex`, so a
 *  shared instance would make results depend on call order. */
export const embedPattern = () => new RegExp(EMBED_SOURCE, "gim");

const SIZE_RE = /^(\d+)(?:x(\d+))?$/;

/**
 * @typedef {object} ParsedEmbed
 * @property {string}  target      Raw target as written, e.g. "img/graph.png".
 * @property {string}  basename    Filename only, e.g. "graph.png".
 * @property {string=} alt         Author-supplied alt text, if any.
 * @property {boolean} decorative  True when the decorative sentinel is present.
 * @property {number=} width       Author-supplied display width, if any.
 * @property {number=} height      Author-supplied display height, if any.
 * @property {number}  indent      Count of leading tabs on the source line.
 */

/**
 * Parse the inner body of an embed (everything between `![[` and `]]`).
 *
 * @param {string} body
 * @param {number} [indent]
 * @returns {ParsedEmbed}
 */
export function parseEmbedBody(body, indent = 0) {
  const [target, ...segments] = body.split("|").map((s) => s.trim());

  /** @type {ParsedEmbed} */
  const result = {
    target,
    basename: target.replace(/^\.\//, "").split("/").pop() ?? target,
    decorative: false,
    indent,
  };

  for (const segment of segments) {
    if (!segment) continue;

    if (segment === DECORATIVE) {
      result.decorative = true;
      continue;
    }

    const size = SIZE_RE.exec(segment);
    if (size) {
      result.width = Number(size[1]);
      if (size[2]) result.height = Number(size[2]);
      continue;
    }

    // First non-size, non-sentinel segment is the alt text. Later ones are
    // dropped rather than joined — concatenating stray pipes would produce alt
    // text no one wrote.
    if (result.alt === undefined) result.alt = segment;
  }

  return result;
}

/**
 * Find every image embed in a markdown source string.
 *
 * @param {string} markdown
 * @returns {Array<ParsedEmbed & { raw: string, index: number }>}
 */
export function findEmbeds(markdown) {
  const out = [];
  const re = embedPattern();
  let match;
  while ((match = re.exec(markdown)) !== null) {
    const tabs = match[1] ?? "";
    out.push({
      ...parseEmbedBody(match[2], tabs.length),
      raw: match[0],
      index: match.index,
    });
  }
  return out;
}
