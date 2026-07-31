"""Combinatorics illustrations."""
import os
from itertools import permutations
from matplotlib.patches import Circle
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))


# --------------------------------------------- 5. variations -> combinations
def combinations_from_variations():
    h = 420
    fig, ax = canvas(h)
    title(ax, "Combinations  -  every team gets counted k! times")

    orders = ["".join(p) for p in permutations("ABC")]
    cw, chh, gap = 30, 28, 4
    lx = 132
    ytop = 88
    pitch = 40
    for r, o in enumerate(orders):
        y = ytop + r * pitch
        for i, ch in enumerate(o):
            cell(ax, lx + i * (cw + gap), y, cw, chh, ch, face=LAV,
                 edge=PURPLE, tcolor=INK2, size=11, lw=1.6, r=5)
    label(ax, lx + 51, 66, "6 different orderings", size=9, color=MUTE,
          ha="center")

    # collapsing brace
    bx = lx + 3 * (cw + gap) + 16
    ax.plot([bx, bx + 16, bx + 16, bx + 32],
            [ytop - 6, ytop - 6, ytop + 5 * pitch + chh + 6,
             ytop + 5 * pitch + chh + 6],
            color="#00000000", lw=0)
    ax.annotate("", xy=(bx + 108, ytop + 2.5 * pitch + chh / 2),
                xytext=(bx + 26, ytop + 2.5 * pitch + chh / 2),
                arrowprops=dict(arrowstyle="-|>", color=PURPLE, lw=2,
                                mutation_scale=14), zorder=6)
    for r in range(6):
        y = ytop + r * pitch + chh / 2
        ax.plot([bx, bx + 24], [y, ytop + 2.5 * pitch + chh / 2],
                color="#BCA8EC", lw=1.3, zorder=2)
    mono(ax, bx + 66, ytop + 2.5 * pitch + chh / 2 - 18, "/ 3!", size=11,
         color=PURPLE, ha="center", weight="bold")

    # the single team
    tx = bx + 128
    ty = ytop + 2.5 * pitch
    rbox(ax, tx, ty - 12, 214, chh + 34, face="#F7F9FC", edge=GREEN, lw=1.8,
         r=8, z=1)
    for i, ch in enumerate("ABC"):
        cell(ax, tx + 26 + i * (cw + gap + 8), ty + 2, cw + 8, chh, ch,
             face=GREEN, tcolor=WHITE, size=11, lw=1.6, r=5, z=3)
    label(ax, tx + 107, ty + chh + 14, "1 team", size=9, color=GREEN,
          ha="center", weight="bold")

    label(ax, W / 2, h - 78,
          "Order is the only difference between the two, so we divide it away.",
          size=9.5, color=INK2, ha="center")
    mono(ax, W / 2, h - 48, "V(5,3) = 60        C(5,3) = 60 / 3! = 10",
         size=12, color=INK, ha="center", weight="bold")
    label(ax, W / 2, h - 22,
          "60 ordered podiums, but only 10 different teams.",
          size=9, color=MUTE, ha="center")
    save(fig, os.path.join(OUT, "combinations-from-variations.png"))


# --------------------------------------------- 6. the four objects
def combinatoric_objects():
    h = 470
    fig, ax = canvas(h)
    title(ax, "The four objects  -  does order matter, is the size fixed?")

    cw, chh, gap = 34, 32, 6

    def panel(px, py, name, chips, order, takes, formula, count, chip_w=None):
        w_ = chip_w or cw
        rbox(ax, px, py, 336, 150, face="#FCFDFE", edge="#E1E5EA", lw=1.6,
             r=10, z=1)
        mono(ax, px + 18, py + 24, name, size=11, color=INK, ha="left",
             weight="bold")
        for i, (ch, kind) in enumerate(chips):
            x = px + 18 + i * (w_ + gap)
            if kind == "on":
                cell(ax, x, py + 42, w_, chh, ch, face=BLUE, tcolor=WHITE,
                     size=11, lw=1.6, r=5, z=3)
            elif kind == "pick":
                cell(ax, x, py + 42, w_, chh, ch, face=GREEN, tcolor=WHITE,
                     size=11, lw=1.6, r=5, z=3)
            elif kind == "set":
                cell(ax, x, py + 42, w_, chh, ch, face=LAV, edge=PURPLE,
                     tcolor=INK2, size=9, lw=1.6, r=5, z=3)
            else:
                cell(ax, x, py + 42, w_, chh, ch, face=GREY,
                     tcolor="#B0B6BE", size=11, lw=1.6, r=5, z=3)
        label(ax, px + 18, py + 98, f"order matters: {order}", size=8.5,
              color=MUTE, ha="left")
        label(ax, px + 176, py + 98, f"takes: {takes}", size=8.5, color=MUTE,
              ha="left")
        mono(ax, px + 18, py + 126, formula, size=10, color=INK2, ha="left")
        mono(ax, px + 318, py + 126, count, size=12, color=PURPLE, ha="right",
             weight="bold")

    A = [("A", "on"), ("B", "on"), ("C", "on"), ("D", "on")]
    perm = [("B", "on"), ("D", "on"), ("A", "on"), ("C", "on")]
    vari = [("D", "on"), ("B", "on"), ("-", "off"), ("-", "off")]
    comb = [("B", "pick"), ("D", "pick"), ("-", "off"), ("-", "off")]
    subs = [("{ }", "set"), ("{B}", "set"), ("{B,D}", "set"),
            ("{A,B,C,D}", "set")]

    panel(40, 66, "Permutation", perm, "yes", "all 4", "n!", "24")
    panel(408, 66, "Variation   ( k = 2 )", vari, "yes", "exactly 2",
          "n! / (n-k)!", "12")
    panel(40, 240, "Combination   ( k = 2 )", comb, "no", "exactly 2",
          "n! / (k! (n-k)!)", "6")
    panel(408, 240, "Subset", subs, "no", "any number", "2^n", "16",
          chip_w=68)

    label(ax, W / 2, h - 24,
          "Four items A B C D. Blue keeps its order, green is a group, grey was not taken.",
          size=9, color=MUTE, ha="center")
    save(fig, os.path.join(OUT, "combinatoric-objects.png"))


# --------------------------------------------- 7. subsets as decisions
def subsets_decisions():
    h = 430
    fig, ax = canvas(h)
    title(ax, "Subsets  -  one yes / no decision per element")

    leaves = 8
    lw_ = 84
    lpitch = 92
    lx0 = (W - ((leaves - 1) * lpitch + lw_)) / 2
    leaf_x = [lx0 + i * lpitch + lw_ / 2 for i in range(leaves)]

    y_root, y1, y2, y_leaf = 92, 158, 224, 300

    def mid(xs):
        return sum(xs) / len(xs)

    lvl2 = [mid(leaf_x[i:i + 2]) for i in range(0, 8, 2)]
    lvl1 = [mid(leaf_x[i:i + 4]) for i in range(0, 8, 4)]
    root = mid(leaf_x)

    def edge(x1, y1_, x2, y2_, bit):
        ax.plot([x1, x2], [y1_, y2_], color="#C9CFD6", lw=1.5, zorder=1)
        ax.text((x1 + x2) / 2 - (7 if bit == "0" else -7), (y1_ + y2_) / 2,
                bit, ha="center", va="center", fontsize=8.5,
                color=MUTE if bit == "0" else BLUE, fontweight="bold",
                zorder=6,
                bbox=dict(boxstyle="round,pad=0.18", facecolor=WHITE,
                          edgecolor="none"))

    for i, x in enumerate(lvl1):
        edge(root, y_root, x, y1, "0" if i == 0 else "1")
    for i, x in enumerate(lvl2):
        edge(lvl1[i // 2], y1, x, y2, "0" if i % 2 == 0 else "1")
    for i, x in enumerate(leaf_x):
        edge(lvl2[i // 2], y2, x, y_leaf - 18, "0" if i % 2 == 0 else "1")

    for x, y in [(root, y_root)] + [(x, y1) for x in lvl1] + \
                [(x, y2) for x in lvl2]:
        ax.add_patch(Circle((x, y), 5.5, facecolor=PURPLE, edgecolor="none",
                            zorder=5))

    for lvl, (yy, name) in enumerate(((y_root, "A"), (y1, "B"), (y2, "C"))):
        mono(ax, 34, yy, f"{name} ?", size=10, color=INK2, ha="left",
             weight="bold")

    items = "ABC"
    for i, x in enumerate(leaf_x):
        bits = format(i, "03b")
        chosen = [items[j] for j in range(3) if bits[j] == "1"]
        txt = "{ " + ", ".join(chosen) + " }" if chosen else "{ }"
        full = len(chosen) == 3
        cell(ax, x - lw_ / 2, y_leaf - 18, lw_, 34, txt,
             face=GREEN if full else LAV,
             edge=None if full else PURPLE,
             tcolor=WHITE if full else INK2, size=9.5, lw=1.6, r=6)
        mono(ax, x, y_leaf + 32, bits, size=9, color=BLUE, ha="center",
             weight="bold")

    label(ax, W / 2, h - 68,
          "Each element is either in or out - and the three answers spell a binary number.",
          size=9.5, color=INK2, ha="center")
    mono(ax, W / 2, h - 40, "2 * 2 * 2  =  2^3  =  8 subsets", size=12,
         color=INK, ha="center", weight="bold")
    label(ax, W / 2, h - 18,
          "The empty set and the full set are both included.",
          size=9, color=MUTE, ha="center")
    save(fig, os.path.join(OUT, "subsets-decisions.png"))


# --------------------------------------------- 8. inclusion exclusion, 2 sets
def ie_two_sets():
    h = 420
    fig, ax = canvas(h)
    title(ax, "Inclusion - Exclusion  -  the overlap gets counted twice")

    ca, cb, r = (290, 195), (440, 195), 100
    ax.add_patch(Circle(ca, r, facecolor=BLUE, edgecolor=BLUE, lw=2,
                        alpha=0.30, zorder=2))
    ax.add_patch(Circle(cb, r, facecolor=GREEN, edgecolor=GREEN, lw=2,
                        alpha=0.30, zorder=2))
    ax.add_patch(Circle(ca, r, facecolor="none", edgecolor=BLUE, lw=2,
                        zorder=4))
    ax.add_patch(Circle(cb, r, facecolor="none", edgecolor=GREEN, lw=2,
                        zorder=4))

    a_only = [(225, 160), (235, 225), (285, 255)]
    both = [(365, 162), (365, 222)]
    b_only = [(495, 160), (505, 225), (455, 255)]
    for x, y in a_only:
        ax.add_patch(Circle((x, y), 7, facecolor=BLUE, edgecolor="none",
                            zorder=6))
    for x, y in b_only:
        ax.add_patch(Circle((x, y), 7, facecolor=GREEN, edgecolor="none",
                            zorder=6))
    for x, y in both:
        ax.add_patch(Circle((x, y), 7, facecolor=AMBER, edgecolor=WHITE,
                            lw=1.4, zorder=6))

    mono(ax, 214, 108, "A", size=15, color=BLUE, ha="center", weight="bold")
    mono(ax, 516, 108, "B", size=15, color=GREEN, ha="center", weight="bold")
    mono(ax, 152, 195, "|A| = 5", size=10, color=BLUE, ha="center",
         weight="bold")
    mono(ax, 592, 195, "|B| = 4", size=10, color=GREEN, ha="center",
         weight="bold")

    mono(ax, 365, 318, "|A n B| = 2", size=10, color=AMBER, ha="center",
         weight="bold")
    arrow(ax, 365, 306, 365, 240, color=AMBER, lw=1.6, ms=9)
    label(ax, 365, 334, "counted once by A and once by B", size=8.5,
          color=AMBER, ha="center", weight="bold")

    mono(ax, W / 2, h - 56, "|A u B|  =  |A| + |B| - |A n B|", size=13,
         color=INK, ha="center", weight="bold")
    mono(ax, W / 2, h - 28, "=  5 + 4 - 2  =  7", size=12, color=PURPLE,
         ha="center", weight="bold")
    save(fig, os.path.join(OUT, "inclusion-exclusion-two-sets.png"))


# --------------------------------------------- 9. inclusion exclusion, 3 sets
def ie_three_sets():
    h = 558
    fig, ax = canvas(h)
    title(ax, "Inclusion - Exclusion  -  why the signs alternate")

    r = 94
    c1, c2, c3 = (322, 166), (446, 166), (384, 276)
    for c, col in ((c1, BLUE), (c2, GREEN), (c3, CORAL)):
        ax.add_patch(Circle(c, r, facecolor=col, edgecolor=col, lw=2,
                            alpha=0.24, zorder=2))
        ax.add_patch(Circle(c, r, facecolor="none", edgecolor=col, lw=2,
                            zorder=4))

    mono(ax, 218, 88, "A1", size=12, color=BLUE, ha="center", weight="bold")
    mono(ax, 550, 88, "A2", size=12, color=GREEN, ha="center", weight="bold")
    mono(ax, 384, 396, "A3", size=12, color=CORAL, ha="center", weight="bold")

    # a chip in each kind of region, showing how many sets it belongs to
    for (x, y), n in (((266, 132), "1"), ((384, 132), "2"), ((384, 206), "3")):
        cell(ax, x - 17, y - 15, 34, 30, n, face=PURPLE, tcolor=WHITE,
             size=12, lw=1.6, r=6, z=7)

    label(ax, W / 2, 424,
          "The chip in each region says how many of the three sets that region belongs to.",
          size=9, color=MUTE, ha="center")

    # the arithmetic strip
    sy = 452
    rows = [
        ("in 1 set", "1", "0", "0", "1"),
        ("in 2 sets", "2", "1", "0", "1"),
        ("in all 3", "3", "3", "1", "1"),
    ]
    cols = [196, 306, 400, 496, 600]
    heads = ["element", "+ singles", "- pairs", "+ triple", "= counted"]
    for x, htxt in zip(cols, heads):
        label(ax, x, sy, htxt, size=8.5, color=MUTE, ha="center")
    ax.plot([132, 664], [sy + 12, sy + 12], color="#E1E5EA", lw=1.4)
    for r_i, vals in enumerate(rows):
        ry = sy + 30 + r_i * 24
        for x, v in zip(cols, vals):
            last = x == cols[-1]
            mono(ax, x, ry, v, size=9.5, color=GREEN if last else INK2,
                 ha="center", weight="bold" if last else "normal")

    save(fig, os.path.join(OUT, "inclusion-exclusion-three-sets.png"))


if __name__ == "__main__":
    combinations_from_variations()
    combinatoric_objects()
    subsets_decisions()
    ie_two_sets()
    ie_three_sets()
    print("ok")
