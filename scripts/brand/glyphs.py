"""Extracts Space Grotesk glyph outlines for the WebTechPros logo.

Writes scripts/brand/glyphs.json so the logo SVGs use real vector outlines
(no font needed to open them). Requires: pip install fonttools brotli
"""
import json
import pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

root = pathlib.Path(__file__).resolve().parents[2]
src = root / "node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2"
out = {}
for weight in (400, 700):
    font = instantiateVariableFont(TTFont(src), {"wght": weight})
    cmap = font.getBestCmap()
    glyphs = font.getGlyphSet()
    chars = {}
    for ch in "webtchpros.":
        name = cmap[ord(ch)]
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(pen)
        bounds = BoundsPen(glyphs)
        glyphs[name].draw(bounds)
        xmin, ymin, xmax, ymax = bounds.bounds
        chars[ch] = {"d": pen.getCommands(), "advance": font["hmtx"][name][0], "bounds": [xmin, ymin, xmax, ymax]}
    out[str(weight)] = chars
out["unitsPerEm"] = font["head"].unitsPerEm
out["capHeight"] = getattr(font["OS/2"], "sCapHeight", 700)
out["xHeight"] = getattr(font["OS/2"], "sxHeight", 500)
(root / "scripts/brand/glyphs.json").write_text(json.dumps(out))
print("wrote glyphs.json", out["unitsPerEm"], out["xHeight"])
