"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Mail } from "lucide-react";

type CopyEmailPillProps = {
  email: string;
  copiedLabel: string;
  ariaLabel: string;
};

export default function CopyEmailPill({
  email,
  copiedLabel,
  ariaLabel,
}: CopyEmailPillProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel}
      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 ${
        copied
          ? "border-success/45 bg-success/10 text-success focus-visible:ring-success"
          : "border-accent-border bg-accent/10 text-accent hover:border-accent-border-hover hover:bg-accent/[0.18] focus-visible:ring-accent"
      }`}
    >
      {copied ? (
        <Check size={16} strokeWidth={2} />
      ) : (
        <Mail size={16} strokeWidth={2} />
      )}
      <span className="grid text-left">
        <span
          aria-hidden={copied}
          className={`col-start-1 row-start-1 font-mono text-[13px] font-medium ${copied ? "invisible" : ""}`}
        >
          {email}
        </span>
        <span
          aria-hidden={!copied}
          className={`col-start-1 row-start-1 self-center justify-self-center ${copied ? "" : "invisible"}`}
        >
          {copiedLabel}
        </span>
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  );
}
