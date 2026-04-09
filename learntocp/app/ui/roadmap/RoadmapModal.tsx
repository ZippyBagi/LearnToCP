"use client";

import { useEffect, useRef, useState } from "react";
import React from "react";
import type { RoadmapNode } from "@/app/utils/roadmap.types";

const MODAL_ANIM_CSS = `
@keyframes roadmap-modal-in {
  from { opacity: 0; transform: scale(0.97) translateY(8px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);   }
}
.roadmap-modal-card {
  animation: roadmap-modal-in 160ms cubic-bezier(0.16, 1, 0.3, 1) both;
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
  return (
    React.createElement("svg", { width: 9, height: 7, viewBox: "0 0 9 7", fill: "none" },
      React.createElement("path", {
        d: "M1 3.5L3.5 6L8 1",
        stroke: "white",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      })
    )
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
    border: "1px solid #22c55e",
    boxShadow: "0 0 8px rgba(34,197,94,0.35)",
  };
  const uncheckedStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid #2a5480",
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
        className="h-4 w-4 rounded cursor-pointer flex items-center justify-center transition-all"
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
  const [hovered, setHovered] = useState(false);

  const linkStyle: React.CSSProperties = checked
    ? { color: "#3a6080", textDecoration: "line-through" }
    : { color: "#7eb8f7", textDecoration: "none" };

  const anchorProps = {
    href: item.href,
    target: item.href !== "#" ? "_blank" : undefined,
    rel: "noopener noreferrer",
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    className: "text-sm transition-colors",
    style: linkStyle,
  };

  return (
    <li
      className="flex items-center gap-3 rounded px-2 py-2 transition-all"
      style={{ background: hovered ? "rgba(20,70,130,0.12)" : "transparent" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        {React.createElement("a", anchorProps, item.label)}
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
  const [closeBtnHovered, setCloseBtnHovered] = useState(false);

  const completedCount = checked.filter(Boolean).length;
  const total = node.items.length;
  const pct = total > 0 ? (completedCount / total) * 100 : 0;

  useInjectStyle("roadmap-modal-style", MODAL_ANIM_CSS);

  useEffect(() => { closeBtnRef.current?.focus(); }, []);

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
    return () => { document.body.style.overflow = prev; };
  }, []);

  const closeBtnStyle: React.CSSProperties = {
    color: closeBtnHovered ? "#7eb8f7" : "#4a7aaa",
    background: closeBtnHovered ? "rgba(30,90,160,0.15)" : "transparent",
  };

  const progressBarStyle: React.CSSProperties = {
    width: `${pct}%`,
    background:
      pct === 100
        ? "linear-gradient(90deg, #16a34a, #22c55e)"
        : "linear-gradient(90deg, #1e5fa0, #4a9eff)",
    boxShadow:
      pct === 100
        ? "0 0 8px rgba(34,197,94,0.5)"
        : "0 0 8px rgba(74,158,255,0.4)",
  };

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
      <div
        aria-hidden
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(4, 14, 28, 0.75)" }}
      />

      <div
        className="roadmap-modal-card relative z-10 w-full max-w-md rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #152f4e 0%, #0f2239 100%)",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          border: "1px solid #2e5480",
          boxShadow: "0 0 0 1px rgba(46,120,200,0.25), 0 8px 48px rgba(0,0,0,0.6), 0 0 60px rgba(20,80,160,0.12)",
        }}
      >
        <div
          className="flex items-start justify-between gap-4 px-5 py-4"
          style={{borderBottom: "1px solid #243f60"}}
        >
          <h2
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: "#c8daf0" }}
          >
            {node.title}
          </h2>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            onMouseEnter={() => setCloseBtnHovered(true)}
            onMouseLeave={() => setCloseBtnHovered(false)}
            aria-label="Close modal"
            className="cursor-pointer flex h-6 w-6 shrink-0 items-center justify-center rounded transition-all text-sm leading-none"
            style={closeBtnStyle}
          >
            ✕
          </button>
        </div>

        <ul className="space-y-0.5 px-4 py-3" role="list">
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

        <div
          className="px-5 py-4"
          style={{ borderTop: "1px solid #243f60" }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: "#2e5a80" }}
            >
              Progress
            </span>
            <span
              className="text-xs font-mono"
              style={{ color: pct === 100 ? "#22c55e" : "#4a7aaa" }}
            >
              {completedCount} / {total}
              {pct === 100 && " ✓"}
            </span>
          </div>

          <div
            className="h-1 w-full overflow-hidden rounded-full"
            style={{ background: "#142944" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={progressBarStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}