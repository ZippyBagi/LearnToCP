import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Double-invoke effects/renders in dev to surface side-effect bugs early.
  // No effect in production.
  reactStrictMode: true,

  // Don't advertise the framework in response headers.
  poweredByHeader: false,

  images: {
    // Allow Google profile pictures (shown in the navbar after OAuth login).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],

    // Next 16 requires local paths to be allow-listed before `/_next/image`
    // will optimize them; anything unlisted gets a 400. Two entries are
    // needed, and both are load-bearing:
    //   - lesson figures, served from public/lesson-images
    //   - the navbar logo, which app/ui/navbar.tsx renders with <Image>
    // `search: ""` rejects query strings on the source URL, so a crafted URL
    // cannot be used to make the optimizer fetch something unintended.
    localPatterns: [
      { pathname: "/lesson-images/**", search: "" },
      { pathname: "/no_bg_icon.svg", search: "" },
    ],

    // Also required from Next 16. buildFigure.ts emits q=75 and nothing else;
    // a request for any other quality is rejected rather than served.
    qualities: [75],

    // Modern formats first. Figures are flat-colour diagrams, which AVIF
    // compresses dramatically better than the source PNG.
    formats: ["image/avif", "image/webp"],
  },

  // Icon / headless-ui packages re-export hundreds of symbols from a single
  // barrel. `optimizePackageImports` rewrites `import { X } from "pkg"` so only
  // the subpath for `X` is bundled, shrinking client JS on every route that
  // touches the navbar, sidebar, or roadmap.
  experimental: {
    optimizePackageImports: [
      "react-icons",
      "@heroicons/react",
      "lucide-react",
      "@headlessui/react",
    ],
  },
};

export default nextConfig;
