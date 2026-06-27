import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";
import { locales } from "@/translations";
import { SITE_URL, localizedPath, DEFAULT_LOCALE } from "@/app/utils/seo";
import { getLessonsRoot } from "@/app/utils/getLessonRoot";
import { stripOrderPrefix } from "@/app/utils/generateSidebarContainers";
import { listProblems } from "@/app/judge0/problems";

const abs = (p: string) => `${SITE_URL}${p}`;

/** hreflang map for a locale-agnostic path shared across every locale. */
function languagesFor(routePath: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = abs(localizedPath(l, routePath));
  languages["x-default"] = abs(localizedPath(DEFAULT_LOCALE, routePath));
  return languages;
}

/** Routes that exist identically under every locale. */
function staticEntries(): MetadataRoute.Sitemap {
  const routes: Array<{ path: string; priority: number }> = [
    { path: "", priority: 1.0 },
    { path: "Problems", priority: 0.9 },
    { path: "roadmap", priority: 0.8 },
    { path: "about-us", priority: 0.5 },
    { path: "login", priority: 0.3 },
  ];

  return routes.flatMap(({ path: routePath, priority }) =>
    locales.map((locale) => ({
      url: abs(localizedPath(locale, routePath)),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority,
      alternates: { languages: languagesFor(routePath) },
    })),
  );
}

/** Every published lesson, enumerated from each locale's content folder. */
function lessonEntries(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const root = getLessonsRoot(locale);
    if (!fs.existsSync(root)) continue;

    const folders = fs
      .readdirSync(root, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith("."));

    for (const folderEntry of folders) {
      const folderPath = path.join(root, folderEntry.name);
      const displayFolder = stripOrderPrefix(folderEntry.name);

      const files = fs
        .readdirSync(folderPath, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith(".md"));

      for (const file of files) {
        const displayLesson = stripOrderPrefix(path.basename(file.name, ".md"));
        const routePath = `Theory/${encodeURIComponent(displayFolder)}/${encodeURIComponent(displayLesson)}`;

        let lastModified = new Date();
        try {
          lastModified = fs.statSync(path.join(folderPath, file.name)).mtime;
        } catch {
          /* fall back to now */
        }

        entries.push({
          url: abs(localizedPath(locale, routePath)),
          lastModified,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  }

  return entries;
}

/** Problem statements - slugs are shared across locales, so we add hreflang. */
function problemEntries(): MetadataRoute.Sitemap {
  return listProblems().flatMap((problem) => {
    const routePath = `Problems/${encodeURIComponent(problem.slug)}`;
    return locales.map((locale) => ({
      url: abs(localizedPath(locale, routePath)),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: languagesFor(routePath) },
    }));
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticEntries(), ...lessonEntries(), ...problemEntries()];
}
