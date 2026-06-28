// This file exists solely because Next.js requires a root layout whenever
// app/not-found.tsx is present at the root level. Real app routes are served
// by app/[locale]/layout.tsx which owns the <html> and <body> tags.
// not-found.tsx renders its own <html>/<body> for the 404 case.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}