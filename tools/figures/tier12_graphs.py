"""Graph Theory I illustrations.

Six figures for `11 Graph Theory`. All of them draw the same 7 city map the
chapter runs on, so the reader recognises it instantly from lesson to lesson:

    vertices 1..7, edges 1-2 1-3 2-4 2-5 3-6 5-7 6-7

`GPOS` is the one layout used everywhere the graph is drawn as a map, and
`LEVELS` is the one used when the picture is about distance from vertex 1.
Both are planar for this graph - no edge crosses another - which is why the
pictures stay readable without any arrow bending.

Language-neutral: digits, `v:` row labels and short English terms the Serbian
lessons also use in English.
"""
import os
from style import *

OUT = os.path.dirname(os.path.abspath(__file__))

EDGES = [(1, 2), (1, 3), (2, 4), (2, 5), (3, 6), (5, 7), (6, 7)]
TREE_EDGES = [(1, 2), (1, 3), (2, 4), (2, 5), (3, 6), (5, 7)]   # 6-7 removed

# map layout, in grid units, x already centred on 0
GPOS = {1: (0.75, 0), 2: (-0.75, 1), 3: (2.25, 1),
        4: (-2.25, 2), 5: (-0.25, 2), 6: (2.25, 2), 7: (0.95, 3)}

# layout by distance from vertex 1 - every edge joins neighbouring levels
LEVELS = {1: (0, 0), 2: (-1, 1), 3: (1, 1),
          4: (-2, 2), 5: (0, 2), 6: (2, 2), 7: (1, 3)}

EDGE_GREY = "#C9CFD6"


def place(pos, cx, cy, ux, uy):
    return {v: (cx + gx * ux, cy + gy * uy) for v, (gx, gy) in pos.items()}


def node(ax, p, txt, face=WHITE, edge=PURPLE, tcolor=INK2, r=20, size=11, z=5):
    ax.add_patch(Circle(p, r, facecolor=face, edgecolor=edge, lw=2.0,
                        zorder=z))
    ax.text(p[0], p[1], str(txt), ha="center", va="center", fontsize=size,
            fontweight="bold", color=tcolor, zorder=z + 1)


def link(ax, pa, pb, color=EDGE_GREY, lw=2.4, z=1, ls="-"):
    ax.plot([pa[0], pb[0]], [pa[1], pb[1]], color=color, lw=lw, zorder=z,
            linestyle=ls, solid_capstyle="round")


def draw_graph(ax, P, edges, hot=None, hot_color=BLUE, r=20, size=11,
               node_face=None, node_tcolor=None):
    """Edges first so the circles always sit on top of the lines."""
    hot = set(tuple(sorted(e)) for e in (hot or []))
    for a, b in edges:
        on = tuple(sorted((a, b))) in hot
        link(ax, P[a], P[b], color=hot_color if on else EDGE_GREY,
             lw=3.0 if on else 2.4, z=2 if on else 1)
    for v, p in P.items():
        face, tcol = WHITE, INK2
        if node_face and v in node_face:
            face = node_face[v]
            tcol = WHITE if face not in (WHITE, LAV, GREY) else INK2
        if node_tcolor and v in node_tcolor:
            tcol = node_tcolor[v]
        node(ax, p, v, face=face, tcolor=tcol, r=r, size=size)


# ------------------------------------------------------ 1. the chapter graph
def graph_running_example():
    h = 430
    fig, ax = canvas(h)
    title(ax, "The chapter graph  -  7 cities and the roads between them")

    P = place(GPOS, 392, 92, 110, 80)
    draw_graph(ax, P, EDGES)

    label(ax, P[2][0] - 30, P[2][1], "degree 3", size=9, color=MUTE,
          ha="right")

    label(ax, W / 2, h - 52,
          "Vertex 2 has three neighbours - 1, 4 and 5 - so its degree is 3.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 26,
          "n = 7 vertices, m = 7 edges. Every lesson in this chapter walks this same map.",
          size=9, color=MUTE, ha="center")

    save(fig, os.path.join(OUT, "graph-running-example.png"))


# ------------------------------------------------------- 2. list vs matrix
def graph_list_vs_matrix():
    h = 430
    fig, ax = canvas(h)
    title(ax, "Two ways to store the same graph")

    nbr = {v: [] for v in range(1, 8)}
    for a, b in EDGES:
        nbr[a].append(b)
        nbr[b].append(a)
    for v in nbr:
        nbr[v].sort()

    # ---- left: adjacency list
    label(ax, 196, 68, "adjacency list", size=10, color=INK, ha="center",
          weight="bold")
    lx, ly, pitch = 96, 92, 34
    cw, chh, gap = 28, 26, 6
    for v in range(1, 8):
        y = ly + (v - 1) * pitch
        mono(ax, lx - 12, y + chh / 2, f"{v}:", size=10, color=MUTE,
             ha="right")
        for i, u in enumerate(nbr[v]):
            cell(ax, lx + i * (cw + gap), y, cw, chh, u, face=BLUE,
                 tcolor=WHITE, size=10, lw=1.6, r=5)
    mono(ax, 196, 344, "14 entries", size=10, color=PURPLE,
         ha="center", weight="bold")

    # ---- right: adjacency matrix
    label(ax, 588, 68, "adjacency matrix", size=10, color=INK, ha="center",
          weight="bold")
    m = {(a, b) for a, b in EDGES} | {(b, a) for a, b in EDGES}
    mcw = 28
    mx = 588 - (7 * mcw) / 2 + 6
    my = 100
    for j in range(1, 8):
        mono(ax, mx + (j - 1) * mcw + mcw / 2, my - 13, str(j), size=8,
             color=MUTE, ha="center")
    for i in range(1, 8):
        mono(ax, mx - 12, my + (i - 1) * mcw + mcw / 2, str(i), size=8,
             color=MUTE, ha="right")
        for j in range(1, 8):
            on = (i, j) in m
            cell(ax, mx + (j - 1) * mcw + 1, my + (i - 1) * mcw + 1,
                 mcw - 2, mcw - 2, 1 if on else 0,
                 face=BLUE if on else WHITE,
                 edge=None if on else "#E1E5EA",
                 tcolor=WHITE if on else "#C4CAD2",
                 size=9, lw=1.2, r=4)
    mono(ax, 588, 344, "49 cells", size=10, color=PURPLE,
         ha="center", weight="bold")

    label(ax, W / 2, h - 52,
          "The list stores only what exists. The matrix keeps a cell for every pair, and most of them are empty.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 26,
          "O(n + m) memory against O(n^2) - and the gap grows with every vertex.",
          size=9, color=MUTE, ha="center")

    save(fig, os.path.join(OUT, "graph-list-vs-matrix.png"))


# ------------------------------------------------------- 3. DFS vs BFS order
def dfs_vs_bfs_order():
    h = 424
    fig, ax = canvas(h)
    title(ax, "Same graph, same start  -  two different walks")

    dfs_order = [1, 2, 4, 5, 7, 6, 3]
    bfs_order = [1, 2, 3, 4, 5, 6, 7]
    dfs_tree = [(1, 2), (2, 4), (2, 5), (5, 7), (7, 6), (6, 3)]
    bfs_tree = [(1, 2), (1, 3), (2, 4), (2, 5), (3, 6), (5, 7)]

    def panel(cx, name, order, tree, color):
        label(ax, cx, 70, name, size=10, color=color, ha="center",
              weight="bold")
        P = place(GPOS, cx, 108, 52, 62)
        draw_graph(ax, P, EDGES, hot=tree, hot_color=color, r=15, size=9.5)
        for step, v in enumerate(order):
            bx, by = P[v][0] + 15, P[v][1] - 15
            ax.add_patch(Circle((bx, by), 9, facecolor=color,
                                edgecolor=WHITE, lw=1.4, zorder=8))
            ax.text(bx, by, str(step + 1), ha="center", va="center",
                    fontsize=7.5, fontweight="bold", color=WHITE, zorder=9)
        mono(ax, cx, 344, "  ".join(str(v) for v in order), size=10,
             color=INK2, ha="center", weight="bold")

    panel(200, "DFS  -  go as deep as you can", dfs_order, dfs_tree, BLUE)
    panel(584, "BFS  -  finish the ring first", bfs_order, bfs_tree, GREEN)

    label(ax, W / 2, h - 50,
          "Coloured edges are the ones the walk actually stepped through, badges are the visiting order.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 24,
          "DFS builds one long chain and reaches 3 last, even though 3 is a neighbour of the start.",
          size=9, color=MUTE, ha="center")

    save(fig, os.path.join(OUT, "dfs-vs-bfs-order.png"))


# ------------------------------------------------------------- 4. BFS rings
def bfs_rings():
    h = 440
    fig, ax = canvas(h)
    title(ax, "BFS  -  a whole ring finishes before the next one starts")

    P = place(LEVELS, 392, 92, 92, 80)
    # a ramp light enough to read as "further away", dark enough to label
    band = ["#1F6FB8", "#4C9BE8", "#8FC2EE", "#C3DEF7"]
    # white text stops being legible on the two palest rings
    ink = [WHITE, WHITE, INK2, INK2]

    for d in range(4):
        y = 92 + d * 80
        rbox(ax, 40, y - 32, 600, 64, face="#F7FAFD", edge="#E8EEF5", lw=1.4,
             r=10, z=0)
        rbox(ax, 656, y - 9, 18, 18, face=band[d], edge=None, lw=1.4, r=5)
        mono(ax, 680, y, f"d = {d}", size=10, color=INK2, ha="left",
             weight="bold")

    draw_graph(ax, P, EDGES, r=20, size=11,
               node_face={v: band[LEVELS[v][1]] for v in LEVELS},
               node_tcolor={v: ink[LEVELS[v][1]] for v in LEVELS})

    label(ax, W / 2, h - 50,
          "Every edge joins one ring to the next, so nothing can skip a ring.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 24,
          "The first time BFS sees a vertex it has already finished every closer ring - that is why it is the shortest way in.",
          size=9, color=MUTE, ha="center")

    save(fig, os.path.join(OUT, "bfs-rings.png"))


# ------------------------------------------------------ 5. graph -> tree
def tree_from_graph():
    h = 400
    fig, ax = canvas(h)
    title(ax, "Close one road and the graph becomes a tree")

    cycle = [(1, 2), (2, 5), (5, 7), (7, 6), (6, 3), (3, 1)]

    label(ax, 200, 70, "7 edges  -  there is a cycle", size=10, color=CORAL,
          ha="center", weight="bold")
    P1 = place(GPOS, 200, 108, 52, 62)
    draw_graph(ax, P1, EDGES, hot=cycle, hot_color=CORAL, r=15, size=9.5)

    label(ax, 584, 70, "6 edges  -  no way round", size=10, color=GREEN,
          ha="center", weight="bold")
    P2 = place(GPOS, 584, 108, 52, 62)
    for a, b in TREE_EDGES:
        link(ax, P2[a], P2[b], color=GREEN, lw=3.0, z=2)
    link(ax, P2[6], P2[7], color="#E0E4E9", lw=2.0, z=1, ls=(0, (3, 3)))
    for v, p in P2.items():
        node(ax, p, v, r=15, size=9.5)

    arrow(ax, 340, 220, 444, 220, color=MUTE, lw=2.0, ms=12)
    mono(ax, 392, 200, "remove 6-7", size=9, color=MUTE, ha="center")

    label(ax, W / 2, h - 50,
          "The dotted edge is the one we closed - the only edge that was holding the cycle together.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 24,
          "7 vertices and 6 edges, still connected: a tree always has exactly n - 1 edges.",
          size=9, color=MUTE, ha="center")

    save(fig, os.path.join(OUT, "tree-from-graph.png"))


# --------------------------------------------------------- 6. rooted tree
def tree_rooted_at_1():
    h = 480
    fig, ax = canvas(h)
    title(ax, "The same tree, hung from vertex 1")

    P = place(LEVELS, 392, 92, 92, 80)
    leaves = {4, 6, 7}

    # edges stay neutral - the colour in this figure belongs to the vertices
    for a, b in TREE_EDGES:
        link(ax, P[a], P[b], color=EDGE_GREY, lw=2.6, z=1)

    for d in range(4):
        mono(ax, 96, 92 + d * 80, f"depth {d}", size=9.5, color=MUTE,
             ha="left")

    for v, p in P.items():
        if v == 1:
            node(ax, p, v, face=AMBER, tcolor=WHITE, edge=None, r=20)
        elif v in leaves:
            node(ax, p, v, face=GREEN, tcolor=WHITE, edge=None, r=20)
        else:
            node(ax, p, v, r=20)

    legend(ax, 396, [(AMBER, None, "root"),
                     (WHITE, PURPLE, "has children"),
                     (GREEN, None, "leaf")])

    label(ax, W / 2, h - 50,
          "Depth is just the distance from the root, so rooting a tree is a BFS that never had a choice to make.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 24,
          "Rooting changes nothing about the tree - only how we look at it.",
          size=9, color=MUTE, ha="center")

    save(fig, os.path.join(OUT, "tree-rooted-at-1.png"))


# ---------------------------------------------------- 7. connected components
def connected_components():
    h = 470
    fig, ax = canvas(h)
    title(ax, "Connected components  -  a walk only ever finds its own piece")

    # the chapter graph pushed right, with the extra pair parked bottom left
    CPOS = {1: (1.65, 0), 2: (0.15, 1), 3: (3.15, 1), 4: (-1.35, 2),
            5: (0.65, 2), 6: (3.15, 2), 7: (1.85, 3),
            8: (-3.2, 2.1), 9: (-2.5, 2.85)}
    P = place(CPOS, 392, 96, 100, 74)

    def region(members, face, edge, pad):
        xs = [P[v][0] for v in members]
        ys = [P[v][1] for v in members]
        rbox(ax, min(xs) - pad, min(ys) - pad,
             max(xs) - min(xs) + 2 * pad, max(ys) - min(ys) + 2 * pad,
             face=face, edge=edge, lw=1.6, r=16, z=0)
        return (min(xs) + max(xs)) / 2

    ca = region(range(1, 8), "#F5F9FE", "#D6E6F7", 36)
    cb = region([8, 9], "#F3FBF7", "#CFEBDD", 30)

    for a, b in EDGES:
        link(ax, P[a], P[b], color="#B9D5F0", lw=2.6, z=1)
    link(ax, P[8], P[9], color="#A8DCC2", lw=2.6, z=1)

    for v, p in P.items():
        node(ax, p, v, face=GREEN if v in (8, 9) else BLUE, tcolor=WHITE,
             edge=None, r=19)

    mono(ax, ca, 384, "from 1:  1 2 4 5 7 6 3", size=10, color=BLUE,
         ha="center", weight="bold")
    mono(ax, cb, 384, "from 8:  8 9", size=10, color=GREEN,
         ha="center", weight="bold")

    label(ax, W / 2, h - 50,
          "No road joins the two pieces, so a walk started at 1 can never reach 8 or 9.",
          size=9.5, color=INK2, ha="center")
    label(ax, W / 2, h - 24,
          "That is why we start a fresh walk from every vertex nobody has reached yet - here that gives 2 components.",
          size=9, color=MUTE, ha="center")

    save(fig, os.path.join(OUT, "connected-components.png"))


if __name__ == "__main__":
    graph_running_example()
    graph_list_vs_matrix()
    dfs_vs_bfs_order()
    bfs_rings()
    tree_from_graph()
    tree_rooted_at_1()
    connected_components()
    print("done")
