"""Dijkstra illustrations. Wide batch (1040 px), no titles.

All four run on the lesson's own 6 city map, drawn at the same coordinates
every time so the reader watches one picture evolve:

    A-B 4  A-C 2  C-B 1  C-D 8  B-E 10  D-E 2  D-F 6  E-F 3

Shortest distances from A: A 0, B 3, C 2, D 10, E 12, F 15.
Language-neutral: letters, digits and the infinity sign.
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

INF = "∞"
R = 25

EDGES = [("A", "B", 4), ("A", "C", 2), ("C", "B", 1), ("C", "D", 8),
         ("B", "E", 10), ("D", "E", 2), ("D", "F", 6), ("E", "F", 3)]
NODES = "ABCDEF"

# y already points down, so nothing gets flipped anywhere
GPOS = {"A": (0.0, 1.0), "B": (1.0, 0.0), "C": (1.0, 2.0),
        "D": (2.6, 2.0), "E": (3.2, 0.4), "F": (4.5, 1.2)}
P = {v: (182 + gx * 150, 56 + gy * 105) for v, (gx, gy) in GPOS.items()}

TREE = {("A", "C"), ("C", "B"), ("C", "D"), ("D", "E"), ("E", "F")}
FINAL = {"A": 0, "B": 3, "C": 2, "D": 10, "E": 12, "F": 15}

EDGE_GREY = "#C9CFD6"
DW, DG, DH = 110, 8, 52
DX = (WIDE - (6 * DW + 5 * DG)) / 2


def node(ax, p, txt, face=WHITE, edge=PURPLE, r=R):
    tcolor = INK2 if face in (WHITE, GREY, AMBER) else WHITE
    ax.add_patch(Circle(p, r, facecolor=face, edgecolor=edge, lw=2.4,
                        zorder=6))
    ax.text(p[0], p[1], txt, ha="center", va="center", fontsize=13,
            fontweight="bold", color=tcolor, zorder=7)


def graph(ax, hot=None, faces=None):
    """The map. `hot` colours individual edges, `faces` individual nodes."""
    hot, faces = hot or {}, faces or {}
    for a, b, w in EDGES:
        col = hot.get((a, b), hot.get((b, a)))
        ax.plot([P[a][0], P[b][0]], [P[a][1], P[b][1]],
                color=col or EDGE_GREY, lw=3.2 if col else 2.6, zorder=2,
                solid_capstyle="round")
        mx, my = (P[a][0] + P[b][0]) / 2, (P[a][1] + P[b][1]) / 2
        ax.text(mx, my, str(w), ha="center", va="center", fontsize=11,
                fontweight="bold", color=col or MUTE, zorder=5,
                bbox=dict(boxstyle="round,pad=0.24", facecolor=WHITE,
                          edgecolor="none"))
    for v in NODES:
        f = faces.get(v, WHITE)
        node(ax, P[v], v, face=f, edge=PURPLE if f is WHITE else f)


def dist_row(ax, y, values, faces=None, olds=None):
    """One snapshot of the dist array, one cell per city."""
    faces, olds = faces or {}, olds or {}
    for i, v in enumerate(NODES):
        x = DX + i * (DW + DG)
        f = faces.get(v, WHITE)
        light = f in (WHITE, GREY, AMBER)
        cell(ax, x, y, DW, DH, values[v], face=f,
             edge=PURPLE if f is WHITE else f,
             tcolor=INK2 if light else WHITE,
             sub=v, subcolor=MUTE if light else WHITE,
             size=16, subsize=9)
        if v in olds:
            cx = x + DW / 2
            ax.text(cx, y - 13, str(olds[v]), ha="center", va="center",
                    fontsize=10, color=MUTE, zorder=6)
            half = len(str(olds[v])) * 6 + 2
            ax.plot([cx - half, cx + half], [y - 13, y - 13], color=MUTE,
                    lw=1.3, zorder=7)


# ------------------------------------------------------- 1. the map
def map_only():
    fig, ax = canvas(316)
    graph(ax)
    save(fig, os.path.join(OUT, "dijkstra-graph.png"))


# ------------------------------------------------------- 2. relax from A
def relax():
    fig, ax = canvas(408)
    graph(ax, hot={("A", "B"): GREEN, ("A", "C"): GREEN},
          faces={"A": GREEN})
    dist_row(ax, 330,
             {"A": 0, "B": 4, "C": 2, "D": INF, "E": INF, "F": INF},
             faces={"A": GREEN, "B": AMBER, "C": AMBER})
    save(fig, os.path.join(OUT, "dijkstra-relax.png"))


# ------------------------------------------------------- 3. take the smallest
def pick():
    fig, ax = canvas(408)
    graph(ax, hot={("C", "B"): GREEN, ("C", "D"): GREEN},
          faces={"A": GREEN, "C": AMBER})
    dist_row(ax, 330,
             {"A": 0, "B": 3, "C": 2, "D": 10, "E": INF, "F": INF},
             faces={"A": GREEN, "C": AMBER, "B": AMBER, "D": AMBER},
             olds={"B": 4})
    save(fig, os.path.join(OUT, "dijkstra-pick.png"))


# ------------------------------------------------------- 4. the answer
def final():
    fig, ax = canvas(408)
    graph(ax, hot={e: GREEN for e in TREE},
          faces={v: GREEN for v in NODES})
    dist_row(ax, 330, FINAL, faces={v: GREEN for v in NODES})
    save(fig, os.path.join(OUT, "dijkstra-final.png"))


# --------------------------------------------- 5. why the weights must be positive
def negative():
    fig, ax = canvas(268)

    Q = {"A": (150, 134), "B": (400, 56), "C": (400, 212)}
    arcs = [("A", "B", 1, False), ("A", "C", 2, False), ("C", "B", -2, True)]

    for a, b, w, neg in arcs:
        pa, pb = Q[a], Q[b]
        dx, dy = pb[0] - pa[0], pb[1] - pa[1]
        d = math.hypot(dx, dy)
        ux, uy = dx / d, dy / d
        arrow(ax, pa[0] + ux * R, pa[1] + uy * R,
              pb[0] - ux * (R + 3), pb[1] - uy * (R + 3),
              color=CORAL if neg else EDGE_GREY, lw=3.0 if neg else 2.6,
              ms=14, z=2)
        ax.text((pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2, str(w),
                ha="center", va="center", fontsize=11, fontweight="bold",
                color=CORAL if neg else MUTE, zorder=5,
                bbox=dict(boxstyle="round,pad=0.24", facecolor=WHITE,
                          edgecolor="none"))
    for v, p in Q.items():
        node(ax, p, v)

    def route(y, seq, weights, total, ok):
        x = 620
        for i, v in enumerate(seq):
            node(ax, (x, y), v, r=20)
            if i < len(weights):
                ax.text(x + 45, y, str(weights[i]), ha="center", va="center",
                        fontsize=10, fontweight="bold",
                        color=CORAL if weights[i] < 0 else MUTE, zorder=6)
                x += 90
        rbox(ax, 900, y - 24, 96, 48, face=LAV,
             edge=GREEN if ok else CORAL, lw=1.8, r=10)
        mono(ax, 948, y, str(total), size=15,
             color=GREEN if ok else CORAL, ha="center", weight="bold")
        ax.text(566, y, "✓" if ok else "✗", ha="center", va="center",
                fontsize=20, color=GREEN if ok else CORAL,
                fontweight="bold", zorder=6)

    route(78, "AB", [1], 1, False)         # what Dijkstra locks in
    route(196, "ACB", [2, -2], 0, True)    # the route it found too late

    save(fig, os.path.join(OUT, "dijkstra-negative.png"))


if __name__ == "__main__":
    map_only()
    relax()
    pick()
    final()
    negative()
    print("ok")
