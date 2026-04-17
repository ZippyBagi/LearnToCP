"use client";

import { useEffect, useRef, useState } from "react";
import React from "react";
import type { RoadmapNode } from "@/app/utils/roadmap.types";

const MODAL_ANIM_CSS = `
@keyframes roadmap-modal-in {
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);   }
}
.roadmap-modal-card {
  animation: roadmap-modal-in 180ms cubic-bezier(0.16, 1, 0.3, 1) both;
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

interface RoadmapModalProps {
  node: RoadmapNode;
  checked: boolean[];
  onToggle: (itemIndex: number) => void;
  onClose: () => void;
}

function CheckIcon() {
  return React.createElement(
    "svg",
    { width: 9, height: 7, viewBox: "0 0 9 7", fill: "none" },
    React.createElement("path", {
      d: "M1 3.5L3.5 6L8 1",
      stroke: "white",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  );
}

function ModalCheckbox({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: () => void;
  id: string;
}) {
  const checkedStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    border: "1px solid rgba(80,250,123,0.6)",
    boxShadow: "0 0 6px rgba(34,197,94,0.3)",
  };
  const uncheckedStyle: React.CSSProperties = {
    background: "rgba(13,33,55,0.8)",
    border: "1px solid rgba(124,158,248,0.25)",
    boxShadow: "none",
  };

  return (
    <div className="relative shrink-0">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        onClick={onChange}
        className="h-4 w-4 rounded-[4px] cursor-pointer flex items-center justify-center transition-all duration-150"
        style={checked ? checkedStyle : uncheckedStyle}
      >
        {checked && <CheckIcon />}
      </div>
    </div>
  );
}

function ModalItem({
  item,
  checked,
  onToggle,
  index,
}: {
  item: RoadmapNode["items"][number];
  checked: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <li
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 group/item"
      style={{
        background: checked
          ? "rgba(80,250,123,0.04)"
          : "transparent",
      }}
      onMouseEnter={(e) =>
        !checked && ((e.currentTarget as HTMLLIElement).style.background = "rgba(124,158,248,0.06)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLLIElement).style.background = checked ? "rgba(80,250,123,0.04)" : "transparent")
      }
    >
      <ModalCheckbox
        checked={checked}
        onChange={onToggle}
        id={`modal-item-${index}`}
      />
      <label
        htmlFor={`modal-item-${index}`}
        className="flex-1 cursor-pointer min-w-0"
      >
        {React.createElement(
          "a",
          {
            href: item.href,
            target: item.href !== "#" ? "_blank" : undefined,
            rel: "noopener noreferrer",
            onClick: (e: React.MouseEvent) => e.stopPropagation(),
            className: "text-sm transition-colors duration-150",
            style: checked
              ? {
                  color: "rgba(80,250,123,0.4)",
                  textDecoration: "line-through",
                  textDecorationColor: "rgba(80,250,123,0.25)",
                }
              : { color: "var(--color-text-heading)" },
          },
          item.label
        )}
      </label>
    </li>
  );
}

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
  const isAllDone = pct === 100;

  useInjectStyle("roadmap-modal-style", MODAL_ANIM_CSS);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={node.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 backdrop-blur-[6px]"
        style={{ backgroundColor: "rgba(0, 10, 20, 0.80)" }}
      />

      {/* Card */}
      <div
        className="roadmap-modal-card relative z-10 w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: isAllDone
            ? "linear-gradient(160deg, #0d2137 0%, #0b2a1a 100%)"
            : "linear-gradient(160deg, #0d2137 0%, #091826 100%)",
          border: isAllDone
            ? "1px solid rgba(80,250,123,0.45)"
            : "1px solid rgba(124,158,248,0.22)",
          boxShadow: isAllDone
            ? "0 0 0 1px rgba(80,250,123,0.08), 0 24px 60px rgba(0,0,0,0.7), 0 0 80px rgba(80,250,123,0.06)"
            : "0 0 0 1px rgba(124,158,248,0.06), 0 24px 60px rgba(0,0,0,0.7), 0 0 80px rgba(50,100,200,0.08)",
          maxHeight: "85vh",
          transition: "border-color 300ms ease, box-shadow 300ms ease",
        }}
      >
        {/* Header */}
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
              {node.title}
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close modal"
            className="cursor-pointer flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-150 text-sm leading-none"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-heading)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,158,248,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-muted)";
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            ✕
          </button>
        </div>

        {/* Items list */}
        <ul
          className="space-y-0.5 px-3 py-3 overflow-y-auto flex-1"
          role="list"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(124,158,248,0.2) transparent" }}
        >
          {node.items.map((item, i) => (
            <ModalItem
              key={i}
              item={item}
              checked={checked[i] ?? false}
              onToggle={() => onToggle(i)}
              index={i}
            />
          ))}
        </ul>

        {/* Footer progress */}
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
  );
}
