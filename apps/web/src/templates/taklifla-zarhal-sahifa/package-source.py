"""Package only the assigned Taklifla page; never writes to the archive."""
from pathlib import Path
import hashlib, html, json, re, shutil, urllib.request

ROOT = Path(__file__).resolve().parents[5]
ARCHIVE = ROOT / 'Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Taklifla'
PUBLIC = ROOT / 'apps/web/public/templates/taklifla-zarhal-sahifa'
SOURCE = ARCHIVE / 'Web invitations/taklifla.uz/templates/diyora-shahzod__be3e347086adb843.html'
raw = SOURCE.read_bytes()
page = raw.decode('utf-8')
manifest = json.loads((ARCHIVE / 'capture-manifest.json').read_text(encoding='utf-8'))
resources = next(v for v in manifest.values() if isinstance(v, dict) and any(isinstance(x, dict) and 'file' in x for x in v.values()))
for folder in ['source', 'assets', 'assets/fonts', 'assets/preview']:
    (PUBLIC / folder).mkdir(parents=True, exist_ok=True)
sha = lambda b: hashlib.sha256(b).hexdigest()
dependencies = []

def asset(url, relative):
    entry = resources.get(url)
    captured = ARCHIVE / entry['file'] if entry else None
    if captured and captured.is_file():
        data, origin = captured.read_bytes(), 'capture-manifest'
    else:
        # Exact font subset referenced by the captured stylesheet, never a substitute.
        data = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'}), timeout=45).read()
        origin = 'exact-source-url'
    path = PUBLIC / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    dependencies.append({'url': url, 'capture': entry['file'] if entry else None, 'file': relative, 'origin': origin, 'bytes': len(data), 'sha256': sha(data)})
    return '/templates/taklifla-zarhal-sahifa/' + relative

images = list(dict.fromkeys(re.findall(r'https://images\.unsplash\.com/[^"\s)]+', page)))
image_paths = {}
for i, url in enumerate(images):
    folder = 'assets/preview' if i in [3, 4, 5] else 'assets'
    image_paths[url] = asset(url, f'{folder}/{url.split("/")[-1].split("?")[0]}.avif')
font_url = html.unescape(re.search(r'<link href="(https://fonts.googleapis.com[^"]+)"', page)[1])
font_entry = resources[font_url]
font_css = (ARCHIVE / font_entry['file']).read_text(encoding='utf-8')
(PUBLIC / 'source/fonts.original.css').write_text(font_css, encoding='utf-8')
for url in dict.fromkeys(re.findall(r'https://fonts.gstatic.com/[^)\s]+', font_css)):
    target = asset(url, 'assets/fonts/' + sha(url.encode())[:12] + '.woff2')
    font_css = font_css.replace(url, target)
(PUBLIC / 'source/fonts.css').write_text(font_css, encoding='utf-8')

css = re.search(r'<style>(.*?)</style>', page, re.S)[1]
(PUBLIC / 'source/template.original.css').write_bytes(
    re.search(rb'<style>(.*?)</style>', raw, re.S)[1]
)
for url, path in image_paths.items():
    css = css.replace(url, path)
(PUBLIC / 'source/template.css').write_text(css, encoding='utf-8')

body = page[page.index('  <div class="shell">'):page.index('  <script>\n    // ─── COUNTDOWN')]
for url, path in image_paths.items():
    body = body.replace(url, path)
# Empty all creator/demo fields in the served document before any script runs.
for selector, tag, pattern in [
    ('hero-monogram','div',r'D &nbsp;·&nbsp; SH'),
    ('hero-names','h1',r'Aziza|Sardor'),
    ('hero-meta-val','span',r'12.06.2026|18:00'),
    ('invite-quote','p',r'.*?'),
    ('invite-names','div',r'.*?'),
    ('countdown-date','div',r'.*?'),
    ('detail-value','div',r'.*?'),
    ('detail-sub','div',r'.*?'),
    ('closing-mono','div',r'.*?'),
    ('closing-meta','div',r'.*?'),
]:
    body = re.sub(r'(<'+tag+r' class="[^"]*\b'+selector+r'\b[^>]*>).*?(</'+tag+'>)', r'\1\2', body, flags=re.S)
body = body.replace('Save the date', 'Sanani eslab qoling').replace('are getting married', 'Nikoh to‘yimizga marhamat')
body = body.replace('guest book', 'Tilaklar daftari').replace('see you soon', 'Ko‘rishguncha')
body = body.replace('Made with taklifla.uz ✦', 'Visol bilan yaratildi ✦')
body = body.replace('Yunusobod tumani, &laquo;Magnum Palace&raquo; to\'yxonasi', '')
body = re.sub(r'https://(?:yandex.com/maps/|maps.google.com/)[^"]+', '#', body)
body = re.sub(r'(<img src=")(/templates/[^\"]+/assets/preview/[^\"]+)(" alt=""/>)', r'\1\3', body)
body = body.replace('src="" ', '')
body = body.replace('<section class="details', '<section class="details')
body = body.replace('id="wish-name"', 'id="wish-name" aria-label="Ismingiz"').replace('id="wish-text"', 'id="wish-text" aria-label="Tilagingiz"')
body = body.replace('<div class="wish-list"', '<p id="wish-status" role="status" aria-live="polite"></p>\n      <div class="wish-list"')
lang_start = page.index('<style>\n.taklifla-lang-switch')
lang_end = page.index('<script>', lang_start)
lang = page[lang_start:lang_end].replace('aria-label="Language"', 'aria-label="Til"')
lang = lang.replace('data-lang="uz"', 'data-lang="uz-Latn"').replace('>UZ<', '>Uz<').replace('>EN<', '>En<').replace('>RU<', '>Ru<')
lang = lang.replace('    <hr />', '    <button type="button" data-lang="uz-Cyrl" role="menuitemradio">Уз</button>\n    <hr />', 1)
lang = lang.replace('aria-haspopup="menu"', 'aria-haspopup="menu" aria-label="Til"')

reveal = page[page.index('    // ─── REVEAL ON SCROLL'):page.index('  </script>', page.index('    // ─── REVEAL ON SCROLL'))]
(PUBLIC / 'source/reveal.js').write_text(reveal, encoding='utf-8')
countdown = page[page.index('    // ─── COUNTDOWN'):page.index('    // ─── WISHES')]
countdown = re.sub(r'      const target = .*?\n', '', countdown)
countdown = countdown.replace('      function tick() {', '      function tick() {\n        const target = window.zarhalTarget || 0;')
countdown = countdown.replace('      tick();', '      window.zarhalTick = tick;\n      tick();')
(PUBLIC / 'source/countdown.js').write_text(countdown, encoding='utf-8')
music = re.search(r'<script>\s*(.*?)</script>', page, re.S)[1]
music = music.replace('(function(){', 'window.createZarhalMusic = function(src, autoStart){', 1)
music = music.replace("    var src = new URLSearchParams(location.search).get('audio') || '';\n", '')
music = music.replace("    btn.type = 'button';", "    btn.id = 'zarhal-music';\n    btn.type = 'button';")
music = music.replace("btn.setAttribute('aria-label', 'Musiqani boshqarish');", "btn.setAttribute('aria-label', window.zarhalLabels.musicPlay);")
music = music.replace('    function paint() {', "    var played = false, chosenPause = false;\n    function paint() {\n      btn.setAttribute('aria-label', audio.paused ? window.zarhalLabels.musicPlay : window.zarhalLabels.musicPause);\n      btn.setAttribute('aria-pressed', String(!audio.paused));")
music = music.replace('<span>Musiqani yoqish</span>', "<span>' + window.zarhalLabels.musicPlay + '</span>")
music = music.replace("      if (audio.paused) audio.play().catch(function(){});\n      else audio.pause();", "      if (audio.paused) { chosenPause = false; audio.play().catch(function(){}); }\n      else { chosenPause = true; audio.pause(); }")
music = music.replace('function tryPlay(){ audio.play().then(paint).catch(function(){}); }\n    tryPlay();', 'function tryPlay(){ if (chosenPause || played) return; audio.play().then(paint).catch(function(){}); }\n    if (autoStart) tryPlay();')
music = music.replace("      if (fired) return;", "      if (fired || chosenPause || played || (event && event.target.closest && event.target.closest('#zarhal-music'))) return;")
music = music.replace('function onGesture(){', 'function onGesture(event){')
music = music.replace("audio.addEventListener('play', paint);", "audio.addEventListener('play', function(){ played = true; paint(); });")
music = music.replace('  })();', "    return { audio: audio, paint: paint, destroy: function(){ chosenPause = true; audio.pause(); audio.src = ''; btn.remove(); ringStyle.remove(); ['pointerdown','touchstart','click','keydown'].forEach(function(t){window.removeEventListener(t,onGesture,true);}); } };\n  };")
(PUBLIC / 'source/music.js').write_text(music, encoding='utf-8')
(PUBLIC / 'index.html').write_text('''<!doctype html><html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Taklifnoma</title>
<link rel="stylesheet" href="source/fonts.css"><link rel="stylesheet" href="source/template.css"><link rel="stylesheet" href="adapter.css"></head><body>
''' + body + lang + '\n<script src="source/music.js"></script><script src="source/countdown.js"></script><script src="bridge.js"></script><script src="source/reveal.js"></script></body></html>', encoding='utf-8')
provenance = {
    'source': str(SOURCE.relative_to(ROOT)), 'sourceSha256': sha(raw),
    'requestedSiblingDirectoryPresent': (SOURCE.parent / 'diyora-shahzod-img').is_dir(),
    'sourceCssSha256': sha(re.search(r'<style>(.*?)</style>',page,re.S)[1].encode()),
    'dependencies': dependencies,
    'excluded': ['provider query-string customizer', 'provider guestbook/localStorage/backfill/demo seeds', '_wish-close.js provider one-per-browser policy', 'provider translations and storage runtime', 'duplicate appended shared music player', 'Cloudflare analytics'],
}
(PUBLIC / 'provenance.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'dependencies':len(dependencies),'images':len(images),'sourceSha256':sha(raw)}, indent=2))
