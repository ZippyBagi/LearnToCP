"""Tree DP illustration. Wide (1040 px), no title.

The lesson's own coin array, C = {0,1,11,7,3,4,8,9,5,0}, hung on a 10 node
tree rooted at 0. The picture shows the instance and the best answer:
nodes 1, 5, 6, 7 and 8, worth 27 together.

Note that node 2 carries 11 coins and is still left out - taking it would
lock out 5 and 6, which are worth 12 between them.
"""
import os
import style
from style import *
from matplotlib.patches import Circle

OUT = os.path.dirname(os.path.abspath(__file__))

WIDE = 1040
style.W = WIDE
W = WIDE

C = {0: 0, 1: 1, 2: 11, 3: 7, 4: 3, 5: 4, 6: 8, 7: 9, 8: 5, 9: 0}
EDGES = [(0, 1), (0, 2), (1, 3), (1, 4), (2, 5), (2, 6), (3, 7), (4, 8),
         (6, 9)]
CHOSEN = [1, 5, 6, 7, 8]          # the maximum weight independent set

GPOS = {0: (2.5, 0),
        1: (1.0, 1), 2: (4.0, 1),
        3: (0.0, 2), 4: (2.0, 2), 5: (3.2, 2), 6: (4.8, 2),
        7: (0.0, 3), 8: (2.0, 3), 9: (4.8, 3)}
P = {v: (112 + gx * 170, 50 + gy * 96) for v, (gx, gy) in GPOS.items()}

EDGE_GREY = "#C9CFD6"
R = 28


def build():
    fig, ax = canvas(456)

    for a, b in EDGES:
        both = a in CHOSEN and b in CHOSEN      # never happens, by definition
        ax.plot([P[a][0], P[b][0]], [P[a][1], P[b][1]],
                color=CORAL if both else EDGE_GREY, lw=2.6, zorder=1,
                solid_capstyle="round")

    for v, p in P.items():
        on = v in CHOSEN
        ax.add_patch(Circle(p, R, facecolor=GREEN if on else WHITE,
                            edgecolor=GREEN if on else PURPLE, lw=2.4,
                            zorder=5))
        ax.text(p[0], p[1], str(C[v]), ha="center", va="center", fontsize=15,
                fontweight="bold", color=WHITE if on else INK2, zorder=6)
        ax.text(p[0] - R - 6, p[1] - R + 4, str(v), ha="right", va="center",
                fontsize=9, color=MUTE, zorder=6)

    total = sum(C[v] for v in CHOSEN)
    text = "  +  ".join(str(C[v]) for v in CHOSEN) + f"   =   {total}"
    rbox(ax, WIDE / 2 - 190, 386, 380, 50, face=LAV, edge=PURPLE, lw=1.8,
         r=10)
    mono(ax, WIDE / 2, 411, text, size=13, color=PURPLE, ha="center",
         weight="bold")

    save(fig, os.path.join(OUT, "tree-dp-robber.png"))


if __name__ == "__main__":
    build()
    print("ok")
