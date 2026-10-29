"""Rebuild the isolated source shell; never edits the capture. Run at repo root."""
from pathlib import Path
import hashlib, json, re, shutil, urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parents[5]
CAPTURE = ROOT / 'Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Taklifla'
SOURCE = CAPTURE / 'Web invitations/taklifla.uz/templates/barakali__808e4379f375a212.html'
OUT = ROOT / 'apps/web/public/templates/taklifla-barakali'
OUT.mkdir(parents=True, exist_ok=True)
h = SOURCE.read_text(encoding='utf-8')
styles = re.findall(r'<style[^>]*>(.*?)</style>', h, re.S)
scripts = re.findall(r'<script[^>]*>(.*?)</script>', h, re.S)
(OUT / 'source').mkdir(exist_ok=True)
(OUT / 'source/template.css').write_text(styles[0], encoding='utf-8', newline='')
(OUT / 'source/language.css').write_text(styles[1], encoding='utf-8', newline='')
motion = scripts[1][scripts[1].index('(function(){', scripts[1].index('REVEAL-ON-SCROLL')):scripts[1].index('/* ─── PHONE')]
(OUT / 'source/motion.js').write_text(motion, encoding='utf-8', newline='')
# Retain original DOM, SVG artwork, class names and controls. Data-bearing leaves
# are blank before serving; provider customizer/i18n/demo persistence never ships.
body = h[h.index('<div class="shell">'):h.index('<script>', h.index('<audio id="music-audio"'))]
for cls in ['hero-mono','hero-eye','hero-occasion','hero-name','hero-age','hero-meta-val','greet-eye','greet-quote','greet-sign','photo-eye','photo-mono','photo-cap','countdown-eye','cd-date','details-eye','det-val','det-sub','rsvp-eye','rsvp-title','rsvp-sub','rsvp-thanks','closing-mono','closing-script','closing-meta','footer-text']:
    body = re.sub(r'(<(?P<tag>\w+)\b[^>]*class="[^"\n]*\b'+cls+r'\b[^"\n]*"[^>]*>).*?(</(?P=tag)>)', lambda m:m[1]+m[3], body, flags=re.S)
body = re.sub(r'href="[^"]*"', 'href="#"', body)
body = body.replace('aria-label="Diyora portrait placeholder"', 'aria-label=""')
# The contract has no age. Preserve the authored slot but do not infer an age.
body = body.replace('class="hero-age rise d4"', 'class="hero-age rise d4" hidden')
lang = h[h.index('<div class="taklifla-lang-switch"'):h.index('<script>', h.index('<div class="taklifla-lang-switch"'))]
lang = lang.replace('data-lang="uz"', 'data-lang="uz-Latn"').replace('>UZ<','>Uz<').replace('>EN<','>En<').replace('>RU<','>Ru<')
lang = lang.replace('<hr />', '<hr />\n    <button type="button" data-lang="uz-Cyrl" role="menuitemradio">Уз</button>\n    <hr />',1)
body = re.sub(r'<!--.*?-->', '', body, flags=re.S)
body = body.replace('id="rsvp-thanks" role="status"', 'id="rsvp-thanks" role="status" aria-live="polite"')
html = '''<!doctype html><html lang="uz-Latn"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Barakali</title><link rel="icon" href="data:,">
<link rel="stylesheet" href="fonts/fonts.css"><link rel="stylesheet" href="source/template.css">
<link rel="stylesheet" href="source/language.css"><link rel="stylesheet" href="platform.css">
</head><body data-bound="false">'''+body+lang+'''<script src="bridge.js"></script><script src="source/motion.js"></script></body></html>'''
(OUT / 'index.html').write_text(html, encoding='utf-8', newline='')
fonts_url = re.search(r'<link href="(https://fonts.googleapis.com/css2[^\"]+)', h)[1]
fontdir = OUT / 'fonts'; fontdir.mkdir(exist_ok=True)
font_css = fontdir / 'google-response.css'
if not font_css.exists():
    request = urllib.request.Request(fonts_url, headers={'User-Agent':'Mozilla/5.0 Chrome/131.0.0.0 Safari/537.36'})
    font_css.write_bytes(urllib.request.urlopen(request, timeout=60).read())
css = font_css.read_text(encoding='utf8')
urls = list(dict.fromkeys(re.findall(r'url\((https://[^)]+)\)',css)))
def font(url):
    filename = hashlib.sha256(url.encode()).hexdigest()[:16] + Path(url).suffix
    target = fontdir / filename
    if not target.exists(): target.write_bytes(urllib.request.urlopen(url, timeout=60).read())
    return {'url':url, 'file':'fonts/'+filename, 'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
with ThreadPoolExecutor(max_workers=6) as pool: files = list(pool.map(font, urls))
for item in files: css = css.replace(item['url'], Path(item['file']).name)
(fontdir / 'fonts.css').write_text(css,encoding='utf8')
manifest = json.loads((CAPTURE/'capture-manifest.json').read_text(encoding='utf8'))
audit = {
  'name':'Barakali','id':'taklifla-barakali','private':False,'published':True,'selectable':True,
  'capture':SOURCE.relative_to(ROOT).as_posix(),'captureSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
  'sourceUrl':'https://taklifla.uz/templates/barakali.html','sourcePageCount':len(manifest['pages']),
  'sourceLinkedTemplateCount':len(set(re.findall(r'/templates/([\w-]+)\.html',json.dumps(manifest['pages'])))),
  'siblingDirectory':{'requested':'barakali-img','present':(SOURCE.parent/'barakali-img').exists(),
    'referencesInSelectedHtml':0,'resolution':'No external images or CSS url() references; all art is inline SVG. No substitute artwork fabricated.'},
  'assets':files,
  'sourceParts':{name:hashlib.sha256((OUT/name).read_bytes()).hexdigest() for name in ['source/template.css','source/language.css','source/motion.js']},
  'excluded':['Provider URL customizer and demo content','Local-storage wishes and fake success','Provider i18n globals/storage','Cloudflare analytics beacon','Provider application runtime'],
  'gaps':['Source age slot has no approved contract/editor/persistence field; hidden rather than inferring age.','No barakali-img sibling exists in selected capture; source requests no images.','No bundled source music; catalog preview uses shared catalog track only when explicitly requested.'],
}
(OUT/'dependencies.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps({'fonts':len(files),'captureSha256':audit['captureSha256'],'siblingDirectory':audit['siblingDirectory']},ensure_ascii=False))
