import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const ids=['olive-manor-edition','islamic-edition','monochrome-editorial-edition','xatna-edition'];
const catalog=await fetch('https://fotiha.uz/api/catalog').then(r=>r.json());
const results=await Promise.all(ids.map(async id=>{
 const response=await fetch(`https://fotiha.uz/templates/${id}/renderer.js`);
 const text=await response.text(),local=await fs.readFile(`apps/web/public/templates/${id}/renderer.js`);
 return {id,status:response.status,liveRendererMatchesLocal:createHash('sha256').update(text).digest('hex')===createHash('sha256').update(local).digest('hex'),liveUsesRepairedBridge:text.includes('e-invitation-shared/runtime.js'),livePublished:catalog.templates.some(t=>t.id===id)};
}));
await fs.writeFile('docs/templates/e-invitation-repair/live-deployment-check.json',JSON.stringify({checked:new Date().toISOString(),url:'https://fotiha.uz',templates:results},null,2));
console.log(JSON.stringify(results,null,2));
