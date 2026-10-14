# Artwork assets — filenames, sizes, usage

The artwork comes from the Figma design (blush envelope → bow reveal →
invitation hero → countdown → wedding details), recoloured to the motif
palette in `reference video/motif.jpg` (champagne · beige · muted gold ·
taupe · mocha) by `recolor_figma.py`. Files live in `assets/`.
Replace any file with your final export at the **same filename and pixel
size** — no code change needed. Keep transparent backgrounds where noted.

| Filename | Size (px) | Used where | Notes |
|---|---|---|---|
| `fig-paper.webp` | 768 × 1376 | Envelope backdrop; page sides on desktop | Embossed floral paper. Preloaded (first screen). |
| `fig-flap.webp` | 780 × 812 | Sealed envelope flap (top 406 of 780) | **Transparent** pointed bottom edge. Preloaded. |
| `fig-flap-folded.webp` | 780 × 96 | Flap folded back once the envelope opens | **Transparent** curved strip. |
| `fig-pocket.webp` | 780 × 990 | Envelope pocket once opened | **Transparent** V-notch top. |
| `fig-lining.webp` | 848 × 1264 | Gate illustration lining the opened envelope | Opaque. |
| `fig-gate.webp` | 768 × 1376 | "Bow-covered reveal" screen backdrop | Opaque, full screen. |
| `rings.webp` | 743 × 568 | Wedding rings on the reveal screen | **Transparent**. AI-generated (Figma), recoloured to the motif. |
| `fig-arch.webp` | 768 × 1376 | "Invitation hero" floral arch + staircase | Opaque, full screen. |
| `fig-boat.webp` | 1584 × 672 | "The Celebration" illustration | **Transparent**. Swap it if your reception isn't on water. |
| `fig-canopy.webp` | 1264 × 848 | "Wedding Details" silk canopy | **Transparent**. |
| `fig-folds.svg` | 390 × 780 | Fold lines on the sealed envelope | Vector. |
| `fig-lining-edge.svg`, `fig-pocket-seams.svg` | vector | Opened-envelope edge + seam lines | Vector. |
| (inline SVG `#seal-art` in `index.html`) | vector | Wax seal | Poured-wax edge, gloss and pressed initials are SVG filters; the initials are live text from `CONFIG.couple.monogram`. |
| `couple-silhouette.webp` | 541 × 843 | Dress code, above the motif swatches | **Transparent** mocha silhouette (barong tagalog + baro't saya). AI-generated (Figma). |
| `fig-volume.svg` | 17 × 17 | Sound button icon | Vector. |
| `petals-sprite.webp` | 512 × 128 | Petal/dust particle canvas | **Transparent**, 4 petal variants in a row (each 128 × 128). |
| `gallery/pic-*.svg` | 900 × 1350 | Gallery placeholders | Replace with your photos (see README). |
| `og-image.svg` | 1200 × 630 | Share preview | Export to `.jpg` for chat apps (see README). |

`reference_card_view.webp` and `wedding_scene_*.webp` are reference images only — the site doesn't load them.

## Motion (all in `css/style.css` + `js/app.js → openEnvelope()`)

Timings follow the Figma "Continuous motion" frame:

1. Sealed: seal fades/scales in (0.25 s), then the script line fades up.
2. Tap the seal: the flap (with the seal on its tip) hinges open in 3-D toward the
   guest (~1.1 s to upright) and folds back over the top edge; underneath, the gate
   lining and pocket rise into place, then the folded strip and lifted seal settle
   (`cubic-bezier(.22,1,.36,1)`). Each layer's start time is its `--t` in `style.css`.
3. The envelope slides up while the bow screen rises (1.6 s, `cubic-bezier(.4,0,.2,1)`);
   the greeting, names and rings fade in one after another.
4. Bow screen → invitation: the artwork stays pinned (`.stage__bg`, sticky) while the
   words scroll over it, and the gate crossfades to the arch as the invitation arrives.
5. Everything below fades up as it scrolls into view (`.reveal`, delay per element via `--d`).

`prefers-reduced-motion`: the envelope opens instantly, no petals, no fades.

## Recolouring new Figma exports

1. Export the Figma layers (or use the Figma MCP `download_assets`) into a folder,
   named as in `RASTER` / `VECTOR` at the top of `recolor_figma.py`.
2. `python recolor_figma.py <that folder>` — writes the motif-coloured files into `assets/`.
3. Only run it on fresh exports: recolouring an already recoloured file tints it again.
