"""Verify/refresh exact source dependencies while preserving reviewed adaptations.
Original captures are read-only. Never omit a missing source decoration or overwrite
reviewed HTML, motion hooks, bridge, translated labels or generated catalog art.
"""
from pathlib import Path
import hashlib,json,re,shutil
ROOT=Path(__file__).resolve().parents[6]
OUT=ROOT/'apps/web/public/templates/taklifla-osmon'
meta=json.loads((OUT/'source/provenance.json').read_text(encoding='utf-8'))
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(ROOT/meta['capture']).read_bytes()
assert sha(raw)==meta['captureSha256']
css=re.search(r'<style>([\s\S]*?)</style>',raw.decode())[1].encode()
assert sha(css)==meta['sourceCssSha256']
(OUT/'source/template.css').write_bytes(css)
ARCHIVE=(ROOT/meta['capture']).parents[3]
for item in meta['dependencies']:
 target=OUT/item['path']
 if not item['source'].startswith('https:'):
  source=ARCHIVE/item['source'];assert sha(source.read_bytes())==item['sha256']
  shutil.copyfile(source,target)
 assert sha(target.read_bytes())==item['sha256'],item['path']
for file,expected in meta['sourceParts'].items():assert sha((OUT/file).read_bytes())==expected,file
assert not meta['missing']
print(json.dumps({'dependencies':len(meta['dependencies']),'capture':meta['captureSha256']}))
