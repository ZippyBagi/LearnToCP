import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { getHomeMessages } from "@/translations";
import { pageMetadata, siteDescription, SITE_URL, SITE_NAME, localizedPath } from "@/app/utils/seo";
import JsonLd from "@/app/ui/JsonLd";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { tagline } = getHomeMessages(locale);
  const fullTitle = `LearnToCP — ${tagline}`;

  const base = pageMetadata({
    locale,
    path: "",
    title: fullTitle,
    ogTitle: fullTitle,
    description: siteDescription(locale),
  });

  // Override the parent's "%s · LearnToCP" template on the home page so the
  // brand isn't duplicated in the <title>.
  return { ...base, title: { absolute: fullTitle } };
}

type PageProps = {
  params: Promise<{ locale: string }>;
};

/* ---------- syntax highlight helpers (Dracula-ish palette) ---------- */
const Kw = ({ children }: { children: ReactNode }) => (
  <span style={{ color: "#ff79c6" }}>{children}</span>
);
const Ty = ({ children }: { children: ReactNode }) => (
  <span style={{ color: "#8be9fd" }}>{children}</span>
);
const St = ({ children }: { children: ReactNode }) => (
  <span style={{ color: "#f1fa8c" }}>{children}</span>
);
const Fn = ({ children }: { children: ReactNode }) => (
  <span style={{ color: "#50fa7b" }}>{children}</span>
);
const Nm = ({ children }: { children: ReactNode }) => (
  <span style={{ color: "#bd93f9" }}>{children}</span>
);

const codeLines: ReactNode[] = [
  <>
    <Kw>#include</Kw> <St>&lt;bits/stdc++.h&gt;</St>
  </>,
  <>
    <Kw>using namespace</Kw> std;
  </>,
  <>&nbsp;</>,
  <>
    <Kw>int</Kw> <Fn>main</Fn>() {"{"}
  </>,
  <>
    {"    "}
    <Kw>int</Kw> n, k;
  </>,
  <>
    {"    "}cin <Kw>&gt;&gt;</Kw> n <Kw>&gt;&gt;</Kw> k;
  </>,
  <>&nbsp;</>,
  <>
    {"    "}
    <Ty>vector</Ty>&lt;<Kw>int</Kw>&gt; <Fn>a</Fn>(n);
  </>,
  <>
    {"    "}
    <Kw>for</Kw> (<Kw>int</Kw>&amp; x : a) cin <Kw>&gt;&gt;</Kw> x;
  </>,
  <>&nbsp;</>,
  <>
    {"    "}
    <Ty>unordered_set</Ty>&lt;<Kw>int</Kw>&gt; seen;
  </>,
  <>
    {"    "}
    <Kw>for</Kw> (<Kw>int</Kw> x : a) {"{"}
  </>,
  <>
    {"        "}
    <Kw>if</Kw> (seen.<Fn>count</Fn>(k - x)) {"{"}
  </>,
  <>
    {"            "}cout <Kw>&lt;&lt;</Kw> <St>&quot;Accepted\n&quot;</St>;
  </>,
  <>
    {"            "}
    <Kw>return</Kw> <Nm>0</Nm>;
  </>,
  <>
    {"        "}
    {"}"}
  </>,
  <>
    {"        "}seen.<Fn>insert</Fn>(x);
  </>,
  <>
    {"    "}
    {"}"}
  </>,
  <>
    {"    "}cout <Kw>&lt;&lt;</Kw> <St>&quot;Keep going\n&quot;</St>;
  </>,
  <>{"}"}</>,
];

/* ---------- icons ---------- */
function MapIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="5" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
      <circle cx="8" cy="19" r="2.5" />
      <path d="M7.5 7l8.5 3.5M16.5 14l-6.5 3.5" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 6 3 12 9 18" />
      <polyline points="15 6 21 12 15 18" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

/* ---------- page ---------- */
export default async function App({ params }: PageProps) {
  const { locale } = await params;
  const t = getHomeMessages(locale);

  const homeUrl = `${SITE_URL}${localizedPath(locale, "")}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/icon.svg`,
        description: siteDescription(locale),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: homeUrl,
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#organization` },
        description: siteDescription(locale),
      },
    ],
  };

  const cards = [
    {
      href: `/${locale}/roadmap`,
      icon: <MapIcon />,
      label: t.map.label,
      title: t.map.title,
      description: t.map.description,
    },
    {
      href: `/${locale}/Problems`,
      icon: <CodeIcon />,
      label: t.solve.label,
      title: t.solve.title,
      description: t.solve.description,
    },
  ];

  return (
    <main className="relative -m-3 flex min-h-[calc(100%+1.5rem)] overflow-hidden">
      <JsonLd data={jsonLd} />
      <style>{`
        @keyframes ltcp-pop {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
        .home-pop {
          animation: ltcp-pop 420ms cubic-bezier(0.16,1,0.3,1) both;
        }
      `}</style>
      {/* background — same as login page */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(12,36,56,0.55) 0%, transparent 60%), radial-gradient(ellipse 80% 55% at 50% 110%, rgba(12,36,56,0.55) 0%, transparent 60%), var(--color-bg-page)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(rgba(124,158,248,0.30) 1px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, #000 0%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, #000 0%, transparent 90%)",
        }}
      />

      <div className="relative z-10 m-auto grid w-full max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        {/* ---------- left column ---------- */}
        <div>
          <div className="home-pop mb-6 flex gap-3 text-lg">
            {t.badges.map((badge) => (
              <span
                key={badge}
                className="tag font-mono font-semibold"
                style={{ padding: "0.3em 0.8em" }}
              >
                {badge}
              </span>
            ))}
          </div>

          <h1
            className="home-pop select-none text-7xl font-extrabold leading-none tracking-tight sm:text-8xl xl:text-9xl"
            style={{ animationDelay: "60ms" }}
          >
            <span
              style={{
                background:
                  "linear-gradient(92deg, var(--color-accent) 0%, #a5b8fc 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              LearnToCP
            </span>
          </h1>

          <p className="home-pop mt-5 font-mono text-lg sm:text-xl" style={{ animationDelay: "120ms" }}>
            <span style={{ color: "var(--color-success)" }}>//</span>{" "}
            <span style={{ color: "var(--color-text-muted)" }}>{t.tagline}</span>
          </p>

          <div className="mt-12 flex flex-col gap-6">
            {cards.map((card, i) => (
              <Link
                key={card.href}
                href={card.href}
                className="home-pop group block rounded-2xl border-2 border-[rgba(124,158,248,0.18)] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-[rgba(124,158,248,0.65)] hover:shadow-[0_0_0_1px_rgba(124,158,248,0.1),0_0_18px_rgba(124,158,248,0.18)] active:brightness-90"
                style={{
                  background:
                    "linear-gradient(135deg, #0d2137 0%, #0a1c2e 100%)",
                  animationDelay: `${180 + i * 80}ms`,
                }}
              >
                <div className="mb-4 flex items-center gap-3.5">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      background: "rgba(124,158,248,0.1)",
                      color: "var(--color-accent)",
                      border: "1px solid var(--color-accent-border)",
                    }}
                  >
                    {card.icon}
                  </span>
                  <span
                    className="font-mono text-xs font-semibold uppercase tracking-[0.3em]"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {card.label}
                  </span>
                </div>
                <h2
                  className="mb-2 flex items-center gap-2 text-2xl font-bold"
                  style={{ color: "var(--color-text-heading)" }}
                >
                  {card.title}
                  <span style={{ color: "rgba(124,158,248,0.4)" }}>
                    <ArrowUpRight />
                  </span>
                </h2>
                <p
                  className="text-base"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {card.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* ---------- right column: code window ---------- */}
        <div className="home-pop relative hidden lg:block" style={{ animationDelay: "240ms" }}>
          {/* Accepted badge */}
          <span
            className="absolute -top-5 right-6 z-10 inline-flex items-center gap-2.5 rounded-full px-6 py-2.5 font-mono text-base font-bold"
            style={{
              background: "linear-gradient(135deg, #0a2c1c 0%, #06231b 100%)",
              color: "var(--color-success)",
              border: "1.5px solid rgba(80,250,123,0.55)",
              boxShadow:
                "0 0 14px rgba(80,250,123,0.22), 0 4px 20px rgba(0,0,0,0.45)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t.accepted}
          </span>

          <div
            className="overflow-hidden rounded-xl"
            style={{
              background: "var(--color-bg-code)",
              border: "1px solid var(--color-border-subtle)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            }}
          >
            {/* header */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                background: "var(--color-bg-code-header)",
                borderBottom: "1px solid var(--color-border-subtle)",
              }}
            >
              <span
                className="font-mono text-base font-semibold"
                style={{ color: "var(--color-text-heading)" }}
              >
                Solution.cpp
              </span>
              <span
                aria-hidden
                className="select-none rounded-md px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest"
                style={{
                  color: "var(--color-accent-dim)",
                  border: "1px solid var(--color-accent-border)",
                  background: "rgba(124,158,248,0.06)",
                }}
              >
                {t.copy}
              </span>
            </div>

            {/* code */}
            <pre className="overflow-x-auto px-6 py-6 font-mono text-[15px] leading-[1.9]">
              <code style={{ color: "var(--color-text-heading)" }}>
                {codeLines.map((line, i) => (
                  <div key={i} className="flex">
                    <span
                      className="w-10 shrink-0 select-none pr-5 text-right"
                      style={{ color: "rgba(124,158,248,0.35)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
