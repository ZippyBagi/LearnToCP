import "server-only";
import { cache } from "react";
import fs from "fs";
import path from "path";
import type { RoadmapItem, RoadmapMatrix } from "@/app/[locale]/roadmap/roadmap.types";
import { DEFAULT_LOCALE } from "@/app/utils/getLessonRoot";
import { stripOrderPrefix } from "@/app/utils/generateSidebarContainers";
import { resolveLessonLocale, safeDecode } from "@/app/utils/resolveLessonLocale";

// Fallback slug for content missing an explicit id (e.g. "03 Binary Search" → "binary-search").
function slugify(name: string): string {
  return name
    .replace(/^[0-9]+\s*/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Item files are key:value lines. `<locale>-name` lines hold per-locale display
 * labels; the canonical (base-locale) label comes from the filename.
 *   sr-name: Binarna Pretraga
 *   id: binary-search
 *   href: /Theory/Optimization Techniques I/Binary Search
 */
function parseItemFile(raw: string): Record<string, string> {
  const parsed: Record<string, string> = {};
  for (const line of raw.trim().split("\n")) {
    const m = line.trim().match(/^([\w-]+):\s*(.+)$/);
    if (m) parsed[m[1]] = m[2].trim();
  }
  return parsed;
}

function readNodeMeta(
  nodePath: string,
  dirName: string,
  locale: string,
): { id: string; title: string } {
  const fallbackTitle = stripOrderPrefix(dirName);
  try {
    const meta = JSON.parse(fs.readFileSync(path.join(nodePath, "meta.json"), "utf-8"));
    const id = typeof meta.id === "string" && meta.id ? meta.id : slugify(dirName);
    const localized = meta[`${locale}-name`];
    const title = typeof localized === "string" && localized ? localized : fallbackTitle;
    if (!(typeof meta.id === "string" && meta.id)) {
      console.warn(`[getRoadmapMatrix] No meta.json id for node "${dirName}" — falling back to title. Renaming this directory will reset user progress.`);
    }
    return { id, title };
  } catch {
    console.warn(`[getRoadmapMatrix] Missing/invalid meta.json for node "${dirName}" — falling back to title. Renaming this directory will reset user progress.`);
    return { id: slugify(dirName), title: fallbackTitle };
  }
}

function localeHref(rawHref: string, locale: string): string {
  if (rawHref.startsWith("http")) return rawHref;

  const prefixed = `/${locale}${rawHref.startsWith("/") ? "" : "/"}${rawHref}`;

  // Base locale: the stored href is already in the canonical (base) language.
  if (locale === DEFAULT_LOCALE) return prefixed;

  // Non-base locale: translate Theory links to the equivalent lesson via the
  // shared smart-redirect resolver (the single source of truth lives in the base locale).
  const segments = rawHref.split("/").filter(Boolean);
  if (segments.length >= 3 && segments[0] === "Theory") {
    const groupSlug = safeDecode(segments[segments.length - 2]);
    const pageSlug = safeDecode(segments[segments.length - 1]);
    const resolved = resolveLessonLocale(DEFAULT_LOCALE, groupSlug, pageSlug, locale);
    if (resolved) {
      return `/${locale}/Theory/${encodeURIComponent(resolved.groupSlug)}/${encodeURIComponent(resolved.pageSlug)}`;
    }
    console.warn(`[getRoadmapMatrix] No "${locale}" equivalent for "${rawHref}" — falling back to base-locale path.`);
  }

  return prefixed;
}

// cache() dedupes disk reads — roadmap page and any future consumer share one read per locale
export const getRoadmapMatrix = cache((locale: string): RoadmapMatrix => {
  const ROADMAP_DATA_DIR = path.join(process.cwd(), "content", "roadmap_data");

  if (!fs.existsSync(ROADMAP_DATA_DIR)) {
    console.warn(`[getRoadmapMatrix] Directory not found: ${ROADMAP_DATA_DIR}`);
    return [];
  }

  const layerDirs = fs
    .readdirSync(ROADMAP_DATA_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^L\d+$/.test(e.name))
    .sort((a, b) => {
      const n = (name: string) => parseInt(name.slice(1), 10);
      return n(a.name) - n(b.name);
    });

  return layerDirs.map((layerDir) => {
    const layerPath = path.join(ROADMAP_DATA_DIR, layerDir.name);
    const nodeDirs = fs
      .readdirSync(layerPath, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));

    return nodeDirs.map((nodeDir) => {
      const nodePath = path.join(layerPath, nodeDir.name);
      const { id: nodeId, title } = readNodeMeta(nodePath, nodeDir.name, locale);

      const items = fs
        .readdirSync(nodePath, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith(".txt"))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((file) => {
          const parsed = parseItemFile(fs.readFileSync(path.join(nodePath, file.name), "utf-8"));
          const fileBase = file.name.replace(/\.txt$/, "");

          if (!parsed.id) {
            console.warn(`[getRoadmapMatrix] No id in "${nodeDir.name}/${file.name}" — falling back to filename slug. Renaming this file will reset user progress.`);
          }

          const label = parsed[`${locale}-name`] ?? stripOrderPrefix(fileBase);

          const type: RoadmapItem["type"] =
            parsed.type === "problem" ? "problem" : "theory";
          const rawHref = parsed.href ?? "#";
          // Problem solved-status is keyed by slug — the last path segment of
          // /Problems/<slug>. Decode in case the stored href is encoded.
          const slug =
            type === "problem"
              ? safeDecode(rawHref.split("/").filter(Boolean).pop() ?? "")
              : undefined;

          return {
            id: parsed.id ?? slugify(fileBase),
            label,
            href: localeHref(rawHref, locale),
            type,
            slug,
          };
        });

      return { id: nodeId, title, items };
    });
  });
});
