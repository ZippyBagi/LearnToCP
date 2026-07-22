"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  DocumentTextIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import SubmitPanel from "./SubmitPanel";
import { getProblemMessages } from "@/translations";

interface ProblemMetaView {
  title: string;
  difficulty: "Super Easy" | "Easy" | "Medium" | "Hard" | "Olympiad Level" | null;
  number: number | null;
  note: string | null;
  timeLimitLabel: string;
  memoryLabel: string;
  inputSource: string;
  outputSource: string;
}

interface ProblemViewProps {
  problemId: string;
  locale: string;
  meta: ProblemMetaView;
  statementHtml: string | null;
  solutionHtml: string | null;
  /** Whether the signed-in user has already solved (AC'd) this problem. */
  solved: boolean;
  /** Signed-out visitors see a sign-in CTA instead of the submit panel. */
  isAuthed: boolean;
}

type Tab = "statement" | "solution";

const DIFFICULTY_CLASS: Record<string, string> = {
  "Super Easy": "difficulty-super-easy",
  Easy: "difficulty-easy",
  Medium: "difficulty-medium",
  Hard: "difficulty-hard",
  "Olympiad Level": "difficulty-olympiad",
};

export default function ProblemView({
  problemId,
  locale,
  meta,
  statementHtml,
  solutionHtml,
  solved,
  isAuthed,
}: ProblemViewProps) {
  const t = getProblemMessages(locale);
  const [tab, setTab] = useState<Tab>("statement");
  // Once the solution has been revealed (or the problem is already solved),
  // we don't keep nagging on every tab switch.
  const [solutionUnlocked, setSolutionUnlocked] = useState(solved);
  const [confirmingReveal, setConfirmingReveal] = useState(false);

  const handleSolutionClick = () => {
    if (solutionUnlocked) {
      setTab("solution");
    } else {
      setConfirmingReveal(true);
    }
  };

  const confirmReveal = () => {
    setSolutionUnlocked(true);
    setConfirmingReveal(false);
    setTab("solution");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Tab toggle */}
      <div className="flex justify-center mb-8">
        <div className="problem-tabs">
          <span className="problem-tab-indicator" data-tab={tab} aria-hidden="true" />
          <button
            type="button"
            className={`problem-tab ${tab === "statement" ? "is-active" : ""}`}
            onClick={() => setTab("statement")}
          >
            <DocumentTextIcon className="size-4" />
            {t.tabStatement}
          </button>
          <button
            type="button"
            className={`problem-tab ${tab === "solution" ? "is-active" : ""}`}
            onClick={handleSolutionClick}
          >
            <LightBulbIcon className="size-4" />
            {t.tabSolution}
          </button>
        </div>
      </div>

      {confirmingReveal && (
        <RevealSolutionDialog
          t={t}
          onConfirm={confirmReveal}
          onCancel={() => setConfirmingReveal(false)}
        />
      )}

      {tab === "statement" ? (
        <>
          <header className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-text-heading tracking-tight">
              {meta.title}
            </h1>
            {(meta.difficulty || meta.number != null) && (
              <div className="mt-3 flex items-center justify-center gap-3 text-sm">
                {meta.difficulty && (
                  <span
                    className={`difficulty-badge ${DIFFICULTY_CLASS[meta.difficulty] ?? ""}`}
                  >
                    {t.difficulty[meta.difficulty]}
                  </span>
                )}
                {meta.number != null && (
                  <span className="font-mono text-text-muted">
                    {t.problemNumber(meta.number)}
                  </span>
                )}
              </div>
            )}
          </header>

          <table className="problem-meta-table">
            <thead>
              <tr>
                <th>{t.thTime}</th>
                <th>{t.thMemory}</th>
                <th>{t.thInput}</th>
                <th>{t.thOutput}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{meta.timeLimitLabel}</td>
                <td>{meta.memoryLabel}</td>
                <td>{meta.inputSource}</td>
                <td>{meta.outputSource}</td>
              </tr>
            </tbody>
          </table>

          {meta.note && <p className="problem-note">{meta.note}</p>}

          {statementHtml ? (
            <article
              className="prose prose-slate dark:prose-invert max-w-none problem-article"
              dangerouslySetInnerHTML={{ __html: statementHtml }}
            />
          ) : (
            <p className="text-text-muted">{t.noStatement}</p>
          )}

          {isAuthed ? (
            <SubmitPanel problemId={problemId} locale={locale} time_limit={parseFloat(meta.timeLimitLabel)} memory_limit={parseInt(meta.memoryLabel)} onSolved={() => setSolutionUnlocked(true)}/>
          ) : (
            <section className="submit-panel">
              <div className="submit-header">
                <h2 className="submit-title">{t.submitTitle}</h2>
              </div>
              <div className="signin-cta">
                <ArrowRightEndOnRectangleIcon className="size-8 text-text-muted" />
                <p className="signin-cta-text">{t.signInPrompt}</p>
                <a
                  href={`/${locale}/login?next=${encodeURIComponent(`/${locale}/Problems/${encodeURIComponent(problemId)}`)}`}
                  className="signin-cta-button"
                >
                  {t.signInAction}
                </a>
              </div>
            </section>
          )}
        </>
      ) : (
        <section>
          <h1 className="text-4xl font-extrabold text-text-heading text-center tracking-tight mb-8">
            {t.editorialTitle(meta.title)}
          </h1>
          {solutionHtml ? (
            <article
              className="prose prose-slate dark:prose-invert max-w-none problem-article"
              dangerouslySetInnerHTML={{ __html: solutionHtml }}
            />
          ) : (
            <div className="solution-empty">
              <LightBulbIcon className="size-8 text-text-muted mb-3" />
              <p className="font-medium text-text-heading">
                {t.noSolutionTitle}
              </p>
              <p className="text-sm text-text-muted mt-1">
                {t.noSolutionBody}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function RevealSolutionDialog({
  t,
  onConfirm,
  onCancel,
}: {
  t: ReturnType<typeof getProblemMessages>;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onCancel]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="code-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reveal-solution-title"
      onClick={onCancel}
    >
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-icon">
          <ExclamationTriangleIcon className="size-6" />
        </div>
        <h2 id="reveal-solution-title" className="confirm-modal-title">
          {t.revealTitle}
        </h2>
        <p className="confirm-modal-text">
          {t.revealBody}
        </p>
        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-btn confirm-btn-cancel"
            onClick={onCancel}
            autoFocus
          >
            {t.keepTrying}
          </button>
          <button
            type="button"
            className="confirm-btn confirm-btn-danger"
            onClick={onConfirm}
          >
            <LightBulbIcon className="size-4" />
            {t.revealConfirm}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
