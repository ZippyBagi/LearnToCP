"""Shared style for LearnToCP lesson illustrations.

Palette + conventions sampled directly from content/images/smallest-prime-factor.png
so every new diagram matches the existing set.

All images are exactly 784 px wide (same as smallest-prime-factor.png).
Coordinates are in PIXELS with the origin at the TOP-LEFT and y growing downward.
"""

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle, Polygon

W = 784
DPI = 100

# --- palette (sampled from smallest-prime-factor.png) ---
BLUE = "#4C9BE8"
GREEN = "#54C08A"
AMBER = "#F2B542"
CORAL = "#E07A5F"
PURPLE = "#7B4FD6"
LAV = "#F5F0FF"      # pale fill used behind purple-outlined cells
GREY = "#E6E6E6"     # inert / disabled cell
INK = "#1A1A1A"      # titles
INK2 = "#222222"     # body text
MUTE = "#8A9099"     # small captions, index labels
WHITE = "#FFFFFF"

plt.rcParams["font.family"] = "DejaVu Sans"


def canvas(height_px):
    """Return (fig, ax) with a pixel coordinate system, y downward."""
    fig = plt.figure(figsize=(W / DPI, height_px / DPI), dpi=DPI)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, W)
    ax.set_ylim(height_px, 0)
    ax.axis("off")
    fig.patch.set_facecolor(WHITE)
    return fig, ax


def save(fig, path):
    fig.savefig(path, dpi=DPI, facecolor=WHITE)
    plt.close(fig)


def rbox(ax, x, y, w, h, face=WHITE, edge=None, lw=1.8, r=6, z=2, alpha=1.0):
    """Rounded rectangle whose outer bounds are exactly (x, y, w, h)."""
    r = min(r, w / 2 - 0.5, h / 2 - 0.5)
    p = FancyBboxPatch(
        (x + r, y + r), w - 2 * r, h - 2 * r,
        boxstyle=f"round,pad={r},rounding_size={r}",
        linewidth=lw, facecolor=face,
        edgecolor=edge if edge is not None else face,
        zorder=z, alpha=alpha, mutation_aspect=1,
    )
    ax.add_patch(p)
    return p


def title(ax, text, y=26, size=13, x=W / 2):
    ax.text(x, y, text, ha="center", va="center", fontsize=size,
            fontweight="bold", color=INK, zorder=6)


def cell(ax, x, y, w, h, value, face=WHITE, edge=None, tcolor=None,
         sub=None, subcolor=None, size=11, subsize=7.5, lw=1.8, r=6, z=2,
         strike=False, bold=True):
    """A numbered cell: big value centred, optional small label underneath."""
    rbox(ax, x, y, w, h, face=face, edge=edge, lw=lw, r=r, z=z)
    if tcolor is None:
        tcolor = INK2 if face in (WHITE, LAV, GREY) else WHITE
    vy = y + h / 2 if sub is None else y + h * 0.37
    ax.text(x + w / 2, vy, str(value), ha="center", va="center",
            fontsize=size, fontweight="bold" if bold else "normal",
            color=tcolor, zorder=z + 2)
    if sub is not None:
        ax.text(x + w / 2, y + h * 0.74, str(sub), ha="center", va="center",
                fontsize=subsize, color=subcolor or tcolor, zorder=z + 2)
    if strike:
        pad = max(4.0, w * 0.16)
        ax.plot([x + pad, x + w - pad], [y + h / 2, y + h / 2],
                color=tcolor, lw=1.6, zorder=z + 3, solid_capstyle="round")


def arrow(ax, x1, y1, x2, y2, color=INK2, lw=1.6, style="-|>", ms=8,
          rad=0.0, z=5, ls="-"):
    a = FancyArrowPatch(
        (x1, y1), (x2, y2), arrowstyle=style, mutation_scale=ms,
        linewidth=lw, color=color, zorder=z,
        connectionstyle=f"arc3,rad={rad}", linestyle=ls,
        shrinkA=0, shrinkB=0,
    )
    ax.add_patch(a)
    return a


def caret(ax, cx, y, color, up=True, size=7):
    """Small triangle used as a pointer marker. `up` = tip points up (toward -y)."""
    if up:
        pts = [(cx, y), (cx - size, y + size * 1.25), (cx + size, y + size * 1.25)]
    else:
        pts = [(cx, y), (cx - size, y - size * 1.25), (cx + size, y - size * 1.25)]
    ax.add_patch(Polygon(pts, closed=True, facecolor=color,
                         edgecolor="none", zorder=6))


def pointer_labels(ax, entries, y, size=8.5, level_gap=15, caret_size=5):
    """Draw pointer captions above cells without letting them overlap.

    entries = list of (center_x, text, colour), any order.
    Captions that would collide horizontally get pushed onto a higher line.
    """
    entries = sorted(entries, key=lambda e: e[0])
    placed = []  # (level, right_edge)
    for cx, text, col in entries:
        # 0.72 approximates *bold* DejaVu Sans; a lower factor under-measures
        # and lets neighbouring captions touch.
        half = len(text) * size * 0.72 / 2
        lvl = 0
        while any(l == lvl and cx - half < right + 8 for l, right in placed):
            lvl += 1
        placed.append((lvl, cx + half))
        ly = y - 13 - lvl * level_gap
        ax.text(cx, ly, text, ha="center", va="center", fontsize=size,
                color=col, fontweight="bold", zorder=7)
        caret(ax, cx, y - 5, col, up=True, size=caret_size)
    return max(l for l, _ in placed) if placed else 0


def label(ax, x, y, text, size=9.5, color=INK2, ha="left", va="center",
          weight="normal", family=None, z=6):
    kw = {}
    if family:
        kw["family"] = family
    return ax.text(x, y, text, ha=ha, va=va, fontsize=size, color=color,
                   fontweight=weight, zorder=z, **kw)


def mono(ax, x, y, text, size=9.5, color=INK2, ha="left", va="center",
         weight="normal", z=6):
    return ax.text(x, y, text, ha=ha, va=va, fontsize=size, color=color,
                   fontweight=weight, family="DejaVu Sans Mono", zorder=z)


def legend(ax, y, items, sw=26, sh=18, gap=10, pitch=None, size=9,
           center=True, x0=40):
    """items = list of (facecolor, edgecolor_or_None, text)."""
    SPACING = 30
    widths = []
    for face, edge, text in items:
        widths.append(sw + gap + len(text) * size * 0.68)
    total = sum(widths) + SPACING * (len(items) - 1)
    x = (W - total) / 2 if center else x0
    for (face, edge, text), wd in zip(items, widths):
        rbox(ax, x, y - sh / 2, sw, sh, face=face, edge=edge, lw=1.8, r=5)
        ax.text(x + sw + gap, y, text, ha="left", va="center",
                fontsize=size, color=INK2, zorder=6)
        x += wd + SPACING
