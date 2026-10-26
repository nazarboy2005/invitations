import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";
const root=resolve("apps/web/public/templates/love-sakura");
const sourceArchive=process.env.TAKLIFNOMA_CHORLOVE_SOURCE_ARCHIVE;
const sourcePath=sourceArchive?join(sourceArchive,"templates/love-sakura/preview-frame.html"):"Invitations - this folder will be removed from production/Chorlove/Web invitations/templates/love-sakura/preview-frame.html";
const routePath=sourceArchive?join(sourceArchive,"_next/static/chunks/0hdebqnzl-9~n.js"):"Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/0hdebqnzl-9~n.js";
const source=existsSync(sourcePath)?readFileSync(sourcePath):null;
const packagedSource=readFileSync(join(root,"source/preview-frame.html"));
const manifest=JSON.parse(readFileSync(join(root,"source-assets.provenance.json"),"utf8"));
const html=readFileSync(join(root,"index.html"),"utf8"),bridge=readFileSync(join(root,"bridge.js"),"utf8");
const adapter=readFileSync(join(root,"adapter.css"),"utf8");
test("Love Sakura preserves its full captured page and source asset checksums",()=>{
 if(source){assert.equal(createHash("sha256").update(source).digest("hex"),manifest.sourceSnapshot.sha256);assert.equal(manifest.sourceSnapshot.bytes,source.length);assert.equal(packagedSource.toString("utf8").replaceAll("\r\n","\n"),source.toString("utf8"));}
 else {assert.equal((packagedSource.toString("utf8").match(/<section\b/g)||[]).length,10);assert.equal(manifest.sourceSnapshot.bytes,55773);assert.match(manifest.sourceSnapshot.sha256,/^[a-f0-9]{64}$/);}
 const sourceSections=[...packagedSource.toString("utf8").matchAll(/<section\b.*?<\/section>/gs)].map(([section])=>section);
 const packagedSections=[...html.matchAll(/<section\b.*?<\/section>/gs)].map(([section])=>section);
 assert.equal((packagedSource.toString("utf8").match(/\/images\/love-sakura\//g)||[]).length,35);
 assert.deepEqual([...sourceSections[6].matchAll(/src="\/images\/love-sakura\/([^"]+)"/g)].map(([,file])=>file),["hero-couple.webp","bride.webp","groom.webp","hero-couple.webp","bride.webp","groom.webp"]);
 assert.doesNotMatch(sourceSections[5],/<img\b/);assert.doesNotMatch(sourceSections[4],/\/(?:bride|groom|hero-couple)\.webp/);
 assert.equal((html.match(/<section\b/g)||[]).length,10);
 assert.match(sourceSections[9],/Wedding Gift/);assert.match(sourceSections[9],/Bank Kartasi/);assert.match(sourceSections[9],/8600 0000 0000 0000/);assert.match(sourceSections[9],/Amplop Digital/);
 assert.match(packagedSections[9],/Wedding Gift/);assert.match(packagedSections[9],/Bank Kartasi/);assert.match(bridge,/function setupGift\(\).*?hide\(sections\[9\],!gift\.enabled\)/s);assert.match(bridge,/gift\.cardNumber\|\|""/);assert.match(bridge,/gift\.cardHolder\|\|""/);
 for(const asset of manifest.assets){const bytes=readFileSync(join(root,"assets",asset.file));assert.equal(bytes.length,asset.bytes);assert.equal(createHash("sha256").update(bytes).digest("hex"),asset.sha256);assert.match(html,new RegExp(`/templates/love-sakura/assets/${asset.file.replaceAll(".","\\.")}`));}
 assert.equal(manifest.assets.length,10);
 const textureRefs=html.match(/url\('\/templates\/love-sakura\/assets\/bg-texture\.png'\)/g)||[];
 assert.equal(textureRefs.length,10);
 assert.doesNotMatch(html,/\/images\/love-sakura\/bg-texture\.png/);
 const texture=readFileSync(join(root,"assets/bg-texture.png"));
 assert.equal(texture.subarray(0,4).toString("hex"),"ffd8ffee");
 const textureProvenance=manifest.assets.find((asset:any)=>asset.file==="bg-texture.png");
 assert.deepEqual([textureProvenance.bytes,textureProvenance.sha256,textureProvenance.contentType,textureProvenance.detectedMimeType],[119188,"0a315a7e13dcbede9dfc8829a6c3eedf02e540264f8f37223ab2c2a2957dc30a","image/png","image/jpeg"]);
 const catalog=readFileSync("packages/contracts/src/index.ts","utf8");
 assert.match(catalog,/id: "love-sakura"[\s\S]*?previewImage: "\/templates\/love-sakura\/catalog-opening\.png"/);
 const opening=readFileSync(join(root,"catalog-opening.png"));
 assert.deepEqual([opening.readUInt32BE(16),opening.readUInt32BE(20)],[900,1444]);
 assert.equal(createHash("sha256").update(opening).digest("hex"),manifest.catalogArtwork.sha256);
});
test("Love Sakura restores the captured RSVP and music motion",{skip:!existsSync(routePath)},()=>{
 const routeModule=readFileSync(routePath,"utf8");
 assert.equal(createHash("sha256").update(routeModule).digest("hex"),manifest.sourceMotion.sha256);
 assert.match(routeModule,/initial:\{opacity:0,y:15\},whileInView:\{opacity:1,y:0\},viewport:\{amount:\.2\},transition:\{duration:\.6\}/);
 assert.match(routeModule,/whileHover:\{scale:1\.1\},whileTap:\{scale:\.9\}/);
 assert.match(routeModule,/navigator\.clipboard\.writeText\(s\.replace\(\/\\s\+\/g,""\)\)/);
 assert.equal((html.match(/style="opacity:0;transform:translateY\(15px\)"/g)||[]).length,2);
 assert.match(bridge,/sourceRevealTargets=all\('\[style\*="opacity:0"\]\[style\*="translateY\(15px\)"\]'\)/);
 assert.match(bridge,/\{threshold:\.2\}/);assert.match(bridge,/if\(!entry\.isIntersecting&&!el\.dataset\.lsSourceSeen\)return/);assert.match(bridge,/if\(entry\.isIntersecting\)el\.dataset\.lsSourceSeen="true"/);assert.match(bridge,/duration:600,easing:"ease-out",fill:"both"/);
 assert.match(bridge,/el\.style\.opacity="1";el\.style\.transform="none"/);
 assert.match(bridge,/setupAttendance\(p\)/);assert.match(bridge,/hide\(section,rsvp\.enabled===false\)/);assert.match(bridge,/data-ls-generated/);
 assert.match(adapter,/\.ls-music:hover\{transform:scale\(1\.1\)\}/);
 assert.match(adapter,/\.ls-music:active\{transform:scale\(\.9\)\}/);
 assert.match(adapter,/animation:ls-source-pulse 2s cubic-bezier\(\.4,0,\.6,1\) infinite/);
 assert.match(bridge,/q\('button\[aria-label="Toggle music"\]'\)/);assert.match(bridge,/lucide-volume-2/);assert.match(bridge,/audio\.muted=true/);assert.match(bridge,/onpointerenter=/);assert.match(bridge,/onpointerdown=/);
 assert.match(bridge,/audio\.play\(\)\.then\(fadeIn\)\.catch\(\(\)=>\{audio\.pause\(\);setMuted\(true\);\}\)/);assert.match(bridge,/audio\.dataset\.lsUserPaused==="true"/);assert.match(bridge,/audio\.dataset\.lsMusicInitialized/);assert.match(bridge,/p\.data\?\.music\?\.enabled===false\?""/);assert.match(bridge,/const sourceChanged=audio\.getAttribute\("src"\)!==\(musicUrl\|\|null\)/);
});
test("Love Sakura package removes sample site runtime and binds the shared contract",()=>{
 assert.match(html,/data-chorlove-template="love-sakura" hidden/);assert.doesNotMatch(html,/_next\/image|_next\/static\/chunks\/[\w~.-]+\.js/);
 assert.match(bridge,/const gallery=\(data\.gallery\|\|\[\]\)\.filter\(item=>typeof item\?\.src==="string"&&item\.src\.trim\(\)\)/);assert.match(bridge,/hide\(sections\[6\],!gallery\.length\)/);assert.match(bridge,/hide\(card,true\)/);
 assert.doesNotMatch(html,/chorlove\.uz\/music|Patrick Watson|_next\/static\/chunks\/[0-9a-z~.-]+\.js|<script[^>]+src="https?:/i);
 for(const field of ["groom","bride","dateTime","venue","program","story","gallery","wishes","rsvp","toyona","enabledLocales","reducedMotion","music"])assert.ok(bridge.includes(field),`missing shared field ${field}`);
 assert.match(bridge,/api\/public\/invitations/);
 const contract=readFileSync("packages/contracts/src/index.ts","utf8"),migration=readFileSync("packages/database/migrations/0116_register_love_sakura.sql","utf8");
 assert.match(contract,/id: "love-sakura"[\s\S]*?published: true/);assert.match(migration,/VALUES \('love-sakura', 'Love Sakura', 15000000, 'UZS', false\)/);
 const publishMigration=readFileSync("packages/database/migrations/0149_publish_love_sakura.sql","utf8");assert.match(publishMigration,/template_id = 'love-sakura' AND category_id = 'wedding'/);assert.match(publishMigration,/template_id = 'love-sakura' AND event_type = 'wedding'/);assert.match(publishMigration,/SET published = true/);
});
test("Love Sakura keeps source interactions while adapting countdown, gift, optional wishes, and RSVP values",()=>{
 const sections=[...packagedSource.toString("utf8").matchAll(/<section\b.*?<\/section>/gs)].map(([section])=>section);
 assert.equal(sections.length,10);assert.match(sections[3],/grid-cols-4/);assert.equal((sections[3].match(/<button\b/g)||[]).length,1);assert.match(sections[8],/role="radiogroup"/);
 assert.match(bridge,/function setupSourceCalendar\(date,venue\)/);assert.doesNotMatch(bridge,/data-ls-calendar|data-ls-countdown|setupContacts|setupCountdownCover/);
 assert.match(bridge,/function setupCountdown\(date\).*?grid=q\("\.grid\.grid-cols-4",sec\)/s);
 assert.match(bridge,/wishesEnabled=data\.wishesEnabled!==false;hide\(sections\[7\],!wishesEnabled\)/);
 assert.match(bridge,/partySize:answer==="no"\?0:1/);assert.doesNotMatch(bridge,/partySize:answer==="no"\?0:count|counterLabel|updateCount/);
 assert.match(bridge,/navigator\.clipboard\.writeText\(gift\.cardNumber\.replace\(\/\\s\+\/g,""\)\)/);
});
