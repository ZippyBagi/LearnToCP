export const LANGUAGE_IDS = {
  cpp:   54,  // C++ GCC 9.2.0
  cpp17: 76,  // C++ 17 GCC 7.4.0
  cpp20: 91,  // C++ 20 GCC 12.2.0
} as const;

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

export async function submitOne(req: SubmissionRequest): Promise<string> {
  const res = await fetch(
    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        language_id: req.languageId ?? LANGUAGE_IDS.cpp,
        source_code: req.sourceCode,
        stdin: req.stdin ?? "",
        expected_output: req.expectedOutput ?? null,
        cpu_time_limit: req.cpuTimeLimit ?? 2.0,
        memory_limit: req.memoryLimit ?? 262144,
      }),
    }
  );
  if (!res.ok) throw new Error(`Judge0 submit failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.token as string;
}

export async function submitBatch(submissions: SubmissionRequest[]): Promise<string[]> {
  const res = await fetch(
    `${JUDGE0_URL}/submissions/batch?base64_encoded=false`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        submissions: submissions.map((req) => ({
          language_id: req.languageId ?? LANGUAGE_IDS.cpp,
          source_code: req.sourceCode,
          stdin: req.stdin ?? "",
          expected_output: req.expectedOutput ?? null,
          cpu_time_limit: req.cpuTimeLimit ?? 2.0,
          memory_limit: req.memoryLimit ?? 262144,
        })),
      }),
    }
  );
  if (!res.ok) throw new Error(`Judge0 batch failed: ${res.status} ${await res.text()}`);
  const data: { token: string }[] = await res.json();
  return data.map((d) => d.token);
}

export async function pollBatch(tokens: string[]): Promise<SubmissionResult[]> {
  const res = await fetch(
    `${JUDGE0_URL}/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=false&fields=token,status,stdout,stderr,compile_output,time,memory,message`,
    { headers: headers() }
  );
  if (!res.ok) throw new Error(`Judge0 poll failed: ${res.status} ${await res.text()}`);
  const data: { submissions: SubmissionResult[] } = await res.json();
  return data.submissions;
}

export async function waitForBatch(
  tokens: string[],
  { intervalMs = 1000, timeoutMs = 30_000 } = {}
): Promise<SubmissionResult[]> {
  const start = Date.now();
  while (true) {
    if (Date.now() - start > timeoutMs) throw new Error("Judge0 polling timed out");
    const results = await pollBatch(tokens);
    if (results.every((r) => r.status.id >= 3)) return results;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

export function isAccepted(statusId: number) {
  return statusId === 3;
}