import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "@/app/ui/globals.css";
import "katex/dist/katex.min.css";
import LayoutShell from "@/app/[locale]/layoutShell";
import { generateSidebarContainers } from "@/app/utils/generateSidebarContainers";
import {
  SITE_NAME,
  SITE_URL,
  buildAlternates,
  ogLocale,
  siteDescription,
} from "@/app/utils/seo";
import { Analytics } from "@vercel/analytics/next"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description = siteDescription(locale);

  return {
    // Centralizes the origin so canonical/OG/sitemap URLs resolve to absolute
    // URLs. Change once (or via NEXT_PUBLIC_SITE_URL) and it propagates.
    metadataBase: new URL(SITE_URL),
    title: {
      default: "LearnToCP - Competitive Programming Lectures",
      template: "%s · LearnToCP",
    },
    description,
    applicationName: SITE_NAME,
    keywords: [
      "competitive programming",
      "algorithms",
      "data structures",
      "C++",
      "coding problems",
      "programming roadmap",
      "LearnToCP",
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "education",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    // Icons (app/icon.svg, app/apple-icon, app/favicon.ico) and the web
    // manifest (app/manifest.ts) are wired up automatically by Next's
    // file-based conventions - no explicit config needed here.
    // Home/base hreflang set; individual pages override with their own path.
    alternates: buildAlternates(locale, ""),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      url: `/${locale}`,
      title: "LearnToCP - Competitive Programming Lectures",
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: "LearnToCP - Competitive Programming Lectures",
      description,
    },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#00131b",
  width: "device-width",
  initialScale: 1,
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params;
  const containers = generateSidebarContainers(locale);

  return (
    <html lang={locale} className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-sans">
        <LayoutShell containers={containers}>{children}</LayoutShell>
        <Analytics />
      </body>
    </html>
  );
}
