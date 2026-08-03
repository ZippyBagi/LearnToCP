"""Angles and Convex Hull illustrations.

Same low-text brief as tier6/tier7 - the pictures carry the argument, the lesson
text stays short. Every figure reuses the numbers its lesson already uses.
"""
import os
from math import atan2, degrees, cos, sin, radians
from matplotlib.patches import Arc
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))

TICK = "✓"
CROSS = "✗"

# the seven points from GrahamScan.cpp
PTS = [(0, 0), (4, 0), (4, 4), (0, 4), (2, 2), (2, 0), (1, 3)]
PIVOT = (0, 0)
SORTED = [(2, 0), (4, 0), (2, 2), (4, 4), (1, 3), (0, 4)]   # angle, then distance
HULL = [(0, 0), (4, 0), (4, 4), (0, 4)]


def arc(ax, c, r, g1, g2, color=PURPLE, lw=2.0, z=6):
    """Arc sweeping from grid angle g1 to g2. The canvas y axis points down, so
    a grid angle g sits at axes angle -g - hence the swap and the minus signs."""
    ax.add_patch(Arc(c, 2 * r, 2 * r, angle=0, theta1=-g2, theta2=-g1,
                     color=color, lw=lw, zorder=z))


def orient(a, b, c):
    p = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    return "+" if p > 0 else "-" if p < 0 else "="


def outward(poly, i, d=22):
    """Offset direction for a label on a convex polygon: away from the centroid."""
    cx = sum(p[0] for p in poly) / len(poly)
    cy = sum(p[1] for p in poly) / len(poly)
    dx, dy = poly[i][0] - cx, poly[i][1] - cy
    n = max(1e-6, (dx * dx + dy * dy) ** 0.5)
    return dx / n * d, dy / n * d


# ------------------------------------------- 1. atan2 reads one point's angle
def atan2_two_legs():
    h = 366
    fig, ax = canvas(h)
    title(ax, "atan2  -  the two products are the two legs")

    # --- left: the two vectors and the angle between them
    unit = 46
    ox, oy = 96, 296
    pt = grid(ax, ox=ox, oy=oy, unit=unit, xr=(-1, 4), yr=(-1, 4), ticks=False)

    a, b = (3, 0), (3, 3)
    vec(ax, pt(0, 0), pt(*a), color=BLUE, lw=2.6, ms=15, text="a", off=(-4, 18), size=11)
    vec(ax, pt(0, 0), pt(*b), color=GREEN, lw=2.6, ms=15, text="b", off=(16, 4), size=11)
    arc(ax, pt(0, 0), 62, 0, 45)
    ax.text(*pt(1.55, 0.55), "θ", ha="center", va="center", fontsize=14,
            color=PURPLE, fontweight="bold", zorder=8)

    arrow(ax, 336, 190, 396, 190, color=MUTE, lw=2.0, ms=13)

    # --- right: the point (dot, cross) and the same angle
    d = a[0] * b[0] + a[1] * b[1]      # 9
    c = a[0] * b[1] - a[1] * b[0]      # 9
    u = 20
    bx, by = 470, 296
    P = (bx + d * u, by - c * u)

    ax.plot([bx - 14, bx + 11 * u], [by, by], color=AXIS, lw=1.6, zorder=1)
    ax.plot([bx, bx], [by + 14, by - 11 * u], color=AXIS, lw=1.6, zorder=1)
    mono(ax, bx + 11 * u + 6, by, "dot", size=10.5, color=BLUE, ha="left", weight="bold")
    mono(ax, bx, by - 11 * u - 14, "cross", size=10.5, color=CORAL, ha="center", weight="bold")

    # right by the dot product, then up by the cross product
    ax.plot([bx, P[0]], [by, by], color=BLUE, lw=3.0, zorder=4, solid_capstyle="round")
    ax.plot([P[0], P[0]], [by, P[1]], color=CORAL, lw=3.0, zorder=4, solid_capstyle="round")
    ax.plot([bx, P[0]], [by, P[1]], color=PURPLE, lw=1.6, ls="--", zorder=3)

    mono(ax, (bx + P[0]) / 2, by + 16, "9", size=11, color=BLUE, ha="center", weight="bold")
    mono(ax, P[0] + 14, (by + P[1]) / 2, "9", size=11, color=CORAL, ha="center", weight="bold")

    dot(ax, P, PURPLE, r=6.5)
    arc(ax, (bx, by), 60, 0, 45)
    mono(ax, bx + 74, by - 26, "θ = 45°", size=11, color=PURPLE, ha="left", weight="bold")

    save(fig, os.path.join(OUT, "atan2-two-legs.png"))


# ------------------------------------------- 2. the rubber band and the nails
def hull_rubber_band():
    h = 380
    fig, ax = canvas(h)
    title(ax, "The convex hull  -  what the band actually touches")

    unit = 46
    ox, oy = 116, 310
    pt = grid(ax, ox=ox, oy=oy, unit=unit, xr=(-1, 5), yr=(-1, 5), ticks=False)

    # the band, drawn a little outside the hull so it reads as elastic on nails
    band = []
    for i in range(len(HULL)):
        dx, dy = outward(HULL, i, d=11)
        p = pt(*HULL[i])
        band.append((p[0] + dx, p[1] - dy))
    ax.add_patch(Polygon(band, closed=True, facecolor=GREEN, edgecolor="none",
                         alpha=0.10, zorder=0))
    ax.add_patch(Polygon(band, closed=True, facecolor="none", edgecolor=GREEN,
                         lw=4.0, zorder=4, joinstyle="round"))

    def nail(p, touched, r=7.5):
        ax.add_patch(Circle(p, r, facecolor=WHITE,
                            edgecolor=INK2 if touched else MUTE, lw=2.2, zorder=7))
        ax.add_patch(Circle(p, r * 0.4, facecolor=INK2 if touched else MUTE,
                            edgecolor="none", zorder=8))

    skipped = [((2, 2), "inside"), ((1, 3), "inside"), ((2, 0), "on a straight side")]

    for g in PTS:
        nail(pt(*g), g in HULL)
    for g, why in skipped:
        p = pt(*g)
        ax.text(p[0] + 14, p[1] - 14, CROSS, ha="center", va="center", fontsize=14,
                color=CORAL, fontweight="bold", zorder=9)

    # who the band misses, and why
    kx = 470
    mono(ax, kx, 132, "the band skips", size=11, color=MUTE, ha="left", weight="bold")
    for i, (g, why) in enumerate(skipped):
        y = 178 + i * 42
        nail((kx + 9, y), False, r=7)
        ax.text(kx + 34, y, CROSS, ha="center", va="center", fontsize=13,
                color=CORAL, fontweight="bold", zorder=9)
        mono(ax, kx + 56, y, "(%d, %d)" % g, size=11, color=INK2, ha="left", weight="bold")
        label(ax, kx + 128, y, why, size=9.5, color=MUTE, ha="left")

    save(fig, os.path.join(OUT, "hull-rubber-band.png"))


# ------------------------------------------- 3. the three steps of the scan
def graham_scan_steps():
    h = 330
    fig, ax = canvas(h)
    title(ax, "Graham scan  -  pivot, sort, walk")

    unit = 30
    oy = 268

    def panel(cx, n):
        ox = cx - 2 * unit
        rbox(ax, cx - 13, 66, 26, 24, face=LAV, edge=PURPLE, lw=1.6, r=8, z=6)
        ax.text(cx, 78, str(n), ha="center", va="center", fontsize=12,
                color=PURPLE, fontweight="bold", zorder=8)
        grid(ax, ox=ox, oy=oy, unit=unit, xr=(-1, 5), yr=(-1, 5), ticks=False)
        return lambda gx, gy: (ox + gx * unit, oy - gy * unit)

    # --- 1: the pivot
    pt = panel(140, 1)
    for g in PTS:
        dot(ax, pt(*g), MUTE if g != PIVOT else AMBER, r=5.5)
    ax.plot([pt(-1, 0)[0], pt(5, 0)[0]], [pt(-1, 0)[1], pt(5, 0)[1]],
            color=AMBER, lw=1.6, ls="--", zorder=3)
    mono(ax, pt(0, 0)[0] - 4, pt(0, 0)[1] + 18, "pivot", size=8.5, color=AMBER,
         ha="center", weight="bold")

    # --- 2: sorted by angle around the pivot
    pt = panel(392, 2)
    for g in SORTED:
        ax.plot([pt(0, 0)[0], pt(*g)[0]], [pt(0, 0)[1], pt(*g)[1]],
                color=BLUE, lw=1.0, alpha=0.45, zorder=2)
    dot(ax, pt(*PIVOT), AMBER, r=5.5)
    for i, g in enumerate(SORTED):
        p = pt(*g)
        dot(ax, p, BLUE, r=5.5)
        ax.text(p[0] + 12, p[1] - 11, str(i + 1), ha="center", va="center",
                fontsize=9.5, color=BLUE, fontweight="bold", zorder=9,
                bbox=dict(boxstyle="round,pad=0.16", facecolor=WHITE, edgecolor="none"))

    # --- 3: what survives
    pt = panel(644, 3)
    poly = [pt(*g) for g in HULL]
    ax.add_patch(Polygon(poly, closed=True, facecolor=GREEN, edgecolor="none",
                         alpha=0.14, zorder=1))
    ax.add_patch(Polygon(poly, closed=True, facecolor="none", edgecolor=GREEN,
                         lw=2.8, zorder=4, joinstyle="round"))
    for g in PTS:
        if g in HULL:
            dot(ax, pt(*g), GREEN, r=6)
        else:
            p = pt(*g)
            dot(ax, p, MUTE, r=5)
            ax.text(p[0] + 12, p[1] - 12, CROSS, ha="center", va="center",
                    fontsize=11, color=CORAL, fontweight="bold", zorder=9)

    save(fig, os.path.join(OUT, "graham-scan-steps.png"))


# ------------------------------------------- 4. why the middle point is popped
def graham_pop():
    h = 400
    fig, ax = canvas(h)
    title(ax, "Popping  -  the dent was never a corner")

    unit = 40
    oy = 316
    O, A, B, C = (0, 0), (4, 1), (3, 2), (2, 5)

    def panel(cx):
        ox = cx - 2 * unit
        grid(ax, ox=ox, oy=oy, unit=unit, xr=(-1, 6), yr=(-1, 6), ticks=False)
        return lambda gx, gy: (ox + gx * unit, oy - gy * unit)

    def name(p, text, off, color=INK2):
        ax.text(p[0] + off[0], p[1] + off[1], text, ha="center", va="center",
                fontsize=9.5, color=color, fontweight="bold", zorder=9,
                family="DejaVu Sans Mono",
                bbox=dict(boxstyle="round,pad=0.18", facecolor=WHITE, edgecolor="none"))

    # --- left: the chain so far, and C arriving
    pt = panel(200)
    for a, b in [(O, A), (A, B)]:
        ax.plot([pt(*a)[0], pt(*b)[0]], [pt(*a)[1], pt(*b)[1]], color=INK2, lw=2.6,
                zorder=4, solid_capstyle="round")
    ax.plot([pt(*B)[0], pt(*C)[0]], [pt(*B)[1], pt(*C)[1]], color=MUTE, lw=1.8,
            ls="--", zorder=3)
    for p, col in [(O, AMBER), (A, INK2), (C, MUTE)]:
        dot(ax, pt(*p), col, r=6)
    dot(ax, pt(*B), CORAL, r=6.5)

    rbox(ax, pt(*B)[0] + 12, pt(*B)[1] - 13, 24, 22, face=WHITE, edge=CORAL, lw=1.9, r=7, z=7)
    ax.text(pt(*B)[0] + 24, pt(*B)[1] - 2, orient(A, B, C), ha="center", va="center",
            fontsize=13, color=CORAL, fontweight="bold", zorder=9)

    name(pt(*O), "pivot", (-2, 20), AMBER)
    name(pt(*A), "A", (20, 8))
    name(pt(*B), "B", (-18, -6), CORAL)
    name(pt(*C), "C", (-18, 0), MUTE)

    # --- right: B is inside the triangle, the band goes over it
    pt = panel(584)
    tri = [pt(*O), pt(*A), pt(*C)]
    ax.add_patch(Polygon(tri, closed=True, facecolor=AMBER, edgecolor="none",
                         alpha=0.18, zorder=1))
    ax.add_patch(Polygon(tri, closed=True, facecolor="none", edgecolor=GREEN,
                         lw=3.4, zorder=4, joinstyle="round"))
    for p in (O, A, C):
        dot(ax, pt(*p), GREEN, r=6)
    dot(ax, pt(*B), GREY, r=6)
    ax.text(pt(*B)[0] + 13, pt(*B)[1] - 12, CROSS, ha="center", va="center",
            fontsize=14, color=CORAL, fontweight="bold", zorder=9)

    name(pt(*O), "pivot", (-2, 20), AMBER)
    name(pt(*A), "A", (20, 8))
    name(pt(*B), "B", (-18, -6), MUTE)
    name(pt(*C), "C", (-18, 0))

    save(fig, os.path.join(OUT, "graham-pop.png"))


if __name__ == "__main__":
    atan2_two_legs()
    hull_rubber_band()
    graham_scan_steps()
    graham_pop()
    print("ok")
