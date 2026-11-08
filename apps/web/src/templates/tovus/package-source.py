"""Initial archive extraction helper, not the completed template build.
Runtime adapters and release fixes are maintained separately; review after regenerating.
"""
from pathlib import Path
from html.parser import HTMLParser
import hashlib, json, re, shutil, urllib.request

ROOT = Path(__file__).resolve().parents[5]
PROVIDER = ROOT / 'Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Taklifla'
CAPTURE = PROVIDER / 'Web invitations/taklifla.uz/templates/tovus__c7e8ea90968ad140.html'
OUT = ROOT / 'apps/web/public/templates/taklifla-tovus'
(OUT / 'source').mkdir(parents=True, exist_ok=True)
(OUT / 'fonts').mkdir(exist_ok=True)
raw = CAPTURE.read_text(encoding='utf-8')
script = re.search(r'<script>([\s\S]*?)</script>', raw)[1]
css = re.search(r'<style>([\s\S]*?)</style>', raw)[1]
evidence = ROOT / 'docs/templates/luxury-uzbek-verification/tovus-reference.html.txt'
evidence.parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(CAPTURE, evidence)
shutil.copyfile(CAPTURE.parent / '_wish-close.js', OUT / 'source/provider-wish-close.js')
(OUT / 'source/template.css').write_text(css, encoding='utf-8')
motion = script[script.index('  /* ── splash open'):script.index('  /* ── music')]
motion += script[script.index('  /* ── reveal on scroll'):script.index('  /* ── guestbook')]
# The original timing/mask/observer/particle calculations are preserved. Only
# expose initialization and make the source opening respect reduced motion.
motion = motion.replace('1100);', 'window.tvReduced ? 0 : 1100);')
motion = motion.replace('if (!host) return;', 'if (!host || window.tvReduced) return;')
motion = motion.replace('var reduced = false;', 'var reduced = !!window.tvReduced;')
motion = motion.replace('reduced = window.matchMedia', 'reduced = reduced || window.matchMedia')
(OUT / 'source/motion.js').write_text('window.initTovusMotion = function () {\n"use strict";\nvar $ = function (s) { return document.querySelector(s); };\n'+motion+'\n};\n', encoding='utf-8')
body = re.search(r'<body>([\s\S]*?)<script>', raw)[1]
# Keep source DOM/artwork/styles; clear invitation facts before it can render.
for element_id in ['tv-hero-a','tv-hero-b','tv-frame-groom','tv-frame-bride','tv-inv-groom','tv-inv-bride','tv-splash-names','tv-foot-names','tv-hero-date','tv-splash-date','tv-frame-date','tv-foot-meta','tv-hero-venue','tv-hero-city','tv-venue-name','tv-venue-addr','tv-ev1-when','tv-ev2-when','tv-ev1-where','tv-ev2-where']:
    body = re.sub(r'(<[^>]*id="'+element_id+r'"[^>]*>)[^<]*', r'\1', body)
for key in ['groom_parents_default','bride_parents_default','quote_default','info_dress_default','info_timing_default','info_rsvp_default','info_parking_default','footer_note_default','inv_request']:
    body = re.sub(r'(<[^>]*data-i18n="'+key+r'"[^>]*>)[\s\S]*?(</(?:div|p)>)', r'\1\2', body)
body = re.sub(r'href="https://maps[^\"]+"', '', body)
body = body.replace('data-lang="uz"', 'data-lang="uz-Latn"').replace('>UZ<','>Uz<').replace('>EN<','>En<').replace('>RU<','>Ru<')
body = body.replace('<button type="button" data-lang="en">', '<button type="button" data-lang="uz-Cyrl">Уз</button>\n      <button type="button" data-lang="en">')
body = body.replace("'Parisienne',cursive", "'Parisienne','Cormorant Garamond',cursive")
(OUT / 'index.html').write_text('<!doctype html>\n<html lang="uz-Latn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Tovus</title><link rel="stylesheet" href="fonts/fonts.css"><link rel="stylesheet" href="source/template.css"><link rel="stylesheet" href="platform.css"></head><body data-pending>\n'+body+'<script src="copy.js"></script><script src="source/motion.js"></script><script src="bridge.js"></script></body></html>', encoding='utf-8')

assets=[]
def copy(src, dest, url):
    dest.parent.mkdir(parents=True,exist_ok=True); shutil.copyfile(src,dest)
    assets.append(dict(capture=str(src.relative_to(ROOT)).replace('\\','/'),file=str(dest.relative_to(OUT)).replace('\\','/'),url=url,bytes=src.stat().st_size,sha256=hashlib.sha256(src.read_bytes()).hexdigest()))
for src in sorted((CAPTURE.parent/'tovus-img').iterdir()):
    copy(src, OUT/'tovus-img'/src.name, 'https://taklifla.uz/templates/tovus-img/'+src.name)
font_css=PROVIDER/'Web invitations/fonts.googleapis.com/css2__afab78718a760603'
fc=font_css.read_text(encoding='utf-8')
for url in sorted(set(re.findall(r'url\((https://[^)]+)\)',fc))):
    src=PROVIDER/'Web invitations'/url.removeprefix('https://')
    if src.is_file(): copy(src,OUT/'fonts'/src.name,url)
    else:
        dest=OUT/'fonts'/src.name
        if not dest.is_file():
            with urllib.request.urlopen(url, timeout=30) as response: dest.write_bytes(response.read())
        assets.append(dict(capture=None,file='fonts/'+src.name,url=url,bytes=dest.stat().st_size,sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),recovered='Exact source-CSS URL; absent from archive'))
    fc=fc.replace(url,src.name)
(OUT/'fonts/fonts.css').write_text(fc,encoding='utf-8')

dictionary=json.loads(re.sub(r'(^\s*|\]\s*,\s*)(\w+):',r'\1"\2":',re.search(r'var DICT = (\{[\s\S]*?\n  \});',script)[1],flags=re.M))
ph=json.loads(re.sub(r'(^\s*)(\w+):',r'\1"\2":',re.search(r'var PH = (\{[\s\S]*?\n  \});',script)[1],flags=re.M))
class CopyParser(HTMLParser):
    def __init__(self): super().__init__(); self.values={}; self.key=None
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'data-i18n' in a:self.key=a['data-i18n'];self.values[self.key]=''
        if 'data-i18n-ph' in a:self.values[a['data-i18n-ph']]=a['placeholder']
    def handle_data(self,data):
        if self.key:self.values[self.key]+=data
    def handle_endtag(self,tag): self.key=None
p=CopyParser();p.feed(raw)
cyrl={'ch':'ч','sh':'ш',"o'":'ў','o‘':'ў',"g'":'ғ','g‘':'ғ','yo':'ё','yu':'ю','ya':'я','ye':'е','a':'а','b':'б','d':'д','e':'е','f':'ф','g':'г','h':'ҳ','i':'и','j':'ж','k':'к','l':'л','m':'м','n':'н','o':'о','p':'п','q':'қ','r':'р','s':'с','t':'т','u':'у','v':'в','x':'х','y':'й','z':'з'}
def translit(s):
    return re.sub('|'.join(map(re.escape,cyrl)),lambda m:cyrl[m[0].lower()].capitalize() if m[0][0].isupper() else cyrl[m[0].lower()],s,flags=re.I)
copy_data={l:{} for l in ['uz-Latn','uz-Cyrl','en','ru']}
for k,v in p.values.items():
    if k.endswith('_default') or k in ['inv_request','ev1_title','ev1_desc','ev2_title','ev2_desc']:continue
    pair=dictionary.get(k,ph.get(k,[v,v]))
    for l,x in zip(copy_data,[v,translit(v),*pair]):copy_data[l][k]=x.replace('&nbsp;','\u00a0')
extra={
'pending':['Tilagingiz yuborildi. Taklifnoma egasi tasdiqlagach ko‘rinadi.','Тилагингиз юборилди. Таклифнома эгаси тасдиқлагач кўринади.','Your wish was sent. It will appear after the host approves it.','Пожелание отправлено и появится после одобрения хозяином.'],
'preview':['Bu namuna. Tilak yuborish uchun haqiqiy taklifnomani oching.','Бу намуна. Тилак юбориш учун ҳақиқий таклифномани очинг.','This is a preview. Open the real invitation to send a wish.','Это предпросмотр. Откройте настоящее приглашение, чтобы отправить пожелание.'],
'error':['Tilak yuborilmadi. Qayta urinib ko‘ring.','Тилак юборилмади. Қайта уриниб кўринг.','Could not send your wish. Please try again.','Не удалось отправить пожелание. Попробуйте ещё раз.'],
'loadError':['Tilaklarni yuklab bo‘lmadi.','Тилакларни юклаб бўлмади.','Could not load wishes.','Не удалось загрузить пожелания.'],
'deadline':['Iltimos, {date} gacha tasdiqlang.','Илтимос, {date} гача тасдиқланг.','Please confirm by {date}.','Пожалуйста, подтвердите до {date}.'],
'music':['Musiqa','Мусиқа','Music','Музыка'],
'crest':['Tovus gerbi','Товус герби','Peacock crest','Герб с павлином'],
'garland':['Tovus pati va yasmin girlandi','Товус пати ва ясмин гирлянди','Peacock feather and jasmine garland','Гирлянда из павлиньих перьев и жасмина']}
for k,values in extra.items():
    for l,v in zip(copy_data,values):copy_data[l][k]=v
(OUT/'copy.js').write_text('window.TOVUS_COPY = '+json.dumps(copy_data,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(OUT/'dependencies.json').write_text(json.dumps(dict(capture=str(CAPTURE.relative_to(ROOT)).replace('\\','/'),sha256=hashlib.sha256(CAPTURE.read_bytes()).hexdigest(),assets=assets,missing=[],excluded=['Cloudflare beacon','provider query customizer','provider guestbook API and localStorage demo writes','provider URL target reader (bridge supplies the shared event instant)'],notes=['Original HTML and wish-close script are inert source evidence only.','Fonts are exact captured Google CSS dependencies; no network font request.','No source audio file: audio is optional via source ?audio parameter.','All six tovus-img assets copied, including template-owned venue artwork.']),ensure_ascii=False,indent=2),encoding='utf-8')
print('Packaged',len(assets),'exact assets; source',hashlib.sha256(CAPTURE.read_bytes()).hexdigest())
