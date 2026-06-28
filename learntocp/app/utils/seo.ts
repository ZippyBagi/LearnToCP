import type { Metadata } from "next";
import { locales, type Locale } from "@/translations";

/**
 * Canonical origin for the site. Override per-environment with
 * NEXT_PUBLIC_SITE_URL (e.g. a preview deploy) without touching code.
 * Trailing slash is stripped so we can safely concatenate paths.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://learntocp.com"
).replace(/\/+$/, "");

export const SITE_NAME = "LearnToCP";

export const DEFAULT_LOCALE: Locale = locales[0];

/** Open Graph wants BCP-47-ish "language_TERRITORY" codes, not bare "en". */
const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  sr: "sr_RS",
};

/** Localized site-level descriptions, used as the metadata fallback. */
export const SITE_DESCRIPTION: Record<string, string> = {
  en: "Structured competitive-programming lectures, problem sets, and an interactive roadmap - from fundamentals to mastery. 100% free.",
  sr: "Lekcije iz takmičarskog programiranja, zadaci i interaktivna road-mapa - od osnova do olimpijade. 100% besplatno.",
};

export function ogLocale(locale: string): string {
  return OG_LOCALE[locale] ?? OG_LOCALE[DEFAULT_LOCALE];
}

export function siteDescription(locale: string): string {
  return SITE_DESCRIPTION[locale] ?? SITE_DESCRIPTION[DEFAULT_LOCALE];
}

/**
 * Build a locale-prefixed, root-relative path.
 * localizedPath("en")            -> "/en"
 * localizedPath("en", "Problems") -> "/en/Problems"
 */
export function localizedPath(locale: string, path = ""): string {
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

/**
 * Canonical + hreflang alternates for a given page.
 * Every locale gets a self-referencing entry plus an x-default pointing at the
 * default-locale version - the configuration Google expects for i18n sites.
 */
export function buildAlternates(
  locale: string,
  path = "",
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = localizedPath(l, path);
  }
  languages["x-default"] = localizedPath(DEFAULT_LOCALE, path);

  return {
    canonical: localizedPath(locale, path),
    languages,
  };
}

type PageMetaOptions = {
  locale: string;
  /** Locale-agnostic path, e.g. "Problems" or "Theory/Sorting/Quicksort". */
  path?: string;
  title: string;
  description: string;
  /** Optional override for the social-share title (defaults to `title`). */
  ogTitle?: string;
};

/**
 * One-stop builder for a page's canonical, hreflang, Open Graph and Twitter
 * metadata. The actual share image is supplied by the file-based
 * `opengraph-image` convention, so it is intentionally omitted here.
 */
export function pageMetadata(opts: PageMetaOptions): Metadata {
  const { locale, path = "", title, description, ogTitle } = opts;
  const url = localizedPath(locale, path);
  const shareTitle = ogTitle ?? title;

  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title: shareTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: ogLocale(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
    },
  };
}
