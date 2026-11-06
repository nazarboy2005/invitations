"""Reproducibly package the selected embedded source; never write to the capture."""
from pathlib import Path
import concurrent.futures, hashlib, html, json, re, urllib.request
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[5]
CAPTURE = ROOT / "Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Wedivo/Web invitations/templates/gLoUUgh7ocbBu09nZsFQ/index.html"
OUT = ROOT / "apps/web/public/templates/wedivo-taman-rahasia"
OUT.mkdir(parents=True, exist_ok=True)
(OUT / "source").mkdir(exist_ok=True)
(OUT / "assets/fonts").mkdir(parents=True, exist_ok=True)
raw = CAPTURE.read_bytes()
s = raw.decode("utf-8")
scripts = re.findall(r"<script[^>]*>(.*?)</script>", s, re.S)
styles = re.findall(r"<style[^>]*>(.*?)</style>", s, re.S)
art = sorted(set(re.findall(r'https://wedivo.id/uploads/templates/[^"\s)<>]+', s)))
records = []

def fetch(pair):
    url, target = pair
    if not target.exists():
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        target.write_bytes(urllib.request.urlopen(req, timeout=60).read())
    return {"url": url, "file": str(target.relative_to(OUT)).replace("\\", "/"), "sha256": hashlib.sha256(target.read_bytes()).hexdigest(), "bytes": target.stat().st_size}

pairs = [(u, OUT / f"assets/art-{i+1:02}.jpg") for i, u in enumerate(art)]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    records += list(pool.map(fetch, pairs))
font_url = html.unescape(re.search(r'https://fonts.googleapis.com/css2[^"<>]+', s)[0])
font_css = urllib.request.urlopen(urllib.request.Request(font_url, headers={"User-Agent": "Mozilla/5.0"}), timeout=60).read().decode()
font_urls = list(dict.fromkeys(re.findall(r'https://fonts.gstatic.com/[^)\s]+', font_css)))
for i, url in enumerate(font_urls):
    name = f"fonts/font-{i+1:02}." + url.rsplit('.', 1)[-1]
    records.append(fetch((url, OUT / "assets" / name)))
    font_css = font_css.replace(url, name)
(OUT / "assets/fonts.css").write_text(font_css, encoding="utf-8")
css = "\n".join(styles)
css = re.sub(r'@import\s+url\([^)]*\)\s*;', '', css)
for i, url in enumerate(art):
    css = css.replace(url, f"../assets/art-{i+1:02}.jpg")
(OUT / "source/template.css").write_text(css, encoding="utf-8")

# Preserve the complete template DOM and inline SVG. Remove all provider runtime,
# parameter defaults, demo data, invitation-specific photos/music and map key.
soup = BeautifulSoup(s, "html.parser")
for node in soup.select("script, style, link[rel=preconnect], link[href*=fonts]"):
    node.decompose()
for node in soup.select("img, audio, iframe"):
    if node.get("src", "").startswith("https:"):
        node.attrs.pop("src", None)
    if node.name == "img": node["alt"] = ""
for node in soup.select("a"):
    node.attrs.pop("href", None)
for attr in list(soup.select_one("#data-src").attrs):
    if attr.startswith("data-"): soup.select_one("#data-src")[attr] = ""
clear = ["cover-bride", "cover-groom", "cover-guest-name", "hero-bride", "hero-groom", "hero-date-text", "quote-opening", "quote-text", "quote-source", "bride-care-src", "groom-care-src", "event-1-name", "event-2-name", "map-venue", "map-address", "secret-letter-text", "secret-letter-sign", "gifts-lead", "closing-msg", "closing-bride", "closing-groom", "closing-hashtag", "rsvp-note", "rsvp-guest-name", "dress-text"]
for role in ["bride", "groom"]:
    clear += [f"packet-{role}-name", f"packet-{role}-child", f"packet-{role}-parents-names", f"packet-{role}-back-name"]
for i in range(1,5): clear += [f"story-{i}-title", f"story-{i}-date", f"story-{i}-text"]
for i in range(1,4): clear += [f"flower-card-{i}-meaning", f"flower-card-{i}-name"]
for i in range(1,3): clear += [f"event-{i}-date", f"event-{i}-time", f"event-{i}-venue", f"event-{i}-address"]
for node_id in clear:
    node = soup.find(id=node_id)
    if node: node.clear()
soup.select_one("#wish-list").clear()
# Actual source RSVP is retained; the platform's no-headcount rule removes only
# its numeric headcount field. No gift/card/receipt UI is invented.
pax = soup.select_one("#rsvp-pax")
if pax:
    parent = pax.parent
    if parent.get("id") == "rsvp-pax-field": parent.decompose()
    else:
        soup.select_one("#rsvp-pax-label").decompose()
        pax.decompose()
for node in soup.select("[data-wedivo=comments-more]"): node.decompose()
for node in soup.select("title"): node.string = "Taklifnoma"
soup.html["lang"] = "uz-Latn"
for node in soup.select("meta[property], meta[name=description]"): node.decompose()
for name in ["Aulia", "Bagas", "Sekar", "Bayu"]:
    for text in soup.find_all(string=re.compile(name)):
        text.replace_with(str(text).replace(name, ""))
    for node in soup.find_all(attrs={"aria-label": re.compile(name)}):
        node["aria-label"] = node["aria-label"].replace(name, "")
for href in ["assets/fonts.css", "source/template.css", "adapter.css"]:
    node = soup.new_tag("link", rel="stylesheet", href=href); soup.head.append(node)
node = soup.new_tag("script", src="adapter.js"); soup.body.append(node)
(OUT / "index.html").write_text(str(soup), encoding="utf-8")

# Narrow source hooks: dates, language, dynamic gallery/story, platform-owned
# music. All ornament, gate, vine, sundial, reveals and viewer code is retained.
engine = scripts[2]
engine = engine.replace('var reduceMotion = !!(', 'var reduceMotion = !!(window.TAMAN.reducedMotion || ')
engine = engine.replace('var mainStart = makeDate(weddingISO, weddingTime);', 'var mainStart = window.TAMAN.data.dateTime ? new Date(window.TAMAN.data.dateTime) : null;')
engine = engine.replace('dt.toLocaleDateString("id-ID", {', 'dt.toLocaleDateString(window.TAMAN.locale, {')
engine = re.sub(r'function timeRange\(start, end\) \{.*?\n        \}', 'function timeRange(start, end) { return [start, end].filter(Boolean).join(" – "); }', engine, count=1, flags=re.S)
engine = engine.replace('var storyCards = [1, 2, 3, 4]\n          .map(function (i) {\n            return byId("story-" + i);\n          })', 'var storyCards = all(".story-card")')
for a,b in [('Benih','seed'),('Tunas','sprout'),('Kuncup','bud'),('Mekar','bloom')]:
    engine = engine.replace(f'name: "{a}"', f'name: window.TAMAN.words.{b}')
engine = re.sub(r'var galleryUrls = \[.*?\]\.filter\(function \(u\) \{.*?\}\);', 'var galleryUrls = window.TAMAN.data.gallery.map(function (item) { return item.src; });', engine, count=1, flags=re.S)
engine = engine.replace('"Buka foto " + (i + 1)', 'window.TAMAN.words.photo + " " + (i + 1)')
engine = engine.replace('img.alt = "";', 'img.alt = window.TAMAN.data.gallery[i].alt || "";')
engine = engine.replace('"Kaca ke-" + (viewerIndex + 1) + " dari rumah kaca kami"', '(window.TAMAN.data.gallery[viewerIndex].caption || "")')
engine = engine.replace('viewerImg.src = url;', 'viewerImg.src = url; viewerImg.alt = window.TAMAN.data.gallery[viewerIndex].alt || "";')
# Source music is replaced as one unit so guest pause/mute cannot be overridden
# by its first-pointer listener or gate callback.
a = engine.index('        var audio = byId("bg-music");')
b = engine.index('        /* ---------------------------------------------------------------- toast', a)
engine = engine[:a] + '        var playMusic = window.TAMAN.playMusic;\n' + engine[b:]
engine = engine.replace('"Kamu menemukan surat rahasia di bawah batu!"', 'window.TAMAN.words.secretFound')
engine = engine.replace('"Semua bab telah kamu temukan. Terima kasih sudah menjelajah taman kami!"', 'window.TAMAN.words.allFound')
engine = engine.replace('"Musim mekar telah tiba — terima kasih atas doa-doamu"', 'window.TAMAN.words.countDone')
engine = engine.replace('"Seharian"', 'window.TAMAN.words.allDay').replace('"Sepanjang hari"', 'window.TAMAN.words.allDay').replace('"Sedang berlangsung"', 'window.TAMAN.words.now')
(OUT / "source/template.js").write_text(engine, encoding="utf-8")
(OUT / "dependencies.json").write_text(json.dumps({"capture": str(CAPTURE.relative_to(ROOT)).replace('\\','/'), "captureSha256": hashlib.sha256(raw).hexdigest(), "captureType": "embedded-source", "assets": records}, indent=2), encoding="utf-8")
print(f"Packaged {len(records)} local assets; original capture unchanged.")
