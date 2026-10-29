from pathlib import Path
import re,json,shutil,hashlib,urllib.request
root=Path('Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Taklifla')
src=root/'Web invitations/taklifla.uz/templates/mountain__fab6fd322ba1f179.html'
out=Path('apps/web/public/templates/taklifla-toglar-bagrida')
(out/'source').mkdir(parents=True,exist_ok=True)
(out/'fonts').mkdir(exist_ok=True)
s=src.read_text(encoding='utf-8')
styles=re.findall(r'<style>([\s\S]*?)</style>',s)
scripts=re.findall(r'<script(?:\s[^>]*)?>([\s\S]*?)</script>',s)
(out/'source/template.css').write_text(styles[0],encoding='utf-8',newline='\n')
(out/'source/controls.css').write_text('\n'.join(styles[1:]),encoding='utf-8',newline='\n')
motion=scripts[0][scripts[0].index('  // ── Hero parallax'):scripts[0].index('  // ── Wishes wall')]
reveal=scripts[0][scripts[0].index('  // ── Reveal on scroll'):]
motion=motion.replace('    var y = window.scrollY', '    if (document.documentElement.hasAttribute("data-reduced-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { ticking=false; return; }\n    var y = window.scrollY',1)
(out/'source/motion.js').write_text('(function () {\n  "use strict";\n'+motion+reveal,encoding='utf-8',newline='\n')
shutil.copytree(src.parent/'mountain-img',out/'mountain-img',dirs_exist_ok=True)
body=s[s.index('<body>')+6:s.index('<script>')]
# Strip source invitation values, retain all template-level structure/artwork.
body=re.sub(r'(<[^>]+data-bind="[^"]+"[^>]*>)[\s\S]*?(</[^>]+>)',r'\1\2',body)
body=re.sub(r'(<div class="timeline">)[\s\S]*?(\n    </div>\n  </section>)',r'\1\2',body,count=1)
body=body.replace(' data-target="2026-09-12T15:00:00"','')
body=body.replace("Tashrifingizni 1-avgustgacha bizga ma'lum qiling.","Tashrifingizni bizga ma’lum qiling.")
body=body.replace('shu sahifaning oxirida ko\'rinadi.', 'tasdiqlangach shu sahifada ko‘rinadi.')
body=body.replace('taklifla.uz','Visol')
body=body.replace('novalidate','').replace('id="wishThanks" hidden','id="wishThanks" role="status" hidden')
audio=s[s.index('<audio id="bgMusic"'):s.index('<script>',s.index('<audio id="bgMusic"'))]
lang=s[s.index('<div class="taklifla-lang-switch"'):s.index('<script>',s.index('<div class="taklifla-lang-switch"'))]
lang=lang.replace('aria-label="Language"','aria-label="Til"').replace('data-lang="uz"','data-lang="uz-Latn"')
lang=lang.replace('<hr />','<hr />\n    <button type="button" data-lang="uz-Cyrl" role="menuitemradio">ЎЗ</button>\n    <hr />',1)
html='''<!doctype html>
<html lang="uz-Latn"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>Tog‘lar bag‘rida — Taklifnoma</title>
<link rel="stylesheet" href="fonts/fonts.css" />
<link rel="stylesheet" href="source/template.css" />
<link rel="stylesheet" href="source/controls.css" />
<link rel="stylesheet" href="platform.css" />
</head><body>'''+body+audio+lang+'''<script src="platform-adapter.js"></script>
<script src="source/motion.js"></script>
</body></html>'''
(out/'index.html').write_text(html,encoding='utf-8',newline='\n')
url=re.search(r'<link href="(https://fonts.googleapis.com/css2[^\"]+)"',s)[1]
req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36'})
css=urllib.request.urlopen(req).read().decode()
fonts=[]
for i,u in enumerate(dict.fromkeys(re.findall(r'https://fonts.gstatic.com/[^)\s]+',css))):
    name=f'font-{i:02d}.'+u.rsplit('.',1)[1]
    b=urllib.request.urlopen(u).read(); (out/'fonts'/name).write_bytes(b)
    fonts.append({'file':'fonts/'+name,'url':u,'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b)})
    css=css.replace(u,name)
(out/'fonts/fonts.css').write_text(css,encoding='utf-8',newline='\n')
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
manifest=json.loads((root/'capture-manifest.json').read_text(encoding='utf-8'))
mountain=[p for p in manifest['pages'] if 'mountain' in json.dumps(p)]
provenance={'id':'taklifla-toglar-bagrida','name':'Tog‘lar bag‘rida','source':str(src).replace('\\','/'),'sourceSha256':sha(src),'captureManifestSha256':sha(root/'capture-manifest.json'),'manifestEntries':mountain,'assets':[{'source':str(p).replace('\\','/'),'file':'mountain-img/'+p.name,'sha256':sha(p),'bytes':p.stat().st_size} for p in sorted((src.parent/'mountain-img').glob('*'))],'fonts':{'stylesheetUrl':url,'files':fonts},'sourceParts':{'templateCssSha256':sha(out/'source/template.css'),'controlsCssSha256':sha(out/'source/controls.css'),'motionJsSha256':sha(out/'source/motion.js')},'excluded':['Provider URL-data customizer and demo invitation values','Provider music/language scripts, localStorage persistence and guestbook client','Cloudflare analytics beacon'],'status':'Registered 0185; published 0186 after complete source and real lifecycle verification'}
(out/'source-provenance.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'assets':len(provenance['assets']),'fonts':len(fonts),'styles':len(styles),'scripts':len(scripts),'manifestEntries':len(mountain),'source':provenance['sourceSha256']},indent=2))
