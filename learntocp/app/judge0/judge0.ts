import "server-only";

/**
 * Judge0 CE client (hosted on RapidAPI).
 *
 * Server-only: the RapidAPI key is billed per submission, so all calls go
 * through our API routes - the browser never talks to Judge0 directly.
 */


export {
  CPP_LANGUAGES,
  DEFAULT_LANGUAGE_ID,
  isSupportedLanguageId,
  compilerOptionsFor,
} from "./cppLanguages";
export type { CppLanguage } from "./cppLanguages";

import { DEFAULT_LANGUAGE_ID, compilerOptionsFor } from "./cppLanguages";

/** Hosted plans cap submissions per batch call (commonly 20) - we chunk to stay under it. */
const MAX_BATCH_SIZE = 20;

export interface SubmissionRequest {
  sourceCode: string;
  languageId?: number;
  stdin?: string;
  expectedOutput?: string;
  cpuTimeLimit?: number;   // seconds
  memoryLimit?: number;    // KB,  262144 = 256 MB
}

export interface SubmissionResult {
  token: string;
  status: { id: number; description: string };
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  time: string | null;    // seconds
  memory: number | null;  // KB
  message: string | null;
}

// Judge0 status ids
export const STATUS = {
  IN_QUEUE: 1,
  PROCESSING: 2,
  ACCEPTED: 3,
  WRONG_ANSWER: 4,
  TIME_LIMIT_EXCEEDED: 5,
  COMPILATION_ERROR: 6,
} as const;

export function isFinal(statusId: number) {
  return statusId >= STATUS.ACCEPTED;
}

export function isAccepted(statusId: number) {
  return statusId === STATUS.ACCEPTED;
}

// Thrown when Judge0/RapidAPI rejects a call - carries the upstream HTTP status.
export class Judge0Error extends Error {
  constructor(
    public readonly httpStatus: number,
    message: string,
  ) {
    super(message);
    this.name = "Judge0Error";
  }
}

const JUDGE0_URL = process.env.JUDGE0_URL!;
const RAPIDAPI_KEY = process.env.JUDGE0_RAPIDAPI_KEY!;
const RAPIDAPI_HOST = process.env.JUDGE0_RAPIDAPI_HOST!;

function headers() {
  return {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": RAPIDAPI_HOST,
  };
}

function toJudge0Payload(req: SubmissionRequest) {
  const languageId = req.languageId ?? DEFAULT_LANGUAGE_ID;
  return {
    language_id: languageId,
    compiler_options: compilerOptionsFor(languageId),
    source_code: req.sourceCode,
    stdin: req.stdin ?? "",
    expected_output: req.expectedOutput ?? null,
    cpu_time_limit: req.cpuTimeLimit ?? 2.0,
    memory_limit: req.memoryLimit ?? 262144,
  };
}

/**
 * Submit testcases as Judge0 batch submissions; returns one token per testcase,
 * in input order. Chunks into multiple batch calls when over the hosted cap.
 *
 * NEVER auto-retry this on failure - each submitted testcase is billable, and a blind retry double-bills.
 */
export async function submitBatch(
  submissions: SubmissionRequest[],
): Promise<string[]> {
  const tokens: string[] = [];

  for (let i = 0; i < submissions.length; i += MAX_BATCH_SIZE) {
    const chunk = submissions.slice(i, i + MAX_BATCH_SIZE);
    const res = await fetch(`${JUDGE0_URL}/submissions/batch?base64_encoded=false`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ submissions: chunk.map(toJudge0Payload) }),
    });
    if (!res.ok) {
      throw new Judge0Error(res.status, `Judge0 batch submit failed: ${res.status} ${await res.text()}`);
    }
    const data: { token: string }[] = await res.json();
    tokens.push(...data.map((d) => d.token));
  }

  return tokens;
}

// Fetch current results for an array of tokens (chunked like submit).
export async function pollBatch(tokens: string[]): Promise<SubmissionResult[]> {
  const results: SubmissionResult[] = [];

  for (let i = 0; i < tokens.length; i += MAX_BATCH_SIZE) {
    const chunk = tokens.slice(i, i + MAX_BATCH_SIZE);
    const res = await fetch(
      `${JUDGE0_URL}/submissions/batch?tokens=${chunk.join(",")}&base64_encoded=false&fields=token,status,stdout,stderr,compile_output,time,memory,message`,
      { headers: headers() },
    );
    if (!res.ok) {
      throw new Judge0Error(res.status, `Judge0 poll failed: ${res.status} ${await res.text()}`);
    }
    const data: { submissions: SubmissionResult[] } = await res.json();
    results.push(...data.submissions);
  }

  return results;
}
