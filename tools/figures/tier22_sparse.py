"""Sparse table illustrations for `06 Data Structures / 09 Sparse Tables`.

1040 px, matching the segment tree and Fenwick batches in the same chapter.

All five run on one array of 12 elements and the operation the lesson picks,
max:

    5 2 9 7 1 8 3 6 4 10 2 7

Layer 0 is drawn at the bottom and the layers stack upward, so `lookup[i][j]`
sits in column i of row j. The query example is [3, 9], answered by the two
overlapping blocks lookup[3][2] = 8 and lookup[6][2] = 10.

Language-neutral: digits and the code's own `lookup[i][j]`.
"""
import os
import style
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))

WIDE = 1040
style.W = WIDE
W = WIDE

ARR = [5, 2, 9, 7, 1, 8, 3, 6, 4, 10, 2, 7]
N = len(ARR)
LEVELS = 4                       # 2^3 = 8 still fits inside 12

CW, GAP, CH = 66, 6, 46
X0 = 150


def table():
    t = [[0] * LEVELS for _ in range(N)]
    for i in range(N):
        t[i][0] = ARR[i]
    for j in range(1, LEVELS):
        for i in range(N - (1 << j) + 1):
            t[i][j] = max(t[i][j - 1], t[i + (1 << (j - 1))][j - 1])
    return t


T = table()


def count(j):
    return N - (1 << j) + 1


def x(i):
    return X0 + i * (CW + GAP)


def span(lo, hi):
    """Pixel range covering columns lo..hi inclusive."""
    return x(lo), x(hi) + CW


def row_label(ax, y, j):
    mono(ax, X0 - 18, y + CH / 2, f"j = {j}", size=11, color=INK2,
         ha="right", weight="bold")


def indices(ax, y):
    for i in range(N):
        mono(ax, x(i) + CW / 2, y, str(i), size=9, color=MUTE, ha="center")


def layer_rows(top, pitch=58):
    """y of each layer, layer 0 at the bottom."""
    return {j: top + (LEVELS - 1 - j) * pitch for j in range(LEVELS)}


# ------------------------------------------------ 1. what one entry covers
def staircase():
    fig, ax = canvas(310)
    ys = layer_rows(24, 62)

    for i, v in enumerate(ARR):
        cell(ax, x(i), ys[0], CW, CH, v, face=WHITE, edge=PURPLE,
             tcolor=INK2, size=15)
    row_label(ax, ys[0], 0)
    indices(ax, ys[0] + CH + 22)

    for j in range(1, LEVELS):
        row_label(ax, ys[j], j)
        # the block that lookup[0][j] stands for
        lo, hi = span(0, (1 << j) - 1)
        rbox(ax, lo, ys[j], hi - lo, CH, face=GREEN, edge=None, r=8)
        # sits in the part the ghost block does not cover
        mono(ax, (lo + x(1)) / 2, ys[j] + CH / 2, f"2^{j}", size=14,
             color=WHITE, ha="center", weight="bold")
        # and the one starting one place further along, to show the row is
        # full - drawn hollow and on top, so it reads as a second block
        lo2, hi2 = span(1, 1 + (1 << j) - 1)
        ghost = rbox(ax, lo2, ys[j] + 7, hi2 - lo2, CH - 14, face="none",
                     edge=INK2, lw=1.6, r=6, z=8)
        ghost.set_linestyle((0, (4, 3)))

    save(fig, os.path.join(OUT, "sparse-table-layers.png"))


# ------------------------------------------------ 2 and 4. the table itself
def grid(ax, ys, filled, faces=None, edges=None, reveal=()):
    """`filled` is the highest layer already built; `reveal` names extra
    cells that should show their value anyway."""
    faces, edges = faces or {}, edges or {}
    for j in range(LEVELS):
        row_label(ax, ys[j], j)
        for i in range(count(j)):
            done = j <= filled or (i, j) in reveal
            f = faces.get((i, j), WHITE if done else GREY)
            e = edges.get((i, j), PURPLE if done else GREY)
            cell(ax, x(i), ys[j], CW, CH, T[i][j] if done else "",
                 face=f, edge=e,
                 tcolor=INK2 if f in (WHITE, GREY, AMBER) else WHITE, size=15)


def base_only():
    fig, ax = canvas(286)
    ys = layer_rows(20, 58)
    grid(ax, ys, filled=0)
    indices(ax, ys[0] + CH + 20)
    save(fig, os.path.join(OUT, "sparse-table-base.png"))


def full():
    fig, ax = canvas(286)
    ys = layer_rows(20, 58)
    grid(ax, ys, filled=LEVELS - 1)
    indices(ax, ys[0] + CH + 20)
    save(fig, os.path.join(OUT, "sparse-table-full.png"))


# ------------------------------------------------ 3. one dp step
def step():
    fig, ax = canvas(392)
    ys = layer_rows(20, 76)

    src = [(0, 1), (2, 1)]
    grid(ax, ys, filled=1, reveal={(0, 2)},
         faces={**{s: GREEN for s in src}, (0, 2): AMBER},
         edges={**{s: GREEN for s in src}, (0, 2): AMBER})

    for i, _ in src:
        arrow(ax, x(i) + CW / 2, ys[1], x(0) + CW / 2, ys[2] + CH + 3,
              color=AMBER, lw=2.2, ms=12, rad=0.0 if i == 0 else -0.3)

    # the second half sits 2^(j-1) columns further along
    mono(ax, (x(0) + x(2)) / 2 + CW / 2, ys[1] - 17, "2^1", size=10,
         color=MUTE, ha="center", weight="bold")

    indices(ax, ys[0] + CH + 20)

    rbox(ax, W / 2 - 170, 332, 340, 46, face=LAV, edge=PURPLE, lw=1.8, r=10)
    mono(ax, W / 2, 355, f"max( {T[0][1]} , {T[2][1]} )   =   {T[0][2]}",
         size=13, color=PURPLE, ha="center", weight="bold")

    save(fig, os.path.join(OUT, "sparse-table-step.png"))


# ------------------------------------------------ 5. one query, two blocks
def query():
    fig, ax = canvas(330)
    L, R, k = 3, 9, 2
    a, b = L, R - (1 << k) + 1              # the two block starts

    for lane, (start, col) in enumerate([(a, GREEN), (b, PURPLE)]):
        lo, hi = span(start, start + (1 << k) - 1)
        y = 30 + lane * 58
        rbox(ax, lo, y, hi - lo, CH, face=col, edge=None, r=8)
        mono(ax, (lo + hi) / 2, y + CH / 2,
             f"lookup[{start}][{k}] = {T[start][k]}", size=12, color=WHITE,
             ha="center", weight="bold")

    ytab = 156
    for i, v in enumerate(ARR):
        inside = L <= i <= R
        cell(ax, x(i), ytab, CW, CH, v,
             face=LAV if inside else WHITE,
             edge=PURPLE if inside else "#D8DEE6",
             tcolor=INK2 if inside else MUTE, size=15)
    indices(ax, ytab + CH + 20)

    rbox(ax, W / 2 - 170, 262, 340, 46, face=LAV, edge=PURPLE, lw=1.8, r=10)
    mono(ax, W / 2, 285,
         f"max( {T[a][k]} , {T[b][k]} )   =   {max(T[a][k], T[b][k])}",
         size=13, color=PURPLE, ha="center", weight="bold")

    save(fig, os.path.join(OUT, "sparse-table-query.png"))


if __name__ == "__main__":
    staircase()
    base_only()
    step()
    full()
    query()
    print("ok")
