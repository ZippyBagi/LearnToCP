import "server-only";
import { cache } from "react";
import fs from "fs";
import path from "path";
import type { RoadmapMatrix } from "@/app/[locale]/roadmap/roadmap.types";

// Fallback slug for content missing an explicit id (e.g. "03 Binary Search" → "binary-search").
function slugify(name: string): string {
  return name
    .replace(/^[0-9]+\s*/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Item files are key:value lines:
 *   id: binary-search
 *   href: /Theory/Elementary Techniques/Binary Search
 */
function parseItemFile(raw: string): { id?: string; href?: string } {
  const lines = raw.trim().split("\n").map((l) => l.trim()).filter(Boolean);
  const parsed: { id?: string; href?: string } = {};
  for (const line of lines) {
    const m = line.match(/^(id|href):\s*(.+)$/);
    if (m) parsed[m[1] as "id" | "href"] = m[2].trim();
    else if (!parsed.href) parsed.href = line; // legacy: bare href
  }
  return parsed;
}

function readNodeId(nodePath: string, dirName: string): string {
  const metaPath = path.join(nodePath, "meta.json");
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    if (typeof meta.id === "string" && meta.id) return meta.id;
  } catch {
    // missing/invalid meta.json — fall through to slug
  }
  console.warn(`[getRoadmapMatrix] No meta.json id for node "${dirName}" — falling back to filename slug. Renaming this directory will reset user progress.`);
  return slugify(dirName);
}

// cache() dedupes disk reads — roadmap page and any future consumer share one read per locale
export const getRoadmapMatrix = cache((locale: string): RoadmapMatrix => {
  const ROADMAP_DATA_DIR = path.join(process.cwd(), "content", locale, "roadmap_data");

  const finalDir = fs.existsSync(ROADMAP_DATA_DIR)
    ? ROADMAP_DATA_DIR
    : path.join(process.cwd(), "content", "en", "roadmap_data");

  if (!fs.existsSync(finalDir)) {
    console.warn(`[getRoadmapMatrix] Directory not found: ${finalDir}`);
    return [];
  }

  const layerDirs = fs
    .readdirSync(finalDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^L\d+$/.test(e.name))
    .sort((a, b) => {
      const n = (name: string) => parseInt(name.slice(1), 10);
      return n(a.name) - n(b.name);
    });

  return layerDirs.map((layerDir) => {
    const layerPath = path.join(finalDir, layerDir.name);
    const nodeDirs = fs
      .readdirSync(layerPath, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));

    return nodeDirs.map((nodeDir) => {
      const nodePath = path.join(layerPath, nodeDir.name);
      const nodeId = readNodeId(nodePath, nodeDir.name);

      const items = fs
        .readdirSync(nodePath, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith(".txt"))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((file) => {
          const raw = fs.readFileSync(path.join(nodePath, file.name), "utf-8");
          const { id, href } = parseItemFile(raw);
          const rawHref = href ?? "#";

          if (!id) {
            console.warn(`[getRoadmapMatrix] No id in "${nodeDir.name}/${file.name}" — falling back to filename slug. Renaming this file will reset user progress.`);
          }

          const isExternal = rawHref.startsWith("http");
          const localizedHref = isExternal
            ? rawHref
            : `/${locale}${rawHref.startsWith('/') ? '' : '/'}${rawHref}`;

          return {
            id: id ?? slugify(file.name.replace(/\.txt$/, "")),
            label: file.name.replace(/\.txt$/, "").replace(/^[0-9]+/, ''),
            href: localizedHref,
          };
        });

      return { id: nodeId, title: nodeDir.name, items };
    });
  });
});
