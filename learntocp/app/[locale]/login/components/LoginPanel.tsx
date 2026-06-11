"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/app/supabase/client";
import { getLoginMessages } from "@/translations";

function GoogleG({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34A21.98 21.98 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

function Wordmark() {
  return (
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
  );
}

function sanitizeNext(raw: string | null): string | null {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return null;
}

export default function LoginPanel({ locale }: { locale: string }) {
  const t = getLoginMessages(locale);
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? t.errorGeneric : null,
  );

  const next = sanitizeNext(searchParams.get("next"));

  const noticePage = (() => {
    if (!next) return null;
    const section = next.split("?")[0].split("/").filter(Boolean)[1]?.toLowerCase();
    if (section === "roadmap") return t.pageRoadmap;
    if (section === "problems") return t.pageProblems;
    return t.pageGeneric;
  })();

  const lit = hover && !loading;

  async function signInWithGoogle() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const redirectTarget = next ?? `/${locale}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(redirectTarget)}`,
      },
    });

    // On success the browser navigates away; only errors land here.
    if (error) {
      setError(t.errorStart);
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "relative",
        width: "min(440px, 100%)",
        transform: "scale(1.1)",
        animation: "ltcp-pop 420ms cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      <style>{`
        @keyframes ltcp-pop {
          from { opacity: 0; transform: translateY(10px) scale(1.05); }
          to   { opacity: 1; transform: scale(1.1); }
        }
        @keyframes ltcp-spin { to { transform: rotate(360deg); } }
      `}</style>

      {noticePage && (
        <div
          role="status"
          style={{
            position: "absolute",
            bottom: "calc(100% + 14px)",
            left: 0,
            right: 0,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            padding: "12px 16px",
            borderRadius: 12,
            fontSize: 14,
            lineHeight: 1.55,
            color: "var(--color-text-muted)",
            background:
              "#0a1c2e",
            border: "1px solid rgba(124,158,248,0.30)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{
              flexShrink: 0,
              marginTop: 2,
              color: "var(--color-accent)",
            }}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <span>{t.signInRequired.replace("{page}", noticePage)}</span>
        </div>
      )}

      <div
        style={{
          padding: "36px 36px 30px",
          borderRadius: "16px",
          background:
            "linear-gradient(135deg, var(--color-bg-surface) 0%, #0a1c2e 100%)",
          border: "1px solid var(--color-accent-border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="select-none"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(200,218,240,0.30)",
            marginBottom: 18,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--color-accent)",
              boxShadow: "0 0 10px var(--color-accent)",
            }}
          />
          {t.eyebrow}
        </div>

        <h1
          style={{
            margin: "0 0 12px",
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: "var(--color-text-heading)",
          }}
        >
          {t.welcomePrefix} <Wordmark />
        </h1>

        <p
          style={{
            margin: "0 0 28px",
            fontSize: 15.5,
            lineHeight: 1.65,
            color: "var(--color-text-muted)",
            maxWidth: "34ch",
            textWrap: "pretty",
          }}
        >
          {t.description}
        </p>

        <button
          type="button"
          onClick={loading ? undefined : signInWithGoogle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          disabled={loading}
          style={{
            width: "100%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "15px 20px",
            fontFamily: "var(--font-sans)",
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: 1,
            color: "var(--color-text-heading)",
            background:
              "linear-gradient(135deg, rgba(124,158,248,0.12), rgba(124,158,248,0.06))",
            border: `1px solid ${
              lit ? "rgba(124,158,248,0.65)" : "var(--color-border-blue)"
            }`,
            borderRadius: "10px",
            cursor: loading ? "default" : "pointer",
            boxShadow: lit
              ? "0 0 0 1px rgba(124,158,248,0.1), 0 0 18px rgba(124,158,248,0.18)"
              : "0 0 0 1px transparent, 0 2px 12px rgba(0,0,0,0.4)",
            transition: "box-shadow 200ms ease, border-color 200ms ease",
          }}
        >
          {loading ? (
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "2px solid rgba(124,158,248,0.3)",
                borderTopColor: "var(--color-accent)",
                animation: "ltcp-spin 0.7s linear infinite",
              }}
            />
          ) : (
            <GoogleG />
          )}
          <span>{loading ? t.connecting : t.continueWithGoogle}</span>
        </button>

        {error && (
          <p className="mt-4 text-sm" style={{ color: "var(--color-danger)" }}>
            {error}
          </p>
        )}

        <div
          style={{
            height: 1,
            margin: "26px 0 16px",
            background: "rgba(124,158,248,0.10)",
          }}
        />

        <p
          style={{
            margin: 0,
            display: "flex",
            gap: 9,
            fontSize: 13,
            lineHeight: 1.55,
            color: "rgba(200,218,240,0.30)",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: 1, color: "var(--color-accent-dim)" }}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>{t.privacy}</span>
        </p>
      </div>
    </div>
  );
}
