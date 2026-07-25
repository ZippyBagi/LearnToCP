"""Tier 2 illustrations: stack, queue, radix buckets, binary place value,
bitwise operations, divisor pairs."""
import os
from matplotlib.patches import Arc
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))


# ---------------------------------------------------------------- 5. stack
def stack():
    h = 356
    fig, ax = canvas(h)
    title(ax, "Stack  -  LIFO, everything happens at the top")

    base = 250          # baseline (bottom of the stack)
    cw, chh = 84, 36
    snaps = [
        ([3], "st.push(3)"),
        ([3, 7], "st.push(7)"),
        ([3, 7, 5], "st.push(5)"),
        ([3, 7], "st.pop()"),
        ([3, 7, 9], "st.push(9)"),
    ]
    pitch = 148
    x0 = 40
    for s, (items, cap) in enumerate(snaps):
        x = x0 + s * pitch
        # floor line
        ax.plot([x - 6, x + cw + 6], [base + 4, base + 4], color="#C9CFD6",
                lw=2.4, solid_capstyle="round", zorder=1)
        for d, v in enumerate(items):
            y = base - (d + 1) * chh
            is_top = d == len(items) - 1
            cell(ax, x, y, cw, chh, v,
                 face=BLUE if is_top else LAV,
                 edge=None if is_top else PURPLE,
                 tcolor=WHITE if is_top else INK2, size=13)
        ty = base - len(items) * chh
        mono(ax, x + cw / 2, ty - 16, "top()", size=8.5, color=BLUE,
             ha="center", weight="bold")
        caret(ax, x + cw / 2, ty - 6, BLUE, up=False, size=5)
        mono(ax, x + cw / 2, base + 26, cap, size=9, color=INK2, ha="center")
        if s < len(snaps) - 1:
            arrow(ax, x + cw + 20, base - 30, x + pitch - 20, base - 30,
                  color="#C9CFD6", lw=1.6, ms=9)

    # push / pop only at the top
    hx = x0 + 2 * pitch + cw / 2
    arrow(ax, hx - 38, 78, hx - 12, 106, color=GREEN, lw=1.8, ms=9)
    arrow(ax, hx + 12, 106, hx + 38, 78, color=CORAL, lw=1.8, ms=9)
    mono(ax, hx - 44, 68, "push", size=9, color=GREEN, ha="center", weight="bold")
    mono(ax, hx + 44, 68, "pop", size=9, color=CORAL, ha="center", weight="bold")

    label(ax, W / 2, h - 44,
          "The last element that came in is the first one to come out.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 22,
          "Nothing below the top can be read or removed.",
          size=9, color=MUTE, ha="center")
    save(fig, os.path.join(OUT, "stack.png"))


# ---------------------------------------------------------------- 6. queue
def queue():
    h = 336
    fig, ax = canvas(h)
    title(ax, "Queue  -  FIFO, in at the back, out at the front")

    items = [3, 7, 5, 9]
    cw, chh, gap = 76, 46, 8
    total = len(items) * cw + (len(items) - 1) * gap
    x0 = (W - total) / 2
    y = 116

    for i, v in enumerate(items):
        x = x0 + i * (cw + gap)
        if i == 0:
            face, tc, ed = GREEN, WHITE, None
        elif i == len(items) - 1:
            face, tc, ed = BLUE, WHITE, None
        else:
            face, tc, ed = LAV, INK2, PURPLE
        cell(ax, x, y, cw, chh, v, face=face, edge=ed, tcolor=tc, size=14)

    mono(ax, x0 + cw / 2, y - 30, "front()", size=9, color=GREEN, ha="center",
         weight="bold")
    caret(ax, x0 + cw / 2, y - 8, GREEN, up=False, size=5)
    bx = x0 + (len(items) - 1) * (cw + gap) + cw / 2
    mono(ax, bx, y - 30, "back()", size=9, color=BLUE, ha="center", weight="bold")
    caret(ax, bx, y - 8, BLUE, up=False, size=5)

    # out at the front
    arrow(ax, x0 - 14, y + chh / 2, x0 - 74, y + chh / 2, color=CORAL,
          lw=2.0, ms=11)
    mono(ax, x0 - 44, y + chh / 2 - 16, "pop()", size=9, color=CORAL,
         ha="center", weight="bold")
    # in at the back
    xb = x0 + total
    arrow(ax, xb + 74, y + chh / 2, xb + 14, y + chh / 2, color=GREEN,
          lw=2.0, ms=11)
    mono(ax, xb + 44, y + chh / 2 - 16, "push(x)", size=9, color=GREEN,
         ha="center", weight="bold")

    # order in / order out
    oy = 216
    label(ax, W / 2, oy, "The order never changes:", size=9.5, color=INK2,
          ha="center")
    for r, (tag, col) in enumerate((("push", GREEN), ("pop", CORAL))):
        ry = oy + 34 + r * 42
        mono(ax, 300, ry, f"{tag}:", size=10, color=col, ha="right",
             weight="bold")
        for i, v in enumerate(items):
            cx = 332 + i * 62
            cell(ax, cx - 18, ry - 15, 36, 30, v, face=WHITE, edge="#D5DAE0",
                 tcolor=INK2, size=11, lw=1.5, r=5)
            if i < len(items) - 1:
                arrow(ax, cx + 22, ry, cx + 40, ry, color="#C9CFD6", lw=1.4,
                      ms=8)
    save(fig, os.path.join(OUT, "queue.png"))


# ---------------------------------------------------------------- 7. radix buckets
def radix_buckets():
    a = [170, 45, 75, 90, 802, 24, 2, 66]
    place = 1
    buckets = [[] for _ in range(10)]
    for v in a:
        buckets[(v // place) % 10].append(v)
    after = [v for b in buckets for v in b]
    stable = {802, 2}

    h = 430
    fig, ax = canvas(h)
    title(ax, "Radix Sort  -  one pass, sorting by the ones digit")

    # before
    cw, chh, gap = 62, 38, 8
    total = len(a) * cw + (len(a) - 1) * gap
    x0 = (W - total) / 2
    y1 = 68
    for i, v in enumerate(a):
        x = x0 + i * (cw + gap)
        hi = v in stable
        cell(ax, x, y1, cw, chh, v, face=GREEN if hi else LAV,
             edge=None if hi else PURPLE, tcolor=WHITE if hi else INK2, size=11)
        d = (v // place) % 10
        mono(ax, x + cw / 2, y1 + chh + 14, f"digit {d}", size=7.5, color=MUTE,
             ha="center")

    # buckets
    bw, bpitch = 68, 74
    bx0 = (W - (10 * bw + 9 * (bpitch - bw))) / 2
    yb = 172
    slot = 26
    bh = 12 + 2 * slot
    for d in range(10):
        x = bx0 + d * bpitch
        rbox(ax, x, yb, bw, bh, face="#F7F9FC", edge="#D5DAE0", lw=1.6, r=6, z=1)
        mono(ax, x + bw / 2, yb + bh + 14, f"[{d}]", size=8.5, color=MUTE,
             ha="center")
        for j, v in enumerate(buckets[d]):
            hi = v in stable
            cell(ax, x + 7, yb + 6 + j * slot, bw - 14, slot - 4, v,
                 face=GREEN if hi else BLUE, tcolor=WHITE, size=9.5, lw=1.4,
                 r=4, z=3)
    mono(ax, bx0, yb - 14, "buckets", size=9.5, color=INK2, ha="left",
         weight="bold")

    # after
    y2 = 300
    for i, v in enumerate(after):
        x = x0 + i * (cw + gap)
        hi = v in stable
        cell(ax, x, y2, cw, chh, v, face=GREEN if hi else BLUE, tcolor=WHITE,
             size=11)
    label(ax, x0, y2 - 14, "back into the array, bucket 0 first",
          size=8.5, color=MUTE, ha="left")

    label(ax, W / 2, 372,
          "802 and 2 both land in bucket 2 - and they leave in the order they arrived.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, 396, "That is what makes the sort stable.",
          size=9, color=MUTE, ha="center")
    save(fig, os.path.join(OUT, "radix-buckets.png"))


# ---------------------------------------------------------------- 8. place value
def binary_place_value():
    bits = [1, 0, 0, 1, 1, 1, 0, 1]
    weights = [128, 64, 32, 16, 8, 4, 2, 1]
    h = 288
    fig, ax = canvas(h)
    title(ax, "Binary to decimal  -  every position is a power of 2")

    cw, chh, gap = 62, 48, 8
    total = len(bits) * cw + (len(bits) - 1) * gap
    x0 = (W - total) / 2
    y = 82
    for i, (b, wt) in enumerate(zip(bits, weights)):
        x = x0 + i * (cw + gap)
        on = b == 1
        cell(ax, x, y, cw, chh, b, face=BLUE if on else GREY,
             tcolor=WHITE if on else "#9AA0A6", size=17)
        mono(ax, x + cw / 2, y - 16, f"2^{7 - i}", size=8.5, color=MUTE,
             ha="center")
        ax.text(x + cw / 2, y + chh + 20, str(wt), ha="center", va="center",
                fontsize=11, fontweight="bold",
                color=BLUE if on else "#B8BEC6", zorder=6)

    ax.plot([x0, x0 + total], [y + chh + 38, y + chh + 38], color="#E1E5EA",
            lw=1.6)
    label(ax, W / 2, y + chh + 60,
          "Only the positions holding a 1 count. Add them up:",
          size=9.5, color=INK2, ha="center")
    mono(ax, W / 2, y + chh + 90, "128 + 16 + 8 + 4 + 1  =  157", size=14,
         color=INK, ha="center", weight="bold")
    mono(ax, W / 2, y + chh + 118, "1001 1101  =  157", size=11, color=PURPLE,
         ha="center", weight="bold")
    save(fig, os.path.join(OUT, "binary-place-value.png"))


# ---------------------------------------------------------------- 9. bitwise ops
def bitwise_ops():
    A = [1, 0, 0, 1]
    B = [1, 1, 1, 0]
    panels = [
        ("AND   ( & )", "both bits 1", [a & b for a, b in zip(A, B)], True),
        ("OR   ( | )", "at least one 1", [a | b for a, b in zip(A, B)], True),
        ("XOR   ( ^ )", "bits are different", [a ^ b for a, b in zip(A, B)], True),
        ("NOT   ( ~ )", "every bit flipped", [1 - a for a in A], False),
    ]
    h = 430
    fig, ax = canvas(h)
    title(ax, "Bitwise operations  -  one bit at a time")

    bw, bh, bgap = 34, 30, 6
    row_gap = 34
    for p, (name, rule, res, two) in enumerate(panels):
        px = 56 + (p % 2) * 392
        py = 76 + (p // 2) * 178
        mono(ax, px, py, name, size=11, color=INK, ha="left", weight="bold")
        label(ax, px + 128, py + 1, rule, size=8.5, color=MUTE, ha="left")

        rows = [("a", A, LAV, PURPLE)]
        if two:
            rows.append(("b", B, LAV, PURPLE))
        for r, (tag, vals, face, ed) in enumerate(rows):
            ry = py + 18 + r * row_gap
            mono(ax, px - 10, ry + bh / 2, tag, size=10, color=INK2, ha="right",
                 weight="bold")
            for i, v in enumerate(vals):
                cell(ax, px + i * (bw + bgap), ry, bw, bh, v, face=face,
                     edge=ed, tcolor=INK2, size=11, lw=1.6, r=5)

        sep_y = py + 18 + len(rows) * row_gap + 4
        wtot = 4 * bw + 3 * bgap
        ax.plot([px - 14, px + wtot], [sep_y, sep_y], color="#D5DAE0", lw=1.6)
        ry = sep_y + 10
        mono(ax, px - 10, ry + bh / 2, "=", size=11, color=INK2, ha="right",
             weight="bold")
        for i, v in enumerate(res):
            on = v == 1
            cell(ax, px + i * (bw + bgap), ry, bw, bh, v,
                 face=BLUE if on else GREY,
                 tcolor=WHITE if on else "#9AA0A6", size=11, lw=1.6, r=5)

    label(ax, W / 2, h - 26,
          "The bits never mix between positions - column i only ever looks at column i.",
          size=9, color=MUTE, ha="center")
    save(fig, os.path.join(OUT, "bitwise-ops.png"))


# ---------------------------------------------------------------- 10. divisor pairs
def divisor_pairs():
    n = 36
    divs = [d for d in range(1, n + 1) if n % d == 0]
    root = 6
    h = 458
    fig, ax = canvas(h)
    title(ax, "Divisors come in pairs  -  why sqrt(n) is enough")

    cw, chh = 56, 40
    pitch = 78
    total = (len(divs) - 1) * pitch + cw
    x0 = (W - total) / 2
    y = 250
    cx = {d: x0 + i * pitch + cw / 2 for i, d in enumerate(divs)}

    # pairing arcs above the row.
    # NOTE: the y-axis is inverted, so theta 180..360 is the *upper* half.
    pairs = [(1, 36), (2, 18), (3, 12), (4, 9)]
    heights = [162, 126, 92, 60]
    for (lo, hi), ah in zip(pairs, heights):
        a, b = cx[lo], cx[hi]
        mid = (a + b) / 2
        ax.add_patch(Arc((mid, y - 6), abs(b - a), 2 * ah, angle=0,
                         theta1=180, theta2=360, edgecolor=PURPLE, lw=1.6,
                         zorder=3))
        ax.text(mid, y - 6 - ah, f"{lo} * {hi} = {n}", ha="center",
                va="center", fontsize=8.5, color=PURPLE, zorder=7,
                fontweight="bold",
                bbox=dict(boxstyle="round,pad=0.28", facecolor=WHITE,
                          edgecolor="none"))

    for d in divs:
        x = cx[d] - cw / 2
        if d < root:
            face, tc = BLUE, WHITE
        elif d == root:
            face, tc = GREEN, WHITE
        else:
            face, tc = CORAL, WHITE
        cell(ax, x, y, cw, chh, d, face=face, tcolor=tc, size=13)

    # sqrt fold marker
    fx = cx[root]
    ax.plot([fx, fx], [y + chh + 6, y + chh + 30], color=GREEN, lw=1.8,
            ls=(0, (4, 3)), zorder=4)
    mono(ax, fx, y + chh + 44, "6 * 6 = 36     sqrt(36) = 6", size=9.5,
         color=GREEN, ha="center", weight="bold")

    label(ax, W / 2, y + chh + 76,
          "Every divisor above sqrt(n) is paired with one below it.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, y + chh + 98,
          "So if n has a divisor at all, it has one that is <= sqrt(n).",
          size=9.5, color=MUTE, ha="center")

    legend(ax, h - 22, [
        (BLUE, None, "below sqrt(n)"),
        (GREEN, None, "sqrt(n)"),
        (CORAL, None, "above sqrt(n)"),
    ])
    save(fig, os.path.join(OUT, "divisor-pairs.png"))


if __name__ == "__main__":
    stack()
    queue()
    radix_buckets()
    binary_place_value()
    bitwise_ops()
    divisor_pairs()
    print("ok")
