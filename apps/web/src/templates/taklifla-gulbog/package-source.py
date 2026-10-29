"""Rebuild Gulbog' from the untouched garden-arch capture. Run from repo root."""
from pathlib import Path
import hashlib
import json
import re
import shutil
import urllib.request
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[5]
ARCHIVE = ROOT / 'Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Taklifla'
CAPTURE = ARCHIVE / 'Web invitations/taklifla.uz/templates/garden-arch__814ad8f7131593e4.html'
OUT = ROOT / 'apps/web/public/templates/taklifla-gulbog'
OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'source').mkdir(exist_ok=True)
(OUT / 'fonts').mkdir(exist_ok=True)
raw = CAPTURE.read_text(encoding='utf-8')
soup = BeautifulSoup(raw, 'html.parser')
styles = soup.find_all('style')
css = styles[0].string
language_css = styles[1].string
(OUT / 'source/template.css').write_text(css, encoding='utf-8', newline='')
(OUT / 'source/language.css').write_text(language_css, encoding='utf-8', newline='')
scripts = soup.find_all('script')
engine = scripts[0].string
engine = engine[engine.index('// ── COUNTDOWN'):engine.index('// ── WISHES')]
engine = engine.replace("window.__WED_DATE || new Date('2026-07-05T17:00:00')", 'window.__gardenEventDate || new Date(NaN)')
start = engine.index("  const a = document.getElementById('bgMusic');", engine.index('function openInvitation'))
end = engine.index('  setTimeout(', start)
engine = engine[:start] + '  window.gardenMusicOpen?.();\n' + engine[end:]
engine = engine.replace('  const diff = WEDDING_DATE - new Date();', '  const diff = (window.__gardenEventDate || WEDDING_DATE) - new Date();')
engine = engine.replace('if (diff <= 0)', 'if (!Number.isFinite(diff) || diff <= 0)')
engine = engine.replace('updateCountdown(); setInterval(updateCountdown, 1000);', 'updateCountdown(); window.__gardenCountdown = setInterval(updateCountdown, 1000);')
engine = engine.replace('(function createPetals() {', '(function createPetals() {\n  if (window.__gardenReducedMotion) return;')
engine += '\nwindow.openInvitation = openInvitation;\nwindow.toggleMusic = toggleMusic;\nwindow.dismissMusic = dismissMusic;\nwindow.gardenReveal = () => document.querySelectorAll(".reveal").forEach(el => window.__gardenReducedMotion ? el.classList.add("visible") : ro.observe(el));\n'
(OUT / 'source/motion.js').write_text('window.startGardenSource = function () {\n' + engine + '\n};\n', encoding='utf-8', newline='')
for element in soup.find_all(['script', 'style', 'link']):
    element.decompose()
soup.title.string = 'Taklifnoma'
soup.html['lang'] = 'uz-Latn'
soup.html['data-awaiting-data'] = ''
soup.find('meta', attrs={'name': 'viewport'})['content'] = 'width=device-width, initial-scale=1.0'
# Dynamic personal/demo fields must never be present in the production document.
for selector in ['.splash-initial-1', '.splash-initial-2', '.splash-date', '.hero-name', '.hero-day', '.hero-month', '.hero-year', '.inv-family', '.inv-groom', '.inv-bride', '.inv-daughter', '.inv-invite-text', '.inv-date-big', '.footer-names', '.footer-date', '.info-text', '.tc-time', '.tc-title', '.tc-desc']:
    for el in soup.select(selector):
        el.clear()
for el in soup.select('.timeline-item')[1:]:
    el.decompose()
soup.select_one('.map-btn')['href'] = '#'
soup.select_one('.wishes-form').attrs.pop('onsubmit', None)
soup.select_one('.wish-input')['maxlength'] = '100'
soup.select_one('.wish-textarea')['maxlength'] = '2000'
soup.select_one('#bgMusic')['preload'] = 'none'
soup.select_one('#splash')['role'] = 'button'
soup.select_one('#splash')['tabindex'] = '0'
soup.select_one('#mainContent')['inert'] = ''
# Exclude captured static English placeholders and install natural Uzbek defaults.
texts = {'.splash-btn span':'Taklifnomani ochish', '.hero-pre':'Oilalarining duo va roziligi bilan', '.hero-date-label':'Nikoh to‘yi', '.hero-scroll-hint span':'Pastga torting', '.inv-bless':'Oilamizning quvonchli kuni', '.inv-invite-word':'Taklif', '.inv-on':'Quyidagi tantanaga', '.events .section-title':'Marosim jadvali', '.events .section-subtitle':'Marosim dasturi', '.venue .section-title':'Manzil', '.venue-text':'Sizni kutib qolamiz', '.map-btn span':'Xaritani ochish', '.info-title':'Eslatma', '.wishes .section-title':'Tilaklaringiz', '.wishes-subtitle':'Tilaklaringiz biz uchun muhim', '.wish-btn span':'Yuborish', '#wishConfirm p':'', '.countdown-label':'Bayramgacha qoldi', '.countdown-msg':'Sizni to‘yimizda ko‘rishdan baxtiyormiz', '.footer-thanks':'Sevgi va minnatdorchilik bilan'}
for selector, value in texts.items():
    soup.select_one(selector).string = value
for el, value in zip(soup.select('.cd-label'), ['Kun','Soat','Daqiqa','Soniya']):
    el.string = value
soup.select_one('.wish-input')['placeholder'] = 'Ismingiz'
soup.select_one('.wish-textarea')['placeholder'] = 'Iliq tilaklaringizni yozing…'
for file in ['fonts.css', 'source/template.css', 'source/language.css', 'platform.css']:
    el = soup.new_tag('link', rel='stylesheet', href=file)
    soup.head.append(el)
for file in ['source/motion.js', 'platform-adapter.js']:
    el = soup.new_tag('script', src=file, defer=True)
    soup.head.append(el)
(OUT / 'index.html').write_text(str(soup), encoding='utf-8', newline='')

def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

assets = []
for source in (CAPTURE.parent / 'garden-arch-img').iterdir():
    dest = OUT / 'source/garden-arch-img' / source.name
    dest.parent.mkdir(exist_ok=True)
    shutil.copyfile(source, dest)
    assets.append({'capture':str(source.relative_to(ROOT)).replace('\\','/'), 'file':str(dest.relative_to(OUT)).replace('\\','/'), 'sha256':digest(source), 'bytes':source.stat().st_size})
font_css_capture = ARCHIVE / 'Web invitations/fonts.googleapis.com/css2__ee8ac59f76be10ad'
font_css = font_css_capture.read_text(encoding='utf-8')
fonts = []
for url in sorted(set(re.findall(r'url\((https://[^)]+)\)', font_css))):
    local_capture = ARCHIVE / 'Web invitations' / url.removeprefix('https://')
    dest = OUT / 'fonts' / url.rsplit('/',1)[1]
    if local_capture.exists():
        shutil.copyfile(local_capture, dest)
        origin = 'local capture'
    else:
        if not dest.exists():
            with urllib.request.urlopen(url, timeout=45) as response:
                dest.write_bytes(response.read())
        origin = 'exact stylesheet URL (absent from local capture)'
    fonts.append({'url':url, 'file':'fonts/'+dest.name, 'sha256':digest(dest), 'bytes':dest.stat().st_size, 'origin':origin})
    font_css = font_css.replace(url, 'fonts/'+dest.name)
(OUT / 'fonts.css').write_text(font_css, encoding='utf-8', newline='')
report = {'templateId':'taklifla-gulbog', 'name':'Gulbog‘', 'published':True, 'selectable':True, 'capture':str(CAPTURE.relative_to(ROOT)).replace('\\','/'), 'captureSha256':digest(CAPTURE), 'fontStylesheetCapture':str(font_css_capture.relative_to(ROOT)).replace('\\','/'), 'fontStylesheetSha256':digest(font_css_capture), 'assets':assets, 'fonts':fonts, 'sourceStyles':{'source/template.css':hashlib.sha256(css.encode()).hexdigest(), 'source/language.css':hashlib.sha256(language_css.encode()).hexdigest()}, 'excluded':['provider query-string customizer and demo values','provider language localStorage runtime','provider guestbook endpoints/localStorage success','Cloudflare analytics'], 'gaps':[], 'sourceFieldIntegration':'Bride-family line, reminder title/text and footer note have typed editor/persistence support.', 'sourceMotionChanges':['Wrap engine in startGardenSource for contract-first initialization.','Bind countdown to event instant; empty/invalid dates display zero and hide countdown.','Skip petal generation for reduced motion.','Delegate open music to adapter to respect guest pause and preview policy.','Expose reveal observer for dynamically ordered program rows.']}
(OUT / 'dependencies.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(json.dumps({'artwork':len(assets),'fonts':len(fonts),'exactUrlRecovered':sum(f['origin']!='local capture' for f in fonts)}))
