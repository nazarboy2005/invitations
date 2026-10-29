"""Verify/refresh exact reference dependencies, preserving reviewed adapters/DOM.
Original captures are read-only. Strip complete script blocks before extracting
a real body: this source has literal <body> in head-script comments.
"""
from pathlib import Path
import hashlib,json,re,shutil
ROOT=Path(__file__).resolve().parents[5]
OUT=ROOT/'apps/web/public/templates/taklifla-parilar-ertagi'
meta=json.loads((OUT/'source/provenance.json').read_text(encoding='utf-8'))
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(ROOT/meta['source']).read_bytes();assert sha(raw)==meta['sourceSha256']
clean=re.sub(r'<script\b[^>]*>[\s\S]*?</script>','',raw.decode())
body=re.search(r'<body[^>]*>([\s\S]*?)</body>',clean)[1]
for ident in ['app','splash','hero','invite','events','venue','info','wishes','countdown']:assert f'id="{ident}"' in body
css=re.search(r'<style>([\s\S]*?)</style>',raw.decode())[1].encode();assert sha(css)==meta['sourceCssSha256']
for file in ['source/template.css','template.css']:(OUT/file).write_bytes(css)
for item in [*meta['assets'],*meta['fonts']]:assert sha((OUT/item['file']).read_bytes())==item['sha256'],item['file']
for file,expected in meta['sourceParts'].items():assert sha((OUT/file).read_bytes())==expected,file
print(json.dumps({'assets':len(meta['assets']),'fonts':len(meta['fonts']),'capture':meta['sourceSha256']}))
