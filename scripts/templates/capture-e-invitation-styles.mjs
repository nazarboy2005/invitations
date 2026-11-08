import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../../apps/web/package.json',import.meta.url));
const {chromium}=require('playwright');
const b=await chromium.launch();
for(const id of ['olive-manor-edition','islamic-edition','monochrome-editorial-edition','xatna-edition']){
 const p=await b.newPage({viewport:{width:390,height:844}});
 await p.goto(`https://e-invitation.uz/demo/${id}/`,{waitUntil:'networkidle',timeout:60000});
 const selectors={'olive-manor-edition':'.olive-manor-edition','islamic-edition':'.islamic-edition','monochrome-editorial-edition':'.section-editorial','xatna-edition':'.xatna-edition'};
 const capture=await p.evaluate(selector=>{
  const root=document.querySelector(selector),scopes=new Set([...root.querySelectorAll('*'),root].flatMap(e=>[...e.attributes].filter(a=>a.name.startsWith('data-v-')).map(a=>a.name)));
  return {scopes:[...scopes],inline:[...document.querySelectorAll('style')].map(e=>e.textContent).filter(css=>[...scopes].some(scope=>css.includes(scope))),links:[...document.querySelectorAll('link[rel=stylesheet]')].map(e=>e.href)};
 },selectors[id]);
 const dir=`apps/web/public/templates/${id}/source/current`;
 const result=capture.inline;
 for(const url of capture.links.filter(url=>url.startsWith('https://e-invitation.uz/_nuxt/')&&!/InvitationEdition\.|(?:OliveManor|Islamic|MonochromeEditorial|Xatna)Edition\./.test(url))){
  const text=await fetch(url).then(r=>r.text());if(capture.scopes.some(scope=>text.includes(scope)))result.push(text);
 }
 let css=result.join('\n');const files=[];
 // Inline typography declarations sometimes refer to template-owned font files.
 for(const match of [...css.matchAll(/url\(["']?(https?:\/\/[^)'"\s]+)["']?\)/g)]){
  const url=match[1],r=await fetch(url);if(!r.ok)throw Error(`Missing inline style asset ${r.status} ${url}`);
  const buffer=Buffer.from(await r.arrayBuffer()),name=`fonts/${path.basename(new URL(url).pathname)}`;
  await fs.mkdir(`${dir}/fonts`,{recursive:true});await fs.writeFile(`${dir}/${name}`,buffer);
  css=css.replaceAll(url,`/templates/${id}/source/current/${name}`);files.push({url,file:name,sha256:crypto.createHash('sha256').update(buffer).digest('hex')});
 }
 await fs.writeFile(`${dir}/inline.css`,css);
 const provenance=JSON.parse(await fs.readFile(`${dir}/provenance.json`,'utf8'));provenance.files.push(...files,{url:p.url(),file:'inline.css',sha256:crypto.createHash('sha256').update(css).digest('hex'),note:'Template-scoped inline styles emitted by the original component'});await fs.writeFile(`${dir}/provenance.json`,JSON.stringify(provenance,null,2));
 console.log(id,result.length,css.length);await p.close();
}
await b.close();
