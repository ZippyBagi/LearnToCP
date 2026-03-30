"use client";

import { useEffect, useRef } from "react";
import type { RoadmapNode } from "@/app/utils/roadmap.types";

// ─── Animation (no tailwindcss-animate plugin required) ────────────────────────
const MODAL_ANIM_CSS = `
@keyframes roadmap-modal-in {
  from { opacity: 0; transform: scale(0.95) translateY(6px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);   }
}
.roadmap-modal-card {
  animation: roadmap-modal-in 140ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
`;

function useInjectStyle(id: string, css: string) {
  useEffect(() => {
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id;
    tag.textContent = css;
    document.head.appendChild(tag);
  }, [id, css]);
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface RoadmapModalProps {
  node: RoadmapNode;
  /** One boolean per item in node.items */
  checked: boolean[];
  onToggle: (itemIndex: number) => void;
  onClose: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function RoadmapModal({
  node,
  checked,
  onToggle,
  onClose,
}: RoadmapModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const completedCount = checked.filter(Boolean).length;
  const total = node.items.length;
  const pct = total > 0 ? (completedCount / total) * 100 : 0;

  /* Inject animation CSS once */
  useInjectStyle("roadmap-modal-style", MODAL_ANIM_CSS);

  /* Move focus into the dialog when it opens */
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  /* Lock body scroll while open */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    /* Overlay */
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={node.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[var(--color-bg-page)]/70 backdrop-blur-sm"
      />

      {/* Card */}
      <div className="roadmap-modal-card relative z-10 w-full max-w-md rounded-lg border border-[var(--color-accent-border-active)] bg-[var(--color-bg-surface)] shadow-[0_0_40px_rgba(124,158,248,0.12)]">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-accent-border-subtle)] px-5 py-4">
          <h2 className="text-base font-semibold leading-snug text-[var(--color-text-heading)]">
            {node.title}
          </h2>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close modal"
            className="cursor-pointer flex h-7 w-7 shrink-0 items-center justify-center rounded
                       text-[var(--color-text-muted)] transition-colors
                       hover:bg-[var(--color-accent-tint)] hover:text-[var(--color-text-primary)]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <ul className="space-y-1 px-5 py-4" role="list">
          {node.items.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors
                         hover:bg-[var(--color-accent-tint)]"
            >
              <input
                type="checkbox"
                id={`modal-item-${i}`}
                checked={checked[i] ?? false}
                onChange={() => onToggle(i)}
                className="h-[15px] w-[15px] shrink-0 cursor-pointer rounded accent-[var(--color-accent)]"
              />
              <label htmlFor={`modal-item-${i}`} className="flex-1 cursor-pointer">
                <a
                  href={item.href}
                  target={item.href !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={[
                    "text-sm transition-colors",
                    checked[i]
                      ? "text-[var(--color-text-muted)] line-through"
                      : "text-[var(--color-text-accent)] hover:underline",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              </label>
            </li>
          ))}
        </ul>

        {/* Progress footer */}
        <div className="border-t border-[var(--color-accent-border-subtle)] px-5 py-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-[var(--color-text-muted)]">Progress</span>
            <span
              className={
                pct === 100
                  ? "font-semibold text-[var(--color-success)]"
                  : "text-[var(--color-text-muted)]"
              }
            >
              {completedCount} / {total}
              {pct === 100 && " — complete!"}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-accent-border-subtle)]">
            <div
              className={[
                "h-full rounded-full transition-all duration-500",
                pct === 100 ? "bg-[var(--color-success)]" : "bg-[var(--color-accent)]",
              ].join(" ")}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}