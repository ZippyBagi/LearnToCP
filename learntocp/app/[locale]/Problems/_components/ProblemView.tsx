"use client";

import { useState } from "react";
import {
  DocumentTextIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import SubmitPanel from "./SubmitPanel";

interface ProblemMetaView {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | null;
  number: number | null;
  note: string | null;
  timeLimitLabel: string;
  memoryLabel: string;
  inputSource: string;
  outputSource: string;
}

interface ProblemViewProps {
  problemId: string;
  meta: ProblemMetaView;
  statementHtml: string | null;
  solutionHtml: string | null;
}

type Tab = "statement" | "solution";

const DIFFICULTY_CLASS: Record<string, string> = {
  Easy: "difficulty-easy",
  Medium: "difficulty-medium",
  Hard: "difficulty-hard",
};

export default function ProblemView({
  problemId,
  meta,
  statementHtml,
  solutionHtml,
}: ProblemViewProps) {
  const [tab, setTab] = useState<Tab>("statement");

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
            Statement
          </button>
          <button
            type="button"
            className={`problem-tab ${tab === "solution" ? "is-active" : ""}`}
            onClick={() => setTab("solution")}
          >
            <LightBulbIcon className="size-4" />
            Solution
          </button>
        </div>
      </div>

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
                    {meta.difficulty}
                  </span>
                )}
                {meta.number != null && (
                  <span className="font-mono text-text-muted">
                    Problem #{meta.number}
                  </span>
                )}
              </div>
            )}
          </header>

          <table className="problem-meta-table">
            <thead>
              <tr>
                <th>Time Limit</th>
                <th>Memory</th>
                <th>Input</th>
                <th>Output</th>
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
            <p className="text-text-muted">No statement available.</p>
          )}

          <SubmitPanel problemId={problemId} time_limit={parseFloat(meta.timeLimitLabel)} memory_limit={parseInt(meta.memoryLabel)}/>
        </>
      ) : (
        <section>
          <h1 className="text-4xl font-extrabold text-text-heading text-center tracking-tight mb-8">
            Editorial — {meta.title}
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
                No solution published yet
              </p>
              <p className="text-sm text-text-muted mt-1">
                The editorial for this problem hasn&apos;t been written. Check
                back later.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
