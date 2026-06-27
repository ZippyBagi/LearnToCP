import { ImageResponse } from "next/og";
import { getHomeMessages } from "@/translations";
import { readFile } from "fs/promises";
import { join } from "path";
// Applies to every route under /[locale]; individual pages inherit this share
// card unless they define their own opengraph-image.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "LearnToCP - Competitive Programming Lectures";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { tagline } = getHomeMessages(locale);

  const image = await readFile(
    join(process.cwd(), "app/icon.svg"),
    "base64"
  );

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          backgroundColor: "#00131b",
          color: "#e8f1f8",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "#00131b",
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(12,36,56,0.55) 0%, transparent 70%), radial-gradient(circle at 50% 100%, rgba(12,36,56,0.55) 0%, transparent 70%)",
          }}
        />

        {/* Dot pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            opacity: 0.5,
            backgroundImage:
              "radial-gradient(rgba(124,158,248,0.30) 1px, transparent 1.5px)",
            backgroundSize: "24px 24px",
            maskImage:
              "radial-gradient(circle at center, black 0%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 0%, transparent 90%)",
          }}
        />

        {/* Foreground */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px",
          }}
        >
          {/* Top */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <img
              src={`data:image/svg+xml;base64,${image}`}
              width={200}
              height={200}
            />

            <div
              style={{
                display: "flex",
                fontSize: 124,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.05em",
              }}
            >
              <span style={{ color: "#7c9ef8" }}>Learn</span>
              <span style={{ color: "#a5b8fc" }}>ToCP</span>
            </div>
          </div>

          {/* Middle */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                fontSize: "60px",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-2px",
                maxWidth: "900px",
              }}
            >
              {tagline}
            </div>

            <div
              style={{
                fontSize: "34px",
                color: "#9fb4c7",
                maxWidth: "920px",
              }}
            >
              Lectures · Problem sets · Interactive roadmap
            </div>
          </div>

          {/* Bottom */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
            }}
          >
            {["#100% FREE", "algorithms", "data structures", "C++"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  color: "#7c9ef8",
                  backgroundColor: "#0c2438",
                  border: "1px solid #1f3a52",
                  borderRadius: "999px",
                  padding: "10px 24px",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}