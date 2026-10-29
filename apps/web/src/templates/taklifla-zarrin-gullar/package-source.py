"""Reproducibly extract the authorized Marigold template; never modify captures."""
from pathlib import Path
import hashlib, html, json, re, shutil, urllib.request

ROOT = Path(__file__).resolve().parents[5]
HERE = Path(__file__).resolve().parent
CAPTURE = ROOT / 'Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Taklifla/Web invitations/taklifla.uz/templates'
SOURCE = CAPTURE / 'marigold__93e52da761f9ba6b.html'
OUT = ROOT / 'apps/web/public/templates/taklifla-zarrin-gullar'
OUT.mkdir(parents=True, exist_ok=True)
raw = SOURCE.read_text(encoding='utf-8')
css = re.search(r'<style>([\s\S]*?)</style>', raw)[1]
script = re.search(r'<script>([\s\S]*?)</script>', raw)[1]
body = raw.split('<body>', 1)[1].split('<script>', 1)[0]

# Keep the actual source DOM and artwork; remove all demo-personal fields.
dynamic = ['mw-mono-a','mw-mono-b','mw-splash-names','mw-splash-meta','mw-hero-a','mw-hero-b','mw-hero-dow','mw-hero-date','mw-hero-city','mw-bride-parents','mw-groom-parents','mw-inv-bride','mw-inv-groom','mw-inv-date','mw-inv-venue','mw-venue-name','mw-venue-addr','mw-venue-note','mw-info-dress-text','mw-info-stay-text','mw-info-rsvp-text','mw-cd-foot','mw-foot-names','mw-foot-meta','mw-hashtag']
for id_ in dynamic:
    pattern = r'(<(\w+)\b[^>]*\bid="' + id_ + r'"[^>]*>)[\s\S]*?(</\2>)'
    body = re.sub(pattern, lambda m: m[1]+m[3], body)
body = re.sub(r'(<div class="mw-ev-row"[\s\S]*?)(?=\s*</div>\s*</section>)', '', body, count=1)
body = body.replace('href="https://maps.google.com/?q=Toshkent"', 'href="#"')
body = body.replace('aria-label="Garland"', 'aria-label="Gulchambar"')
body = body.replace('<button type="button" data-lang="uz" class="on">UZ</button>', '<button type="button" data-lang="uz-Latn" class="on">Uz</button>\n      <button type="button" data-lang="uz-Cyrl">Уз</button>')
body = body.replace('>EN</button>', '>En</button>').replace('>RU</button>', '>Ru</button>')
body = body.replace('<label data-i18n="wish_name_label">', '<label for="mw-wname" data-i18n="wish_name_label">').replace('<label data-i18n="wish_msg_label">', '<label for="mw-wmsg" data-i18n="wish_msg_label">')
body = body.replace('name="wname"', 'id="mw-wname" name="wname" required maxlength="100" autocomplete="name"').replace('name="wmsg"', 'id="mw-wmsg" name="wmsg" required maxlength="2000"')
body = re.sub(r'placeholder="masalan,[^"]*"', 'placeholder="Ismingiz"', body)
body = body.replace('<section style="padding:4px 22px 38px;">', '<section id="mw-wishes-section" style="padding:4px 22px 38px;">')
body = body.replace('<div style="display:flex;gap:11px;">','<div id="mw-cd-circles" style="display:flex;gap:11px;">')
body = body.replace('data-i18n="inv_request"','id="mw-inv-request" data-i18n="inv_request"')
body = body.replace('id="mw-wish-confirm"', 'id="mw-wish-confirm" role="status" aria-live="polite"')
(OUT/'template.html').write_text('<!DOCTYPE html>\n<html lang="uz-Latn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Zarrin gullar — Taklifnoma</title><link rel="stylesheet" href="fonts/fonts.css"><link rel="stylesheet" href="source.css"><link rel="stylesheet" href="platform.css"></head><body data-waiting>'+body+'<script src="source-engine.js"></script><script src="i18n.js"></script><script src="platform-adapter.js"></script></body></html>\n', encoding='utf-8')
(OUT/'source.css').write_text(css, encoding='utf-8', newline='')
# Exact source reveal, splash and petal implementation in their original order.
engine = script[script.index('  /* ── splash open'):script.index('  /* ── music')]
engine += script[script.index('  /* ── reveal on scroll'):script.index('  /* ── guestbook')]
close_source=(CAPTURE/'_wish-close.js').read_text(encoding='utf-8')
engine += close_source[close_source.index('  function buildPanel'):close_source.index('  function readAccent')]
engine += '\nwindow.marigoldClosePanel=buildPanel;'
(OUT/'source-engine.js').write_text('(function(){"use strict";var $=function(s){return document.querySelector(s)};\n'+engine+'\n})();\n', encoding='utf-8')
shutil.copytree(CAPTURE/'marigold-img', OUT/'marigold-img', dirs_exist_ok=True)

# Localize the source generic UI only; source invitation/demo values are excluded.
dictionary = script.split('var DICT = {',1)[1].split('\n  };',1)[0]
entries = dict((m[1], json.loads('['+m[2]+']')) for m in re.finditer(r'(\w+):\s*\[("[^\n]*?"\s*,\s*"[^\n]*?")\]', dictionary))
uz = {}
for m in re.finditer(r'<(\w+)\b[^>]*data-i18n="([^"]+)"[^>]*>([\s\S]*?)</\1>', body):
    uz[m[2]] = html.unescape(m[3])
exclude = {'info_stay_text','info_rsvp_text','venue_note','info_dress_text'}
for key in exclude: uz.pop(key, None)
uz.update(wish_name_ph='Ismingiz',wish_msg_ph='Yangi oila uchun tilak yozing…',wish_thanks='Tilagingiz yuborildi. Taklifnoma egasi tasdiqlagach ko‘rinadi.',preview='Bu ko‘rinishda tilak yuborilmaydi.',failure='Tilak yuborilmadi. Qayta urinib ko‘ring.',load_failure='Tilaklarni yuklab bo‘lmadi.',closed='Tilaklar daftari yopildi. Yaxshi tilaklaringiz uchun rahmat.',languages='Til',music='Musiqa',hosts='Mezbonlar',confirm='Ishtirokingizni tasdiqlang',until='gacha')
en={k:entries[k][0] for k in uz if k in entries}
ru={k:entries[k][1] for k in uz if k in entries}
en.update(wish_name_ph='Your name',wish_msg_ph='Write a blessing for the couple…',wish_thanks='Your wishes were sent. They will appear after the host approves them.',preview='Wishes cannot be sent in this preview.',failure='Your wishes were not sent. Please try again.',load_failure='Wishes could not be loaded.',closed='The wish book is closed. Thank you for your kind words.',languages='Language',music='Music',hosts='Hosts',confirm='Please confirm your attendance',until='by')
ru.update(wish_name_ph='Ваше имя',wish_msg_ph='Напишите пожелание паре…',wish_thanks='Пожелание отправлено. Оно появится после одобрения хозяином приглашения.',preview='В этом просмотре пожелания не отправляются.',failure='Не удалось отправить пожелание. Попробуйте снова.',load_failure='Не удалось загрузить пожелания.',closed='Книга пожеланий закрыта. Спасибо за добрые слова.',languages='Язык',music='Музыка',hosts='Хозяева торжества',confirm='Пожалуйста, подтвердите участие',until='до')
cyrl={'kicker_weddingof':'Тўй маросими','btn_open':'Таклифномани очиш','kicker_families':'Оилаларимиз дуоси билан','hero_sub':'турмуш қуришмоқда — сизни таклиф қиламиз','scroll':'Пастга','inv_blessing':'Оилаларимиз оқ фотиҳаси билан','inv_request':'Сизни фарзандларимиз никоҳ тўйига таклиф этамиз','inv_bride_side':'Келин ота-онаси','inv_groom_side':'Куёв ота-онаси','ev_kicker':'Сизни кутамиз','ev_title':'Байрам','ev_sub':'Куй, гуллар ва қувончга тўла олтин оқшом','venue_kicker':'Маросим жойи','btn_map':'Харитада очиш','info_title':'Билиб қўйинг','info_dress_label':'Кийим','info_stay_label':'Меҳмонхона','info_gifts_label':'Совғалар','info_gifts_text':'Иштирокингиз ва дуойингиз — биз учун энг қиммат совға.','info_rsvp_label':'Тасдиқлаш','wish_kicker':'Бизга тилак қолдиринг','wish_title':'Илиқ тилаклар','wish_sub':'Сизнинг бир оғиз сўзингиз биз учун бебаҳо.','wish_name_label':'Исмингиз','wish_msg_label':'Тилакларингиз','btn_send':'Тилак юбориш','wish_thanks':'Тилагингиз юборилди. Таклифнома эгаси тасдиқлагач кўринади.','wish_empty':'Янги оилага биринчи бўлиб тилак билдиринг.','cd_kicker':'Вақт саноғи бошланди','cd_title':'Бахтли кунгача','cd_days':'КУН','cd_hours':'СОАТ','cd_mins':'ДАҚИҚА','cd_secs':'СОНИЯ','foot_note':'Сизни бағримизга олишга ошиқамиз —<br>гулларга бурканган ҳовлидан муҳаббат билан.','wish_name_ph':'Исмингиз','wish_msg_ph':'Янги оила учун тилак ёзинг…','preview':'Бу кўринишда тилак юборилмайди.','failure':'Тилак юборилмади. Қайта уриниб кўринг.','load_failure':'Тилакларни юклаб бўлмади.','closed':'Тилаклар дафтари ёпилди. Яхши тилакларингиз учун раҳмат.','languages':'Тил','music':'Мусиқа','hosts':'Мезбонлар','confirm':'Иштирокингизни тасдиқланг','until':'гача'}
assert set(uz) <= set(cyrl), set(uz)-set(cyrl)
(OUT/'i18n.js').write_text('window.ZARRIN_COPY='+json.dumps({'uz-Latn':uz,'uz-Cyrl':cyrl,'en':en,'ru':ru}, ensure_ascii=False)+';\n', encoding='utf-8')

# Retrieve only exact font dependencies declared by this source. No provider runtime.
fontdir=OUT/'fonts';fontdir.mkdir(exist_ok=True)
url='https://fonts.googleapis.com/css2?family=Caprasimo:wght@400&family=Figtree:wght@400;500;600;700&display=swap'
request=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
fontcss=urllib.request.urlopen(request).read().decode()
font_sources=[]
for i,remote in enumerate(dict.fromkeys(re.findall(r'url\((https://[^)]+)\)',fontcss))):
    name='font-'+str(i)+'.'+remote.split('.')[-1]
    data=urllib.request.urlopen(remote).read();(fontdir/name).write_bytes(data)
    font_sources.append({'url':remote,'file':'fonts/'+name,'sha256':hashlib.sha256(data).hexdigest()})
    fontcss=fontcss.replace(remote,name)
(fontdir/'fonts.css').write_text(fontcss)
hashfile=lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
provenance={'capture':str(SOURCE.relative_to(ROOT)).replace('\\','/'),'captureSha256':hashfile(SOURCE),'sourceCssSha256':hashfile(OUT/'source.css'),'assets':[{'file':str(p.relative_to(OUT)).replace('\\','/'),'sha256':hashfile(p),'bytes':p.stat().st_size} for p in sorted((OUT/'marigold-img').iterdir())],'fonts':font_sources,'fontStylesheetSource':url,'excluded':['Cloudflare analytics beacon','Taklifla query customizer and parent gesture runtime','provider guestbook API','provider localStorage demo wishes and language storage','source sample names, parents, date, venue, program, phone, hotel and hashtag'],'sourceWishClose':{'captureSha256':hashfile(CAPTURE/'_wish-close.js'),'behavior':'Original source close-panel builder is extracted; platform adapter supplies localized copy'},'publication':'Registered 0183; published 0184 after complete source and real lifecycle verification'}
(OUT/'dependencies.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'package':str(OUT),'assets':len(provenance['assets']),'fonts':len(font_sources)}))
