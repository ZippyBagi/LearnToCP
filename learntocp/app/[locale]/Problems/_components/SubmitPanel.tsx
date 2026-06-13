"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal submit UI: paste C++ code, submit, poll until judged.
 * Shows only aggregate feedback (passed/total + verdict; compiler output on CE)
 * — never per-testcase data. Placeholder UI, design comes later.
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
}

const VERDICT_LABELS: Record<string, string> = {
  AC: "Accepted",
  WA: "Wrong Answer",
  TLE: "Time Limit Exceeded",
  RE: "Runtime Error",
  CE: "Compilation Error",
  IE: "Judge Error — something went wrong on our side, try again",
};

const POLL_INTERVAL_MS = 1500;

export default function SubmitPanel({ problemId }: { problemId: string }) {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublicSubmission | null>(null);
  const [history, setHistory] = useState<PublicSubmission[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        body: JSON.stringify({ problemId, code }),
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
    <section className="mt-8 space-y-4">
      <h2 className="text-lg font-semibold">Submit (C++)</h2>

      <textarea
        className="w-full h-64 p-3 font-mono text-sm border rounded-md bg-transparent"
        placeholder="Paste your C++ code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
      />

      <button
        onClick={handleSubmit}
        disabled={submitting || !code.trim()}
        className="px-4 py-2 rounded-md border font-medium disabled:opacity-50"
      >
        {submitting ? "Judging..." : "Submit"}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {result && (
        <div className="text-sm space-y-2">
          {!result.done ? (
            <p>
              Judging... {result.passed}/{result.total} testcases passed so far
            </p>
          ) : (
            <>
              <p>
                <strong>
                  {result.passed}/{result.total}
                </strong>{" "}
                testcases passed
                {result.verdict && (
                  <> — {VERDICT_LABELS[result.verdict] ?? result.verdict}</>
                )}
              </p>
              {result.verdict === "CE" && result.compileOutput && (
                <pre className="p-3 text-xs border rounded-md overflow-x-auto whitespace-pre-wrap">
                  {result.compileOutput}
                </pre>
              )}
            </>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="text-sm">
          <h3 className="font-semibold mt-6 mb-2">Your submissions</h3>
          <ul className="space-y-1">
            {history.map((s) => (
              <li key={s.submissionId} className="flex gap-4">
                <span className="tabular-nums">
                  {new Date(s.createdAt).toLocaleString()}
                </span>
                <span>
                  {s.passed}/{s.total}
                </span>
                <span>
                  {s.status === "judging"
                    ? "Judging..."
                    : (VERDICT_LABELS[s.verdict ?? ""] ?? s.verdict ?? "—")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
