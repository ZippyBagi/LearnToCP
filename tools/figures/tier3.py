"""Tier 3 illustrations: fibonacci memoisation, binary exponentiation,
lower/upper_bound, prime factor tree, greedy failure, gcd divisor overlap."""
import os
from matplotlib.patches import Circle
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))


# ---------------------------------------------------------------- 11. fibonacci
def fibonacci_memo():
    h = 456
    fig, ax = canvas(h)
    title(ax, "Dynamic Programming  -  the same subproblem, over and over")

    nw, nh = 62, 34
    # (label, depth, x_center, state)  state: calc | hit | base
    lv = [64, 128, 192, 256, 320]
    nodes = {
        "f(5)": (lv[0], 392, "calc"),
        "f(4)": (lv[1], 286, "calc"),
        "f(3)r": (lv[1], 520, "hit"),
        "f(3)": (lv[2], 208, "calc"),
        "f(2)r": (lv[2], 372, "hit"),
        "f(2)": (lv[3], 150, "calc"),
        "f(1)r": (lv[3], 268, "base"),
        "f(1)": (lv[4], 104, "base"),
        "f(0)": (lv[4], 200, "base"),
    }
    text_of = {k: k.rstrip("r") for k in nodes}
    edges = [("f(5)", "f(4)"), ("f(5)", "f(3)r"),
             ("f(4)", "f(3)"), ("f(4)", "f(2)r"),
             ("f(3)", "f(2)"), ("f(3)", "f(1)r"),
             ("f(2)", "f(1)"), ("f(2)", "f(0)")]

    for a, b in edges:
        ya, xa, _ = nodes[a]
        yb, xb, _ = nodes[b]
        ax.plot([xa, xb], [ya + nh / 2, yb - nh / 2], color="#C9CFD6", lw=1.5,
                zorder=1)

    style_of = {
        "calc": (LAV, PURPLE, INK2),
        "hit": (AMBER, None, WHITE),
        "base": (GREEN, None, WHITE),
    }
    for key, (y, x, state) in nodes.items():
        face, ed, tc = style_of[state]
        cell(ax, x - nw / 2, y - nh / 2, nw, nh, text_of[key], face=face,
             edge=ed, tcolor=tc, size=11)

    # annotate the memo hits
    for key in ("f(3)r", "f(2)r"):
        y, x, _ = nodes[key]
        label(ax, x + nw / 2 + 12, y, "already in memo", size=8.5,
              color=AMBER, ha="left", weight="bold")

    label(ax, W / 2, 372,
          "Every value is computed exactly once and then read from memo.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, 396,
          "Without it, the orange branches get rebuilt from scratch and the tree doubles with every n.",
          size=9, color=MUTE, ha="center")

    legend(ax, h - 22, [
        (LAV, PURPLE, "computed once"),
        (AMBER, None, "memo hit"),
        (GREEN, None, "base case"),
    ])
    save(fig, os.path.join(OUT, "dp-memoization.png"))


# ---------------------------------------------------------------- 12. binary exp
def binary_exponentiation():
    h = 424
    fig, ax = canvas(h)
    title(ax, "Binary Exponentiation  -  halving the exponent")

    rows = [
        ("3^10", "b is even", "3^10 = (3*3)^5 = 9^5", BLUE),
        ("9^5", "b is odd", "9^5 = 9 * 9^4", AMBER),
        ("9^4", "b is even", "9^4 = (9*9)^2 = 81^2", BLUE),
        ("81^2", "b is even", "81^2 = (81*81)^1 = 6561^1", BLUE),
        ("6561^1", "b is odd", "6561^1 = 6561 * 6561^0", AMBER),
    ]
    y0 = 72
    pitch = 40
    bw = 96
    x0 = 54
    for r, (expr, why, action, col) in enumerate(rows):
        y = y0 + r * pitch
        cell(ax, x0, y, bw, 30, expr, face=col, tcolor=WHITE, size=11, r=5)
        label(ax, x0 + bw + 18, y + 15, why, size=8.5, color=col, ha="left",
              weight="bold")
        mono(ax, x0 + bw + 116, y + 15, action, size=9.5, color=INK2, ha="left")
        if r < len(rows) - 1:
            arrow(ax, x0 + bw / 2, y + 32, x0 + bw / 2, y + pitch - 2,
                  color="#C9CFD6", lw=1.5, ms=8)

    ry = y0 + len(rows) * pitch + 14
    ax.plot([x0, W - 54], [ry, ry], color="#E1E5EA", lw=1.6)
    mono(ax, x0, ry + 26, "3^10  =  ( 3 * (3 * 3)^2 )^2  =  59049", size=12,
         color=INK, ha="left", weight="bold")
    label(ax, x0, ry + 52,
          "5 multiplications instead of 10  -  and for b = 10^9 it is 30 instead of a billion.",
          size=9.5, color=MUTE, ha="left")

    legend(ax, h - 24, [
        (BLUE, None, "b is even:  a = a * a,  b = b / 2"),
        (AMBER, None, "b is odd:  ans = ans * a,  b = b - 1"),
    ], size=8.5)
    save(fig, os.path.join(OUT, "binary-exponentiation.png"))


# ---------------------------------------------------------------- 13. bounds
def bounds():
    a = [1, 3, 3, 5, 8, 10]
    k = 3
    h = 330
    fig, ax = canvas(h)
    title(ax, "lower_bound and upper_bound  -  where the block of k begins and ends")

    cw, chh, gap = 78, 48, 8
    total = len(a) * cw + (len(a) - 1) * gap
    x0 = (W - total) / 2
    y = 116

    for i, v in enumerate(a):
        x = x0 + i * (cw + gap)
        eq = v == k
        cell(ax, x, y, cw, chh, v, face=GREEN if eq else LAV,
             edge=None if eq else PURPLE, tcolor=WHITE if eq else INK2, size=15)
        label(ax, x + cw / 2, y - 18, str(i), size=8.5, color=MUTE, ha="center")

    lb = 1   # first element >= 3
    ub = 3   # first element  > 3
    for idx, name, col in ((lb, "lower_bound", BLUE), (ub, "upper_bound", CORAL)):
        bx = x0 + idx * (cw + gap) - gap / 2
        ax.plot([bx, bx], [y - 8, y + chh + 14], color=col, lw=2.4,
                zorder=5, solid_capstyle="round")
        mono(ax, bx, y + chh + 32, name, size=9.5, color=col, ha="center",
             weight="bold")
        mono(ax, bx, y + chh + 50, f"index {idx}", size=8.5, color=col,
             ha="center")

    label(ax, W / 2, 254,
          "lower_bound points at the start of the 3's, upper_bound just past their end.",
          size=9.5, color=INK2, ha="center")
    mono(ax, W / 2, 288, "upper_bound - lower_bound  =  3 - 1  =  2   ( how many 3's )",
         size=10, color=PURPLE, ha="center", weight="bold")
    save(fig, os.path.join(OUT, "lower-upper-bound.png"))


# ---------------------------------------------------------------- 14. factor tree
def factor_tree():
    h = 424
    fig, ax = canvas(h)
    title(ax, "Prime factorization  -  keep dividing until only primes are left")

    nw, nh = 66, 32
    # chain of (composite, prime pulled out, remaining quotient)
    chain = [(360, 2, 180), (180, 2, 90), (90, 2, 45), (45, 3, 15),
             (15, 3, 5)]
    y0, pitch, dx = 62, 46, 62
    rx = 208                      # x of the root
    xs = [rx + i * dx for i in range(len(chain) + 1)]

    def node(x, y, txt, prime):
        cell(ax, x - nw / 2, y - nh / 2, nw, nh, txt,
             face=PURPLE if prime else LAV,
             edge=None if prime else PURPLE,
             tcolor=WHITE if prime else INK2, size=12)

    for i, (comp, p, q) in enumerate(chain):
        y = y0 + i * pitch
        ny = y + pitch
        xc, xq = xs[i], xs[i + 1]
        xp = xc - dx
        ax.plot([xc, xp], [y + nh / 2, ny - nh / 2], color="#C9CFD6", lw=1.5,
                zorder=1)
        ax.plot([xc, xq], [y + nh / 2, ny - nh / 2], color="#C9CFD6", lw=1.5,
                zorder=1)
        node(xc, y, comp, False)
        node(xp, ny, p, True)
        mono(ax, xc + nw / 2 + 10, y, f"/ {p}", size=8, color=MUTE, ha="left")

    # the final quotient is itself prime
    fy = y0 + len(chain) * pitch
    node(xs[-1], fy, chain[-1][2], True)

    sy = fy + 44
    mono(ax, W / 2, sy, "360  =  2 * 2 * 2 * 3 * 3 * 5", size=14, color=INK,
         ha="center", weight="bold")
    label(ax, W / 2, sy + 26,
          "Every number breaks down into primes in exactly one way.",
          size=9.5, color=MUTE, ha="center")

    legend(ax, h - 22, [
        (PURPLE, None, "prime factor"),
        (LAV, PURPLE, "still divisible"),
    ])
    save(fig, os.path.join(OUT, "prime-factor-tree.png"))


# ---------------------------------------------------------------- 15. greedy fails
def greedy_fails():
    h = 308
    fig, ax = canvas(h)
    title(ax, "When greedy fails  -  coins { 4, 3, 1 },  k = 6")

    cw, chh, gap = 62, 46, 12

    def row(y, coins, colour, tag, tagcol, note):
        mono(ax, 156, y + chh / 2, tag, size=10.5, color=tagcol, ha="right",
             weight="bold")
        x = 180
        for i, c in enumerate(coins):
            cell(ax, x, y, cw, chh, c, face=colour, tcolor=WHITE, size=15)
            x += cw
            if i < len(coins) - 1:
                mono(ax, x + gap / 2, y + chh / 2, "+", size=12, color=MUTE,
                     ha="center", weight="bold")
                x += gap
        mono(ax, x + 16, y + chh / 2, "= 6", size=12, color=INK2, ha="left",
             weight="bold")
        label(ax, x + 80, y + chh / 2, note, size=9.5, color=tagcol, ha="left",
              weight="bold")

    row(84, [4, 1, 1], CORAL, "greedy:", CORAL, "3 coins")
    row(168, [3, 3], GREEN, "best:", GREEN, "2 coins")

    label(ax, W / 2, 254,
          "Greedy grabs the 4 first, and then 2 is only reachable as 1 + 1.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, 278,
          "The strategy is only as good as the coin values - always check it before using it.",
          size=9, color=MUTE, ha="center")
    save(fig, os.path.join(OUT, "greedy-fails.png"))


# ---------------------------------------------------------------- 16. gcd
def gcd_divisors():
    h = 412
    fig, ax = canvas(h)
    title(ax, "GCD and LCM  -  the divisors 12 and 18 share")

    d12 = [1, 2, 3, 4, 6, 12]
    d18 = [1, 2, 3, 6, 9, 18]
    shared = sorted(set(d12) & set(d18))

    cw, chh, gap = 56, 40, 10
    y1, y2 = 88, 168
    for tag, divs, y in (("12", d12, y1), ("18", d18, y2)):
        mono(ax, 176, y + chh / 2, f"divisors of {tag}", size=9.5, color=INK2,
             ha="right", weight="bold")
        total = len(divs) * cw + (len(divs) - 1) * gap
        x0 = 200
        for i, d in enumerate(divs):
            x = x0 + i * (cw + gap)
            common = d in shared
            biggest = d == max(shared)
            cell(ax, x, y, cw, chh, d,
                 face=GREEN if biggest else (BLUE if common else LAV),
                 edge=None if common else PURPLE,
                 tcolor=WHITE if common else INK2, size=12)

    label(ax, 200, 236, "shared divisors: 1, 2, 3, 6  -  the greatest of them is 6",
          size=9.5, color=INK2, ha="left")

    box_y = 268
    rbox(ax, 96, box_y, 264, 52, face=LAV, edge=PURPLE, lw=1.8, r=8)
    mono(ax, 228, box_y + 26, "GCD(12, 18) = 6", size=13, color=INK,
         ha="center", weight="bold")
    rbox(ax, 424, box_y, 264, 52, face=LAV, edge=PURPLE, lw=1.8, r=8)
    mono(ax, 556, box_y + 26, "LCM(12, 18) = 36", size=13, color=INK,
         ha="center", weight="bold")
    mono(ax, W / 2, box_y + 74, "a * b  =  GCD(a, b) * LCM(a, b)", size=10.5,
         color=PURPLE, ha="center", weight="bold")

    legend(ax, h - 22, [
        (BLUE, None, "common divisor"),
        (GREEN, None, "greatest common divisor"),
    ])
    save(fig, os.path.join(OUT, "gcd-lcm.png"))


if __name__ == "__main__":
    fibonacci_memo()
    binary_exponentiation()
    bounds()
    factor_tree()
    greedy_fails()
    gcd_divisors()
    print("ok")
