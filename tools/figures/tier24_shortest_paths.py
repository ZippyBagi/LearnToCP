"""Bellman-Ford and Floyd-Warshall illustrations. Wide batch (1040 px), no titles.

Bellman-Ford uses a 5 vertex directed graph with two negative edges

    A->B 4   A->C 5   B->C -3   B->E 6   C->D 4   D->E -2

whose distances from A are A 0, B 4, C 1, D 5, E 3, plus the three vertex
cycle the lesson names in prose (A->B 2, B->C -4, C->A -1, one lap = -3).

Floyd-Warshall uses one 4 vertex directed graph, numbered 0..3 to match the
loop indices in the lesson's code, drawn at the same coordinates in all four
images so the reader watches one picture evolve:

    0->1 4   0->2 11   1->2 3   1->3 9   2->0 6   2->3 2

Vertex 3 is a sink, so c = 3 improves nothing and the c = 2 matrix is already
the answer. Language-neutral throughout: digits, letters, the infinity sign.
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

R = 25
EDGE_GREY = "#C9CFD6"
PALEGREEN = "#E8F7EF"   # changed-cell fill; white-on-green hid the struck value
INFTXT = "∞"
INF = 10 ** 8


# ---------------------------------------------------------------- primitives
def node(ax, p, txt, face=WHITE, edge=PURPLE, r=R, size=13):
    tcolor = INK2 if face in (WHITE, GREY, AMBER, LAV) else WHITE
    ax.add_patch(Circle(p, r, facecolor=face, edgecolor=edge, lw=2.4, zorder=6))
    ax.text(p[0], p[1], str(txt), ha="center", va="center", fontsize=size,
            fontweight="bold", color=tcolor, zorder=7)


def darrow(ax, pa, pb, w, color=EDGE_GREY, rad=0.0, lw=2.6, r=R,
           wcolor=None, extra=(0, 0), size=11):
    """Directed edge between two circles of radius r, with a weight label."""
    dx, dy = pb[0] - pa[0], pb[1] - pa[1]
    d = math.hypot(dx, dy)
    ux, uy = dx / d, dy / d
    arrow(ax, pa[0] + ux * r, pa[1] + uy * r,
          pb[0] - ux * (r + 3), pb[1] - uy * (r + 3),
          color=color, lw=lw, ms=14, rad=rad, z=3)
    mx, my = (pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2
    # arc3's curve midpoint sits at chord midpoint + rad/2 * (dy, -dx)
    mx += rad / 2 * dy + extra[0]
    my += -rad / 2 * dx + extra[1]
    ax.text(mx, my, str(w), ha="center", va="center", fontsize=size,
            fontweight="bold", color=wcolor or color, zorder=8,
            bbox=dict(boxstyle="round,pad=0.24", facecolor=WHITE,
                      edgecolor="none"))


# ================================================================ Bellman-Ford
BPOS = {"A": (108, 178), "B": (348, 78), "C": (348, 272),
        "D": (648, 272), "E": (932, 178)}
BEDGES = [("A", "B", 4, 0.0, (0, -14)),
          ("A", "C", 5, 0.0, (-14, 6)),
          ("B", "C", -3, 0.0, (0, 0)),
          ("B", "E", 6, 0.0, (0, -14)),
          ("C", "D", 4, 0.0, (0, -14)),
          ("D", "E", -2, 0.0, (14, 6))]
BDIST = {"A": 0, "B": 4, "C": 1, "D": 5, "E": 3}

DW, DG, DH = 132, 10, 54


def bellman_ford_graph():
    fig, ax = canvas(452)

    for a, b, w, rad, ex in BEDGES:
        neg = w < 0
        darrow(ax, BPOS[a], BPOS[b], w,
               color=CORAL if neg else EDGE_GREY,
               wcolor=CORAL if neg else MUTE,
               lw=3.0 if neg else 2.6, rad=rad, extra=ex)
    for v, p in BPOS.items():
        node(ax, p, v, face=GREEN if v == "A" else WHITE,
             edge=GREEN if v == "A" else PURPLE)

    total = 5 * DW + 4 * DG
    x0 = (WIDE - total) / 2
    for i, v in enumerate("ABCDE"):
        cell(ax, x0 + i * (DW + DG), 356, DW, DH, BDIST[v],
             face=GREEN if v == "A" else WHITE,
             edge=GREEN if v == "A" else PURPLE,
             tcolor=WHITE if v == "A" else INK2,
             sub=v, subcolor=WHITE if v == "A" else MUTE,
             size=16, subsize=9)

    save(fig, os.path.join(OUT, "bellman-ford-graph.png"))


def bellman_ford_negative_cycle():
    fig, ax = canvas(376)

    Q = {"A": (140, 92), "B": (400, 92), "C": (270, 300)}
    for a, b, w, ex in [("A", "B", 2, (0, -16)), ("B", "C", -4, (18, 4)),
                        ("C", "A", -1, (-18, 4))]:
        neg = w < 0
        darrow(ax, Q[a], Q[b], w, color=CORAL if neg else EDGE_GREY,
               wcolor=CORAL if neg else MUTE, lw=3.0 if neg else 2.6, extra=ex)
    for v, p in Q.items():
        node(ax, p, v)

    bw, bh, gap = 70, 58, 40
    vals = ["0", "-3", "-6", "-9", "-" + INFTXT]
    x = 490
    y = 167
    for i, val in enumerate(vals):
        last = i == len(vals) - 1
        cell(ax, x, y, bw, bh, val, face=LAV if last else WHITE,
             edge=CORAL if last else PURPLE,
             tcolor=CORAL if last else INK2, size=17)
        if i < len(vals) - 1:
            dashed = i == len(vals) - 2
            arrow(ax, x + bw + 7, y + bh / 2, x + bw + gap - 7, y + bh / 2,
                  color=CORAL, lw=2.0, ms=11, ls="--" if dashed else "-")
            ax.text(x + bw + gap / 2, y - 12,
                    "…" if dashed else "-3",
                    ha="center", va="center", fontsize=11,
                    fontweight="bold", color=CORAL, zorder=7)
        x += bw + gap

    save(fig, os.path.join(OUT, "bellman-ford-negative-cycle.png"))


# ============================================================= Floyd-Warshall
N = 4
FPOS = {0: (140, 200), 1: (330, 90), 2: (330, 310), 3: (500, 200)}
FEDGES = [(0, 1, 4), (0, 2, 11), (1, 2, 3), (1, 3, 9), (2, 0, 6), (2, 3, 2)]
FRAD = {(0, 2): 0.34, (2, 0): 0.34}
# the 0 <-> 2 pair is the only bidirectional one; push its two labels apart
# along the perpendicular or they read as annotations on the same arc
FEXTRA = {(0, 1): (-4, -12), (1, 2): (0, 0), (1, 3): (10, -10),
          (2, 3): (10, 10), (0, 2): (10, -8), (2, 0): (-10, 8)}

MCW, MCH, MG = 76, 54, 6
MX, MY = 639, 118


def fgraph(ax, hot=None):
    hot = hot or {}
    for a, b, w in FEDGES:
        darrow(ax, FPOS[a], FPOS[b], w, color=EDGE_GREY, wcolor=MUTE,
               rad=FRAD.get((a, b), 0.0), extra=FEXTRA.get((a, b), (0, 0)))
    for v, p in FPOS.items():
        f = hot.get(v, WHITE)
        node(ax, p, v, face=f, edge=PURPLE if f is WHITE else f)


def txt(v):
    return INFTXT if v >= INF else str(v)


def mcell(ax, x, y, val, face=WHITE, edge=PURPLE, old=None, tcolor=INK2):
    rbox(ax, x, y, MCW, MCH, face=face, edge=edge, lw=2.4 if old else 1.8, r=6)
    if old is None:
        ax.text(x + MCW / 2, y + MCH / 2, txt(val), ha="center", va="center",
                fontsize=16, fontweight="bold", color=tcolor, zorder=5)
        return
    ax.text(x + MCW / 2, y + MCH * 0.35, txt(val), ha="center", va="center",
            fontsize=16, fontweight="bold", color=tcolor, zorder=5)
    s = txt(old)
    oy = y + MCH * 0.755
    ax.text(x + MCW / 2, oy, s, ha="center", va="center", fontsize=11,
            color=MUTE, zorder=5)
    # a struck single glyph (the infinity sign) needs a floor or it reads as a dot
    half = max(9.5, len(s) * 11 * 0.32 + 3)
    ax.plot([x + MCW / 2 - half, x + MCW / 2 + half], [oy, oy],
            color=MUTE, lw=1.3, zorder=6)


def matrix(ax, d, c=None, changes=None):
    changes = changes or {}
    for j in range(N):
        cx = MX + j * (MCW + MG) + MCW / 2
        ax.text(cx, MY - 22, str(j), ha="center", va="center", fontsize=11,
                fontweight="bold", color=AMBER if j == c else MUTE, zorder=6)
    for i in range(N):
        cy = MY + i * (MCH + MG) + MCH / 2
        ax.text(MX - 24, cy, str(i), ha="center", va="center", fontsize=11,
                fontweight="bold", color=AMBER if i == c else MUTE, zorder=6)
    for i in range(N):
        for j in range(N):
            x = MX + j * (MCW + MG)
            y = MY + i * (MCH + MG)
            if (i, j) in changes:
                mcell(ax, x, y, d[i][j], face=PALEGREEN, edge=GREEN,
                      old=changes[(i, j)], tcolor=GREEN)
            elif c is not None and (i == c or j == c):
                mcell(ax, x, y, d[i][j], face=LAV, edge=PURPLE)
            else:
                mcell(ax, x, y, d[i][j])


def run():
    d = [[0 if i == j else INF for j in range(N)] for i in range(N)]
    for a, b, w in FEDGES:
        d[a][b] = min(d[a][b], w)
    snaps = [(None, [r[:] for r in d], {})]
    for c in range(N):
        old = [r[:] for r in d]
        for a in range(N):
            for b in range(N):
                if d[a][c] + d[c][b] < d[a][b]:
                    d[a][b] = d[a][c] + d[c][b]
        ch = {(a, b): old[a][b] for a in range(N) for b in range(N)
              if d[a][b] != old[a][b]}
        snaps.append((c, [r[:] for r in d], ch))
    return snaps


SNAPS = run()


def floyd_warshall_graph():
    fig, ax = canvas(400)
    fgraph(ax)
    x = 700
    y = 122
    for a, b, w in FEDGES:
        node(ax, (x, y), a, r=19, size=11)
        arrow(ax, x + 24, y, x + 62, y, color=EDGE_GREY, lw=2.2, ms=12)
        node(ax, (x + 86, y), b, r=19, size=11)
        mono(ax, x + 150, y, str(w), size=14, color=MUTE, ha="center",
             weight="bold")
        y += 42
    save(fig, os.path.join(OUT, "floyd-warshall-graph.png"))


def floyd_warshall_matrix():
    fig, ax = canvas(400)
    fgraph(ax)
    matrix(ax, SNAPS[0][1])
    save(fig, os.path.join(OUT, "floyd-warshall-matrix.png"))


def floyd_warshall_steps():
    for c, d, ch in SNAPS[1:4]:
        fig, ax = canvas(400)
        fgraph(ax, hot={c: AMBER})
        matrix(ax, d, c=c, changes=ch)
        mono(ax, MX, MY - 58, "c = %d" % c, size=13, color=AMBER,
             ha="left", weight="bold")
        save(fig, os.path.join(OUT, "floyd-warshall-c%d.png" % c))


if __name__ == "__main__":
    assert not SNAPS[4][2], "vertex 3 was supposed to change nothing"
    bellman_ford_graph()
    bellman_ford_negative_cycle()
    floyd_warshall_graph()
    floyd_warshall_matrix()
    floyd_warshall_steps()
    print("ok")
