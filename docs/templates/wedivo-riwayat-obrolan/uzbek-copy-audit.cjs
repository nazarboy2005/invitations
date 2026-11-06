const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs'),assert=require('assert/strict');let browser;
(async()=>{
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});page.setDefaultTimeout(120000);
 const payload=JSON.parse(fs.readFileSync('apps/web/public/templates/wedivo-riwayat-obrolan/.qa-payload.json','utf8'))['uz-Latn'];
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3028/templates/wedivo-riwayat-obrolan/index.html',{waitUntil:'domcontentloaded'});
 await page.evaluate(p=>window.postMessage(p,location.origin),payload);await page.waitForFunction(()=>window.__RIWAYAT_READY);
 await page.locator('#cv-n1').click();await page.waitForFunction(()=>document.getElementById('sec-cover').style.display==='none');
 await page.locator('#rsvp-send').click();
 assert.equal(await page.locator('#rsvp-name').evaluate(n=>n.validationMessage),'Ismingizni yozing.');
 await page.locator('#rsvp-name').fill('Mehmon');await page.locator('#rsvp-yes').click();await page.locator('#rsvp-send').click();
 assert.equal(await page.locator('#rsvp-form .platform-feedback').innerText(),'Namuna rejimida yuborish o‘chiq.');
 const actual=await page.evaluate(()=>({
  body:document.body.innerText,
  labels:[...document.querySelectorAll('[aria-label]')].filter(n=>n.getClientRects().length && !n.closest('[hidden],[data-contract-gap]')).map(n=>({id:n.id,label:n.getAttribute('aria-label')})),
  placeholders:[...document.querySelectorAll('input,textarea')].filter(n=>n.getClientRects().length).map(n=>({id:n.id,placeholder:n.placeholder})),
  weekdays:window.__RIWAYAT.weekdays,
 }));
 assert.ok(actual.weekdays.every(Boolean));
 const foreign=/\b(Undangan|Pesan|Kamu|Kami|Terkirim|Lihat|Kirim|Nama kamu|Berhalangan|Masih ragu|Terjemahkan|Mempelai|Selamat|Hari ini|hari menuju|selesai|onwards|Your name|Reply|Attending|Guest wishes|Countdown|Dark mode)\b/i;
 assert.equal(foreign.test(actual.body),false,actual.body.match(foreign)?.[0]);
 assert.equal(actual.labels.some(n=>foreign.test(n.label)),false);
 assert.equal(actual.placeholders.some(n=>foreign.test(n.placeholder)),false);
 fs.writeFileSync('docs/templates/wedivo-riwayat-obrolan/verification/uzbek-copy-audit.json',JSON.stringify({errors,labels:actual.labels,placeholders:actual.placeholders,weekdays:actual.weekdays,residualSourceCopy:false},null,2));
 await browser.close();console.log('Uzbek copy and native validation checks passed; errors:',errors);
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1});
