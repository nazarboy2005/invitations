import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { createTemplatePreviewSample } from "../../modules/catalog/preview-sample";
import { makeEnvelopePayload } from "./adapter";
import { templateById } from "@taklifnoma/contracts";

const folder=resolve('apps/web/public/templates/taklifla-muhrli-maktub');
const read=(file:string)=>readFileSync(resolve(folder,file));
const sha=(data:Buffer|string)=>createHash('sha256').update(data).digest('hex');

test('all exact source images/fonts and captured CSS are hash verified',()=>{
  const manifest=JSON.parse(read('dependencies.json').toString());
  assert.equal(sha(readFileSync(manifest.capture)),manifest.captureSha256);
  assert.equal(sha(read('source/template.css')),manifest.sourceCssSha256);
  assert.equal(manifest.assets.length,10);assert.equal(manifest.fonts.length,12);
  for(const asset of [...manifest.assets,...manifest.fonts])assert.equal(sha(read(asset.file)),asset.sha256,asset.file);
});
test('contract mapping preserves authored values, stable order, guest greeting and timezone without mutation',()=>{
  const invitation=createTemplatePreviewSample('taklifla-muhrli-maktub');
  assert.equal(templateById('taklifla-muhrli-maktub')?.published,true);
  invitation.content['uz-Latn'].personalGreeting='Aziz {name}!';
  invitation.startsAt='2027-06-12T17:00';invitation.timezone='Asia/Tashkent';
  invitation.program=[{id:'second',time:'19:00'},{id:'first',time:'18:00'}];
  invitation.content['uz-Latn'].programTitles={first:'Birinchi',second:'Ikkinchi'};
  invitation.templateData['taklifla-muhrli-maktub']={flowersNote:{'uz-Latn':'Gullar o‘rniga tilak qoldiring.'}};
  const before=JSON.stringify(invitation);
  const {payload:p}=makeEnvelopePayload(invitation,'uz-Latn',{invitationId:'authored-id',guestName:'Dilnoza',guestToken:'opaque',preview:false});
  const d=p.variants['uz-Latn'];
  assert.equal(d.greeting,'Aziz Dilnoza!');assert.equal(p.target,Date.parse('2027-06-12T12:00Z'));
  assert.deepEqual(d.program.map(p=>p.id),['second','first']);
  assert.equal(d.program[0].title,'Ikkinchi');assert.equal(p.guestToken,'opaque');
  assert.equal(d.flowersNote,'Gullar o‘rniga tilak qoldiring.');
  assert.equal(JSON.stringify(invitation),before);assert.equal(p.preview,false);
});
test('empty creator content cannot acquire source names, dates, venue, events or media',()=>{
  const invitation=createTemplatePreviewSample('taklifla-muhrli-maktub');
  invitation.startsAt='';invitation.program=[];invitation.contacts.phoneNumber='';
  invitation.venue={latitude:null,longitude:null,mapUrl:''};
  invitation.music={enabled:false,url:'',filename:'',assetId:null};
  for(const content of Object.values(invitation.content))Object.assign(content,{people:[],venueName:'',address:'',landmark:'',message:''});
  const p=makeEnvelopePayload(invitation,'uz-Latn',{invitationId:'blank'}).payload;
  assert.equal(p.target,null);assert.equal(p.variants['uz-Latn'].date,'');assert.deepEqual(p.variants['uz-Latn'].people,[]);
  assert.deepEqual(p.variants['uz-Latn'].program,[]);assert.equal(p.variants['uz-Latn'].mapGoogle,'');
  assert.equal(p.phone,'');assert.equal(p.music.url,'');
  const source=read('index.html').toString()+read('bridge.js').toString();
  assert.doesNotMatch(source,/Shahzod|Robiya|Navruz Hall|envDemoWishes|cloudflareinsights|api\/v1/);
  assert.doesNotMatch(source,/partySize|headcount|receipt|cardNumber/);
});
