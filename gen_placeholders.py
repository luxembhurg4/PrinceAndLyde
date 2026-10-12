"""Placeholder art v2: softer, finer grain, no baked text on seal,
smooth trees, glow-based arch (no hard rect), tighter floral corners."""
import math, random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

random.seed("lyde-prince-v2")
OUT = "assets"

def vgrad(w, h, top, mid, bot):
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        if t < 0.5:
            k = t * 2; c = tuple(int(top[i] + (mid[i] - top[i]) * k) for i in range(3))
        else:
            k = (t - 0.5) * 2; c = tuple(int(mid[i] + (bot[i] - mid[i]) * k) for i in range(3))
        for x in range(w):
            px[x, y] = c
    return img

def blotches(base, n, colors, rmin, rmax, alpha=40, blur=70):
    w, h = base.size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(n):
        r = random.randint(rmin, rmax)
        x = random.randint(-r, w + r); y = random.randint(-r, h + r)
        d.ellipse([x - r, y - r, x + r, y + r], fill=random.choice(colors) + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    return Image.alpha_composite(base.convert("RGBA"), layer)

def fine_grain(img, amt=4):
    w, h = img.size
    n = Image.effect_noise((w // 2, h // 2), amt * 2).resize((w, h))
    n = n.convert("L").point(lambda v: (v - 128) // 3)
    from PIL import ImageChops
    ch = list(img.convert("RGB").split())
    ch = [ImageChops.add(c, n) for c in ch]
    rgb = Image.merge("RGB", ch)
    if img.mode == "RGBA":
        rgb.putalpha(img.split()[3])
    return rgb

def save(img, path, q=70):
    img.save(path, "WEBP", quality=q, method=6)
    print(path, img.size)

def soft_blur(img, radius, bg=(240, 222, 226)):
    """Blur color and alpha independently over a solid undertone so soft
    edges don't pick up dark halos from transparent-black pixels."""
    base = Image.new("RGB", img.size, bg)
    base.paste(img, mask=img.split()[3])
    base = base.filter(ImageFilter.GaussianBlur(radius))
    a = img.split()[3].filter(ImageFilter.GaussianBlur(max(radius - 3, 1)))
    out = base.convert("RGBA")
    out.putalpha(a)
    return out

# sky
sky = vgrad(1080, 2400, (205, 191, 224), (230, 214, 232), (248, 221, 224))
sky = blotches(sky, 22, [(255, 255, 255), (240, 220, 168)], 140, 360, 36, 110)
save(fine_grain(sky, 3).convert("RGB"), f"{OUT}/bg-sky.webp", 70)

# hills
hills = Image.new("RGBA", (1080, 1200), (0, 0, 0, 0))
d = ImageDraw.Draw(hills)
for (col, y0, amp) in [((176, 168, 200, 150), 560, 180), ((200, 185, 205, 130), 660, 220), ((214, 200, 210, 110), 780, 260)]:
    pts = [(0, 1200), (0, y0)]
    for x in range(0, 1081, 60):
        pts.append((x, y0 + int(math.sin(x / 220) * amp * 0.3 + math.sin(x / 97) * 12)))
    pts += [(1080, 1200)]
    d.polygon(pts, fill=col)
hills = hills.filter(ImageFilter.GaussianBlur(22))
save(hills, f"{OUT}/bg-hills.webp", 70)

# arch: soft ring of many small dabs, no rect, gentle inner glow
arch = Image.new("RGBA", (1000, 1500), (0, 0, 0, 0))
d = ImageDraw.Draw(arch)
cx, top, rx, ry = 500, 430, 290, 360
for i in range(110):
    ang = math.pi * (1 - i / 109)
    x = cx + rx * math.cos(ang); y = top - ry * math.sin(ang)
    r = random.randint(26, 58)
    col = random.choice([(255, 253, 251), (251, 230, 234), (246, 217, 214), (233, 220, 228), (168, 188, 162)])
    d.ellipse([x - r, y - r, x + r, y + r], fill=col + (225,))
# sheer veil comes from the CSS glow + rays; keep the art clean
arch = soft_blur(arch, 11)
# inner glow
glow = Image.new("RGBA", (1000, 1500), (0, 0, 0, 0))
dg = ImageDraw.Draw(glow)
dg.ellipse([cx - 260, top - 420, cx + 260, top + 420], fill=(255, 244, 238, 110))
glow = glow.filter(ImageFilter.GaussianBlur(60))
arch = Image.alpha_composite(arch, glow)
save(fine_grain(arch, 2), f"{OUT}/arch-floral.webp", 72)

# trees: smooth gradient columns with soft streaks
def cypress(path, lean=0):
    w, h = 500, 1400
    t = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(t)
    cx = 250 + lean
    for i in range(h):
        k = math.sin(math.pi * i / h)  # 0..1..0 top to bottom
        half = int(18 + 78 * k)
        shade = int(92 + 22 * math.sin(i / 90))
        col = (shade - 16, shade + 6, shade - 20, 235)
        d.line([(cx - half, i), (cx + half, i)], fill=col)
    # one whisper-soft light streak only
    x = cx + random.randint(-30, 30)
    d.line([(x, 200), (x, 1200)], fill=(186, 200, 178, 26), width=10)
    # taper top to a soft tip
    d.polygon([(cx - 40, 130), (cx + 40, 130), (cx, 20)], fill=(92, 110, 88, 235))
    t = soft_blur(t, 11, bg=(104, 120, 100))
    save(fine_grain(t, 2), path, 70)

from PIL import ImageChops
cypress(f"{OUT}/trees-cypress-left.webp", -14)
cypress(f"{OUT}/trees-cypress-right.webp", 14)

# corners: tighter, smaller, softer clusters
def corner(path, sx, sy):
    c = Image.new("RGBA", (700, 700), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    ax, ay = (70 if sx > 0 else 630), (70 if sy > 0 else 630)
    for _ in range(42):
        r = random.randint(13, 42)
        x = ax + random.randint(0, 190) * sx
        y = ay + random.randint(0, 190) * sy
        col = random.choice([(255, 253, 251), (251, 230, 234), (246, 217, 214), (168, 188, 162), (205, 175, 182)])
        d.ellipse([x - r, y - r, x + r, y + r], fill=col + (215,))
    # a few leaves as soft slivers
    for _ in range(10):
        x = ax + random.randint(0, 220) * sx; y = ay + random.randint(0, 220) * sy
        d.ellipse([x - 26, y - 9, x + 26, y + 9], fill=(150, 172, 146, 200))
    c = soft_blur(c, 9, bg=(250, 240, 240))
    save(c, path, 70)

corner(f"{OUT}/florals-corner-tl.webp", 1, 1)
corner(f"{OUT}/florals-corner-tr.webp", -1, 1)
corner(f"{OUT}/florals-corner-bl.webp", 1, -1)
corner(f"{OUT}/florals-corner-br.webp", -1, -1)

# petals sprite
sp = Image.new("RGBA", (512, 128), (0, 0, 0, 0))
d = ImageDraw.Draw(sp)
for i, col in enumerate([(255, 253, 251, 235), (243, 201, 207, 230), (205, 191, 224, 220), (228, 201, 138, 215)]):
    x0 = 20 + i * 122
    d.ellipse([x0, 30, x0 + 90, 98], fill=col)
sp = soft_blur(sp, 1, bg=(255, 255, 255))
save(sp, f"{OUT}/petals-sprite.webp", 85)

# envelope: no dots, whisper grain
env = vgrad(1080, 1920, (250, 230, 232), (243, 201, 207), (237, 185, 194))
env = blotches(env, 16, [(255, 255, 255), (240, 200, 208)], 120, 320, 30, 90)
save(fine_grain(env.convert("RGB"), 3), f"{OUT}/envelope-texture.webp", 68)

# wax seal: BLANK centre (live monogram text overlays it)
seal = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
d = ImageDraw.Draw(seal)
pts = []
for i in range(128):
    a = 2 * math.pi * i / 128
    r = 185 + 14 * math.sin(3 * a + 1) + 9 * math.sin(7 * a)
    pts.append((256 + r * math.cos(a), 256 + r * math.sin(a)))
d.polygon(pts, fill=(216, 184, 111, 255))
inner = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
di = ImageDraw.Draw(inner)
di.ellipse([96, 96, 416, 416], fill=(232, 201, 130, 255))
di.ellipse([120, 90, 400, 360], fill=(243, 224, 174, 200))
inner = inner.filter(ImageFilter.GaussianBlur(3))
seal = Image.alpha_composite(seal, inner)
d = ImageDraw.Draw(seal)
d.ellipse([130, 130, 382, 382], outline=(156, 119, 55, 200), width=4)
d.ellipse([140, 140, 372, 372], outline=(247, 235, 200, 160), width=2)
seal = seal.filter(ImageFilter.GaussianBlur(1))
save(seal, f"{OUT}/wax-seal.webp", 75)

# ribbon: closer tones, softer
rib = Image.new("RGBA", (900, 450), (0, 0, 0, 0))
d = ImageDraw.Draw(rib)
d.polygon([(450, 200), (180, 90), (150, 220), (430, 230)], fill=(231, 169, 182, 255))
d.polygon([(450, 200), (720, 90), (750, 220), (470, 230)], fill=(231, 169, 182, 255))
d.polygon([(420, 230), (330, 400), (390, 420), (455, 240)], fill=(226, 160, 175, 255))
d.polygon([(480, 230), (570, 400), (510, 420), (445, 240)], fill=(226, 160, 175, 255))
d.ellipse([408, 172, 492, 248], fill=(238, 186, 196, 255))
d.ellipse([420, 150, 480, 200], fill=(250, 220, 226, 200))  # sheen
rib = rib.filter(ImageFilter.GaussianBlur(7))
save(rib, f"{OUT}/ribbon-bow.webp", 70)

# paper card
paper = vgrad(1000, 1400, (255, 253, 252), (253, 244, 243), (250, 236, 235))
paper = blotches(paper, 12, [(255, 255, 255)], 90, 250, 46, 80)
save(fine_grain(paper.convert("RGB"), 3), f"{OUT}/paper-card.webp", 70)
print("done v2")
