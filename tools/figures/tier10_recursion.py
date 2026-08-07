"""Recursion illustrations: the unwinding of factorial, and the call stack.

Both images are deliberately almost wordless - the two colours (blue = going
down into the calls, green = coming back up with values) and the silhouette of
the stack are meant to do the explaining. Only digits, `f(n)` and `x n` appear
inside the figures, so one file serves both locales.
"""
import os
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))


# ------------------------------------------------- 1. down into it, back up
def recursion_unwinding():
    h = 430
    fig, ax = canvas(h)
    title(ax, "Factorial  -  the calls go down, the values come back up")

    rows = ["6!", "5!", "4!", "3!", "2!", "1!"]
    vals = ["720", "120", "24", "6", "2", "1"]
    mults = ["6", "5", "4", "3", "2"]          # arrow i <- i+1 carries x mults[i]

    y0, pitch, ch = 84, 58, 40
    lx, lw_ = 186, 108                         # left column (the calls)
    rx, rw_ = 466, 124                         # right column (the values)
    lcx, rcx = lx + lw_ / 2, rx + rw_ / 2

    def ry(i):
        return y0 + i * pitch

    # column headers
    label(ax, lcx, 62, "calls", size=9.5, color=BLUE, ha="center", weight="bold")
    label(ax, rcx, 62, "returns", size=9.5, color=GREEN, ha="center",
          weight="bold")

    last = len(rows) - 1
    for i, (r, v) in enumerate(zip(rows, vals)):
        base = i == last
        # the call
        cell(ax, lx, ry(i), lw_, ch, r,
             face=GREEN if base else BLUE, tcolor=WHITE, size=14)
        # the value it hands back
        cell(ax, rx, ry(i), rw_, ch, v,
             face=GREEN if base else WHITE,
             edge=None if base else GREEN,
             tcolor=WHITE if base else INK2, size=14)

        if i < last:
            # descending: one call spawns the next
            arrow(ax, lcx, ry(i) + ch + 3, lcx, ry(i + 1) - 3,
                  color=BLUE, lw=2.0, ms=11)
            # ascending: the value below is multiplied on the way up
            arrow(ax, rcx, ry(i + 1) - 3, rcx, ry(i) + ch + 3,
                  color=GREEN, lw=2.0, ms=11)
            mono(ax, rcx + 14, ry(i) + ch + pitch / 2 - ch / 2 + 1,
                 "x " + mults[i], size=11, color=GREEN, ha="left",
                 weight="bold")

    # the turn at the bottom: the base case is where descent becomes ascent
    arrow(ax, lx + lw_ + 4, ry(last) + ch / 2, rx - 4, ry(last) + ch / 2,
          color=GREEN, lw=2.0, ms=11)

    save(fig, os.path.join(OUT, "recursion-unwinding.png"))


# ------------------------------------------------------- 2. the call stack
def recursion_call_stack():
    h = 302
    fig, ax = canvas(h)
    title(ax, "Call stack  -  f(3) piles up, the base case unwinds it")

    base = 262
    cw, chh = 68, 34
    pitch = 88
    x0 = 50

    # bottom -> top of the stack at each moment in time
    snaps = [[3], [3, 2], [3, 2, 1], [3, 2, 1, 0], [3, 2, 1], [3, 2], [3], []]
    x0 = (W - ((len(snaps) - 1) * pitch + cw)) / 2

    for s, items in enumerate(snaps):
        x = x0 + s * pitch
        ax.plot([x - 5, x + cw + 5], [base + 4, base + 4], color="#C9CFD6",
                lw=2.4, solid_capstyle="round", zorder=1)
        for d, v in enumerate(items):
            y = base - (d + 1) * chh
            is_top = d == len(items) - 1
            is_base_case = v == 0
            if is_base_case:
                face, edge, tcol = GREEN, None, WHITE
            elif is_top:
                face, edge, tcol = BLUE, None, WHITE
            else:
                face, edge, tcol = LAV, PURPLE, INK2
            cell(ax, x, y, cw, chh, f"f({v})", face=face, edge=edge,
                 tcolor=tcol, size=11)

    # one span per half, instead of a caption under every column
    mid = x0 + 3 * pitch + cw / 2
    arrow(ax, x0 + 6, 92, mid - 14, 92, color=BLUE, lw=2.0, ms=11)
    arrow(ax, mid + 14, 92, x0 + 6 * pitch + cw - 6, 92, color=CORAL, lw=2.0,
          ms=11)
    mono(ax, (x0 + mid) / 2, 74, "push", size=10, color=BLUE, ha="center",
         weight="bold")
    mono(ax, (mid + x0 + 6 * pitch + cw) / 2, 74, "pop", size=10, color=CORAL,
         ha="center", weight="bold")

    save(fig, os.path.join(OUT, "recursion-call-stack.png"))


if __name__ == "__main__":
    recursion_unwinding()
    recursion_call_stack()
    print("done")
