import "server-only";
import { cache } from "react";
import fs from "fs";
import path from "path";
import type { RoadmapMatrix } from "@/app/[locale]/roadmap/roadmap.types";
import { getSmartRedirect } from '@/app/utils/smartRedirect'

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

      const items = fs
        .readdirSync(nodePath, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith(".txt"))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((file) => {
          const rawHref = fs.readFileSync(path.join(nodePath, file.name), "utf-8").trim();
          
          const isExternal = rawHref.startsWith("http");
          const localizedHref = isExternal 
            ? rawHref 
            : `/${locale}${rawHref.startsWith('/') ? '' : '/'}${rawHref}`;

          return {
            label: file.name.replace(/\.txt$/, "").replace(/^[0-9]+/, ''),
            href: localizedHref,
          };
        });

      return { title: nodeDir.name, items };
    });
  });
});
