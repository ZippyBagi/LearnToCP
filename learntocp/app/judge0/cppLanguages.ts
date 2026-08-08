/**
 * Shared C++ compiler list (Judge0 CE language ids), newest first.
 *
 * Lives in its own module - both for Server and Client
 */
export interface CppLanguage {
  id: number;
  label: string;
  std: string;
}

export const CPP_LANGUAGES: readonly CppLanguage[] = [
  { id: 105, label: "C++ (GCC 14.1.0)",  std: "c++20" },
  { id: 54,  label: "C++ (GCC 9.2.0)",   std: "c++2a" },
  { id: 53,  label: "C++ (GCC 8.3.0)",   std: "c++17" },
  { id: 52,  label: "C++ (GCC 7.4.0)",   std: "c++17" },
  { id: 76,  label: "C++ (Clang 7.0.1)", std: "c++17" },
] as const;

export const DEFAULT_LANGUAGE_ID = 105; // C++ (GCC 14.1.0)

export function isSupportedLanguageId(id: number): boolean {
  return CPP_LANGUAGES.some((l) => l.id === id);
}

/**
 * Compiler flags for a given language id: -O2 (standard for competitive judging - without it TLE limits are misleading) plus the highest C++ standard that compiler supports.
 */
export function compilerOptionsFor(languageId: number): string {
  const std = CPP_LANGUAGES.find((l) => l.id === languageId)?.std ?? "c++20";
  return `-O2 -std=${std}`;
}
