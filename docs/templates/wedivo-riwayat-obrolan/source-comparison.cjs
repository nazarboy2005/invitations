const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs'),path=require('path');
const captureRoot='Invitations - this folder will be removed from production/Invitations - this folder will be removed from production/Wedivo';
const dest='apps/web/public/templates/wedivo-riwayat-obrolan/';
const manifest=JSON.parse(fs.readFileSync(path.join(captureRoot,'capture-manifest.json'),'utf8'));
let browser;
(async()=>{
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const payload=JSON.parse(fs.readFileSync(dest+'.qa-payload.json','utf8'))['uz-Latn'];
 fs.mkdirSync('docs/templates/wedivo-riwayat-obrolan/verification',{recursive:true});
 const report=[];
 for(const viewport of [{width:390,height:844},{width:1280,height:900}]){
  for(const mode of ['reference','package']){
   const page=await browser.newPage({viewport});page.setDefaultTimeout(120000);const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.clock.install({time:new Date('2026-10-26T09:41:00Z')});
   if(mode==='reference'){
    await page.route('https://**/*',async route=>{
     const row=manifest.resources[route.request().url()];
     if(row)await route.fulfill({path:path.join(captureRoot,row.file),contentType:row.type.split(';')[0]});else await route.abort();
    });
    await page.route('**/__riwayat-reference.html',route=>route.fulfill({path:path.join(captureRoot,'Web invitations/templates/cl18spIdFB8VbBu1Yiyb/index.html'),contentType:'text/html'}));
    await page.goto('http://127.0.0.1:3028/__riwayat-reference.html',{waitUntil:'domcontentloaded'});
   }else{
    await page.goto('http://127.0.0.1:3028/templates/wedivo-riwayat-obrolan/index.html',{waitUntil:'domcontentloaded'});
    await page.evaluate(p=>window.postMessage(p,location.origin),payload);await page.waitForFunction(()=>window.__RIWAYAT_READY);
   }
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('#sec-cover').evaluate(async n=>{await Promise.all(n.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).map(a=>a.finished));});
   const prefix=`${mode}-${viewport.width}x${viewport.height}`;
   await page.locator('#sec-cover').screenshot({path:'docs/templates/wedivo-riwayat-obrolan/verification/'+prefix+'-opening.png'});
   await page.locator('#cv-n1').click();await page.waitForFunction(()=>document.getElementById('sec-cover').style.display==='none');
   await page.screenshot({path:'docs/templates/wedivo-riwayat-obrolan/verification/'+prefix+'-opened.png'});
   const evidence=await page.evaluate(()=>({coverGone:document.getElementById('sec-cover').style.display==='none',heroRevealed:document.getElementById('sec-hero').classList.contains('in-view'),coverOpacityTransition:getComputedStyle(document.getElementById('sec-cover')).transitionDuration,font:getComputedStyle(document.getElementById('cv-clock')).fontFamily}));
   report.push({mode,viewport,errors,evidence});await page.close();
  }
 }
 fs.writeFileSync('docs/templates/wedivo-riwayat-obrolan/verification/source-comparison.json',JSON.stringify(report,null,2));
 await browser.close();console.log(JSON.stringify(report,null,2));
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1});
