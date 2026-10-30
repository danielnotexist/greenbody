#!/usr/bin/env python3
"""Turns the generated grid images into GreenBody exercise media.

Every prompt in media-gen/prompts/day-N.json produces one image: a grid with one exercise
per row (left cell START, right cell END) and a thin strip at the bottom carrying the
prompt's code (e.g. B1-001). Save each downloaded image as media-gen/raw/<code>.png
(or .jpg/.webp), then:

    python3 media-gen/tools/process.py <day-number>

writes, for every exercise of that day whose image exists:
    media-gen/out/start/<id>.webp   the START frame, 480x480 on white
    media-gen/out/end/<id>.webp     the END frame, same size and placement
and review sheets media-gen/review/day-N-XX.jpg (four prompt images per sheet, each labelled
with its code and the exercises it should show) for checking the drawings.

Needs Python 3 with Pillow (pip install Pillow).
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIZE = 480


def strip_code(im):
    """Cut off the code strip: everything below the topmost full-width divider line in the
    bottom 12% of the image; without such a line, below the last white gap."""
    g = ImageOps.grayscale(im); px = g.load(); w, h = g.size
    for y in range(int(h * 0.88), h - 2):
        if sum(1 for x in range(0, w, 4) if px[x, y] < 238) > 0.85 * (w // 4):
            return im.crop((0, 0, w, y))
    rows = [sum(1 for x in range(0, w, 4) if px[x, y] < 235) for y in range(h)]
    y = h - 1
    while y > 0 and rows[y] == 0: y -= 1
    while y > 0 and rows[y] > 0: y -= 1
    end = y
    while y > 0 and rows[y] == 0: y -= 1
    return im.crop((0, 0, w, y + 2)) if end - y >= 4 and (h - y) < h * 0.2 else im


def divider(px, w, h, axis, lo, hi):
    """The light-grey divider line between lo and hi: the line with the most mid-grey pixels."""
    best, pos = -1, (lo + hi) // 2
    for p in range(lo, hi):
        pts = ((x, p) for x in range(0, w, 4)) if axis == 'h' else ((p, y) for y in range(0, h, 4))
        score = sum(1 for q in pts if 150 < px[q] < 235)
        if score > best: best, pos = score, p
    return pos


def split(im, rows):
    """A rows x 2 grid -> [(start, end), ...]."""
    im = strip_code(im)
    g = ImageOps.grayscale(im); px = g.load(); w, h = g.size
    ys = [0] + [divider(px, w, h, 'h', h * r // rows - h // (rows * 6), h * r // rows + h // (rows * 6)) for r in range(1, rows)] + [h]
    pad = max(4, w // 150)
    pairs = []
    for r in range(rows):
        cell = im.crop((0, ys[r] + pad, w, ys[r + 1] - pad))
        cg = ImageOps.grayscale(cell); cpx = cg.load(); cw, ch = cg.size
        x = divider(cpx, cw, ch, 'v', int(cw * 0.4), int(cw * 0.6))
        pairs.append((cell.crop((0, 0, x - pad, ch)), cell.crop((x + pad, 0, cw, ch))))
    return pairs


def square(im):
    im = im.copy(); im.thumbnail((SIZE, SIZE), Image.LANCZOS)
    out = Image.new('RGB', (SIZE, SIZE), 'white')
    out.paste(im, ((SIZE - im.width) // 2, (SIZE - im.height) // 2))
    return out


def font(size):
    for f in ('/System/Library/Fonts/Supplemental/Arial.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
              'C:/Windows/Fonts/arial.ttf'):
        if os.path.exists(f): return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def raw_path(code):
    for ext in ('.png', '.jpg', '.jpeg', '.webp'):
        p = os.path.join(ROOT, 'raw', code + ext)
        if os.path.exists(p): return p
    return None


def main(day):
    prompts = json.load(open(os.path.join(ROOT, 'prompts', f'day-{day}.json'), encoding='utf-8'))
    for d in ('out/start', 'out/end', 'review'): os.makedirs(os.path.join(ROOT, d), exist_ok=True)
    done, missing, tiles = 0, [], []
    for p in prompts:
        path = raw_path(p['code'])
        if not path: missing.append(p['code']); continue
        im = Image.open(path).convert('RGB')
        for (a, b), ex in zip(split(im, len(p['exercises'])), p['exercises']):
            square(a).save(os.path.join(ROOT, 'out/start', ex['id'] + '.webp'), quality=82)
            square(b).save(os.path.join(ROOT, 'out/end', ex['id'] + '.webp'), quality=82)
            done += 1
        tiles.append((p, im))
    # review sheets: 4 prompt images per sheet, each with its code and expected exercises
    tw, th, head = 520, 920, 120
    f1, f2 = font(22), font(15)
    for s in range(0, len(tiles), 4):
        sheet = Image.new('RGB', (tw * 4, th + head), 'white'); d = ImageDraw.Draw(sheet)
        for i, (p, im) in enumerate(tiles[s:s + 4]):
            x = i * tw
            d.text((x + 8, 6), p['code'], fill=(21, 128, 61), font=f1)
            for r, ex in enumerate(p['exercises']):
                d.text((x + 8, 36 + r * 20), f"{r + 1}. {ex['id']} {ex['en']}"[:62], fill='black', font=f2)
            t = im.copy(); t.thumbnail((tw - 10, th)); sheet.paste(t, (x + 5, head))
        sheet.save(os.path.join(ROOT, 'review', f'day-{day}-{s // 4 + 1:02d}.jpg'), quality=80)
    print(f'day {day}: {done} exercises written, {len(tiles)} images, {len(missing)} missing')
    if missing: print('missing:', ' '.join(missing))


if __name__ == '__main__':
    main(sys.argv[1])
