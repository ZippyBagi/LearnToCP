"""Bitmask DP illustrations for `10 Dynamic Programming / 03 Bitmask DP`.

1040 px, matching tree-dp-robber in the same chapter.

Both reuse the lesson's own data: the 3x3 assignment costs {9,2,7 / 6,4,3 /
5,8,1} whose optimum is 9, and the 4 city map whose best tour is 80.

The assignment figure carries prose row and column labels (W/J in English,
R/P in Serbian), so it is the one image here that needs an -en / -sr pair -
the same arrangement `ascii-table` already uses.
"""
import os
import style
from style import *
from matplotlib.patches import Circle

OUT = os.path.dirname(os.path.abspath(__file__))

WIDE = 1040
style.W = WIDE
W = WIDE

COST = [[9, 2, 7],
        [6, 4, 3],
        [5, 8, 1]]
PICK = [(0, 1), (1, 0), (2, 2)]        # worker -> job, total 9
PATH = [0b000, 0b010, 0b011, 0b111]    # the masks that path walks through

D = [[0, 10, 15, 20],
     [10, 0, 35, 25],
     [15, 35, 0, 30],
     [20, 25, 30, 0]]
TOUR = [0, 1, 3, 2, 0]                 # total 80

EDGE_GREY = "#C9CFD6"


def mask_str(m, n=3):
    return "".join(str((m >> i) & 1) for i in range(n - 1, -1, -1))


# --------------------------------------------- 1. the assignment lattice
def assignment(locale, worker, job):
    fig, ax = canvas(408)

    # ---- the cost table
    cw, ch, tx, ty = 80, 46, 60, 64
    for j in range(3):
        mono(ax, tx + (j + 1) * cw + cw / 2, ty + ch / 2, f"{job}{j}",
             size=11, color=INK2, ha="center", weight="bold")
    for i in range(3):
        y = ty + (i + 1) * ch
        mono(ax, tx + cw / 2, y + ch / 2, f"{worker}{i}", size=11,
             color=INK2, ha="center", weight="bold")
        for j in range(3):
            on = (i, j) in PICK
            cell(ax, tx + (j + 1) * cw, y, cw - 4, ch - 4, COST[i][j],
                 face=GREEN if on else WHITE, edge=GREEN if on else PURPLE,
                 tcolor=WHITE if on else INK2, size=14)

    # ---- the lattice of the eight masks, stacked by how many jobs are gone
    levels = {k: [m for m in range(8) if bin(m).count("1") == k]
              for k in range(4)}
    pos = {}
    for k, masks in levels.items():
        y = 300 - k * 80
        span = 160
        x0 = 720 - span * (len(masks) - 1) / 2
        for i, m in enumerate(masks):
            pos[m] = (x0 + i * span, y)

    hot = set(zip(PATH, PATH[1:]))
    for m, p in pos.items():
        for bit in range(3):
            if m >> bit & 1:
                continue
            nxt = m | (1 << bit)
            on = (m, nxt) in hot
            ax.plot([p[0], pos[nxt][0]], [p[1], pos[nxt][1]],
                    color=GREEN if on else GRIDL, lw=3.0 if on else 1.8,
                    zorder=3 if on else 1, solid_capstyle="round")
            if on:
                cost = COST[bin(m).count("1")][bit]
                ax.text((p[0] + pos[nxt][0]) / 2, (p[1] + pos[nxt][1]) / 2,
                        str(cost), ha="center", va="center", fontsize=11,
                        fontweight="bold", color=GREEN, zorder=6,
                        bbox=dict(boxstyle="round,pad=0.24",
                                  facecolor=WHITE, edgecolor="none"))

    for m, p in pos.items():
        on = m in PATH
        cell(ax, p[0] - 34, p[1] - 17, 68, 34, mask_str(m),
             face=GREEN if on else WHITE, edge=GREEN if on else PURPLE,
             tcolor=WHITE if on else INK2, size=12)

    total = sum(COST[i][j] for i, j in PICK)
    rbox(ax, 560, 342, 320, 48, face=LAV, edge=PURPLE, lw=1.8, r=10)
    mono(ax, 720, 366, f"2  +  6  +  1   =   {total}", size=13, color=PURPLE,
         ha="center", weight="bold")

    save(fig, os.path.join(OUT, f"bitmask-dp-assignment-{locale}.png"))


# --------------------------------------------- 2. the travelling salesman
def tsp():
    fig, ax = canvas(372)

    P = {0: (250, 80), 1: (630, 80), 3: (630, 288), 2: (250, 288)}
    R = 26
    ring = set(zip(TOUR, TOUR[1:])) | set(zip(TOUR[1:], TOUR))

    for a in range(4):
        for b in range(a + 1, 4):
            on = (a, b) in ring
            ax.plot([P[a][0], P[b][0]], [P[a][1], P[b][1]],
                    color=GREEN if on else EDGE_GREY, lw=3.4 if on else 2.2,
                    zorder=2 if on else 1, solid_capstyle="round")
            # both diagonals share a midpoint, so slide their labels off it
            t = 0.5 if on else 0.3
            mx = P[a][0] + (P[b][0] - P[a][0]) * t
            my = P[a][1] + (P[b][1] - P[a][1]) * t
            ax.text(mx, my, str(D[a][b]), ha="center", va="center",
                    fontsize=11, fontweight="bold",
                    color=GREEN if on else MUTE, zorder=6,
                    bbox=dict(boxstyle="round,pad=0.24", facecolor=WHITE,
                              edgecolor="none"))

    for v, p in P.items():
        ax.add_patch(Circle(p, R, facecolor=WHITE, edgecolor=PURPLE, lw=2.4,
                            zorder=5))
        ax.text(p[0], p[1], str(v), ha="center", va="center", fontsize=14,
                fontweight="bold", color=INK2, zorder=6)

    # the route, spelled out on the right
    x = 760
    for i, v in enumerate(TOUR):
        ax.add_patch(Circle((x, 128), 19, facecolor=GREEN, edgecolor=GREEN,
                            lw=2.0, zorder=5))
        ax.text(x, 128, str(v), ha="center", va="center", fontsize=11,
                fontweight="bold", color=WHITE, zorder=6)
        if i < len(TOUR) - 1:
            arrow(ax, x + 22, 128, x + 40, 128, color=GREEN, lw=2.0, ms=11)
        x += 62

    total = sum(D[a][b] for a, b in zip(TOUR, TOUR[1:]))
    rbox(ax, 716, 196, 300, 48, face=LAV, edge=PURPLE, lw=1.8, r=10)
    mono(ax, 866, 220, f"10 + 25 + 30 + 15 = {total}", size=11.5,
         color=PURPLE, ha="center", weight="bold")

    save(fig, os.path.join(OUT, "bitmask-dp-tsp.png"))


if __name__ == "__main__":
    assignment("en", "W", "J")
    assignment("sr", "R", "P")
    tsp()
    print("ok")
