#!/usr/bin/env python3
"""
Regenerates every icon in assets/ from assets/logo.png.

NOT part of `npm run build`. The build stays zero-dependency Node; this needs
Pillow, and icons change roughly never. Run it by hand after replacing the
logo:

    python3 scripts/make-icons.py

WHAT IT PRODUCES, AND WHY EACH IS DIFFERENT
-------------------------------------------
The source is a detailed illustration with a "NISSA SAFARIS" wordmark under
it. That is a fine logo and a hard icon: at 48px it reads, at 32px it just
about reads, and at 16px the wordmark is mud. So the sizes are not all the
same crop, which is the entire reason .ico is a multi-size format.

  16px (inside favicon.ico)  the circular medallion only, wordmark dropped.
                             At 16px the words are three grey smears; without
                             them the figure and spear still read as a shape.
  32px, 48px                 the full logo, lightly sharpened to recover the
                             edge detail that downscaling costs.
  180px (apple-touch)        full logo. iOS composites onto white if the icon
                             has alpha, so this is flattened onto black.
  192px, 512px               full logo.
  maskable 512px             the medallion only, inset inside the safe circle.
                             Android crops maskable icons to a circle or
                             squircle; the full logo's wordmark runs to the
                             edges and would be sliced through. The medallion
                             is already round, so it survives every mask.

The logo has a transparent border and a pure black interior backdrop, so
everything is flattened onto black rather than onto the site's forest green:
padding with any other colour would draw a visible ring around the artwork.
"""

from PIL import Image, ImageEnhance
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, 'assets')
SRC = os.path.join(ASSETS, 'logo.png')
BLACK = (0, 0, 0)

# The circular medallion, without the wordmark band beneath it.
#
# Measured off the 760x761 source rather than eyeballed: the illustration's
# lit pixels run x 88-688, y 12-520, and mean row brightness jumps from 6 at
# y=524 to 57 at y=532, which is the top edge of the "NISSA" lettering. The
# box below stops short of that. A first attempt at (40, 0, 720, 540) kept a
# sliver of the wordmark, and the circular mask then sliced through it.
# Re-measure if the logo is ever redrawn.
MEDALLION = (72, 12, 690, 522)


def flatten(img, bg=BLACK):
    out = Image.new('RGB', img.size, bg)
    out.paste(img, (0, 0), img)
    return out


def square(img):
    """Pads to a square on black, so nothing is ever cropped by the resize."""
    side = max(img.size)
    out = Image.new('RGB', (side, side), BLACK)
    out.paste(img, ((side - img.width) // 2, (side - img.height) // 2))
    return out


def render(source, size, sharpen=1.6):
    im = source.resize((size, size), Image.LANCZOS)
    return ImageEnhance.Sharpness(im).enhance(sharpen) if sharpen else im


def write_ico(path, entries):
    """
    Writes a multi-size .ico with an exact size-to-image mapping.

    entries: [(size, PIL.Image), ...]. Each frame is stored PNG-encoded,
    which every browser in use has supported for well over a decade and
    which keeps the file small.
    """
    import io
    import struct

    payloads = []
    for size, img in entries:
        buf = io.BytesIO()
        img.convert('RGBA').save(buf, format='PNG', optimize=True)
        payloads.append((size, buf.getvalue()))

    header = struct.pack('<HHH', 0, 1, len(payloads))  # reserved, type=icon, count
    offset = len(header) + 16 * len(payloads)
    directory = b''
    for size, data in payloads:
        directory += struct.pack(
            '<BBBBHHII',
            size if size < 256 else 0,  # width, 0 means 256
            size if size < 256 else 0,  # height
            0,                          # palette size, 0 for truecolour
            0,                          # reserved
            1,                          # colour planes
            32,                         # bits per pixel
            len(data),
            offset,
        )
        offset += len(data)

    with open(path, 'wb') as fh:
        fh.write(header)
        fh.write(directory)
        for _, data in payloads:
            fh.write(data)


def main():
    base = Image.open(SRC).convert('RGBA')
    full = square(flatten(base))
    medallion = square(flatten(base.crop(MEDALLION)))

    written = []

    def save(img, name):
        path = os.path.join(ASSETS, name)
        img.save(path, 'PNG', optimize=True)
        written.append(f'{name} {img.size[0]}x{img.size[1]} {os.path.getsize(path) // 1024}KB')

    save(render(full, 32), 'icon-32.png')
    save(render(full, 180), 'apple-touch-icon.png')
    save(render(full, 192), 'icon-192.png')
    save(render(full, 512, sharpen=1.2), 'icon-512.png')

    # Maskable: the medallion inside the safe circle. Android's tightest mask
    # is a circle of 80% of the canvas; a square inscribed in that circle has
    # a side of 0.8 / sqrt(2), about 57%. Using the round medallion instead of
    # the square logo means the artwork can fill 80% rather than 57%, because
    # a circle inside a circle wastes nothing.
    canvas = Image.new('RGB', (512, 512), BLACK)
    inner = render(medallion, int(512 * 0.80), sharpen=1.2)
    canvas.paste(inner, ((512 - inner.width) // 2, (512 - inner.height) // 2))
    save(canvas, 'icon-maskable-512.png')

    # favicon.ico carries three renderings in one file, and which rendering
    # lands at which size is the whole point: 16 is the medallion, 32 and 48
    # are the full logo. Pillow's ICO writer pairs `sizes` with
    # `append_images` in an order that is not the one you pass, and it
    # silently put the medallion at 48 and the mud at 16, so the container is
    # assembled here instead. The format is trivial and this way it is exact.
    ico_path = os.path.join(ASSETS, 'favicon.ico')
    write_ico(ico_path, [
        (16, render(medallion, 16, sharpen=1.8)),
        (32, render(full, 32, sharpen=2.0)),
        (48, render(full, 48, sharpen=1.8)),
    ])
    written.append(f'favicon.ico 16+32+48 {os.path.getsize(ico_path) // 1024}KB')

    for line in written:
        print('icon:', line)


if __name__ == '__main__':
    main()
