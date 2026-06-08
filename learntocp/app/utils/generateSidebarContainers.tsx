import "server-only";
import { cache } from "react";
import fs from "fs";
import path from "path";
import type { SidebarContainer } from "@/app/ui/utils/sidebar.types";
import { getLessonsRoot } from "@/app/utils/getLessonRoot";

export type { SidebarContainer };

export function stripOrderPrefix(name: string): string {
  return name.replace(/^\d+\s+/, "");
}

function getOrderValue(name: string): number {
  const match = name.match(/^(\d+)\s+/);
  return match ? parseInt(match[1], 10) : Infinity;
}

// Wrapped in cache() so multiple server components share one disk read per locale per render pass
export const generateSidebarContainers = cache((locale: string): SidebarContainer[] => {
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

    // Numeric order prefix lives on disk only — strip from display names and URLs
    const names = mdFiles.map((file) =>
      stripOrderPrefix(path.basename(file, ".md"))
    );

    const hrefs = names.map(
      (name) =>
        `/${locale}/Theory/${encodeURIComponent(displayFolderName)}/${encodeURIComponent(name)}`
    );

    return { name: displayFolderName, hrefs, names };
  });
});
