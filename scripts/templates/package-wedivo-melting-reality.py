from pathlib import Path
import re,json,hashlib,shutil,html
from html.parser import HTMLParser
root=Path.cwd()
ref=root/'Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Wedivo'
capture=ref/'Web invitations/templates/zkIhLR9Uv1c8xwbW76Sw/index.html'
raw=capture.read_text('utf-8')
out=root/'apps/web/public/templates/wedivo-melting-reality'
out.mkdir(parents=True,exist_ok=True)
for folder in ['source','assets']: (out/folder).mkdir(exist_ok=True)
manifest=json.loads((ref/'capture-manifest.json').read_text('utf-8-sig'))
resources=manifest['resources']; base='/templates/wedivo-melting-reality/'
assets=[]
def copy_url(url):
 entry=resources.get(html.unescape(url))
 if not entry: raise RuntimeError('Absent captured dependency: '+url)
 src=ref/entry['file']; name=src.name
 dst=out/'assets'/name; shutil.copyfile(src,dst)
 assets.append({'url':url,'file':'assets/'+name,'sha256':hashlib.sha256(dst.read_bytes()).hexdigest()})
 return base+'assets/'+name
fonturl=re.search(r'@import url\("(https://fonts.googleapis.com/[^\"]+)"\)',raw)
if not fonturl:
 fonturl=re.search(r'(https://fonts.googleapis.com/[^\"<>]+)',raw)
fontentry=resources.get(html.unescape(fonturl.group(1)))
if not fontentry: raise RuntimeError('Missing exact captured font CSS')
fonts=(ref/fontentry['file']).read_text('utf-8')
fonts=re.sub(r'https://fonts.gstatic.com/[^\s)\"\']+',lambda m:copy_url(m.group(0)),fonts)
(out/'assets/fonts.css').write_text(fonts,'utf-8')
styles=re.findall(r'<style[^>]*>([\s\S]*?)</style>',raw)
css='\n'.join(styles)
css=re.sub(r'@import\s+url\([^)]*\)\s*;','',css)
decorative=sorted(set(re.findall(r'https://wedivo.id/uploads/templates/[^\s\"<>\)]+',raw)))
for url in decorative:
 css=css.replace(url,copy_url(url))
preview=[]
gallery_block=re.search(r'var gUrls = \[([\s\S]*?)\]\.filter',raw).group(1)
for url in re.findall(r'https://wedivo.id/[^\s\"<>\)]+',gallery_block):
 preview.append({'src':copy_url(url),'alt':'','caption':''})
(out/'assets/preview-media.json').write_text(json.dumps(preview,indent=2),'utf-8')
(out/'source/template.css').write_text(css,'utf-8')
engine=re.search(r'<script id="x-script1">([\s\S]*?)</script>',raw).group(1)
original_engine_hash=hashlib.sha256(engine.encode()).hexdigest()
engine=engine.replace('var LOC = "id-ID";', 'var LOC = window.MELTING.locale;')
engine=engine.replace('var reduceMotion = !!(', 'var reduceMotion = window.MELTING.reducedMotion || !!(')
engine=engine.replace('soundOn = true;', 'soundOn = window.MELTING.musicEnabled && !window.MELTING.silentPlayback;')
engine=engine.replace('var wedDate = parseDT("2026-11-19", "10:00");','var wedDate = window.MELTING.dateTime ? new Date(window.MELTING.dateTime) : null;')
engine=engine.replace('var end1 = parseDT("2026-11-19", "10:00");','var end1 = null;')
engine=engine.replace('var placeId = "ChIJA9XmCCH0aS4RPwVK1nrhf30",','var placeId = "",')
engine=re.sub(r'var gUrls = \[[\s\S]*?\]\.filter\(function \(u\) \{\s*return filled\(u\);\s*\}\);','var gUrls = window.MELTING.gallery.map(function(item){return item.src;});',engine)
engine=engine.replace('for (var i = 1; i <= 4; i++) {\n            var li = $("story-" + i);','for (var i = 1; i <= window.MELTING.storyCount; i++) {\n            var li = $("story-" + i);')
engine=engine.replace('var e1 = hm("10:00");','var e1 = "";')
engine=engine.replace('hm("14:00")','""').replace('"11:00"','"00:00"')
engine=re.sub(r'filled\("2027-06-12"\)\s*\? "2027-06-12"\s*: "2026-11-19"','window.MELTING.dateTime.slice(0,10)',engine)
engine=engine.replace('var title = "Pernikahan " + groomN + " & " + brideN,','var title = window.MELTING.eventLabel + " " + groomN + " & " + brideN,')
engine=engine.replace('"undangan-pernikahan.ics"','"taklifnoma.ics"')
translations={
 'Tutup peta lapisan mimpi':'close','Buka peta lapisan mimpi':'map','% nyata':'real','Lapisan ':'layer',
 'Mimpinya udah jadi nyata. Makasih udah jadi bagian darinya.':'thanks',
 'Sampai ketemu di dunia nyata.':'signature','File kalender disiapkan':'calendar','Sepanjang hari':'today',
 'angkanya nggak mau diam':'floating','tadi kayaknya beda':'floating','jamnya ngaco':'floating','kok 70 menit?':'floating',
 ' · tetap sama':'same','tetap sama':'same','Lompat sekali lagi':'jump','Lompat lagi':'jump',
 'Alamat udah disalin':'copied','Pilihanmu: ':'select','Buka foto ':'photo',' dari ':'photo',
 'Alamat kado udah disalin':'copied','Gasingnya jatuh. Berarti ini nyata, dan kamu datang!':'yes',
 'Gasingnya tetap muter. Gapapa, kita ketemu di mimpi aja, ya.':'no','Gasingnya goyang-goyang. Kabarin lagi kalau udah pasti, ya.':'maybe',
 'Tercatat. Sampai ketemu di dunia nyata!':'sent','Tercatat. Kami tunggu kabar pastinya, ya.':'sent','Tercatat. Makasih doanya dari jauh.':'sent',
 'mimpi baik udah melayang ke sini':'wishes','belum ada mimpi baik. Jadi yang pertama, yuk.':'wishes',
 'Tagar udah disalin':'copied','Mempelai Pria':'groom','Mempelai Wanita':'bride','Segera':'invitation',
 'Catatan ':'story','Mimpi ':'dream',
}
for original,key in translations.items(): engine=engine.replace(json.dumps(original,ensure_ascii=False),'window.MELTING.t('+json.dumps(key)+')')
engine=engine.replace('v + window.MELTING.t("real")','v + "% " + window.MELTING.t("real")')
engine=engine.replace('window.MELTING.t("layer") + pad2(n)','window.MELTING.t("layer") + " " + pad2(n)')
engine=engine.replace('finalT = groomN + " dan " + brideN + " beneran mau nikah.";', 'finalT = groomN + " & " + brideN + " · " + window.MELTING.eventLabel;')
engine=engine.replace('if (window.MELTING.silentPlayback) return;', 'if (window.MELTING.silentPlayback || window.MELTING.userPaused) return;')
engine=engine.replace('soundOn = window.MELTING.musicEnabled && !window.MELTING.silentPlayback;\n              playMusic();','window.MELTING.userPaused = false;\n              soundOn = window.MELTING.musicEnabled && !window.MELTING.silentPlayback;\n              playMusic();')
engine=engine.replace('var go = function (to) {\n              st.target = to;','var go = function (to) {\n              if (reduceMotion) { st.m = to; fr.draw(to, 0); return; }\n              st.target = to;')
engine=engine.replace('vImg.src = gUrls[vIdx];','vImg.src = gUrls[vIdx];\n          vImg.alt = window.MELTING.gallery[vIdx].alt || window.MELTING.gallery[vIdx].caption || window.MELTING.t("photo");')
engine=engine.replace('{ class: "rd-step reveal " + (n % 2 ? "right" : "left") },','{ class: "rd-step reveal " + (n % 2 ? "right" : "left"), "data-program-id": it.id },')
engine=engine.replace('d.toLocaleDateString(LOC, {','d.toLocaleDateString(LOC, { timeZone: window.MELTING.timezone,')
engine=engine.replace('.toLocaleTimeString(LOC, { hour:', '.toLocaleTimeString(LOC, { timeZone: window.MELTING.timezone, hour:')
engine=engine.replace('mSrc = bgm ? bgm.getAttribute("src") || "" : "",','mSrc = window.MELTING.musicEnabled ? (bgm ? bgm.getAttribute("src") || "" : "") : "",')
engine=engine.replace('var pr = bgm.play();','if (window.MELTING.silentPlayback) return;\n            var pr = bgm.play();')
engine=engine.replace('if (window.MELTING.silentPlayback) return;','if (window.MELTING.silentPlayback || window.MELTING.userPaused) return;')
engine=engine.replace('var wh = wedDate ? wedDate.getHours() : 8,','var wh = wedDate ? window.MELTING.hours : 8,').replace('wm = wedDate ? wedDate.getMinutes() : 0;','wm = wedDate ? window.MELTING.minutes : 0;')
engine=engine.replace('h = d ? d.getHours() : 9,','h = d ? window.MELTING.hours : 9,').replace('mi = d ? d.getMinutes() : 0;','mi = d ? window.MELTING.minutes : 0;')
engine=engine.replace('pad2(wedDate.getDate())','pad2(window.MELTING.day)').replace('pad2(wedDate.getMonth() + 1)','pad2(window.MELTING.month)').replace('wedDate.getFullYear()','window.MELTING.year')
engine=engine.replace('i <= 4; i++) {\n            (function (i) {\n              var b = $("dc-sw-" + i),','i <= window.MELTING.colorCount; i++) {\n            (function (i) {\n              var b = $("dc-sw-" + i),')
# Map/search uses the authoritative creator URL after original setup.
engine=engine.replace('/* ---------- mulai ---------- */','window.MELTING.afterInit();\n        /* ---------- mulai ---------- */')
(out/'source/template.js').write_text(engine,'utf-8')
# Keep exactly the captured markup; remove all demo strings, metadata, app preview runtime and external URLs.
page=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',raw)
page=re.sub(r'<style[^>]*>[\s\S]*?</style>','',page)
page=re.sub(r'<link[^>]*>','',page)
page=re.sub(r'<iframe\b[^>]*>[\s\S]*?</iframe>','',page)
page=re.sub(r'<meta\s+(?:name="description"|property="og:title")[\s\S]*?/>','',page)
page=re.sub(r'<title>[\s\S]*?</title>','<title>Tush va haqiqat</title>',page)
class Node:
 def __init__(self,tag='',attrs=None,raw='',parent=None,text=''): self.tag=tag; self.attrs=dict(attrs or []); self.raw=raw; self.parent=parent; self.children=[]; self.text=text
 def render(self):
  if self.tag=='#text': return self.text
  if self.tag=='#raw': return self.raw
  inner=''.join(c.render() for c in self.children)
  if not self.tag: return inner
  start='<'+self.tag+''.join(' '+k+(('="'+html.escape(v,quote=True)+'"') if v is not None else '') for k,v in self.attrs.items())+'>'
  return start+inner+('' if self.tag in ['meta','link','img','input','br','hr','source','wbr'] else '</'+self.tag+'>')
 def walk(self):
  yield self
  for c in self.children: yield from c.walk()
class Tree(HTMLParser):
 def __init__(self): super().__init__(convert_charrefs=False); self.root=Node(); self.cur=self.root
 def handle_starttag(self,t,a):
  n=Node(t,a,parent=self.cur); self.cur.children.append(n)
  if t not in ['meta','link','img','input','br','hr','source','wbr']: self.cur=n
 def handle_startendtag(self,t,a): self.handle_starttag(t,a); self.handle_endtag(t)
 def handle_endtag(self,t):
  n=self.cur
  while n.parent:
   if n.tag==t: self.cur=n.parent; return
   n=n.parent
 def handle_data(self,d): self.cur.children.append(Node('#text',parent=self.cur,text=d))
 def handle_entityref(self,n): self.handle_data('&'+n+';')
 def handle_charref(self,n): self.handle_data('&#'+n+';')
 def handle_decl(self,d): self.cur.children.append(Node('#raw',raw='<!'+d+'>',parent=self.cur))
t=Tree(); t.feed(page)
ids={n.attrs['id']:n for n in t.root.walk() if 'id' in n.attrs}
for n in list(t.root.walk()):
 if n.tag=='#text' and n.text.strip() and n.parent.tag!='title':
  if n.text.strip() not in ['&amp;','&','·','—','…','0','00','0/4','1 / 1','27.61','Aw!']: n.text=''
 for a in list(n.attrs):
  val=n.attrs[a] or ''
  if a in ['src','href','data-src'] and val.startswith('http'):
   if '/uploads/templates/' in val: n.attrs[a]=copy_url(val)
   else: n.attrs.pop(a)
  elif a in ['alt','title','aria-label','placeholder','data-name']: n.attrs[a]=''
  elif a=='datetime': n.attrs[a]=''
wish=ids['wish-list']; wish.children=[]
# Remove prohibited guest headcount from the DOM entirely.
for id in ['rsvp-pax','rsvp-pax-lbl']:
 n=ids.get(id)
 if n: n.parent.children.remove(n)
# No original provider metadata or preview app runtime is copied.
page=t.root.render().replace('<html lang="id">','<html lang="uz-Latn">')
page=page.replace('</head>',f'<link rel="stylesheet" href="{base}assets/fonts.css"><link rel="stylesheet" href="{base}source/template.css"><link rel="stylesheet" href="{base}adapter.css"></head>')
page=page.replace('</body>',f'<script src="{base}adapter.js"></script></body>')
(out/'index.html').write_text(page,'utf-8')
provenance={'sourcePath':str(capture.relative_to(root)).replace('\\','/'),'sourceSha256':hashlib.sha256(capture.read_bytes()).hexdigest(),'originalEngineSha256':original_engine_hash,'captureType':'embedded-source','assets':list({a['file']:a for a in assets}.values()),'status':'private; integration and publication owned by coordinator'}
(out/'source/provenance.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2),'utf-8')
allowed={Path(asset['file']).name for asset in provenance['assets']}|{'fonts.css','preview-media.json'}
for f in (out/'assets').iterdir():
 if f.is_file() and f.name not in allowed: f.unlink()
print('Packaged',len(provenance['assets']),'exact local dependencies; source remains untouched')
