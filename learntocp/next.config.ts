import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Double-invoke effects/renders in dev to surface side-effect bugs early.
  // No effect in production.
  reactStrictMode: true,

  // Don't advertise the framework in response headers.
  poweredByHeader: false,

  // Allow Google profile pictures (shown in the navbar after OAuth login).
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
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
