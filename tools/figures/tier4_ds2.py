"""Data Structures II illustrations: maps, sets, priority queue."""
import os
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))


# ------------------------------------------------------- 1. why a map at all
def map_vs_array():
    h = 400
    fig, ax = canvas(h)
    title(ax, "Why a map  -  storing only the keys we actually saw")

    # --- the array attempt
    mono(ax, 40, 66, "vector<int> cnt(1000000001)", size=10, color=INK2,
         ha="left", weight="bold")
    cw, chh, gap = 52, 40, 6
    x0 = 40
    y = 86
    small = [0, 1, 2, 3, 4, 5, 6, 7]
    for i, idx in enumerate(small):
        x = x0 + i * (cw + gap)
        used = idx == 5
        cell(ax, x, y, cw, chh, 3 if used else 0,
             face=BLUE if used else GREY,
             tcolor=WHITE if used else "#B0B6BE", size=12)
        mono(ax, x + cw / 2, y + chh + 15, str(idx), size=7.5,
             color=BLUE if used else MUTE, ha="center")

    ex = x0 + len(small) * (cw + gap)
    mono(ax, ex + 26, y + chh / 2, ". . .", size=13, color="#B0B6BE",
         ha="center")

    bx = ex + 62
    bw = 118
    cell(ax, bx, y, bw, chh, 2, face=BLUE, tcolor=WHITE, size=12)
    mono(ax, bx + bw / 2, y + chh + 15, "1000000000", size=7.5, color=BLUE,
         ha="center")

    label(ax, x0, y + chh + 44,
          "every slot has to exist - a billion of them, and exactly 2 are ever used",
          size=9, color=MUTE, ha="left")

    # --- the map
    my = 244
    mono(ax, 40, my - 20, "map<int,int> cnt", size=10, color=INK2, ha="left",
         weight="bold")
    rbox(ax, 40, my, 396, 74, face="#F7F9FC", edge="#D5DAE0", lw=1.6, r=8, z=1)
    rows = [(5, 3), (1000000000, 2)]
    for r, (k, v) in enumerate(rows):
        ry = my + 10 + r * 28
        cell(ax, 54, ry, 132, 24, k, face=LAV, edge=PURPLE, tcolor=INK2,
             size=10, lw=1.6, r=5, z=3)
        arrow(ax, 194, ry + 12, 218, ry + 12, color="#B0B6BE", lw=1.4, ms=8)
        cell(ax, 226, ry, 56, 24, v, face=BLUE, tcolor=WHITE, size=10,
             lw=1.6, r=5, z=3)
        mono(ax, 300, ry + 12, "key  ->  value" if r == 0 else "", size=8,
             color=MUTE, ha="left")

    label(ax, 466, my + 24,
          "only the 2 keys we actually", size=9.5, color=INK2, ha="left")
    label(ax, 466, my + 44,
          "put in are stored", size=9.5, color=INK2, ha="left")
    mono(ax, 466, my + 68, "cnt.size() = 2", size=9.5, color=GREEN, ha="left",
         weight="bold")

    label(ax, W / 2, h - 46,
          "The memory a map costs depends on how many different keys appear,",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 24,
          "not on how large those keys are.", size=9.5, color=MUTE, ha="center")
    save(fig, os.path.join(OUT, "map-vs-array.png"))


# ------------------------------------------------------- 2. default value trap
def map_default_trap():
    h = 380
    fig, ax = canvas(h)
    title(ax, "The default value trap  -  reading m[k] creates the key")

    panels = [
        ("m[5] = 1;", [(5, 1, "normal")], "1", INK2),
        ("if(m[7] == 0)", [(5, 1, "normal"), (7, 0, "new")], "2", CORAL),
        ("m.count(7)", [(5, 1, "normal")], "1", GREEN),
    ]
    pw = 200
    xs = [42, 292, 542]
    py = 96
    for (code, rows, size_txt, col), px in zip(panels, xs):
        mono(ax, px + pw / 2, py - 22, code, size=10, color=col, ha="center",
             weight="bold")
        rbox(ax, px, py, pw, 96, face="#F7F9FC", edge="#D5DAE0", lw=1.6, r=8,
             z=1)
        for r, (k, v, state) in enumerate(rows):
            ry = py + 14 + r * 36
            new = state == "new"
            cell(ax, px + 18, ry, 62, 26, k,
                 face=CORAL if new else LAV,
                 edge=None if new else PURPLE,
                 tcolor=WHITE if new else INK2, size=10, lw=1.6, r=5, z=3)
            arrow(ax, px + 88, ry + 13, px + 106, ry + 13, color="#B0B6BE",
                  lw=1.3, ms=7)
            cell(ax, px + 114, ry, 62, 26, v,
                 face=CORAL if new else BLUE, tcolor=WHITE, size=10, lw=1.6,
                 r=5, z=3)
        mono(ax, px + pw / 2, py + 112, f"m.size() = {size_txt}", size=9.5,
             color=col, ha="center", weight="bold")
        if any(s == "new" for _, _, s in rows):
            label(ax, px + pw / 2, py + 136, "key 7 got created,", size=8.5,
                  color=CORAL, ha="center", weight="bold")
            label(ax, px + pw / 2, py + 151, "we only wanted to look", size=8.5,
                  color=CORAL, ha="center", weight="bold")

    for x1, x2 in ((xs[0] + pw + 10, xs[1] - 10), (xs[1] + pw + 10, xs[2] - 10)):
        arrow(ax, x1, py + 48, x2, py + 48, color="#C9CFD6", lw=1.6, ms=9)

    label(ax, W / 2, h - 52,
          "The phantom key costs memory and can silently break a later pass over the map.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 28,
          "When we only want to check, count(k) answers the same question and creates nothing.",
          size=9, color=MUTE, ha="center")
    save(fig, os.path.join(OUT, "map-default-trap.png"))


# ------------------------------------------------------- 3. set insert
def set_insert():
    h = 336
    fig, ax = canvas(h)
    title(ax, "Set  -  always sorted, never the same element twice")

    steps = [
        (5, [5], False),
        (2, [2, 5], False),
        (5, [2, 5], True),
        (9, [2, 5, 9], False),
    ]
    cw, chh, gap = 40, 38, 6
    pitch = 186
    x0 = 44
    ytop = 90     # incoming chip
    yset = 176    # the set itself

    for s, (val, contents, dup) in enumerate(steps):
        cx = x0 + s * pitch
        col = CORAL if dup else GREEN
        mono(ax, cx + 66, 66, f"insert({val})", size=9.5, color=col,
             ha="center", weight="bold")
        cell(ax, cx + 46, ytop, cw, chh, val, face=col, tcolor=WHITE, size=13)
        if dup:
            # bounce off
            arrow(ax, cx + 66, ytop + chh + 4, cx + 66, yset - 12,
                  color=CORAL, lw=1.6, ms=9, ls=(0, (3, 3)))
            mono(ax, cx + 132, yset - 26, "already", size=8, color=CORAL,
                 ha="center", weight="bold")
            mono(ax, cx + 132, yset - 14, "inside", size=8, color=CORAL,
                 ha="center", weight="bold")
        else:
            arrow(ax, cx + 66, ytop + chh + 4, cx + 66, yset - 8,
                  color="#B0B6BE", lw=1.6, ms=9)

        total = len(contents) * cw + (len(contents) - 1) * gap
        sx = cx + 66 - total / 2
        rbox(ax, cx + 2, yset - 4, 132, chh + 8, face="#F7F9FC",
             edge="#D5DAE0", lw=1.6, r=8, z=1)
        for i, v in enumerate(contents):
            keep = dup and v == val
            cell(ax, sx + i * (cw + gap), yset, cw, chh, v,
                 face=LAV, edge=CORAL if keep else PURPLE, tcolor=INK2,
                 size=13, z=3)
        mono(ax, cx + 66, yset + chh + 26, f"size() = {len(contents)}",
             size=9, color=MUTE, ha="center")

    label(ax, W / 2, h - 52,
          "Inserting something already inside simply does nothing - no duplicate, no error.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 28,
          "And 2 landed in front of 5 on its own: a set keeps itself sorted at all times.",
          size=9, color=MUTE, ha="center")
    save(fig, os.path.join(OUT, "set-insert.png"))


# ------------------------------------------------------- 4. rope merging
def priority_queue_ropes():
    h = 476
    fig, ax = canvas(h)
    title(ax, "Priority Queue  -  always tie the two shortest ropes")

    # (contents, index of the new rope or None, take a, take b, running cost)
    rows = [
        ([2, 3, 4, 6], None, 2, 3, 5),
        ([4, 5, 6], 1, 4, 5, 14),
        ([6, 9], 1, 6, 9, 29),
        ([15], 0, None, None, 29),
    ]
    cw, chh, gap = 52, 42, 8
    x0 = 96
    ytop = 86
    pitch = 76

    for r, (contents, new_i, a, b, cost) in enumerate(rows):
        y = ytop + r * pitch
        mono(ax, x0 - 16, y + chh / 2, "pq:", size=10, color=INK2, ha="right",
             weight="bold")
        taken = {a, b} if a is not None else set()
        used = set()
        for i, v in enumerate(contents):
            x = x0 + i * (cw + gap)
            is_taken = v in taken and v not in used
            if is_taken:
                used.add(v)
            cell(ax, x, y, cw, chh, v,
                 face=CORAL if is_taken else LAV,
                 edge=None if is_taken else PURPLE,
                 tcolor=WHITE if is_taken else INK2, size=14)
            if new_i is not None and i == new_i:
                mono(ax, x + cw / 2, y - 12, "new", size=8, color=GREEN,
                     ha="center", weight="bold")
                caret(ax, x + cw / 2, y - 4, GREEN, up=True, size=4.5)

        tx = x0 + 4 * (cw + gap) + 24
        if a is not None:
            mono(ax, tx, y + chh / 2, f"{a} + {b} = {a + b}", size=11,
                 color=INK2, ha="left", weight="bold")
            mono(ax, tx + 150, y + chh / 2, f"total {cost}", size=10,
                 color=GREEN, ha="left", weight="bold")
        else:
            mono(ax, tx, y + chh / 2, "one rope left", size=11, color=MUTE,
                 ha="left")
            mono(ax, tx + 150, y + chh / 2, f"total {cost}", size=11,
                 color=GREEN, ha="left", weight="bold")

    label(ax, W / 2, h - 74,
          "The rope of length 5 did not exist when we started, and 9 did not exist a step later.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 52,
          "A sorted array cannot follow that - it was sorted before those ropes were made.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 26,
          "The priority queue drops each new rope into the right place in O(log n).",
          size=9, color=MUTE, ha="center")
    save(fig, os.path.join(OUT, "priority-queue-ropes.png"))


if __name__ == "__main__":
    map_vs_array()
    map_default_trap()
    set_insert()
    priority_queue_ropes()
    print("ok")
