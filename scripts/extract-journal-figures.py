"""Render selected evidence from the user's PDFs; boxes use PDF points, top-left origin.
Run with the bundled Python runtime (pypdfium2, Pillow). Source PDFs stay unchanged.
"""
import json, pathlib, pypdfium2 as pdfium
from PIL import Image, ImageDraw
ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = pathlib.Path('/Users/saeed/Documents/Papers')
SPECS = [
 ('cfe-shock-test', 'aem', 4, [70,222,525,435], 3),
 ('cfe-nozzle-speed', 'aem', 5, [65,214,531,411], 4),
 ('cfe-throat-force', 'aem', 9, [64,31,272,237], 9),
 ('cold-to-hot-setup', 'cold', 2, [152,487,394,654], 1),
 ('cold-to-hot-reversal', 'cold', 3, [127,282,553,586], 2),
 ('cold-to-hot-fluxes', 'cold', 5, [65,48,558,188], 3),
 ('cold-to-hot-uncertainty', 'cold', 8, [154,47,393,210], 6),
 ('xn4-conductivity', 'xn4', 6, [114,47,482,380], 6),
 ('xn4-phonons', 'xn4', 7, [126,47,470,362], 7),
 ('xn4-tension', 'xn4', 7, [114,385,482,714], 8),
 ('xn4-stiffness', 'xn4', 8, [307,46,549,154], 10),
 ('tio2-diameter', 'tio2', 5, [43,65,283,267], 6),
 ('tio2-vibrations', 'tio2', 6, [65,65,526,320], 9),
 ('tio2-electrostatics', 'tio2', 6, [312,359,552,550], 10),
 ('graphene-flow-speed', 'gas', 4, [138,274,469,449], 4),
 ('graphene-sliding', 'gas', 5, [312,55,559,218], 6),
 ('graphene-pressure', 'gas', 6, [75,198,268,345], 7),
 ('mlip-training', 'review', 5, [50,99,358,405], 1),
 ('mlip-bulk-comparison', 'review', 10, [50,96,562,399], 7),
 ('c2n-phonons', 'c2n', 4, [37,54,290,270], 4),
 ('c2n-vacancies', 'c2n', 6, [36,54,559,412], 9),
 ('silicon-temperature', 'silicon', 4, [307,52,558,271], 6),
 ('silicon-temperature-mechanics', 'silicon', 6, [53,51,542,451], 11),
 ('borophene-porosity', 'borophene', 5, [36,52,289,295], 4),
 ('borophene-rupture', 'borophene', 6, [95,52,501,560], 5),
 ('borophene-stiffness-design', 'borophene', 8, [36,503,559,724], 10),
 ('torsion-morphology', 'torsion', 3, [115,433,481,723], 3),
 ('torsion-material-comparison', 'torsion', 4, [64,54,263,431], 4),
 ('torsion-phonons', 'torsion', 4, [333,54,531,247], 6),
 ('silver-cooling', 'silver', 5, [47,420,282,630], 2),
 ('silver-continuum', 'silver', 8, [43,454,359,699], 6),
 ('silver-shell-fit', 'silver', 9, [320,85,535,220], 7),
 ('nanolayer-density-profile', 'nanolayer', 4, [40,529,278,730], 4),
 ('nanolayer-model-comparison', 'nanolayer', 6, [41,50,278,252], 8),
 ('nanolayer-viscosity', 'nanolayer', 7, [50,50,286,252], 10),
]
FILES = {
 'aem': 'Adv Eng Mater - 2026 - Islam - Compressible Flow Exfoliation of Two‐Dimensional Nanomaterials  Insights Into Layer.pdf',
 'cold': 's41598-023-31583-y.pdf', 'xn4': 'd3cp00746d.pdf',
 'tio2': '1-s2.0-S0167732221027781-main.pdf', 'gas': 'jp2c00425.pdf',
 'review': '210903_1_5.0069443.pdf', 'c2n': '1-s2.0-S001793102100692X-main.pdf',
 'silicon': '1-s2.0-S0927025621005437-main.pdf',
 'borophene': '1-s2.0-S1359836820333102-main.pdf',
 'torsion': '1-s2.0-S2352492819308992-main.pdf',
 'silver': '114701_1_online.pdf', 'nanolayer': '1-s2.0-S0167732218300084-main.pdf',
}
assets=ROOT/'public/journal-figures';assets.mkdir(exist_ok=True)
manifest={}; docs={}; thumbs=[]
for name,key,n,box,number in SPECS:
 if key not in docs:docs[key]=pdfium.PdfDocument(str(SOURCE/FILES[key]))
 page=docs[key][n-1]; scale=3
 im=page.render(scale=scale).to_pil().convert('RGB').crop(tuple(round(x*scale) for x in box))
 im.save(assets/f'{name}.jpg',quality=94)
 manifest[name]={'src':f'/journal-figures/{name}.jpg','width':im.width,'height':im.height,'source':f'Figure {number}','page':n,'sourceFile':FILES[key]}
 im.thumbnail((300,235));thumbs.append((name,im.copy()))
(ROOT/'scripts/journal-figure-assets.json').write_text(json.dumps(manifest,indent=2)+'\n')
out=ROOT/'tmp/pdfs';out.mkdir(parents=True,exist_ok=True)
for start in range(0,len(thumbs),12):
 canvas=Image.new('RGB',(1200,810),'#ddd');draw=ImageDraw.Draw(canvas)
 for i,(label,im) in enumerate(thumbs[start:start+12]):
  x=(i%4)*300;y=(i//4)*270;draw.text((x+4,y+4),label,fill='black');canvas.paste(im,(x,y+26))
 canvas.save(out/f'crops-{start//12}.jpg')
print(f'Extracted {len(manifest)} source figures')
