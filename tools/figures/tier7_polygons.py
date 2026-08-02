"""Polygon illustrations: the convexity turn test, and the shoelace lacing.

Same low-text brief as tier6_lines.py - colour and repetition carry the meaning,
so neither image needs a caption line.
"""
import os
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))

TICK = "✓"
CROSS = "✗"

SQUARE = [(0, 0), (4, 0), (4, 4), (0, 4)]
ARROW = [(0, 0), (4, 0), (4, 4), (2, 1), (0, 4)]
FLAT = [(0, 0), (2, 0), (4, 0), (4, 4), (0, 4)]


def orient(a, b, c):
    p = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    return "+" if p > 0 else "-" if p < 0 else "="


def turns(poly):
    """turn[j] = the turn taken at corner j, computed from its two neighbours."""
    n = len(poly)
    out = [None] * n
    for i in range(n):
        j, k = (i + 1) % n, (i + 2) % n
        out[j] = orient(poly[i], poly[j], poly[k])
    return out


def _inside(poly, p):
    """Even-odd test, used only to decide which way a label should hang."""
    c = False
    n = len(poly)
    for i in range(n):
        a, b = poly[i], poly[(i + 1) % n]
        if (a[1] > p[1]) != (b[1] > p[1]):
            xx = a[0] + (p[1] - a[1]) * (b[0] - a[0]) / (b[1] - a[1])
            if p[0] < xx:
                c = not c
    return c


def outward(poly, i, probe=9.0):
    """Unit direction that leaves the polygon at corner i.

    The angle bisector points into the polygon at a convex corner and out of it
    at a reflex one, so the direction is tested and flipped when it lands inside.
    A straight-through corner has no bisector at all and falls back to the
    perpendicular.
    """
    n = len(poly)
    p, a, b = poly[i], poly[(i - 1) % n], poly[(i + 1) % n]

    def unit(q):
        dx, dy = q[0] - p[0], q[1] - p[1]
        d = (dx * dx + dy * dy) ** 0.5 or 1.0
        return dx / d, dy / d

    ax_, ay_ = unit(a)
    bx_, by_ = unit(b)
    sx, sy = ax_ + bx_, ay_ + by_
    d = (sx * sx + sy * sy) ** 0.5
    if d < 1e-9:                       # three points in a row
        sx, sy = -ay_, ax_
        d = (sx * sx + sy * sy) ** 0.5 or 1.0

    dx, dy = -sx / d, -sy / d
    if _inside(poly, (p[0] + dx * probe, p[1] + dy * probe)):
        dx, dy = -dx, -dy
    return dx, dy


# ------------------------------------------------- 1. every turn the same way
def polygon_turn_signs():
    h = 344
    fig, ax = canvas(h)
    title(ax, "Convex  -  every turn goes the same way")

    unit = 30
    oy = 228
    COL = {"+": BLUE, "-": CORAL, "=": MUTE}

    for cx, poly in [(140, SQUARE), (392, ARROW), (644, FLAT)]:

        ox = cx - 2 * unit                       # centres the -1..5 range on cx
        pt = lambda gx, gy: (ox + gx * unit, oy - gy * unit)
        grid(ax, ox=ox, oy=oy, unit=unit, xr=(-1, 5), yr=(-1, 5), ticks=False)

        tn = turns(poly)
        good = len(set(t for t in tn if t != "=")) == 1
        px = [pt(*g) for g in poly]

        ax.add_patch(Polygon(px, closed=True, facecolor=GREEN if good else CORAL,
                             edgecolor="none", alpha=0.12, zorder=1))

        # the walk, with an arrowhead in the middle of every edge
        for i in range(len(px)):
            a, b = px[i], px[(i + 1) % len(px)]
            ax.plot([a[0], b[0]], [a[1], b[1]], color=INK2, lw=2.0, zorder=4,
                    solid_capstyle="round")
            mid = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
            arrow(ax, (a[0] + mid[0]) / 2, (a[1] + mid[1]) / 2, mid[0], mid[1],
                  color=INK2, lw=0, ms=11, z=5)

        # one sign per corner, hung on the outside of the shape
        for i, (p, t) in enumerate(zip(px, tn)):
            dx, dy = outward(px, i)
            lx, ly = p[0] + dx * 25, p[1] + dy * 25
            dot(ax, p, COL[t], r=4.5)
            rbox(ax, lx - 11, ly - 10, 22, 20, face=WHITE, edge=COL[t], lw=1.8, r=6, z=7)
            ax.text(lx, ly, t, ha="center", va="center", fontsize=12,
                    color=COL[t], fontweight="bold", zorder=8)

        ax.text(cx, 306, TICK if good else CROSS, ha="center", va="center",
                fontsize=25, color=GREEN if good else CORAL, fontweight="bold",
                zorder=8)

    save(fig, os.path.join(OUT, "polygon-turn-signs.png"))


# ------------------------------------------------- 2. where the name comes from
def shoelace_lacing():
    h = 382
    fig, ax = canvas(h)
    title(ax, "The shoelace formula  -  the crossings are the laces")

    poly = [(0, 0), (4, 0), (4, 3), (1, 3)]
    xs = [p[0] for p in poly] + [poly[0][0]]
    ys = [p[1] for p in poly] + [poly[0][1]]

    cols = [170 + 112 * i for i in range(5)]
    ry, rx = 212, 118                       # y row and x row, in pixels
    anchor_top, anchor_bot = rx + 20, ry - 20

    # the laces: down-right products are added, up-right products are subtracted
    for i in range(4):
        arrow(ax, cols[i], anchor_top, cols[i + 1], anchor_bot, color=BLUE,
              lw=2.0, ms=11, z=3)
        arrow(ax, cols[i], anchor_bot, cols[i + 1], anchor_top, color=CORAL,
              lw=2.0, ms=11, z=3)

    mono(ax, 108, rx, "x", size=15, color=MUTE, ha="center", weight="bold")
    mono(ax, 108, ry, "y", size=15, color=MUTE, ha="center", weight="bold")

    rbox(ax, cols[4] - 26, rx - 26, 52, ry - rx + 52, face=WHITE, edge=GREY,
         lw=1.6, r=8, z=1)

    for i in range(5):
        col = MUTE if i == 4 else INK
        for val, yy in ((xs[i], rx), (ys[i], ry)):
            ax.text(cols[i], yy, str(val), ha="center", va="center", fontsize=19,
                    color=col, fontweight="bold", zorder=6, family="DejaVu Sans Mono",
                    bbox=dict(boxstyle="round,pad=0.30", facecolor=WHITE,
                              edgecolor="none"))
    mono(ax, cols[4], ry + 34, "= 1st", size=9, color=MUTE, ha="center")

    plus = [xs[i] * ys[i + 1] for i in range(4)]
    minus = [ys[i] * xs[i + 1] for i in range(4)]

    mono(ax, 296, 292, " + ".join(str(a) for a in plus) + "  =  %d" % sum(plus),
         size=12, color=BLUE, ha="center", weight="bold")
    mono(ax, 580, 292, " + ".join(str(a) for a in minus) + "  =  %d" % sum(minus),
         size=12, color=CORAL, ha="center", weight="bold")

    tot = sum(plus) - sum(minus)
    rbox(ax, 176, 322, 300, 44, face=LAV, edge=PURPLE, lw=1.8, r=10, z=1)
    mono(ax, 326, 344, "%d - %d = %d" % (sum(plus), sum(minus), tot), size=14,
         color=PURPLE, ha="center", weight="bold")
    mono(ax, 502, 344, "/ 2  =", size=12, color=MUTE, ha="left")
    mono(ax, 578, 344, "%g" % (tot / 2), size=15, color=INK, ha="left", weight="bold")

    save(fig, os.path.join(OUT, "shoelace-lacing.png"))


if __name__ == "__main__":
    polygon_turn_signs()
    shoelace_lacing()
    print("ok")
