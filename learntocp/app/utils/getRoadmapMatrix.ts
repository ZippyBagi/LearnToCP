import "server-only";
import { cache } from "react";
import fs from "fs";
import path from "path";
import type { RoadmapMatrix } from "@/app/roadmap/roadmap.types";

const ROADMAP_DATA_DIR = path.join(process.cwd(), "content", "roadmap_data");

/**
 * Load roadmap_data/L{n}/<Node>/<item>.txt into a RoadmapMatrix.
 *
 * `cache()` dedupes calls within a single render pass so the roadmap page and
 * any future consumer share one set of fs reads.
 */
export const getRoadmapMatrix = cache((): RoadmapMatrix => {
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

      const items = fs
        .readdirSync(nodePath, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith(".txt"))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((file) => ({
          label: file.name.replace(/\.txt$/, ""),
          href: fs.readFileSync(path.join(nodePath, file.name), "utf-8").trim(),
        }));

      return { title: nodeDir.name, items };
    });
  });
});
