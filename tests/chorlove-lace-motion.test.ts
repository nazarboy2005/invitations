import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

const sourceRoot = "Invitations - this folder will be removed from production/Chorlove/Web invitations";
const packageRoot = "apps/web/public/templates/lace";
const sha256 = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const moduleBytes = readFileSync(`${sourceRoot}/_next/static/chunks/0j~ix342hy.sg.js`);
const sourceModule = moduleBytes.toString("utf8");
const sourceCapture = readFileSync(`${sourceRoot}/templates/lace/preview-frame.html`);
const packedCapture = readFileSync(`${packageRoot}/source/preview-frame.html`);
const bridge = readFileSync(`${packageRoot}/bridge.js`, "utf8");
const css = readFileSync(`${packageRoot}/adapter.css`, "utf8");

test("Lace source capture and motion module remain tied to the archived originals", () => {
  assert.equal(sha256(moduleBytes), "f8f02fc84097ac74933c62abdbf3f3ef676621bdc450f0686ac106fea836ed69");
  assert.equal(sha256(sourceCapture), "5a73d67ed902928ebc6837d90dca7a97dfc2562985512279b47678022c0791db");
  assert.equal(packedCapture.toString("utf8").replace(/\r\n/g, "\n"), sourceCapture.toString("utf8").replace(/\r\n/g, "\n"));
});

test("Lace package mirrors source opening and reveal choreography", () => {
  assert.match(sourceModule, /amount:\.15,margin:"0px 0px -60px 0px"/);
  assert.match(sourceModule, /duration:\.9,ease:\[\.22,1,\.36,1\]/);
  assert.match(sourceModule, /amount:\.4/);
  assert.match(sourceModule, /duration:\.6,delay:\.05\*l/);
  assert.match(sourceModule, /duration:2,ease:"easeInOut"/);
  assert.match(bridge, /video\.currentTime>0\.05/);
  assert.match(bridge, /remaining<1\.8/);
  assert.match(bridge, /remaining<1\)/);
  assert.match(bridge, /window\.setTimeout\(show,800\)/);
  assert.match(bridge, /threshold: 0\.4/);
  assert.match(bridge, /threshold: 0\.15, rootMargin: "0px 0px -60px 0px"/);
  assert.match(css, /opacity \.9s cubic-bezier\(\.22,1,\.36,1\)/);
  assert.match(css, /transition:opacity \.6s cubic-bezier\(\.25,\.1,\.25,1\)/);
  assert.match(css, /\[data-lace-opening\]\{transition:opacity 2s ease-in-out/);
});

test("catalog cover is the original portrait opening poster", () => {
  const poster = readFileSync(`${packageRoot}/assets/bellagio-2-poster.jpg`);
  assert.equal(sha256(poster), "9918bd098acc3620586090b3e6f1eb44dc8876de487849f23c0e272154f5ffff");
  const contracts = readFileSync("packages/contracts/src/index.ts", "utf8");
  const laceRecord = contracts.match(/id: "lace",[\s\S]{0,700}?\n  },/);
  assert.ok(laceRecord, "Lace remains registered in the typed catalog");
  assert.match(laceRecord[0], /previewImage: "\/templates\/lace\/assets\/bellagio-2-poster\.jpg"/);
});

