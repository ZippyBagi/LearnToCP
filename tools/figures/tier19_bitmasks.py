"""Bitmasks illustrations for `04 Binary Numbers / 03 Bitmasks`.

784 px, matching the rest of chapter 04 (binary-place-value, bitwise-ops).

All three reuse the lesson's own numbers: the group {Ana, Mila} = 9 = 1001,
the pair a = 1100 and b = 1010, and the submask walk of mask 1101.

Language-neutral: digits, circles, proper names that both locales share, and
the C++ operators themselves.
"""
import os
from style import *
from matplotlib.patches import Circle

OUT = os.path.dirname(os.path.abspath(__file__))

NAMES = ["Ana", "Marko", "Jovan", "Mila"]     # element 0 .. element 3
MASK = 9                                      # 1001 - Ana and Mila are in


def bits(value, n=4):
    """Most significant first, the way a binary number is written."""
    return [(value >> i) & 1 for i in range(n - 1, -1, -1)]


# ------------------------------------------------ 1. a row of light switches
def switches():
    fig, ax = canvas(312)

    n = 4
    pw, ph, gap = 70, 104, 60
    x0 = (W - (n * pw + (n - 1) * gap)) / 2
    on = bits(MASK)                       # bit 3 first, so left to right

    for k, up in enumerate(on):
        x = x0 + k * (pw + gap)
        idx = 3 - k                       # leftmost box is bit 3

        label(ax, x + pw / 2, 26, NAMES[idx], size=10, color=INK2,
              ha="center", weight="bold")

        rbox(ax, x, 44, pw, ph, face=WHITE, edge=PURPLE, lw=2.0, r=8)
        ty = 52 if up else 96
        rbox(ax, x + 15, ty, pw - 30, 48, face=GREEN if up else GREY,
             edge=None, r=6)

        mono(ax, x + pw / 2, 166, str(idx), size=9, color=MUTE, ha="center")
        cell(ax, x, 182, pw, 42, str(up), face=WHITE, edge=PURPLE,
             tcolor=INK2, size=15)

    rbox(ax, W / 2 - 120, 248, 240, 48, face=LAV, edge=PURPLE, lw=1.8, r=10)
    mono(ax, W / 2, 272, f"1001  =  {MASK}", size=14, color=PURPLE,
         ha="center", weight="bold")

    save(fig, os.path.join(OUT, "bitmask-switches.png"))


# ------------------------------------------------ 2. the operators are set operators
def set_ops():
    fig, ax = canvas(296)

    a, b = 12, 10                          # 1100 and 1010
    r = 15

    def row(cx, y, text, value, color=PURPLE):
        mono(ax, cx - 96, y, text, size=11, color=INK2, ha="right",
             weight="bold")
        for k, bit in enumerate(bits(value)):
            p = (cx - 66 + k * 44, y)
            ax.add_patch(Circle(p, r, facecolor=color if bit else WHITE,
                                edgecolor=color if bit else "#C9CFD6",
                                lw=2.0, zorder=4))
        mono(ax, cx + 128, y, f"= {value}", size=11, color=color,
             ha="left", weight="bold")

    row(W / 2, 42, "a", a)
    row(W / 2, 90, "b", b)

    ax.plot([90, W - 90], [126, 126], color=GRIDL, lw=1.6, zorder=0)

    results = [("a | b", a | b), ("a & b", a & b),
               ("a & ~b", a & ~b & 0b1111), ("a ^ b", a ^ b)]
    for i, (text, value) in enumerate(results):
        cx = 250 + (i % 2) * 340
        y = 172 + (i // 2) * 62
        row(cx, y, text, value, color=GREEN)

    save(fig, os.path.join(OUT, "bitmask-set-ops.png"))


# ------------------------------------------------ 3. walking the submasks
def submask_walk():
    fig, ax = canvas(404)

    mask = 13                              # 1101
    bw, bg = 34, 2
    cols = [196, 388, 580]                 # x of the three bit groups

    def group(x, y, value, faces=None, h=30):
        faces = faces or {}
        for k, bit in enumerate(bits(value)):
            cell(ax, x + k * (bw + bg), y, bw, h, str(bit),
                 face=faces.get(k, WHITE), edge=PURPLE, tcolor=INK2, size=11)

    # the bits the mask forbids - they can never survive the & mask
    dead = {k: GREY for k, bit in enumerate(bits(mask)) if bit == 0}

    mono(ax, cols[0] - 16, 39, "mask", size=11, color=INK2, ha="right",
         weight="bold")
    group(cols[0], 24, mask, faces={k: GREY if k in dead else LAV
                                    for k in range(4)})

    for x, text in zip(cols, ["sub", "sub - 1", "(sub-1) & mask"]):
        mono(ax, x + (4 * (bw + bg) - bg) / 2, 76, text, size=10, color=INK2,
             ha="center", weight="bold")

    sub = mask
    y = 96
    while sub > 0:
        nxt = (sub - 1) & mask
        mono(ax, cols[0] - 16, y + 15, str(sub), size=10, color=MUTE,
             ha="right", weight="bold")
        group(cols[0], y, sub)
        group(cols[1], y, sub - 1)
        group(cols[2], y, nxt, faces=dead)
        arrow(ax, cols[1] - 22, y + 15, cols[1] - 6, y + 15, color=MUTE,
              lw=1.4, ms=9)
        arrow(ax, cols[2] - 22, y + 15, cols[2] - 6, y + 15, color=MUTE,
              lw=1.4, ms=9)
        sub = nxt
        y += 40

    save(fig, os.path.join(OUT, "bitmask-submask-walk.png"))


if __name__ == "__main__":
    switches()
    set_ops()
    submask_walk()
    print("ok")
