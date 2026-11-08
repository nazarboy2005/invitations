"""Verify exact source/art/font dependencies and reviewed native helpers.
Original captures are read-only. Platform data, API and translated creator fields
remain in adapter.ts/bridge.js, separately from source design functions.
"""
from pathlib import Path
import hashlib,json,re
ROOT=Path(__file__).resolve().parents[5]
OUT=ROOT/'apps/web/public/templates/taklifla-sakura-guli'
meta=json.loads((OUT/'provenance.json').read_text(encoding='utf-8'))
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(ROOT/meta['source']).read_bytes();assert sha(raw)==meta['sourceSha256']
assert (OUT/'source/template.css').read_bytes()==re.search(r'<style>([\s\S]*?)</style>',raw.decode())[1].encode()
for item in meta['assetFiles']:assert sha((OUT/item['file']).read_bytes())==item['sha256'],item['file']
for file,expected in meta['sourceParts'].items():assert sha((OUT/file).read_bytes())==expected,file
print(json.dumps({'dependencies':len(meta['assetFiles']),'capture':meta['sourceSha256']}))
