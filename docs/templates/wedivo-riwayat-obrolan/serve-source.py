import http.server
from functools import partial
class QuietHandler(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',3028),partial(QuietHandler,directory='apps/web/public'))
server.serve_forever()
