"""Topological sorting illustrations. Wide batch (1040 px), no titles.

All three figures run on the lesson's own 6 course DAG:

    1->3  1->4  2->3  2->5  3->6  4->6  5->6

Language-neutral: digits, arrows, and the code's own identifiers
(`indegree`, `q`, `topo`).
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

EDGES = [(1, 3), (1, 4), (2, 3), (2, 5), (3, 6), (4, 6), (5, 6)]
N = 6
BACK = (6, 3)                       # the extra edge that creates a cycle

GPOS = {1: (-1.2, 0), 2: (1.2, 0),
        4: (-2.0, 1), 3: (0.0, 1), 5: (2.0, 1),
        6: (0.0, 2)}

EDGE_GREY = "#C9CFD6"
R = 21

ORDER_OK = [1, 2, 4, 3, 5, 6]
ORDER_BAD = [1, 4, 3, 2, 5, 6]


def indeg(edges):
    d = {v: 0 for v in range(1, N + 1)}
    for _, b in edges:
        d[b] += 1
    return d


def place(cx, cy, ux, uy):
    return {v: (cx + gx * ux, cy + gy * uy) for v, (gx, gy) in GPOS.items()}


def node(ax, p, txt, face=WHITE, edge=PURPLE, tcolor=INK2, r=R, size=12):
    ax.add_patch(Circle(p, r, facecolor=face, edgecolor=edge, lw=2.2,
                        zorder=6))
    ax.text(p[0], p[1], str(txt), ha="center", va="center", fontsize=size,
            fontweight="bold", color=tcolor, zorder=7)


def directed(ax, pa, pb, color=EDGE_GREY, lw=2.4, rad=0.0, r=R):
    """Arrow from circle edge to circle edge, so the head is never hidden."""
    dx, dy = pb[0] - pa[0], pb[1] - pa[1]
    d = math.hypot(dx, dy)
    ux, uy = dx / d, dy / d
    arrow(ax, pa[0] + ux * r, pa[1] + uy * r,
          pb[0] - ux * (r + 2), pb[1] - uy * (r + 2),
          color=color, lw=lw, ms=13, rad=rad, z=3)


def draw_dag(ax, P, edges, colors=None, faces=None, rads=None):
    colors, faces, rads = colors or {}, faces or {}, rads or {}
    for e in edges:
        directed(ax, P[e[0]], P[e[1]], color=colors.get(e, EDGE_GREY),
                 lw=2.8 if e in colors else 2.4, rad=rads.get(e, 0.0))
    for v, p in P.items():
        face = faces.get(v, WHITE)
        node(ax, p, v, face=face, edge=PURPLE if face is WHITE else face,
             tcolor=INK2 if face is WHITE else WHITE)


def box(ax, x, y, w, h, value, face=WHITE, edge=PURPLE, tcolor=None, size=12):
    cell(ax, x, y, w, h, value, face=face, edge=edge,
         tcolor=tcolor or (INK2 if face in (WHITE, GREY) else WHITE),
         size=size)


# --------------------------------------------- 1. what a valid order means
def order():
    fig, ax = canvas(342)

    P = place(206, 52, 64, 92)
    draw_dag(ax, P, EDGES)

    xs = [442 + i * 112 for i in range(N)]

    def strip(y, seq, bad=None):
        """One linear order. Edges bow above the row; a backward edge - the
        thing that makes an order invalid - bows below it."""
        pos = {v: xs[i] for i, v in enumerate(seq)}
        for a, b in EDGES:
            lo, hi = pos[a], pos[b]
            d = 1 if hi > lo else -1
            x1, x2 = lo + d * (R + 3), hi - d * (R + 3)
            below = d < 0                    # points backwards, so it breaks
            mag = 0.30 if abs(x2 - x1) > 140 else 0.5
            arrow(ax, x1, y, x2, y,
                  color=CORAL if below else (GREEN if bad is None else EDGE_GREY),
                  lw=2.6 if below else 2.2, ms=12,
                  rad=mag * d * (1 if below else -1), z=3)
        for v, x in pos.items():
            node(ax, (x, y), v, face=WHITE)

    strip(140, ORDER_OK)
    ax.text(398, 140, "✓", ha="center", va="center", fontsize=22,
            color=GREEN, fontweight="bold", zorder=6)

    strip(286, ORDER_BAD, bad=True)
    ax.text(398, 286, "✗", ha="center", va="center", fontsize=22,
            color=CORAL, fontweight="bold", zorder=6)

    save(fig, os.path.join(OUT, "topological-order.png"))


# --------------------------------------------- 2. Kahn's algorithm, step by step
def kahn():
    fig, ax = canvas(404)

    CW, CG, CH = 64, 6, 34
    IX = 132
    QX, TX, SB, SG = 596, 802, 30, 34

    def ix(v):
        return IX + (v - 1) * (CW + CG)

    mono(ax, IX + (6 * (CW + CG) - CG) / 2, 22, "indegree", size=11,
         color=INK2, ha="center", weight="bold")
    mono(ax, QX + 50, 22, "q", size=11, color=INK2, ha="center", weight="bold")
    mono(ax, TX + 100, 22, "topo", size=11, color=INK2, ha="center",
         weight="bold")
    for v in range(1, N + 1):
        ax.text(ix(v) + CW / 2, 46, str(v), ha="center", va="center",
                fontsize=9, color=MUTE, zorder=6)

    # replay the algorithm, recording one snapshot per step
    adj = {v: [b for a, b in EDGES if a == v] for v in range(1, N + 1)}
    deg = indeg(EDGES)
    q = [v for v in range(1, N + 1) if deg[v] == 0]
    topo = []
    rows = [(None, dict(deg), list(q), list(topo), set(), set())]

    while q:
        v = q.pop(0)
        topo.append(v)
        touched, zeroed = set(), set()
        for to in adj[v]:
            deg[to] -= 1
            touched.add(to)
            if deg[to] == 0:
                zeroed.add(to)
                q.append(to)
        rows.append((v, dict(deg), list(q), list(topo), touched, zeroed))

    for r, (popped, deg_r, q_r, topo_r, touched, zeroed) in enumerate(rows):
        y = 62 + r * 47

        if popped is not None:
            node(ax, (72, y + CH / 2), popped, face=AMBER, edge=AMBER,
                 tcolor=INK2, r=17, size=11)

        for v in range(1, N + 1):
            done = v in topo_r
            face = GREY if done else (GREEN if v in zeroed else WHITE)
            edge = GREY if done else (GREEN if v in touched else PURPLE)
            box(ax, ix(v), y, CW, CH, deg_r[v], face=face, edge=edge,
                tcolor=MUTE if done else None)

        for i, v in enumerate(q_r):
            box(ax, QX + i * SG, y, SB, CH, v, face=WHITE, edge=BLUE, size=11)
        for i, v in enumerate(topo_r):
            box(ax, TX + i * SG, y, SB, CH, v, face=GREEN, edge=GREEN,
                size=11)

    save(fig, os.path.join(OUT, "kahn-steps.png"))


# --------------------------------------------- 3. a cycle stalls the queue
def cycle():
    fig, ax = canvas(316)

    edges = EDGES + [BACK]
    P = place(250, 56, 76, 96)
    stuck = {3, 6}
    done = [v for v in ORDER_OK if v not in stuck]

    draw_dag(ax, P, edges,
             colors={BACK: CORAL, (3, 6): CORAL},
             faces={**{v: GREEN for v in done}, **{v: CORAL for v in stuck}},
             rads={(3, 6): -0.42, BACK: -0.42})   # bow apart, so the loop shows

    x0, SB, SG = 620, 44, 50
    mono(ax, 580, 112, "q", size=11, color=INK2, ha="right", weight="bold")
    box(ax, x0, 92, SB, 40, "", face=GREY, edge=GREY)

    mono(ax, 580, 202, "topo", size=11, color=INK2, ha="right", weight="bold")
    for i in range(N):
        if i < len(done):
            box(ax, x0 + i * SG, 182, SB, 40, done[i], face=GREEN, edge=GREEN)
        else:
            box(ax, x0 + i * SG, 182, SB, 40, "", face=GREY, edge=GREY)

    save(fig, os.path.join(OUT, "topological-cycle.png"))


if __name__ == "__main__":
    order()
    kahn()
    cycle()
    print("ok")
