"""Digit DP illustrations for `10 Dynamic Programming / 04 Digit DP`.

1040 px, matching tree-dp-robber and the bitmask dp figures in the same
chapter.

All three reuse the lesson's own numbers: the bound N = 250, the counts
solve(250) = 208, solve(99) = 81 and their difference 127, and the padded
number 007. Verified against a brute force over the actual ranges.

Language-neutral: digits, and the code's own identifiers (`tight`, `started`,
`solve`, `d`, `prev`). The Serbian lesson does not exist yet; when it is
written these images work as they are, no -en / -sr pair needed.
"""
import os
import style
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))

WIDE = 1040
style.W = WIDE
W = WIDE

N = "250"


def digit_cell(ax, x, y, w, h, value, face=WHITE, edge=PURPLE, size=17,
               tcolor=None):
    cell(ax, x, y, w, h, value, face=face, edge=edge, size=size,
         tcolor=tcolor or (INK2 if face in (WHITE, GREY, LAV) else WHITE))


# ------------------------------------------ 1. tight branches, free branches
def prefix_tree():
    fig, ax = canvas(348)

    # N itself, top left, so the caps have a visible source
    # N[1] is tinted because it is the cap the tight branch inherits
    mono(ax, 44, 47, "N", size=12, color=INK2, ha="right", weight="bold")
    tint = {0: LAV, 1: AMBER, 2: WHITE}
    for i, ch in enumerate(N):
        digit_cell(ax, 58 + i * 46, 26, 42, 42, ch,
                   face=tint[i], edge=AMBER if i == 1 else PURPLE, size=15)

    root = (560, 46)
    rbox(ax, root[0] - 26, root[1] - 20, 52, 40, face=WHITE, edge=PURPLE,
         lw=2.0, r=8)
    mono(ax, root[0], root[1], "", size=12, color=MUTE, ha="center")

    kids = [("0", 250, False), ("1", 560, False), ("2", 870, True)]

    for text, cx, tight in kids:
        col = AMBER if tight else GREEN
        arrow(ax, root[0], root[1] + 20, cx, 122, color=col, lw=2.2, ms=12)
        digit_cell(ax, cx - 26, 124, 52, 44, text, face=col, edge=col)
        mono(ax, cx, 186, f"tight = {1 if tight else 0}", size=10, color=col,
             ha="center", weight="bold")

        # the fan of what the next position may still hold
        span = 260 if not tight else 160
        opts = 10 if not tight else 6
        bx, by = cx - span / 2, 248
        for k in range(opts):
            tx = bx + span * (k + 0.5) / opts
            ax.plot([cx, tx], [200, by], color=GRIDL, lw=1.4, zorder=1)
        rbox(ax, bx, by, span, 30, face=col, edge=None, r=8)
        mono(ax, cx, by + 15, "0 - 9" if not tight else "0 - 5", size=12,
             color=WHITE, ha="center", weight="bold")
        mono(ax, cx, 302, f"{opts}", size=12, color=col, ha="center",
             weight="bold")

    save(fig, os.path.join(OUT, "digit-dp-tight.png"))


# ------------------------------------------ 2. the range trick
def ranges():
    fig, ax = canvas(324)

    x0, x1, hi = 260, 980, 250

    def px(v):
        return x0 + v * (x1 - x0) / hi

    rows = [(60, 0, 250, GREEN, 208, "solve(250)"),
            (118, 0, 99, AMBER, 81, "solve(99)"),
            (176, 100, 250, PURPLE, 127, None)]

    for y, lo, up, col, value, name in rows:
        rbox(ax, px(lo), y, px(up) - px(lo), 38, face=col, edge=None, r=8)
        mono(ax, (px(lo) + px(up)) / 2, y + 19, str(value), size=14,
             color=WHITE, ha="center", weight="bold")
        if name:
            mono(ax, x0 - 22, y + 19, name, size=11, color=col, ha="right",
                 weight="bold")

    ax.plot([x0, x1], [226, 226], color=AXIS, lw=1.6, zorder=1)
    for v in (0, 99, 250):     # 100 sits 3 px from 99, so its label collides
        ax.plot([px(v), px(v)], [222, 230], color=AXIS, lw=1.6, zorder=1)
        mono(ax, px(v), 244, str(v), size=9, color=MUTE, ha="center")

    rbox(ax, W / 2 - 150, 266, 300, 46, face=LAV, edge=PURPLE, lw=1.8, r=10)
    mono(ax, W / 2, 289, "208  -  81  =  127", size=13, color=PURPLE,
         ha="center", weight="bold")

    save(fig, os.path.join(OUT, "digit-dp-ranges.png"))


# ------------------------------------------ 3. the padding is not the number
def leading_zeros():
    fig, ax = canvas(244)

    cw, ch, gap = 100, 54, 10

    # ---- left: the flag that tells padding apart from a real digit
    lx = [170 + i * (cw + gap) for i in range(3)]
    for i, x in enumerate(lx):
        mono(ax, x + cw / 2, 40, str(i), size=9, color=MUTE, ha="center")

    mono(ax, 150, 79, "digit", size=11, color=INK2, ha="right", weight="bold")
    mono(ax, 150, 151, "started", size=11, color=INK2, ha="right",
         weight="bold")

    for i, (d, s) in enumerate(zip("007", "001")):
        pad = s == "0"
        digit_cell(ax, lx[i], 52, cw, ch, d, face=GREY if pad else WHITE,
                   edge=GREY if pad else PURPLE, tcolor=MUTE if pad else INK2)
        if pad:
            ax.plot([lx[i] + 22, lx[i] + cw - 22], [52 + ch / 2, 52 + ch / 2],
                    color=CORAL, lw=2.4, zorder=8)
        digit_cell(ax, lx[i], 124, cw, ch, s, face=CORAL if pad else GREEN,
                   edge=CORAL if pad else GREEN, size=15)

    ax.plot([lx[0], lx[0], lx[1] + cw, lx[1] + cw], [196, 204, 204, 196],
            color=CORAL, lw=1.6, zorder=5)

    # ---- right: what goes wrong without it, on the number 1
    rx = [640 + i * (cw + gap) for i in range(3)]
    for i, x in enumerate(rx):
        mono(ax, x + cw / 2, 40, str(i), size=9, color=MUTE, ha="center")
    mono(ax, 620, 79, "digit", size=11, color=INK2, ha="right", weight="bold")

    for i, d in enumerate("001"):
        bad = i < 2
        digit_cell(ax, rx[i], 52, cw, ch, d,
                   face=CORAL if bad else WHITE,
                   edge=CORAL if bad else PURPLE)

    arrow(ax, rx[0] + cw / 2, 116, rx[1] + cw / 2, 116, color=CORAL, lw=2.4,
          ms=13, rad=0.5)
    mono(ax, (rx[0] + rx[1]) / 2 + cw / 2, 168, "d == prev", size=11,
         color=CORAL, ha="center", weight="bold")
    ax.text(rx[2] + cw + 44, 79, "✗", ha="center", va="center", fontsize=24,
            color=CORAL, fontweight="bold", zorder=6)

    save(fig, os.path.join(OUT, "digit-dp-leading-zeros.png"))


if __name__ == "__main__":
    prefix_tree()
    ranges()
    leading_zeros()
    print("ok")
