"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  PaperAirplaneIcon,
  ClipboardIcon,
  CodeBracketIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { DEFAULT_LANGUAGE_ID } from "@/lib/cppLanguages";
import CppVersionSelect from "./CppVersionSelect";

/**
 * Submit UI: paste C++ code, submit, poll until judged.
 * Shows only aggregate feedback (passed/total + verdict; compiler output on CE)
 * — never per-testcase data.
 */

interface PublicSubmission {
  submissionId: string;
  problemId: string;
  done: boolean;
  status: "judging" | "done" | "error";
  verdict: "AC" | "WA" | "TLE" | "RE" | "CE" | "IE" | null;
  passed: number;
  total: number;
  compileOutput: string | null;
  createdAt: string;
  runtime?: number | null;
  memory?: number | null;
  /** Source the user submitted — returned by the history endpoint. */
  code?: string;
}

const VERDICT_LABELS: Record<string, string> = {
  AC: "Accepted",
  WA: "Wrong Answer",
  TLE: "Time Limit Exceeded",
  RE: "Runtime Error",
  CE: "Compilation Error",
  IE: "Judge Error — something went wrong on our side, try again",
};

// AC is the only "good" verdict; everything else renders red.
function verdictTone(verdict: string | null): "ok" | "bad" | "pending" {
  if (!verdict) return "pending";
  return verdict === "AC" ? "ok" : "bad";
}

const POLL_INTERVAL_MS = 1500;

// Lazy, memoized Shiki highlighter so the modal renders code exactly like the
// theory lessons (same dracula theme + .shiki-block markup). Loaded on demand
// the first time a submission's code is opened.
let highlighterPromise: Promise<
  import("shiki").Highlighter
> | null = null;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then((shiki) =>
      shiki.createHighlighter({ themes: ["dracula"], langs: ["cpp"] }),
    );
  }
  return highlighterPromise;
}

// Render C++ to Shiki HTML with our shiki-block markup (matches theory lessons).
function highlightCpp(
  hl: import("shiki").Highlighter,
  code: string,
): string {
  return hl.codeToHtml(code, {
    lang: "cpp",
    theme: "dracula",
    transformers: [
      {
        pre(node) {
          const existing = (node.properties.class ?? "") as string;
          node.properties.class = `${existing} shiki-block`.trim();
          node.properties["data-shiki"] = "true";
        },
      },
    ],
  });
}

export default function SubmitPanel({ problemId,time_limit,memory_limit}: { problemId: string, time_limit : number, memory_limit : number}) {
  const [code, setCode] = useState("");
  const [languageId, setLanguageId] = useState<number>(DEFAULT_LANGUAGE_ID);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublicSubmission | null>(null);
  const [history, setHistory] = useState<PublicSubmission[]>([]);
  const [viewing, setViewing] = useState<PublicSubmission | null>(null);
  const [hl, setHl] = useState<import("shiki").Highlighter | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  // Line count drives the always-present gutter (min 1 so the empty editor
  // still shows line "1").
  const lineCount = useMemo(
    () => Math.max(1, code.split("\n").length),
    [code],
  );

  // Load the Shiki highlighter once so the editor can colorize as you type.
  useEffect(() => {
    let active = true;
    getHighlighter().then((h) => {
      if (active) setHl(h);
    });
    return () => {
      active = false;
    };
  }, []);

  // Synchronously highlight the current code (null until the highlighter loads).
  const inputHtml = useMemo(() => {
    if (!hl || !code) return null;
    try {
      // Plain Shiki output (no .shiki-block) so we can match the textarea's
      // line metrics exactly for caret alignment.
      const html = hl.codeToHtml(code, {
        lang: "cpp",
        theme: "dracula",
        transformers: [
          {
            pre(node) {
              // The layer is decorative; keep it out of the tab order.
              delete node.properties.tabindex;
            },
          },
        ],
      });
      // Shiki puts a literal newline between each .line; with block-level lines
      // that would double the spacing, so drop the inter-line newlines.
      return html.replace(/\n(<span class="line")/g, "$1");
    } catch {
      return null;
    }
  }, [hl, code]);

  // Keep the highlight layer scrolled in lockstep with the textarea.
  const syncScroll = () => {
    const ta = editorRef.current;
    if (!ta) return;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = ta.scrollTop;
      highlightRef.current.scrollLeft = ta.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = ta.scrollTop;
    }
  };

  // Insert two spaces on Tab instead of moving focus.
  const handleEditorKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const ta = e.currentTarget;
    const { selectionStart, selectionEnd } = ta;
    const next = code.slice(0, selectionStart) + "  " + code.slice(selectionEnd);
    setCode(next);
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = selectionStart + 2;
    });
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/submissions?problemId=${encodeURIComponent(problemId)}`,
      );
      if (!res.ok) return;
      const data = await res.json();
      setHistory(data.submissions ?? []);
    } catch {
      // history is best-effort
    }
  }, [problemId]);

  useEffect(() => {
    loadHistory();
    return stopPolling;
  }, [loadHistory]);

  // Close the code viewer on Escape.
  useEffect(() => {
    if (!viewing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewing(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewing]);

  const startPolling = (submissionId: string) => {
    stopPolling();
    const poll = async () => {
      try {
        const res = await fetch(`/api/submissions/${submissionId}`);
        if (!res.ok) return; // transient — keep polling
        const data: PublicSubmission = await res.json();
        setResult(data);
        if (data.done) {
          stopPolling();
          setSubmitting(false);
          loadHistory();
        }
      } catch {
        // transient network error — keep polling
      }
    };
    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
  };

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, code, languageId }),
      });
      const data = await res.json();
      if (!res.ok) {
        // 429s carry the human-readable cooldown / daily-limit message
        setError(data.error ?? "Submission failed");
        setSubmitting(false);
        return;
      }
      startPolling(data.submissionId);
    } catch {
      setError("Network error — please try again.");
      setSubmitting(false);
    }
  };

  return (
    <section className="submit-panel">
      <div className="submit-header">
        <h2 className="submit-title">Submit your solution</h2>
        <CppVersionSelect
          value={languageId}
          onChange={setLanguageId}
          disabled={submitting}
        />
      </div>

      <div className="code-editor">
        <div className="code-editor-bar">
          <ClipboardIcon className="size-4" />
          <span>Paste your code below</span>
        </div>
        <div className="code-input">
          <div ref={gutterRef} className="code-input-gutter" aria-hidden>
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i} className="code-input-lineno">
                {i + 1}
              </span>
            ))}
          </div>
          {inputHtml && (
            <div
              ref={highlightRef}
              className="code-input-highlight"
              aria-hidden
              dangerouslySetInnerHTML={{ __html: inputHtml }}
            />
          )}
          <textarea
            ref={editorRef}
            className={`code-input-area ${inputHtml ? "is-highlighted" : ""}`}
            placeholder={"// Paste your full C++ solution here…"}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={syncScroll}
            onKeyDown={handleEditorKeyDown}
            wrap="off"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="submit-actions">
        <div className="submit-feedback">
          {error ? (
            <span className="text-danger">{error}</span>
          ) : result && !result.done ? (
            <span>
              Judging… {result.passed}/{result.total} testcases passed so far
            </span>
          ) : result && result.done ? (
            <span className={verdictTone(result.verdict) === "ok" ? "text-success" : "text-danger"}>
              {VERDICT_LABELS[result.verdict ?? ""] ?? result.verdict} —{" "}
              {result.passed}/{result.total} testcases passed
            </span>
          ) : (
            <span>Your verdict appears here after submitting.</span>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting || !code.trim()}
          className="submit-button"
        >
          <PaperAirplaneIcon className="size-4" />
          {submitting ? "Judging…" : "Submit"}
        </button>
      </div>

      {result?.done &&
        result.verdict === "CE" &&
        result.compileOutput && (
          <pre className="compile-output">{result.compileOutput}</pre>
        )}

      <div className="submissions-section">
        <h3 className="submissions-title">
          Your submissions{" "}
          <span className="submissions-count">
            {history.length} {history.length === 1 ? "attempt" : "attempts"}
          </span>
        </h3>

        {history.length === 0 ? (
          <p className="text-text-muted text-sm">No submissions yet.</p>
        ) : (
          <ul className="submissions-list">
            {history.map((s) => {
              const tone =
                s.status === "judging" ? "pending" : verdictTone(s.verdict);
              const label =
                s.status === "judging"
                  ? "Judging…"
                  : (VERDICT_LABELS[s.verdict ?? ""] ?? s.verdict ?? "—");
              return (
                <li key={s.submissionId} className={`submission-card tone-${tone}`}>
                  <span className="submission-dot" aria-hidden />
                  <div className="submission-main">
                    <div className="submission-verdict-row">
                      <span className="submission-verdict">{label}</span>
                      <span className="submission-lang">C++</span>
                    </div>
                    <div className="submission-passed">
                      {s.passed} / {s.total} testcases passed
                    </div>
                  </div>
                  <div className="submission-perf">
                    <span>runtime {formatRuntime(s.runtime,time_limit)}</span>
                    <span>memory {formatMemory(s.memory,memory_limit)}</span>
                  </div>
                  <time className="submission-time" dateTime={s.createdAt}>
                    {timeAgo(s.createdAt)}
                  </time>
                  {s.code && (
                    <button
                      type="button"
                      className="submission-view-btn"
                      onClick={() => setViewing(s)}
                      title="View submitted code"
                    >
                      <CodeBracketIcon className="size-4" />
                      <span className="submission-view-label">Code</span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {viewing && (
        <CodeViewer submission={viewing} onClose={() => setViewing(null)} />
      )}
    </section>
  );
}

function CodeViewer({
  submission,
  onClose,
}: {
  submission: PublicSubmission;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const tone =
    submission.status === "judging" ? "pending" : verdictTone(submission.verdict);
  const label =
    submission.status === "judging"
      ? "Judging…"
      : (VERDICT_LABELS[submission.verdict ?? ""] ?? submission.verdict ?? "—");

  // Lock background scroll while the modal is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Syntax-highlight the code the same way theory lessons do.
  useEffect(() => {
    let cancelled = false;
    setHighlighted(null);
    const code = submission.code ?? "";
    if (!code) return;
    (async () => {
      try {
        const hl = await getHighlighter();
        const html = highlightCpp(hl, code.replace(/\n$/, ""));
        if (!cancelled) setHighlighted(html);
      } catch {
        // Highlighter failed to load — keep the plain fallback.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [submission.code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(submission.code ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="code-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Submitted code"
      onClick={onClose}
    >
      <div className="code-modal" onClick={(e) => e.stopPropagation()}>
        <div className="code-modal-header">
          <div className="code-modal-heading">
            <span className={`submission-dot tone-${tone}`} aria-hidden />
            <span className={`submission-verdict tone-${tone}`}>{label}</span>
            <span className="submission-lang">C++</span>
            <span className="code-modal-time">{timeAgo(submission.createdAt)}</span>
          </div>
          <div className="code-modal-actions">
            <button
              type="button"
              className={`code-copy-btn ${copied ? "copied" : ""}`}
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              type="button"
              className="code-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <XMarkIcon className="size-5" />
            </button>
          </div>
        </div>
        <div className="code-modal-body">
          {highlighted ? (
            <div
              className="code-block-wrapper not-prose code-modal-codeblock"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          ) : (
            <pre className="code-modal-pre">
              <code>{submission.code}</code>
            </pre>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function formatRuntime(time: number | null | undefined, time_limit? : number | null | undefined): string {
  if(time == null) return "-"
  if(time_limit == null) return `${time}s`
  if(time > time_limit) return `>=${time_limit}s`
  return `${time}s`
}

function formatMemory(kb: number | null | undefined, memory_limit? : number | null | undefined): string {
  if (kb == null) return "-";
  if(memory_limit == null) return `${(kb / 1024).toFixed(1)} MB`;
  if(kb/1024 > memory_limit) return `>=${memory_limit} MB`
  return `${(kb / 1024).toFixed(1)} MB`;
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.max(0, Date.now() - then);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} day${day === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString();
}
