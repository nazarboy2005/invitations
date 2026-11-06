const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
const base='apps/web/public/templates/wedivo-riwayat-obrolan/';
let browser;
(async()=>{
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const payloads=JSON.parse(fs.readFileSync(base+'.qa-payload.json','utf8'));
 const report={cases:[],errors:[]};
 for(const locale of ['uz-Latn','uz-Cyrl','en','ru']){
  for(const reduced of [false,true]){
   const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:reduced?'reduce':'no-preference'}),errors=[],network=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});page.on('request',r=>network.push(r.url()));
   const p=structuredClone(payloads[locale]);p.payload.reducedMotion=reduced;
   page.setDefaultTimeout(60000);
   await page.goto('http://127.0.0.1:3028/templates/wedivo-riwayat-obrolan/index.html',{waitUntil:'load',timeout:120000});
   await page.evaluate(p=>window.postMessage(p,location.origin),p);
   await page.waitForFunction(()=>window.__RIWAYAT_READY,null,{timeout:120000});
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('html').getAttribute('lang'),locale);
   assert.ok(p.payload.weekdays.every(Boolean));
   if(locale==='uz-Latn'){
     assert.equal(await page.locator('#cv-hint-t').innerText(),'Xabarni bosing yoki yuqoriga suring');
     assert.equal(await page.locator('#rsvp-name').getAttribute('placeholder'),'Ismingiz');
     assert.equal(await page.locator('#rsvp-send-t').innerText(),'Javob yuborish');
   }
   assert.equal(await page.locator('.ac').count(),6);
   await page.locator('#cv-n1').click();
   await page.waitForFunction(()=>document.getElementById('sec-cover').style.display==='none');
   assert.equal(await page.locator('.rd-i').count(),6);
   assert.equal(await page.locator('#rsvp-pax-w').isVisible(),false);
   assert.equal(await page.locator('#sec-hadiah').isVisible(),false);
   await page.locator('#rsvp-name').fill('Browser QA');
   await page.locator('#rsvp-yes').click();
   await page.locator('#rsvp-send').click();
   await page.waitForFunction(()=>document.querySelector('#rsvp-form .platform-feedback')?.textContent.length>0);
   assert.equal(network.some(u=>u.includes('/api/public/')),false);
   assert.equal(await page.locator('#rsvp-form').evaluate(n=>n.classList.contains('is-submitted')),false);
   await page.locator('#gl-all').click();
   assert.equal(await page.locator('#viewer').isVisible(),true);
   await page.locator('#vw-next').click();
   assert.equal(await page.locator('#vw-count').innerText(),'2 / 6');
   await page.keyboard.press('Escape');
   await page.locator('#bs-sw-1').click();
   assert.equal(await page.locator('#bs-sw-1').evaluate(n=>n.classList.contains('is-on')),true);
   await page.locator('#bs-reset').click();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   report.cases.push({locale,reduced,viewport:'390x844',errors,localAssetsOnly:network.every(u=>u.startsWith('http://127.0.0.1:3028'))});
   console.log('Passed',locale,reduced?'reduced motion':'normal motion');
   await page.close();
  }
 }
 // Payload updates and seven ordered authored chapters, literal HTML, public empty optionals.
 const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'}),errors=[],posts=[];
 page.on('pageerror',e=>errors.push(e.message));
 const authored=structuredClone(payloads.en);authored.payload.preview=false;authored.payload.data.gallery=[];authored.payload.data.wishes=[];
 authored.payload.guestName='QA Guest';authored.payload.data.greeting='Welcome, QA Guest';
 authored.payload.data.groom='Jahongir-Shohruhbek Mirzohid';authored.payload.data.bride='Gulbahor-Marguba Sayyidabonu';
 authored.payload.data.story=Array.from({length:7},(_,i)=>({id:'story-'+i,title:'Chapter '+i,text:'<b>Authored '+i+'</b>'}));
 await page.route('**/api/public/invitations/**',async route=>{
  if(route.request().method()==='POST')posts.push({url:route.request().url(),body:route.request().postDataJSON()});
  await route.fulfill({status:route.request().method()==='POST'?201:200,contentType:'application/json',body:JSON.stringify(route.request().method()==='POST'?{ok:true}:{wishes:[]})});
 });
 await page.goto('http://127.0.0.1:3028/templates/wedivo-riwayat-obrolan/index.html');
 await page.evaluate(p=>window.postMessage(p,location.origin),authored);await page.waitForFunction(()=>window.__RIWAYAT_READY);
 assert.equal(await page.locator('#sec-kisah [data-item-id]').count(),7);
 assert.equal(await page.locator('#sec-kisah .m-text').first().innerText(),'<b>Authored 0</b>');
 assert.equal(await page.locator('#sec-kisah .m-text b').count(),0);
 assert.equal(await page.locator('#sec-galeri').isVisible(),false);
 await page.locator('#cv-n1').click();await page.waitForFunction(()=>document.getElementById('sec-cover').style.display==='none');
 await page.locator('#rsvp-yes').click();await page.locator('#rsvp-send').click();
 await page.waitForFunction(()=>document.querySelector('#rsvp-form .platform-feedback')?.textContent.includes('saved'));
 assert.equal(posts[0].body.partySize,1);
 await page.locator('#rsvp-no').click();await page.locator('#rsvp-send').click();
 await page.waitForFunction(()=>!document.getElementById('rsvp-send').disabled);
 assert.equal(posts[1].body.partySize,0);
 await page.locator('#wish-name').fill('Guest');await page.locator('#wish-msg').fill('Pending QA wish');await page.locator('#wish-send').click();
 await page.waitForFunction(()=>document.querySelector('#wish-form .platform-feedback')?.textContent.includes('approval'));
 assert.equal(await page.locator('#wish-list').innerText(),'');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 report.cases.push({name:'desktop authored',stories:7,preview:false,mockedServiceContract:true,errors});
 // Live payload change is rehydrated through the same frame URL without old creator data.
 const changed=structuredClone(payloads.ru);changed.payload.data.gallery=[];changed.payload.data.wishes=[];
 await page.evaluate(p=>window.postMessage(p,location.origin),changed);
 await page.waitForFunction(()=>window.__RIWAYAT_READY && document.documentElement.lang==='ru');
 assert.equal(await page.locator('#hero-g').innerText(),changed.payload.data.groom);
 assert.equal(await page.locator('body').evaluate(n=>n.classList.contains('is-open')),true);
 assert.equal(await page.locator('#sec-kisah [data-item-id]').count(),0);
 report.cases.push({name:'payload locale/content update',errors});
 await page.close();
 // Clean canonical opening for catalog, no frame/platform UI. Capture only.
 const cover=await browser.newPage({viewport:{width:480,height:860}});
 await cover.clock.install({time:new Date('2026-10-26T09:41:00Z')});
 await cover.goto('http://127.0.0.1:3028/templates/wedivo-riwayat-obrolan/index.html');
 await cover.evaluate(p=>window.postMessage(p,location.origin),payloads['uz-Latn']);await cover.waitForFunction(()=>window.__RIWAYAT_READY);await cover.evaluate(()=>document.fonts.ready);
 await cover.locator('#sec-cover').evaluate(async n=>{await Promise.all(n.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished));});
 await cover.locator('#sec-cover').screenshot({path:base+'catalog-opening.png'});
 report.cover={path:'catalog-opening.png',width:480,height:860,sha256:crypto.createHash('sha256').update(fs.readFileSync(base+'catalog-opening.png')).digest('hex'),fixtureSHA256:crypto.createHash('sha256').update(fs.readFileSync('apps/web/src/modules/catalog/preview-sample.json')).digest('hex')};
 await browser.close();
 fs.writeFileSync(base+'browser-verification.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1});
