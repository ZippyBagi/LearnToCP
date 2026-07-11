import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";
import { locales } from "@/translations";
import { SITE_URL, localizedPath, DEFAULT_LOCALE } from "@/app/utils/seo";
import { getLessonsRoot } from "@/app/utils/getLessonRoot";
import { stripOrderPrefix } from "@/app/utils/generateSidebarContainers";

const abs = (p: string) => `${SITE_URL}${p}`;

/** hreflang map for a locale-agnostic path shared across every locale. */
function languagesFor(routePath: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = abs(localizedPath(l, routePath));
  languages["x-default"] = abs(localizedPath(DEFAULT_LOCALE, routePath));
  return languages;
}

/**
 * Public routes that exist identically under every locale.
 *
 * Deliberately excluded:
 * - "Problems", "Problems/[slug]", "roadmap": auth-gated in proxy.ts, so
 *   Googlebot is redirected to /login. Listing URLs a crawler can't reach
 *   generates Search Console errors and erodes sitemap trust. Re-add them
 *   here if they ever become public.
 * - "login": utility page with no search value; it is noindexed.
 *
 * `lastModified` is intentionally omitted: emitting `new Date()` on every
 * build tells Google "everything changed" on each deploy, which trains it
 * to ignore the field entirely.
 */
function staticEntries(): MetadataRoute.Sitemap {
  const routes: Array<{ path: string; priority: number }> = [
    { path: "", priority: 1.0 },
    { path: "about-us", priority: 0.5 },
  ];

  return routes.flatMap(({ path: routePath, priority }) =>
    locales.map((locale) => ({
      url: abs(localizedPath(locale, routePath)),
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

        // Real file mtime - an honest lastmod signal, unlike `new Date()`.
        let lastModified: Date | undefined;
        try {
          lastModified = fs.statSync(path.join(folderPath, file.name)).mtime;
        } catch {
          /* omit when unavailable */
        }

        entries.push({
          url: abs(localizedPath(locale, routePath)),
          ...(lastModified ? { lastModified } : {}),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  }

  return entries;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticEntries(), ...lessonEntries()];
}
