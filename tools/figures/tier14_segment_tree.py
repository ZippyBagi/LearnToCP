"""Segment tree illustrations.

Wider than the usual 784 px: this lesson needs 8 leaves side by side, so the
whole batch is 1040 px. No titles - the lesson sentence above each image is
the caption.
"""
import os
import style
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))

WIDE = 1040
style.W = WIDE                       # canvas()/legend() read W from the module
W = WIDE

PALE = "#EAF3FD"                     # the requested range, before it is used

A = [1, 2, 5, 3, -2, 8, -3, 6]
SLOT = 118
X0 = (WIDE - 8 * SLOT) / 2
NH = 44
PITCH = 72

# node index -> (level, span_start, span_end)
NODES = {1: (0, 0, 7),
         2: (1, 0, 3), 3: (1, 4, 7),
         4: (2, 0, 1), 5: (2, 2, 3), 6: (2, 4, 5), 7: (2, 6, 7)}
for i in range(8, 16):
    NODES[i] = (3, i - 8, i - 8)

SUM = {i: sum(A[NODES[i][1]:NODES[i][2] + 1]) for i in NODES}


def geom(idx, top):
    lvl, l, r = NODES[idx]
    x = X0 + l * SLOT + 6
    w = (r - l + 1) * SLOT - 12
    y = top + lvl * PITCH
    return x, y, w


def connectors(ax, top):
    for idx in range(2, 16):
        cx, cy, cw = geom(idx, top)
        px, py, pw = geom(idx // 2, top)
        ax.plot([cx + cw / 2, cx + cw / 2], [cy, py + NH],
                color=GRIDL, lw=1.6, zorder=1)


def leaf_indices(ax, y):
    for i in range(8):
        ax.text(X0 + i * SLOT + SLOT / 2, y, str(i), ha="center", va="center",
                fontsize=8.5, color=MUTE, zorder=6)


def draw_tree(ax, top, faces=None, edges=None, values=None, subs=True):
    faces = faces or {}
    edges = edges or {}
    values = values or SUM
    connectors(ax, top)
    for idx in range(1, 16):
        x, y, w = geom(idx, top)
        face = faces.get(idx, WHITE)
        edge = edges.get(idx, AMBER if idx >= 8 else PURPLE)
        tc = INK2 if face in (WHITE, LAV, PALE, GREY, AMBER) else WHITE
        cell(ax, x, y, w, NH, values[idx], face=face, edge=edge, tcolor=tc,
             sub=str(idx) if subs else None,
             subcolor=MUTE if face in (WHITE, LAV, PALE, GREY) else tc,
             size=13, subsize=8)


def ans_box(ax, y, text):
    rbox(ax, WIDE / 2 - 130, y, 260, 44, face=LAV, edge=PURPLE, lw=1.8, r=10)
    mono(ax, WIDE / 2, y + 22, text, size=13, color=PURPLE, ha="center",
         weight="bold")


# ------------------------------------------------ 1. the shape, no sums yet
def shape():
    top = 20
    fig, ax = canvas(316)
    connectors(ax, top)
    for idx in range(1, 16):
        x, y, w = geom(idx, top)
        lvl, l, r = NODES[idx]
        vals = A[l:r + 1]
        rbox(ax, x, y, w, NH, face=WHITE, edge=AMBER if idx >= 8 else PURPLE,
             lw=1.8, r=6)
        for k, v in enumerate(vals):
            ax.text(x + w * (k + 0.5) / len(vals), y + NH / 2, str(v),
                    ha="center", va="center", fontsize=12, fontweight="bold",
                    color=INK2, zorder=6)
    leaf_indices(ax, 296)
    save(fig, os.path.join(OUT, "segment-tree-shape.png"))


# ------------------------------------------------ 2. every node holds a sum
def sums():
    top = 20
    fig, ax = canvas(316)
    draw_tree(ax, top)
    leaf_indices(ax, 296)
    save(fig, os.path.join(OUT, "segment-tree-sums.png"))


# ------------------------------------------------ 3-5. the query walk
def _query(name, taken, fresh, lo, hi, total):
    top = 20
    fig, ax = canvas(372)

    faces = {i: PALE for i in range(8, 15)}      # leaves 0..6 = the range
    for i in taken:
        faces[i] = GREEN
    faces[fresh] = GREEN
    edges = {i: GREEN for i in taken + [fresh]}
    draw_tree(ax, top, faces=faces, edges=edges)

    for idx, txt, col in ((lo, "l", BLUE), (hi, "r", CORAL)):
        x, y, w = geom(idx, top)
        if lo == hi and txt == "r":
            continue
        cx = x + w / 2
        caret(ax, cx, y - 7, col, up=False, size=6)
        mono(ax, cx + 12, y - 14, "l = r" if lo == hi else txt, size=11,
             color=col, ha="left", weight="bold", z=9)

    leaf_indices(ax, 296)
    ans_box(ax, 312, total)
    save(fig, os.path.join(OUT, name))


def query_steps():
    _query("segment-tree-query-1.png", [], 14, 8, 14, "ans = -3")
    _query("segment-tree-query-2.png", [14], 6, 4, 6, "ans = 3")
    _query("segment-tree-query-3.png", [14, 6], 2, 2, 2, "ans = 14")


# ------------------------------------------------ 6. update a[7] = 9
def update():
    top = 36
    fig, ax = canvas(332)

    path = [15, 7, 3, 1]
    new = dict(SUM)
    new.update({15: 9, 7: 6, 3: 12, 1: 23})

    draw_tree(ax, top, faces={i: AMBER for i in path},
              edges={i: AMBER for i in path}, values=new)

    for idx in path:
        x, y, w = geom(idx, top)
        cx = x + w / 2 - (0 if idx == 1 else 34)
        ax.text(cx, y - 16, str(SUM[idx]), ha="center", va="center",
                fontsize=10, color=MUTE, zorder=6)
        half = len(str(SUM[idx])) * 10 * 0.6 / 2 + 2
        ax.plot([cx - half, cx + half], [y - 16, y - 16], color=MUTE, lw=1.3,
                zorder=7)

    for a_idx, b_idx in zip(path, path[1:]):
        ax1, ay1, aw1 = geom(a_idx, top)
        _, by, _ = geom(b_idx, top)
        arrow(ax, ax1 + aw1 / 2, ay1, ax1 + aw1 / 2, by + NH + 2,
              color=AMBER, lw=2.2, ms=12)

    leaf_indices(ax, 312)
    save(fig, os.path.join(OUT, "segment-tree-update.png"))


# ------------------------------------------------ 7. the flat array
def flat_array():
    fig, ax = canvas(168)
    cw, gap = 58, 5
    x0 = (WIDE - (16 * cw + 15 * gap)) / 2

    def cx(i):
        return x0 + i * (cw + gap)

    for i in range(16):
        if i == 0:
            cell(ax, cx(i), 46, cw, 52, "", face=GREY, edge=None)
        else:
            cell(ax, cx(i), 46, cw, 52, SUM[i], face=WHITE,
                 edge=AMBER if i >= 8 else PURPLE, tcolor=INK2, size=13)
        ax.text(cx(i) + cw / 2, 112, str(i), ha="center", va="center",
                fontsize=8.5, color=MUTE, zorder=6)

    for lo, hi in ((1, 1), (2, 3), (4, 7), (8, 15)):
        x1, x2 = cx(lo), cx(hi) + cw
        ax.plot([x1, x1, x2, x2], [34, 26, 26, 34], color=MUTE, lw=1.4,
                zorder=5)

    for i in range(8):
        ax.text(cx(8 + i) + cw / 2, 140, f"a[{i}]", ha="center", va="center",
                fontsize=8.5, color=AMBER, zorder=6, fontweight="bold")

    save(fig, os.path.join(OUT, "segment-tree-flat-array.png"))


if __name__ == "__main__":
    shape()
    sums()
    query_steps()
    update()
    flat_array()
    print("ok")
