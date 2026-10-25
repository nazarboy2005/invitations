import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync as read } from './helpers/source-files';
const root='apps/web/public/templates/taklifnomachi-15/';
test('demo 15 source capture is retained and production references local source assets',()=>{
 const capture=read(root+'source/taklifnomachi.uz/demo/15/index.html');
 assert.deepEqual(capture,read('Invitations - this folder will be removed from production/Taklifnomachi/Web invitations/taklifnomachi.uz/demo/15/index.html'));
 assert.equal(createHash('sha256').update(capture).digest('hex'),'38238af999ee4158006cf25f2587df91f8f6f7c2f6cbbad94e87c5d7bead53e8');
 const html=read(root+'index.html','utf8'); assert.match(html,/source\/taklifnomachi\.uz\/templates\/15\/assets\/video\.mp4/); assert.doesNotMatch(html,/cloudflareinsights|SI_SLUG/);
});
test('demo 15 adapter maps app names, date, venue, audio and API-backed RSVP',()=>{
 const js=read(root+'adapter.js','utf8'); for(const value of ['d.groom','d.bride','d.dateTime','d.venue','d.music','/rsvp','/wishes','d.toyona']) assert.ok(js.includes(value),value);
});
test('demo 15 is registered unpublished',()=>{
 const contract=read('packages/contracts/src/index.ts','utf8'); const row=contract.slice(contract.indexOf('id: "taklifnomachi-15"'),contract.indexOf('id: "taklifnomachi-15"')+800);
 assert.match(row,/published: false/);
});
