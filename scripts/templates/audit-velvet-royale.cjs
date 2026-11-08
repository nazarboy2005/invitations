const assert=require('node:assert/strict'),fs=require('node:fs/promises'),{chromium}=require('../../apps/web/node_modules/playwright');
(async()=>{const b=await chromium.launch(),report=[];try{for(const width of [390,1280]){
 const p=await b.newPage({viewport:{width,height:844}}),errors=[],missing=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&r.url().includes('/templates/baxmal-saroy'))missing.push(r.url())});
 await p.goto('http://127.0.0.1:3001/preview?template=royal-burgundy-edition&qaSilent=1',{waitUntil:'domcontentloaded'});
 const f=p.frameLocator('iframe').first();await f.locator('.section-intro__seal').waitFor({timeout:60000});const rect=await f.locator('.section-intro__seal').boundingBox();await p.mouse.click(rect.x+rect.width/2,rect.y+rect.height/2);
 await f.locator('.section-intro').waitFor({state:'hidden',timeout:20000});
 const video=await f.locator('.section-intro__video').evaluate(v=>({time:v.currentTime,duration:v.duration,frames:v.getVideoPlaybackQuality().totalVideoFrames}));assert.ok(video.frames>0);
 for(const cls of ['section-couple','section-photo-story','section-datetime','section-card','section-rsvp','section-family']){const section=f.locator('.'+cls);if(await section.isVisible()){await section.evaluate(e=>e.scrollIntoView({block:'center'}));await p.waitForTimeout(1400);assert.ok((await section.boundingBox()).height>0)}}
 assert.ok(await f.locator('.calendar__day--revealed').count());
 await p.screenshot({path:`docs/templates/e-invitation-repair/velvet-royale-${width}-audit.png`});assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);report.push({width,video,calendar:true,sections:true,errors,missing});console.log('PASS Velvet Royale',width);await p.close();
}await fs.writeFile('docs/templates/e-invitation-repair/velvet-royale-audit.json',JSON.stringify(report,null,2))}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
