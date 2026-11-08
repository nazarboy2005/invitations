"""Refresh the isolated visual source without replacing the platform integration."""
from pathlib import Path
import hashlib, json, re
ROOT=Path(__file__).resolve().parents[5]
OUT=ROOT/'apps/web/public/templates/taklifla-yulduzli-tun'
meta=json.loads((OUT/'dependencies.json').read_text(encoding='utf-8'))
raw=(ROOT/meta['capture']).read_text(encoding='utf-8')
css=re.search(r'<style>([\s\S]*?)</style>',raw)[1]
for file in ['template.css','source/template.css']:(OUT/file).write_bytes(css.encode())
style=next(s for s in re.findall(r'<style[^>]*>([\s\S]*?)</style>',raw) if '.taklifla-lang-switch{' in s)
(OUT/'source/language.css').write_bytes(style.encode())
motion=next(s for s in re.findall(r'<script\b[^>]*>([\s\S]*?)</script>',raw) if '/* ===== STARS ===== */' in s)
motion=motion[:motion.index('/* ===== WISHES ===== */')]
motion=motion.replace("var target=window.__WED_TS||new Date('2026-07-24T10:00:00').getTime();",'').replace('var diff=target-Date.now();','var diff=(window.__WED_TS||0)-Date.now();')
motion=motion.replace('if(a.src)a.play().catch(function(){});','if(window.starryTryMusic)window.starryTryMusic();')
motion=motion.replace('requestAnimationFrame(draw);','if(!document.hidden&&!window.starryReducedMotion)requestAnimationFrame(draw);else window.starryResumeParticles=draw;')
motion=motion.replace('  draw();','  if(!window.starryReducedMotion)draw();else window.starryResumeParticles=draw;')
motion=motion.replace("  document.getElementById('splash').classList.add('hide');","  document.getElementById('splash').classList.add('hide');\n  document.getElementById('splash').inert=true;\n  var heading=document.querySelector('.hero-names');heading.tabIndex=-1;heading.focus({preventScroll:true});")
motion+="\ndocument.addEventListener('visibilitychange',function(){if(!document.hidden&&window.starryResumeParticles&&!window.starryReducedMotion){var resume=window.starryResumeParticles;window.starryResumeParticles=null;resume();}});\n"
(OUT/'source/motion.js').write_bytes(('\n'.join(s.rstrip() for s in motion.splitlines()).rstrip()+'\n').encode())
for item in meta['assets']+meta['fonts']:
 assert hashlib.sha256((OUT/item['file']).read_bytes()).hexdigest()==item['sha256'],item['file']
meta['sourceParts']={f:hashlib.sha256((OUT/f).read_bytes()).hexdigest() for f in meta['sourceParts']}
(OUT/'dependencies.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Refreshed native visual source; platform index/bridge/notes remain intact.')
