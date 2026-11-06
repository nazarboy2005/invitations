from pathlib import Path
from bs4 import BeautifulSoup
import json,re,hashlib,shutil
root=Path.cwd(); base=root/'Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Wedivo'
capture=base/'Web invitations/templates/cl18spIdFB8VbBu1Yiyb/index.html'
raw=capture.read_bytes(); soup=BeautifulSoup(raw,'html.parser'); manifest=json.loads((base/'capture-manifest.json').read_text(encoding='utf8'))
dest=root/'apps/web/public/templates/wedivo-riwayat-obrolan'; (dest/'assets').mkdir(parents=True,exist_ok=True);(dest/'source').mkdir(exist_ok=True)
assets=[]
def asset(url,name=None):
 row=manifest['resources'][url]; src=base/row['file']; name=name or src.name
 shutil.copyfile(src,dest/'assets'/name)
 assets.append({'url':url,'file':'assets/'+name,'sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'bytes':src.stat().st_size})
 return 'assets/'+name
gallery_urls=re.search(r'var GAL = (\[.*?\])\.map',str(soup)).group(1)
(dest/'assets/preview').mkdir(exist_ok=True)
for i,url in enumerate(json.loads(gallery_urls)):
 if url:asset(url,f'preview/gallery-{i+1}.jpg')
for who,id in [('c','hero-av-img'),('g','mp-g-img'),('b','mp-b-img')]:
 asset(soup.find(id=id)['src'],f'preview/profile-{who}.jpg')
fonturl=re.search(r"@import url\('([^']+)'\);",str(soup)).group(1)
fontcss=(base/manifest['resources'][fonturl]['file']).read_text(encoding='utf8')
for u in set(re.findall(r'url\((https[^)]+)\)',fontcss)):fontcss=fontcss.replace(u,asset(u).removeprefix('assets/'))
(dest/'assets/fonts.css').write_text(fontcss,encoding='utf8')
css=soup.find_all('style')[-1].string
css=re.sub(r"@import url\('[^']+'\);",'',css)
for u in sorted(set(re.findall(r'https://wedivo.id/uploads/templates/[^"\s)]+',css))):css=css.replace(u,asset(u,u.rsplit('/',1)[1]))
# CSS URLs are relative to source/template.css.
css=css.replace('assets/','../assets/')
(dest/'source/template.css').write_text(css,encoding='utf8')
js=soup.find('script',id='main-script').string
js=js.replace('var reduce = mq("(prefers-reduced-motion: reduce)");','var reduce = win.__RIWAYAT.reducedMotion || mq("(prefers-reduced-motion: reduce)");')
js=js.replace('var KEY = "dps1:" + (win.location ? win.location.pathname : "/") + ":";','var KEY = "dps1:" + win.__RIWAYAT.invitationId + ":";')
js=js.replace('var MON = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];','var MON = win.__RIWAYAT.months;')
js=js.replace('var DOW = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];','var DOW = win.__RIWAYAT.weekdays;')
js=re.sub(r'var TZN = .*?\n  var TZO = .*?\n  if \(!/\^WI.*?\n', 'var TZN = win.__RIWAYAT.data.timezone;\n  var TZO = win.__RIWAYAT.offsetHours;\n',js)
js=js.replace('var WD = clean("2026-11-19"), WT = clean("10:00") || "09:00";', 'var WD = win.__RIWAYAT.dateISO, WT = win.__RIWAYAT.data.date.time;')
js=js.replace('var wedAt = absAt(WD, WT);','var wedAt = win.__RIWAYAT.eventISO ? new Date(win.__RIWAYAT.eventISO) : null;')
js=js.replace('for (var i = 1; i <= 5; i++) {','for (var i = 1; i <= win.__RIWAYAT.data.story.length; i++) {')
js=re.sub(r'var MSH = \[.*?\], DSH = \[.*?\];','var MSH = win.__RIWAYAT.months.map(function(s){ return s.slice(0,3).toUpperCase(); }), DSH = win.__RIWAYAT.weekdays.map(function(s){ return s.slice(0,3).toUpperCase(); });',js)
js=re.sub(r'var GAL = \[.*?\]\.map\(clean\)\.filter\(function \(u\) \{ return u && !/.*?; \}\);','var GAL = win.__RIWAYAT.data.gallery.map(function(i){ return i.src; }).filter(Boolean);',js)
js=js.replace('r.id = mkId(tag.charAt(0))','r.id = mkId(tag.charAt(0))')
js=js.replace('var r = el("div", "rd-i", list), ck = el("span", "rd-ck", r);','var r = el("div", "rd-i", list), ck = el("span", "rd-ck", r); r.dataset.itemId = it.id;')
js=js.replace('var ch = $("kisah-c" + i), box = $("kisah-c" + i + "-m");','var ch = $("kisah-c" + i), box = $("kisah-c" + i + "-m");')
# Service success is exclusively owned by adapter.js. Remove source's simulated form replies.
a=js.index('  /* ================= RSVP ================= */'); b=js.index('  /* ================= UCAPAN (WISHES) ================= */',a)
js=js[:a]+'  var SENT_PV = {};\n'+js[b:]
js=re.sub(r'    form.addEventListener\("submit", function \(\) \{ mine = true;.*?\}, true\);','',js)
js=js.replace('var LBL =','var LBL =')
# Share the real parent invitation URL, never the standalone asset frame.
js=js.replace('url: win.location.href','url: win.__RIWAYAT.publicUrl').replace('copyText(win.location.href,','copyText(win.__RIWAYAT.publicUrl,')
# Exact source music engine, configured by adapter; no provider music copied.
js=js.replace('var bgmWant = store.get("music", false)', 'var bgmWant = !win.__RIWAYAT.preview')
js=js.replace('var bgmWant = store.get("music", true)', 'var bgmWant = !win.__RIWAYAT.preview')
js=js.replace('function richText(p, s) {','function richText(p, s) { p.dataset.authored = "";')
js=js.replace('match(/[A-Za-zÀ-ÿ0-9]/)','match(/[\\p{L}\\p{N}]/u)')
js=js.replace('if (cover && $("cv-n1")) {','if (cover && $("cv-n1") && !win.__RIWAYAT.resumeOpen) {')
js=js.replace('>SAH!</text>','>TO‘Y!</text>').replace('>SIAP!</text>','>TAYYOR!</text>')
js=js.replace('function openCall() {','function openCall() { if (win.__RIWAYAT.phoneHref) { win.location.href=win.__RIWAYAT.phoneHref; } return;')
js=js.replace('if (bgmSrc && bgmWant) { musicSet(true, true); }','if (bgmSrc && bgmWant) { musicSet(true, true); }')
js=js.replace('  badges(); frame();\n})();','  badges(); frame();\n  win.riwayatRSVPSaved = function(text) { sendMsg($("rsvp-thread"),{text:text,side:"r",from:"me",group:false}); };\n  if (!win.__RIWAYAT.preview && bgmSrc && bgmWant) { musicSet(true, true); }\n})();')
# Locale-safe source helpers and preview strings retain their authored layout.
js=js.replace('dl + " hari menuju “Sah”"','dl + " " + win.riwayatText("hari") + " · " + win.__RIWAYAT.data.eventType')
js=js.replace('"Hari ini kami “Sah”! 💍"','win.__RIWAYAT.data.eventType').replace('"Kami sudah “Sah” 💍"','win.__RIWAYAT.data.eventType')
js=js.replace('"💍 " + dl + " hari lagi menuju “Sah”"','"💍 " + dl + " " + win.riwayatText("hari")').replace('"💍 Hari ini kami menikah!"','"💍 " + win.riwayatText("Hari ini")')
js=js.replace('"Diimpor dari HP " + nameOf(OWN)','win.riwayatText("Diimpor dari HP kami")')
js=js.replace('"terakhir dilihat " + fmtShort(storyCh.date) + (storyCh.last ? " " + storyCh.last : "")','win.riwayatText("Riwayat Obrolan")')
js=js.replace('"riwayat obrolan"','win.riwayatText("Riwayat Obrolan")')
js=js.replace('items.length + " butir"','String(items.length)')
js=js.replace('k + " pesan" + (k > 1 ? " dari para tamu" : "")','String(k)')
js=js.replace('"Dikirim " + hmNow','win.riwayatText("Terkirim") + " " + hmNow')
js=js.replace('"Hari ini, " + hmNow','win.riwayatText("Hari ini") + ", " + hmNow')
js=js.replace('" – selesai"','" onwards"')
js=js.replace('"Undangan pernikahan " + G + " & " + B + ". Sampai jumpa di hari bahagia!"','win.__RIWAYAT.data.message')
js=js.replace('"Undangan " + name + " " + G + " & " + B','win.__RIWAYAT.data.message')
js=js.replace('function mapsDir(pid, name, addr) { return pid ?', 'function mapsDir(pid, name, addr) { if(win.__RIWAYAT.data.venue.mapUrl) { return win.__RIWAYAT.data.venue.mapUrl; } return pid ?')
js=js.replace('"undangan-"','"taklifnoma-"').replace('PRODID:-//Undangan//Obrolan//ID','PRODID:-//Taklifnoma//Suhbat//UZ').replace('@undangan','@taklifnoma')
js=js.replace('"Undangan pernikahan " + G + " & " + B + " 💌"','win.__RIWAYAT.data.message')
js=js.replace('c.setAttribute("aria-label", "Buka foto " + (idx + 1) + " dari " + GAL.length);','c.dataset.itemId = win.__RIWAYAT.data.gallery[idx].id; c.setAttribute("aria-label", win.riwayatText("Media") + " " + (idx+1) + " / " + GAL.length);')
js=js.replace('im.alt = "Foto " + (idx + 1) + " " + G + " & " + B;','im.alt = win.__RIWAYAT.data.gallery[idx].alt || win.riwayatText("Media") + " " + (idx+1);')
js=js.replace('img.alt = "Foto " + (VW.i + 1);','var gi=win.__RIWAYAT.data.gallery.filter(function(p){ return p.src===u; })[0]; img.alt = gi && gi.alt || win.riwayatText("Media") + " " + (VW.i+1);')
js=js.replace('$("vw-date").textContent = win.riwayatText("Terkirim") + " " + hmNow(new Date(Date.now() - 42 * 6e4));','var gi=win.__RIWAYAT.data.gallery.filter(function(p){return p.src===u;})[0]; $("vw-date").textContent=gi && gi.caption || ""; $("vw-date").dataset.authored="";')
js=js.replace('$("gl-all-t").textContent = "Lihat semua media · " + GAL.length;','$("gl-all-t").textContent = win.riwayatText("Lihat semua media") + " · " + GAL.length;')
js=js.replace('"Dibagikan sampai " + (WD ? fmtDate(WD, false) : "hari H")','(WD ? fmtDate(WD, false) : "")')
js=js.replace('"Coba tema warna " + (nm || c)','win.riwayatText("Tema Obrolan") + " " + (nm || c)')
js=js.replace('"Pakai " + (clean(b.querySelector(".sw-n").textContent) || "yang ini") + " aja, cocok! 🥰"','win.riwayatText("Yang ini aja, cocok! 🥰")')
js=js.replace('"Tema obrolan: " +','win.riwayatText("Tema Obrolan") + ": " +')
a=js.index('  function navPreview() {');b=js.index('  function navTimes()',a)
js=js[:a]+'''  function navPreview() {
    ["hero","ayat","kisah","mempelai","keluarga","terjadwal","acara","rundown","lokasi","busana","galeri","rsvp","ucapan","penutup"].forEach(function(id){
      var title=$("nav-"+id+"-t"); setPv(id, title ? title.textContent : "");
    });
  }
'''+js[b:]
(dest/'source/template.js').write_text(js,encoding='utf8')
for n in soup.find_all('script'):n.decompose()
for n in soup.find_all('style'):n.decompose()
for tag in soup.select('img'):
 tag.attrs.pop('src',None)
for tag in soup.select('[data-photo],[data-src]'):
 tag['data-photo' if tag.has_attr('data-photo') else 'data-src']=''
for tag in soup.select('a[href]'):
 if tag['href'].startswith('http'):tag['href']='#'
for tag in soup.select('template'):tag.clear()
for tag in soup.select('[data-date],[data-time],[data-end],[data-name]'):
 for k in ['data-date','data-time','data-end','data-name']:
  if tag.has_attr(k):tag[k]=''
unsupported=['kamus','kontak','draf','keluarga','video','hadiah']
for sec in unsupported:
 tag=soup.find(id='sec-'+sec)
 tag['hidden']='';tag['data-contract-gap']=''
 # Keep structure/decorative elements, clear source-specific stories and values.
 for node in tag.find_all(string=True):
  if node.strip():node.replace_with('')
clear='hero-desc hero-date-d hero-date-time hero-date-v hero-unread-n ayat-ar ayat-tr ayat-src kisah-intro-t kisah-end-n mp-m0-t mp-g-name mp-g-info-t mp-g-par-t mp-g-ig-t mp-b-name mp-b-info-t mp-b-par-t mp-b-ig-t tj-note tj-msg ac-m1-t ev1-n ev1-vn ev1-va ev1-note ev2-n ev2-vn ev2-va ev2-note lk-m0-t lk-vn lk-va lk-mark-t bs-sys-n bs-m0-t bs-pl bs-pr-t gl-m0-t rv-m0-t rv-rep-hadir rv-rep-tidak rv-rep-ragu pn-auto-t pn-msg pn-tag-t pn-salam pn-foot-tag'
clear += ' cv-n3-time'
for id in clear.split():
 e=soup.find(id=id)
 if e:e.clear()
for i in range(1,6):soup.find(id=f'kisah-c{i}-tt').clear()
for node in soup.find_all(string=True):
 if node.parent.name in ['style','script']:continue
 t=str(node)
 if re.search(r'Bagas|Aulia|Pratama|Wijaya|Bapak/Ibu Tamu Undangan|48\.217',t):node.replace_with('')
for tag in soup.select('[aria-label],[alt]'):
 for key in ['aria-label','alt']:
  if tag.has_attr(key) and re.search(r'Bagas|Aulia|Pratama|Wijaya',tag[key]):tag[key]=''
soup.find(id='wish-list').clear()
soup.find('meta',attrs={'name':'description'})['content']=''
soup.title.string='Taklifnoma'
soup.html['lang']='uz-Latn'
for file in ['assets/fonts.css','source/template.css','adapter.css']:
 link=soup.new_tag('link',rel='stylesheet',href=file);soup.head.append(link)
soup.body['class']=['is-locked','wp-doodle','awaiting-data']
e=soup.new_tag('script',src='i18n.js');soup.body.append(e)
e=soup.new_tag('script',src='adapter.js');soup.body.append(e)
(dest/'index.html').write_text(str(soup),encoding='utf8')
(dest/'source-provenance.json').write_text(json.dumps({'sourcePath':str(capture.relative_to(root)).replace('\\','/'),'sourceSHA256':hashlib.sha256(raw).hexdigest(),'captureType':'embedded-source','sourceTemplateId':'cl18spIdFB8VbBu1Yiyb','assets':assets,'catalogEligible':False},ensure_ascii=False,indent=2),encoding='utf8')
print('Packaged',len(assets),'exact dependencies;',len(css),'CSS chars;',len(js),'JS chars')
