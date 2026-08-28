"""Union Find illustrations for `06 Data Structures / 10 Union Find`.

1040 px, matching the segment tree, Fenwick and sparse table batches in the
same chapter.

The forest is the exact state the lesson's own program leaves behind, taken
from the parent array before any find compresses it:

    1->0  2->0  3->2  6->5,  with 4 and 7 alone

Language-neutral: digits, arrows, and the code's own `find(x)`.
"""
import os
import math
import style
from style import *
from matplotlib.patches import Circle

OUT = os.path.dirname(os.path.abspath(__file__))

WIDE = 1040
style.W = WIDE
W = WIDE

R = 24
EDGE_GREY = "#C9CFD6"


def node(ax, p, txt, face=WHITE, edge=PURPLE, r=R, size=13):
    ax.add_patch(Circle(p, r, facecolor=face, edgecolor=edge, lw=2.4,
                        zorder=6))
    ax.text(p[0], p[1], str(txt), ha="center", va="center", fontsize=size,
            fontweight="bold", color=INK2 if face is WHITE else WHITE,
            zorder=7)


def to_parent(ax, child, par, color=EDGE_GREY, lw=2.4, rad=0.0):
    """Arrow from a child circle up to its parent circle."""
    dx, dy = par[0] - child[0], par[1] - child[1]
    d = math.hypot(dx, dy)
    ux, uy = dx / d, dy / d
    arrow(ax, child[0] + ux * R, child[1] + uy * R,
          par[0] - ux * (R + 3), par[1] - uy * (R + 3),
          color=color, lw=lw, ms=13, rad=rad, z=3)


def self_loop(ax, p, color=GREEN):
    """The little loop that marks a root - it is its own parent."""
    arrow(ax, p[0] - 9, p[1] - R + 2, p[0] + 9, p[1] - R + 2,
          color=color, lw=2.0, ms=11, rad=-2.4, z=4)


def hull(ax, pts, pad=40):
    """Faint rounded box around one tree, so a set is visible as a set."""
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    rbox(ax, min(xs) - pad, min(ys) - pad - 12,
         max(xs) - min(xs) + 2 * pad, max(ys) - min(ys) + 2 * pad + 12,
         face="#FAFBFC", edge=GRIDL, lw=1.6, r=14, z=0)


# ------------------------------------------------ 1. the forest is the sets
def forest():
    fig, ax = canvas(372)

    P = {0: (230, 96), 1: (150, 206), 2: (310, 206), 3: (310, 316),
         5: (540, 96), 6: (540, 206),
         4: (730, 96), 7: (870, 96)}
    parent = {1: 0, 2: 0, 3: 2, 6: 5}
    roots = [0, 4, 5, 7]

    for tree in ([0, 1, 2, 3], [5, 6], [4], [7]):
        hull(ax, [P[v] for v in tree])

    for c, p in parent.items():
        to_parent(ax, P[c], P[p])
    for v in roots:
        self_loop(ax, P[v])

    for v, p in P.items():
        node(ax, p, v, face=GREEN if v in roots else WHITE,
             edge=GREEN if v in roots else PURPLE)

    save(fig, os.path.join(OUT, "union-find-forest.png"))


# ------------------------------------------------ 2. what unite does
def unite():
    fig, ax = canvas(338)

    # before: two separate trees
    before = {0: (170, 96), 1: (170, 216), 2: (350, 96), 3: (350, 216)}
    hull(ax, [before[0], before[1]])
    hull(ax, [before[2], before[3]])
    for c, p in ((1, 0), (3, 2)):
        to_parent(ax, before[c], before[p])
    for v in (0, 2):
        self_loop(ax, before[v])
    for v, p in before.items():
        node(ax, p, v, face=GREEN if v in (0, 2) else WHITE,
             edge=GREEN if v in (0, 2) else PURPLE)

    arrow(ax, 470, 156, 560, 156, color=PURPLE, lw=2.6, ms=15)

    # after: root 2 now points at root 0
    after = {0: (760, 66), 1: (680, 186), 2: (860, 186), 3: (860, 296)}
    hull(ax, list(after.values()))
    for c, p in ((1, 0), (2, 0), (3, 2)):
        to_parent(ax, after[c], after[p],
                  color=AMBER if c == 2 else EDGE_GREY,
                  lw=3.0 if c == 2 else 2.4)
    self_loop(ax, after[0])
    for v, p in after.items():
        node(ax, p, v, face=GREEN if v == 0 else WHITE,
             edge=GREEN if v == 0 else (AMBER if v == 2 else PURPLE))

    save(fig, os.path.join(OUT, "union-find-unite.png"))


# ------------------------------------------------ 3. the chain is the danger
def chain():
    fig, ax = canvas(462)

    col = 190
    # the gap has to clear two radii, or the arrows between links vanish
    ys = [56 + k * 72 for k in range(6)]          # 0 at the top, 5 at the bottom
    P = {v: (col, ys[v]) for v in range(6)}

    for v in range(1, 6):
        to_parent(ax, P[v], P[v - 1], color=CORAL, lw=2.6)
    self_loop(ax, P[0], color=GREEN)
    for v in range(6):
        node(ax, P[v], v, face=GREEN if v == 0 else WHITE,
             edge=GREEN if v == 0 else CORAL)

    # the walk find(5) is forced to make
    bx = col + 74
    arrow(ax, bx, ys[5], bx, ys[0], color=CORAL, lw=2.2, ms=13)
    mono(ax, bx + 14, (ys[0] + ys[5]) / 2, "find(5)", size=11, color=CORAL,
         ha="left", weight="bold")

    arrow(ax, 430, 240, 520, 240, color=PURPLE, lw=2.6, ms=15)

    # the same six nodes, flat
    root = (760, 140)
    kids = {v: (610 + (v - 1) * 74, 330) for v in range(1, 6)}
    for v, p in kids.items():
        to_parent(ax, p, root, color=GREEN, lw=2.4)
    self_loop(ax, root, color=GREEN)
    node(ax, root, 0, face=GREEN, edge=GREEN)
    for v, p in kids.items():
        node(ax, p, v, edge=GREEN)

    save(fig, os.path.join(OUT, "union-find-chain.png"))


# ------------------------------------------------ 4. path compression
def compression():
    fig, ax = canvas(390)

    col = 210
    ys = [60 + k * 92 for k in range(4)]
    P = {v: (col, ys[v]) for v in range(4)}

    for v in range(1, 4):
        to_parent(ax, P[v], P[v - 1], color=AMBER, lw=3.0)
    self_loop(ax, P[0], color=GREEN)
    for v in range(4):
        node(ax, P[v], v, face=GREEN if v == 0 else WHITE,
             edge=GREEN if v == 0 else AMBER)
    mono(ax, col + 46, ys[3], "find(3)", size=11, color=AMBER, ha="left",
         weight="bold")

    arrow(ax, 430, 200, 520, 200, color=PURPLE, lw=2.6, ms=15)

    root = (790, 100)
    kids = {v: (660 + (v - 1) * 130, 280) for v in range(1, 4)}
    for v, p in kids.items():
        to_parent(ax, p, root, color=GREEN, lw=2.4)
    self_loop(ax, root, color=GREEN)
    node(ax, root, 0, face=GREEN, edge=GREEN)
    for v, p in kids.items():
        node(ax, p, v, edge=GREEN)

    save(fig, os.path.join(OUT, "union-find-path-compression.png"))


if __name__ == "__main__":
    forest()
    unite()
    chain()
    compression()
    print("ok")
