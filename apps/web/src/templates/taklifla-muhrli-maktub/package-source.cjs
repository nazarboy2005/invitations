// Rebuild only this private package. Never modifies the reference archive.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const root = path.resolve(__dirname, '../../../../..');
const archive = path.join(root, 'Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Taklifla');
const capture = path.join(archive, 'Web invitations/taklifla.uz/templates/envelope__3be3ae79bcbb3487.html');
const out = path.join(root, 'apps/web/public/templates/taklifla-muhrli-maktub');
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
async function main() {
  fs.mkdirSync(path.join(out,'source'),{recursive:true});
  fs.mkdirSync(path.join(out,'fonts'),{recursive:true});
  const bytes = fs.readFileSync(capture), raw = bytes.toString('utf8');
  const css = raw.match(/<style>([\s\S]*?)<\/style>/)[1];
  fs.writeFileSync(path.join(out,'source/template.css'),css);
  const script = raw.match(/<script>([\s\S]*?)<\/script>/)[1];
  const start = script.indexOf('  /* ── sealed-envelope stage:');
  const end = script.indexOf('  /* ── guestbook (wishes)');
  let motion = script.slice(start,end);
  motion = motion.replace('    function applyScroll(y) {','    function applyScroll(y) {\n      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) y = 0;');
  fs.writeFileSync(path.join(out,'source/motion.js'),`// Extracted source opening/scroll/particles/reveal/name-fitting engine.\nwindow.startEnvelopeMotion = function (tryMusic) {\n  var $ = function(s) { return document.querySelector(s); };\n  var hide = function(el) { if(el) el.style.display = 'none'; };\n${motion}\n};\n`);
  // Source guestbook card markup is reused by the bridge; source demo storage/API is excluded.
  const cards = script.slice(script.indexOf('    var rots ='),script.indexOf('    document.addEventListener("taklifla:langchange", function () { render(lastItems);'));
  fs.writeFileSync(path.join(out,'source/wish-cards.js'),`window.renderEnvelopeWishes = function(items,locale) {\n  var list=document.querySelector('#env-wish-list'),empty=document.querySelector('#env-wish-empty');\n  var esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));\n  var norm = () => locale;\n  var MON = {};\n${cards.replace(/    function fmtShort\(ts, lang\) \{[\s\S]*?\n    \}/,`    function fmtShort(ts,lang) { var d=new Date(ts); return isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat(lang === 'uz-Latn' ? 'uz-UZ' : lang === 'uz-Cyrl' ? 'uz-Cyrl-UZ' : lang,{day:'numeric',month:'short'}).format(d); }`).replace('w.created_at','w.submittedAt').replace('w.created_at','w.submittedAt')}\n  render(items);\n};\n`);
  // Preserve closure panel styling/ornament, replacing provider policy wiring separately.
  const closurePath = path.join(path.dirname(capture),'_wish-close.js');
  const closure = fs.readFileSync(closurePath,'utf8');
  fs.writeFileSync(path.join(out,'source/wish-close.js'), 'window.buildEnvelopeClosedPanel = ' + closure.slice(closure.indexOf('function buildPanel('),closure.indexOf('  function readAccent()')).trim() + ';\n');
  let html = raw.slice(0,raw.indexOf('<script>'));
  html = html.replace(/<link[^>]+(?:fonts\.googleapis|fonts\.gstatic)[^>]*>\s*/g,'');
  html = html.replace(/<style>[\s\S]*?<\/style>/,'<link rel="stylesheet" href="fonts/fonts.css">\n<link rel="stylesheet" href="source/template.css">\n<link rel="stylesheet" href="platform.css">');
  html = html.replace('<title>Envelope — Taklifnoma</title>','<title>Muhrli Maktub — Taklifnoma</title>');
  // Clear all source personal/example content, including hard-coded translations.
  const ids = ['env-monogram','env-name1','env-name2','env-foot-n1','env-foot-n2','env-hero-date','env-hero-venueshort','env-inv-body','env-venue-name','env-venue-addr','env-dress-text','env-phone','env-flowers','env-foot-year'];
  for (const id of ids) html = html.replace(new RegExp(`(<[^>]+id="${id}"[^>]*>)[\\s\\S]*?(<\\/[^>]+>)`), '$1$2');
  html = html.replace(/(<div class="env-datetime"[^>]*>)[\s\S]*?<\/div>/g,'$1</div>');
  html = html.replace(/(<div id="env-prog"[^>]*>)[\s\S]*?(\n        <\/div>\n      <\/div>\n    <\/section>)/,'$1$2');
  html = html.replace(/href="(?:https:\/\/(?:maps\.google|yandex|t\.me)[^"]*|tel:[^"]*)"/g,'href="#"');
  html = html.replace('<img src="envelope-img/05-venue.webp"','<img id="env-venue-photo" src="envelope-img/05-venue.webp"');
  html = html.replace('<div aria-hidden="true" style="display:flex; justify-content:center; gap:10px; margin-top:12px;">','<div id="env-dress-colors" style="display:flex; justify-content:center; gap:10px; margin-top:12px;">');
  html = html.replace(/(<div id="env-dress-colors"[^>]*>)[\s\S]*?(\n            <\/div>)/,'$1$2');
  html = html.replace('role="button" aria-label="Taklifnomani ochish"','role="button" tabindex="0" aria-label="Taklifnomani ochish"');
  html = html.replace('<div class="env-lang"','<div class="env-lang"').replace('<button type="button" data-lang="en">','<button type="button" data-lang="uz-Cyrl">УЗ</button>\n    <button type="button" data-lang="en">');
  html = html.replace('data-lang="uz"','data-lang="uz-Latn"');
  html += '<script src="source/motion.js"></script>\n<script src="source/wish-cards.js"></script>\n<script src="source/wish-close.js"></script>\n<script src="ui-copy.js"></script>\n<script src="bridge.js"></script>\n</body>\n</html>\n';
  fs.writeFileSync(path.join(out,'index.html'),html);
  const assets=[];
  fs.mkdirSync(path.join(out,'envelope-img'),{recursive:true});
  for(const file of fs.readdirSync(path.join(path.dirname(capture),'envelope-img'))) {
    const data=fs.readFileSync(path.join(path.dirname(capture),'envelope-img',file));
    fs.writeFileSync(path.join(out,'envelope-img',file),data); assets.push({file:'envelope-img/'+file,sha256:hash(data),bytes:data.length});
  }
  const fontCssPath = path.join(archive,'Web invitations/fonts.googleapis.com/css2__43839d8b25dcf858');
  let fontCss=fs.readFileSync(fontCssPath,'utf8');
  const fonts=[];
  for (const url of [...new Set([...fontCss.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))]) {
    const file='fonts/'+url.split('/').pop();
    const local=path.join(archive,'Web invitations',new URL(url).hostname,new URL(url).pathname);
    let data,method;
    if(fs.existsSync(local)){data=fs.readFileSync(local);method='archive';}
    else if(fs.existsSync(path.join(out,file))){data=fs.readFileSync(path.join(out,file));method='exact-source-url';}
    else {const response=await fetch(url);if(!response.ok)throw Error(url+': '+response.status);data=Buffer.from(await response.arrayBuffer());method='exact-source-url';}
    fs.writeFileSync(path.join(out,file),data);fontCss=fontCss.split(url).join('./'+path.basename(file));
    fonts.push({url,file,method,sha256:hash(data),bytes:data.length});
  }
  fs.writeFileSync(path.join(out,'fonts/fonts.css'),fontCss);
  // Derive the source built-in copy; authored personal fields are always adapter-bound.
  const dict=Function('return ('+script.match(/var DICT = (\{[\s\S]*?\n  \});/)[1]+')')();
  const defaults={};
  for(const m of raw.slice(0,raw.indexOf('<script>')).matchAll(/<[^>]+data-i18n="([^"]+)"[^>]*>([^<]*)<\//g)) defaults[m[1]]=m[2].replace(/&amp;/g,'&');
  for(const k of ['monogram_default','inv_body_default','venue_name_default','venue_addr_default','dress_text_default','prog1_title','prog2_title','prog3_title','prog4_title']){delete dict[k];delete defaults[k];}
  const lat={...defaults,hero_kicker:'To‘y taklifnomasi',dress_kicker:'Libos talabi',wish_thanks:'Rahmat! Tilagingiz egasi tasdiqlagach ko‘rinadi.',closed_title:'Daftar yopildi',closed_heading:'Bayram o‘tdi — rahmat',closed_body:'Yangi tilaklarni qabul qilish to‘xtatildi. Mehmonlar qoldirgan so‘zlar esdalik sifatida saqlanadi.',ph_name:'Ismingiz',ph_msg:'Kelin-kuyovga tilagingiz…',preview:'Bu oldindan ko‘rish. Tilak yuborilmaydi.',error:'Tilak yuborilmadi. Qayta urinib ko‘ring.',load_error:'Tilaklar yuklanmadi. Qayta ochib ko‘ring.',music:'Musiqa',language:'Til',sending:'Yuborilmoqda…'};
  const en=Object.fromEntries(Object.entries(dict).map(([k,v])=>[k,v[0]])),ru=Object.fromEntries(Object.entries(dict).map(([k,v])=>[k,v[1]]));
  Object.assign(en,{ph_name:'Your name',ph_msg:'Your wish for the couple…',wish_thanks:'Thank you! Your wish will appear after approval.',closed_title:'Guest book closed',closed_heading:'Thank you for celebrating',closed_body:'New wishes are closed. Guest messages remain as keepsakes.',preview:'Preview only. No wish was sent.',error:'Your wish was not sent. Please try again.',load_error:'Wishes could not be loaded. Please reopen.',music:'Music',language:'Language',sending:'Sending…'});
  Object.assign(ru,{ph_name:'Ваше имя',ph_msg:'Ваше пожелание молодожёнам…',wish_thanks:'Спасибо! Пожелание появится после одобрения.',closed_title:'Книга закрыта',closed_heading:'Спасибо за этот праздник',closed_body:'Новые пожелания больше не принимаются. Слова гостей остаются на память.',preview:'Предпросмотр. Пожелание не отправлено.',error:'Пожелание не отправлено. Повторите попытку.',load_error:'Не удалось загрузить пожелания. Откройте снова.',music:'Музыка',language:'Язык',sending:'Отправка…'});
  const cyr=s=>s.replace(/o[‘’ʻʼ']/gi,m=>m[0]==='O'?'Ў':'ў').replace(/g[‘’ʻʼ']/gi,m=>m[0]==='G'?'Ғ':'ғ').replace(/sh/gi,m=>m[0]==='S'?'Ш':'ш').replace(/ch/gi,m=>m[0]==='C'?'Ч':'ч').replace(/yo/gi,m=>m[0]==='Y'?'Ё':'ё').replace(/yu/gi,m=>m[0]==='Y'?'Ю':'ю').replace(/ya/gi,m=>m[0]==='Y'?'Я':'я').replace(/[a-z]/gi,c=>{const a='abdefghijklmnopqrstuvxyz',b='абдефгҳижклмнопқрстувхйз';const v=b[a.indexOf(c.toLowerCase())]||c;return c===c.toUpperCase()?v.toUpperCase():v;});
  const cy=Object.fromEntries(Object.entries(lat).map(([k,v])=>[k,cyr(v)]));
  fs.writeFileSync(path.join(out,'ui-copy.js'),'window.ENVELOPE_COPY = '+JSON.stringify({'uz-Latn':lat,'uz-Cyrl':cy,en,ru},null,2)+';\n');
  const manifest={capture:path.relative(root,capture).replaceAll('\\','/'),captureSha256:hash(bytes),sourceCssSha256:hash(css),originalScriptSha256:hash(script),motionOriginalRange:{start,end},wishCloseSha256:hash(fs.readFileSync(closurePath)),fontCssCapture:path.relative(root,fontCssPath).replaceAll('\\','/'),fontCssSha256:hash(fs.readFileSync(fontCssPath)),assets,fonts};
  fs.writeFileSync(path.join(out,'dependencies.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify({assets:assets.length,fonts:fonts.length,captureSha256:manifest.captureSha256}));
}
main().catch(e=>{console.error(e);process.exitCode=1});
