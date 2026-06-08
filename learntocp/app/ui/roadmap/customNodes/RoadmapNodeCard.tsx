"use client";

interface RoadmapNodeCardProps {
  title: string;
  /** Completion fraction 0–1 */
  progress: number;
  isComplete: boolean;
  onClick: () => void;
}

export function RoadmapNodeCard({
  title,
  progress,
  isComplete,
  onClick,
}: RoadmapNodeCardProps) {
  const hasProgress = !isComplete && progress > 0;
  const pct = isComplete ? 100 : Math.round(progress * 100);
  const showPct = isComplete || hasProgress;

  const borderColor = isComplete
    ? "rgba(80,250,123,0.45)"
    : hasProgress
    ? "rgba(124,158,248,0.5)"
    : "rgba(124,158,248,0.18)";

  const glowColor = isComplete
    ? "rgba(80,250,123,0.08)"
    : hasProgress
    ? "rgba(124,158,248,0.06)"
    : "transparent";

  return (
    <div className="group relative w-full">
      <button
        onClick={onClick}
        aria-label={`Open ${title}`}
        className={[
          "relative flex w-full cursor-pointer flex-col",
          "overflow-hidden rounded-xl text-left",
          "transition-all duration-200 ease-out",
          "active:brightness-90",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[var(--color-bg-page)]",
        ].join(" ")}
        style={{
          background: isComplete
            ? "linear-gradient(135deg, #0d2137 0%, #0b2a1a 100%)"
            : "linear-gradient(135deg, #0d2137 0%, #0a1c2e 100%)",
          border: `2px solid ${borderColor}`,
          boxShadow: `0 0 0 1px ${glowColor}, 0 2px 12px rgba(0,0,0,0.4)`,
          transition: "box-shadow 200ms ease, border-color 200ms ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.borderColor = isComplete
            ? "rgba(80,250,123,0.75)"
            : "rgba(124,158,248,0.65)";
          el.style.boxShadow = isComplete
            ? `0 0 0 1px rgba(80,250,123,0.12), 0 0 18px rgba(80,250,123,0.18)`
            : `0 0 0 1px rgba(124,158,248,0.1), 0 0 18px rgba(124,158,248,0.18)`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.borderColor = borderColor;
          el.style.boxShadow = `0 0 0 1px ${glowColor}, 0 2px 12px rgba(0,0,0,0.4)`;
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        <div className="flex items-center gap-2.5 px-4 pt-5 pb-4">
          {isComplete && (
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
              style={{
                background: "rgba(80,250,123,0.15)",
                color: "var(--color-success)",
                border: "1px solid rgba(80,250,123,0.3)",
              }}
            >
              ✓
            </span>
          )}
          <span
            className="flex-1 text-sm font-semibold tracking-tight leading-snug"
            style={{
              color: isComplete
                ? "var(--color-success)"
                : "var(--color-text-heading)",
            }}
          >
            {title}
          </span>
          {showPct && (
            <span
              className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold tabular-nums"
              style={{
                background: isComplete
                  ? "rgba(80,250,123,0.1)"
                  : "rgba(124,158,248,0.1)",
                color: isComplete
                  ? "var(--color-success)"
                  : "var(--color-accent)",
              }}
            >
              {pct}%
            </span>
          )}
        </div>

        <div className="h-[3px] w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
          {showPct && (
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${pct}%`,
                background: isComplete
                  ? "linear-gradient(90deg, #22c55e, #50fa7b)"
                  : "linear-gradient(90deg, #4a7ff7, #7c9ef8)",
              }}
            />
          )}
        </div>
      </button>
    </div>
  );
}
