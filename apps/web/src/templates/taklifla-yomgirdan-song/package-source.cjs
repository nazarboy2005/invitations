// Reproducible extraction. Reads the archive; writes this template package only.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const root = path.resolve(__dirname, '../../../../..');
const archive = path.join(root, 'Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Taklifla');
const capture = path.join(archive, 'Web invitations/taklifla.uz/templates/yomgir__e1f114296ddf553c.html');
const out = path.join(root, 'apps/web/public/templates/taklifla-yomgirdan-song');
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const write = (name, data) => { fs.mkdirSync(path.dirname(path.join(out,name)),{recursive:true});fs.writeFileSync(path.join(out,name),data); };
async function main() {
  const bytes = fs.readFileSync(capture), raw = bytes.toString('utf8');
  const css = raw.match(/<style>([\s\S]*?)<\/style>/)[1];
  const js = raw.match(/<script>([\s\S]*?)<\/script>/)[1];
  write('source/template.css', css);
  const motion = js.slice(js.indexOf('  /* ── reveal on scroll'),js.indexOf('  /* ── guestbook'));
  write('source/motion.js', 'window.startYomgirMotion = function () {\nvar $ = s => document.querySelector(s);\n' + motion + '\n};\n');
  const events = js.slice(js.indexOf('    var host = $("#yg-events");'), js.indexOf('  /* ── countdown'));
  write('source/events.js', 'window.renderYomgirEvents = function(live) {\nvar $ = s => document.querySelector(s), esc = window.yomgirEscape;\n'+events.replace(/  \}\)\(\);\s*$/,'')+'\n};\n');
  const wishes = js.slice(js.indexOf('    function render(items) {'),js.indexOf('    function lock()'));
  write('source/wishes.js', 'window.renderYomgirWishes = function(items) {\nvar list=document.querySelector("#yg-wish-list"),empty=document.querySelector("#yg-wish-empty"),esc=window.yomgirEscape;\n'+wishes+'\nrender(items);\n};\n');
  const closePath = path.join(path.dirname(capture),'_wish-close.js'), close = fs.readFileSync(closePath,'utf8');
  write('source/wish-close.js','window.buildYomgirClosedPanel = '+close.slice(close.indexOf('function buildPanel('),close.indexOf('  function readAccent()')).trim()+';\n');
  let html = raw.slice(0,raw.indexOf('<script>'));
  html = html.replace(/<link[^>]+(?:fonts\.googleapis|fonts\.gstatic)[^>]*>\s*/g,'');
  html = html.replace(/<style>[\s\S]*?<\/style>/,'<link rel="stylesheet" href="fonts/fonts.css">\n<link rel="stylesheet" href="source/template.css">\n<link rel="stylesheet" href="platform.css">');
  html = html.replace('<html lang="uz">','<html lang="uz-Latn" data-awaiting-content>');
  html = html.replace("<title>Yomg'irdan so'ng — Taklifnoma</title>",'<title>Yomg‘irdan so‘ng — Taklifnoma</title>');
  // Every personal/demo field is blank before any bridge payload can arrive.
  const ids = ['yg-splash-mono','yg-splash-date','yg-hero-names','yg-hero-date','yg-hero-city','yg-frame-groom-parents','yg-frame-bride-parents','yg-frame-names','yg-frame-when','yg-frame-venue','yg-frame-city','yg-venue-name','yg-venue-addr','yg-info-dress-text','yg-info-arrival-text','yg-info-gifts-text','yg-info-contact-text','yg-foot-names','yg-foot-date','yg-foot-city'];
  for(const id of ids) html=html.replace(new RegExp('(<[^>]+id="'+id+'"[^>]*>)[^<]*(<\\/[^>]+>)'),'$1$2');
  html=html.replace(/(<p data-i18n="inv_request"[^>]*>)[\s\S]*?<\/p>/,'$1</p>');
  html=html.replace(/(<div id="yg-events"[^>]*>)[\s\S]*?(\n    <\/section>)/,'$1\n      </div>$2');
  html=html.replace(/href="https:\/\/maps\.google[^\"]*"/g,'href="#"');
  html=html.replace('data-lang="uz" class="on">UZ','data-lang="uz-Latn" class="on">Uz').replace('data-lang="en">EN','data-lang="uz-Cyrl">Уз</button>\n    <button type="button" data-lang="en">En').replace('data-lang="ru">RU','data-lang="ru">Ru');
  // Identify existing source slots; no extra product sections are added.
  html=html.replace('<section style="background:linear-gradient(#f3ddc0', '<section id="yg-venue-section" style="background:linear-gradient(#f3ddc0');
  html=html.replace('<section style="background:linear-gradient(#c3e0f0', '<section id="yg-wishes-section" style="background:linear-gradient(#c3e0f0');
  html=html.replace('<section style="position:relative; background:#abd6ee','<section id="yg-countdown-section" style="position:relative; background:#abd6ee');
  html=html.replace('id="yg-frame-names"','id="yg-frame-names"').replace('inset:24% 24%;','inset:24% 24%;').replace('id="yg-frame-kicker"','id="yg-frame-kicker"');
  html=html.replace('<input name="wname"','<input name="wname" required maxlength="100" aria-label="Ismingiz"').replace('<textarea name="wmsg"','<textarea name="wmsg" required maxlength="2000" aria-label="Tilagingiz"');
  html=html.replace('id="yg-wish-confirm"','id="yg-wish-confirm" role="status" aria-live="polite"');
  html += '<script src="source/events.js"></script>\n<script src="source/wishes.js"></script>\n<script src="source/wish-close.js"></script>\n<script src="source/motion.js"></script>\n<script src="ui-copy.js"></script>\n<script src="bridge.js"></script>\n</body>\n</html>\n';
  write('index.html',html);
  const assets=[];
  for(const name of fs.readdirSync(path.join(path.dirname(capture),'yomgir-img'))) {
    const data=fs.readFileSync(path.join(path.dirname(capture),'yomgir-img',name));write('yomgir-img/'+name,data);assets.push({file:'yomgir-img/'+name,bytes:data.length,sha256:sha(data)});
  }
  const fontPath=path.join(archive,'Web invitations/fonts.googleapis.com/css2__e3ea24707e214f2c');
  let fontsCss=fs.readFileSync(fontPath,'utf8');const fonts=[];
  for(const url of new Set([...fontsCss.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))) {
    const file='fonts/'+url.split('/').pop(), local=path.join(archive,'Web invitations',new URL(url).hostname,new URL(url).pathname);
    let data,method;
    if(fs.existsSync(local)){data=fs.readFileSync(local);method='archive';}
    else if(fs.existsSync(path.join(out,file))){data=fs.readFileSync(path.join(out,file));method='exact-source-url';}
    else {const r=await fetch(url);if(!r.ok)throw Error(url+': '+r.status);data=Buffer.from(await r.arrayBuffer());method='exact-source-url';}
    write(file,data);fontsCss=fontsCss.split(url).join('./'+path.basename(file));fonts.push({file,url,method,bytes:data.length,sha256:sha(data)});
  }
  write('fonts/fonts.css',fontsCss);
  // Original EN/RU interface copy only. Personal example fields are excluded.
  const dict=Function('return ('+js.match(/var DICT = (\{[\s\S]*?\n  \});/)[1]+')')();
  const lat={};for(const m of raw.slice(0,raw.indexOf('<script>')).matchAll(/<[^>]+data-i18n="([^"]+)"[^>]*>([^<]*)<\//g)) lat[m[1]]=m[2];
  for(const key of Object.keys(dict)) if(/_default$|^ev\d|^inv_request/.test(key)){delete dict[key];delete lat[key];}
  const en=Object.fromEntries(Object.entries(dict).map(([k,v])=>[k,v[0]])),ru=Object.fromEntries(Object.entries(dict).map(([k,v])=>[k,v[1]]));
  write('source/interface-copy.json',JSON.stringify({'uz-Latn':lat,en,ru},null,2)+'\n');
  write('dependencies.json',JSON.stringify({source:path.relative(root,capture).replaceAll('\\','/'),sourceSha256:sha(bytes),sourceBytes:bytes.length,cssSha256:sha(css),originalScriptSha256:sha(js),motionSha256:sha(motion),wishCloseSha256:sha(fs.readFileSync(closePath)),fontCssSource:path.relative(root,fontPath).replaceAll('\\','/'),fontCssSha256:sha(fs.readFileSync(fontPath)),assets,fonts,excluded:['Cloudflare analytics beacon','provider customizer/query/localStorage demo data','provider guestbook API and persistence','provider gesture handshake'],missing:[]},null,2)+'\n');
  console.log(JSON.stringify({assets:assets.length,fonts:fonts.length,sourceSha256:sha(bytes)}));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
