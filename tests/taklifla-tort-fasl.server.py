from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import unquote,urlparse
import mimetypes,json,re
root=Path(__file__).resolve().parents[1]
public=root/'apps/web/public'
out=public/'templates/taklifla-tort-fasl'
deps=json.loads((out/'dependencies.json').read_text(encoding='utf8'))
ref=root/deps['source']
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  route=unquote(urlparse(self.path).path)
  if route=='/':
   return self.send(b'''<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><style>body{margin:0}iframe{display:block;width:100%;height:100dvh;border:0}</style></head><body><iframe id="frame" title="To'rt fasl" src="/templates/taklifla-tort-fasl/index.html"></iframe><script>var fixture;fetch('/fixture').then(r=>r.json()).then(p=>{fixture=p;frame.contentWindow.postMessage(p,location.origin)});window.addEventListener('message',e=>{if(e.data.type==='taklifla-tort-fasl:ready'&&fixture)frame.contentWindow.postMessage(fixture,location.origin)});</script></body></html>''','text/html')
  if route=='/fixture':return self.send((root/'.tmp-fasllar-fixture.json').read_bytes(),'application/json')
  if route=='/reference':
   s=ref.read_text(encoding='utf8')
   s=re.sub(r'<script type="module" src="https://static.cloudflareinsights.*?</script>','',s)
   s=re.sub(r'<link[^>]*href="https://fonts[^>]*>','',s)
   s=s.replace('</head>','<link rel="icon" href="data:,"><link rel="stylesheet" href="/templates/taklifla-tort-fasl/fonts.css"></head>')
   s=s.replace('src="_wish-close.js"','src="/templates/taklifla-tort-fasl/source/wish-close.js"')
   s=s.replace('fasllar-img/','/templates/taklifla-tort-fasl/fasllar-img/')
   return self.send(s.encode('utf8'),'text/html')
  p=public/route.lstrip('/')
  if p.is_file() and p.resolve().is_relative_to(public.resolve()):return self.send(p.read_bytes(),mimetypes.guess_type(p)[0] or 'application/octet-stream')
  self.send_error(404)
 def send(self,b,t):
  self.send_response(200);self.send_header('Content-Type',t+'; charset=utf-8');self.send_header('Content-Length',str(len(b)));self.end_headers();self.wfile.write(b)
 def log_message(self,*args):pass
ThreadingHTTPServer(('127.0.0.1',3086),Handler).serve_forever()
