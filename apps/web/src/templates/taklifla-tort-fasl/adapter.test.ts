import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createInvitation } from "@taklifnoma/contracts";
import { makeFasllarPayload } from "./adapter";

test("Fasllar preserves authored content and IDs without mutating invitations or including source-absent private fields", () => {
  const invitation = createInvitation("taklifla-tort-fasl");
  invitation.startsAt = "2027-06-12T17:00";
  invitation.timezone = "Asia/Tashkent";
  invitation.content["uz-Latn"].people = ["Muallif", "Ism"];
  invitation.content["uz-Latn"].personalGreeting = "Hurmatli {name}!";
  invitation.program = [
    { id: "stable-second", time: "18:30" },
    { id: "stable-first", time: "17:00" },
  ];
  invitation.content["uz-Latn"].programTitles = {
    "stable-second": "Bazm",
    "stable-first": "Marosim",
  };
  invitation.content["uz-Latn"].programDescriptions = {
    "stable-first": "Muallif matni",
  };
  invitation.venue.latitude = 41;
  invitation.venue.longitude = 69;
  invitation.gift.cardNumber = "private-unused-card";
  const before = JSON.stringify(invitation);
  const { payload } = makeFasllarPayload(invitation, "uz-Latn", "<Mehmon>", {
    invitationId: "test-only",
    guestToken: "opaque",
  });
  const v = payload.variants["uz-Latn"];
  assert.equal(payload.instant, Date.parse("2027-06-12T12:00:00Z"));
  assert.equal(v.time, "17:00");
  assert.equal(v.greeting, "Hurmatli <Mehmon>!");
  assert.deepEqual(
    v.program.map((row) => row.id),
    ["stable-second", "stable-first"],
  );
  assert.equal(v.program[1].description, "Muallif matni");
  assert.match(payload.mapUrl, /query=41,69/);
  assert.equal(JSON.stringify(invitation), before);
  assert.ok(!JSON.stringify(payload).includes("private-unused-card"));
  assert.equal(payload.guestToken, "opaque");
});

test("Fasllar blank input stays blank and has no demo names, date, phone or media", () => {
  const invitation = createInvitation("taklifla-tort-fasl");
  invitation.startsAt = "";
  invitation.content["uz-Latn"].people = [];
  const { payload } = makeFasllarPayload(invitation, "uz-Latn", "", {
    invitationId: "blank",
  });
  assert.equal(payload.instant, null);
  assert.equal(payload.dateNumeric, "");
  assert.deepEqual(payload.variants["uz-Latn"].people, []);
  assert.equal(payload.phone, "");
  assert.equal(payload.music.url, "");
  assert.doesNotMatch(
    JSON.stringify(payload),
    /Timur|Madina|Versal|2026-09-26|998901234567/,
  );
});

test("Fasllar artwork and source CSS match the untouched capture; runtime is isolated and analytics-free", () => {
  const base = resolve("apps/web/public/templates/taklifla-tort-fasl");
  const deps = JSON.parse(
    readFileSync(resolve(base, "dependencies.json"), "utf8"),
  );
  const sha = (file: string) =>
    createHash("sha256").update(readFileSync(file)).digest("hex");
  assert.equal(sha(resolve(deps.source)), deps.sourceSha256);
  for (const asset of deps.assets)
    assert.equal(sha(resolve(base, asset.file)), asset.sha256);
  for (const font of deps.fonts)
    assert.equal(sha(resolve(base, font.file)), font.sha256);
  const original = readFileSync(resolve(deps.source), "utf8");
  assert.equal(
    readFileSync(resolve(base, "source/template.css"), "utf8").replaceAll(
      "\r\n",
      "\n",
    ),
    original.match(/<style>([\s\S]*?)<\/style>/)![1].replaceAll("\r\n", "\n"),
  );
  const runtime = [
    "index.html",
    "source/motion.js",
    "platform-adapter.js",
    "labels.js",
  ]
    .map((file) => readFileSync(resolve(base, file), "utf8"))
    .join("\n");
  assert.doesNotMatch(
    runtime,
    /cloudflareinsights|localStorage|fsDemoWishes|\/api\/v1\/public|Timur|Madina|Versal|998901234567/,
  );
  assert.equal(deps.registered, true);
  assert.equal(deps.published, true);
});

test("Fasllar canonical wish samples are preview only",()=>{
const invitation=createInvitation("taklifla-tort-fasl");
const preview=makeFasllarPayload(invitation,"uz-Latn","",{invitationId:"qa",preview:true,sampleWishes:true}).payload;
assert.equal(preview.variants["uz-Latn"].sampleWishes.length,3);
assert.ok(preview.variants["uz-Latn"].sampleWishes.every(w=>w.message));
assert.deepEqual(makeFasllarPayload(invitation,"uz-Latn","",{invitationId:"real",sampleWishes:true}).payload.variants["uz-Latn"].sampleWishes,[]);
});
