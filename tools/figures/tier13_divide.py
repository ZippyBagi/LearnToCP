"""Binary search by answer + divide and conquer illustrations."""
import os
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))

VALUES = list(range(1, 13))          # the search space 1..12
BOUNDARY = 8                         # first value where check() is YES


# --------------------------------------------- 1. the NO / YES boundary
def monotone_predicate():
    h = 286
    fig, ax = canvas(h)
    title(ax, "Binary search by answer  -  check() must flip over only once")

    n = len(VALUES)
    cw, gap = 52, 5
    x0 = (W - (n * cw + (n - 1) * gap)) / 2

    def strip(y, flags):
        for i, (v, ok) in enumerate(zip(VALUES, flags)):
            x = x0 + i * (cw + gap)
            ax.text(x + cw / 2, y - 13, str(v), ha="center", va="center",
                    fontsize=8, color=MUTE, zorder=6)
            rbox(ax, x, y, cw, 40, face=GREEN if ok else GREY, edge=None)
            mono(ax, x + cw / 2, y + 20, "true" if ok else "false", size=9,
                 color=WHITE if ok else MUTE, ha="center", weight="bold")

    def mark(y, glyph, color):
        ax.text(x0 - 28, y + 20, glyph, ha="center", va="center", fontsize=20,
                color=color, fontweight="bold", zorder=6)

    # monotone: one flip, and binary search can find it
    good = [v >= BOUNDARY for v in VALUES]
    strip(72, good)
    mark(72, "✓", GREEN)
    bx = x0 + (BOUNDARY - 1) * (cw + gap) + cw / 2
    caret(ax, bx, 118, GREEN, up=False, size=6)
    mono(ax, bx, 134, "ans", size=9.5, color=GREEN, ha="center",
         weight="bold")

    # not monotone: many flips, no single boundary
    bad = [0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0]
    strip(198, bad)
    mark(198, "✗", CORAL)
    for i in range(1, n):
        if bad[i] != bad[i - 1]:
            fx = x0 + i * (cw + gap) - gap / 2
            ax.plot([fx, fx], [194, 242], color=CORAL, lw=2, zorder=8)

    save(fig, os.path.join(OUT, "monotone-predicate.png"))


# --------------------------------------------- 2. the search itself
def binary_search_by_answer_steps():
    h = 436
    fig, ax = canvas(h)
    title(ax, "Binary search by answer  -  save the answer, then keep looking")

    n = len(VALUES)
    cw, gap, ch = 40, 3, 38
    x0 = 26
    tx = 570

    # (low, high, mid, check, note, answer_row)
    steps = [
        (1, 12, 6, False, "check(6) = false", "low = 7",            False),
        (7, 12, 9, True,  "check(9) = true",  "ans = 9,  high = 8", False),
        (7,  8, 7, False, "check(7) = false", "low = 8",            False),
        (8,  8, 8, True,  "check(8) = true",  "ans = 8",            True),
    ]

    for r, (lo, hi, mid, ok, l1, l2, final) in enumerate(steps):
        y = 104 + r * 70
        for i, v in enumerate(VALUES):
            x = x0 + i * (cw + gap)
            if v == mid and final:
                face, edge, tc = GREEN, None, WHITE
            elif v == mid:
                face, edge, tc = AMBER, None, INK2
            elif lo <= v <= hi:
                face, edge, tc = WHITE, PURPLE, INK2
            else:
                face, edge, tc = GREY, None, MUTE
            cell(ax, x, y, cw, ch, v, face=face, edge=edge, tcolor=tc,
                 size=10)

        def cx(v):
            return x0 + (v - 1) * (cw + gap) + cw / 2

        if lo == hi:
            marks = [(cx(lo), "low = mid = high", INK2)]
        elif lo == mid:
            marks = [(cx(lo), "low = mid", INK2), (cx(hi), "high", CORAL)]
        else:
            marks = [(cx(lo), "low", BLUE), (cx(mid), "mid", AMBER),
                     (cx(hi), "high", CORAL)]
        pointer_labels(ax, marks, y)

        mono(ax, tx, y + 11, l1, size=9, color=GREEN if ok else CORAL,
             ha="left", weight="bold")
        mono(ax, tx, y + 30, l2, size=9,
             color=GREEN if final else INK2, ha="left",
             weight="bold" if final else "normal")

    legend(ax, 406, [(AMBER, None, "mid"), (WHITE, PURPLE, "still possible"),
                     (GREY, None, "discarded"), (GREEN, None, "answer")])

    save(fig, os.path.join(OUT, "binary-search-by-answer-steps.png"))


# --------------------------------------------- 3. merge sort tree
def merge_sort_tree():
    h = 450
    fig, ax = canvas(h)
    title(ax, "Merge sort  -  split down to single elements, then merge back up")

    slot = 76
    x0 = (W - 6 * slot) / 2
    ch = 36
    rows_y = [72 + i * 52 for i in range(7)]

    # (span_start, span_end, values)
    rows = [
        [(0, 5, [4, 2, 1, 3, 4, 10])],
        [(0, 2, [4, 2, 1]), (3, 5, [3, 4, 10])],
        [(0, 1, [4, 2]), (2, 2, [1]), (3, 4, [3, 4]), (5, 5, [10])],
        [(i, i, [v]) for i, v in enumerate([4, 2, 1, 3, 4, 10])],
        [(0, 1, [2, 4]), (2, 2, [1]), (3, 4, [3, 4]), (5, 5, [10])],
        [(0, 2, [1, 2, 4]), (3, 5, [3, 4, 10])],
        [(0, 5, [1, 2, 3, 4, 4, 10])],
    ]
    edges = [BLUE, BLUE, BLUE, AMBER, GREEN, GREEN, GREEN]
    faces = [WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, LAV]

    for y, nodes, edge, face in zip(rows_y, rows, edges, faces):
        for l, r, vals in nodes:
            x = x0 + l * slot + 5
            w = (r - l + 1) * slot - 10
            rbox(ax, x, y, w, ch, face=face, edge=edge, lw=1.8, r=6)
            # Values sit on a fixed column grid, not spread across the box they
            # happen to share. Dividing the box padding among however many
            # values a box holds would drift each column by a few pixels per
            # row, and the whole point of this figure is following one value
            # down the split and back up the merge.
            for k, v in enumerate(vals):
                ax.text(x0 + (l + k + 0.5) * slot, y + ch / 2, str(v),
                        ha="center", va="center", fontsize=11,
                        fontweight="bold", color=INK2, zorder=6)

    arrow(ax, 96, rows_y[0], 96, rows_y[3] + ch, color=BLUE, lw=2.2, ms=14)
    label(ax, 108, (rows_y[0] + rows_y[3]) / 2 + 18, "split", size=10,
          color=BLUE, ha="left", weight="bold")

    arrow(ax, 96, rows_y[6] + ch, 96, rows_y[4], color=GREEN, lw=2.2, ms=14)
    label(ax, 108, (rows_y[4] + rows_y[6]) / 2 + 18, "merge", size=10,
          color=GREEN, ha="left", weight="bold")

    save(fig, os.path.join(OUT, "merge-sort-tree.png"))


# --------------------------------------------- 4. why it is n log n
def divide_conquer_cost():
    h = 392
    fig, ax = canvas(h)
    title(ax, "Divide and conquer  -  log(n) levels, n work on every level")

    left, right = 168, 636
    span = right - left
    gap, ch = 6, 34
    rows_y = [88 + i * 56 for i in range(4)]

    for lvl, y in enumerate(rows_y):
        parts = 2 ** lvl
        for k in range(parts):
            x = left + span * k / parts
            w = span / parts - (gap if parts > 1 else 0)
            rbox(ax, x, y, w, ch, face=BLUE, edge=None, r=6)
        mono(ax, right + 30, y + ch / 2, "n", size=11, color=PURPLE,
             ha="left", weight="bold")

    arrow(ax, 118, rows_y[0], 118, rows_y[-1] + ch, color=PURPLE, lw=1.8,
          ms=12, style="<|-|>")
    label(ax, 106, (rows_y[0] + rows_y[-1]) / 2 + ch / 2, "log(n)", size=10,
          color=PURPLE, ha="right", weight="bold")

    rbox(ax, W / 2 - 110, 320, 220, 48, face=LAV, edge=PURPLE, lw=1.8, r=10)
    mono(ax, W / 2, 344, "n  x  log(n)", size=13, color=PURPLE, ha="center",
         weight="bold")

    save(fig, os.path.join(OUT, "divide-conquer-cost.png"))


if __name__ == "__main__":
    monotone_predicate()
    binary_search_by_answer_steps()
    merge_sort_tree()
    divide_conquer_cost()
    print("ok")
