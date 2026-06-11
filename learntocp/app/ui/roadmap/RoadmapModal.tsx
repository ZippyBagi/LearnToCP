"use client";

import { useEffect } from "react";
import type { RoadmapNode } from "@/app/[locale]/roadmap/roadmap.types";

const MODAL_STYLES = `
@keyframes roadmap-modal-in {
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);   }
}
.roadmap-modal-card {
  animation: roadmap-modal-in 180ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.roadmap-row:not(.is-checked):hover {
  background: rgba(124,158,248,0.06);
}
.roadmap-close:hover {
  color: var(--color-text-heading);
  background: rgba(124,158,248,0.1);
}
`;

interface RoadmapModalProps {
  node: RoadmapNode;
  checked: boolean[];
  onToggle: (itemIndex: number) => void;
  onClose: () => void;
}

const checkboxCheckedStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  border: "1px solid rgba(80,250,123,0.6)",
  boxShadow: "0 0 6px rgba(34,197,94,0.3)",
};

const checkboxUncheckedStyle: React.CSSProperties = {
  background: "rgba(13,33,55,0.8)",
  border: "1px solid rgba(124,158,248,0.25)",
};

function CheckIcon() {
  return (
    <svg width={9} height={7} viewBox="0 0 9 7" fill="none">
      <path
        d="M1 3.5L3.5 6L8 1"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ModalItem({
  item,
  checked,
  onToggle,
}: {
  item: RoadmapNode["items"][number];
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li
      className={`roadmap-row relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 ${
        checked ? "is-checked" : ""
      }`}
      style={{ background: checked ? "rgba(80,250,123,0.04)" : "transparent" }}
    >
      {/* z-10 places this above the link's stretched ::before so clicks toggle rather than navigate;
          ::before on the button expands the hit area ~10px beyond the 16×16 square */}
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={`Mark "${item.label}" as ${checked ? "incomplete" : "complete"}`}
        onClick={onToggle}
        className="relative z-10 h-4 w-4 shrink-0 cursor-pointer rounded-[4px] flex items-center justify-center transition-all duration-150 before:content-[''] before:absolute before:-inset-2.5"
        style={checked ? checkboxCheckedStyle : checkboxUncheckedStyle}
      >
        {checked && <CheckIcon />}
      </button>

      {/* ::before with inset-0 makes the whole row a link target; checkbox sits above via z-10 */}
      <a
        href={item.href}
        target={item.href !== "#" ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="flex-1 min-w-0 text-sm transition-colors duration-150 before:content-[''] before:absolute before:inset-0"
        style={
          checked
            ? {
                color: "rgba(80,250,123,0.4)",
                textDecoration: "line-through",
                textDecorationColor: "rgba(80,250,123,0.25)",
              }
            : { color: "var(--color-text-heading)" }
        }
      >
        {item.label}
      </a>
    </li>
  );
}

export function RoadmapModal({
  node,
  checked,
  onToggle,
  onClose,
}: RoadmapModalProps) {
  const completedCount = checked.filter(Boolean).length;
  const total = node.items.length;
  const pct = total > 0 ? (completedCount / total) * 100 : 0;
  const isAllDone = total > 0 && completedCount === total;

  // Escape-to-close + body scroll lock, combined into a single effect
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <>
      <style>{MODAL_STYLES}</style>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={node.title.replace(/^[0-9]+/, '')}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 backdrop-blur-[6px]"
          style={{ backgroundColor: "rgba(0, 10, 20, 0.80)" }}
        />

        <div
          className="roadmap-modal-card relative z-10 w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: isAllDone
              ? "linear-gradient(160deg, #0d2137 0%, #0b2a1a 100%)"
              : "linear-gradient(160deg, #0d2137 0%, #091826 100%)",
            border: isAllDone
              ? "2px solid rgba(80,250,123,0.45)"
              : "2px solid rgba(124,158,248,0.22)",
            boxShadow: isAllDone
              ? "0 0 0 1px rgba(80,250,123,0.08), 0 24px 60px rgba(0,0,0,0.7), 0 0 80px rgba(80,250,123,0.06)"
              : "0 0 0 1px rgba(124,158,248,0.06), 0 24px 60px rgba(0,0,0,0.7), 0 0 80px rgba(50,100,200,0.08)",
            maxHeight: "85vh",
            transition: "border-color 300ms ease, box-shadow 300ms ease",
          }}
        >
          <div
            className="flex items-center justify-between gap-4 px-5 py-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(124,158,248,0.12)" }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isAllDone && (
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                  style={{
                    background: "rgba(80,250,123,0.15)",
                    color: "var(--color-success)",
                    border: "1px solid rgba(80,250,123,0.3)",
                  }}
                >
                  ✓
                </span>
              )}
              <h2
                className="text-sm font-semibold tracking-wider uppercase truncate"
                style={{ color: isAllDone ? "var(--color-success)" : "var(--color-text-heading)" }}
              >
                {node.title.replace(/^[0-9]+/, '')}
              </h2>
            </div>
            <button
              autoFocus
              onClick={onClose}
              aria-label="Close modal"
              className="roadmap-close cursor-pointer flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-150 text-sm leading-none"
              style={{ color: "var(--color-text-muted)" }}
            >
              ✕
            </button>
          </div>

          <ul
            className="space-y-0.5 px-3 py-3 overflow-y-auto flex-1"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(124,158,248,0.2) transparent" }}
          >
            {node.items.map((item, i) => (
              <ModalItem
                key={item.id}
                item={item}
                checked={checked[i] ?? false}
                onToggle={() => onToggle(i)}
              />
            ))}
          </ul>

          <div
            className="px-5 py-4 shrink-0"
            style={{ borderTop: "1px solid rgba(124,158,248,0.12)" }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span
                className="text-xs uppercase tracking-widest font-medium"
                style={{ color: "var(--color-text-muted)" }}
              >
                Progress
              </span>
              <span
                className="text-xs font-mono font-semibold"
                style={{ color: isAllDone ? "var(--color-success)" : "var(--color-accent)" }}
              >
                {completedCount} / {total}
                {isAllDone && " ✓"}
              </span>
            </div>

            <div
              className="h-1.5 w-full overflow-hidden rounded-full"
              style={{ background: "rgba(124,158,248,0.08)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${pct}%`,
                  background: isAllDone
                    ? "linear-gradient(90deg, #16a34a, #50fa7b)"
                    : "linear-gradient(90deg, #4a7ff7, #7c9ef8)",
                  boxShadow: isAllDone
                    ? "0 0 8px rgba(80,250,123,0.4)"
                    : "0 0 8px rgba(124,158,248,0.3)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
