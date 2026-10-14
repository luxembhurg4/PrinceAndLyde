"""Recolour the blush Figma artwork to the motif palette (reference video/motif.jpg).

Usage: python recolor_figma.py <folder with the raw Figma layer exports>
Raster layers: each pixel's luminance is mapped onto
mocha -> taupe -> muted gold -> beige -> cream (alpha kept), saved as WebP.
Vector layers: the Figma pinks/greys are swapped for motif colours.
Run it on fresh Figma exports only: recolouring an already recoloured file tints it again.
"""
import os
import sys

from PIL import Image

STOPS = [(0, (0x3E, 0x2A, 0x1F)), (70, (0x7E, 0x5A, 0x42)), (140, (0xB5, 0x95, 0x80)),
         (190, (0xDB, 0xB0, 0x82)), (225, (0xF0, 0xD2, 0xB6)), (255, (0xFB, 0xF4, 0xEC))]

# Figma layer export -> site asset
RASTER = {
    "paper.png": "fig-paper.webp",               # embossed floral paper (envelope backdrop)
    "flap.png": "fig-flap.webp",                 # sealed envelope flap
    "flap-folded.png": "fig-flap-folded.webp",   # flap folded back once opened
    "pocket.png": "fig-pocket.webp",             # envelope pocket (V-notch front)
    "lining.png": "fig-lining.webp",             # gate illustration inside the envelope
    "gate.png": "fig-gate.webp",                 # bow-covered reveal backdrop
    "arch.png": "fig-arch.webp",                 # invitation hero arch + staircase
    "boat.png": "fig-boat.webp",                 # celebration boat
    "canopy.png": "fig-canopy.webp",             # wedding-details silk canopy
}

VECTOR = {
    "folds.svg": ("fig-folds.svg", {"#D9AFB7": "#C9A27C"}),
    "pocket-seams.svg": ("fig-pocket-seams.svg", {"#D9AFB7": "#C9A27C"}),
    "lining-edge.svg": ("fig-lining-edge.svg", {"#B9AC88": "#B08A62"}),
    "volume.svg": ("fig-volume.svg", {"#846B78": "#7E5A42"}),
}


def lut():
    out = []
    for v in range(256):
        for (a, ca), (b, cb) in zip(STOPS, STOPS[1:]):
            if a <= v <= b:
                t = (v - a) / (b - a)
                out.append(tuple(round(x + (y - x) * t) for x, y in zip(ca, cb)))
                break
    return out


TABLE = lut()
assert len(TABLE) == 256 and TABLE[0] == STOPS[0][1] and TABLE[255] == STOPS[-1][1]


def recolor(img):
    rgba = img.convert("RGBA")
    lum = rgba.convert("L")
    rgb = Image.merge("RGB", [lum.point([c[i] for c in TABLE]) for i in range(3)])
    rgb.putalpha(rgba.getchannel("A"))
    return rgb


def swap_colors(svg, mapping):
    for old, new in mapping.items():
        assert old in svg, f"{old} not found: the Figma export changed"
        svg = svg.replace(old, new)
    return svg


if __name__ == "__main__":
    src = sys.argv[1]
    assets = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")
    for raw, name in RASTER.items():
        recolor(Image.open(os.path.join(src, raw))).save(os.path.join(assets, name), "WEBP", quality=86, method=6)
        print("saved", name)
    for raw, (name, mapping) in VECTOR.items():
        with open(os.path.join(src, raw), encoding="utf-8") as f:
            svg = swap_colors(f.read(), mapping)
        with open(os.path.join(assets, name), "w", encoding="utf-8") as f:
            f.write(svg)
        print("saved", name)
