# Artwork assets — filenames, sizes, usage

All scenery is **raster art** (no coded SVG scenery remains; only a hairline
divider symbol is still drawn in code). Files below live in `assets/`.
Replace any placeholder WebP with your final export at the **same filename
and same pixel size** — no code change needed. Keep transparent backgrounds
where noted.

| Filename | Size (px) | Used where | Notes |
|---|---|---|---|
| `bg-sky.webp` | 1080 × 2400 | Scene layer 1, full-bleed sky backdrop | Opaque watercolor gradient. Preloaded (first screen). |
| `bg-hills.webp` | 1080 × 1200 | Scene layer 2, distant hills + lake haze | **Transparent**, hills along bottom. CSS adds `blur(2px)` + mist gradient. Lazy-loaded. |
| `arch-floral.webp` | 1000 × 1500 | Scene layer 4 (hero arch); envelope peek bouquet; venue detail image | **Transparent**. Dense roses/peony/greenery with sheer drape glow. Eager in scene. |
| `trees-cypress-left.webp` | 500 × 1400 | Scene layer 3, left cypress group | **Transparent** painterly cypresses. Lazy-loaded. |
| `trees-cypress-right.webp` | 500 × 1400 | Scene layer 3, right cypress group | **Transparent**. Lazy-loaded. |
| `florals-corner-tl.webp` | 700 × 700 | Invitation card top-left; closing flourish left | **Transparent** watercolor corner. Lazy-loaded. |
| `florals-corner-tr.webp` | 700 × 700 | Card top-right; closing flourish right | **Transparent**. Lazy-loaded. |
| `florals-corner-bl.webp` | 700 × 700 | Card bottom-left; scene foreground left | **Transparent**. Lazy-loaded. |
| `florals-corner-br.webp` | 700 × 700 | Card bottom-right; scene foreground right; envelope pocket | **Transparent**. Lazy-loaded. |
| `petals-sprite.webp` | 512 × 128 | Petal/dust particle canvas | **Transparent**, 4 petal variants in a row (each 128 × 128). JS draws them with varied size, blur, speed, rotation + golden dust motes. |
| `envelope-texture.webp` | 1080 × 1920 | Envelope backdrop, back sheet, pocket, flap, curtains | Opaque blush linen with faint foil floral pattern. Preloaded (first screen). |
| `wax-seal.webp` | 512 × 512 | Seal button on the envelope | **Transparent** champagne-gold seal with highlight + shadow. Live monogram text sits on top so `CONFIG.couple.monogram` still works. Preloaded. |
| `ribbon-bow.webp` | 900 × 450 | Satin bow on the envelope | **Transparent**. Preloaded. |
| `paper-card.webp` | 1000 × 1400 | `.paper` panels (card, venues, RSVP, gifts) | Ivory cotton-paper texture (gradient fallback underneath). |
| `monogram-gold.svg` | vector (400 × 220 viewBox) | Gold foil medallion over the arch | Elegant L & P foil mark with animated shimmer sweep. |

## Parallax stack (5 layers)

1. Sky (`data-speed=2`, `data-depth=1`) — slowest
2. Hills + mist (`6`, `2`) — blurred far layer
3. Cypress trees (`12`, `3`)
4. Floral arch + glow + rays + monogram (`18`, `4`)
5. Foreground florals (`30`, `5`) — sharpest, fastest

Scroll moves layers at different rates (capped so edges never show);
pointer movement / device tilt adds a small depth-weighted shift.
All motion is disabled under `prefers-reduced-motion`.

## Light & finish (all in `css/style.css`)

- Warm radial glow + conic light rays behind the arch, soft drop shadows
  under arch/trees/seal/bow, vignette + paper-grain overlays on the scene.
- Gold foil shimmer: a slow 7s brightness breath on the monogram mark
  (no overlay box, no flat yellow). Hairline gold rules stay static.
- No thick outlines anywhere; every art edge is soft/transparent.

## Performance

- Everything is WebP except the tiny vector monogram.
- First screen preloads only `envelope-texture`, `wax-seal`, `bg-sky`
  (≈320 KB total); all other layers are `loading="lazy"` + async decode.
- Petal count capped (14 mobile / 24 desktop), DPR capped at 2.
- `prefers-reduced-motion`: petals, tilt, foil sweep and cinematic zoom off.

## Replacing art

1. Export your painting at the pixel size in the table above.
2. Keep the same filename and transparent background (where noted).
3. Overwrite the file in `assets/` and refresh — no code edits.
