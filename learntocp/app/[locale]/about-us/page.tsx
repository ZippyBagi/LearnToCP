import type { Metadata } from "next";
import { getAboutMessages } from "@/translations";
import CopyEmailPill from "./_components/CopyEmailPill";
import { pageMetadata } from "@/app/utils/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const description =
    locale === "sr"
      ? "LearnToCP je besplatana platforma za učenje takmičarskog programiranja, koja stavlja fokus na razvijanje intuicije i logičkog razmišljanja više nego na čistu matematiku. Sajt je napravljen sa ciljem da srednjoškolcima pomogne da od potpunih početnika postanu kandidati za uspeh na informatičkim olimpijadama, pružajući na jednom mestu i teoriju i probleme."
      : "LearnToCP is a free way to learn Competitive Programming, that focuses more on intuition and logic than pure math. It is made with the goal of teaching high school students how to go from beginners, to Olympiad contenders by providing both the theory and the problems in one platform! ";
  return pageMetadata({
    locale,
    path: "about-us",
    title: locale === "sr" ? "O nama" : "About",
    description,
  });
}

function Eyebrow({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`text-xs font-semibold uppercase tracking-[0.18em] text-text-muted ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

const linkPillClass =
  "flex items-center gap-2.5 rounded-lg border border-accent-border bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition-colors duration-150 hover:border-accent-border-hover hover:bg-accent/[0.18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const t = getAboutMessages(locale);

  return (
    // Plain flowing content, like the Theory/Problems pages — the layout
    // shell's scroll pane handles all scrolling.
    <main className="mx-auto max-w-6xl px-10 pb-[88px] pt-[72px]">
      <Eyebrow className="pop-in">{t.eyebrow}</Eyebrow>
      <h1
        className="pop-in mt-2.5 text-[40px] font-extrabold tracking-[-0.02em] text-text-heading"
        style={{ animationDelay: "60ms" }}
      >
        {t.title}
      </h1>
      <p className="pop-in mt-[18px] text-lg leading-[1.8]" style={{ animationDelay: "120ms" }}>
        {t.lede}
      </p>

      <Eyebrow className="pop-in mt-12" style={{ animationDelay: "180ms" }}>
        {t.goalLabel}
      </Eyebrow>
      <section
        className="pop-in mt-5 flex flex-col gap-[22px]"
        style={{ animationDelay: "240ms" }}
      >
        {t.goals.map((goal) => (
          <div key={goal.title} className="flex items-start gap-3.5">
            <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-success/45 bg-success/10 font-mono text-xs text-success">
              ✓
            </span>
            <div>
              <h2 className="text-base font-bold text-text-heading">
                {goal.title}
              </h2>
              <p className="mt-[3px] text-[14.5px] leading-[1.6] text-text-muted">
                {goal.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      <hr
        className="pop-in my-11 border-0 border-t border-border-subtle"
        style={{ animationDelay: "300ms" }}
      />

      <Eyebrow className="pop-in" style={{ animationDelay: "300ms" }}>
        {t.developerLabel}
      </Eyebrow>
      <div className="pop-in mt-5 flex items-center gap-4" style={{ animationDelay: "360ms" }}>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-accent-border-hover bg-accent/10 text-[19px] font-bold text-accent">
          DK
        </span>
        <div>
          <div className="text-lg font-bold text-text-heading">
            {t.developerName}
          </div>
          <div className="mt-0.5 font-mono text-[13px] text-text-muted">
            {t.developerHandle}
          </div>
        </div>
      </div>
      <p className="pop-in mt-4 text-[15.5px] leading-[1.75]" style={{ animationDelay: "420ms" }}>
        {t.developerNote}
      </p>

      <nav
        className="pop-in mt-6 flex flex-wrap gap-3"
        style={{ animationDelay: "480ms" }}
        aria-label="Developer links"
      >
        <a
          href="https://github.com/ZippyBagi"
          target="_blank"
          rel="noopener noreferrer"
          className={linkPillClass}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          GitHub
        </a>
        <a
          href="https://codeforces.com/profile/dusankovacevic.329"
          target="_blank"
          rel="noopener noreferrer"
          className={linkPillClass}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 20V10" />
            <path d="M12 20V4" />
            <path d="M6 20v-6" />
          </svg>
          Codeforces 
        </a>
        <CopyEmailPill
          email="dusankovacevic.329@gmail.com"
          copiedLabel={t.emailCopied}
          ariaLabel={t.emailCopyAria}
        />
      </nav>
    </main>
  );
}
