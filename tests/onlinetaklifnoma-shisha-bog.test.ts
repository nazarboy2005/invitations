import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
const base='apps/web/public/templates/onlinetaklifnoma-shisha-bog';
test('Shisha bog source media and fonts match recorded URLs and hashes',async()=>{const m=JSON.parse(await readFile(base+'/source/assets-provenance.json','utf8'));assert.equal(m.sourcePageUrl,'https://onlinetaklifnoma.app/templates/shisha-bog/full');assert.equal(m.assets.length,23);for(const a of m.assets){const p=base+'/source/'+a.local;assert.ok(existsSync(p),a.local);assert.equal(createHash('sha256').update(await readFile(p)).digest('hex'),a.sha256,a.local)}});
test('Shisha bog binds app invitation fields and source art',async()=>{const html=await readFile(base+'/index.html','utf8'),js=await readFile(base+'/bridge.js','utf8'),adapter=await readFile('apps/web/src/templates/onlinetaklifnoma/shisha-bog/renderer.tsx','utf8'),contracts=await readFile('packages/contracts/src/index.ts','utf8');for(const field of ['groom','bride','dateTime','venue','program','gallery','toyona','rsvp','wishes','music'])assert.match(js,new RegExp(field));assert.match(html,/intro\.6c98810bdf1fe6f4\.mp4/);assert.match(adapter,/CATALOG_PREVIEW_MUSIC/);assert.match(contracts,/id: "shisha-bog"[\s\S]*?published: false/);assert.doesNotMatch(js,/formspree|webhook|gtag\(/i)});
test('Shisha bog gift state requires creator card fields and copy feedback',async()=>{const js=await readFile(base+'/bridge.js','utf8');assert.match(js,/gift:data\.toyona\?\.enabled && data\.toyona\.cardNumber\?\.trim\(\) && data\.toyona\.cardHolder\?\.trim\(\)/);assert.match(js,/navigator\.clipboard\?\.writeText[\s\S]*navigator\.clipboard\.writeText\(number\)/)});
