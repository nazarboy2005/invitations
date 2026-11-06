"""Repackage the selected local capture. Never changes the reference archive."""
from pathlib import Path
from hashlib import sha256
import json
import re
import shutil
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[2]
REF = ROOT / 'Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Wedivo'
CAPTURE = REF / 'Web invitations/templates/XkAzuF8SSX5Pplof0P2d/index.html'
OUT = ROOT / 'apps/web/public/templates/wedivo-lanskap-yang-hidup'
OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'source').mkdir(exist_ok=True)
(OUT / 'assets').mkdir(exist_ok=True)
raw = CAPTURE.read_bytes()
s = raw.decode('utf-8')
manifest = json.loads((REF / 'capture-manifest.json').read_text(encoding='utf-8'))['resources']
dependencies = []

def localize(url):
    entry = manifest[url]
    file = REF / entry['file']
    data = file.read_bytes()
    assert len(data) == entry['bytes'], url
    target = 'assets/' + file.name
    shutil.copyfile(file, OUT / target)
    dependencies.append({'url': url, 'capture': entry['file'], 'file': target, 'bytes': len(data), 'sha256': sha256(data).hexdigest()})
    return target

font_url = re.search(r"@import url\('([^']+)'\);", s)[1]
font_css = (REF / manifest[font_url]['file']).read_text(encoding='utf-8')
for url in set(re.findall(r'url\((https[^)]+)\)', font_css)):
    font_css = font_css.replace(url, localize(url).removeprefix('assets/'))
(OUT / 'assets/fonts.css').write_text(font_css, encoding='utf-8')
styles = re.findall(r'<style[^>]*>(.*?)</style>', s, re.S)
css = styles[-1].replace(re.search(r"@import url\('[^']+'\);", styles[-1])[0], '')
for url in set(re.findall(r'https://wedivo.id/uploads/templates/[^"\s)]+', css)):
    css = css.replace(url, '../' + localize(url))
(OUT / 'source/template.css').write_bytes(css.encode('utf-8'))
preview_urls = list(dict.fromkeys(re.findall(r'https://wedivo.id/uploads/F3[^\s"<>]+', s)))
preview_media = {}
for url in preview_urls:
    entry = manifest[url]
    file = REF / entry['file']
    data = file.read_bytes()
    assert len(data) == entry['bytes']
    (OUT / 'preview-only').mkdir(exist_ok=True)
    target = 'preview-only/' + file.name
    shutil.copyfile(file, OUT / target)
    dependencies.append({'url': url, 'capture': entry['file'], 'file': target, 'previewOnly': True, 'bytes': len(data), 'sha256': sha256(data).hexdigest()})
    preview_media[url] = '/templates/wedivo-lanskap-yang-hidup/' + target
(OUT/'source/preview-media.json').write_text(json.dumps(preview_media,indent=2)+'\n',encoding='utf-8')

main = re.search(r'<script id="main-script">(.*?)</script>', s, re.S)[1]
engine = main[main.index('  var LAND = '):main.index('  /* ================= DATA & WAKTU')]
# Narrow hooks: leave the complete procedural landscape engine unchanged.
main = main.replace('var reduce = mq("(prefers-reduced-motion: reduce)");', 'var reduce = win.lanskapPlatform.reducedMotion || mq("(prefers-reduced-motion: reduce)");')
main = main.replace('var KEY = "lsh1:" + (win.location ? win.location.pathname : "/") + ":";', 'var KEY = "lsh1:" + win.lanskapPlatform.invitationId + ":";')
main = main.replace('win.localStorage', 'win.sessionStorage')
main = main.replace('var BR = txt("cv-bride") || "Mempelai", GR = txt("cv-groom") || "Mempelai";', 'var BR = txt("cv-bride"), GR = txt("cv-groom");')
main = re.sub(r'var TZ = \(function \(z\).*?\}\)\(txt\("pv-tz"\)\);', 'var TZ = win.lanskapPlatform.timezone;', main, flags=re.S)
main = main.replace('d.toLocaleDateString("id-ID",', 'd.toLocaleDateString(win.lanskapPlatform.intlLocale,')
main = re.sub(r'function fmtDate\(o, noDay\) \{.*?\n  \}', 'function fmtDate(o, noDay) { return win.lanskapFormatDate(o, noDay); }', main, count=1, flags=re.S)
main = main.replace('Date.UTC(o.y, o.m - 1, o.d, H - TZ.o, M)', 'Date.UTC(o.y, o.m - 1, o.d, H, M) - TZ.o * 3600000')
main = main.replace('function mapLink(venue, addr) {', 'function mapLink(venue, addr) {\n    if (win.lanskapPlatform.mapUrl) { return win.lanskapPlatform.mapUrl; }')
main = main.replace('\\r\\nDESCRIPTION:Sampai jumpa di lembah\\\\, ', '\\r\\nDESCRIPTION:" + win.lanskapText("calendarFarewell") + " ')
main = main.replace('\\r\\nDESCRIPTION:Besok: ', '\\r\\nDESCRIPTION:" + win.lanskapText("calendarTomorrow") + " ')
main = main.replace('name: txt("ev-1-name") || "Akad Nikah"', 'name: txt("ev-1-name")')
main = main.replace('if (EV1.s == null) { EV1.s = 8; }', '')
main = re.sub(r'var gal = \[.*?\]\.filter\(function \(u\).*?\}\);', 'var gal = win.lanskapPlatform.gallery.map(function (p) { return p.src; });', main)
# Source loops have four authored slots. Contract chapters/colors are repeatable.
main = main.replace('for (var i = 1; i <= 4; i++) {\n      var t = txt("ks-"', 'for (var i = 1; i <= win.lanskapPlatform.story.length; i++) {\n      var t = txt("ks-"')
main = main.replace('for (var i = 1; i <= 4; i++) { var c = txt("dc-"', 'for (var i = 1; i <= win.lanskapPlatform.colors.length; i++) { var c = txt("dc-"')
main = main.replace('li.style.setProperty("--d", ((i % 4)', 'li.dataset.itemId = it.id; li.style.setProperty("--d", ((i % 4)')
main = main.replace('var rdItems = [];', 'var rdItems = [], rdTimer = 0;')
main = main.replace('now(); setInterval(now, 30000);', 'now(); clearInterval(rdTimer); rdTimer = setInterval(now, 30000);')
main = main.replace('function upd() {', 'function upd() {\n      target = absT(EV1.d, EV1.s);')
main = main.replace('function initMenanti() {', 'var menantiTimer = 0;\n  function initMenanti() {\n    clearInterval(menantiTimer);')
main = main.replace('upd(); setInterval(upd, 1000);', 'upd(); menantiTimer = setInterval(upd, 1000);')
main = main.replace('$("cal-ics").addEventListener("click", function () { tock(); downloadIcs(); });', '$("cal-ics").onclick = function () { tock(); downloadIcs(); };')
main = main.replace('var pondW = 0, koiRun = false, koiEls = [];', 'var pondW = 0, koiRun = false, koiEls = [], galleryInitialized = false;')
main = main.replace('if (!gal.length) { hideSec("galeri"); return; }', 'if (!gal.length) { hideSec("galeri"); return; } if (galleryInitialized) { return; } galleryInitialized = true;')
main = main.replace('$("harvest-go").addEventListener("click", function () { tock(); goSection(isShown(secEl("acara")) ? "acara" : "menanti"); });', '$("harvest-go").onclick = function () { tock(); goSection(isShown(secEl("acara")) ? "acara" : "menanti"); };')
main = main.replace('var li = el("li", "plot", ol),', 'var li = el("li", "plot", ol),')
main = main.replace('riceArt(art, stage);', 'li.dataset.itemId = win.lanskapPlatform.story[i].id; riceArt(art, stage);')
# Keep source gallery and viewer layout, but use authored captions/alt text.
main = main.replace('img.alt = "Foto kenangan " + (i + 1);', 'img.alt = win.lanskapPlatform.gallery[i].alt || ""; b.dataset.itemId = win.lanskapPlatform.gallery[i].id;')
main = main.replace('img.alt = "Foto kenangan " + (vIdx + 1);', 'img.alt = win.lanskapPlatform.gallery[vIdx].alt || "";')
main = main.replace('"Kenangan No. " + pad2(vIdx + 1) + " dari kolam"', 'win.lanskapPlatform.gallery[vIdx].caption || ""')
main = main.replace('"No. "', '"№ "')
# Retain source controls, soundscape and synthesis. Music choices belong to creator/guest.
main = main.replace('function soundOn(v) {', 'function soundOn(v) {\n    if (win.lanskapPlatform.silentPlayback) { v = false; }')
main = main.replace('soundOn(store.get("snd", 1) !== 0);', 'if (!win.lanskapPlatform.guestPaused) { soundOn(win.lanskapPlatform.musicEnabled); }')
main = main.replace('$("hud-snd").addEventListener("click", function () { soundOn(!sndOn);', '$("hud-snd").addEventListener("click", function () { win.lanskapPlatform.guestPaused = sndOn; soundOn(!sndOn);')
main = main.replace('var p = bgm.play(); if (p && p.catch) { p.catch(function () {}); }', 'var p = bgm.play(); if (p && p.then) { p.then(function () { win.lanskapPlatform.musicPlayed = true; }).catch(function () { if (!win.lanskapPlatform.musicPlayed) { sndOn = false; $("hud-snd").setAttribute("aria-pressed", "false"); $("hud-snd").setAttribute("aria-label", win.lanskapTranslate("Nyalakan suara")); body.classList.remove("sound-on"); } }); }')
main = main.replace('pax.value = v;', 'pax.value = 1;')
# Translate source-created controls/labels using a separate locale adapter.
# Translate source literals, never creator-authored chapter/program strings.
main = main.replace('e.textContent = s;', 'e.textContent = win.lanskapTranslate(s);')
main = main.replace('t.textContent = m;', 't.textContent = win.lanskapTranslate(m);')
main = main.replace('e.setAttribute(k, attrs[k]);', 'e.setAttribute(k, k === "aria-label" ? win.lanskapTranslate(attrs[k]) : attrs[k]);')
main = main.replace('return r; }\n  var TEMPS', 'return win.lanskapTranslate(r); }\n  var TEMPS')
main = main.replace('return r || (h < 5', 'return r || (h < 5')
main = main.replace('if (!("IntersectionObserver" in win))', 'if (reduce || !("IntersectionObserver" in win))')
locale_source = (OUT / 'locales.js').read_text(encoding='utf-8')
runtime_rows = re.search(r'const runtimeRows = `(.*?)`;', locale_source, re.S)[1]
engine_start = main.index('  var LAND = ')
engine_end = main.index('  /* ================= DATA & WAKTU')
before, landscape, after = main[:engine_start], main[engine_start:engine_end], main[engine_end:]
for line in runtime_rows.strip().splitlines():
    key = line.split('|')[0]
    literal = json.dumps(key, ensure_ascii=False)
    after = after.replace(literal, 'win.lanskapTranslate(' + literal + ')')
main = before + landscape + after
# Dynamic data refresh without remounting the source or resetting the guest music choice.
hook = '''
  win.lanskapRuntime = {
    update: function () {
      reduce = win.lanskapPlatform.reducedMotion; staticDirty = true;
      BR = txt("cv-bride"); GR = txt("cv-groom"); guestName = txt("guest-name");
      TZ = win.lanskapPlatform.timezone;
      EV1.name = txt("ev-1-name"); EV1.d = ymd(txt("pv-date")); EV1.s = hm(txt("pv-time")); EV1.e = null;
      EV1.venue = txt("ev-1-venue"); EV1.addr = txt("ev-1-addr");
      EV2.name = ""; EV2.s = null; EV2.d = null;
      dateStr = fmtDate(EV1.d);
      safe(initMenanti);
      setText("cv-date", dateStr ? dateStr.toUpperCase() : ""); setText("hero-date", dateStr); setText("hero-time", fmtHM(EV1.s) + (EV1.s == null ? "" : " " + TZ.l));
      gal = win.lanskapPlatform.gallery.map(function (p) { return p.src; });
      $("plots").textContent = ""; $("harvest-svg").textContent = "";
      safe(initKisah);
      $("stalk").textContent = ""; rdItems = []; safe(initSusunan);
      $("dress-svg").textContent = ""; $("swatches").textContent = ""; safe(initBusana);
      pondW = 0; if (gal.length) { safe(initGaleri); layoutPond(); } else { $("pond-pads").textContent = ""; }
      if (win.lanskapPlatform.colors.length) { staticDirty = true; }
      thumbs = []; safe(initAcara); drawThumbs(true);
      qsa(".rv, .vn, .plot").filter(function (e) { return !e.closest("#sec-hero") && !e.closest("#sec-cover"); }).forEach(observe);
      layoutSecs(); measure(); navSync(); hudLast = -9; hudTick(true);
      win.lanskapLocalizeGenerated();
    },
    music: function () {
      hasMusic = !!bgm.getAttribute("src");
      if (win.lanskapPlatform.silentPlayback) { soundOn(false); }
      else if (win.lanskapPlatform.musicEnabled && !win.lanskapPlatform.guestPaused) { soundOn(true); }
      else if (!win.lanskapPlatform.musicEnabled) { bgm.pause(); }
    }
  };
  win.lanskapLocalizeGenerated();
  win.lanskapRuntime.music();
  new MutationObserver(function () { win.lanskapLocalizeGenerated(); }).observe(doc.body, { childList: true, subtree: true, characterData: true });
'''
main = main.rsplit('})();', 1)[0] + hook + '\n})();\n'
(OUT / 'source/template.js').write_bytes(main.encode('utf-8'))

soup = BeautifulSoup(s, 'html.parser')
for script in soup.find_all('script'): script.decompose()
for style in soup.find_all('style'): style.decompose()
soup.title.string = 'Lanskap yang Hidup'
for meta in soup.select('meta[name="description"]'): meta.decompose()
for filename in ['assets/fonts.css', 'source/template.css', 'platform.css']:
    tag = soup.new_tag('link', rel='stylesheet', href=filename); soup.head.append(tag)
# Remove all invitation-specific captured media/metadata. Decorative template assets stay.
for node in soup.find_all(['img', 'audio', 'source', 'iframe', 'video']):
    for attr in ['src', 'data-src', 'poster']: node.attrs.pop(attr, None)
for node in soup.select('[href]'):
    if 'http' in node['href']: del node['href']
clear = ['guest-name','cv-bride','cv-groom','hero-bride','hero-groom','hero-venue-t','hero-line','salam-greet','salam-ar','salam-verse','salam-src','salam-invite','kisah-intro','mempelai-intro','meet-note','close-msg','close-fam','turut-v','close-bride','close-groom','close-par-b-v','close-par-g-v','close-salam','tag-t','loc-name','loc-addr','loc-note','busana-text','pv-date','pv-time','pv-tz','pv-e1end','pv-e2date','pv-e2time','pv-e2end','pv-deadline','pv-place','pv-key','pv-live','pv-video','pv-couple']
for w in ['b','g']:
    clear += [f'pf-{w}-{suffix}' for suffix in ['name','full','ord','parents','note','ig-t','ini']]
for i in range(1,5): clear += [f'ks-{i}-{x}' for x in ['t','d','x']] + [f'dc-{i}-{x}' for x in ['c','n']]
for i in range(1,3): clear += [f'ev-{i}-{x}' for x in ['name','venue','addr','note']]
for i in range(1,7): clear += [f'rb-{i}-{x}' for x in ['t','x']] + [f'snd-{x}-m' for x in ['rain','river','wind','birds','crickets','frogs']]
for id in clear:
    node = soup.find(id=id)
    if node: node.clear()
soup.find(id='wish-list').clear()
for id in ['sec-video','sec-hadiah','sec-rambu','checkin','ni-video','ni-hadiah','ni-rambu']:
    node=soup.find(id=id)
    if node: node['hidden']=''
for node in soup.find_all(attrs={'aria-label':True}):
    node['aria-label']=re.sub(r'Aulia|Bagas', '', node['aria-label'])
for node in soup.find_all('img'): node['alt']=''
rows = re.search(r'const rows = `(.*?)`;', locale_source, re.S)[1]
for line in rows.strip().splitlines():
    key, uzbek, *_ = line.split('|')
    node = soup.find(id=key)
    if node: node.string = uzbek
soup.html['lang']='uz-Latn'
soup.title.string='Jonli vodiy'
data = soup.new_tag('script', type='application/json', id='wedivo-rundown-data');data.string='[]';soup.body.append(data)
script=soup.new_tag('script',src='locales.js');soup.body.append(script)
script=soup.new_tag('script',src='platform-adapter.js');soup.body.append(script)
(OUT/'index.html').write_text(str(soup),encoding='utf-8')
(OUT/'source/provenance.json').write_text(json.dumps({'provider':'Wedivo','sourceId':'XkAzuF8SSX5Pplof0P2d','capture':str(CAPTURE.relative_to(ROOT)).replace('\\','/'),'captureSha256':sha256(raw).hexdigest(),'landscapeEngineSha256':sha256(engine.encode()).hexdigest(),'dependencies':dependencies,'publicationReady':False},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Packaged {len(dependencies)} exact local dependencies. Reference unchanged: {sha256(raw).hexdigest()}')
