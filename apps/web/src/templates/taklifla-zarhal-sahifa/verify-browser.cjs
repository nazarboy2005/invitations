/* Standalone private-package QA; no registry, Next route, DB or archive mutation. */
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.ZARHAL_PLAYWRIGHT || 'C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = process.cwd();
const modulePath = path.join(root, 'apps/web/src/templates/taklifla-zarhal-sahifa');
const publicPath = path.join(root, 'apps/web/public');
const packagePath = path.join(publicPath, 'templates/taklifla-zarhal-sahifa');
const evidence = path.join(modulePath, 'evidence'); fs.mkdirSync(evidence, { recursive:true });
const fixtures = JSON.parse(fs.readFileSync(path.join(root,'.tmp-zarhal-fixtures.json'),'utf8'));
const provenance = JSON.parse(fs.readFileSync(path.join(packagePath,'provenance.json'),'utf8'));
const reference = fs.readFileSync(path.join(root,provenance.source),'utf8');
const fontUrl = reference.match(/<link href="(https:\/\/fonts.googleapis.com[^"]+)/)[1];
let referenceLocal = reference.replace(fontUrl,'/templates/taklifla-zarhal-sahifa/source/fonts.css');
for(const item of provenance.dependencies) referenceLocal = referenceLocal.split(item.url).join('/templates/taklifla-zarhal-sahifa/'+item.file);
// In-memory dependency resolution only; reference source bytes remain untouched.
referenceLocal = referenceLocal.replace(/<script[^>]*src="(?:https:\/\/static.cloudflareinsights.com|\/templates\/_wish-close.js)[^>]*><\/script>/g,'');
let requests = [], failPost = false;
const server = http.createServer((req,res) => {
  const url = new URL(req.url,'http://localhost');
  if(url.pathname === '/__reference') {res.setHeader('Content-Type','text/html; charset=utf-8');return res.end(referenceLocal);}
  if(url.pathname === '/__harness') {
    res.setHeader('Content-Type','text/html; charset=utf-8');
    return res.end(`<!doctype html><html><body style="margin:0"><iframe id="frame" style="border:0;width:100vw;height:100vh;display:block" allow="autoplay" src="/templates/taklifla-zarhal-sahifa/index.html"></iframe><script>window.fixtures=${JSON.stringify(fixtures).replaceAll('<','\\u003c')};window.send=(name)=>{document.getElementById('frame').contentWindow.postMessage(fixtures[name],location.origin)};window.addEventListener('message',event=>{if(event.data.type==='zarhal-sahifa:ready')send(new URLSearchParams(location.search).get('fixture')||'uz-Latn')});</script></body></html>`);
  }
  if(url.pathname.startsWith('/api/public/')) {
    let body=''; req.on('data',chunk=>body+=chunk); req.on('end',()=>{
      requests.push({method:req.method,path:url.pathname,body:body?JSON.parse(body):null});
      res.setHeader('Content-Type','application/json');
      if(req.method==='GET') return res.end(JSON.stringify({wishes:[{id:'approved',name:'Tasdiqlangan',message:'Ezgu tilak',submittedAt:'2026-10-26T12:00:00Z'}]}));
      res.statusCode=failPost?503:201;res.end(JSON.stringify({ok:!failPost}));
    });return;
  }
  if(url.pathname==='/qa-tone.wav') {
    const samples=44100*2, buf=Buffer.alloc(44+samples*2);
    buf.write('RIFF');buf.writeUInt32LE(buf.length-8,4);buf.write('WAVEfmt ',8);buf.writeUInt32LE(16,16);buf.writeUInt16LE(1,20);buf.writeUInt16LE(1,22);buf.writeUInt32LE(44100,24);buf.writeUInt32LE(88200,28);buf.writeUInt16LE(2,32);buf.writeUInt16LE(16,34);buf.write('data',36);buf.writeUInt32LE(samples*2,40);
    res.setHeader('Content-Type','audio/wav');return res.end(buf);
  }
  const target=path.resolve(publicPath,'.'+decodeURIComponent(url.pathname));
  if(!target.startsWith(publicPath+path.sep)||!fs.existsSync(target)||fs.statSync(target).isDirectory()){res.statusCode=404;return res.end('Missing');}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.avif':'image/avif','.woff2':'font/woff2','.webp':'image/webp'})[path.extname(target)]||'application/octet-stream');res.end(fs.readFileSync(target));
});
async function main(){
 await new Promise(resolve=>server.listen(4317,'127.0.0.1',resolve));
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const results={browser:browser.version(),sourceSha256:provenance.sourceSha256,cases:[],errors:[],httpFailures:[],serviceMode:'HTTP stub validates bridge behavior only; no database/service persistence claim'};
 try {
  for(const width of [390,1440]) {
   const context=await browser.newContext({viewport:{width,height:844},deviceScaleFactor:1});
   const page=await context.newPage();
   page.on('pageerror',error=>results.errors.push(String(error)));
   page.on('response',r=>{if(r.status()>=400)results.httpFailures.push({url:r.url(),status:r.status()});});
   await page.goto('http://127.0.0.1:4317/__reference?lang=uz');await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:path.join(evidence,`reference-${width}-opening.webp`)});
   await page.locator('.details').scrollIntoViewIfNeeded();await page.waitForTimeout(950);
   await page.screenshot({path:path.join(evidence,`reference-${width}-details.webp`)});
   await page.goto('http://127.0.0.1:4317/__harness');
   const frame=page.frameLocator('#frame');await frame.locator('body[data-bound]').waitFor();
   await frame.locator('body').evaluate(()=>document.fonts.ready);
   await page.screenshot({path:path.join(evidence,`app-${width}-opening.webp`)});
   const opening=await frame.locator('.hero').evaluate(el=>({names:[...el.querySelectorAll('.hero-names')].map(x=>x.textContent),width:el.getBoundingClientRect().width,overflow:document.documentElement.scrollWidth>innerWidth}));
   assert.equal(opening.overflow,false);assert.deepEqual(opening.names,['Javohir','Madina']);
   await frame.locator('.details').scrollIntoViewIfNeeded();await page.waitForTimeout(950);
   await page.screenshot({path:path.join(evidence,`app-${width}-details.webp`)});
   assert.equal(await frame.locator('.detail-photos img').count(),3);
   await frame.locator('#wishes-section').scrollIntoViewIfNeeded();await page.waitForTimeout(950);
   await page.screenshot({path:path.join(evidence,`app-${width}-wishes.webp`)});
   assert.equal(await frame.locator('.wish').count(),3);
   const before=requests.length;await frame.locator('#wish-name').fill('Mehmon');await frame.locator('#wish-text').fill('Namuna');await frame.locator('#wish-submit').click();assert.equal(requests.length,before);
   for(const locale of ['uz-Cyrl','en','ru']){
    await page.evaluate(locale=>send(locale),locale);
    await frame.locator('html').evaluate((el,locale)=>new Promise((resolve,reject)=>{
     const expected=locale==='uz-Latn'?'uz':locale;let attempts=0;
     const check=()=>el.lang===expected?resolve():attempts++>100?reject(new Error('Wrong locale '+el.lang)):setTimeout(check,20);
     check();
    }),locale);
    assert.equal(await frame.locator('.wish').count(),3);
   }
   await frame.locator('.taklifla-lang-toggle').click();await frame.locator('[data-lang="uz-Latn"]').click();assert.equal(await frame.locator('html').getAttribute('lang'),'uz');
   await page.evaluate(()=>send('long'));await frame.locator('.hero').scrollIntoViewIfNeeded();
   assert.equal(await frame.locator('html').evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:path.join(evidence,`app-${width}-long.webp`)});
   assert.ok((await frame.locator('.invite-quote').textContent()).includes('Aziz mehmon'));
   await page.evaluate(()=>send('repeat'));await page.waitForTimeout(50);assert.equal(await frame.locator('.detail-photos img').count(),7);
   await page.evaluate(()=>send('empty'));await page.waitForTimeout(50);assert.equal(await frame.locator('.detail-photos img').count(),0);assert.equal(await frame.locator('.countdown').isVisible(),false);assert.equal(await frame.locator('.details').isVisible(),false);
   assert.equal(await frame.locator('.map-section').isVisible(),false);assert.equal(await frame.locator('#zarhal-music').count(),0);
   await context.close();
   results.cases.push({viewport:{width,height:844},opening,checks:['source/app opening and details','scroll reveal','preview wishes no-send','four locales and selector','personal greeting','long names no horizontal overflow','seven stable-ID photos','empty optional sections','legacy map remains hidden','music disabled']});
  }
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const page=await context.newPage();
  await page.goto('http://127.0.0.1:4317/__harness');const frame=page.frameLocator('#frame');await frame.locator('body[data-bound]').waitFor();
  const motion=await frame.locator('.reveal').first().evaluate(el=>({opacity:getComputedStyle(el).opacity,transition:getComputedStyle(el).transitionDuration,animation:getComputedStyle(document.querySelector('.scroll-arrow')).animationName}));
  assert.equal(motion.opacity,'1');assert.equal(motion.transition,'0s');assert.equal(motion.animation,'none');
  await page.screenshot({path:path.join(evidence,'app-390-reduced.webp')});results.cases.push({reducedMotion:motion});
  await page.evaluate(()=>send('public'));await page.waitForTimeout(100);assert.equal(await frame.locator('.wish').count(),1);
  await frame.locator('#wish-submit').scrollIntoViewIfNeeded();await frame.locator('#wish-submit').click();assert.ok(await frame.locator('#wish-status').textContent());
  await frame.locator('#wish-name').fill('Mehmon');await frame.locator('#wish-text').fill('<b>Yangi tilak</b>');
  failPost=true;await frame.locator('#wish-submit').click();await page.waitForTimeout(100);assert.match(await frame.locator('#wish-status').textContent(),/yuborilmadi/);assert.equal(await frame.locator('#wish-text').inputValue(),'<b>Yangi tilak</b>');
  failPost=false;await frame.locator('#wish-submit').click();await page.waitForTimeout(100);assert.match(await frame.locator('#wish-status').textContent(),/tasdiqlagach/);assert.equal(await frame.locator('.wish').count(),1);
  assert.equal(requests.find(x=>x.method==='POST').body.guestToken,'qa-token');results.cases.push({wishes:'required input, real HTTP failure retains text, success acknowledgment waits for ok, pending not rendered, guest token forwarded',requests});
  await page.evaluate(()=>send('music'));await page.waitForTimeout(100);assert.equal(await frame.locator('#zarhal-music').count(),1);
  await frame.locator('#zarhal-music').click();await page.waitForTimeout(100);
  let playing=await frame.locator('body').evaluate(()=>!window.__taklifla_audio__.paused);
  if(!playing){await frame.locator('#zarhal-music').click();await page.waitForTimeout(100);}
  assert.equal(await frame.locator('body').evaluate(()=>window.__taklifla_audio__.paused),false);
  await frame.locator('#zarhal-music').click();await frame.locator('.hero').click();assert.equal(await frame.locator('body').evaluate(()=>window.__taklifla_audio__.paused),true);
  results.cases.push({music:'enabled player, actual WAV playback, pause survives later page gesture; disabled player absent; browser audible autoplay remains policy-dependent'});
  await page.evaluate(()=>send('uz-Latn'));await frame.locator('.hero').scrollIntoViewIfNeeded();await page.evaluate(()=>document.querySelector('iframe').contentWindow.document.querySelector('.taklifla-lang-switch').style.visibility='hidden');
  const shot=await frame.locator('body').screenshot({type:'png'});
  // Cover is the actual source opening at portrait ratio, no injected controls.
  await frame.locator('.hero').screenshot({path:path.join(packagePath,'preview.webp')});
  results.cases.push({cover:'source .hero at 390×844, canonical sample, silent, source locale control excluded for artwork only'});
  await context.close();
  assert.deepEqual(results.errors,[]);assert.deepEqual(results.httpFailures,[]);
  fs.writeFileSync(path.join(evidence,'browser-results.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
 } finally {await browser.close();server.close();}
}
main().catch(error=>{console.error(error);server.close();process.exitCode=1;});
