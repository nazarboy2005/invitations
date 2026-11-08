const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),{createRequire}=require('node:module');
const requireWeb=createRequire(path.resolve('apps/web/package.json')),{chromium}=requireWeb('playwright');
const ids=['olive-manor-edition','islamic-edition','monochrome-editorial-edition','xatna-edition'];
const out=path.resolve('docs/templates/e-invitation-repair');
const origin='http://127.0.0.1:3001';
(async()=>{
 await fs.mkdir(out,{recursive:true});const browser=await chromium.launch();const report=process.argv.includes('--resume')?JSON.parse(await fs.readFile(path.join(out,'browser-report.json'),'utf8')):[];
 try {
  for(const viewport of [{width:390,height:844},{width:1280,height:800}]) for(const id of ids){
   if(process.argv.includes('--resume')&&id!=='xatna-edition'&&report.some(r=>r.id===id&&r.viewport.width===viewport.width))continue;
   const old=report.findIndex(r=>r.id===id&&r.viewport.width===viewport.width);if(old>=0)report.splice(old,1);
   const page=await browser.newPage({viewport}),errors=[],missing=[],external=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).pathname.startsWith('/templates/'))missing.push([r.status(),r.url()])});
   page.on('request',r=>{if(/assets\.e-invitation|e-invitation\.uz|fonts\.google|analytics|cloudflareinsights/.test(r.url()))external.push(r.url())});
   await page.addInitScript(()=>addEventListener('message',e=>{if(e.data?.type?.endsWith(':update'))window.__ePayload=e.data.payload}));
   await page.goto(`${origin}/preview?template=${id}&qaSilent=1`,{waitUntil:'domcontentloaded'});
   const f=page.frameLocator('iframe').first();await f.locator('[data-e-template][aria-busy=false]').waitFor({timeout:60000});
   await f.locator('body').evaluate(()=>document.fonts.ready);await page.waitForTimeout(1000);
   await page.screenshot({path:path.join(out,`${id}-${viewport.width}-opening.png`)});
   const button=f.locator('.section-intro__seal-button,.section-intro__button,.section-xatna-intro__button,.section-intro[role=button]').first(),rect=await button.boundingBox();
   const started=Date.now();await page.mouse.click(rect.x+rect.width/2,rect.y+rect.height/2);
   await page.waitForTimeout(350);
   assert.equal(await f.locator('[data-e-template]').getAttribute('data-opened'),null,'Opening must retain its transition');
   await f.locator('[data-opened=true]').waitFor({timeout:20000});const openedMs=Date.now()-started;
   const video=await f.locator('.section-intro__video').evaluateAll(vs=>vs.map(v=>({duration:v.duration,time:v.currentTime,frames:v.getVideoPlaybackQuality().totalVideoFrames})));
   if(video.length){assert.ok(video[0].frames>100);assert.ok(video[0].time>=video[0].duration-.2,'Opening reaches source video end')}
   await page.waitForTimeout(2500);await page.screenshot({path:path.join(out,`${id}-${viewport.width}-hero.png`)});
   const fields=await f.locator('[data-e-field="groom"],[data-e-field="bride"],[data-e-field="child"]').evaluateAll(es=>es.filter(e=>!e.hidden).map(e=>({text:e.textContent,width:e.getBoundingClientRect().width,overflow:e.scrollWidth-e.clientWidth})));
   assert.ok(fields.every(x=>x.overflow<=2),'Names must fit');
   const sections=f.locator('section:not([hidden])');let checked=0;
   for(let index=0;index<await sections.count();index++){
    const s=sections.nth(index);if(!await s.isVisible())continue;
    await s.evaluate(e=>e.scrollIntoView({block:'center'}));await page.waitForTimeout(1400);
    const invisible=await s.locator('.fade-reveal,.bloom-reveal,.editorial-reveal,[data-reveal],[data-aos]').evaluateAll(es=>es.filter(e=>{const r=e.getBoundingClientRect();return r.height>0&&r.bottom>80&&r.top<innerHeight-80&&getComputedStyle(e).opacity==='0'}).map(e=>e.className));
    assert.deepEqual(invisible,[],`${id} has no invisible in-view source content`);checked++;
    const cls=await s.getAttribute('class');if(/section-(details|datetime|calendar|closing|xatna-closing|gallery|child-gallery|card|payment|gift)/.test(cls))await page.screenshot({path:path.join(out,`${id}-${viewport.width}-${cls.split(' ')[0]}.png`)});
   }
   const broken=await f.locator('img[src]').evaluateAll(async es=>{await Promise.all(es.map(e=>e.decode().catch(()=>{})));return es.filter(e=>!e.naturalWidth).map(e=>e.src)});assert.deepEqual(broken,[]);
   const numbers=await f.locator('.section-countdown__number,.section-countdown__item .section-item__number,.section-calendar__countdown-grid strong').allTextContents();assert.equal(numbers.length,4);assert.ok(numbers.every(n=>/^\d+$/.test(n)));
   const active=f.locator('[aria-current=date]');assert.equal(await active.count(),1);await active.evaluate(e=>e.scrollIntoView({block:'center'}));await page.waitForTimeout(3200);
   if(id!=='monochrome-editorial-edition')assert.ok(await active.evaluate(e=>e.classList.contains('is-revealed')||e.classList.contains('calendar-card__day--revealed')));
   const images=f.locator('.section-gallery img[src],.section-child-gallery img[src]'),galleryCount=await images.count();
   assert.equal(galleryCount,id==='xatna-edition'?0:id==='monochrome-editorial-edition'?6:5);
   if(galleryCount){await images.first().locator('xpath=ancestor::*[@role="button"][1]').focus();await page.keyboard.press('Enter');await f.locator('dialog[open]').waitFor();await page.keyboard.press('ArrowRight');await page.keyboard.press('Escape');assert.equal(await f.locator('dialog[open]').count(),0)}
   const form=f.locator('.section-rsvp form');await form.locator('input[name=name]').fill('Preserved guest');
   for(const code of ['en','ru','uz-Cyrl','uz-Latn']){
    const name=({'uz-Latn':'UZ','uz-Cyrl':'ЎЗ',en:'EN',ru:'RU'})[code];await f.locator('.e-languages').getByRole('button',{name,exact:true}).click();
    await f.locator(`html[lang="${code}"]`).waitFor();assert.equal(await f.locator('[data-opened=true]').count(),1);assert.equal(await form.locator('input[name=name]').inputValue(),'Preserved guest');
    assert.ok(!/(\?){3}|undefined|NaN/.test(await f.locator('body').innerText()));
   }
   await form.locator('input[type=radio]').first().check();await form.locator('button[type=submit],button:not([type])').last().click();assert.match(await f.locator('.section-rsvp__notice').textContent(),/Ko‘rish rejimi/);
   const sample=await f.locator('body').evaluate(()=>window.__ePayload);assert.ok(sample.groom);
   const authored={...sample,groom:'AuthoredName',bride:id==='xatna-edition'?'':'AuthoredPartner',people:id==='xatna-edition'?['AuthoredName']:['AuthoredName','AuthoredPartner'],greeting:'Authored greeting',message:'Authored invitation text',hosts:'Authored family',gallery:[],contacts:[],wishes:[],wishesEnabled:false,rsvp:{...sample.rsvp,enabled:false},toyona:{enabled:false,cardNumber:'',cardHolder:''}};
   await page.evaluate(({id,authored})=>document.querySelector('iframe').contentWindow.postMessage({type:`${id}:update`,payload:authored},location.origin),{id,authored});
   await f.locator('[data-e-field="groom"],[data-e-field="child"]').filter({hasText:'AuthoredName'}).first().waitFor({state:'attached'});
   assert.equal(await f.locator('.section-gallery:not([hidden]),.section-child-gallery:not([hidden]),.section-card:not([hidden]),.section-gift:not([hidden]),.section-payment:not([hidden]),.section-rsvp:not([hidden])').count(),0);
   const text=await f.locator('body').innerText();assert.ok(!/Akmal|Madina|Yusufbek|2030|0000 0000/.test(text),'Source personal sample never survives binding');
   assert.ok(await f.locator('img[src*="source/current/assets"]').count()>3,'Template artwork survives empty creator gallery');
   assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);assert.deepEqual(external,[]);
   report.push({id,viewport,openedMs,video,sectionsChecked:checked,galleryCount,fourLocales:true,preservedForm:true,emptyOptionals:true,noSourceSample:true,errors,missing,external});await fs.writeFile(path.join(out,'browser-report.json'),JSON.stringify(report,null,2));console.log('PASS',id,viewport.width);
   await page.close();
  }
  for(const id of ids){const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await p.goto(`${origin}/preview?template=${id}&qaSilent=1&qaLongNames=1`,{waitUntil:'domcontentloaded'});const f=p.frameLocator('iframe').first();await f.locator('[data-opened=true]').waitFor();assert.ok(await f.locator('.section-intro__video').evaluateAll(vs=>vs.every(v=>v.paused&&v.currentTime===0)));await p.screenshot({path:path.join(out,`${id}-reduced-long.png`)});await p.close()}
  await fs.writeFile(path.join(out,'browser-report.json'),JSON.stringify(report,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
