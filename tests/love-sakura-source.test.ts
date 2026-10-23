import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";
const root=resolve("apps/web/public/templates/love-sakura");
const source=readFileSync("Invitations - this folder will be removed from production/Chorlove/Web invitations/templates/love-sakura/preview-frame.html");
const packagedSource=readFileSync(join(root,"source/preview-frame.html"));
const manifest=JSON.parse(readFileSync(join(root,"source-assets.provenance.json"),"utf8"));
const html=readFileSync(join(root,"index.html"),"utf8"),bridge=readFileSync(join(root,"bridge.js"),"utf8");
const adapter=readFileSync(join(root,"adapter.css"),"utf8");
test("Love Sakura preserves its full captured page and source asset checksums",()=>{
 assert.equal(createHash("sha256").update(source).digest("hex"),manifest.sourceSnapshot.sha256);
 assert.equal(manifest.sourceSnapshot.bytes,source.length);
 assert.equal(packagedSource.toString("utf8").replaceAll("\r\n","\n"),source.toString("utf8"));
 assert.equal((html.match(/<section\b/g)||[]).length,10);
 for(const asset of manifest.assets){const bytes=readFileSync(join(root,"assets",asset.file));assert.equal(bytes.length,asset.bytes);assert.equal(createHash("sha256").update(bytes).digest("hex"),asset.sha256);assert.match(html,new RegExp(`/templates/love-sakura/assets/${asset.file.replaceAll(".","\\.")}`));}
 assert.equal(manifest.assets.length,9);
});
test("Love Sakura restores the captured RSVP and music motion",()=>{
 const routeModule=readFileSync("Invitations - this folder will be removed from production/Chorlove/Web invitations/_next/static/chunks/0hdebqnzl-9~n.js","utf8");
 assert.equal(createHash("sha256").update(routeModule).digest("hex"),manifest.sourceMotion.sha256);
 assert.match(routeModule,/initial:\{opacity:0,y:15\},whileInView:\{opacity:1,y:0\},viewport:\{amount:\.2\},transition:\{duration:\.6\}/);
 assert.match(routeModule,/whileHover:\{scale:1\.1\},whileTap:\{scale:\.9\}/);
 assert.equal((html.match(/style="opacity:0;transform:translateY\(15px\)"/g)||[]).length,2);
 assert.match(bridge,/sourceRevealTargets=all\('\[style\*="opacity:0"\]\[style\*="translateY\(15px\)"\]'\)/);
 assert.match(bridge,/\{threshold:\.2\}/);assert.match(bridge,/duration:600,easing:"ease-out",fill:"both"/);
 assert.match(bridge,/el\.style\.opacity="1";el\.style\.transform="none"/);
 assert.match(bridge,/setupAttendance\(p\)/);assert.match(bridge,/hide\(section,rsvp\.enabled===false\)/);assert.match(bridge,/data-ls-generated/);
 assert.match(adapter,/\.ls-music:hover\{transform:scale\(1\.1\)\}/);
 assert.match(adapter,/\.ls-music:active\{transform:scale\(\.9\)\}/);
 assert.match(adapter,/animation:ls-source-pulse 2s cubic-bezier\(\.4,0,\.6,1\) infinite/);
 assert.match(bridge,/q\('button\[aria-label="Toggle music"\]'\)/);assert.match(bridge,/lucide-volume-2/);assert.match(bridge,/audio\.muted=true/);assert.match(bridge,/onpointerenter=/);assert.match(bridge,/onpointerdown=/);
});
test("Love Sakura package removes sample site runtime and binds the shared contract",()=>{
 assert.match(html,/data-chorlove-template="love-sakura" hidden/);assert.doesNotMatch(html,/_next\/image|_next\/static\/chunks\/[\w~.-]+\.js/);
 assert.match(bridge,/hide\(sections\[6\],!gallery\.length\)/);assert.match(bridge,/hide\(card,true\)/);
 assert.doesNotMatch(html,/chorlove\.uz\/music|Patrick Watson|_next\/static\/chunks\/[0-9a-z~.-]+\.js|<script[^>]+src="https?:/i);
 for(const field of ["groom","bride","dateTime","venue","program","story","gallery","wishes","rsvp","toyona","contacts","enabledLocales","reducedMotion","music"])assert.ok(bridge.includes(field),`missing shared field ${field}`);
 assert.match(bridge,/api\/public\/invitations/);
 const contract=readFileSync("packages/contracts/src/index.ts","utf8"),migration=readFileSync("packages/database/migrations/0116_register_love_sakura.sql","utf8");
 assert.match(contract,/id: "love-sakura"[\s\S]*?published: false/);assert.match(migration,/VALUES \('love-sakura', 'Love Sakura', 15000000, 'UZS', false\)/);
});
