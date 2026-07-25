"""Tier 1 illustrations: two pointers, binary search, prefix sum, sieve."""
import os
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))


# ---------------------------------------------------------------- 1. two pointers
def two_pointers():
    a = [2, 4, 5, 7, 9, 11, 13]
    k = 16
    n = len(a)
    cw, ch, gap = 50, 46, 8
    x0 = 34
    steps = []
    left, right = 0, n - 1
    while left < right:
        s = a[left] + a[right]
        if s == k:
            steps.append((left, right, "eq"))
            break
        elif s > k:
            steps.append((left, right, "gt"))
            right -= 1
        else:
            steps.append((left, right, "lt"))
            left += 1

    rows = len(steps)
    top = 100
    row_pitch = 84
    h = top + rows * row_pitch + 60
    fig, ax = canvas(h)
    title(ax, f"Two Pointers  -  find two elements with a[left] + a[right] = k = {k}")

    # index strip
    iy = top - 40
    for i in range(n):
        cx = x0 + i * (cw + gap) + cw / 2
        label(ax, cx, iy, f"a[{i}]", size=7.5, color=MUTE, ha="center")

    for r, (left, right, kind) in enumerate(steps):
        y = top + r * row_pitch
        for i, v in enumerate(a):
            x = x0 + i * (cw + gap)
            if i < left or i > right:
                cell(ax, x, y, cw, ch, v, face=GREY, tcolor="#9AA0A6", lw=1.8)
            elif i == left or i == right:
                if kind == "eq":
                    face = GREEN
                else:
                    face = BLUE if i == left else CORAL
                cell(ax, x, y, cw, ch, v, face=face, tcolor=WHITE)
            else:
                cell(ax, x, y, cw, ch, v, face=LAV, edge=PURPLE, tcolor=INK2)

        # pointer labels above the row
        entries = []
        for i, name, col in ((left, "left", BLUE), (right, "right", CORAL)):
            cx = x0 + i * (cw + gap) + cw / 2
            entries.append((cx, name, GREEN if kind == "eq" else col))
        pointer_labels(ax, entries, y)

        # verdict text
        tx = x0 + n * (cw + gap) + 20
        s = a[left] + a[right]
        cy = y + ch / 2
        if kind == "eq":
            mono(ax, tx, cy - 12, f"{a[left]} + {a[right]} = {s}", size=10,
                 color=GREEN, weight="bold")
            label(ax, tx, cy + 12, "found it!", size=9.5, color=GREEN,
                  weight="bold")
        elif kind == "gt":
            mono(ax, tx, cy - 12, f"{a[left]} + {a[right]} = {s} > {k}", size=10,
                 color=INK2)
            mono(ax, tx, cy + 12, "right = right - 1", size=9, color=CORAL)
        else:
            mono(ax, tx, cy - 12, f"{a[left]} + {a[right]} = {s} < {k}", size=10,
                 color=INK2)
            mono(ax, tx, cy + 12, "left = left + 1", size=9, color=BLUE)

    legend(ax, h - 24, [
        (BLUE, None, "left"),
        (CORAL, None, "right"),
        (GREEN, None, "sum = k"),
        (GREY, None, "already ruled out"),
    ])
    save(fig, os.path.join(OUT, "two-pointers.png"))


# ---------------------------------------------------------------- 2. binary search
def binary_search():
    a = [1, 3, 4, 6, 8, 10, 12, 15, 18, 21]
    k = 12
    n = len(a)
    cw, ch, gap = 46, 46, 6
    x0 = 28
    steps = []
    left, right = 0, n - 1
    while left <= right:
        mid = (left + right) // 2
        if a[mid] == k:
            steps.append((left, right, mid, "eq"))
            break
        elif k > a[mid]:
            steps.append((left, right, mid, "gt"))
            left = mid + 1
        else:
            steps.append((left, right, mid, "lt"))
            right = mid - 1

    rows = len(steps)
    top = 104
    row_pitch = 90
    h = top + rows * row_pitch + 60
    fig, ax = canvas(h)
    title(ax, f"Binary Search  -  looking for k = {k} in a sorted array")

    iy = top - 46
    for i in range(n):
        cx = x0 + i * (cw + gap) + cw / 2
        label(ax, cx, iy, str(i), size=7.5, color=MUTE, ha="center")

    for r, (left, right, mid, kind) in enumerate(steps):
        y = top + r * row_pitch
        for i, v in enumerate(a):
            x = x0 + i * (cw + gap)
            if i < left or i > right:
                cell(ax, x, y, cw, ch, v, face=GREY, tcolor="#9AA0A6")
            elif i == mid:
                face = GREEN if kind == "eq" else AMBER
                cell(ax, x, y, cw, ch, v, face=face, tcolor=WHITE)
            else:
                cell(ax, x, y, cw, ch, v, face=LAV, edge=PURPLE, tcolor=INK2)

        seen = {}
        for i, name, col in ((left, "left", BLUE), (mid, "middle", AMBER),
                             (right, "right", CORAL)):
            seen.setdefault(i, []).append((name, col))
        entries = []
        for i, group in seen.items():
            cx = x0 + i * (cw + gap) + cw / 2
            txt = " = ".join(e[0] for e in group)
            col = group[0][1] if len(group) == 1 else INK2
            entries.append((cx, txt, col))
        pointer_labels(ax, entries, y, size=8.5, level_gap=17)

        tx = x0 + n * (cw + gap) + 22
        cy = y + ch / 2
        if kind == "eq":
            mono(ax, tx, cy - 12, f"a[{mid}] = {a[mid]} = k", size=10,
                 color=GREEN, weight="bold")
            label(ax, tx, cy + 12, "found it!", size=9.5, color=GREEN,
                  weight="bold")
        elif kind == "gt":
            mono(ax, tx, cy - 12, f"k > a[{mid}] = {a[mid]}", size=10, color=INK2)
            mono(ax, tx, cy + 12, "left = middle + 1", size=9, color=BLUE)
        else:
            mono(ax, tx, cy - 12, f"k < a[{mid}] = {a[mid]}", size=10, color=INK2)
            mono(ax, tx, cy + 12, "right = middle - 1", size=9, color=CORAL)

    legend(ax, h - 24, [
        (AMBER, None, "middle"),
        (LAV, PURPLE, "still possible"),
        (GREY, None, "discarded half"),
        (GREEN, None, "k found"),
    ])
    save(fig, os.path.join(OUT, "binary-search.png"))


# ---------------------------------------------------------------- 3. prefix sum
def prefix_sum():
    a = [6, 7, 10, 3, -3, 5]
    n = len(a)
    sums = []
    t = 0
    for v in a:
        t += v
        sums.append(t)
    lo, hi = 2, 4

    cw, ch, gap = 72, 44, 8
    x0 = 122
    h = 350
    fig, ax = canvas(h)
    title(ax, "Prefix Sum  -  the sum of any range in O(1)")

    iy = 60
    for i in range(n):
        cx = x0 + i * (cw + gap) + cw / 2
        label(ax, cx, iy, f"i = {i}", size=8, color=MUTE, ha="center")

    ya = 76
    ys = 186
    label(ax, x0 - 18, ya + ch / 2, "a", size=13, color=INK, ha="right",
          weight="bold")
    mono(ax, x0 - 18, ys + ch / 2, "sums", size=11, color=INK, ha="right",
         weight="bold")

    for i, v in enumerate(a):
        x = x0 + i * (cw + gap)
        inrange = lo <= i <= hi
        cell(ax, x, ya, cw, ch, v,
             face=GREEN if inrange else LAV,
             edge=None if inrange else PURPLE,
             tcolor=WHITE if inrange else INK2, size=12)

    # running-total arrows between the two rows
    for i in range(n):
        cx = x0 + i * (cw + gap) + cw / 2
        arrow(ax, cx, ya + ch + 6, cx, ys - 8, color="#C9CFD6", lw=1.3, ms=7)
    ax.text(W / 2, 152, "sums[i] = a[0] + a[1] + ... + a[i]", ha="center",
            va="center", fontsize=9, color=MUTE, zorder=7,
            bbox=dict(boxstyle="round,pad=0.34", facecolor=WHITE,
                      edgecolor="none"))

    for i, v in enumerate(sums):
        x = x0 + i * (cw + gap)
        if i == hi:
            cell(ax, x, ys, cw, ch, v, face=GREEN, tcolor=WHITE, size=12)
        elif i == lo - 1:
            cell(ax, x, ys, cw, ch, v, face=CORAL, tcolor=WHITE, size=12)
        else:
            cell(ax, x, ys, cw, ch, v, face=BLUE, tcolor=WHITE, size=12)

    for i, name, col in ((lo - 1, "sums[1]", CORAL), (hi, "sums[4]", GREEN)):
        cx = x0 + i * (cw + gap) + cw / 2
        caret(ax, cx, ys + ch + 6, col, up=False, size=5)
        mono(ax, cx, ys + ch + 22, name, size=8.5, color=col, ha="center",
             weight="bold")

    mono(ax, W / 2, 300, "Sum(2 to 4)  =  sums[4] - sums[1]  =  23 - 13  =  10",
         size=11, color=INK, ha="center", weight="bold")
    label(ax, W / 2, 324, "10 + 3 + (-3) = 10   -  the same answer, but in one subtraction",
          size=8.5, color=MUTE, ha="center")
    save(fig, os.path.join(OUT, "prefix-sum.png"))


# ---------------------------------------------------------------- 4. sieve
def sieve():
    n = 30
    nums = list(range(2, n + 1))
    cw, chh, gap = 24, 38, 2
    x0 = (W - (len(nums) * cw + (len(nums) - 1) * gap)) / 2

    passes = [
        (None, "Write down every number from 2 to 30"),
        (2, "2 is untouched  =>  prime. Cross out 4, 6, 8, 10 ..."),
        (3, "3 is untouched  =>  prime. Cross out 9, 15, 21, 27 ..."),
        (5, "5 is untouched  =>  prime. Cross out 25  ( 5 * 5 > 30, so we stop )"),
    ]
    colour = {2: BLUE, 3: GREEN, 5: AMBER}

    top = 84
    pitch = 88
    h = top + len(passes) * pitch + 84
    fig, ax = canvas(h)
    title(ax, "Sieve of Eratosthenes  -  crossing out the multiples")

    crossed = {}
    for r, (p, caption) in enumerate(passes):
        y = top + r * pitch
        last = r == len(passes) - 1
        if p is not None:
            for m in range(p * p, n + 1, p):
                crossed.setdefault(m, p)
        label(ax, x0, y - 18, caption, size=9, color=MUTE, ha="left")
        for i, v in enumerate(nums):
            x = x0 + i * (cw + gap)
            by = crossed.get(v)
            if by is not None:
                cell(ax, x, y, cw, chh, v, face=colour[by], tcolor=WHITE,
                     size=9.5, lw=1.5, r=6, strike=True)
            elif last or (p is not None and v == p):
                # on the final pass every survivor is a confirmed prime
                cell(ax, x, y, cw, chh, v, face=LAV, edge=PURPLE, tcolor=INK2,
                     size=9.5, lw=1.9, r=6)
            else:
                cell(ax, x, y, cw, chh, v, face=WHITE, edge="#D5DAE0",
                     tcolor=INK2, size=9.5, lw=1.5, r=6)

    fy = top + len(passes) * pitch - 6
    survivors = [v for v in nums if v not in crossed]
    label(ax, W / 2, fy, "Everything that survived is prime:", size=9.5,
          color=INK2, ha="center")
    mono(ax, W / 2, fy + 26, "  ".join(str(v) for v in survivors), size=11.5,
         color=PURPLE, ha="center", weight="bold")

    legend(ax, h - 24, [
        (BLUE, None, "crossed out by 2"),
        (GREEN, None, "by 3"),
        (AMBER, None, "by 5"),
        (LAV, PURPLE, "prime"),
    ])
    save(fig, os.path.join(OUT, "sieve-of-eratosthenes.png"))


if __name__ == "__main__":
    two_pointers()
    binary_search()
    prefix_sum()
    sieve()
    print("ok")
