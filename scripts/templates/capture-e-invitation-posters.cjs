const {createRequire}=require('node:module'),path=require('node:path');
const requireWeb=createRequire(path.resolve('apps/web/package.json')),{chromium}=requireWeb('playwright'),sharp=requireWeb('sharp');
(async()=>{const b=await chromium.launch();try{for(const id of ['olive-manor-edition','islamic-edition','monochrome-editorial-edition','xatna-edition']){
 const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
 await p.goto(`http://127.0.0.1:3001/preview?template=${id}&poster=1&qaSilent=1`,{waitUntil:'domcontentloaded'});
 const f=p.frameLocator('iframe').first();await f.locator('[data-e-template]').waitFor();await f.locator('body').evaluate(()=>document.fonts.ready);
 await f.locator('body').evaluate(async()=>Promise.all([...document.querySelectorAll('.section-intro img,.section-xatna-intro img')].map(e=>e.decode().catch(()=>{}))));
 const frame=p.frames().find(f=>f.url().includes(`/templates/${id}/`));await frame.addStyleTag({content:'.e-languages,.e-music{display:none!important}'});await p.addStyleTag({content:'nextjs-portal{display:none!important}'});await p.waitForTimeout(1500);
 const screenshot=await p.screenshot();await sharp(screenshot).webp({quality:94}).toFile(`apps/web/public/templates/${id}/catalog.webp`);console.log(id);await p.close();
}}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
