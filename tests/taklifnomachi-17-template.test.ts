import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync as read} from 'node:fs';
const root='apps/web/public/templates/taklifnomachi-17/';
test('demo 17 production page uses its captured satin and envelope art, with no demo service references',()=>{const html=read(root+'index.html','utf8');assert.match(html,/source\/taklifnomachi\.uz\/templates\/17\/assets\/satin2x\.png/);assert.doesNotMatch(html,/cloudflareinsights|SI_SLUG|Sardor|Nigora|09\.08\.2026/)});
test('demo 17 adapter maps app data, calendar, music, and RSVP/wishes APIs',()=>{const js=read(root+'adapter.js','utf8');for(const x of ['d.groom','d.bride','d.dateTime','d.venue','d.music','/rsvp','/wishes','d.toyona'])assert.ok(js.includes(x),x)});
test('demo 17 catalog registration is unpublished',()=>{const c=read('packages/contracts/src/index.ts','utf8');const row=c.slice(c.indexOf('id: "taklifnomachi-17"'),c.indexOf('id: "taklifnomachi-17"')+800);assert.match(row,/published: false/)})
