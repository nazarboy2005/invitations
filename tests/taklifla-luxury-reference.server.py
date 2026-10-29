"""Read-only local reference harness; never modifies the captured originals."""
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse, unquote
import json, mimetypes, re

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "apps/web/public"
DESIGNS = {
    "taklifla-tungi-saroy": ("source/provenance.json", "midnight-palace-img/", "assets/", "assets/fonts.css"),
    "taklifla-tovus": ("dependencies.json", "tovus-img/", "tovus-img/", "fonts/fonts.css"),
}

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        route = unquote(urlparse(self.path).path)
        if route == "/reference/wish-close.js":
            return self.send((PUBLIC / "templates/taklifla-tovus/source/provider-wish-close.js").read_bytes(), "text/javascript")
        key = route.removeprefix("/reference/").strip("/")
        if route.startswith("/reference/") and key in DESIGNS:
            manifest, old, new, fonts = DESIGNS[key]
            base = PUBLIC / "templates" / key
            meta = json.loads((base / manifest).read_text(encoding="utf8"))
            source = (ROOT / meta["capture"]).read_text(encoding="utf8")
            source = re.sub(r'<script\b[^>]*src=["\']https?://[^>]*>[\s\S]*?</script>', '', source)
            source = re.sub(r'<link\b[^>]*href=["\']https?://[^>]*>', '', source)
            source = source.replace('</head>', f'<link rel="icon" href="data:,"><link rel="stylesheet" href="/templates/{key}/{fonts}"></head>')
            source = source.replace(old, f"/templates/{key}/{new}")
            source = source.replace('src="_wish-close.js"', 'src="/reference/wish-close.js"')
            return self.send(source.encode("utf8"), "text/html")
        path = PUBLIC / route.lstrip("/")
        if path.is_file() and path.resolve().is_relative_to(PUBLIC.resolve()):
            return self.send(path.read_bytes(), mimetypes.guess_type(path)[0] or "application/octet-stream")
        self.send_error(404)

    def send(self, content, mime):
        self.send_response(200)
        self.send_header("Content-Type", mime)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, *args):
        pass

ThreadingHTTPServer(("127.0.0.1", 3087), Handler).serve_forever()
