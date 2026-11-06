const http = require('http'), fs = require('fs'), path = require('path'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '../../../../..'), assets = path.join(root,'apps/web/public'), template = '/templates/wedivo-taman-rahasia/';
const output = path.join(root,'apps/web/src/templates/wedivo-taman-rahasia/evidence');fs.mkdirSync(output,{recursive:true});
process.env.TSX_TSCONFIG_PATH = path.join(root,'apps/web/tsconfig.json');
require.extensions['.css'] = module => { module.exports = {}; };
require('tsx/cjs');
const { createTemplatePreviewSample } = require(path.join(root,'apps/web/src/modules/catalog/preview-sample.ts'));
const { makeTamanPayload } = require(path.join(__dirname,'adapter.ts'));
const payload = makeTamanPayload(createTemplatePreviewSample('wedivo-taman-rahasia'),'uz-Latn','',{invitationId:'qa-taman',preview:true,sampleWishes:true});
const dep = JSON.parse(fs.readFileSync(path.join(assets,template,'dependencies.json'),'utf8'));
let baseline = fs.readFileSync(path.join(root,dep.capture),'utf8');
baseline = baseline.replace(/<script[^>]*id="wedivo-parameters"[^>]*>[\s\S]*?<\/script>/,'').replace(/<script>\(function \(\) \{[\s\S]*?__WEDIVO_PREVIEW_STUB__[\s\S]*?<\/script>/,'');
baseline = baseline.replace(/@import\s+url\([^)]*\)\s*;/g,'').replace('</head>',`<link rel="stylesheet" href="${template}assets/fonts.css"></head>`);
for(const asset of dep.assets) baseline=baseline.split(asset.url).join(template+asset.file);
baseline=baseline.replace(/src="https:[^"]+"/g,'').replace(/AIza[\w-]+/g,'');
let posts=[], failApi=false;
const server = http.createServer((req,res)=>{
 if(req.url.startsWith('/api/')) { if(req.method==='POST') { let body='';req.on('data',d=>body+=d);req.on('end',()=>{posts.push({url:req.url,body:JSON.parse(body)});res.writeHead(failApi ? 503 : 201,{'Content-Type':'application/json'});res.end('{"ok":true}');}); }else { res.writeHead(200,{'Content-Type':'application/json'});res.end('{"wishes":[{"name":"Approved guest","message":"Approved wish"}]}'); } return; }
 if(req.url==='/reference') {res.setHeader('Content-Type','text/html');res.end(baseline);return;}
 const file=path.join(assets,decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(assets)||!fs.existsSync(file)) {res.writeHead(404);res.end();return;}
 const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json','.jpg':'image/jpeg','.webp':'image/webp','.ttf':'font/ttf'})[ext]||'application/octet-stream');res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin = `http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const results=[];browser.on('disconnected',()=>console.log('browser disconnected'));
 try {
  if (!process.env.TAMAN_COVER_ONLY && !process.env.TAMAN_SKIP_NORMAL) for(const viewport of [{width:390,height:844},{width:1440,height:1000}]) {
   const context=await browser.newContext({viewport}); await context.route('https://**',route=>route.abort());
   const page=await context.newPage(), errors=[], failed=[];console.log('viewport',viewport.width);
   page.setDefaultTimeout(60000);page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.message);});page.on('response',r=>{if(r.status()>=400)failed.push([r.status(),new URL(r.url()).pathname]);});
   console.log('reference loading');await page.goto(origin+'/reference',{waitUntil:'domcontentloaded'});await page.waitForTimeout(500);
   await page.screenshot({path:path.join(output,`reference-${viewport.width}-cover.png`)});
   await page.locator('#gate-open').press('Enter');await page.waitForFunction(()=>document.body.classList.contains('is-open'),{},{timeout:60000});await page.waitForTimeout(500);
   await page.screenshot({path:path.join(output,`reference-${viewport.width}-opened.png`)});
   await page.goto(origin+template+'index.html',{waitUntil:'domcontentloaded'});
   await page.evaluate(message=>{window.name=JSON.stringify(message);window.postMessage(message,location.origin);},payload);
   await page.waitForSelector('html.data-ready');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(300);
   await page.locator('#taman-languages').evaluate(n=>n.hidden=true);
   await page.screenshot({path:path.join(output,`app-${viewport.width}-cover.png`)});
   
   await page.locator('#gate-open').press('Enter'); await page.waitForFunction(()=>document.body.classList.contains('is-open'),{},{timeout:60000});await page.waitForTimeout(500);
   console.log('app opened',viewport.width);await page.screenshot({path:path.join(output,`app-${viewport.width}-opened.png`)});
   assert.equal(await page.locator('#rsvp-pax').count(),0);
   assert.equal(await page.locator('.rd-item').count(),payload.payload.data.program.length);
   console.log('app opening captured');await page.locator('#packet-bride').click();assert(await page.locator('#packet-bride.is-flipped').count());
   assert.equal(await page.locator('#sec-gifts').isVisible(),false);
   assert.equal(await page.locator('#sec-gallery').isVisible(),false);
   assert.equal(await page.locator('#rsvp-submit').isDisabled(),true);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   results.push({viewport,errors,failed,normalOpening:true,seedFlip:true,program:await page.locator('.rd-item').count()});
   assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
   await context.close();
  }
  if (!process.env.TAMAN_COVER_ONLY && !process.env.TAMAN_SKIP_LOCALES) for(const locale of ['uz-Latn','uz-Cyrl','en','ru']) {
   const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});await context.route('https://**',r=>r.abort());
   await context.addInitScript(()=>{const paused=new WeakMap();Object.defineProperty(HTMLMediaElement.prototype,'paused',{get(){return paused.get(this)!==false;},configurable:true});HTMLMediaElement.prototype.play=function(){paused.set(this,false);window.__qaMediaPlays=(window.__qaMediaPlays||0)+1;this.dispatchEvent(new Event('play'));return Promise.resolve();};HTMLMediaElement.prototype.pause=function(){paused.set(this,true);this.dispatchEvent(new Event('pause'));};});
   const page=await context.newPage(), errors=[];console.log('locale',locale); page.setDefaultTimeout(60000);page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.message);});
   const message=structuredClone(payload);message.payload.locale=locale;message.payload.data=message.payload.variants[locale];message.payload.preview=false;Object.values(message.payload.variants).forEach(data=>data.music={enabled:true,url:'/qa-audio.mp3'});
   message.payload.data.gallery=[{id:'qa-upload-1',src:template+'assets/art-01.jpg',alt:'Authored image',caption:'Authored caption'},{id:'qa-upload-2',src:template+'assets/art-02.jpg',alt:'Second image',caption:'Second caption'}];
   message.payload.data.story=Array.from({length:7},(_,i)=>({id:`chapter-${i}`,title:`Chapter ${i+1}`,text:'Authored story'}));
   message.payload.data.groom='Javohir Abdulaziz Muhammadamin';message.payload.data.bride='Madina Xadichabonu Nurmuhammad';
   await page.goto(origin+template+'index.html',{waitUntil:'domcontentloaded'});await page.evaluate(m=>{window.name=JSON.stringify(m);window.postMessage(m,location.origin);},message);await page.waitForSelector('html.data-ready');
   await page.waitForFunction(()=>document.getElementById('music-btn').getAttribute('aria-pressed')==='true');const playCount=await page.evaluate(()=>window.__qaMediaPlays);await page.locator('#music-btn').click();assert(await page.evaluate(()=>document.getElementById('bg-music').paused));console.log('bound',locale);assert.equal(await page.locator('html').getAttribute('lang'),locale);assert.equal(await page.locator('.story-card').count(),7);
   await page.locator('#gate-open').press('Enter');await page.waitForFunction(()=>document.body.classList.contains('is-open'),{},{timeout:60000});
   assert.equal(await page.evaluate(()=>window.__qaMediaPlays),playCount);console.log('opened',locale);await page.locator('#secret-stone').click();assert.equal(await page.locator('#secret-stone').getAttribute('aria-expanded'),'true');
   await page.locator('#rd-item-3').click(); assert(await page.locator('#rd-item-3.is-active').count());
   await page.locator('#pane-1').click();await page.waitForSelector('#viewer.is-open');await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'viewer-prev');await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'viewer-close');assert.equal(await page.locator('#viewer-cap').textContent(),'Authored caption');
   await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#viewer-cap').textContent(),'Second caption');await page.keyboard.press('Escape');assert.equal(await page.locator('#viewer').getAttribute('aria-hidden'),'true');
   console.log('gallery passed',locale);await page.locator('#rsvp-name').fill('QA guest');await page.locator('#rsvp-yes').click();await page.locator('#rsvp-submit').click();await page.waitForSelector('#rsvp-form.is-submitted');
   assert.equal(posts.at(-1).body.partySize,1);assert.equal(posts.at(-1).body.status,'yes');
   await page.locator('#wish-name').fill('QA guest');await page.locator('#wish-message').fill('A private pending wish');const wishResponse=page.waitForResponse(r=>r.url().endsWith('/wishes')&&r.request().method()==='POST');await page.locator('#wish-submit').click();await wishResponse;await page.waitForFunction(()=>document.getElementById('wish-form').classList.contains('is-submitted'));assert.equal(posts.at(-1).body.message,'A private pending wish');
   assert((await page.locator('#wish-list').textContent()).includes('Approved wish'));assert(!(await page.locator('#wish-list').textContent()).includes('A private pending wish'));
   await page.locator('#rsvp-edit').click();await page.locator('#rsvp-no').click();await page.locator('#rsvp-submit').click();await page.waitForSelector('#rsvp-form.is-submitted');assert.equal(posts.at(-1).body.partySize,0);
   await page.locator('#rsvp-edit').click();failApi=true;const failure=page.waitForResponse(r=>r.url().endsWith('/rsvp')&&r.request().method()==='POST'&&r.status()===503);await page.locator('#rsvp-submit').click();await failure;await page.waitForFunction(()=>document.querySelector('#rsvp-form .taman-feedback')?.textContent);assert.equal(await page.locator('#rsvp-form.is-submitted').count(),0);assert(await page.locator('#rsvp-form .taman-feedback').textContent());failApi=false;
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const nextLocale=locale==='en'?'uz-Latn':'en';await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator(`#taman-languages button[lang="${nextLocale}"]`).click()]);await page.waitForFunction(l=>document.documentElement.lang===l&&document.documentElement.classList.contains('data-ready'),nextLocale);await page.waitForFunction(()=>document.body.classList.contains('is-open'));assert(await page.evaluate(()=>document.getElementById('bg-music').paused));await page.locator('#music-btn').click();await page.waitForFunction(()=>!document.getElementById('bg-music').paused);
   results.push({locale,reducedOpening:true,gallery:true,storyCount:7,secret:true,rsvp:true,wishPending:true,failureDoesNotClaimSuccess:true,galleryKeyboardTrap:true,localeSwitchKeepsOpen:true,musicPauseRetained:true,errors});assert.deepEqual(errors,[]);
   await context.close();
  }
  const coverContext=await browser.newContext({viewport:{width:450,height:800},reducedMotion:'reduce'});await coverContext.route('https://**',r=>r.abort());
  const cover=await coverContext.newPage();await cover.goto(origin+template+'index.html',{waitUntil:'domcontentloaded'});await cover.evaluate(m=>{window.name=JSON.stringify(m);window.postMessage(m,location.origin);},payload);await cover.waitForSelector('html.data-ready');await cover.evaluate(()=>document.fonts.ready);const visibleCopy=await cover.evaluate(()=>{const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),items=[];let node;while(node=walk.nextNode()){const el=node.parentElement;if(!el||el.closest('script,style,template,[hidden]')||!node.textContent.trim()||!el.getClientRects().length)continue;items.push({id:el.id,text:node.textContent.trim()});}return items;});fs.writeFileSync(path.join(output,'uz-default-text.json'),JSON.stringify(visibleCopy,null,2));
  assert(!visibleCopy.some(item=>/\b(Buka|ditemukan|Pukul|Prolog|Epilog|Hari|Menit|Detik|Kepada|Undangan|Pernikahan|Kehadiran|Berhalangan|Mempelai|Varietas|Putri|Putra|Siram|Mekar|Cahaya|Penuh)\b/.test(item.text)),'Default interface must contain no untranslated Indonesian copy');
  await cover.locator('#taman-languages').evaluate(n=>n.hidden=true);await cover.screenshot({path:path.join(assets,template,'preview.png')});await coverContext.close();
  fs.writeFileSync(path.join(output,process.env.TAMAN_COVER_ONLY ? 'browser-cover-results.json' : process.env.TAMAN_SKIP_LOCALES ? 'browser-normal-results.json' : process.env.TAMAN_SKIP_NORMAL ? 'browser-locale-results.json' : 'browser-results.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
 }catch(e) {fs.writeFileSync(path.join(output,'browser-partial-results.json'),JSON.stringify({results,error:e.message},null,2));console.error('BROWSER CHECK FAILURE',e);throw e;}finally {await Promise.race([browser.close(),new Promise(r=>setTimeout(r,10000))]);server.closeAllConnections();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
