import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import "@/app/ui/globals.css";
import Link from "next/link";
import { getNotFoundMessages } from "@/translations";

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

export default async function NotFound() {
  const locale = (await headers()).get("x-locale") ?? "en";
  const t = getNotFoundMessages(locale);

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased font-sans bg-[#00131b] text-[#ededed]">
        <style>{`
          @keyframes ltcp-pop {
            from { opacity: 0; transform: translateY(10px) scale(0.97); }
            to   { opacity: 1; transform: none; }
          }
          .home-pop {
            animation: ltcp-pop 420ms cubic-bezier(0.16,1,0.3,1) both;
          }
        `}</style>

        <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
          {/* Radial vignette */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(12,36,56,0.55) 0%, transparent 60%), radial-gradient(ellipse 80% 55% at 50% 110%, rgba(12,36,56,0.55) 0%, transparent 60%)",
            }}
          />

          {/* Dot grid */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(rgba(124,158,248,0.35) 1px, transparent 1.5px)",
              backgroundSize: "24px 24px",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 60% at 50% 50%, #000 0%, transparent 90%)",
              maskImage:
                "radial-gradient(ellipse 60% 60% at 50% 50%, #000 0%, transparent 90%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <p
              className="home-pop font-mono text-xs tracking-widest mb-6 text-[rgba(200,218,240,0.5)]"
              style={{ animationDelay: "0ms" }}
            >
              {t.errorCode}
            </p>

            <h1
              className="home-pop font-mono font-bold leading-none mb-6 select-none"
              style={{
                fontSize: "clamp(7rem, 20vw, 14rem)",
                color: "transparent",
                WebkitTextStroke: "2px rgba(124,158,248,0.2)",
                letterSpacing: "-0.04em",
                animationDelay: "60ms",
              }}
            >
              404
            </h1>

            <h2
              className="home-pop font-mono font-semibold text-[#e2eaff] text-2xl mb-3"
              style={{ animationDelay: "120ms" }}
            >
              {t.heading}
            </h2>

            <p
              className="home-pop font-mono text-sm text-[rgba(200,218,240,0.5)] mb-10 leading-relaxed"
              style={{ animationDelay: "180ms" }}
            >
              {t.body1}
              <br />
              {t.body2}
            </p>

            <Link
              href="/"
              className="home-pop inline-flex items-center gap-2 rounded-2xl border-2 border-[rgba(124,158,248,0.18)] px-6 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-[rgba(124,158,248,0.65)] hover:shadow-[0_0_0_1px_rgba(124,158,248,0.1),0_0_18px_rgba(124,158,248,0.18)] active:brightness-90"
              style={{
                background: "linear-gradient(135deg, #0d2137 0%, #0a1c2e 100%)",
                animationDelay: "240ms",
              }}
            >
              <span className="font-mono text-sm font-semibold text-[#e2eaff]">
                {t.returnHome}
              </span>
              <span style={{ color: "rgba(124,158,248,0.4)" }}>↗</span>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}