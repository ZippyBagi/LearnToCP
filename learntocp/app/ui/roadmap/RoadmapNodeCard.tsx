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
  return (
    <button
      onClick={onClick}
      aria-label={`Open ${title}`}
      className={[
        // Layout — wider cards to fill the page properly
        "cursor-pointer group relative flex min-w-[200px] max-w-[300px] w-full flex-col items-start",
        "rounded-md border px-5 py-4 text-left text-base font-medium",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--color-accent)]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-page)]",
        isComplete
          ? [
              "border-[var(--color-success-border)]",
              "bg-[var(--color-success-tint)]",
              "text-[var(--color-success)]",
              "shadow-[0_0_14px_rgba(80,250,123,0.12)]",
            ].join(" ")
          : [
              "border-[var(--color-accent-border)]",
              "bg-[var(--color-bg-surface)]",
              "text-[var(--color-text-heading)]",
              "hover:border-[var(--color-accent-border-hover)]",
              "hover:bg-[var(--color-accent-tint)]",
              "hover:shadow-[0_0_18px_rgba(124,158,248,0.14)]",
            ].join(" "),
      ].join(" ")}
    >
      {/* Completion badge */}
      {isComplete && (
        <span
          aria-hidden
          className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center
                     rounded-full bg-[var(--color-success)] text-[9px] font-bold
                     text-[var(--color-bg-page)] shadow"
        >
          ✓
        </span>
      )}

      <span className="leading-snug">{title}</span>

      {/* Progress bar — only when partially done */}
      {!isComplete && progress > 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden
                     rounded-b-md bg-[var(--color-accent-border-subtle)]"
        >
          <div
            className="h-full rounded-b-md bg-[var(--color-accent)] transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
    </button>
  );
}