"""
Professional Fine-Art Asset Generator for Wedding Invitation
Generates ultra-high quality, elegant, painterly botanical watercolor and luxury stationery assets:
- arch-floral.webp (Lush floral wedding arch with English roses, peonies, eucalyptus, olive leaves, organza drape)
- trees-cypress-left.webp & trees-cypress-right.webp (Organic painterly Tuscan cypresses with textured foliage)
- florals-corner-*.webp (Botanical watercolor bouquets with delicate petals, buds, and foliage)
- wax-seal.webp (Realistic beveled 3D wax seal with organic stamp rim, parchment shading, micro-texture)
- ribbon-bow.webp (Silky satin French ribbon bow with soft folds, flowing tails, realistic highlights)
- envelope-texture.webp (Luxurious textured cotton / fine linen paper texture)
- bg-sky.webp (Breathtaking soft sunset ethereal sky wash)
- bg-hills.webp (Layered rolling Tuscan hills with atmospheric haze)
- petals-sprite.webp (High-detail soft floating rose & peony petals)
- paper-card.webp (Handmade deckle-edge cotton rag paper texture)
"""

import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance

random.seed(42)
OUT = "assets"

def add_fine_noise(img, amt=5):
    w, h = img.size
    noise = Image.effect_noise((w, h), amt * 3).convert("L")
    noise = noise.point(lambda v: (v - 128) // 4)
    if img.mode == "RGBA":
        r, g, b, a = img.split()
        r = ImageChops.add(r, noise)
        g = ImageChops.add(g, noise)
        b = ImageChops.add(b, noise)
        return Image.merge("RGBA", (r, g, b, a))
    elif img.mode == "RGB":
        r, g, b = img.split()
        r = ImageChops.add(r, noise)
        g = ImageChops.add(g, noise)
        b = ImageChops.add(b, noise)
        return Image.merge("RGB", (r, g, b))
    return img

def save_webp(img, path, quality=85):
    img.save(path, "WEBP", quality=quality, method=6)
    print(f"Saved {path} -> {img.size}")

# ==============================================================================
# 1. LUXURY ENVELOPE & PAPER TEXTURE
# ==============================================================================
def create_linen_texture(w, h, base_color=(250, 237, 239)):
    # Rich warm blush with linen weave micro-lines
    img = Image.new("RGB", (w, h), base_color)
    d = ImageDraw.Draw(img)
    
    # Soft vertical and horizontal organic weave threads
    for y in range(0, h, 3):
        alpha = random.randint(3, 8)
        color = (max(0, base_color[0] - alpha), max(0, base_color[1] - alpha), max(0, base_color[2] - alpha))
        d.line([(0, y), (w, y)], fill=color, width=1)
        
    for x in range(0, w, 3):
        alpha = random.randint(3, 8)
        color = (min(255, base_color[0] + alpha), min(255, base_color[1] + alpha), min(255, base_color[2] + alpha))
        d.line([(x, 0), (x, h)], fill=color, width=1)
        
    # Soft watercolor wash variations
    wash = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dw = ImageDraw.Draw(wash)
    for _ in range(25):
        cx, cy = random.randint(0, w), random.randint(0, h)
        rad = random.randint(150, 450)
        col = random.choice([
            (255, 255, 255, 20),
            (240, 210, 215, 18),
            (248, 225, 228, 22),
            (232, 195, 204, 15)
        ])
        dw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=col)
    wash = wash.filter(ImageFilter.GaussianBlur(80))
    img = Image.alpha_composite(img.convert("RGBA"), wash).convert("RGB")
    return add_fine_noise(img, 4)

def gen_envelope():
    env = create_linen_texture(1080, 1920, base_color=(247, 228, 232))
    save_webp(env, f"{OUT}/envelope-texture.webp", 80)

def gen_paper_card():
    card = create_linen_texture(1000, 1400, base_color=(254, 251, 250))
    save_webp(card, f"{OUT}/paper-card.webp", 82)

# ==============================================================================
# 2. REALISTIC GOLD WAX SEAL
# ==============================================================================
def gen_wax_seal():
    size = 512
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    
    # Generate natural organic irregular wax edge
    cx, cy = size // 2, size // 2
    r_outer = 205
    points = []
    num_pts = 160
    for i in range(num_pts):
        angle = 2 * math.pi * i / num_pts
        # Organic melted wax dripping irregularities
        wav = (math.sin(angle * 3.5 + 0.4) * 11 + 
               math.sin(angle * 6.2) * 7 + 
               math.sin(angle * 11.1) * 3 +
               math.cos(angle * 2.0) * 14)
        r = r_outer + wav
        points.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
        
    # Wax Base with rich gold gradient
    wax_base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    db = ImageDraw.Draw(wax_base)
    db.polygon(points, fill=(195, 155, 88, 255))
    
    # 3D shading on wax puddle (beveled rim)
    # Shading layer
    shade = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ds = ImageDraw.Draw(shade)
    # Top-left highlight
    ds.ellipse([cx - 180, cy - 185, cx + 175, cy + 170], fill=(245, 218, 156, 170))
    # Bottom-right shadow
    ds.ellipse([cx - 165, cy - 160, cx + 190, cy + 195], fill=(138, 102, 50, 150))
    shade = shade.filter(ImageFilter.GaussianBlur(16))
    
    # Inner stamped depression
    recess = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    dr = ImageDraw.Draw(recess)
    dr.ellipse([cx - 148, cy - 148, cx + 148, cy + 148], fill=(218, 178, 108, 255))
    dr.ellipse([cx - 144, cy - 144, cx + 144, cy + 144], fill=(205, 165, 96, 255))
    # Stamped ridge rings
    dr.ellipse([cx - 138, cy - 138, cx + 138, cy + 138], outline=(145, 108, 54, 210), width=4)
    dr.ellipse([cx - 134, cy - 134, cx + 134, cy + 134], outline=(250, 230, 180, 200), width=2)
    dr.ellipse([cx - 124, cy - 124, cx + 124, cy + 124], outline=(175, 135, 75, 120), width=2)
    recess = recess.filter(ImageFilter.GaussianBlur(2))
    
    # Outer wax rim bevel ridge
    rim = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    drim = ImageDraw.Draw(rim)
    for p in points:
        drim.ellipse([p[0]-8, p[1]-8, p[0]+8, p[1]+8], fill=(238, 206, 142, 140))
    rim = rim.filter(ImageFilter.GaussianBlur(9))
    
    # Composite all wax layers
    wax = Image.alpha_composite(wax_base, rim)
    wax = Image.alpha_composite(wax, shade)
    wax = Image.alpha_composite(wax, recess)
    
    # Soft gold micro-specular sheen
    specular = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    dspec = ImageDraw.Draw(specular)
    dspec.ellipse([cx - 110, cy - 125, cx + 60, cy - 35], fill=(255, 248, 225, 90))
    specular = specular.filter(ImageFilter.GaussianBlur(18))
    wax = Image.alpha_composite(wax, specular)
    
    # Add subtle micro-grain for authentic metallic wax feel
    wax = add_fine_noise(wax, 3)
    save_webp(wax, f"{OUT}/wax-seal.webp", 88)

# ==============================================================================
# 3. LUXURIOUS SILK SATIN RIBBON & BOW
# ==============================================================================
def gen_ribbon_bow():
    w, h = 900, 450
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    
    # French satin ribbon colors: Warm rose champagne / blush satin
    c_shadow = (175, 115, 130)
    c_mid = (228, 164, 178)
    c_high = (248, 214, 222)
    c_sheen = (255, 240, 245)
    
    cx, cy = w // 2, 195
    
    # Draw Left Loop
    left_loop = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dl = ImageDraw.Draw(left_loop)
    # Loop outer fold
    dl.polygon([
        (cx - 20, cy - 15), (cx - 160, cy - 95), (cx - 310, cy - 50),
        (cx - 330, cy + 20), (cx - 250, cy + 70), (cx - 120, cy + 35), (cx - 20, cy + 15)
    ], fill=c_mid + (255,))
    # Inner shadow fold
    dl.polygon([
        (cx - 140, cy - 40), (cx - 270, cy - 10), (cx - 250, cy + 35), (cx - 130, cy + 10)
    ], fill=c_shadow + (255,))
    # Satin sheen streak
    dl.line([(cx - 70, cy - 35), (cx - 290, cy - 15)], fill=c_high + (210,), width=28)
    dl.line([(cx - 110, cy - 35), (cx - 260, cy - 20)], fill=c_sheen + (240,), width=10)
    left_loop = left_loop.filter(ImageFilter.GaussianBlur(6))
    
    # Draw Right Loop (symmetrical with organic variance)
    right_loop = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dr = ImageDraw.Draw(right_loop)
    dr.polygon([
        (cx + 20, cy - 15), (cx + 160, cy - 95), (cx + 310, cy - 50),
        (cx + 330, cy + 20), (cx + 250, cy + 70), (cx + 120, cy + 35), (cx + 20, cy + 15)
    ], fill=c_mid + (255,))
    dr.polygon([
        (cx + 140, cy - 40), (cx + 270, cy - 10), (cx + 250, cy + 35), (cx + 130, cy + 10)
    ], fill=c_shadow + (255,))
    dr.line([(cx + 70, cy - 35), (cx + 290, cy - 15)], fill=c_high + (210,), width=28)
    dr.line([(cx + 110, cy - 35), (cx + 260, cy - 20)], fill=c_sheen + (240,), width=10)
    right_loop = right_loop.filter(ImageFilter.GaussianBlur(6))
    
    # Flowing Ribbon Tails (left & right)
    tails = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dt = ImageDraw.Draw(tails)
    # Left tail with elegant dovetail cut
    dt.polygon([
        (cx - 35, cy + 20), (cx - 110, cy + 170), (cx - 150, cy + 225),
        (cx - 120, cy + 220), (cx - 80, cy + 235), (cx - 25, cy + 160), (cx - 5, cy + 25)
    ], fill=c_mid + (255,))
    dt.line([(cx - 35, cy + 35), (cx - 115, cy + 205)], fill=c_high + (200,), width=14)
    dt.line([(cx - 28, cy + 40), (cx - 105, cy + 195)], fill=c_sheen + (230,), width=5)
    
    # Right tail
    dt.polygon([
        (cx + 35, cy + 20), (cx + 110, cy + 170), (cx + 150, cy + 225),
        (cx + 120, cy + 220), (cx + 80, cy + 235), (cx + 25, cy + 160), (cx + 5, cy + 25)
    ], fill=c_mid + (255,))
    dt.line([(cx + 35, cy + 35), (cx + 115, cy + 205)], fill=c_high + (200,), width=14)
    dt.line([(cx + 28, cy + 40), (cx + 105, cy + 195)], fill=c_sheen + (230,), width=5)
    tails = tails.filter(ImageFilter.GaussianBlur(5))
    
    # Central Knot with tight tuck and 3D gathers
    knot = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dk = ImageDraw.Draw(knot)
    # Shadow under knot
    dk.ellipse([cx - 42, cy - 38, cx + 42, cy + 42], fill=c_shadow + (255,))
    # Knot body
    dk.ellipse([cx - 36, cy - 34, cx + 36, cy + 36], fill=c_mid + (255,))
    # Knot highlights & fold ripples
    dk.line([(cx - 15, cy - 25), (cx - 12, cy + 25)], fill=c_high + (220,), width=9)
    dk.line([(cx + 8, cy - 22), (cx + 12, cy + 22)], fill=c_sheen + (240,), width=7)
    knot = knot.filter(ImageFilter.GaussianBlur(3))
    
    # Composite all parts with realistic soft drop shadow
    composite = Image.alpha_composite(tails, left_loop)
    composite = Image.alpha_composite(composite, right_loop)
    composite = Image.alpha_composite(composite, knot)
    
    # Soft ambient drop shadow underneath bow
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dsh = ImageDraw.Draw(shadow)
    dsh.ellipse([cx - 320, cy - 40, cx + 320, cy + 180], fill=(74, 58, 69, 50))
    shadow = shadow.filter(ImageFilter.GaussianBlur(28))
    
    final_ribbon = Image.alpha_composite(shadow, composite)
    save_webp(final_ribbon, f"{OUT}/ribbon-bow.webp", 86)

# ==============================================================================
# 4. BOTANICAL WATERCOLOR RENDERING ENGINE (Roses, Peonies, Foliage)
# ==============================================================================
def draw_watercolor_leaf(img, x, y, length, angle, color=(95, 128, 92), width=18):
    """Draws a delicate, tapered watercolor leaf with natural vein & transparency"""
    leaf = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(leaf)
    
    cos_a = math.cos(angle)
    sin_a = math.sin(angle)
    perp_cos = -sin_a
    perp_sin = cos_a
    
    pts = []
    # Base
    pts.append((x, y))
    # Mid-curve left
    pts.append((x + length * 0.45 * cos_a + width * 0.5 * perp_cos,
                y + length * 0.45 * sin_a + width * 0.5 * perp_sin))
    # Tip
    pts.append((x + length * cos_a, y + length * sin_a))
    # Mid-curve right
    pts.append((x + length * 0.55 * cos_a - width * 0.5 * perp_cos,
                y + length * 0.55 * sin_a - width * 0.5 * perp_sin))
    
    # Fill translucent watercolor body
    d.polygon(pts, fill=color + (185,))
    # Delicate center stem vein
    d.line([(x, y), (x + length * 0.85 * cos_a, y + length * 0.85 * sin_a)],
           fill=(max(0, color[0]-30), max(0, color[1]-20), max(0, color[2]-30), 220), width=2)
    
    leaf = leaf.filter(ImageFilter.GaussianBlur(2))
    return Image.alpha_composite(img, leaf)

def draw_watercolor_rose(img, cx, cy, radius, base_col=(250, 222, 226), inner_col=(228, 150, 168)):
    """Draws layered translucent rose petals in an authentic botanical spiral"""
    rose = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(rose)
    
    # Outer soft petals
    num_outer = 18
    for i in range(num_outer):
        ang = 2 * math.pi * i / num_outer + random.uniform(-0.2, 0.2)
        dist = radius * random.uniform(0.65, 0.9)
        px = cx + dist * math.cos(ang)
        py = cy + dist * math.sin(ang)
        pr = radius * random.uniform(0.38, 0.52)
        d.ellipse([px - pr, py - pr * 0.85, px + pr, py + pr * 0.85],
                  fill=base_col + (random.randint(140, 190),))
        
    # Mid petals
    num_mid = 14
    for i in range(num_mid):
        ang = 2 * math.pi * i / num_mid + 0.4 + random.uniform(-0.15, 0.15)
        dist = radius * random.uniform(0.35, 0.6)
        px = cx + dist * math.cos(ang)
        py = cy + dist * math.sin(ang)
        pr = radius * random.uniform(0.28, 0.4)
        # Gradient blend towards center
        r_blend = int(base_col[0] * 0.5 + inner_col[0] * 0.5)
        g_blend = int(base_col[1] * 0.5 + inner_col[1] * 0.5)
        b_blend = int(base_col[2] * 0.5 + inner_col[2] * 0.5)
        d.ellipse([px - pr, py - pr * 0.8, px + pr, py + pr * 0.8],
                  fill=(r_blend, g_blend, b_blend, random.randint(170, 220)))
        
    # Tight bud center spirals
    num_center = 12
    for i in range(num_center):
        ang = i * 1.3
        dist = radius * (0.05 + 0.22 * (i / num_center))
        px = cx + dist * math.cos(ang)
        py = cy + dist * math.sin(ang)
        pr = radius * (0.12 + 0.16 * (1.0 - i / num_center))
        d.arc([px - pr, py - pr, px + pr, py + pr], start=int(math.degrees(ang)), end=int(math.degrees(ang + 2.5)),
              fill=inner_col + (230,), width=int(max(2, pr * 0.4)))
        
    rose = rose.filter(ImageFilter.GaussianBlur(3))
    return Image.alpha_composite(img, rose)

# ==============================================================================
# 5. MONUMENTAL FLORAL WEDDING ARCH (1000 x 1500)
# ==============================================================================
def gen_arch_floral():
    w, h = 1000, 1500
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    
    # 1. Soft Sheer Organza Drapery Glow & Swags
    drape = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dd = ImageDraw.Draw(drape)
    
    # Curving sheer white fabric swag across the top arch
    cx, cy = 500, 480
    rx, ry = 340, 420
    
    # Organza translucent swags
    for i in range(8):
        offset_y = i * 15
        dd.arc([cx - rx - 30, cy - ry + offset_y, cx + rx + 30, cy + ry + offset_y],
               start=190, end=350, fill=(255, 252, 250, 45 - i * 4), width=28)
               
    # Flowing sheer curtain tails falling along both pillars
    # Left drape
    dd.polygon([(160, 420), (220, 420), (260, 1450), (140, 1450)], fill=(255, 250, 248, 55))
    # Right drape
    dd.polygon([(780, 420), (840, 420), (860, 1450), (740, 1450)], fill=(255, 250, 248, 55))
    drape = drape.filter(ImageFilter.GaussianBlur(25))
    img = Image.alpha_composite(img, drape)
    
    # 2. Rich Botanical Foliage Foundation (Eucalyptus, Olive, Silver Dollar)
    foliage = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    
    # Foliage coordinates along the full arch archway
    steps = 120
    arch_nodes = []
    for i in range(steps):
        t = i / (steps - 1)
        if t < 0.35: # Left pillar
            k = t / 0.35
            arch_nodes.append((190 + math.sin(k * math.pi) * 15, 1400 - k * 950))
        elif t < 0.65: # Top curved arch
            k = (t - 0.35) / 0.30
            ang = math.pi * (1.0 - k)
            arch_nodes.append((cx + rx * math.cos(ang), cy - ry * math.sin(ang)))
        else: # Right pillar
            k = (t - 0.65) / 0.35
            arch_nodes.append((810 - math.sin(k * math.pi) * 15, 450 + k * 950))
            
    # Plant lush eucalyptus leaves branching out
    for x, y in arch_nodes:
        # Branch leaves outwards
        for _ in range(random.randint(4, 7)):
            angle = random.uniform(0, 2 * math.pi)
            length = random.uniform(28, 65)
            width = random.uniform(14, 26)
            col = random.choice([
                (110, 138, 108), # Sage
                (85, 115, 88),   # Olive deep
                (142, 168, 140), # Silver eucalyptus
                (175, 188, 170)  # Dusty pale leaf
            ])
            foliage = draw_watercolor_leaf(foliage, x + random.uniform(-25, 25), y + random.uniform(-25, 25),
                                           length, angle, col, width)
            
    img = Image.alpha_composite(img, foliage)
    
    # 3. Dense Luxury Flowers (David Austin Garden Roses, Lush White Peonies, Blush Ranunculus)
    floral_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    
    flower_palette = [
        # Bridal White Peony
        ((255, 253, 252), (252, 238, 235)),
        # Blush Garden Rose
        ((253, 235, 238), (238, 178, 192)),
        # Champagne Peach Rose
        ((255, 246, 238), (246, 206, 185)),
        # Soft Mauve Peony
        ((246, 232, 238), (220, 180, 198)),
        # Pale Cream Blossom
        ((255, 255, 250), (242, 232, 212))
    ]
    
    # Render over 160 distinct dimensional watercolor flowers clustered on the arch
    for idx, (x, y) in enumerate(arch_nodes):
        if idx % 2 == 0 or random.random() < 0.4:
            base_c, inner_c = random.choice(flower_palette)
            rad = random.randint(34, 62)
            ox = random.uniform(-38, 38)
            oy = random.uniform(-38, 38)
            floral_layer = draw_watercolor_rose(floral_layer, x + ox, y + oy, rad, base_c, inner_c)
            
    # Add tiny delicate filler blossom buds (Baby's breath / waxflower)
    df = ImageDraw.Draw(floral_layer)
    for x, y in arch_nodes:
        for _ in range(random.randint(3, 6)):
            bx = x + random.uniform(-65, 65)
            by = y + random.uniform(-65, 65)
            br = random.randint(5, 10)
            df.ellipse([bx - br, by - br, bx + br, by + br], fill=(255, 255, 255, 230))
            
    img = Image.alpha_composite(img, floral_layer)
    
    # 4. Final soft depth of field and grain
    img = add_fine_noise(img, 3)
    save_webp(img, f"{OUT}/arch-floral.webp", 82)

# ==============================================================================
# 6. ELEGANT TUSCAN CYPRESS TREES (500 x 1400)
# ==============================================================================
def gen_cypress_tree(path, lean=0):
    w, h = 500, 1400
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    
    # Natural organic painterly cypress silhouette with feathered botanical texture
    cx = 250 + lean
    foliage = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(foliage)
    
    # Draw natural trunk core
    d.polygon([(cx - 15, h), (cx + 15, h), (cx + 8, 300), (cx - 8, 300)], fill=(75, 62, 54, 255))
    
    # Layers of soft painterly cypress clusters
    for y in range(h - 80, 120, -18):
        progress = (h - y) / h # 0 at bottom, 1 at top
        # Cypress profile: slender column, gently tapering
        width_max = int(math.sin(progress * math.pi * 0.9) * 115 + 24)
        
        num_clusters = max(4, int(width_max / 14))
        for _ in range(num_clusters):
            offset_x = random.uniform(-width_max, width_max)
            cy_cluster = y + random.uniform(-14, 14)
            r = random.uniform(16, 36)
            
            # Sunlight on one side, deep cypress green on the other
            sun_factor = (offset_x + width_max) / (2 * width_max)
            r_col = int(60 + 35 * sun_factor)
            g_col = int(82 + 45 * sun_factor)
            b_col = int(64 + 30 * sun_factor)
            
            d.ellipse([cx + offset_x - r, cy_cluster - r * 1.3,
                       cx + offset_x + r, cy_cluster + r * 1.3],
                      fill=(r_col, g_col, b_col, 215))
                      
    # Refined tapering spire tip
    d.polygon([(cx - 16, 220), (cx + 16, 220), (cx, 80)], fill=(80, 108, 85, 235))
    
    foliage = foliage.filter(ImageFilter.GaussianBlur(5))
    img = Image.alpha_composite(img, foliage)
    img = add_fine_noise(img, 4)
    save_webp(img, path, 78)

def gen_trees():
    gen_cypress_tree(f"{OUT}/trees-cypress-left.webp", lean=-12)
    gen_cypress_tree(f"{OUT}/trees-cypress-right.webp", lean=12)

# ==============================================================================
# 7. BOTANICAL CORNER BOUQUETS (700 x 700)
# ==============================================================================
def gen_corner_bouquet(path, flip_x=1, flip_y=1):
    w, h = 700, 700
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    
    # Pivot point is near the corner
    px = 90 if flip_x > 0 else 610
    py = 90 if flip_y > 0 else 610
    
    # 1. Trailing greenery reaching out along top and side edges
    leaves = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    for _ in range(26):
        ang = random.uniform(0, math.pi / 2)
        if flip_x < 0 and flip_y > 0: ang = random.uniform(math.pi / 2, math.pi)
        elif flip_x > 0 and flip_y < 0: ang = random.uniform(-math.pi / 2, 0)
        elif flip_x < 0 and flip_y < 0: ang = random.uniform(math.pi, 3 * math.pi / 2)
        
        dist = random.uniform(70, 340)
        lx = px + dist * math.cos(ang)
        ly = py + dist * math.sin(ang)
        leaf_ang = ang + random.uniform(-0.4, 0.4)
        col = random.choice([
            (115, 142, 112),
            (95, 122, 98),
            (155, 178, 150),
            (180, 195, 178)
        ])
        leaves = draw_watercolor_leaf(leaves, lx, ly, random.uniform(35, 75), leaf_ang, col, random.uniform(15, 26))
    img = Image.alpha_composite(img, leaves)
    
    # 2. Main Corner Floral Cluster (Garden rose + Peony + buds)
    flowers = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    # Hero rose
    flowers = draw_watercolor_rose(flowers, px + 110 * flip_x, py + 110 * flip_y, 75,
                                  (255, 238, 240), (240, 175, 190))
    # Supporting white peony
    flowers = draw_watercolor_rose(flowers, px + 195 * flip_x, py + 80 * flip_y, 58,
                                  (255, 252, 250), (250, 232, 225))
    # Soft peach blossom
    flowers = draw_watercolor_rose(flowers, px + 80 * flip_x, py + 200 * flip_y, 52,
                                  (255, 245, 238), (248, 205, 185))
    # Delicate ranunculus
    flowers = draw_watercolor_rose(flowers, px + 250 * flip_x, py + 180 * flip_y, 42,
                                  (248, 232, 240), (225, 185, 205))
                                  
    img = Image.alpha_composite(img, flowers)
    img = add_fine_noise(img, 3)
    save_webp(img, path, 80)

def gen_corners():
    gen_corner_bouquet(f"{OUT}/florals-corner-tl.webp", 1, 1)
    gen_corner_bouquet(f"{OUT}/florals-corner-tr.webp", -1, 1)
    gen_corner_bouquet(f"{OUT}/florals-corner-bl.webp", 1, -1)
    gen_corner_bouquet(f"{OUT}/florals-corner-br.webp", -1, -1)

# ==============================================================================
# 8. ETCHED BACKGROUND SKY & TUSCAN HILLS
# ==============================================================================
def gen_sky():
    # Ethereal painterly wedding sky: soft dawn blush, lavender horizon, champagne sun glow
    w, h = 1080, 2400
    img = Image.new("RGB", (w, h))
    px = img.load()
    
    # 3-tier vertical luxury gradient
    c_top = (212, 200, 228)   # soft misty lavender
    c_mid = (242, 222, 230)   # romantic blush pink
    c_bot = (255, 240, 228)   # champagne golden horizon
    
    for y in range(h):
        t = y / (h - 1)
        if t < 0.45:
            k = t / 0.45
            col = tuple(int(c_top[i] + (c_mid[i] - c_top[i]) * k) for i in range(3))
        else:
            k = (t - 0.45) / 0.55
            col = tuple(int(c_mid[i] + (c_bot[i] - c_mid[i]) * k) for i in range(3))
        for x in range(w):
            px[x, y] = col
            
    # Soft luminous clouds
    clouds = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dc = ImageDraw.Draw(clouds)
    for _ in range(18):
        cx = random.randint(100, 980)
        cy = random.randint(300, 1800)
        rx = random.randint(220, 500)
        ry = random.randint(80, 220)
        col = random.choice([
            (255, 255, 255, 35),
            (255, 248, 235, 40),
            (245, 225, 235, 30)
        ])
        dc.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=col)
    clouds = clouds.filter(ImageFilter.GaussianBlur(110))
    
    img = Image.alpha_composite(img.convert("RGBA"), clouds).convert("RGB")
    img = add_fine_noise(img, 4)
    save_webp(img, f"{OUT}/bg-sky.webp", 82)

def gen_hills():
    # Hazy rolling Tuscan hills with atmospheric depth & lake mist
    w, h = 1080, 1200
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    
    # Layer 1: Distant blue-mauve mountains
    pts1 = [(0, h), (0, 480)]
    for x in range(0, w + 30, 40):
        y = 480 + int(math.sin(x / 240.0) * 85 + math.sin(x / 110.0) * 35)
        pts1.append((x, y))
    pts1.append((w, h))
    d.polygon(pts1, fill=(185, 175, 202, 160))
    
    # Layer 2: Mid-ground rolling sage-lavender hills
    pts2 = [(0, h), (0, 640)]
    for x in range(0, w + 30, 40):
        y = 640 + int(math.sin(x / 180.0 + 1.2) * 105 + math.sin(x / 85.0) * 25)
        pts2.append((x, y))
    pts2.append((w, h))
    d.polygon(pts2, fill=(195, 182, 196, 185))
    
    # Layer 3: Nearer Tuscan ridge
    pts3 = [(0, h), (0, 820)]
    for x in range(0, w + 30, 40):
        y = 820 + int(math.sin(x / 220.0 + 2.8) * 120 + math.cos(x / 95.0) * 30)
        pts3.append((x, y))
    pts3.append((w, h))
    d.polygon(pts3, fill=(192, 196, 185, 215))
    
    img = img.filter(ImageFilter.GaussianBlur(14))
    img = add_fine_noise(img, 3)
    save_webp(img, f"{OUT}/bg-hills.webp", 78)

# ==============================================================================
# 9. HIGH DETAIL FLOATING PETALS SPRITE (512 x 128)
# ==============================================================================
def gen_petals_sprite():
    w, h = 512, 128
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    
    # 4 distinct botanical petals: White peony, Blush garden rose, Lavender petal, Golden champagne petal
    petal_configs = [
        ((255, 252, 250), (250, 235, 238)), # Ivory peony petal
        ((252, 224, 230), (238, 175, 190)), # Blush rose petal
        ((226, 215, 238), (198, 182, 218)), # Lavender petal
        ((248, 232, 198), (225, 195, 142))  # Champagne gold petal
    ]
    
    for idx, (base, inner) in enumerate(petal_configs):
        cx = 64 + idx * 128
        cy = 64
        # Single detailed cupped petal
        p = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        dp = ImageDraw.Draw(p)
        # Cupped organic petal curve
        dp.ellipse([cx - 36, cy - 48, cx + 36, cy + 48], fill=base + (240,))
        # Inner petal crease / blush shading
        dp.ellipse([cx - 22, cy - 30, cx + 22, cy + 38], fill=inner + (210,))
        # Edge highlight
        dp.arc([cx - 35, cy - 47, cx + 35, cy + 47], start=210, end=330, fill=(255, 255, 255, 250), width=2)
        p = p.filter(ImageFilter.GaussianBlur(1))
        img = Image.alpha_composite(img, p)
        
    save_webp(img, f"{OUT}/petals-sprite.webp", 88)

if __name__ == "__main__":
    print("Generating refined luxury assets...")
    gen_envelope()
    gen_paper_card()
    gen_wax_seal()
    gen_ribbon_bow()
    gen_arch_floral()
    gen_trees()
    gen_corners()
    gen_sky()
    gen_hills()
    gen_petals_sprite()
    print("All luxury visual assets created successfully!")
