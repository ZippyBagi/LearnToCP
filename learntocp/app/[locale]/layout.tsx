import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "@/app/ui/globals.css";
import LayoutShell from "@/app/[locale]/roadmap/layoutShell";
import { generateSidebarContainers } from "@/app/utils/generateSidebarContainers";

// Space Grotesk — all UI text (nav, node labels, headings, body, buttons).
// JetBrains Mono — all code (code blocks, inline code, line numbers).
// Using `variable` + Tailwind v4 `@theme inline` keeps font-loading self-hosted,
// zero-layout-shift, and preloaded by next/font.
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

export const metadata: Metadata = {
  title: {
    default: "LearnToCP — Competitive Programming Lectures",
    template: "%s · LearnToCP",
  },
  description:
    "Structured competitive-programming lectures, problem sets, and an interactive roadmap — from fundamentals to mastery.",
  applicationName: "LearnToCP",
  keywords: [
    "competitive programming",
    "algorithms",
    "data structures",
    "C++",
    "LearnToCP",
  ],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#00131b",
  width: "device-width",
  initialScale: 1,
};

// 1. Update the type to include the async params
type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// 2. Make the component async
export default async function RootLayout({
  children,
  params,
}: LayoutProps) {
  // 3. Await the params to safely extract the locale string
  const { locale } = await params;

  // 4. Pass the locale string into your helper
  const containers = generateSidebarContainers(locale);
  
  return (
    // 5. Make sure the HTML lang attribute is dynamic so screen readers and SEO tools know the language
    <html lang={locale} className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-sans">
        <LayoutShell containers={containers}>{children}</LayoutShell>
      </body>
    </html>
  );
}