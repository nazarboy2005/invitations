import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {createInvitation,LOCALES,sharlarDataSchema} from '@taklifnoma/contracts';
import {createTemplatePreviewSample} from '@/modules/catalog/preview-sample';
import {makeSharlarPayload} from './adapter';
const base=resolve('apps/web/public/templates/taklifla-sharlar'),read=(p:string)=>readFileSync(resolve(base,p)),hash=(v:Buffer|string)=>createHash('sha256').update(v).digest('hex'),meta=JSON.parse(read('source/provenance.json').toString());
test('Sharlar retains exact source CSS, all art/fonts, extracted engine and native labels',()=>{
 assert.equal(hash(readFileSync(meta.source)),meta.sourceSha256);
 assert.equal(read('source/template.css').toString(),readFileSync(meta.source).toString().match(/<style>([\s\S]*?)<\/style>/)![1]);
 for(const item of meta.assets)assert.equal(hash(read(item.to)),item.sha256,item.to);
 for(const [file,expected] of Object.entries(meta.sourceParts))assert.equal(hash(read(file)),expected,file);
 assert.match(read('source/motion.js').toString(),/const n = 36/);
 assert.match(read('index.html').toString(),/src="source\/motion.js"/);
 assert.doesNotMatch(read('source/text.js').toString(),/Asilbek|localStorage/);
});
test('Sharlar reuses birthday profile, localized canonical wishes and shared stable program',()=>{
 const i=createTemplatePreviewSample('taklifla-sharlar'),before=JSON.stringify(i);
 assert.equal(i.eventType,'birthday');assert.equal(i.celebrantAge,3);
 for(const locale of LOCALES){const p=makeSharlarPayload(i,locale,{invitationId:'qa',preview:true,sampleWishes:true,guestName:'Guest'}).payload,v=p.views[locale]!;assert.equal(p.celebrantAge,i.celebrantAge);assert.ok(v.content.greeting.includes('Guest'));assert.equal(v.previewWishes.length,3);assert.deepEqual(v.program.map(e=>e.id),i.program.map(e=>e.id));assert.equal(v.mapUrl,i.venue.mapUrl);assert.equal(makeSharlarPayload(i,locale,{invitationId:'real',sampleWishes:true}).payload.views[locale]!.previewWishes.length,0);}
 assert.equal(JSON.stringify(i),before);assert.equal(sharlarDataSchema.safeParse({doorsAt:'24:00'}).success,false);assert.equal(sharlarDataSchema.safeParse({doorsAt:'16:45'}).success,true);
});
test('Sharlar blank creators have no source samples; maps fall back to address and zero coordinates',()=>{
 const i=createInvitation('taklifla-sharlar'),get=()=>makeSharlarPayload(i,'uz-Latn',{invitationId:'real'}).payload;
 assert.equal(get().celebrantAge,null);assert.equal(get().doorsAt,'');assert.deepEqual(get().views['uz-Latn']!.content.people,[]);assert.deepEqual(get().views['uz-Latn']!.program,[]);assert.equal(get().views['uz-Latn']!.mapUrl,'');
 i.content['uz-Latn'].address='Authored address';assert.match(get().views['uz-Latn']!.mapUrl,/Authored%20address$/);i.venue.latitude=0;i.venue.longitude=0;assert.match(get().views['uz-Latn']!.mapUrl,/query=0,0$/);
});
