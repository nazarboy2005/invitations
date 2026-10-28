// Uses the real React renderer, private HTTP server and read-only reference capture.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../../..'),pub=path.join(root,'apps/web/public'),base='/templates/taklifla-muhrli-maktub/';
const output=path.join(__dirname,'evidence');fs.mkdirSync(output,{recursive:true});
require('tsx/cjs');
const {createTemplatePreviewSample}=require(path.join(root,'apps/web/src/modules/catalog/preview-sample.ts'));
const {makeEnvelopePayload}=require('./adapter.ts');
const {buildSync}=require(require.resolve('esbuild',{paths:[require.resolve('tsx')]}));
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const invitation=createTemplatePreviewSample('taklifla-muhrli-maktub');
const props={invitation,locale:'uz-Latn',invitationId:'qa-envelope',guestName:'Dilnoza',guestToken:'qa-opaque',preview:true,silentPlayback:true};
const script=buildSync({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {MuhrliMaktubInvitation} from './renderer';const root=createRoot(document.querySelector('#app'));window.updateEnvelope=props=>root.render(React.createElement(MuhrliMaktubInvitation,props));updateEnvelope(${JSON.stringify(props)});`,resolveDir:__dirname,loader:'tsx'},absWorkingDir:root,bundle:true,write:false,outfile:'qa.js',format:'iife',platform:'browser',loader:{'.css':'empty'}}).outputFiles[0].text;
const dep=JSON.parse(fs.readFileSync(path.join(pub,base,'dependencies.json')));
let reference=fs.readFileSync(path.join(root,dep.capture),'utf8');
reference=reference.replace(/<link[^>]+(?:fonts\.googleapis|fonts\.gstatic)[^>]*>\s*/g,'').replace('</head>',`<link rel="stylesheet" href="${base}fonts/fonts.css"></head>`);
reference=reference.replace(/envelope-img\//g,base+'envelope-img/').replace(/<script src="_wish-close.js" defer><\/script>/,'').replace(/<script type="module" src="https:\/\/static.cloudflareinsights[\s\S]*?<\/script>/,'');
const d=makeEnvelopePayload(invitation,'uz-Latn',props).payload.variants['uz-Latn'];
const params=new URLSearchParams({names:d.people.join(' & '),date:'12.06.2027',time:'17:00',venue:d.venueName,address:d.address,events:JSON.stringify(d.program),dress_text:d.dress.text,phone:invitation.contacts.phoneNumber,flowers_note:'',invite_text:d.message});
let posts=[],failApi=false;
const server=http.createServer((req,res)=>{
  const route=decodeURIComponent(req.url.split('?')[0]);
  if(route==='/qa'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><style>html,body,#app{margin:0;width:100%;height:100%}iframe{width:100%;height:100vh;border:0;display:block}</style><div id="app"></div><script src="/qa.js"></script>');return;}
  if(route==='/qa.js'){res.setHeader('Content-Type','application/javascript');res.end(script);return;}
  if(route==='/reference'){res.setHeader('Content-Type','text/html');res.end(reference);return;}
  if(route.startsWith('/api/')){
    if(req.method==='POST'){let body='';req.on('data',d=>body+=d);req.on('end',()=>{posts.push({url:route,body:JSON.parse(body)});res.writeHead(failApi?503:201,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:!failApi}));});}
    else{res.setHeader('Content-Type','application/json');res.end(JSON.stringify({wishes:[{id:'approved',name:'Tasdiqlangan mehmon',message:'Tasdiqlangan tilak',submittedAt:'2026-10-26T10:00:00Z'}]}));}return;
  }
  const file=path.resolve(pub,'.'+route);
  if(!file.startsWith(pub+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.woff2':'font/woff2','.webp':'image/webp','.wav':'audio/wav'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
});
const errors=[],networkErrors=[],external=[],results=[];
async function main(){
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
  for(const viewport of [{width:390,height:844},{width:1440,height:1000}])for(const reduced of [false,true]){
   const context=await browser.newContext({viewport,reducedMotion:reduced?'reduce':'no-preference'});
   const page=await context.newPage();
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',req=>{if(!req.url().startsWith(origin))external.push(req.url());});
   page.on('response',res=>{if(res.status()>=400&&res.url().includes('/templates/'))networkErrors.push({url:res.url(),status:res.status()});});
   const mode=`${viewport.width}-${reduced?'reduced':'normal'}`;
   await page.goto(origin+'/reference?'+params);await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:path.join(output,`reference-${mode}-cover.webp`),type:'webp'});
   const referenceGeometry=await page.locator('#env-seal').boundingBox();
   await page.locator('#env-seal').evaluate(el=>el.click());
   if(!reduced){await page.waitForTimeout(1600);assert.match(await page.locator('#env-letter').getAttribute('style'),/kLetterOut/);}
   await page.waitForTimeout(reduced?700:3400);await page.locator('#env-stage').waitFor({state:'hidden'});
   await page.screenshot({path:path.join(output,`reference-${mode}-opened.webp`),type:'webp'});
   await page.goto(origin+'/qa');const frame=page.frameLocator('iframe');
   await frame.locator('html[data-bound]').waitFor();await frame.locator('body').evaluate(()=>document.fonts.ready);
   await page.screenshot({path:path.join(output,`app-${mode}-cover.webp`),type:'webp'});
   const appSealGeometry=await frame.locator('#env-seal').boundingBox();
   for(const key of ['x','y','width','height'])assert.ok(Math.abs(appSealGeometry[key]-referenceGeometry[key])<6,`${mode} ${key}: ${appSealGeometry[key]} vs ${referenceGeometry[key]}`);
   const start=Date.now();await frame.locator('#env-seal').evaluate(el=>el.click());
   if(!reduced){await page.waitForTimeout(1600);assert.match(await frame.locator('#env-letter').getAttribute('style'),/kLetterOut/);await page.screenshot({path:path.join(output,`app-${mode}-unfold.webp`),type:'webp'});}
   await frame.locator('#env-stage').waitFor({state:'hidden'});const openingMs=Date.now()-start;
   await page.screenshot({path:path.join(output,`app-${mode}-opened.webp`),type:'webp'});
   assert.equal(await frame.locator('#env-name1').innerText(),d.people[0]);
   assert.equal(await frame.locator('#env-prog > div').count(),invitation.program.length);
   assert.equal(await frame.locator('#env-map-g').getAttribute('href'),d.mapGoogle);
   for(const locale of ['uz-Cyrl','en','ru','uz-Latn']){
    await frame.locator(`[data-lang="${locale}"]`).click();await frame.locator(`html[lang="${locale}"]`).waitFor();
    assert.equal(await frame.locator('#env-name1').innerText(),makeEnvelopePayload(invitation,locale,props).payload.variants[locale].people[0]);
   }
   await frame.locator('[name=wname]').fill('QA mehmon');await frame.locator('[name=wmsg]').fill('Oldindan ko‘rishdagi tilak');
   await frame.locator('#env-wish-form button').click();assert.equal(posts.length,0);
   assert.match(await frame.locator('[role=status]').last().innerText(),/oldindan/);
   await frame.locator('#env-wish-list').scrollIntoViewIfNeeded();await page.waitForTimeout(reduced?0:1200);
   await page.screenshot({path:path.join(output,`app-${mode}-wishes.webp`),type:'webp'});
   assert.equal(await frame.locator('body').evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   if(reduced)assert.equal(await frame.locator('#env-monogram').evaluate(el=>getComputedStyle(el).animationName),'none');
   results.push({viewport,reduced,openingMs,sourceSealGeometry:referenceGeometry,appSealGeometry:await frame.locator('#env-seal').boundingBox(),locales:4,previewNoSend:true,programRows:invitation.program.length});
   await context.close();
  }
  // Public API adapter checks use a controlled HTTP stub, never a live invitation.
  const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/qa');const f=page.frameLocator('iframe');await f.locator('html[data-bound]').waitFor();
  const publicProps={...props,preview:false};await page.evaluate(p=>updateEnvelope(p),publicProps);
  await f.locator('#env-seal').evaluate(el=>el.click());await f.locator('#env-stage').evaluate(el=>el.click());
  await f.locator('#env-wish-list').getByText('Tasdiqlangan tilak').waitFor();
  assert.equal(await f.locator('#env-venue-photo').isVisible(),false);
  failApi=true;await f.locator('[name=wname]').fill('Mehmon');await f.locator('[name=wmsg]').fill('Yangi tilak');
  await f.locator('#env-wish-form button').click();await f.getByText('Tilak yuborilmadi. Qayta urinib ko‘ring.').waitFor();
  assert.equal(await f.locator('[name=wmsg]').inputValue(),'Yangi tilak');
  failApi=false;await f.locator('#env-wish-form button').click();await f.getByRole('status').filter({hasText:'Rahmat!'}).waitFor();
  assert.deepEqual(posts.at(-1).body,{name:'Mehmon',message:'Yangi tilak',guestToken:'qa-opaque'});
  assert.equal(await f.locator('#env-wish-list').innerText().then(t=>t.includes('Yangi tilak')),false);
  // Authored changes use the same mounted renderer; no opening reset or fixture replacement.
  const long=structuredClone(publicProps);long.invitation.content['uz-Latn'].people=['Gulbahor-Marguba Sayyidabonu','Jahongir-Shohruhbek Mirzohid'];
  long.invitation.templateData['taklifla-muhrli-maktub']={flowersNote:{'uz-Latn':'Gullar o‘rniga, o‘z tilaklaringizni yozing.'}};
  long.invitation.content['uz-Latn'].message='Aziz mehmon! '.repeat(110);
  await page.evaluate(p=>updateEnvelope(p),long);await f.getByText(long.invitation.content['uz-Latn'].people[0],{exact:true}).first().waitFor();
  assert.equal(await f.locator('#env-flowers').innerText(),'Gullar o‘rniga, o‘z tilaklaringizni yozing.');
  assert.equal(await f.locator('#env-stage').isVisible(),false);
  const overflow=await f.locator('#env-inv-body').evaluate(el=>({cardHeight:el.parentElement.clientHeight,scrollHeight:el.parentElement.scrollHeight}));
  assert.ok(overflow.scrollHeight<=overflow.cardHeight+1,JSON.stringify(overflow));
  await page.screenshot({path:path.join(output,'app-390-long-copy.webp'),type:'webp'});
  const blank=structuredClone(publicProps);blank.invitation.startsAt='';blank.invitation.program=[];blank.invitation.contacts.phoneNumber='';blank.invitation.dressCode.enabled=false;blank.invitation.wishes.enabled=false;
  blank.invitation.templateData['taklifla-muhrli-maktub']={flowersNote:{'uz-Latn':''}};
  blank.invitation.enabledLocales=['uz-Latn'];blank.invitation.content['uz-Latn'].people=[];blank.invitation.content['uz-Latn'].venueName='';blank.invitation.content['uz-Latn'].address='';blank.invitation.content['uz-Latn'].landmark='';blank.invitation.venue={latitude:null,longitude:null,mapUrl:''};
  await page.evaluate(p=>updateEnvelope(p),blank);await f.locator('#env-details-section[hidden]').waitFor({state:'attached'});
  assert.equal(await f.locator('#env-name1').innerText(),'');assert.equal(await f.locator('#env-prog-section').isVisible(),false);
  assert.equal(await f.locator('.env-lang button:visible').count(),1);
  const expired=structuredClone(publicProps);expired.invitation.startsAt='2020-01-01T12:00';
  await page.evaluate(p=>updateEnvelope(p),expired);await f.getByText('Daftar yopildi',{exact:true}).waitFor();assert.equal(await f.locator('#env-wish-form').isVisible(),false);
  // Gesture music and pause intent are checked with deterministic media API hooks.
  await f.locator('body').evaluate(()=>{window.mediaCalls={play:0,pause:0};HTMLMediaElement.prototype.play=function(){window.mediaCalls.play++;return Promise.resolve();};HTMLMediaElement.prototype.pause=function(){window.mediaCalls.pause++;};});
  const musical=structuredClone(publicProps);musical.invitation.music={enabled:true,url:'/music/catalog/emotional-piano.wav',assetId:null,filename:'QA'};
  await page.evaluate(p=>updateEnvelope(p),musical);await f.locator('#env-music[aria-pressed=true]').waitFor();
  await f.locator('#env-music').click();const calls=await f.locator('body').evaluate(()=>mediaCalls.play);
  await f.locator('[data-lang=en]').click();await f.locator('[data-lang=uz-Latn]').click();
  assert.equal(await f.locator('body').evaluate(()=>mediaCalls.play),calls);
  await f.locator('#env-music').click();await f.locator('#env-music[aria-pressed=true]').waitFor();
  results.push({publicStub:{approvedRead:true,failurePreservesText:true,pendingOnly:true,guestToken:true},longCopy:overflow,emptyOptionals:true,closedAfter24Hours:true,music:{autoplayAttempt:true,pausePreserved:true,resume:true,mediaApi:'stubbed'}});
  const coverPage=await browser.newPage({viewport:{width:720,height:1200}});await coverPage.goto(origin+'/qa');const coverFrame=coverPage.frameLocator('iframe');await coverFrame.locator('html[data-bound]').waitFor();
  await coverPage.locator('iframe').screenshot({path:path.join(pub,base,'preview.webp'),type:'webp'});await coverPage.close();
  assert.deepEqual(errors,[]);assert.deepEqual(networkErrors,[]);assert.deepEqual(external,[]);
  fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify({browser:await browser.version(),results,errors,networkErrors,external,posts,liveServiceVerified:false},null,2)+'\n');
  console.log(JSON.stringify({browser:await browser.version(),scenarios:results.length,errors,networkErrors,external}));
 }finally{await browser.close();server.close();}
}
main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
