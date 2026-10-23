import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";
const root=resolve("apps/web/public/templates/love-sakura");
const source=readFileSync(join(root,"source/preview-frame.html"));
const manifest=JSON.parse(readFileSync(join(root,"source-assets.provenance.json"),"utf8"));
const html=readFileSync(join(root,"index.html"),"utf8"),bridge=readFileSync(join(root,"bridge.js"),"utf8");
test("Love Sakura preserves its full captured page and source asset checksums",()=>{
 assert.equal(createHash("sha256").update(source).digest("hex"),manifest.sourceSnapshot.sha256);
 assert.equal(manifest.sourceSnapshot.bytes,source.length);
 assert.equal((html.match(/<section\b/g)||[]).length,10);
 for(const asset of manifest.assets){const bytes=readFileSync(join(root,"assets",asset.file));assert.equal(bytes.length,asset.bytes);assert.equal(createHash("sha256").update(bytes).digest("hex"),asset.sha256);assert.match(html,new RegExp(`/templates/love-sakura/assets/${asset.file.replaceAll(".","\\.")}`));}
 assert.equal(manifest.assets.length,9);
});
test("Love Sakura package removes sample site runtime and binds the shared contract",()=>{
 assert.match(html,/data-chorlove-template="love-sakura" hidden/);assert.doesNotMatch(html,/_next\/image|_next\/static\/chunks\/[\w~.-]+\.js/);
 assert.doesNotMatch(html,/chorlove\.uz\/music|Patrick Watson|_next\/static\/chunks\/[0-9a-z~.-]+\.js|<script[^>]+src="https?:/i);
 for(const field of ["groom","bride","dateTime","venue","program","story","gallery","wishes","rsvp","toyona","contacts","enabledLocales","reducedMotion","music"])assert.ok(bridge.includes(field),`missing shared field ${field}`);
 assert.match(bridge,/api\/public\/invitations/);
 const contract=readFileSync("packages/contracts/src/index.ts","utf8"),migration=readFileSync("packages/database/migrations/0116_register_love_sakura.sql","utf8");
 assert.match(contract,/id: "love-sakura"[\s\S]*?published: false/);assert.match(migration,/VALUES \('love-sakura', 'Love Sakura', 15000000, 'UZS', false\)/);
});
