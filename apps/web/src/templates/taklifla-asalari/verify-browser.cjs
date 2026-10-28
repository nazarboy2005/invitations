/* Local package harness. Mock API results below are transport checks, not live service QA. */
const http=require('node:http'), fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict');
const { chromium }=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=path.resolve(__dirname,'../../../../..'), assets=path.join(root,'apps/web/public'), base='/templates/taklifla-asalari/';
const {fixture,payload}=require('./verify.cjs');
const {createInvitation,LOCALES}=require('@taklifnoma/contracts');
const evidence=path.join(__dirname,'evidence');fs.mkdirSync(evidence,{recursive:true});
const dep=JSON.parse(fs.readFileSync(path.join(assets,base,'dependencies.json')));
let reference=fs.readFileSync(path.join(root,dep.capture),'utf8').replace(/<link[^>]+fonts[^>]+>/g,'').replace(/<script type="module"[\s\S]*?<\/script>/g,'').replace('</head>',`<link rel="stylesheet" href="${base}fonts/fonts.css"></head>`);
reference=reference.replaceAll('asalari-img/',base+'asalari-img/').replace(' src="assets/music.mp3"','');
let posts=[], fail=false;
const server=http.createServer((req,res)=>{
 if(req.url==='/favicon.ico'){res.writeHead(204);res.end();return;}
 if(req.url.startsWith('/reference')){res.setHeader('Content-Type','text/html');res.end(reference);return;}
 if(req.url==='/harness'){res.setHeader('Content-Type','text/html');res.end(`<style>body{margin:0}iframe{width:100%;height:100dvh;border:0}</style><iframe src="${base}index.html"></iframe>`);return;}
 if(req.url.startsWith('/api/')){res.setHeader('Content-Type','application/json');
   if(req.method==='POST'){let body='';req.on('data',d=>body+=d);req.on('end',()=>{posts.push(JSON.parse(body));res.writeHead(fail?503:201);res.end(JSON.stringify({ok:!fail}));});}
   else res.end(JSON.stringify({wishes:[{name:'Approved <img>',message:'Approved message <script>',submittedAt:'2026-10-26T10:00:00Z'}]}));return;
 }
 const file=path.resolve(assets,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(assets+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.woff2':'font/woff2','.webp':'image/webp'})[path.extname(file)] || 'text/plain');res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({channel:'chrome',headless:true});const results=[],diagnostics=[];
 try {
  for(const width of [360,390,1440]) for(const reduced of [false,true]){
   const context=await browser.newContext({viewport:{width,height:width===1440?900:844},reducedMotion:reduced?'reduce':'no-preference'});
   const page=await context.newPage();const errors=[],failed=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().includes('/api/'))failed.push([r.status(),r.url()]);});
   page.on('request',r=>{if(!r.url().startsWith(origin)&&!r.url().startsWith('data:'))diagnostics.push({external:r.url()});});
   await page.goto(origin+'/harness');const frame=page.frames()[1];await frame.waitForSelector('#openBtn',{state:'attached'});
   const send=async p=>{await page.evaluate(p=>document.querySelector('iframe').contentWindow.postMessage(p,location.origin),p);await frame.waitForFunction(()=>!document.body.hasAttribute('data-pending'));};
   const p=payload();await send(p);await frame.evaluate(()=>document.fonts.ready);
   if(width!==360)await page.screenshot({path:path.join(evidence,`app-${width}-${reduced?'reduced':'normal'}-opening.png`)});
   await frame.locator('#openBtn').click();await page.waitForTimeout(1100);
   assert.equal(await frame.locator('body.locked').count(),0);assert.equal(await frame.locator('.tl-item').count(),fixture().program.length);
   assert.equal(await frame.locator('.wish').count(),3);assert.equal(await frame.locator('.age-pill').isVisible(),false);assert.equal(await frame.locator('#musicBtn').isVisible(),false);
   const geometry=await frame.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,shellWidth:document.querySelector('.shell').clientWidth,animations:document.getAnimations().filter(a=>a.playState==='running').length,animationNames:document.getAnimations().filter(a=>a.playState==='running').map(a=>`${a.animationName}:${a.effect?.target?.className}`),reducedClass:document.body.classList.contains('reduce-motion'),heroTop:Math.round(document.querySelector('.hero').getBoundingClientRect().top)}));
   assert.ok(geometry.scrollWidth<=width+1);assert.equal(geometry.shellWidth,Math.min(430,width));if(reduced)assert.equal(geometry.animations,0,JSON.stringify(geometry));else assert.ok(geometry.animations>0);
   if(width!==360){await page.screenshot({path:path.join(evidence,`app-${width}-${reduced?'reduced':'normal'}-hero.png`)});}
   for(const locale of LOCALES){await frame.locator('.taklifla-lang-toggle').click();await frame.locator(`[data-lang="${locale}"]`).click();assert.equal(await frame.locator('html').getAttribute('lang'),locale);assert.equal(await frame.locator('.hero .name').innerText(),p.payload.variants[locale].child);}
   const priorPosts=posts.length;await frame.locator('#wName').fill('Preview guest');await frame.locator('#wMsg').fill('Preview wish');await frame.locator('#wishForm button').click();assert.equal(posts.length,priorPosts);assert.match(await frame.locator('.wish-status').innerText(),/образец/);
   const long=fixture();for(const l of LOCALES) long.content[l].people=['Gulbahor-Marguba Sayyidabonu'];await send(payload(long));
   const fit=await frame.locator('.hero .name').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,height:el.clientHeight}));assert.ok(fit.scroll<=fit.width+1);assert.ok(fit.height<844*.3);
   if(width===390&&!reduced)await page.screenshot({path:path.join(evidence,'long-name-390.png')});
   const blank=createInvitation('taklifla-asalari');blank.wishes.enabled=false;blank.startsAt='';blank.program=[];blank.content['uz-Latn'].venueName='';blank.content['uz-Latn'].address='';blank.content['uz-Latn'].landmark='';blank.music.enabled=false;blank.music.url='';await send(payload(blank));await frame.waitForFunction(()=>document.querySelector('.hero .name').textContent==='');for(const selector of ['.timeline','.venue','.wishes','.countdown','.age-pill','#musicBtn'])assert.equal(await frame.locator(selector).isVisible(),false,selector);
   if(width===390&&!reduced){
    const authored=fixture();for(const l of LOCALES){authored.content[l].people=['Real <script>'];authored.content[l].personalGreeting='Hello {name}';}
    const publicPayload=payload(authored,{preview:false});await send(publicPayload);await frame.waitForFunction(()=>document.querySelector('.wish .who')?.textContent.includes('Approved'));
    assert.equal(await frame.locator('.wish img,.wish script,.hero script').count(),0);assert.equal(await frame.locator('.splash .top-line').innerText(),'Hello Aziza');
    await frame.locator('#openBtn').click();await frame.locator('#wName').fill('Real Guest');await frame.locator('#wMsg').fill('A real note');await frame.locator('#wishForm button').click();await frame.waitForFunction(()=>document.querySelector('.wish-status').textContent.includes('Tasdiqlangach'));
    assert.deepEqual(posts.at(-1),{name:'Real Guest',message:'A real note'});assert.equal(await frame.locator('.wish').count(),1);
    fail=true;await frame.locator('#wName').fill('Retry Guest');await frame.locator('#wMsg').fill('Keep on error');await frame.locator('#wishForm button').click();await frame.waitForFunction(()=>document.querySelector('.wish-status').textContent.includes('Qayta'));
    assert.equal(await frame.locator('#wMsg').inputValue(),'Keep on error');fail=false;
    // Stub only the media element for deterministic policy/choice checks; no absent source track is fabricated.
    await frame.evaluate(()=>{window.qaPlay=0;window.qaPause=0;let paused=true;const a=document.querySelector('audio');Object.defineProperty(a,'paused',{get:()=>paused});a.play=async()=>{window.qaPlay++;paused=false;};a.pause=()=>{window.qaPause++;paused=true;};});
    publicPayload.payload.music={enabled:true,url:'/qa-creator-audio.mp3'};await send(publicPayload);await frame.waitForFunction(()=>window.qaPlay>0);
    await frame.locator('#musicBtn').click();const plays=await frame.evaluate(()=>window.qaPlay);await frame.locator('.hero').click();await send(publicPayload);assert.equal(await frame.evaluate(()=>window.qaPlay),plays);await frame.locator('#musicBtn').click();assert.equal(await frame.evaluate(()=>window.qaPlay),plays+1);
    // This URL is a test double; it is not loaded because media play/pause are stubbed.
   }
   if(errors.length||failed.length)diagnostics.push({width,reduced,errors,failed});
   results.push({width,reduced,geometry,locales:4,longName:fit,opening:true,previewNoSend:true,emptyOptionals:true});await context.close();
  }
  for(const width of [390,1440]){
   const page=await browser.newPage({viewport:{width,height:width===1440?900:844}});await page.goto(origin+'/reference?lang=uz');await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:path.join(evidence,`reference-${width}-opening.png`)});await page.locator('#openBtn').click();await page.waitForTimeout(1100);await page.screenshot({path:path.join(evidence,`reference-${width}-hero.png`)});await page.close();
  }
  const coverContext=await browser.newContext({viewport:{width:430,height:717}}),coverPage=await coverContext.newPage();
  await coverPage.goto(origin+'/harness');const coverFrame=coverPage.frames()[1];await coverFrame.waitForSelector('#openBtn',{state:'attached'});
  await coverPage.evaluate(p=>document.querySelector('iframe').contentWindow.postMessage(p,location.origin),payload());await coverFrame.evaluate(()=>document.fonts.ready);
  await coverPage.locator('iframe').screenshot({path:path.join(assets,base,'preview.webp'),type:'webp'});await coverContext.close();
  fs.writeFileSync(path.join(evidence,'browser-results.json'),JSON.stringify({browser:browser.version(),results,diagnostics,posts,scope:'isolated iframe harness; mocked wishes transport and media element, no catalog/save/public-route integration'},null,2));
  assert.deepEqual(diagnostics,[]);console.log('Browser checks passed',results.length,'viewport/motion cases.');
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
