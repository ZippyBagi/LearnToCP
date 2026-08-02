"""Geometry illustrations: dot product (normal vectors) and cross product (the circle)."""
import os
import math
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))


def _panel_head(ax, x, name, sub, color=INK, y=64):
    mono(ax, x, y, name, size=11, color=color, ha="center", weight="bold")
    if sub:
        label(ax, x, y + 19, sub, size=8.5, color=MUTE, ha="center")


# ------------------------------------------------- 1. dot product sign
def dot_product_normal():
    h = 404
    fig, ax = canvas(h)
    title(ax, "Dot product  -  it is zero exactly when the vectors are normal")

    unit = 29
    oy = 236
    centers = [130, 392, 654]

    A = (3, 1)
    cases = [
        (( 2, 3), BLUE,  "A . B > 0", "sharp angle",
         "3*2 + 1*3  =  9"),
        ((-1, 3), GREEN, "A . B = 0", "right angle - normal",
         "3*(-1) + 1*3  =  0"),
        ((-3, 1), CORAL, "A . B < 0", "wide angle",
         "3*(-3) + 1*1  =  -8"),
    ]

    for cx, (B, col, head, sub, work) in zip(centers, cases):
        pt = grid(ax, ox=cx, oy=oy, unit=unit, xr=(-4, 4), yr=(-1, 4),
                  ticks=False)
        _panel_head(ax, cx, head, sub, color=col, y=64)

        o = pt(0, 0)
        pa, pb = pt(*A), pt(*B)

        if B == (-1, 3):
            da = (A[0], -A[1])
            db = (B[0], -B[1])
            na = math.hypot(*da)
            nb = math.hypot(*db)
            right_angle(ax, o, (da[0] / na, da[1] / na), (db[0] / nb, db[1] / nb),
                        size=25, color=GREEN, lw=1.8)

        vec(ax, o, pa, color=PURPLE, lw=2.6, ms=15, text="A", off=(6, 18),
            size=10)
        vec(ax, o, pb, color=col, lw=2.6, ms=15, text="B",
            off=(-18 if B[0] < 0 else 18, -8), size=10)
        dot(ax, o, INK2, r=4)

        mono(ax, cx, 306, f"A = (3, 1)   B = ({B[0]}, {B[1]})", size=8.5,
             color=MUTE, ha="center")
        mono(ax, cx, 332, work, size=10, color=col, ha="center", weight="bold")

    label(ax, W / 2, 380,
          "The dot product shrinks as the angle opens up, passes through zero at 90 degrees, then goes negative.",
          size=9.5, color=INK2, ha="center")

    save(fig, os.path.join(OUT, "dot-product-normal.png"))


# ------------------------------------------------- 2. cross product on a circle
def _arc(ax, pt, r, th0, th1, color):
    """Arc of radius r (grid units) from th0 to th1 (degrees), with an arrowhead."""
    n = 60
    pts = []
    for i in range(n + 1):
        t = math.radians(th0 + (th1 - th0) * i / n)
        pts.append(pt(r * math.cos(t), r * math.sin(t)))
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    ax.plot(xs, ys, color=color, lw=2.6, zorder=7, solid_capstyle="round")
    arrow(ax, pts[-3][0], pts[-3][1], pts[-1][0], pts[-1][1], color=color,
          lw=2.6, ms=14, z=8)


def cross_product_circle():
    h = 450
    fig, ax = canvas(h)
    title(ax, "Cross product  -  the sign is the turn from A to B around the circle")

    unit = 24
    oy = 202
    centers = [130, 392, 654]
    R = 2.4                      # circle radius, in grid units

    A = (3, 1)
    thA = math.degrees(math.atan2(A[1], A[0]))

    cases = [
        (( -1, 3), GREEN, "A x B > 0", "counter-clockwise",
         "3*3 - 1*(-1)  =  10"),
        ((  1,-2), CORAL, "A x B < 0", "clockwise",
         "3*(-2) - 1*1  =  -7"),
        (( -3,-1), PURPLE, "A x B = 0", "parallel - no turn",
         "3*(-1) - 1*(-3)  =  0"),
    ]

    for cx, (B, col, head, sub, work) in zip(centers, cases):
        pt = grid(ax, ox=cx, oy=oy, unit=unit, xr=(-4, 4), yr=(-4, 4),
                  ticks=False)
        _panel_head(ax, cx, head, sub, color=col)

        # the circle the two vectors cut through
        circ = [pt(R * math.cos(math.radians(t)), R * math.sin(math.radians(t)))
                for t in range(0, 361, 4)]
        ax.plot([p[0] for p in circ], [p[1] for p in circ], color=AXIS,
                lw=1.4, ls=(0, (4, 4)), zorder=2)

        o = pt(0, 0)
        thB = math.degrees(math.atan2(B[1], B[0]))

        if B == (-3, -1):
            # collinear: one straight line through both arrows
            ax.plot([pt(-3.4, -1.13)[0], pt(3.4, 1.13)[0]],
                    [pt(-3.4, -1.13)[1], pt(3.4, 1.13)[1]],
                    color=PURPLE, lw=1.4, ls=(0, (5, 4)), zorder=3)
        else:
            d = (thB - thA) % 360
            if d > 180:
                d -= 360
            _arc(ax, pt, R, thA + 9, thB - 9 * (1 if d > 0 else -1), col)

        vec(ax, o, pt(*A), color=BLUE, lw=2.4, ms=13, text="A",
            off=(6, 16), size=9.5)
        vec(ax, o, pt(*B), color=col, lw=2.4, ms=13, text="B",
            off=(-16, -4) if B[0] < 0 else (-24, 6), size=9.5)
        dot(ax, o, INK2, r=3.5)

        mono(ax, cx, 326, f"A = (3, 1)   B = ({B[0]}, {B[1]})", size=8.5,
             color=MUTE, ha="center")
        mono(ax, cx, 352, work, size=10, color=col, ha="center", weight="bold")

    label(ax, W / 2, 400,
          "Picture both arrows cutting the same circle. The sign of Ax*By - Ay*Bx is the direction you travel along it from A to B.",
          size=9, color=INK2, ha="center")
    label(ax, W / 2, 424,
          "Order matters: swapping A and B flips the sign, because it reverses the turn.",
          size=9, color=MUTE, ha="center")

    save(fig, os.path.join(OUT, "cross-product-circle.png"))


if __name__ == "__main__":
    dot_product_normal()
    cross_product_circle()
    print("ok")
