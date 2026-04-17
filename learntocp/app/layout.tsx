import type { Metadata, Viewport } from "next";
import "@/app/ui/globals.css";
import LayoutShell from "@/app/ui/utils/layoutShell";
import { generateSidebarContainers } from "@/app/utils/generateSidebarContainers";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const containers = generateSidebarContainers();
  return (
    <html lang="en">
      <body className="antialiased">
        <LayoutShell containers={containers}>{children}</LayoutShell>
      </body>
    </html>
  );
}
