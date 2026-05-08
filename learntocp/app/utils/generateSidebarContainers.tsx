import "server-only";
import { cache } from "react";
import fs from "fs";
import path from "path";
import type { SidebarContainer } from "@/app/ui/utils/sidebar.types";
import { getLessonsRoot } from "@/app/utils/getLessonRoot"; // <-- Import your helper

export type { SidebarContainer };

/**
 * Strip a leading numeric order prefix from a file/folder name.
 * e.g. "01 Vectors" → "Vectors",  "3 Two Pointers" → "Two Pointers"
 * Names without a prefix are returned unchanged.
 */
export function stripOrderPrefix(name: string): string {
  return name.replace(/^\d+\s+/, "");
}

/**
 * Extract the numeric order value for sorting.
 * Items without a prefix sort last (Infinity).
 */
function getOrderValue(name: string): number {
  const match = name.match(/^(\d+)\s+/);
  return match ? parseInt(match[1], 10) : Infinity;
}

/**
 * Walk `content/[locale]/LessonsMD/` and produce the collapsible sidebar groups.
 *
 * Folders and files may carry a leading "N " prefix (e.g. "01 Basics",
 * "3 Vectors.md") to control display order. The prefix is stripped from all
 * display names and URLs — it exists purely as an ordering hint on disk.
 *
 * Wrapped in React `cache()` so if multiple server components call this during
 * one render pass (root layout + any future consumer) we only hit disk once
 * PER LOCALE. In a static build this runs at build time; in dev, once per request.
 */
// 1. Accept 'locale' as an argument
export const generateSidebarContainers = cache((locale: string): SidebarContainer[] => {
  // 2. Use the localized root path
  const lessonsRoot = getLessonsRoot(locale);

  if (!fs.existsSync(lessonsRoot)) {
    console.warn(
      `[generateSidebarContainers] Directory not found: ${lessonsRoot}`
    );
    return [];
  }

  const folders = fs
    .readdirSync(lessonsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort((a, b) => getOrderValue(a) - getOrderValue(b));

  return folders.map((folderName): SidebarContainer => {
    const folderPath = path.join(lessonsRoot, folderName);
    const displayFolderName = stripOrderPrefix(folderName);

    const mdFiles = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => entry.name)
      .sort((a, b) => getOrderValue(a) - getOrderValue(b));

    // Strip the prefix from display names and hrefs — the number lives on disk only.
    const names = mdFiles.map((file) =>
      stripOrderPrefix(path.basename(file, ".md"))
    );
    
    // 3. Inject the locale into the generated URL paths
    const hrefs = names.map(
      (name) =>
        `/${locale}/Theory/${encodeURIComponent(displayFolderName)}/${encodeURIComponent(name)}`
    );

    return { name: displayFolderName, hrefs, names };
  });
});