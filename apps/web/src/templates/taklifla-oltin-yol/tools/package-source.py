"""Verify/refresh immutable reference dependencies; preserve reviewed platform adaptations.

Run from any directory. Hand-adapted DOM, source motion/render hooks, labels and
bridge remain reviewable in their own files; this utility never overwrites them
or the generated catalog artwork. Original captures are read-only inputs.
"""
from pathlib import Path
import hashlib,json,re,shutil
ROOT=Path(__file__).resolve().parents[6]
OUT=ROOT/'apps/web/public/templates/taklifla-oltin-yol'
meta=json.loads((OUT/'provenance.json').read_text(encoding='utf-8'))
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(ROOT/meta['capture']).read_bytes()
assert sha(raw)==meta['sourceSha256'],'Reference capture changed'
css=re.search(r'<style>([\s\S]*?)</style>',raw.decode())[1].encode()
assert sha(css)==meta['sourceStyleSha256']
(OUT/'source/template.css').write_bytes(css)
for item in meta['dependencies']:
 target=OUT/item['package']
 if 'archive' in item:
  source=ROOT/item['archive'];assert sha(source.read_bytes())==item['sha256']
  target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source,target)
 assert sha(target.read_bytes())==item['sha256'],item['package']
for file,expected in meta['sourceParts'].items():
 assert sha((OUT/file).read_bytes())==expected,file
print(json.dumps({'verifiedDependencies':len(meta['dependencies']),'capture':meta['sourceSha256']}))
