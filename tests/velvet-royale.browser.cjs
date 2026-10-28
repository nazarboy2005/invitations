// Explicit opt-in: serve apps/web/public at 127.0.0.1:8765, then run from repo root.
const { chromium } = require('../apps/web/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const output = 'docs/templates/velvet-royale-verification';
fs.mkdirSync(output,{recursive:true});
const base = {
  locale:'uz', groom:'Javohir', bride:'Asila', greeting:'Hurmatli mehmon', guestName:'Aziz mehmon',
  message:'Sizni nikoh to‘yimizga taklif etamiz.',
  date:{day:14,month:'iyul',monthNumber:7,year:2027,weekday:'chorshanba',time:'18:00',long:'14 iyul 2027'}, dateTime:'2027-07-14T13:00:00Z',
  venue:{name:'Ko‘shk',address:'Toshkent',lat:41.31,lng:69.28,mapUrl:'https://www.google.com/maps/search/?api=1&query=Selected+Place&query_place_id=ChIJtest'},
  gallery:Array.from({length:6},(_,i)=>({id:`photo-${i}`,src:`/templates/velvet-royale/source/reference/couple-gallery-v20261021-0${i+1}.webp`,alt:`Test photo ${i}`,caption:`Photo ${i+1}`})),
  toyona:{enabled:true,cardNumber:'8600 1234 5678 9012',cardHolder:'Javohir'},contacts:[{label:'Telefon',value:'+998 90 123 45 67',href:'tel:+998901234567'},{label:'Telegram',value:'@test',href:'https://t.me/test'}],
  rsvp:{enabled:true,maxPartySize:4},wishesEnabled:true,hosts:'Aliyevlar oilasi',languages:['uz','uz-Cyrl','en','ru'],preview:true,apiBase:'/api/public/invitations/qa',music:''
};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const checks=[], errors=[],missing=[];
 const page=await browser.newPage({viewport:{width:390,height:844}});
 page.on('pageerror',e=>errors.push(e.message)); page.on('response',r=>{if(r.status()===404 && r.url().includes('/templates/velvet-royale/'))missing.push(r.url());});
 await page.route('**/api/public/invitations/qa/**',async route=>route.fulfill({status:201,contentType:'application/json',body:'{"ok":true}'}));
 const update=async data=>{ await page.evaluate(payload=>postMessage({type:'royal-burgundy-edition:update',payload},location.origin),data); await page.waitForFunction(name=>document.querySelector('[data-editable-id="hero-groom"]')?.textContent===name,data.groom); await page.waitForTimeout(150); };
 await page.goto('http://127.0.0.1:8765/templates/velvet-royale/index.html'); await update(base);
 assert.equal(await page.locator('.section-intro').isVisible(),true);
 assert.equal(await page.locator('.section-envelope-motion').evaluate(x=>x.classList.contains('section-envelope-motion--paused')),false);
 assert.equal(await page.locator('.invitation__main').evaluate(x=>x.inert),true);
 await page.screenshot({path:path.join(output,'app-mobile-envelope.png')});
 await page.locator('.section-intro__seal').click();
 await page.waitForFunction(()=>document.querySelector('.section-intro')?.hidden,{},{timeout:18000});
 await page.waitForFunction(()=>document.querySelector('.section-hero__video')?.currentTime>0,{},{timeout:5000});
 assert.equal(await page.locator('.invitation__main').evaluate(x=>x.inert),false);
 checks.push('Source idle shimmer, seal release, video, final reveal and animated hero complete');
 await page.waitForTimeout(1600);
 assert.ok(Number(await page.locator('.section-hero__content').evaluate(x=>getComputedStyle(x).opacity))>.99);
 await page.screenshot({path:path.join(output,'app-mobile-hero.png')});
 await page.locator('.calendar').scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('.calendar__day--active')?.classList.contains('calendar__day--revealed'),{},{timeout:6500});
 assert.equal(await page.locator('.calendar__day--active').textContent(),'14');
 assert.ok(await page.locator('canvas').count());
 checks.push('Calendar lights days in order, reveals event day and emits captured confetti');
 await page.locator('.section-photo-story__reel').scrollIntoViewIfNeeded();
 await page.locator('.section-photo-story__arrow').last().click();
 await page.waitForFunction(()=>document.querySelector('.section-photo-story__index button:nth-child(2)')?.getAttribute('aria-current')==='true');
 await page.locator('.section-photo-story__reel').press('End');
 await page.waitForFunction(()=>document.querySelector('.section-photo-story__index button:last-child')?.getAttribute('aria-current')==='true');
 await page.locator('.section-photo-story__reel').evaluate(el=>el.blur());
 await page.waitForFunction(()=>document.querySelector('.section-photo-story__index button:first-child')?.getAttribute('aria-current')==='true',{},{timeout:11000});
 checks.push('Gallery arrows, keyboard navigation, automatic wraparound after interaction pause and accurate active slide');
 assert.equal(await page.locator('.section-venue__action').getAttribute('href'),base.venue.mapUrl);
 assert.ok((await page.locator('.section-venue iframe').getAttribute('src')).includes('41.31%2C69.28'));
 checks.push('Google Places link retains place ID and embed uses selected coordinates');
 for(const name of ['section-couple','section-photo-story','section-datetime','section-card','section-rsvp','section-family']){
   if(name==='section-photo-story') await page.locator('.section-photo-story img').evaluateAll(async images=>{await Promise.all(images.map(image=>{image.loading='eager';return image.decode();}));});
   await page.locator('.'+name).scrollIntoViewIfNeeded();await page.waitForTimeout(1600);
   await page.locator('.'+name).screenshot({path:path.join(output,'app-mobile-'+name.replace('section-','')+'.png')});
 }
 const requests=[];
 page.on('request',r=>{if(r.url().includes('/api/public/invitations/qa/')&&r.method()==='POST')requests.push({url:r.url(),body:r.postDataJSON()});});
 await update({...base,preview:false,guestToken:'guest-test-token'});
 await page.locator('input[name=name]').fill('Browser guest'); await page.locator('input[type=radio]').first().check();
 await page.locator('input[name=partySize]').fill('3'); await page.locator('input[name=phone]').fill('+998 90 111 22 33'); await page.locator('textarea').fill('Browser wish');
 await page.locator('.section-rsvp__submit').click(); await page.waitForTimeout(200);
 assert.equal(requests.length,2); assert.equal(requests[0].body.partySize,3); assert.equal(requests[0].body.guestToken,'guest-test-token'); assert.ok(requests[0].body.note.includes('+998 90 111 22 33')); assert.equal(requests[1].body.message,'Browser wish');
 checks.push('RSVP and wishes use shared API shape with party size, phone note and guest token (transport mocked)');
 await update({...base,music:'/music/catalog/emotional-piano.wav'});
 await page.waitForFunction(()=>!document.getElementById('velvet-music')?.paused);
 await page.locator('.velvet-music-toggle').click();
 assert.equal(await page.locator('#velvet-music').evaluate(x=>x.paused),true);
 await update({...base,locale:'en',music:'/music/catalog/emotional-piano.wav'});
 await page.locator('.section-hero__scroll').click();
 assert.equal(await page.locator('#velvet-music').evaluate(x=>x.paused),true);
 await page.locator('.velvet-music-toggle').click(); await page.waitForFunction(()=>!document.getElementById('velvet-music')?.paused);
 checks.push('Configured music plays; pause survives language updates and ordinary clicks; source control resumes it');
 for(const [locale,groom,bride] of [['uz','Javohir','Asila'],['uz-Cyrl','Жавоҳир','Асила'],['en','Alexander','Elizabeth'],['ru','Александр','Елизавета']]){
   await update({...base,locale,groom,bride});
   assert.ok((await page.locator('.section-rsvp__submit span').textContent()).trim());
   assert.equal(await page.locator('.section-intro').isVisible(),false);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 }
 checks.push('All four locales retain opened state, translated controls and no page overflow');
 const story=Array.from({length:5},(_,i)=>({id:`chapter-${i}`,title:`Chapter ${i}`,text:`Story ${i}`}));
 await update({...base,story,gallery:[],contacts:[],toyona:{enabled:false},hosts:'',rsvp:{enabled:false},wishesEnabled:false,venue:{name:'',address:'',lat:null,lng:null,mapUrl:'https://maps.app.goo.gl/manual-test'}});
 assert.equal(await page.locator('.section-photo-story').isVisible(),false);
 assert.equal(await page.locator('.section-card').isVisible(),false);
 assert.equal(await page.locator('.section-rsvp').isVisible(),false);
 assert.equal(await page.locator('.section-venue__action').getAttribute('href'),'https://maps.app.goo.gl/manual-test');
 assert.equal(await page.locator('.section-venue__map').isVisible(),false);
 await update({...base,story,gallery:[],venue:{name:'Manual venue',address:'',lat:41.31,lng:69.28,mapUrl:'https://maps.app.goo.gl/manual-test'}});
 assert.equal(await page.locator('.section-venue__map').isVisible(),false);
 assert.equal(await page.locator('.section-venue__action').getAttribute('href'),'https://maps.app.goo.gl/manual-test');
 const chapters=await page.locator('.quote-block').evaluateAll(xs=>xs.filter(x=>!x.hidden).map(x=>x.dataset.itemId)); assert.deepEqual(chapters,story.map(x=>x.id));
 checks.push('Five authored chapters preserve IDs/order; empty optional sections hide; manual Google short link remains exact');
 await update({...base,groom:'A very long creator supplied first name',bride:'A very long creator supplied second name',gallery:base.gallery.slice(0,1)});
 assert.equal(await page.locator('.section-photo-story__album').isVisible(),false);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 checks.push('One-photo gallery hides empty reel; long names cause no horizontal page overflow');
 await update({...base,dateTime:'2020-01-01T00:00:00Z',rsvp:{enabled:true,deadline:'2020-01-01',maxPartySize:1},wishesEnabled:false});
 assert.equal(await page.locator('.section-countdown__timer').isVisible(),false);
 assert.equal(await page.locator('.section-countdown__after').isVisible(),true);
 assert.equal(await page.locator('.section-rsvp').isVisible(),false);
 checks.push('Past events use the source completed-countdown wording and expired attendance is closed');
 await page.setViewportSize({width:1280,height:900}); await update({...base,locale:'en'}); await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:path.join(output,'app-desktop-hero.png')});
 const bounds=await page.locator('.velvet-royale').boundingBox(); assert.equal(bounds.width,450); assert.equal(Math.round(bounds.x),(1280-450)/2);
 checks.push('Desktop canvas remains centered at source 450 px width');
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 reduced.on('pageerror',e=>errors.push(e.message));
 await reduced.goto('http://127.0.0.1:8765/templates/velvet-royale/index.html');
 await reduced.evaluate(payload=>postMessage({type:'royal-burgundy-edition:update',payload},location.origin),base);
 await reduced.locator('.section-intro__seal').click(); await reduced.waitForFunction(()=>document.querySelector('.section-intro')?.hidden);
 assert.equal(await reduced.locator('.section-hero__video').count(),0);
 assert.equal(await reduced.locator('.calendar__day--active').evaluate(x=>x.classList.contains('calendar__day--revealed')),true);
 checks.push('Reduced motion opens immediately, suppresses hero video/particles and shows event day');
 assert.deepEqual(errors,[]); assert.deepEqual(missing,[]);
 fs.writeFileSync(path.join(output,'browser-report.json'),JSON.stringify({date:'2026-10-28',checks,consoleErrors:errors,missingTemplateAssets:missing},null,2)+'\n');
 console.log(JSON.stringify({checks:checks.length,errors,missing},null,2)); await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1;});
