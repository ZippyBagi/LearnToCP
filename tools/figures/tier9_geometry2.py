"""Geometry II illustrations: segment intersection, point in polygon,
distances and intersection points, circles.

Follows the low-text approach of tier6_lines.py - shading, repetition and
tick/cross glyphs carry the meaning instead of caption sentences.

Two layout rules this batch had to learn the hard way (see the guide, §7):

* A row of panels only works if the grid range actually fits the panel pitch.
  `xr=(-3, 6)` at unit 32 is 288 px inside a 252 px column, so panel 2's point
  lands on top of panel 3's axis. Every panel below declares its own range.
* The circle constructions draw no coordinate grid at all. They are about a
  right triangle, not about where anything sits, and the tick numbers were
  colliding with the very labels the figure exists for.
"""
import os
import math
from style import *
from matplotlib.patches import Circle as MplCircle, Polygon as MplPolygon

OUT = os.path.dirname(os.path.abspath(__file__))

TICK = "✓"
CROSS = "✗"


def verdict(ax, x, y, ok, size=15):
    ax.text(x, y, TICK if ok else CROSS, ha="center", va="center",
            fontsize=size, color=GREEN if ok else CORAL, fontweight="bold",
            zorder=9)


def panel_grid(ax, ox, oy, unit, xr, yr):
    """A small grid with no tick numbers - the panels are too narrow for them."""
    return grid(ax, ox=ox, oy=oy, unit=unit, xr=xr, yr=yr, ticks=False)


def dashed(ax, p0, p1, color=PURPLE, lw=1.3, alpha=0.55, z=3):
    ax.plot([p0[0], p1[0]], [p0[1], p1[1]], color=color, lw=lw, ls="--",
            alpha=alpha, zorder=z)


def seg(ax, p0, p1, color, lw=2.8, z=5):
    ax.plot([p0[0], p1[0]], [p0[1], p1[1]], color=color, lw=lw, zorder=z,
            solid_capstyle="round")


def hollow(ax, p, color, r=5.5, lw=2.2, z=9):
    ax.add_patch(MplCircle(p, r, facecolor=WHITE, edgecolor=color, lw=lw,
                           zorder=z))


def boxed(ax, p, text, color, size=10.5, off=(0, 0)):
    ax.text(p[0] + off[0], p[1] + off[1], text, ha="center", va="center",
            fontsize=size, color=color, fontweight="bold", zorder=10,
            family="DejaVu Sans Mono",
            bbox=dict(boxstyle="round,pad=0.18", facecolor=WHITE,
                      edgecolor="none"))


def sign_chip(ax, x, y, ch, color, w=30, h=28):
    rbox(ax, x - w / 2, y - h / 2, w, h, face=WHITE, edge=color, lw=1.8, r=7)
    ax.text(x, y, ch, ha="center", va="center", fontsize=13, color=color,
            fontweight="bold", zorder=8)


def cross2(a, b, c):
    """Sign of the orientation of c against the line ab, in grid units."""
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])


def clip_line(p0, p1, xr, yr):
    """The infinite line through p0/p1, clipped to the grid box (Liang-Barsky).

    Without this an extended line runs the full width of the canvas and cuts
    straight through the neighbouring panel - which is exactly what the first
    version of this figure did.
    """
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    t0, t1 = -1e9, 1e9
    for p, q in ((-dx, p0[0] - xr[0]), (dx, xr[1] - p0[0]),
                 (-dy, p0[1] - yr[0]), (dy, yr[1] - p0[1])):
        if p == 0:
            if q < 0:
                return None
            continue
        r = q / p
        if p < 0:
            t0 = max(t0, r)
        else:
            t1 = min(t1, r)
    if t0 > t1:
        return None
    return ((p0[0] + t0 * dx, p0[1] + t0 * dy),
            (p0[0] + t1 * dx, p0[1] + t1 * dy))


# ============================================================ 1. straddling
def straddle_both_ways():
    """Two situations, each run through both straddle checks.

    The image exists for the right-hand column: one check passes, the other
    does not, and the verdict is still no.
    """
    h = 500
    fig, ax = canvas(h)
    title(ax, "Both segments must straddle  -  one check is never enough")

    unit = 26
    gtop = 86

    cols = [(200, ((0, 0), (4, 4)), ((0, 4), (4, 0)), "they cross"),
            (584, ((0, 0), (2, 2)), ((0, 6), (6, 0)), "they miss")]

    for cx, AB, CD, heading in cols:
        ox = cx - 3 * unit
        oy = gtop + 7 * unit
        gp = panel_grid(ax, ox, oy, unit, (-1, 7), (-1, 7))

        a, b = gp(*AB[0]), gp(*AB[1])
        c, d = gp(*CD[0]), gp(*CD[1])

        # both lines extended, clipped to this panel's grid box
        for (p0, p1, col) in ((AB[0], AB[1], PURPLE), (CD[0], CD[1], GREEN)):
            cl = clip_line(p0, p1, (-1, 7), (-1, 7))
            if cl:
                dashed(ax, gp(*cl[0]), gp(*cl[1]), color=col, alpha=0.45)

        seg(ax, a, b, PURPLE, lw=3.2)
        seg(ax, c, d, GREEN, lw=3.2)
        for q, col in ((a, PURPLE), (b, PURPLE), (c, GREEN), (d, GREEN)):
            dot(ax, q, col, r=5)

        boxed(ax, a, "A", PURPLE, size=9.5, off=(-15, 14))
        boxed(ax, b, "B", PURPLE, size=9.5, off=(15, -14))
        boxed(ax, c, "C", GREEN, size=9.5, off=(-15, -14))
        boxed(ax, d, "D", GREEN, size=9.5, off=(15, 14))

        label(ax, cx, 66, heading, size=11, color=INK, ha="center",
              weight="bold")

        # the two checks, as rows of sign chips
        checks = [("C, D against line AB", PURPLE,
                   cross2(AB[0], AB[1], CD[0]), cross2(AB[0], AB[1], CD[1])),
                  ("A, B against line CD", GREEN,
                   cross2(CD[0], CD[1], AB[0]), cross2(CD[0], CD[1], AB[1]))]

        both = True
        for i, (text, col, s1, s2) in enumerate(checks):
            y = 342 + i * 46
            ok = (s1 > 0) != (s2 > 0)
            both = both and ok
            label(ax, cx - 152, y, text, size=9.5, color=col, ha="left")
            for j, s in enumerate((s1, s2)):
                sign_chip(ax, cx + 60 + j * 38, y, "+" if s > 0 else "−",
                          BLUE if s > 0 else CORAL)
            verdict(ax, cx + 146, y, ok)

        ax.text(cx, 466, ("they share a point  " + TICK) if both
                else ("no common point  " + CROSS),
                ha="center", va="center", fontsize=10.5,
                color=GREEN if both else CORAL, fontweight="bold", zorder=8)

    ax.plot([392, 392], [58, 484], color=GRIDL, lw=1.6, zorder=0)
    save(fig, os.path.join(OUT, "straddle-both-ways.png"))


# ==================================================== 2. the collinear blind spot
def collinear_overlap():
    """Two collinear arrangements the four orientations cannot tell apart."""
    h = 400
    fig, ax = canvas(h)
    title(ax, "All four points on one line  -  the orientations go blind")

    unit = 21
    gtop = 66
    off = 5.0   # perpendicular offset in px, so both segments stay visible

    panels = [(200, ((0, 0), (4, 4)), ((2, 2), (6, 6)), True,
               "they share a whole stretch"),
              (584, ((0, 0), (4, 4)), ((6, 6), (9, 9)), False,
               "they never touch")]

    for cx, AB, CD, overlaps, text in panels:
        ox = cx - 4.5 * unit
        oy = gtop + 10 * unit
        gp = panel_grid(ax, ox, oy, unit, (-1, 10), (-1, 10))

        dashed(ax, gp(-1, -1), gp(10, 10), color=MUTE, alpha=0.5)

        a, b = gp(*AB[0]), gp(*AB[1])
        c, d = gp(*CD[0]), gp(*CD[1])

        if overlaps:
            s, e = gp(2, 2), gp(4, 4)
            ax.plot([s[0], e[0]], [s[1], e[1]], color=AMBER, lw=17, alpha=0.55,
                    zorder=3, solid_capstyle="round")

        seg(ax, (a[0] - off, a[1] - off), (b[0] - off, b[1] - off), PURPLE)
        seg(ax, (c[0] + off, c[1] + off), (d[0] + off, d[1] + off), GREEN)

        boxed(ax, a, "A", PURPLE, size=9.5, off=(-16, 10))
        boxed(ax, b, "B", PURPLE, size=9.5, off=(-16, 10))
        boxed(ax, c, "C", GREEN, size=9.5, off=(18, -10))
        boxed(ax, d, "D", GREEN, size=9.5, off=(18, -10))

        mono(ax, cx, 320, "abc = abd = cda = cdb = '='", size=10, color=MUTE,
             ha="center")
        ax.text(cx, 352, text, ha="center", va="center", fontsize=10.5,
                color=GREEN if overlaps else CORAL, fontweight="bold",
                zorder=8)

    ax.plot([392, 392], [58, 336], color=GRIDL, lw=1.6, zorder=0)
    ax.text(W / 2, 382, "same four signs, opposite answers  -  this is the one "
            "case the straddle test cannot see", ha="center", va="center",
            fontsize=9.5, color=MUTE, zorder=8)
    save(fig, os.path.join(OUT, "collinear-overlap.png"))


# ================================================== 3. ray casting parity
ARROW = [(0, 0), (4, 0), (4, 4), (2, 1), (0, 4)]


def _poly_edges(poly):
    return [(poly[i], poly[(i + 1) % len(poly)]) for i in range(len(poly))]


def _crossings_right(poly, t):
    """Every crossing of the rightward ray from t, in grid coordinates."""
    hits = []
    for a, b in _poly_edges(poly):
        if (a[1] > t[1]) == (b[1] > t[1]):
            continue
        x = a[0] + (t[1] - a[1]) * (b[0] - a[0]) / (b[1] - a[1])
        if x > t[0]:
            hits.append((x, t[1]))
    return sorted(hits)


def ray_casting_parity():
    h = 440
    fig, ax = canvas(h)
    title(ax, "Count the crossings  -  odd is inside, even is outside")

    unit = 56
    ox, oy = 140, 350
    pt = grid(ax, ox=ox, oy=oy, unit=unit, xr=(0, 7), yr=(0, 5))

    ax.add_patch(MplPolygon([pt(*p) for p in ARROW], closed=True,
                            facecolor=BLUE, edgecolor=PURPLE, lw=2.4,
                            alpha=0.16, zorder=2))
    ax.add_patch(MplPolygon([pt(*p) for p in ARROW], closed=True,
                            facecolor="none", edgecolor=PURPLE, lw=2.4,
                            zorder=4))
    for p in ARROW:
        dot(ax, pt(*p), PURPLE, r=4.5)

    for g, col in (((1, 2), GREEN), ((2, 3), CORAL), ((5, 1), CORAL)):
        p = pt(*g)
        hits = _crossings_right(ARROW, g)
        end = pt(7, g[1])
        arrow(ax, p[0], p[1], end[0] + 4, end[1], color=col, lw=1.8, ms=11,
              z=6)
        dot(ax, p, col, r=6)
        for hx, hy in hits:
            hollow(ax, pt(hx, hy), col, r=5.0, lw=2.0)
        ax.text(end[0] + 26, end[1], str(len(hits)), ha="left", va="center",
                fontsize=13, color=col, fontweight="bold", zorder=9,
                family="DejaVu Sans Mono")

    kx = 570
    label(ax, kx, 122, "crossings", size=10, color=MUTE, ha="left")
    for i, (n, word, col) in enumerate([("3", "inside", GREEN),
                                        ("2", "outside", CORAL),
                                        ("0", "outside", CORAL)]):
        y = 162 + i * 46
        mono(ax, kx + 6, y, n, size=13, color=col, ha="left", weight="bold")
        arrow(ax, kx + 30, y, kx + 62, y, color=MUTE, lw=1.3, ms=8)
        label(ax, kx + 72, y, word, size=11, color=col, weight="bold")

    ax.text(W / 2, 418, "the notch is open at the top, so the ray escapes "
            "straight through it", ha="center", va="center", fontsize=9.5,
            color=MUTE, zorder=8)
    save(fig, os.path.join(OUT, "ray-casting-parity.png"))


# ============================================== 4. when an edge counts
def ray_crossing_test():
    h = 330
    fig, ax = canvas(h)
    title(ax, "An edge counts only when it reaches across  -  and lies ahead")

    unit = 30
    oy = 240
    T = (3, 2)

    panels = [(140, ((1, 3), (5, 5)), "both ends above", False),
              (392, ((0, 0), (2, 5)), "behind the ray", False),
              (644, ((4, 0), (5, 5)), "reaches across, ahead", True)]

    for cx, edge, text, counts in panels:
        ox = cx - 2.5 * unit
        gp = panel_grid(ax, ox, oy, unit, (-1, 6), (-1, 6))

        tp = gp(*T)
        arrow(ax, tp[0], tp[1], gp(6, T[1])[0] + 4, tp[1],
              color=GREEN if counts else MUTE, lw=1.7, ms=10, z=5)

        a, b = gp(*edge[0]), gp(*edge[1])
        ecol = GREEN if counts else GREY
        seg(ax, a, b, ecol, lw=3.2)
        dot(ax, a, GREEN if counts else MUTE, r=4.5)
        dot(ax, b, GREEN if counts else MUTE, r=4.5)

        # mark where the edge meets T's height, when it does reach across
        if edge[0][1] != edge[1][1] and \
           (edge[0][1] > T[1]) != (edge[1][1] > T[1]):
            x = edge[0][0] + (T[1] - edge[0][1]) * (edge[1][0] - edge[0][0]) \
                / (edge[1][1] - edge[0][1])
            hollow(ax, gp(x, T[1]), GREEN if counts else MUTE, r=5.5, lw=2.2)

        dot(ax, tp, PURPLE, r=6)
        mono(ax, tp[0] - 4, tp[1] + 18, "T", size=10, color=PURPLE,
             ha="center", weight="bold")

        verdict(ax, cx, 64, counts)
        ax.text(cx, 306, text, ha="center", va="center", fontsize=9.5,
                color=INK2 if counts else MUTE, fontweight="bold", zorder=8)

    for x in (266, 518):
        ax.plot([x, x], [52, 316], color=GRIDL, lw=1.6, zorder=0)
    save(fig, os.path.join(OUT, "ray-crossing-test.png"))


# ============================================== 5. the corner rule
def ray_corner_rule():
    """`>` on both sides, so a corner is counted once or an even number of times.

    Both outcomes are correct: one crossing means the border really was passed,
    zero or two means the ray only grazed a corner and the parity is unchanged.
    """
    h = 360
    fig, ax = canvas(h)
    title(ax, "Strictly above on both sides  -  a grazed corner never breaks the parity")

    unit = 27
    oy = 250
    corner = (3, 2)
    T = (0, 2)

    # (centre, the two neighbours of the corner, caption)
    panels = [(140, ((0, 0), (1, 5)), "one up, one down"),
              (392, ((0, 0), (1, 0)), "both go down"),
              (644, ((0, 5), (1, 5)), "both go up")]

    for cx, (p_prev, p_next), text in panels:
        ox = cx - 2.5 * unit
        gp = panel_grid(ax, ox, oy, unit, (-1, 6), (-1, 6))

        tp = gp(*T)
        arrow(ax, tp[0], tp[1], gp(6, 2)[0] + 4, tp[1], color=MUTE, lw=1.7,
              ms=10, z=3)
        dot(ax, tp, PURPLE, r=5.5)
        mono(ax, tp[0] - 2, tp[1] + 18, "T", size=9.5, color=PURPLE,
             ha="center", weight="bold")

        cp = gp(*corner)
        counted = 0
        for other in (p_prev, p_next):
            op = gp(*other)
            up = other[1] > corner[1]   # (corner.y > T.y) is false, T is level
            counted += 1 if up else 0
            seg(ax, cp, op, GREEN if up else GREY, lw=3.2)
            dot(ax, op, GREEN if up else MUTE, r=4.5)

        ax.add_patch(MplCircle(cp, 6.5, facecolor=AMBER, edgecolor=WHITE,
                               lw=1.6, zorder=10))

        ax.text(cx, 304, text, ha="center", va="center", fontsize=9.5,
                color=MUTE, zorder=8)
        ax.text(cx, 330, "counted: " + str(counted), ha="center", va="center",
                fontsize=11, fontweight="bold", zorder=8,
                family="DejaVu Sans Mono",
                color=GREEN if counted == 1 else INK2)

    for x in (266, 518):
        ax.plot([x, x], [78, 336], color=GRIDL, lw=1.6, zorder=0)
    label(ax, W / 2, 62, "green edges have their far end strictly above the ray",
          size=9.5, color=MUTE, ha="center")
    ax.text(W / 2, 352, "one crossing means the border was really passed  -  "
            "zero or two leave the parity alone", ha="center", va="center",
            fontsize=9.5, color=MUTE, zorder=8)
    save(fig, os.path.join(OUT, "ray-corner-rule.png"))


# ============================================== 6. the projection / shadow
def projection_shadow():
    h = 380
    fig, ax = canvas(h)
    title(ax, "The dot product is a shadow  -  and its sign says which way it falls")

    unit = 26
    oy = 268

    # (centre, tip of w, grid range, caption, colour, sign)
    panels = [(140, (4, 3), (-1, 5), "forwards", BLUE, "> 0"),
              (392, (-2, 3), (-3, 3), "backwards", CORAL, "< 0"),
              (644, (0, 3), (-1, 5), "no shadow", PURPLE, "= 0")]

    for cx, wtip, xr, word, col, sign in panels:
        ox = cx - (xr[0] + xr[1]) / 2 * unit
        gp = panel_grid(ax, ox, oy, unit, xr, (-1, 4))

        o = gp(0, 0)

        # the shadow bar first, so the u arrow stays readable on top of it
        sp = gp(wtip[0], 0)
        if wtip[0] != 0:
            ax.plot([o[0], sp[0]], [o[1], sp[1]], color=col, lw=9, alpha=0.35,
                    zorder=3, solid_capstyle="butt")

        vec(ax, o, gp(xr[1], 0), color=MUTE, lw=2.2, ms=13)
        mono(ax, gp(xr[1], 0)[0] - 6, gp(xr[1], 0)[1] + 18, "u", size=10,
             color=MUTE, ha="center", weight="bold")

        wp = gp(*wtip)
        vec(ax, o, wp, color=col, lw=2.6, ms=14)
        mono(ax, wp[0] + 13, wp[1] - 8, "w", size=10, color=col, ha="center",
             weight="bold")

        if wtip[0] != 0:
            ax.plot([wp[0], sp[0]], [wp[1], sp[1]], color=col, lw=1.3, ls=":",
                    alpha=0.85, zorder=5)
        else:
            right_angle(ax, o, (1, 0), (0, -1), size=11, color=col, lw=1.6)

        ax.text(cx, 326, word, ha="center", va="center", fontsize=10.5,
                color=col, fontweight="bold", zorder=8)
        mono(ax, cx, 354, "u · w " + sign, size=10, color=MUTE, ha="center")

    for x in (266, 518):
        ax.plot([x, x], [52, 364], color=GRIDL, lw=1.6, zorder=0)
    save(fig, os.path.join(OUT, "projection-shadow.png"))


# ============================================== 7. point to line distance
def point_line_distance():
    h = 380
    fig, ax = canvas(h)
    title(ax, "One triangle, two ways to measure it  -  and the height falls out")

    unit = 54
    ox, oy = 120, 310
    pt = grid(ax, ox=ox, oy=oy, unit=unit, xr=(0, 6), yr=(0, 4))

    A, B, P = (0, 0), (4, 0), (1, 3)
    a, b, p = pt(*A), pt(*B), pt(*P)
    foot = pt(P[0], 0)

    ax.add_patch(MplPolygon([a, b, p], closed=True, facecolor=BLUE,
                            edgecolor="none", alpha=0.16, zorder=2))
    dashed(ax, pt(0, 0), pt(6, 0), color=PURPLE)
    seg(ax, a, b, PURPLE, lw=3.2)
    seg(ax, a, p, BLUE, lw=2.0)
    seg(ax, b, p, BLUE, lw=2.0)

    seg(ax, p, foot, GREEN, lw=3.0, z=6)
    right_angle(ax, foot, (1, 0), (0, -1), size=11, color=GREEN, lw=1.6)

    for q, name, col, off in ((a, "A", PURPLE, (-16, 16)),
                              (b, "B", PURPLE, (16, 16)),
                              (p, "P", BLUE, (0, -20))):
        dot(ax, q, col, r=5.5)
        boxed(ax, q, name, col, size=11, off=off)

    boxed(ax, ((p[0] + foot[0]) / 2 - 18, (p[1] + foot[1]) / 2), "d", GREEN,
          size=12)

    kx = 452
    label(ax, kx, 112, "the same area, twice", size=10.5, color=INK, ha="left",
          weight="bold")
    mono(ax, kx, 162, "|AB × AP| / 2", size=12, color=BLUE, ha="left")
    mono(ax, kx, 208, "|AB| · d  / 2", size=12, color=GREEN, ha="left")
    ax.plot([kx, kx + 216], [240, 240], color=MUTE, lw=1.3, zorder=5)

    mono(ax, kx, 292, "d  =", size=13, color=INK, ha="left", weight="bold")
    mono(ax, kx + 62, 274, "|AB × AP|", size=12, color=INK, ha="left")
    ax.plot([kx + 58, kx + 190], [290, 290], color=INK, lw=1.4, zorder=5)
    mono(ax, kx + 96, 308, "|AB|", size=12, color=INK, ha="left")

    save(fig, os.path.join(OUT, "point-line-distance.png"))


# ============================================== 8. distance to a segment
def segment_distance_three_cases():
    h = 340
    fig, ax = canvas(h)
    title(ax, "To a segment the perpendicular is only sometimes the answer")

    unit = 25
    oy = 240
    A, B = (0, 0), (4, 0)

    # (centre, P, grid range, target, caption, colour)
    panels = [(140, (1, 3), (-1, 5), (1, 0), "the perpendicular", GREEN),
              (392, (6, 3), (-1, 7), (4, 0), "the closest point is B", AMBER),
              (644, (-3, 4), (-4, 5), (0, 0), "the closest point is A", CORAL)]

    for cx, P, xr, target, text, col in panels:
        ox = cx - (xr[0] + xr[1]) / 2 * unit
        gp = panel_grid(ax, ox, oy, unit, xr, (-1, 5))

        a, b, p, t = gp(*A), gp(*B), gp(*P), gp(*target)

        dashed(ax, gp(xr[0], 0), gp(xr[1], 0), color=MUTE, alpha=0.45)
        seg(ax, a, b, PURPLE, lw=3.2)
        dot(ax, a, PURPLE, r=5)
        dot(ax, b, PURPLE, r=5)
        mono(ax, a[0] - 6, a[1] + 18, "A", size=9.5, color=PURPLE,
             ha="center", weight="bold")
        mono(ax, b[0] + 6, b[1] + 18, "B", size=9.5, color=PURPLE,
             ha="center", weight="bold")

        seg(ax, p, t, col, lw=2.8, z=7)
        if target == (1, 0):
            right_angle(ax, t, (1, 0), (0, -1), size=9, color=col, lw=1.5)
        else:
            hollow(ax, t, col, r=5.5, lw=2.2)

        dot(ax, p, col, r=6)
        mono(ax, p[0], p[1] - 18, "P", size=10, color=col, ha="center",
             weight="bold")

        ax.text(cx, 300, text, ha="center", va="center", fontsize=9.5,
                color=col, fontweight="bold", zorder=8)

    for x in (266, 518):
        ax.plot([x, x], [52, 310], color=GRIDL, lw=1.6, zorder=0)
    ax.text(W / 2, 326, "the sign of the dot product picks the case, with no "
            "division", ha="center", va="center", fontsize=9.5, color=MUTE,
            zorder=8)
    save(fig, os.path.join(OUT, "segment-distance-three-cases.png"))


# ============================================== 9. line vs circle, three cases
def line_circle_cases():
    h = 330
    fig, ax = canvas(h)
    title(ax, "One number decides it  -  the distance from the centre to the line")

    R = 58
    cy = 186
    panels = [(140, 88, "d > r", 0, CORAL),
              (392, 58, "d = r", 1, AMBER),
              (644, 28, "d < r", 2, GREEN)]

    for cx, d, text, n, col in panels:
        ax.add_patch(MplCircle((cx, cy), R, facecolor=BLUE, edgecolor=PURPLE,
                               lw=2.2, alpha=0.14, zorder=2))
        ax.add_patch(MplCircle((cx, cy), R, facecolor="none", edgecolor=PURPLE,
                               lw=2.2, zorder=4))
        dot(ax, (cx, cy), PURPLE, r=4.5)

        ly = cy - d
        ax.plot([cx - 100, cx + 100], [ly, ly], color=col, lw=2.6, zorder=5,
                solid_capstyle="round")
        ax.plot([cx, cx], [cy, ly], color=MUTE, lw=1.4, ls=":", zorder=6)
        right_angle(ax, (cx, ly), (1, 0), (0, 1), size=8, color=MUTE, lw=1.2)
        boxed(ax, (cx - 15, (cy + ly) / 2), "d", MUTE, size=10)

        if n:
            half = math.sqrt(max(R * R - d * d, 0))
            for x in ([cx] if n == 1 else [cx - half, cx + half]):
                hollow(ax, (x, ly), col, r=5.5, lw=2.2)

        mono(ax, cx, 288, text, size=12, color=col, ha="center", weight="bold")
        ax.text(cx, 312, "%d point%s" % (n, "" if n == 1 else "s"),
                ha="center", va="center", fontsize=9.5, color=MUTE, zorder=8)

    for x in (266, 518):
        ax.plot([x, x], [58, 300], color=GRIDL, lw=1.6, zorder=0)
    save(fig, os.path.join(OUT, "line-circle-cases.png"))


# ============================================== 10. line vs circle, the points
def line_circle_construction():
    """No coordinate grid - this picture is a right triangle, not a location."""
    h = 400
    fig, ax = canvas(h)
    title(ax, "Drop a perpendicular, then step off it  -  Pythagoras finds the points")

    unit = 30
    ox, oy = 218, 216

    def pt(gx, gy):
        return (ox + gx * unit, oy - gy * unit)

    R = 5
    c = pt(0, 0)
    ax.add_patch(MplCircle(c, R * unit, facecolor=BLUE, edgecolor=PURPLE,
                           lw=2.4, alpha=0.12, zorder=2))
    ax.add_patch(MplCircle(c, R * unit, facecolor="none", edgecolor=PURPLE,
                           lw=2.4, zorder=4))

    ax.plot([pt(-5.6, 3)[0], pt(5.6, 3)[0]], [pt(-5.6, 3)[1], pt(5.6, 3)[1]],
            color=MUTE, lw=2.2, zorder=5)

    foot = pt(0, 3)
    left, right = pt(-4, 3), pt(4, 3)

    seg(ax, c, foot, GREEN, lw=3.0, z=6)
    right_angle(ax, foot, (1, 0), (0, 1), size=10, color=GREEN, lw=1.5)
    for q in (left, right):
        seg(ax, c, q, AMBER, lw=2.2, z=6)
    seg(ax, foot, right, CORAL, lw=3.4, z=7)
    for q in (left, right):
        hollow(ax, q, CORAL, r=6, lw=2.4)

    dot(ax, c, PURPLE, r=5)
    boxed(ax, c, "C", PURPLE, size=10.5, off=(-16, 16))
    label(ax, foot[0] - 12, foot[1] - 16, "foot", size=9.5, color=GREEN,
          ha="right", weight="bold")

    boxed(ax, ((c[0] + foot[0]) / 2 - 14, (c[1] + foot[1]) / 2), "d", GREEN,
          size=11)
    boxed(ax, ((c[0] + right[0]) / 2 + 14, (c[1] + right[1]) / 2 - 10), "r",
          AMBER, size=11)
    boxed(ax, ((foot[0] + right[0]) / 2, foot[1] - 18), "√(r² − d²)", CORAL,
          size=10)

    kx = 460
    label(ax, kx, 130, "one right triangle", size=10.5, color=INK, ha="left",
          weight="bold")
    for i, (txt, col) in enumerate([("hypotenuse  =  r", AMBER),
                                    ("one leg     =  d", GREEN),
                                    ("other leg   =  √(r² − d²)", CORAL)]):
        mono(ax, kx, 176 + i * 42, txt, size=11, color=col, ha="left")
    ax.plot([kx, kx + 250], [318, 318], color=MUTE, lw=1.3, zorder=5)
    label(ax, kx, 350, "step that far each way from the foot", size=9.5,
          color=MUTE, ha="left")

    save(fig, os.path.join(OUT, "line-circle-construction.png"))


# ============================================== 11. circle vs circle, the cases
def circle_circle_cases():
    h = 300
    fig, ax = canvas(h)
    title(ax, "Two circles, one number  -  the distance between the centres")

    cy = 162
    r1, r2 = 32, 20
    # (panel centre, gap between the centres, number of points, label, colour)
    panels = [(78, 64, 0, "d > r₁+r₂", CORAL),
              (234, 52, 1, "d = r₁+r₂", AMBER),
              (392, 38, 2, "in between", GREEN),
              (550, 12, 1, "d = |r₁−r₂|", AMBER),
              (706, 5, 0, "d < |r₁−r₂|", CORAL)]

    for cx, d, n, text, col in panels:
        c1 = (cx - d / 2, cy)
        c2 = (cx + d / 2, cy)
        for c, r in ((c1, r1), (c2, r2)):
            ax.add_patch(MplCircle(c, r, facecolor=BLUE, edgecolor=PURPLE,
                                   lw=2.0, alpha=0.10, zorder=2))
            ax.add_patch(MplCircle(c, r, facecolor="none", edgecolor=PURPLE,
                                   lw=2.0, zorder=4))
        ax.plot([c1[0], c2[0]], [c1[1], c2[1]], color=MUTE, lw=1.3, ls=":",
                zorder=5)
        for c in (c1, c2):
            dot(ax, c, PURPLE, r=2.8)

        if n:
            dd = c2[0] - c1[0]
            a = (dd * dd + r1 * r1 - r2 * r2) / (2 * dd)
            hh = math.sqrt(max(r1 * r1 - a * a, 0))
            bx = c1[0] + a
            for y in ([cy] if n == 1 else [cy - hh, cy + hh]):
                hollow(ax, (bx, y), col, r=4.6, lw=2.0)

        mono(ax, cx, 250, text, size=9.5, color=col, ha="center",
             weight="bold")
        ax.text(cx, 276, "%d" % n, ha="center", va="center", fontsize=11,
                color=MUTE, fontweight="bold", zorder=8,
                family="DejaVu Sans Mono")

    for x in (156, 313, 471, 628):
        ax.plot([x, x], [58, 262], color=GRIDL, lw=1.4, zorder=0)
    save(fig, os.path.join(OUT, "circle-circle-cases.png"))


# ============================================== 12. circle vs circle, the points
def circle_circle_construction():
    """No coordinate grid, for the same reason as the line construction."""
    h = 420
    fig, ax = canvas(h)
    title(ax, "The two points are mirrored across the line joining the centres")

    unit = 22
    ox, oy = 210, 190

    def pt(gx, gy):
        return (ox + gx * unit, oy - gy * unit)

    C1, R1 = (0, 0), 5
    C2, R2 = (8, 0), 5
    c1, c2 = pt(*C1), pt(*C2)

    for c, r, col in ((c1, R1, PURPLE), (c2, R2, BLUE)):
        ax.add_patch(MplCircle(c, r * unit, facecolor=col, edgecolor=col,
                               lw=2.2, alpha=0.09, zorder=2))
        ax.add_patch(MplCircle(c, r * unit, facecolor="none", edgecolor=col,
                               lw=2.2, zorder=4))

    ax.plot([pt(-5.6, 0)[0], pt(13.6, 0)[0]], [c1[1], c2[1]], color=MUTE,
            lw=1.5, ls=":", zorder=5)

    base, top, bot = pt(4, 0), pt(4, 3), pt(4, -3)

    seg(ax, c1, base, GREEN, lw=3.0, z=6)
    seg(ax, bot, top, CORAL, lw=2.6, z=6)
    seg(ax, c1, top, AMBER, lw=2.2, z=6)
    right_angle(ax, base, (1, 0), (0, -1), size=10, color=MUTE, lw=1.3)

    for q in (top, bot):
        hollow(ax, q, CORAL, r=6.5, lw=2.4)
    for c, col in ((c1, PURPLE), (c2, BLUE)):
        dot(ax, c, col, r=5)

    boxed(ax, c1, "C₁", PURPLE, size=10.5, off=(-18, 18))
    boxed(ax, c2, "C₂", BLUE, size=10.5, off=(18, 18))
    boxed(ax, ((c1[0] + base[0]) / 2, c1[1] + 18), "a", GREEN, size=11)
    boxed(ax, (base[0] + 16, (base[1] + top[1]) / 2), "h", CORAL, size=11)
    boxed(ax, ((c1[0] + top[0]) / 2 - 6, (c1[1] + top[1]) / 2 - 14), "r₁",
          AMBER, size=11)

    ax.plot([40, W - 40], [344, 344], color=GRIDL, lw=1.6, zorder=0)
    mono(ax, 150, 380, "a = (d² + r₁² − r₂²) / 2d", size=11.5, color=GREEN,
         ha="left")
    mono(ax, 470, 380, "h = √(r₁² − a²)", size=11.5, color=CORAL, ha="left")

    save(fig, os.path.join(OUT, "circle-circle-construction.png"))


if __name__ == "__main__":
    straddle_both_ways()
    collinear_overlap()
    ray_casting_parity()
    ray_crossing_test()
    ray_corner_rule()
    projection_shadow()
    point_line_distance()
    segment_distance_three_cases()
    line_circle_cases()
    line_circle_construction()
    circle_circle_cases()
    circle_circle_construction()
    print("done")
