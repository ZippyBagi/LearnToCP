import { ImageResponse } from "next/og";
import { getHomeMessages } from "@/translations";
import { SITE_URL } from "@/app/utils/seo";

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

  // Satori needs an absolute URL to fetch the image from your public folder.
  // SITE_URL already resolves NEXT_PUBLIC_SITE_URL with the canonical domain
  // as fallback, keeping this consistent with the rest of the SEO config.
  const siteUrl = SITE_URL;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#00131b",
          color: "#e8f1f8",
          fontFamily: "sans-serif",
        }}
      >
        {/* Safe Linear Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage: "linear-gradient(to bottom right, rgba(12,36,56,0.8) 0%, #00131b 100%)",
            display: "flex",
          }}
        />

        {/* Foreground Content */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px",
          }}
        >
          
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* Swapped the SVG for a standard image tag pointing to your public folder */}
            <img
              src={`${siteUrl}/logo.png`}
              width="200"
              height="200"
              style={{ display: "flex" }}
              alt="LearnToCP Logo"
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

          {/* Middle Section */}
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

          {/* Bottom Section */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
            }}
          >
            {["100% FREE", "algorithms", "data structures", "C++"].map((t) => (
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