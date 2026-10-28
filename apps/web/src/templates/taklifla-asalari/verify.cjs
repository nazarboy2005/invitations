const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const { test } = require('node:test');
const root = path.resolve(__dirname,'../../../../..'), pkg = path.join(root,'apps/web/public/templates/taklifla-asalari');
process.env.TSX_TSCONFIG_PATH = path.join(root,'apps/web/tsconfig.json');
require('tsx/cjs');
const { makeAsalariPayload } = require('./adapter.ts');
const { createTemplatePreviewSample } = require('../../modules/catalog/preview-sample.ts');
const { createInvitation, LOCALES, templateById } = require('@taklifnoma/contracts');
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
function fixture() { const v=createTemplatePreviewSample('konfetti'); v.templateId='taklifla-asalari'; return v; }
exports.fixture = fixture;
exports.payload = (v=fixture(), options={}) => makeAsalariPayload(v,'uz-Latn','Aziza',{invitationId:'qa-asalari',preview:true,sampleWishes:true,...options});
if (require.main === module) {
test('source and all 17 local dependencies retain exact bytes', () => {
  const m=JSON.parse(fs.readFileSync(path.join(pkg,'dependencies.json')));
  assert.equal(hash(fs.readFileSync(path.join(root,m.capture))),m.sha256);
  assert.equal(hash(fs.readFileSync(path.join(pkg,'source/reference.html.txt'))),m.sha256);
  assert.equal(m.assets.length,17);
  for (const a of m.assets) { assert.equal(hash(fs.readFileSync(path.join(pkg,a.file))),a.sha256); assert.equal(hash(fs.readFileSync(path.join(root,a.capture))),a.sha256); }
  const raw=fs.readFileSync(path.join(root,m.capture),'utf8');
  assert.equal(fs.readFileSync(path.join(pkg,'source/template.css'),'utf8').replace(/\r\n/g,'\n'), raw.match(/<style>([\s\S]*?)<\/style>/)[1].replace(/\r\n/g,'\n'));
  assert.equal(fs.readFileSync(path.join(pkg,'template.css'),'utf8'),fs.readFileSync(path.join(pkg,'source/template.css'),'utf8'));
});
test('four variants map authored values, stable program IDs and event-zone instant without mutation', () => {
  const v=fixture();v.startsAt='2027-06-12T17:00';v.timezone='Asia/Tashkent';
  v.program=[{id:'first',time:'17:30'},{id:'second',time:'18:00'}];
  for (const locale of LOCALES) { v.content[locale].people=['Author <script>']; v.content[locale].personalGreeting='Welcome {name}';v.content[locale].programTitles={first:'One',second:'Two'};v.content[locale].programDescriptions={first:'Description'}; }
  const before=JSON.stringify(v), p=exports.payload(v).payload;
  for (const locale of LOCALES) { const d=p.variants[locale];assert.equal(d.child,'Author <script>');assert.equal(d.age,3);assert.equal(d.greeting,'Welcome Aziza');assert.deepEqual(d.program.map(x=>x.id),['first','second']);assert.equal(d.program[0].description,'Description');assert.equal(d.target,Date.parse('2027-06-12T12:00:00Z'));assert.match(d.venue.mapUrl,/^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/); }
  assert.equal(JSON.stringify(v),before);
});
test('blank/public invitations never acquire demo wishes, music, or unsupported sections', () => {
  const v=createInvitation('taklifla-asalari');const p=exports.payload(v,{preview:false,sampleWishes:true}).payload;
  for (const d of Object.values(p.variants)) { assert.equal(d.child,''); assert.equal(d.age,null); assert.equal(d.target,null);assert.deepEqual(d.program,[]);assert.deepEqual(d.wishes,[]);for(const key of ['rsvp','gift','gallery','contacts','story']) assert.ok(!(key in d)); }
  assert.equal(p.music.enabled,false);assert.equal(p.music.url,'');assert.equal(templateById('taklifla-asalari').published,true);assert.deepEqual(templateById('taklifla-asalari').supportedEventTypes,['birthday']);
  const runnable=fs.readFileSync(path.join(pkg,'index.html'),'utf8')+fs.readFileSync(path.join(pkg,'bridge.js'),'utf8');
  assert.doesNotMatch(runnable,/Asila|Koşebaşı|2026-07-14|assets\/music.mp3|localStorage|cloudflareinsights|fonts.googleapis/);
});
}
