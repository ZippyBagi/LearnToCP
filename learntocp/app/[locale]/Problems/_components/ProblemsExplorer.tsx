"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  MagnifyingGlassMinusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { DIFFICULTIES, type Difficulty } from "@/app/judge0/difficulties";
import { getProblemMessages, getProblemListMessages } from "@/translations";

/** One row of the Problems list — fully resolved & localized on the server. */
export interface ProblemListItem {
  slug: string;
  /** Display number ("01"); falls back to list position when absent. */
  number: number | null;
  title: string;
  topic: string | null;
  difficulty: Difficulty | null;
  tags: string[];
  solved: boolean;
  /** Community acceptance in [0,1], or null when nothing has been judged. */
  acceptance: number | null;
}

interface ProblemsExplorerProps {
  locale: string;
  problems: ProblemListItem[];
  /** Signed-out visitors see the list without personal progress UI. */
  isAuthed: boolean;
}

const PAGE_SIZE = 5;
const MAX_VISIBLE_TAGS = 2;

const DIFFICULTY_CLASS: Record<Difficulty, string> = {
  "Super Easy": "difficulty-super-easy",
  Easy: "difficulty-easy",
  Medium: "difficulty-medium",
  Hard: "difficulty-hard",
  "Olympiad Level": "difficulty-olympiad",
};

// One shared grid template for the header row AND every problem row, so the
// Tags / Level / AC columns line up exactly. Tags column is dropped on small
// screens (5 tracks); restored from `sm` up (6 tracks). Cells render in the
// same order and the hidden Tags cell is removed from grid flow on mobile.
const GRID =
  "grid items-center gap-7 px-5 " +
  "grid-cols-[24px_36px_minmax(0,1fr)_110px_56px] " +
  "sm:grid-cols-[24px_36px_minmax(0,1fr)_180px_110px_56px]";

type StatusFilter = "all" | "solved" | "unsolved";

export default function ProblemsExplorer({
  locale,
  problems,
  isAuthed,
}: ProblemsExplorerProps) {
  const t = getProblemListMessages(locale);
  const difficultyLabels = getProblemMessages(locale).difficulty;

  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"all" | Difficulty>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [topic, setTopic] = useState<string>("all");
  const [page, setPage] = useState(0);

  // Full canonical difficulty ladder (not just what's present), per the
  // single source of truth in judge0/difficulties.
  const difficultyOptions = useMemo(
    () => [
      { value: "all" as const, label: t.allDifficulties },
      ...DIFFICULTIES.map((d) => ({ value: d, label: difficultyLabels[d] })),
    ],
    [t.allDifficulties, difficultyLabels],
  );

  const topicOptions = useMemo(() => {
    const set = Array.from(
      new Set(problems.map((p) => p.topic).filter(Boolean) as string[]),
    ).sort((a, b) => a.localeCompare(b, locale));
    return [
      { value: "all", label: t.allTopics },
      ...set.map((tp) => ({ value: tp, label: tp })),
    ];
  }, [problems, t.allTopics, locale]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return problems.filter((p) => {
      if (q) {
        const haystack =
          p.title.toLowerCase() +
          " " +
          (p.topic?.toLowerCase() ?? "") +
          " " +
          p.tags.join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (difficulty !== "all" && p.difficulty !== difficulty) return false;
      if (status === "solved" && !p.solved) return false;
      if (status === "unsolved" && p.solved) return false;
      if (topic !== "all" && p.topic !== topic) return false;
      return true;
    });
  }, [problems, query, difficulty, status, topic]);

  // Filters changing should always bring you back to the first page.
  useEffect(() => {
    setPage(0);
  }, [query, difficulty, status, topic]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const solvedCount = problems.filter((p) => p.solved).length;
  const anyFilter =
    query !== "" || difficulty !== "all" || status !== "all" || topic !== "all";

  const clearFilters = () => {
    setQuery("");
    setDifficulty("all");
    setStatus("all");
    setTopic("all");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <header className="pop-in mb-7">
        <h1 className="text-[2rem] font-bold tracking-tight text-text-heading">
          {t.title}
        </h1>
        <p className="mt-2 text-[15px] text-text-muted">
          {t.subtitle(problems.length, solvedCount)}
          {" · "}
          {isAuthed ? (
            <span className="font-mono text-success">
              {solvedCount} {t.solvedSuffix}
            </span>
          ) : (
            <Link
              href={`/${locale}/login?next=${encodeURIComponent(`/${locale}/Problems`)}`}
              className="font-semibold text-accent hover:underline"
            >
              {t.signInToTrack}
            </Link>
          )}
        </p>
      </header>

      {/* Search — the whole box is a label so clicking anywhere focuses it */}
      <label
        className="pop-in mb-4 flex cursor-text items-center gap-2.5 rounded-xl border border-border-subtle bg-bg-page px-4 py-3 transition-colors focus-within:border-accent-border-hover"
        style={{ animationDelay: "60ms" }}
      >
        <MagnifyingGlassIcon className="size-5 shrink-0 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
          className="w-full bg-transparent text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </label>

      {/* Filters — difficulty, then status, topic, clear */}
      <div
        className="pop-in mb-5 flex flex-wrap items-center gap-3"
        style={{ animationDelay: "120ms" }}
      >
        <SlidingSegmented
          value={difficulty}
          onChange={(v) => setDifficulty(v as "all" | Difficulty)}
          options={difficultyOptions}
        />

        {isAuthed && (
          <SlidingSegmented
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: t.statusAny },
              { value: "solved", label: t.statusSolved },
              { value: "unsolved", label: t.statusUnsolved },
            ]}
          />
        )}
        {topicOptions.length > 1 && (
          <FilterSelect value={topic} onChange={setTopic} options={topicOptions} />
        )}
        {anyFilter && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-2 text-sm font-semibold text-text-muted transition-colors hover:text-accent"
          >
            <XMarkIcon className="size-4" />
            {t.clear}
          </button>
        )}
      </div>

      {/* List */}
      {problems.length === 0 ? (
        <EmptyState title={t.noProblems} />
      ) : filtered.length === 0 ? (
        <div className="pop-in" style={{ animationDelay: "180ms" }}>
          <EmptyState title={t.emptyTitle} body={t.emptyBody} />
        </div>
      ) : (
        <div
          className="pop-in overflow-hidden rounded-xl border border-border-subtle bg-bg-surface"
          style={{ animationDelay: "180ms" }}
        >
          {/* Column header */}
          <div
            className={`${GRID} border-b border-border-subtle py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-text-muted`}
          >
            <span />
            <span className="justify-self-center">#</span>
            <span>{t.colProblem}</span>
            <span className="hidden justify-self-center text-center sm:block">
              {t.colTags}
            </span>
            <span className="justify-self-center text-center">
              {t.colLevel}
            </span>
            <span className="justify-self-center text-center">{t.colAc}</span>
          </div>

          {rows.map((p, i) => (
            <ProblemRow
              key={p.slug}
              locale={locale}
              p={p}
              index={start + i}
              last={i === rows.length - 1}
              difficultyLabels={difficultyLabels}
              acceptanceTooltip={t.acceptanceTooltip}
              noAttemptsTooltip={t.noAttemptsTooltip}
              solvedTooltip={t.solvedTooltip}
              unsolvedTooltip={t.unsolvedTooltip}
              showStatus={isAuthed}
            />
          ))}
        </div>
      )}

      {/* Pagination — always shown (even for a single page) once there are rows */}
      {filtered.length > 0 && (
        <div className="mt-5 flex items-center justify-between">
          <span className="font-mono text-[13px] text-text-muted tabular-nums">
            {t.range(
              start + 1,
              Math.min(start + PAGE_SIZE, filtered.length),
              filtered.length,
            )}
          </span>
          <div className="flex items-center gap-2.5">
            <PageButton
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeftIcon className="size-4" />
              {t.prev}
            </PageButton>
            <span className="min-w-[80px] text-center font-mono text-[13px] text-text-muted tabular-nums">
              {t.pageOf(safePage + 1, pageCount)}
            </span>
            <PageButton
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              {t.next}
              <ChevronRightIcon className="size-4" />
            </PageButton>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Row
   ──────────────────────────────────────────────────────────────────────── */
function ProblemRow({
  locale,
  p,
  index,
  last,
  difficultyLabels,
  acceptanceTooltip,
  noAttemptsTooltip,
  solvedTooltip,
  unsolvedTooltip,
  showStatus,
}: {
  locale: string;
  p: ProblemListItem;
  index: number;
  last: boolean;
  difficultyLabels: Record<Difficulty, string>;
  acceptanceTooltip: string;
  noAttemptsTooltip: string;
  solvedTooltip: string;
  unsolvedTooltip: string;
  /** Hide the personal solved/unsolved marker for signed-out visitors. */
  showStatus: boolean;
}) {
  const shownTags = p.tags.slice(0, MAX_VISIBLE_TAGS);
  const extra = p.tags.length - shownTags.length;
  const displayNumber = p.number ?? index + 1;

  return (
    <Link
      href={`/${locale}/Problems/${encodeURIComponent(p.slug)}`}
      className={`${GRID} group cursor-pointer py-[18px] transition-colors hover:bg-bg-surface-hover ${
        last ? "" : "border-b border-border-subtle"
      }`}
    >
      {/* Status — empty cell (keeps grid alignment) when signed out */}
      <span className="justify-self-start">
        {!showStatus ? null : p.solved ? (
          <span
            title={solvedTooltip}
            className="flex size-6 items-center justify-center rounded-full border border-[rgba(80,250,123,0.4)] bg-[rgba(80,250,123,0.15)] text-success"
          >
            <CheckIcon className="size-3.5 [stroke-width:3]" />
          </span>
        ) : (
          <span
            title={unsolvedTooltip}
            className="block size-6 rounded-full border border-accent-border"
          />
        )}
      </span>

      {/* Index */}
      <span className="justify-self-center font-mono text-sm font-semibold text-text-muted tabular-nums">
        {String(displayNumber).padStart(2, "0")}
      </span>

      {/* Title + topic */}
      <div className="min-w-0">
        <div
          className={`truncate text-base font-semibold transition-colors group-hover:text-accent ${
            p.solved ? "text-success" : "text-text-heading"
          }`}
        >
          {p.title}
        </div>
        {p.topic && (
          <div className="mt-0.5 truncate text-[13px] text-text-muted">
            {p.topic}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="hidden items-center justify-center justify-self-center gap-1.5 sm:flex">
        {shownTags.map((tag) => (
          <span key={tag} className="tag font-mono">
            #{tag}
          </span>
        ))}
        {extra > 0 && (
          <span className="font-mono text-xs text-text-muted">+{extra}</span>
        )}
      </div>

      {/* Difficulty */}
      <div className="justify-self-center">
        {p.difficulty && (
          <span className={`difficulty-badge ${DIFFICULTY_CLASS[p.difficulty]}`}>
            {difficultyLabels[p.difficulty]}
          </span>
        )}
      </div>

      {/* Acceptance */}
      <span
        title={p.acceptance === null ? noAttemptsTooltip : acceptanceTooltip}
        className="justify-self-center text-center font-mono text-sm text-text-muted tabular-nums"
      >
        {p.acceptance === null ? "—" : `${Math.round(p.acceptance * 100)}%`}
      </span>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Sliding segmented control (mirrors the problem-page tab indicator)
   ──────────────────────────────────────────────────────────────────────── */
function SlidingSegmented<T extends string>({
  value,
  onChange,
  options,
  className = "",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}) {
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const n = options.length;

  return (
    <div
      className={`relative inline-grid items-center rounded-[10px] border border-border-subtle bg-bg-page p-[3px] ${className}`}
      style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      role="tablist"
    >
      <span
        aria-hidden
        className="absolute bottom-[3px] left-[3px] top-[3px] rounded-[8px] border border-accent-border bg-bg-surface shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
        style={{
          width: `calc((100% - 6px) / ${n})`,
          transform: `translateX(${activeIndex * 100}%)`,
          transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`relative z-[1] cursor-pointer truncate rounded-[7px] px-1.5 py-2.5 text-center text-[12.5px] font-semibold leading-none transition-colors ${
              active ? "text-accent" : "text-text-muted hover:text-text-heading"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Dropdown select (Headless UI Listbox, themed to the app)
   ──────────────────────────────────────────────────────────────────────── */
function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative inline-block">
        {/* Matches the navbar language selector's styling */}
        <ListboxButton className="inline-flex w-full cursor-pointer items-center justify-between gap-x-1.5 rounded-md border border-border-subtle bg-bg-page px-3 py-2 text-sm font-semibold text-text-primary transition-colors duration-150 hover:border-accent-border-hover hover:bg-bg-surface focus:outline-none">
          <span className="truncate">{selected?.label}</span>
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 shrink-0 text-text-muted"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          anchor="bottom start"
          className="w-[var(--button-width)] min-w-40 origin-top overflow-hidden rounded-md border border-border-subtle bg-bg-page shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 [--anchor-gap:8px]"
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <ListboxOption
                key={o.value}
                value={o.value}
                className={`relative block w-full cursor-pointer border-l-2 px-4 py-2.5 text-left text-sm text-text-primary transition-colors duration-100 focus:outline-none ${
                  active
                    ? "border-accent bg-bg-surface text-text-accent"
                    : "border-transparent data-[focus]:border-accent-border-hover data-[focus]:bg-bg-surface-hover data-[focus]:text-text-heading"
                }`}
              >
                {o.label}
              </ListboxOption>
            );
          })}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Pagination button + empty state
   ──────────────────────────────────────────────────────────────────────── */
function PageButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border-subtle bg-bg-surface px-3.5 py-2 text-sm font-semibold text-text-heading transition-colors hover:border-accent-border-hover hover:bg-bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-subtle disabled:hover:bg-bg-surface"
    >
      {children}
    </button>
  );
}

function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border-subtle bg-[rgba(255,255,255,0.015)] px-6 py-14">
      <div className="mx-auto max-w-sm text-center">
        <div className="mb-4 inline-flex size-[52px] items-center justify-center rounded-[14px] border border-accent-border bg-[rgba(124,158,248,0.08)] text-accent">
          <MagnifyingGlassMinusIcon className="size-6" />
        </div>
        <div className="text-[17px] font-semibold text-text-heading">
          {title}
        </div>
        {body && (
          <p className="mt-2 text-sm leading-relaxed text-text-muted">{body}</p>
        )}
      </div>
    </div>
  );
}
