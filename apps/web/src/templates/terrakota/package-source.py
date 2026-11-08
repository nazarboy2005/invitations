"""Refresh native visual source without replacing the shared-data bridge/editor DOM."""
from pathlib import Path
import hashlib,json,re
ROOT=Path(__file__).resolve().parents[5]
OUT=ROOT/'apps/web/public/templates/taklifla-terracotta'
meta=json.loads((OUT/'source/provenance.json').read_text(encoding='utf-8'))
raw=(ROOT/meta['capture']).read_text(encoding='utf-8')
styles=re.findall(r'<style>([\s\S]*?)</style>',raw)
scripts=re.findall(r'<script>([\s\S]*?)</script>',raw)
(OUT/'template.css').write_bytes(styles[0].encode())
(OUT/'language.css').write_bytes(styles[1].encode())
motion = scripts[1].split('    /* --- Countdown --- */')[0]
motion = motion[:motion.index('        /* Try music */')] + motion[motion.index('    });',motion.index('        /* Try music */')):]
motion += scripts[1][scripts[1].index('    /* --- Parallax Floating Botanicals --- */'):]
(OUT / 'source/motion.original.js').write_bytes((motion.rstrip()+'\n').encode())
motion = motion.replace('(function() {', 'window.startTerracottaMotion = function() {', 1)
motion = motion.removesuffix('\n').removesuffix('})();').rstrip() + '};\n'
motion = motion.replace('}, 900);', '}, window.terracottaReducedMotion ? 0 : 900);')

motion = motion.replace('        var scrollY =', '        if (window.terracottaReducedMotion) return;\n        var scrollY =')
motion=motion.replace('    /* --- Particles --- */','    window.terracottaObserve=initReveal;\n    /* --- Particles --- */')
(OUT / 'source/motion.js').write_bytes((motion.rstrip()+'\n').encode())
for item in meta['dependencies']:
 assert hashlib.sha256((OUT/item['file']).read_bytes()).hexdigest()==item['sha256'],item['file']
meta['motionOriginalSha256']=hashlib.sha256((OUT/'source/motion.original.js').read_bytes()).hexdigest()
meta['sourceParts']={f:hashlib.sha256((OUT/f).read_bytes()).hexdigest() for f in meta['sourceParts']}
(OUT/'source/provenance.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Native visual source refreshed; platform integration preserved.')
