import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LearnToCP - Competitive Programming Lectures",
    short_name: "LearnToCP",
    description:
      "Structured competitive-programming lectures, problem sets, and an interactive roadmap - from fundamentals to mastery.",
    start_url: "/en",
    scope: "/",
    display: "standalone",
    background_color: "#00131b",
    theme_color: "#00131b",
    lang: "en",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
