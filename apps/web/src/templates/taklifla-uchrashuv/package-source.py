"""Refresh source CSS/motion while preserving the integrated platform index/bridge."""
from pathlib import Path
import hashlib,json,re
ROOT=Path(__file__).resolve().parents[5]
OUT=ROOT/'apps/web/public/templates/taklifla-uchrashuv'
meta=json.loads((OUT/'dependencies.json').read_text(encoding='utf-8'))
raw=(ROOT/meta['source']).read_text(encoding='utf-8')
styles=re.findall(r'<style>([\s\S]*?)</style>',raw)
scripts=re.findall(r'<script>([\s\S]*?)</script>',raw)
for name,css in zip(['template','music','language'],styles):(OUT/f'source/{name}.css').write_bytes(css.encode())
engine = scripts[1]
(OUT / 'source/motion.original.js').write_bytes(engine.encode())
# Only integration hooks/accessibility adaptations; retain the original animation engine.
engine = engine.replace("var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;", "function reduced(){ return document.body.classList.contains('reduce-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches; }")
engine = engine.replace('if(reduced)', 'if(reduced())').replace('reduced?0:', 'reduced()?0:')
engine = engine.replace("$letter.setAttribute('aria-hidden','false');", "$letter.setAttribute('aria-hidden','false');\n    $letter.inert = false; $cover.inert = true; window.uchrashuvOpened?.();")
engine = engine.replace("setTimeout(function(){ $letter.classList.add('show'); }, reduced()?0:150);", "setTimeout(function(){ $letter.classList.add('show'); document.getElementById('yes-btn').focus({preventScroll:true}); }, reduced()?0:150);")
engine = engine.replace("var l = (window.__takliflaLang || document.documentElement.lang || 'uz').toLowerCase().slice(0,2);\n    return NO_STAGES[l] || NO_STAGES.uz;", "return window.UCHRASHUV_COPY[document.documentElement.lang]?.stages || NO_STAGES.uz;")
engine = engine.replace("if(dodgeCount < 3){ dodge(e); return; }", "if(reduced()){ window.uchrashuvReply?.('no'); return; }\n    if(dodgeCount < 3){ dodge(e); return; }")
start = engine.index('    // Build map link')
end = engine.index('    setTimeout(function(){', start)
engine = engine[:start] + engine[end:]
engine = engine.replace('  function triggerYes(){', "  async function triggerYes(){\n    if(!window.uchrashuvReply || !(await window.uchrashuvReply('yes'))) return;")
engine = engine.replace("$confirm.setAttribute('aria-hidden','false');", "$confirm.setAttribute('aria-hidden','false'); $confirm.inert = false; $letter.inert = true; $confirm.focus({preventScroll:true});")
(OUT / 'source/motion.js').write_bytes(engine.encode())

for item in meta['assets']:
 assert hashlib.sha256((OUT/item['file']).read_bytes()).hexdigest()==item['sha256'],item['file']
meta['sourceParts']={f:hashlib.sha256((OUT/f).read_bytes()).hexdigest() for f in meta['sourceParts']}
(OUT/'dependencies.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Native source refreshed; integrated index/bridge retained.')
