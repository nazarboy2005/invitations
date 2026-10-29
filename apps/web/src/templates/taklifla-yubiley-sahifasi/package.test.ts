import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {createInvitation,LOCALES,invitationSchema} from "@taklifnoma/contracts";
import {createTemplatePreviewSample} from "@/modules/catalog/preview-sample";
import {makeYubileySahifasiPayload} from "./adapter";
const base=resolve("apps/web/public/templates/taklifla-yubiley-sahifasi");
const read=(file:string)=>readFileSync(resolve(base,file));const hash=(b:Buffer|string)=>createHash("sha256").update(b).digest("hex");
const meta=JSON.parse(read("source/provenance.json").toString());
test("untouched capture, complete CSS and exact hero/font dependencies",()=>{
 const original=readFileSync(meta.source);assert.equal(hash(original),meta.sourceSha256);
 const css=[...original.toString().matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)][0][1];
 assert.equal(read("source/template.css").toString().replaceAll("\r\n","\n"),css.replaceAll("\r\n","\n"));
 for(const item of [meta.hero,...meta.fonts])assert.equal(hash(read(item.path)),item.sha256,item.path);
 const runtime=read("index.html").toString()+read("bridge.js").toString();assert.doesNotMatch(runtime,/Sharq Texnologiya|Bekzod Karimov|localStorage|cloudflareinsights|2026-07-12|party-size/);
});
test("all locales, source-specific editable fields, stable IDs and shared maps",()=>{
 const sample=createTemplatePreviewSample("taklifla-yubiley-sahifasi");const before=JSON.stringify(sample);
 for(const locale of LOCALES){const p=makeYubileySahifasiPayload(sample,locale,{invitationId:"qa",preview:true,guestName:"Guest"}).payload;
 assert.equal(p.years,10);assert.equal(p.statistics.length,4);assert.equal(p.story.length,3);assert.equal(p.story[0].year,"2017");assert.equal(p.mapUrl,sample.venue.mapUrl);assert.ok(p.founderRole);assert.ok(p.greeting.includes("Guest"));}
 assert.equal(JSON.stringify(sample),before);
 const blank=createInvitation("taklifla-yubiley-sahifasi");const p=makeYubileySahifasiPayload(blank,"uz-Latn",{invitationId:"real"}).payload;
 assert.equal(p.years,null);assert.deepEqual(p.statistics,[]);assert.deepEqual(p.story,[]);assert.equal(p.mapUrl,"");assert.equal(p.company,"");assert.equal(p.music.url,"");
 blank.templateData["taklifla-yubiley-sahifasi"]={years:1000};assert.equal(invitationSchema.safeParse(blank).success,false);
});
