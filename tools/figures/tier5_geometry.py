"""Geometry illustrations: distance, vectors."""
import os
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))


# ------------------------------------------------- 1. distance is Pythagoras
def distance_triangle():
    h = 430
    fig, ax = canvas(h)
    title(ax, "Distance between two points  -  it is just Pythagoras")

    unit = 42
    pt = grid(ax, ox=96, oy=372, unit=unit, xr=(0, 6), yr=(0, 7))

    A, B = (1, 2), (4, 6)
    pa, pb = pt(*A), pt(*B)
    corner = pt(B[0], A[1])          # the right angle sits under B

    # the two legs
    ax.plot([pa[0], corner[0]], [pa[1], corner[1]], color=BLUE, lw=2.2,
            zorder=4)
    ax.plot([corner[0], pb[0]], [corner[1], pb[1]], color=CORAL, lw=2.2,
            zorder=4)
    right_angle(ax, corner, (-1, 0), (0, -1), size=11)

    # the hypotenuse
    ax.plot([pa[0], pb[0]], [pa[1], pb[1]], color=PURPLE, lw=2.6, zorder=5)

    dot(ax, pa, PURPLE)
    dot(ax, pb, PURPLE)
    mono(ax, pa[0] - 12, pa[1] + 16, "A (1, 2)", size=9, color=INK2,
         ha="center", weight="bold")
    mono(ax, pb[0] + 6, pb[1] - 16, "B (4, 6)", size=9, color=INK2,
         ha="center", weight="bold")

    ax.text((pa[0] + corner[0]) / 2, corner[1] + 17, "3", ha="center",
            va="center", fontsize=11, color=BLUE, fontweight="bold", zorder=7,
            bbox=dict(boxstyle="round,pad=0.2", facecolor=WHITE,
                      edgecolor="none"))
    ax.text(corner[0] + 16, (corner[1] + pb[1]) / 2, "4", ha="center",
            va="center", fontsize=11, color=CORAL, fontweight="bold", zorder=7,
            bbox=dict(boxstyle="round,pad=0.2", facecolor=WHITE,
                      edgecolor="none"))
    ax.text((pa[0] + pb[0]) / 2 - 20, (pa[1] + pb[1]) / 2 - 8, "5",
            ha="center", va="center", fontsize=12, color=PURPLE,
            fontweight="bold", zorder=7,
            bbox=dict(boxstyle="round,pad=0.2", facecolor=WHITE,
                      edgecolor="none"))

    # --- the working, on the right
    tx = 410
    mono(ax, tx, 108, "horizontal:  Bx - Ax  =  4 - 1  =  3", size=10,
         color=BLUE, ha="left", weight="bold")
    mono(ax, tx, 138, "vertical:    By - Ay  =  6 - 2  =  4", size=10,
         color=CORAL, ha="left", weight="bold")

    rbox(ax, tx - 14, 176, 356, 96, face=LAV, edge=PURPLE, lw=1.8, r=10, z=1)
    mono(ax, tx + 164, 206, "dist^2  =  3^2 + 4^2  =  25", size=11,
         color=INK, ha="center", weight="bold")
    mono(ax, tx + 164, 242, "dist    =  sqrt(25)   =  5", size=11,
         color=PURPLE, ha="center", weight="bold")

    label(ax, tx, 302, "The squared distance is a whole number,", size=9.5,
          color=INK2, ha="left")
    label(ax, tx, 322, "so it stays exact in long long.", size=9.5,
          color=INK2, ha="left")
    label(ax, tx, 348, "Only the final sqrt loses precision - and", size=9,
          color=MUTE, ha="left")
    label(ax, tx, 366, "most of the time we can skip it entirely.", size=9,
          color=MUTE, ha="left")

    save(fig, os.path.join(OUT, "distance-triangle.png"))


# ------------------------------------------------- 2. a vector has no place
def vector_no_position():
    h = 492
    fig, ax = canvas(h)
    title(ax, "A vector is an arrow with no fixed position")

    unit = 46
    ox = (W - 12 * unit) / 2
    pt = grid(ax, ox=ox, oy=364, unit=unit, xr=(0, 12), yr=(0, 6))

    starts = [(0, 0), (4, 3), (8, 1), (1, 4)]
    for sx, sy in starts:
        vec(ax, pt(sx, sy), pt(sx + 3, sy + 2), color=BLUE, lw=2.6, ms=15,
            text="(3, 2)", off=(6, -16), size=9)

    label(ax, W / 2, 412,
          "All four arrows are the same vector. Equal length, equal direction - so they are equal,",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, 432,
          "no matter where on the grid we draw them.",
          size=9.5, color=INK2, ha="center")

    # point vs vector strip
    sy = 468
    dot(ax, (206, sy), PURPLE, r=6)
    mono(ax, 222, sy, "point (x, y)", size=9.5, color=INK2, ha="left",
         weight="bold")
    label(ax, 330, sy, "where something is", size=9, color=MUTE, ha="left")

    vec(ax, (470, sy), (508, sy), color=BLUE, lw=2.4, ms=13)
    mono(ax, 518, sy, "vector (x, y)", size=9.5, color=INK2, ha="left",
         weight="bold")
    label(ax, 630, sy, "how to get somewhere", size=9, color=MUTE, ha="left")

    save(fig, os.path.join(OUT, "vector-no-position.png"))


# ------------------------------------------------- 3. AB = B - A
def vector_from_points():
    h = 442
    fig, ax = canvas(h)
    title(ax, "The vector from A to B  -  mind the order")

    unit = 42
    pt = grid(ax, ox=96, oy=372, unit=unit, xr=(0, 6), yr=(0, 7))

    A, B = (1, 2), (4, 6)
    pa, pb = pt(*A), pt(*B)

    # labels sit on the side each curve actually bows toward
    vec(ax, pa, pb, color=BLUE, lw=2.8, ms=16, text="AB = (3, 4)",
        off=(56, 28), size=9, rad=0.16)
    vec(ax, pb, pa, color=CORAL, lw=2.8, ms=16, text="BA = (-3, -4)",
        off=(-46, -28), size=9, rad=0.16)

    dot(ax, pa, PURPLE)
    dot(ax, pb, PURPLE)
    mono(ax, pa[0] - 6, pa[1] + 18, "A (1, 2)", size=9, color=INK2,
         ha="center", weight="bold")
    mono(ax, pb[0] + 4, pb[1] - 18, "B (4, 6)", size=9, color=INK2,
         ha="center", weight="bold")

    tx = 420
    mono(ax, tx, 106, "AB  =  (Bx - Ax,  By - Ay)", size=10.5, color=BLUE,
         ha="left", weight="bold")
    mono(ax, tx + 26, 132, "=  (4 - 1,  6 - 2)  =  (3, 4)", size=10,
         color=INK2, ha="left")

    mono(ax, tx, 180, "BA  =  (Ax - Bx,  Ay - By)", size=10.5, color=CORAL,
         ha="left", weight="bold")
    mono(ax, tx + 26, 206, "=  (1 - 4,  2 - 6)  =  (-3, -4)", size=10,
         color=INK2, ha="left")

    rbox(ax, tx - 14, 246, 348, 52, face=LAV, edge=PURPLE, lw=1.8, r=10, z=1)
    mono(ax, tx + 160, 272, "BA  =  - AB", size=12, color=PURPLE,
         ha="center", weight="bold")

    label(ax, tx, 330, "Always subtract the start point from the end", size=9.5,
          color=INK2, ha="left")
    label(ax, tx, 350, "point. Getting it backwards gives the exact", size=9.5,
          color=INK2, ha="left")
    label(ax, tx, 370, "opposite arrow - a very common bug.", size=9.5,
          color=INK2, ha="left")

    save(fig, os.path.join(OUT, "vector-from-points.png"))


# ------------------------------------------------- 4. the three operations
def vector_operations():
    h = 430
    fig, ax = canvas(h)
    title(ax, "The three operations on vectors")

    unit = 27
    oy = 286
    yr = (-2, 4)

    def head(x, name, sub):
        mono(ax, x, 76, name, size=11, color=INK, ha="center", weight="bold")
        label(ax, x, 96, sub, size=8.5, color=MUTE, ha="center")

    # ---- addition: tip to tail
    p1 = grid(ax, ox=72, oy=oy, unit=unit, xr=(0, 6), yr=yr, ticks=False)
    head(153, "Addition", "one movement, then the other")
    u, v = (3, 1), (1, 3)
    vec(ax, p1(0, 0), p1(*u), color=BLUE, lw=2.4, ms=13, text="u",
        off=(2, 15), size=9.5)
    vec(ax, p1(*u), p1(u[0] + v[0], u[1] + v[1]), color=GREEN, lw=2.4, ms=13,
        text="v", off=(15, 2), size=9.5)
    vec(ax, p1(0, 0), p1(u[0] + v[0], u[1] + v[1]), color=PURPLE, lw=2.6,
        ms=14, text="u + v", off=(-26, -8), size=9)
    mono(ax, 153, 360, "(3,1) + (1,3) = (4,4)", size=9, color=INK2,
         ha="center")

    # ---- subtraction: the arrow between the tips
    p2 = grid(ax, ox=316, oy=oy, unit=unit, xr=(0, 6), yr=yr, ticks=False)
    head(397, "Subtraction", "from the tip of v to the tip of u")
    u2, v2 = (5, 1), (1, 3)
    vec(ax, p2(0, 0), p2(*u2), color=BLUE, lw=2.4, ms=13, text="u",
        off=(0, 16), size=9.5)
    vec(ax, p2(0, 0), p2(*v2), color=GREEN, lw=2.4, ms=13, text="v",
        off=(-16, 0), size=9.5)
    vec(ax, p2(*v2), p2(*u2), color=PURPLE, lw=2.6, ms=14, text="u - v",
        off=(6, -16), size=9)
    mono(ax, 397, 360, "(5,1) - (1,3) = (4,-2)", size=9, color=INK2,
         ha="center")

    # ---- scaling
    p3 = grid(ax, ox=636, oy=oy, unit=unit, xr=(-3, 4), yr=yr, ticks=False)
    head(650, "Scaling", "same direction, new length")
    w = (2, 1)
    vec(ax, p3(0, 0), p3(w[0] * 2, w[1] * 2), color=PURPLE, lw=2.6, ms=14,
        text="2v", off=(10, -14), size=9)
    vec(ax, p3(0, 0), p3(*w), color=BLUE, lw=2.6, ms=14, text="v",
        off=(-4, 15), size=9.5)
    vec(ax, p3(0, 0), p3(-w[0], -w[1]), color=CORAL, lw=2.6, ms=14,
        text="-v", off=(-6, 15), size=9.5)
    mono(ax, 650, 360, "k < 0 flips it around", size=9, color=INK2,
         ha="center")

    label(ax, W / 2, h - 24,
          "Addition and subtraction work tip to tail - the coordinates just do the bookkeeping.",
          size=9, color=MUTE, ha="center")
    save(fig, os.path.join(OUT, "vector-operations.png"))


if __name__ == "__main__":
    distance_triangle()
    vector_no_position()
    vector_from_points()
    vector_operations()
    print("ok")
