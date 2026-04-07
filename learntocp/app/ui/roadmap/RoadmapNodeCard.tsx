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

  return (
    <div className="group relative inline-block w-full min-w-[200px] max-w-[300px]">
      <button
        onClick={onClick}
        aria-label={`Open ${title}`}
        className={[
          "relative flex w-full cursor-pointer flex-col",
          "overflow-hidden rounded-lg border text-left",
          "transition-all duration-200 ease-out",
          "group-hover:-translate-y-0.5 active:translate-y-0",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[var(--color-bg-page)]",
          isComplete
            ? [
                "border-[var(--color-success)]",
                "bg-[var(--color-success-tint)]",
                "group-hover:border-[var(--color-success)]",
              ].join(" ")
            : hasProgress
            ? [
                "border-[var(--color-accent-border-hover)]",
                "bg-[var(--color-bg-surface)]",
              ].join(" ")
            : [
                "border-[var(--color-accent-border)]",
                "bg-[var(--color-bg-surface)]",
                "group-hover:border-[var(--color-accent-border-hover)]",
              ].join(" "),
        ].join(" ")}
      >
        {/* Top sheen */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />

        {/* Main content */}
        <div className="flex items-center gap-2.5 px-5 pt-4 pb-3">
          <span
            className={[
              "flex-1 text-base font-medium tracking-tight",
              isComplete
                ? "text-[var(--color-success)]"
                : "text-[var(--color-text-heading)]",
            ].join(" ")}
          >
            {title}
          </span>
          {showPct && (
            <span
              className={[
                "rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold tabular-nums",
                isComplete
                  ? "bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] text-[var(--color-success)]"
                  : "bg-[color-mix(in_srgb,var(--color-accent)_15%,transparent)] text-[var(--color-accent)]",
              ].join(" ")}
            >
              {pct}%
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative h-[4px] w-full bg-white/[0.06]">
          {showPct && (
            <div
              className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
              style={{
                width: `${pct}%`,
                backgroundColor: isComplete
                  ? "var(--color-success)"
                  : "var(--color-accent)",
              }}
            />
          )}
        </div>
      </button>

      {/* Completion badge — moves with the button on hover */}
      {isComplete && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-2 z-10 flex h-5 w-5
                     items-center justify-center rounded-full
                     bg-[var(--color-success)] text-[10px] font-bold
                     text-[var(--color-bg-page)]
                     ring-[3px] ring-[var(--color-bg-page)]
                     transition-transform duration-200 ease-out
                     group-hover:-translate-y-0.5"
        >
          ✓
        </span>
      )}
    </div>
  );
}