"""Fenwick tree illustrations. Wide batch (1040 px), no titles - see the guide, section 2.

Every cell carries its own index as a small label inside the box, so the space
above a row is free for struck-out previous values.
"""
import os
import style
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))

WIDE = 1040
style.W = WIDE
W = WIDE

A = [None, 1, 2, 5, 3, -2, 8, -3]        # 1-indexed, as the lesson uses it
N = 7

CW, GAP, RH = 104, 8, 52
X0 = (WIDE - (8 * CW + 7 * GAP)) / 2


def lsb(k):
    return k & -k


TREE = {k: sum(A[k - lsb(k) + 1:k + 1]) for k in range(1, N + 1)}
COVER = {k: (k - lsb(k) + 1, k) for k in range(1, N + 1)}
LANE = {1: 0, 3: 0, 5: 0, 7: 0, 2: 1, 6: 1, 4: 2}


def col(i):
    return X0 + i * (CW + GAP)


def mid(i):
    return col(i) + CW / 2


def row(ax, y, values, faces=None, edges=None, labels=None):
    """One array row. `values` maps column -> value, `labels` overrides the
    small index printed under each value."""
    faces, edges, labels = faces or {}, edges or {}, labels or {}
    for i, v in values.items():
        face = faces.get(i, WHITE)
        tc = WHITE if face is GREEN else INK2
        cell(ax, col(i), y, CW, RH, "" if v is None else v, face=face,
             edge=edges.get(i, PURPLE), tcolor=tc,
             sub=str(labels.get(i, i)),
             subcolor=WHITE if face is GREEN else MUTE,
             size=14, subsize=8.5)


def hop(ax, x1, x2, y, dip, color, ls="-", lw=2.2, ms=13):
    """Arrow bowing DOWN by roughly `dip` px. The y axis is inverted, so a
    positive rad bows downward. Returns the lowest y, for label placement."""
    arrow(ax, x1, y, x2, y, color=color, lw=lw, ms=ms,
          rad=2.0 * dip / (x2 - x1), ls=ls)
    return y + dip


def old_value(ax, i, y, value):
    cx = mid(i)
    ax.text(cx, y, str(value), ha="center", va="center", fontsize=10,
            color=MUTE, zorder=6)
    half = len(str(value)) * 6 + 2
    ax.plot([cx - half, cx + half], [y, y], color=MUTE, lw=1.3, zorder=7)


def side_label(ax, y, text):
    mono(ax, X0 - 16, y + RH / 2, text, size=11, color=INK2, ha="right",
         weight="bold")


def bar(ax, l, r, y, h, face, text=None, tcolor=WHITE):
    x1, x2 = col(l), col(r) + CW
    rbox(ax, x1, y, x2 - x1, h, face=face, edge=None, r=6)
    if text is not None:
        ax.text(x2 - 16, y + h / 2, str(text), ha="center", va="center",
                fontsize=10, fontweight="bold", color=tcolor, zorder=6)


def dead_slot(ax, y, value=""):
    """Slot 0. It exists in the array but is never used, because 0 has no
    least significant bit."""
    cell(ax, col(0), y, CW, RH, value, face=GREY, edge=GREY, tcolor=MUTE,
         sub="0", subcolor=MUTE, size=14, subsize=8.5)


# ------------------------------------------------ 1. what each slot covers
def layout():
    fig, ax = canvas(268)

    row(ax, 20, {i: A[i] for i in range(1, N + 1)},
        edges={i: AMBER for i in range(1, N + 1)})
    side_label(ax, 20, "a")

    dead_slot(ax, 96)
    row(ax, 96, dict(TREE))
    side_label(ax, 96, "tree")

    for k in range(1, N + 1):
        l, r = COVER[k]
        bar(ax, l, r, 170 + LANE[k] * 30, 22, PURPLE, text=k)

    save(fig, os.path.join(OUT, "fenwick-segments.png"))


# ------------------------------------------------ 2. prefix sum walk
def prefix():
    fig, ax = canvas(296)

    k, chain = N, []
    while k > 0:
        chain.append(k)
        k -= lsb(k)

    dead_slot(ax, 20)
    row(ax, 20, dict(TREE),
        faces={i: GREEN for i in chain}, edges={i: GREEN for i in chain})
    side_label(ax, 20, "tree")

    for k in range(1, N + 1):
        l, r = COVER[k]
        on = k in chain
        bar(ax, l, r, 96 + LANE[k] * 30, 22,
            GREEN if on else GREY, text=k, tcolor=WHITE if on else MUTE)

    rbox(ax, WIDE / 2 - 200, 212, 400, 52, face=LAV, edge=PURPLE, lw=1.8, r=10)
    mono(ax, WIDE / 2, 238,
         "S(7) = " + " + ".join(str(TREE[c]) for c in chain) +
         f" = {sum(TREE[c] for c in chain)}",
         size=13, color=PURPLE, ha="center", weight="bold")

    save(fig, os.path.join(OUT, "fenwick-prefix-walk.png"))


# ------------------------------------------------ 3. update walk
def update():
    fig, ax = canvas(316)
    delta = 6
    chain, p = [], 3
    while p <= N:
        chain.append(p)
        p += lsb(p)

    a_new = {i: A[i] for i in range(1, N + 1)}
    a_new[3] = 11
    row(ax, 30, a_new, faces={3: AMBER},
        edges={i: AMBER for i in a_new})
    old_value(ax, 3, 18, 5)
    side_label(ax, 30, "a")

    vals = dict(TREE)
    for c in chain:
        vals[c] += delta
    dead_slot(ax, 112)
    row(ax, 112, vals,
        faces={c: AMBER for c in chain}, edges={c: AMBER for c in chain})
    for c in chain:
        old_value(ax, c, 100, TREE[c])
    side_label(ax, 112, "tree")

    for a_i, b_i in zip(chain, chain[1:]):
        low = hop(ax, mid(a_i), mid(b_i), 170, 30, AMBER)
        mono(ax, (mid(a_i) + mid(b_i)) / 2, low + 16, f"+{lsb(a_i)}", size=10,
             color=AMBER, ha="center", weight="bold")

    end_x = 1004
    hop(ax, mid(chain[-1]), end_x, 170, 34, MUTE, ls=(0, (4, 3)), lw=1.8,
        ms=12)
    mono(ax, end_x + 8, 184, str(chain[-1] + lsb(chain[-1])), size=10,
         color=MUTE, ha="left")

    rbox(ax, WIDE / 2 - 120, 244, 240, 48, face=LAV, edge=PURPLE, lw=1.8, r=10)
    mono(ax, WIDE / 2, 268, f"delta = +{delta}", size=13, color=PURPLE,
         ha="center", weight="bold")

    save(fig, os.path.join(OUT, "fenwick-update.png"))


# ------------------------------------------------ 4. build, step 1
def build_copy():
    fig, ax = canvas(236)

    row(ax, 20, {i: A[i + 1] for i in range(0, N)},
        edges={i: AMBER for i in range(0, N)})
    side_label(ax, 20, "a")

    for i in range(0, N):
        arrow(ax, mid(i) + 10, 78, mid(i + 1) - 10, 138, color=GRIDL, lw=2.0,
              ms=11)

    dead_slot(ax, 148, 0)
    row(ax, 148, {i: A[i] for i in range(1, N + 1)})
    side_label(ax, 148, "tree")

    save(fig, os.path.join(OUT, "fenwick-build-copy.png"))


# ------------------------------------------------ 5. build, step 2
def build_parents():
    fig, ax = canvas(216)

    start = {i: A[i] for i in range(1, N + 1)}
    changed = [k for k in TREE if TREE[k] != start[k]]

    dead_slot(ax, 30)
    row(ax, 30, dict(TREE),
        faces={k: GREEN for k in changed}, edges={k: GREEN for k in changed})
    for k in changed:
        old_value(ax, k, 18, start[k])
    side_label(ax, 30, "tree")

    for k in range(1, N + 1):
        p = k + lsb(k)
        if p <= N:
            low = hop(ax, mid(k), mid(p), 88, 26 + 14 * (p - k > 1), GREEN)
            mono(ax, (mid(k) + mid(p)) / 2, low + 15, f"+{lsb(k)}", size=10,
                 color=GREEN, ha="center", weight="bold")
        else:
            hop(ax, mid(k), mid(k) + 58, 88, 18, MUTE, ls=(0, (4, 3)), lw=1.8,
                ms=11)

    save(fig, os.path.join(OUT, "fenwick-build-parents.png"))


if __name__ == "__main__":
    layout()
    prefix()
    update()
    build_copy()
    build_parents()
    print("ok")
