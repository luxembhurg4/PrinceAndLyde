"""
Build production-quality assets from the reference frames.
Creates tileable textures, clean extractions, and composites.
"""
import cv2
import numpy as np
import os

FRAMES = "frames"
ASSETS = "assets"
REF = "reference video"

os.makedirs(ASSETS, exist_ok=True)


def save_webp(path, img, quality=92):
    cv2.imwrite(path, img, [cv2.IMWRITE_WEBP_QUALITY, quality])
    h, w = img.shape[:2]
    print(f"  Saved {path} ({w}x{h})")


# =============================================================================
# 1. EMBOSSED PAPER TEXTURE  — tile the clean patch into a full envelope
# =============================================================================
print("1. Building embossed paper texture...")
patch = cv2.imread(f"{FRAMES}/ref_embossed_paper_patch.jpg")
if patch is not None:
    ph, pw = patch.shape[:2]
    # Crop centre 60% to avoid edge artefacts
    cy, cx = ph // 2, pw // 2
    crop_h, crop_w = int(ph * 0.6), int(pw * 0.6)
    patch = patch[cy - crop_h // 2:cy + crop_h // 2, cx - crop_w // 2:cx + crop_w // 2]
    
    # Make it seamlessly tileable by mirroring
    tile_h = cv2.vconcat([patch, cv2.flip(patch, 0)])
    tile = cv2.hconcat([tile_h, cv2.flip(tile_h, 1)])
    
    # Tile to 1080x1920
    th, tw = tile.shape[:2]
    target_w, target_h = 1080, 1920
    canvas = np.zeros((target_h, target_w, 3), dtype=np.uint8)
    for y in range(0, target_h, th):
        for x in range(0, target_w, tw):
            eh = min(th, target_h - y)
            ew = min(tw, target_w - x)
            canvas[y:y+eh, x:x+ew] = tile[:eh, :ew]
    
    # Subtle Gaussian blur to soften tile seams and add that dreamy soft paper feel
    canvas = cv2.GaussianBlur(canvas, (3, 3), 0)
    
    # Colour-correct to the reference blush pink (#F3C9CF → BGR: 207, 201, 243)
    hsv = cv2.cvtColor(canvas, cv2.COLOR_BGR2HSV).astype(np.float32)
    # Shift towards the blush hue and desaturate slightly for that embossed paper look
    hsv[:, :, 0] = np.clip(hsv[:, :, 0] * 0.95 + 2, 0, 179)  # slightly warmer
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 0.85, 0, 255)       # desaturate slightly
    hsv[:, :, 2] = np.clip(hsv[:, :, 2] * 1.05, 0, 255)       # brighten slightly
    canvas = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
    
    save_webp(f"{ASSETS}/envelope-texture.webp", canvas, 90)
else:
    print("  WARNING: ref_embossed_paper_patch.jpg not found, skipping")

# =============================================================================
# 2. PAPER CARD TEXTURE  — lighter version for the invitation card
# =============================================================================
print("2. Building paper card texture...")
if patch is not None:
    # Use same tile but brighten significantly for ivory/cream card
    card = canvas.copy()
    # Lighten for paper card effect
    card_hsv = cv2.cvtColor(card, cv2.COLOR_BGR2HSV).astype(np.float32)
    card_hsv[:, :, 1] = np.clip(card_hsv[:, :, 1] * 0.45, 0, 255)  # more desaturated
    card_hsv[:, :, 2] = np.clip(card_hsv[:, :, 2] * 1.15, 0, 255)  # brighter
    card = cv2.cvtColor(card_hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
    # Resize to 1000x1400 for the card
    card = cv2.resize(card, (1000, 1400), interpolation=cv2.INTER_LANCZOS4)
    save_webp(f"{ASSETS}/paper-card.webp", card, 88)

# =============================================================================
# 3. WAX SEAL  — extract from reference, make circular with alpha
# =============================================================================
print("3. Building wax seal asset...")
# The reference seal is quite small. Let's use the existing exact asset if available
seal_exact = cv2.imread(f"{ASSETS}/wax-seal-exact.webp", cv2.IMREAD_UNCHANGED)
if seal_exact is not None and seal_exact.shape[0] > 100:
    save_webp(f"{ASSETS}/wax-seal.webp", seal_exact, 95)
    print("  Used wax-seal-exact.webp")
else:
    print("  Keeping existing wax-seal.webp")

# =============================================================================
# 4. RIBBON BOW  — use the exact version if available
# =============================================================================
print("4. Building ribbon bow asset...")
bow_exact = cv2.imread(f"{ASSETS}/ribbon-bow-exact.webp", cv2.IMREAD_UNCHANGED)
if bow_exact is not None:
    save_webp(f"{ASSETS}/ribbon-bow.webp", bow_exact, 95)
    print("  Used ribbon-bow-exact.webp")
else:
    print("  Keeping existing ribbon-bow.webp")

# =============================================================================
# 5. WEDDING SCENE  — use the full symmetrical version
# =============================================================================
print("5. Building wedding scene...")
scene_sym = cv2.imread(f"{ASSETS}/wedding_scene_symmetrical.webp")
scene_orig = cv2.imread(f"{ASSETS}/wedding_scene_original.webp")
if scene_sym is not None:
    # Use the symmetrical version as the main background scene
    # This gets used as a full bleed background behind the arch/garden
    save_webp(f"{ASSETS}/bg-scene.webp", scene_sym, 92)
elif scene_orig is not None:
    save_webp(f"{ASSETS}/bg-scene.webp", scene_orig, 92)

# =============================================================================
# 6. ARCH FLORAL  — use the exact version
# =============================================================================
print("6. Building arch floral...")
arch_exact = cv2.imread(f"{ASSETS}/arch-floral-exact.webp", cv2.IMREAD_UNCHANGED)
if arch_exact is not None:
    save_webp(f"{ASSETS}/arch-floral.webp", arch_exact, 95)
    print("  Used arch-floral-exact.webp")

# =============================================================================
# 7. REFERENCE CARD VIEW  — use as a card background overlay
# =============================================================================
print("7. Checking reference card view...")
ref_card = cv2.imread(f"{ASSETS}/reference_card_view.webp")
if ref_card is not None:
    print(f"  reference_card_view.webp exists ({ref_card.shape[1]}x{ref_card.shape[0]})")

# =============================================================================
# 8. TERRACE WATERFRONT  — venue illustration
# =============================================================================
print("8. Checking venue assets...")
terrace = cv2.imread(f"{ASSETS}/terrace-waterfront.webp")
if terrace is not None:
    print(f"  terrace-waterfront.webp exists ({terrace.shape[1]}x{terrace.shape[0]})")

print("\nAll asset processing complete!")
