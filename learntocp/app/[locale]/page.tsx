import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Master algorithms and data structures with structured lessons and an interactive roadmap.",
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function App({ params }: PageProps) {
  const { locale } = await params;
  const isSr = locale === "sr";

  const t = {
    badge: isSr ? "Takmičarsko Programiranje" : "Competitive Programming",
    headlineLead: isSr ? "Savladaj" : "Master",
    headlineAccent: isSr ? "Algoritme" : "Algorithms",
    headlineTail: isSr ? " i Strukture Podataka" : " & Data Structures",
    subheadline: isSr
      ? "Strukturisane lekcije i interaktivna mapa puta koje te vode od osnova do majstorstva u takmičarskom programiranju."
      : "Structured lessons and an interactive roadmap to guide you from the basics to competitive programming mastery.",
    cta: isSr ? "Pogledaj Mapu Puta →" : "View Roadmap →",
    pills: isSr
      ? ["Strukturisana Predavanja", "Interaktivna Mapa Puta", "Praćenje Napretka", "Primeri Koda"]
      : ["Structured Lectures", "Interactive Roadmap", "Progress Tracking", "Code Examples"],
  };

  return (
    <main
      className="flex flex-col items-center justify-center min-h-full px-6 py-16 text-center"
      style={{ background: "var(--color-bg-page)" }}
    >
      <span
        className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
        style={{
          background: "rgba(124,158,248,0.08)",
          color: "var(--color-accent)",
          border: "1px solid rgba(124,158,248,0.2)",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ background: "var(--color-accent)" }}
        />
        {t.badge}
      </span>

      <h1
        className="mb-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl"
        style={{ color: "var(--color-text-heading)" }}
      >
        {t.headlineLead}{" "}
        <span
          style={{
            background: "linear-gradient(90deg, #5a88f5 0%, #7c9ef8 50%, #a5b8fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {t.headlineAccent}
        </span>
        {t.headlineTail}
      </h1>

      <p
        className="mb-10 max-w-lg text-base leading-relaxed sm:text-lg"
        style={{ color: "rgba(200,218,240,0.6)" }}
      >
        {t.subheadline}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`/${locale}/roadmap`}
          className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-px hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, #4a7ff7 0%, #7c9ef8 100%)",
            boxShadow: "0 4px 16px rgba(124,158,248,0.25)",
          }}
        >
          {t.cta}
        </Link>
      </div>

      <div
        className="mt-20 w-full max-w-2xl h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,158,248,0.15), transparent)" }}
      />

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {t.pills.map((label) => (
          <span
            key={label}
            className="rounded-lg px-3 py-1.5 text-xs font-medium"
            style={{
              background: "rgba(13,33,55,0.8)",
              color: "rgba(200,218,240,0.55)",
              border: "1px solid rgba(124,158,248,0.12)",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </main>
  );
}
