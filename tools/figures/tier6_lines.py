"""Geometry illustrations for the Lines lesson: orientation sign, point on segment.

Both images deliberately carry almost no prose - the shading, the repetition and
the tick/cross glyphs are meant to do the explaining.
"""
import os
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))

TICK = "✓"
CROSS = "✗"


def plus_glyph(ax, c, color, arm=26, lw=13, alpha=0.35, z=1):
    """A '+' drawn as two bars, so it weighs the same as the '-' next to it."""
    ax.plot([c[0] - arm, c[0] + arm], [c[1], c[1]], color=color, lw=lw,
            alpha=alpha, zorder=z, solid_capstyle="round")
    ax.plot([c[0], c[0]], [c[1] - arm, c[1] + arm], color=color, lw=lw,
            alpha=alpha, zorder=z, solid_capstyle="round")


def minus_glyph(ax, c, color, arm=26, lw=13, alpha=0.35, z=1):
    ax.plot([c[0] - arm, c[0] + arm], [c[1], c[1]], color=color, lw=lw,
            alpha=alpha, zorder=z, solid_capstyle="round")


# ------------------------------------------------- 1. the sign picks the side
def orientation_sign():
    h = 430
    fig, ax = canvas(h)
    title(ax, "Orientation  -  one sign, three answers")

    unit = 46
    ox, oy = 120, 380
    xr, yr = (-1, 6), (-1, 6)

    def gp(gx, gy):
        return (ox + gx * unit, oy - gy * unit)

    # the two half planes, painted before the grid so the lines stay readable
    ax.add_patch(Polygon([gp(-1, -1), gp(-1, 6), gp(6, 6)], closed=True,
                         facecolor=BLUE, edgecolor="none", alpha=0.10, zorder=0))
    ax.add_patch(Polygon([gp(-1, -1), gp(6, -1), gp(6, 6)], closed=True,
                         facecolor=CORAL, edgecolor="none", alpha=0.10, zorder=0))

    pt = grid(ax, ox=ox, oy=oy, unit=unit, xr=xr, yr=yr)

    # the infinite line, then the AB arrow drawn on top of it
    ax.plot([pt(-1, -1)[0], pt(6, 6)[0]], [pt(-1, -1)[1], pt(6, 6)[1]],
            color=PURPLE, lw=1.4, ls="--", alpha=0.55, zorder=3)
    vec(ax, pt(0, 0), pt(4, 4), color=PURPLE, lw=2.8, ms=16)

    # the big region glyphs - this is the actual message of the image
    plus_glyph(ax, gp(2.7, 5.0), BLUE)
    minus_glyph(ax, gp(5.0, 1.7), CORAL)

    dot(ax, pt(0, 0), PURPLE, r=5)
    dot(ax, pt(4, 4), PURPLE, r=5)
    mono(ax, pt(0, 0)[0] - 16, pt(0, 0)[1] + 15, "A", size=10, color=INK2,
         ha="center", weight="bold")
    mono(ax, pt(4, 4)[0] + 15, pt(4, 4)[1] - 14, "B", size=10, color=INK2,
         ha="center", weight="bold")

    # the three sample points, each carrying only its cross product
    samples = [((0, 4), "+16", BLUE, (22, -15)),
               ((4, 0), "-16", CORAL, (26, -17)),
               ((2, 2), "0", PURPLE, (-30, 30))]
    for (g, val, col, off) in samples:
        p = pt(*g)
        dot(ax, p, col, r=6.5)
        ax.text(p[0] + off[0], p[1] + off[1], val, ha="center", va="center",
                fontsize=11, color=col, fontweight="bold", zorder=8,
                family="DejaVu Sans Mono",
                bbox=dict(boxstyle="round,pad=0.22", facecolor=WHITE,
                          edgecolor="none"))

    # the key: sign of the cross product -> the character the function returns
    kx = 505
    mono(ax, kx, 142, "AB × AC", size=14, color=INK, ha="left", weight="bold")
    rows = [("> 0", "+", BLUE), ("< 0", "−", CORAL), ("= 0", "=", PURPLE)]
    for i, (cond, ch, col) in enumerate(rows):
        y = 208 + i * 56
        mono(ax, kx + 6, y, cond, size=13, color=INK2, ha="left")
        arrow(ax, kx + 62, y, kx + 104, y, color=MUTE, lw=1.4, ms=9)
        rbox(ax, kx + 118, y - 19, 40, 38, face=WHITE, edge=col, lw=2.0, r=8)
        ax.text(kx + 138, y, ch, ha="center", va="center", fontsize=17,
                color=col, fontweight="bold", zorder=7)

    save(fig, os.path.join(OUT, "orientation-sign.png"))


# ------------------------------------------------- 2. both checks must pass
def on_segment_two_checks():
    """Three copies of the same picture, one sample point each - the repetition
    is what makes the two checks visible without spelling them out."""
    h = 360
    fig, ax = canvas(h)
    title(ax, "On a segment  -  on the line and inside the box")

    unit = 26
    oy = 258
    xr, yr = (-1, 7), (-1, 7)

    # (centre, sample point, passes the line check, passes the box check)
    panels = [(140, (2, 2), True, True),
              (392, (6, 6), True, False),
              (644, (1, 3), False, True)]

    for cx, sample, on_line, in_box in panels:
        ox = cx - 3 * unit          # centres the -1..7 range on cx
        good = on_line and in_box

        def gp(gx, gy):
            return (ox + gx * unit, oy - gy * unit)

        # the box spanned by A and B - greyed out when the point is outside it
        ax.add_patch(Polygon([gp(0, 0), gp(4, 0), gp(4, 4), gp(0, 4)],
                             closed=True,
                             facecolor=AMBER if in_box else MUTE,
                             edgecolor=AMBER if in_box else MUTE,
                             alpha=0.20 if in_box else 0.10,
                             lw=1.6, ls="--", zorder=0))

        pt = grid(ax, ox=ox, oy=oy, unit=unit, xr=xr, yr=yr, ticks=False)

        # the infinite line in grey, the segment in green - greyed out when the
        # point is not on the line at all
        ax.plot([pt(-1, -1)[0], pt(7, 7)[0]], [pt(-1, -1)[1], pt(7, 7)[1]],
                color=MUTE, lw=1.3, ls="--", alpha=0.75, zorder=2)
        ax.plot([pt(0, 0)[0], pt(4, 4)[0]], [pt(0, 0)[1], pt(4, 4)[1]],
                color=GREEN if on_line else MUTE, lw=3.2,
                alpha=1.0 if on_line else 0.35,
                zorder=4, solid_capstyle="round")

        dot(ax, pt(0, 0), INK2, r=4)
        dot(ax, pt(4, 4), INK2, r=4)
        for g, off in [((0, 0), (-14, 14)), ((4, 4), (-14, -13))]:
            q = pt(*g)
            ax.text(q[0] + off[0], q[1] + off[1], "A" if g == (0, 0) else "B",
                    ha="center", va="center", fontsize=8.5, color=INK2,
                    fontweight="bold", zorder=8, family="DejaVu Sans Mono",
                    bbox=dict(boxstyle="round,pad=0.12", facecolor=WHITE,
                              edgecolor="none"))

        p = pt(*sample)
        dot(ax, p, GREEN if good else CORAL, r=6.5)
        ax.text(p[0] + 34, p[1] - 13, "(%d, %d)" % sample, ha="center",
                va="center", fontsize=8.5, color=GREEN if good else CORAL,
                fontweight="bold", zorder=8, family="DejaVu Sans Mono",
                bbox=dict(boxstyle="round,pad=0.2", facecolor=WHITE,
                          edgecolor="none"))

        ax.text(cx, 322, TICK if good else CROSS, ha="center", va="center",
                fontsize=26, color=GREEN if good else CORAL, fontweight="bold",
                zorder=8)

    save(fig, os.path.join(OUT, "on-segment-two-checks.png"))


if __name__ == "__main__":
    orientation_sign()
    on_segment_two_checks()
    print("ok")
