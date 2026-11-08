"""Verify exact reference assets and inline styles without overwriting reviewed integration.
Captures are read-only. Platform bridge and Cyrillic adapter remain separate from
native source fit/render/close/motion helpers. No provider runtime is packaged.
"""
from pathlib import Path
import hashlib,json,re
ROOT=Path(__file__).resolve().parents[5]
HERE=Path(__file__).resolve().parent
OUT=ROOT/'apps/web/public/templates/taklifla-qogoz-ertagi'
meta=json.loads((HERE/'dependencies.json').read_text(encoding='utf-8'))
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(ROOT/meta['source']).read_bytes();assert sha(raw)==meta['sourceSha256']
styles=lambda s:re.findall(r'<style>([\s\S]*?)</style>',s)
assert styles((OUT/'index.html').read_bytes().decode())==styles(raw.decode())
for item in meta['dependencies']:assert sha((OUT/item['file']).read_bytes())==item['sha256'],item['file']
for file,expected in meta['sourceParts'].items():assert sha((OUT/file).read_bytes())==expected,file
print(json.dumps({'dependencies':len(meta['dependencies']),'capture':meta['sourceSha256']}))
