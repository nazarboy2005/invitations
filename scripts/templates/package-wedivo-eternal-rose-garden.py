from pathlib import Path
from bs4 import BeautifulSoup
import re, json, hashlib

root=Path('apps/web/public/templates/wedivo-eternal-rose-garden')
ref=Path('Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Wedivo/Web invitations/templates/2Vn0nk5HHqwO4V5FJ6Xg/index.html')
s=ref.read_text(encoding='utf-8'); soup=BeautifulSoup(s,'html.parser')
css=soup.find_all('style')[1].string
css=re.sub(r'@import url\("https://fonts.googleapis.com/[^\"]+"\);','',css)
js=soup.find('script',id='garden-script').string
for asset in (root/'assets').glob('*.jpg'):
 css=re.sub(r'https://wedivo.id/uploads/templates/[^\s\"\')]+/'+re.escape(asset.name), '../assets/'+asset.name,css)
 js=re.sub(r'https://wedivo.id/uploads/templates/[^\s\"\')]+/'+re.escape(asset.name), 'assets/'+asset.name,js)
js=js.replace('var UP = "https://wedivo.id/uploads/templates/unassigned/";', 'var UP = "assets/";')
# Source-owned presentation functions/animation stay intact; authored data enters here.
js=re.sub(r'var weddingDate = new Date\("2026-11-19T10:00:00"\);[\s\S]*?function fmtLong', 'var weddingDate = new Date(window.roseData.dateTime || 0);\n        function fmtLong',js,count=1)
js=js.replace('"id-ID"','window.roseLocale')
js=re.sub(r'var tzLabel = txt\(\$\("hero-time-tz"\)\)[\s\S]*?\$\$\("\.js-date-long"\)', 'var tzLabel = window.roseData.timezone;\n        var tzName = tzLabel;\n        var tzOffset = 0;\n        $$(".js-date-long")',js,count=1)
# Dates use the event instant for countdown/calendar and the invitation zone for display.
js=js.replace('weekday: "long",','weekday: "long", timeZone: tzName,').replace('month: "long",','month: "long", timeZone: tzName,')
js=js.replace('{ hour: "2-digit", minute: "2-digit" }','{ hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: tzName }')
js=js.replace('String(weddingDate.getDate())','String(window.roseData.date.day)')
js=js.replace('var ev1End = parseLocal("2026-11-19", "10:30");','var ev1End = new Date(weddingDate.getTime() + 2 * 3600000);')
js=re.sub(r'function utcStamp\(d\) \{[\s\S]*?\n        var ev1End', lambda _: 'function utcStamp(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\\.\\d{3}Z$/, "Z"); }\n        var ev1End',js,count=1)
js=js.replace('calStamp(weddingDate) +','utcStamp(weddingDate) +').replace('calStamp(ev1End) +','utcStamp(ev1End) +')
js=re.sub(r'var PLACE_ID = "[^"]*";', 'var PLACE_ID = "";',js)
js=re.sub(r'var MAPS_KEY = "[^"]*";', 'var MAPS_KEY = "";',js)
js=js.replace('function placeLink(placeId, name, addr) {','function placeLink(placeId, name, addr) {\n          if (window.roseData.venue.mapUrl) return window.roseData.venue.mapUrl;')
js=js.replace('[venueName, venueAddr].filter(Boolean).join(", "),\n                  )','window.roseData.mapQuery || [venueName, venueAddr].filter(Boolean).join(", "),\n                  )')
js=re.sub(r'var galleryUrls = \[[\s\S]*?\].filter\(function \(u\) \{\s*return filled\(u\);\s*\}\);', 'var galleryUrls = window.roseData.gallery.map(function (photo) { return photo.src; }).filter(Boolean);',js,count=1)
js=js.replace('im.alt = "Foto kenangan " + (i + 1);','im.alt = window.roseData.gallery[i].alt || "";\n            b.dataset.itemId = window.roseData.gallery[i].id;')
js=js.replace('lbImg.src = galleryUrls[lbIndex];','lbImg.src = galleryUrls[lbIndex];\n            lbImg.alt = window.roseData.gallery[lbIndex].alt || "";')
js=js.replace('var chapters = [1, 2, 3, 4]','var chapters = window.roseData.story.map(function (_, i) { return i + 1; })')
# Never run source sample dates in the unsupported second event.
js=js.replace('"2026-11-19"','""')
js=js.replace('var sfxMuted = false;', 'var sfxMuted = !!window.rosePreview;')
js=js.replace('var reduceMotion = !!(mq && mq.matches);','var reduceMotion = !!(mq && mq.matches) || !!window.roseReducedMotion;')
js=js.replace('var pax = clamp(parseInt(paxInput && paxInput.value, 10) || 1, 1, 20);','var pax = 1;')
js=re.sub(r'var SECTION_NAMES = \{[\s\S]*?\n        \};', 'var SECTION_NAMES = window.roseSectionNames;',js,count=1)
js=js.replace('var musicWanted = true,','var musicWanted = window.roseMusicWanted !== false,')
js=js.replace('musicWanted = false;','musicWanted = false; window.roseSetMusicWanted(false);').replace('musicWanted = true;','musicWanted = true; window.roseSetMusicWanted(true);')
js=js.replace('|| "Pernikahan"','|| window.roseData.eventType').replace('$("ev-1-name").textContent = "Akad";','$("ev-1-name").textContent = window.roseData.eventType;')
js=js.replace('"Sampai ketemu di taman mawar kami. — "','window.roseData.message + " — "')
js=js.replace('"Besok: "','window.roseTranslate("Besok: ")').replace('"undangan-"','"taklifnoma-"')
for raw in ['Hari ini tamannya mekar! Sampai ketemu di sana, ya.','Makasih udah ikut merayakan — kenangannya kami simpan di taman ini selamanya.']:
 js=js.replace(json.dumps(raw,ensure_ascii=False),'window.roseTranslate('+json.dumps(raw,ensure_ascii=False)+')')
# Wrap runtime-generated Indonesian UI strings through a localized adapter dictionary.
for raw in ['Fajar','Pagi','Siang','Sore','Senja','Malam','Subuh','Menjelang Siang','Jam Emas','Lilin Pertama','Tutup','Peta','Lagi diokulasi…','Dua tangkai didekatkan pelan-pelan…','Diikat pakai pita okulasi…','Tumbuh dari satu akar…','Mekar! Varietas baru lahir hari ini.','Udah jadi satu ✓','Ikat Jadi Satu','Dua tangkai, masih sendiri-sendiri.','Buka foto ','Udah disalin!','Gagal nyalin, salin manual ya.','Pilihanmu:','Ketuk satu mawar di bawah','Tutup lagi','Kenalan lebih dekat','Sepanjang hari','Pengingatnya lagi diunduh ✿','Alamatnya udah disalin ✿','Alamat kirim kado udah disalin ✿','Mawar ','Kelopak ',' dari ','Pilih jawabanmu — nanti lilinnya ikut ngerespons.','Lilinnya kami nyalakan kecil dulu, ya — sambil nunggu kabar baik dari kamu.','Nggak apa-apa banget. Asapnya kami titipin doa, semoga kita ketemu di lain waktu.','Satu lilin',' kami nyalakan buat kamu',' doa udah tumbuh di dinding ini',' doa — jadi yang pertama gantung doa di sini, yuk']:
 js=js.replace(json.dumps(raw,ensure_ascii=False),'window.roseTranslate('+json.dumps(raw,ensure_ascii=False)+')')
js=js.replace('"Mawar " + (name || meaning)','window.roseTranslate("Mawar ") + (name || meaning)')
js=js.replace('"Yeay, " + who + "! "','who + ": "').replace('"Yeay! "','""')
# Remove source preview services/manifests; bind the same source document through our adapter.
for node in soup.find_all(['script','style','link','title']):node.decompose()
for node in soup.select('meta[name="description"], meta[property^="og:"]'):node.decompose()
for node in soup.select('.ch-date'):node.clear()
for node in soup.find_all(string=True):
 if node.parent.name not in ['svg','path'] and re.search(r'[A-Za-z]',str(node)):node.replace_with('')
for node in soup.find_all(True):
 for attr in list(node.attrs):
  value=str(node[attr])
  if attr in ['src','href','data-src','poster'] and value.startswith('http'):node[attr]=''
  if attr in ['data-date','data-start','data-end','data-text','placeholder','aria-label','title','alt']:node[attr]=''
  if attr=='style':
   for asset in (root/'assets').glob('*.jpg'):
    value=re.sub(r'https://wedivo.id/uploads/templates/[^\s\"\')]+/'+re.escape(asset.name),'assets/'+asset.name,value)
   node[attr]=re.sub(r'https://wedivo.id/[^\s\"\')]+','',value)
 # Demo photos/media are deliberately empty; decoration is drawn by source cutout code.
 for attr in ['src','data-src']:
  if attr in node.attrs and ('prewedding' in str(node[attr]) or 'templateBridePhoto' in str(node[attr]) or 'templateGroomPhoto' in str(node[attr])):node[attr]=''
for n in soup.select('#wish-list > .wish-card'):n.decompose()
# Keep inert unsupported DOM for the original motion code, but remove all demo values.
soup.html['lang']='uz-Latn'
for tag,attrs in [('meta',{'charset':'utf-8'}),('meta',{'name':'viewport','content':'width=device-width,initial-scale=1'}),('link',{'rel':'stylesheet','href':'assets/fonts.css'}),('link',{'rel':'stylesheet','href':'source/template.css'}),('link',{'rel':'stylesheet','href':'adapter.css'})]:
 n=soup.new_tag(tag,attrs=attrs);soup.head.append(n)
script=soup.new_tag('script',src='adapter.js');soup.body.append(script)
(root/'index.html').write_text(str(soup),encoding='utf-8')
(root/'source/template.css').write_text(css,encoding='utf-8')
(root/'source/template.js').write_text(js,encoding='utf-8')
print('Source HTML, CSS, JS isolated; provider manifest/stub, private example data, and map key removed.')
