/* Standalone QA harness only; no app route, database or registry modifications. */
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '../../../../..'), publicRoot = path.join(root, 'apps/web/public');
process.env.TSX_TSCONFIG_PATH = path.join(root, 'apps/web/tsconfig.json'); require('tsx/cjs');
const { makeBarakaliPayload } = require('./adapter.ts');
const { createTemplatePreviewSample } = require(path.join(root,'apps/web/src/modules/catalog/preview-sample.ts'));
const output = path.join(__dirname,'evidence'); fs.mkdirSync(output,{ recursive:true });
const prefix = '/templates/taklifla-barakali/';
const audit = JSON.parse(fs.readFileSync(path.join(publicRoot,prefix,'dependencies.json'),'utf8'));
let baseline = fs.readFileSync(path.join(root,audit.capture),'utf8');
baseline = baseline.replace(/<link[^>]*href="https:\/\/fonts[^>]*>/g,'').replace(/<script[^>]*src="https:[\s\S]*?<\/script>/g,'');
baseline = baseline.replace('</head>',`<link rel="stylesheet" href="${prefix}fonts/fonts.css"><link rel="icon" href="data:,"></head>`);
let posts = [], failApi = false;
const server = http.createServer((req,res) => {
  if (req.url === '/host') { res.setHeader('Content-Type','text/html'); return res.end(`<html><head><link rel="icon" href="data:,"></head><body style="margin:0"><iframe id="frame" style="display:block;width:100%;height:100vh;border:0" allow="autoplay" src="${prefix}index.html"></iframe></body></html>`); }
  if (req.url.startsWith('/reference')) { res.setHeader('Content-Type','text/html'); return res.end(baseline); }
  if (req.url.startsWith('/api/')) {
    res.setHeader('Content-Type','application/json');
    if (req.method === 'POST') { let raw = ''; req.on('data',d=>raw+=d); req.on('end',()=>{ posts.push({url:req.url,body:JSON.parse(raw)}); res.writeHead(failApi ? 503 : 201);res.end(JSON.stringify(failApi ? {ok:false} : {ok:true})); }); }
    else res.end(JSON.stringify({ wishes: [{name:'Approved guest',message:'Approved wish',submittedAt:'2026-10-26T12:00:00Z'}] }));
    return;
  }
  const file = path.resolve(publicRoot,'.'+decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(publicRoot+path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404);res.end(); return; }
  res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'application/javascript','.ttf':'font/ttf','.wav':'audio/wav','.png':'image/png'})[path.extname(file)] || 'application/octet-stream');res.end(fs.readFileSync(file));
});
const results = [];
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r)); const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({headless:true,channel:'chrome'});
  const errors=[],failed=[],external=[];
  try {
    const sample = createTemplatePreviewSample('taklifla-barakali');
    const envelope = makeBarakaliPayload(sample,'uz-Latn',{invitationId:'qa-barakali',preview:true,sampleWishes:true,catalogMusic:true,silentPlayback:true});
    for (const viewport of [{width:390,height:844},{width:1440,height:1000}]) {
      const context = await browser.newContext({viewport});
      await context.route('https://**',route=>{external.push(route.request().url());route.abort();});
      const page = await context.newPage(); page.on('pageerror',e=>errors.push(e.message));
      page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),url:r.url()});});
      await page.goto(origin+'/reference',{waitUntil:'networkidle'}); await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(1400);
      await page.screenshot({path:path.join(output,`reference-${viewport.width}-hero.png`)});
      const sourceHero = await page.locator('.hero').evaluate(n=>({height:n.offsetHeight,width:n.offsetWidth,font:getComputedStyle(n.querySelector('.hero-name')).fontFamily}));
      await page.locator('.details').scrollIntoViewIfNeeded();await page.waitForTimeout(1100);
      await page.screenshot({path:path.join(output,`reference-${viewport.width}-details.png`)});
      await page.goto(origin+'/host'); const frame = page.frames().find(f=>f.url().endsWith('/index.html')) || await (await page.locator('#frame').elementHandle()).contentFrame();
      const send = async payload => {await page.evaluate(p=>document.querySelector('#frame').contentWindow.postMessage(p,location.origin),payload);await frame.waitForFunction(()=>document.body.dataset.bound==='true');};
      await send(envelope);await frame.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1400);
      assert.equal(await frame.locator('.hero-name').textContent(),envelope.payload.variants['uz-Latn'].names);
      await page.screenshot({path:path.join(output,`package-${viewport.width}-hero.png`)});
      const appHero=await frame.locator('.hero').evaluate(n=>({height:n.offsetHeight,width:n.offsetWidth,font:getComputedStyle(n.querySelector('.hero-name')).fontFamily}));
      assert.deepEqual(appHero,sourceHero);
      assert.equal(await frame.locator('.wish').count(),3);
      const animation=await frame.locator('.hero-name').evaluate(n=>({name:getComputedStyle(n).animationName,duration:getComputedStyle(n).animationDuration}));
      assert.notEqual(animation.name,'none');
      await frame.locator('.details').scrollIntoViewIfNeeded();await page.waitForTimeout(1100);
      await page.screenshot({path:path.join(output,`package-${viewport.width}-details.png`)});
      assert.equal(await frame.locator('.details').evaluate(n=>n.classList.contains('in')),true);
      const dateInstant=envelope.payload.variants['uz-Latn'].target;
      const days=await frame.locator('#cd-d').textContent();assert.equal(Number(days),Math.floor(Math.max(0,dateInstant-Date.now())/86400000));
      // Preview form must never send a network submission or insert a wish.
      const beforePreviewPosts=posts.length;
      await frame.locator('#g-name').fill('QA guest');await frame.locator('#g-text').fill('Preview-only wish');
      await frame.locator('#rsvp-form button').click();assert.match(await frame.locator('#rsvp-thanks').textContent(),/namuna/);assert.equal(posts.length,beforePreviewPosts);
      // Real control, four authored variants and localized accessibility labels.
      for (const language of ['uz-Cyrl','en','ru','uz-Latn']) {
        await frame.locator('.taklifla-lang-toggle').click();await frame.locator(`[data-lang="${language}"]`).click();
        assert.equal(await frame.locator('html').getAttribute('lang'),language);
        assert.equal(await frame.locator('.hero-name').textContent(),envelope.payload.variants[language].names);
        assert.equal(await frame.locator('#g-name').getAttribute('aria-label'),envelope.payload.variants[language].ui.name);
      }
      await frame.locator('.taklifla-lang-toggle').click();await frame.locator('.taklifla-lang-toggle').press('Escape');
      assert.equal(await frame.locator('.taklifla-lang-toggle').getAttribute('aria-expanded'),'false');
      // Pause survives locale changes and repeated host renders.
      await frame.locator('#music-fab').click(); await page.waitForTimeout(150);
      const beforePause=await frame.locator('#music-audio').evaluate(a=>a.paused);
      if (!beforePause) await frame.locator('#music-fab').click();
      await send(envelope);assert.equal(await frame.locator('#music-audio').evaluate(a=>a.paused),true);
      // Long authored names, creator image, optional hiding, native reduced motion.
      const custom=structuredClone(sample); for(const value of Object.values(custom.content)) value.people=['Gulbahor-Marguba Sayyidabonu Jahongir-Shohruhbek Mirzohid'];
      custom.gallery=[{id:'creator-photo',url:prefix+'evidence-photo.svg',alt:'Authored portrait',caption:'Authored caption'}];
      const authored=makeBarakaliPayload(custom,'uz-Latn',{invitationId:'authored-barakali',guestName:'Personal guest',guestToken:'token-check'});
      // Inline data is prohibited by contract; harness routes a local SVG only.
      await page.route('**/evidence-photo.svg',route=>route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="400"><rect width="320" height="400" fill="#b89968"/></svg>'}));
      await send(authored);await page.waitForTimeout(200);
      assert.equal(await frame.locator('.photo-frame img').getAttribute('alt'),'Authored portrait');
      assert.equal(await frame.locator('.wish-name').textContent(),'Approved guest');
      assert.equal(await frame.locator('body').evaluate(n=>n.scrollWidth>innerWidth),false);
      const nameBox=await frame.locator('.hero-name').evaluate(n=>({scroll:n.scrollWidth,client:n.clientWidth}));assert.ok(nameBox.scroll<=nameBox.client+1);
      await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
      assert.equal(await frame.locator('.hero-name').evaluate(n=>getComputedStyle(n).animationName),'none');
      // API rejection preserves text and never shows success; success stays pending.
      failApi=true;await frame.locator('#g-name').fill('Service guest');await frame.locator('#g-text').fill('Service wish');
      await frame.locator('#rsvp-form button').click();await frame.waitForFunction(()=>document.querySelector('#rsvp-thanks').dataset.error==='true');
      assert.equal(await frame.locator('#g-text').inputValue(),'Service wish');
      failApi=false;await frame.locator('#rsvp-form button').click();await frame.waitForFunction(()=>document.querySelector('#rsvp-thanks').textContent.includes('tasdiqlagach'));
      assert.equal(await frame.locator('.wish').count(),1);assert.equal(posts.at(-1).body.guestToken,'token-check');
      assert.deepEqual(Object.keys(posts.at(-1).body).sort(),['guestToken','message','name']);
      custom.gallery=[];custom.wishes.enabled=false;custom.music.enabled=false;custom.startsAt='';custom.contacts.phoneNumber='';
      await send(makeBarakaliPayload(custom,'uz-Latn',{invitationId:'empty-barakali'}));
      assert.equal(await frame.locator('.photo-sec').isVisible(),false);assert.equal(await frame.locator('.rsvp').isVisible(),false);assert.equal(await frame.locator('#music-fab').isVisible(),false);assert.equal(await frame.locator('.countdown').isVisible(),false);
      assert.equal(await frame.locator('input[type=number]').count(),0);
      results.push({viewport,sourceHero,appHero,animation,checks:['hero geometry/fonts','source rise and scroll reveal','canonical preview wishes','preview no POST','four locale menu and labels','Escape','pause persistence','long names','creator portrait','native reduced motion','wish rejection and pending success (mock API)','guest token','empty optional sections','no headcount']});
      await context.close();
    }
    const report={browser:browser.version(),results,errors,failed:failed.filter(x=>x.status!==503),expectedMockFailures:failed.filter(x=>x.status===503),externalRequests:external};
    fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify(report,null,2));
    assert.deepEqual(errors,[]);assert.deepEqual(report.failed,[]);assert.deepEqual(external,[]);
    console.log(JSON.stringify(report,null,2));
  } finally { await browser.close();server.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
