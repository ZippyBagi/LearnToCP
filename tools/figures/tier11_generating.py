"""Generating Combinatoric Objects illustrations.

Two figures for `09 Recursion / 02 Generating Combinatoric Objects`:

1. `generating-one-skeleton` - the same nine branches, pruned by three
   different rules. The lesson's whole claim is that only the condition
   inside the loop changes, so the image keeps the branches fixed and only
   changes what is greyed out.
2. `backtracking-undo` - why `pop_back` is not optional. Snapshots of the
   one shared `chosen` vector at the first four prints, with and without
   the undo; the leaked element is coral.

Both are language-neutral: digits, braces and C++ identifiers only.
"""
import os
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))


# ------------------------------------------------- 1. one skeleton, 3 rules
def generating_one_skeleton():
    h = 400
    fig, ax = canvas(h)
    title(ax, "One skeleton  -  only the rule at a position changes")

    pairs = [(a, b) for a in (1, 2, 3) for b in (1, 2, 3)]

    cw, chh, gap = 66, 32, 14
    x0 = (W - (9 * cw + 8 * gap)) / 2

    panels = [
        ("every value",                  lambda a, b: True,   "9"),
        ("only values not used yet",     lambda a, b: a != b, "6"),
        ("only values above the previous", lambda a, b: a < b, "3"),
    ]

    for p, (rule, keep, count) in enumerate(panels):
        py = 72 + p * 96

        label(ax, x0, py, rule, size=10, color=INK2, ha="left", weight="bold")
        mono(ax, x0 + 9 * cw + 8 * gap, py, count + " kept", size=11,
             color=PURPLE, ha="right", weight="bold")

        for i, (a, b) in enumerate(pairs):
            x = x0 + i * (cw + gap)
            alive = keep(a, b)
            cell(ax, x, py + 18, cw, chh, f"{a}  {b}",
                 face=BLUE if alive else GREY,
                 tcolor=WHITE if alive else "#B0B6BE",
                 size=12, lw=1.6, r=6)

    label(ax, W / 2, h - 52,
          "The same nine branches every time - the rule only decides which ones we walk into.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 26,
          "Shown at length 2. A full permutation is the middle rule run all the way to position n.",
          size=9, color=MUTE, ha="center")

    save(fig, os.path.join(OUT, "generating-one-skeleton.png"))


# ------------------------------------------------------- 2. the undo
def backtracking_undo():
    h = 300
    fig, ax = canvas(h)
    title(ax, "Backtracking  -  chosen is one vector, shared by every call")

    # the first four subsets printed, with and without pop_back
    good = [[], [3], [2], [2, 3]]
    bad = [[], [3], [3, 2], [3, 2, 3]]
    # index of the element that leaked (never popped), or None
    leak = [None, None, 0, 0]

    cw, gap, chip_h = 26, 6, 30
    x_left = 170
    pitch = (W - 24 - x_left) / 4
    centers = [x_left + pitch * (i + 0.5) for i in range(4)]

    for s, cx in enumerate(centers):
        mono(ax, cx, 62, f"print {s + 1}", size=8.5, color=MUTE, ha="center")

    def draw_row(y, snaps, color, name, leaks=None):
        label(ax, 36, y, name, size=9.5, color=color, ha="left",
              weight="bold")
        for s, items in enumerate(snaps):
            cx = centers[s]
            span = len(items) * cw + max(0, len(items) - 1) * gap
            sx = cx - span / 2
            mono(ax, sx - 13, y, "{", size=15, color=MUTE, ha="center")
            mono(ax, sx + span + 13, y, "}", size=15, color=MUTE,
                 ha="center")
            for d, v in enumerate(items):
                bad_chip = leaks is not None and leaks[s] == d
                cell(ax, sx + d * (cw + gap), y - chip_h / 2, cw, chip_h, v,
                     face=CORAL if bad_chip else BLUE, tcolor=WHITE,
                     size=11, lw=1.6, r=5)

    draw_row(108, good, GREEN, "with pop_back")
    draw_row(184, bad, CORAL, "without pop_back", leaks=leak)

    label(ax, W / 2, h - 52,
          "The coral element was pushed by a call that returned without popping it.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 22,
          "Whatever a call writes before recursing, it removes after recursing.",
          size=9, color=MUTE, ha="center")

    save(fig, os.path.join(OUT, "backtracking-undo.png"))


if __name__ == "__main__":
    generating_one_skeleton()
    backtracking_undo()
    print("done")
