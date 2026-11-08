"""Deterministic extraction of the authorized local Asalari capture. Never edits it."""
from pathlib import Path
import ast, hashlib, json, re, shutil

ROOT = Path(__file__).resolve().parents[5]
ARCHIVE = ROOT / 'Invitations - this folder will be removed from production/Invitations - this folder will be removed from production'
PROVIDER = ARCHIVE / 'Taklifla'
CAPTURE = PROVIDER / 'Web invitations/taklifla.uz/templates/asalari__74e3ca34cc14e7b4.html'
OUT = ROOT / 'apps/web/public/templates/taklifla-asalari'
OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'source').mkdir(exist_ok=True)
if not (OUT / 'fonts/fonts.css').is_file():
    raise RuntimeError('The checked-in fonts/fonts.css mapping is required to package the captured font subsets.')
raw = CAPTURE.read_text(encoding='utf-8')
styles = re.findall(r'<style>([\s\S]*?)</style>', raw)
scripts = re.findall(r'<script>([\s\S]*?)</script>', raw)
shutil.copyfile(CAPTURE, OUT / 'source/reference.html.txt')
(OUT / 'source/template.css').write_text(styles[0], encoding='utf-8')
(OUT / 'source/language.css').write_text(styles[1], encoding='utf-8')
# Keep the source opening, observer, and sparkle engine. Service/data code is separate.
engine = scripts[1].split('/* ----------------------- Countdown')[0]
engine = engine.replace("behavior:'smooth'", "behavior:document.body.classList.contains('reduce-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'")
engine = engine.replace("  p.appendChild(el);\n}", "  p.appendChild(el);\n}\nconst reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');\nfunction applyReducedMotion() {\n  document.body.classList.toggle('reduce-motion', reducedMotion.matches);\n  if (reducedMotion.matches) {\n    io.disconnect();\n    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));\n    p.replaceChildren();\n  } else document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));\n}\nreducedMotion.addEventListener?.('change', applyReducedMotion);\napplyReducedMotion();")
(OUT / 'source/motion.js').write_text(engine.strip() + '\n', encoding='utf-8')
body = re.search(r'<body[^>]*>([\s\S]*?)<script>', raw)[1]
body = re.sub(r'<!--.*?-->', '', body, flags=re.S)
# Retain structure and decorative glyphs, empty every source invitation value/copy.
body = re.sub(r'(?<=>)[^<>]+(?=<)', lambda m: m[0] if not m[0].strip() or m[0].strip() in ['✿','☀','✦','❀'] else '', body)
body = re.sub(r' src="assets/music.mp3"', '', body)
body = re.sub(r' href="https://maps[^\"]+"', '', body)
body = re.sub(r' data-text="[^"]*"', ' data-text=""', body)
body = re.sub(r' placeholder="[^"]*"', ' placeholder=""', body)
body = re.sub(r' aria-label="[^"]*"', ' aria-label=""', body)
body = re.sub(r'[ \t]+(?=\r?$)', '', body, flags=re.M)
body = body.replace('id="wishForm"', 'id="wishForm"').replace('maxlength="40"', 'maxlength="100"').replace('maxlength="320"', 'maxlength="2000"')
switch = re.search(r'<div class="taklifla-lang-switch"[\s\S]*?</div>\s*</div>', raw)[0]
switch = switch.replace('aria-label="Language"', 'aria-label="Til"').replace('data-lang="uz"', 'data-lang="uz-Latn"').replace('>UZ<', '>Uz<').replace('>EN<', '>En<').replace('>RU<', '>Ru<')
switch = switch.replace('<hr />', '<hr /><button type="button" data-lang="uz-Cyrl" role="menuitemradio">Уз</button>', 1)
html = '<!doctype html>\n<html lang="uz-Latn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Asalari</title><link rel="stylesheet" href="fonts/fonts.css"><link rel="stylesheet" href="template.css"><link rel="stylesheet" href="source/language.css"><link rel="stylesheet" href="platform.css"></head><body class="locked" data-pending>\n'+body+switch+'<script src="source/motion.js"></script><script src="copy.js"></script><script src="bridge.js"></script></body></html>'
(OUT / 'index.html').write_text(html, encoding='utf-8')
(OUT / 'template.css').write_text(styles[0], encoding='utf-8')
assets=[]
def copy(src, dest, url):
    dest.parent.mkdir(parents=True,exist_ok=True); shutil.copyfile(src,dest)
    assets.append(dict(capture=str(src.relative_to(ROOT)).replace('\\','/'),file=str(dest.relative_to(OUT)).replace('\\','/'),url=url,bytes=src.stat().st_size,sha256=hashlib.sha256(src.read_bytes()).hexdigest()))
for src in sorted((CAPTURE.parent/'asalari-img').iterdir()):
    name='cloud-puff.webp' if src.name.startswith('cloud-puff__') else src.name
    copy(src, OUT/'asalari-img'/name, 'asalari-img/'+('cloud-puff.webp?v=2' if name=='cloud-puff.webp' else name))
# Captured font files are variable faces. Use all captured subsets, with cmap ranges.
faces=[]
for family in ['fredoka','quicksand','caveat']:
    for src in sorted((PROVIDER/'Web invitations/fonts.gstatic.com/s'/family).rglob('*.woff2')):
        copy(src,OUT/'fonts'/src.name,'https://fonts.gstatic.com/s/'+family+'/'+src.parent.name+'/'+src.name)
items=ast.literal_eval('['+re.search(r'var ITEMS = \[([\s\S]*?)\n  \];',scripts[-1])[1]+']')
# Original supplied UZ/EN/RU strings are retained as design copy, excluding demo schedule/venue facts.
items=[x for x in items if not x[0].startswith('.tl-item') and x[0] not in ['.invite p','.venue p','.invite .when span:last-child','.timeline .sub'] and not x[0].startswith('.info li:nth-of-type(1) span') and not x[0].startswith('.info li:nth-of-type(2) span')]
cyrl={'ch':'ч','sh':'ш',"o'":'ў','o‘':'ў',"g'":'ғ','g‘':'ғ','yo':'ё','yu':'ю','ya':'я','ye':'е','a':'а','b':'б','d':'д','e':'е','f':'ф','g':'г','h':'ҳ','i':'и','j':'ж','k':'к','l':'л','m':'м','n':'н','o':'о','p':'п','q':'қ','r':'р','s':'с','t':'т','u':'у','v':'в','x':'х','y':'й','z':'з',"'":'ъ','‘':'ъ'}
def translit(s):
    out='';i=0
    while i<len(s):
        size=2 if s[i:i+2].lower() in cyrl else 1; part=s[i:i+size]; val=cyrl.get(part.lower(),part);out+=val.capitalize() if part[0].isupper() else val;i+=size
    return out
copydata={k:{} for k in ['uz-Latn','uz-Cyrl','en','ru']}
for sel,uz,en,ru in items:
    for locale,value in zip(copydata,[uz,translit(uz),en,ru]): copydata[locale][sel]=value
(OUT/'copy.js').write_text('window.ASALARI_COPY = '+json.dumps(copydata,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
manifest=json.loads((PROVIDER/'capture-manifest.json').read_text(encoding='utf-8'))
music=[x for x in re.findall(r'https?[^\s\"<>]+',json.dumps(manifest)) if '/assets/music.mp3' in x]
music_candidates=[str(p.relative_to(ARCHIVE)).replace('\\','/') for p in ARCHIVE.rglob('music*.mp3')]
(OUT/'dependencies.json').write_text(json.dumps(dict(capture=str(CAPTURE.relative_to(ROOT)).replace('\\','/'),sha256=hashlib.sha256(CAPTURE.read_bytes()).hexdigest(),assets=assets,sourceMusic='assets/music.mp3',matchingMusicManifestUrls=music,otherArchiveMusicCandidates=music_candidates,missing=['assets/music.mp3'],notes=['cloud-puff.webp?v=2 resolves to captured cloud-puff__5de144d3edb34ccd.webp','Other providers have unrelated music files; no Taklifla music.mp3 or manifest mapping exists.','No source app runtime or Cloudflare beacon runs. Inert source/reference.html.txt preserves evidence only.']),ensure_ascii=False,indent=2),encoding='utf-8')
print('Packaged',len(assets),'exact local assets; source SHA-256',hashlib.sha256(CAPTURE.read_bytes()).hexdigest())
