import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const root = new URL("../apps/web/public/templates/wedivo-lanskap-yang-hidup/", import.meta.url);
const read = (path: string) => readFile(new URL(path, root), "utf8");
const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");

test("preserves the original captured landscape engine and exact local dependency bytes", async () => {
  const provenance = JSON.parse(await read("source/provenance.json"));
  const capture = await readFile(new URL(`../${provenance.capture}`, import.meta.url));
  assert.equal(hash(capture), provenance.captureSha256);
  const source = capture.toString("utf8");
  const engine = source.slice(source.indexOf("  var LAND = "), source.indexOf("  /* ================= DATA & WAKTU"));
  const packaged = await read("source/template.js");
  assert.equal(hash(engine), provenance.landscapeEngineSha256);
  assert.ok(packaged.includes(engine), "the complete procedural scene engine must be unchanged");
  assert.equal(provenance.dependencies.length, 33);
  for (const dependency of provenance.dependencies) {
    const bytes = await readFile(new URL(dependency.file, root));
    assert.equal(bytes.length, dependency.bytes);
    assert.equal(hash(bytes), dependency.sha256);
  }
});

test("runs standalone without provider runtime, API key, demo identities or remote font/image loads", async () => {
  const [html, script, css, fonts] = await Promise.all([read("index.html"), read("source/template.js"), read("source/template.css"), read("assets/fonts.css")]);
  assert.doesNotMatch(html, /wedivo-parameters|wedivo-preview-stub|sample-rundown|AIza|Aulia|Bagas|Sastro|Karim|Sukamaju|Mr\. &amp;/);
  assert.doesNotMatch(html, /(?:src|poster|data-src)="https?:/);
  assert.doesNotMatch(script, /wedivo\.id|uploads\/|prewedding\//);
  assert.doesNotMatch(css + fonts, /https?:\/\//);
  for (const font of ["Amiri", "Fragment Mono", "Geologica", "Noto Serif Display", "Waiting for the Sunrise"]) assert.ok(fonts.includes(font));
});

test("only real platform RSVP/wishes responses trigger success and moderation stays private", async () => {
  const script = await read("platform-adapter.js");
  assert.match(script, /partySize: status === "yes" \? 1 : 0/);
  assert.match(script, /\/rsvp`/);
  assert.match(script, /\/wishes`/);
  assert.match(script, /!current \|\| current\.preview/);
  assert.match(script, /if \(!response\.ok\) throw new Error\("rsvp failed"\)/);
  assert.match(script, /if \(!response\.ok\) throw new Error\("wish failed"\)/);
  assert.match(script, /lanskapText\("moderated"\)/);
  assert.doesNotMatch(script, /wishes\(.*fields\.get/);
});

test("documents unsupported source-only checkout/video/check-in without inventing card-number controls", async () => {
  const [html, script] = await Promise.all([read("index.html"), read("platform-adapter.js")]);
  for (const section of ["hadiah", "video", "rambu"]) assert.match(script, new RegExp(`section\\("${section}", false\\)`));
  assert.match(script, /show\("checkin", false\)/);
  assert.match(html, /id="gift-form"/); // Source structure remains available for future approved support.
  assert.doesNotMatch(script + html, /cardNumber|cardHolder|receipt-upload|\/payments/);
});

test("reuses repeatable source sections, event timezone, media captions and reduced-motion implementation", async () => {
  const [script, css] = await Promise.all([read("source/template.js"), read("platform.css")]);
  assert.match(script, /win\.lanskapPlatform\.story\.length/);
  assert.match(script, /win\.lanskapPlatform\.colors\.length/);
  assert.match(script, /li\.dataset\.itemId = it\.id/);
  assert.match(script, /win\.lanskapPlatform\.gallery\[vIdx\]\.caption/);
  assert.match(script, /Date\.UTC\(o\.y, o\.m - 1, o\.d, H, M\) - TZ\.o \* 3600000/);
  assert.match(script, /if \(reduce \|\| !\("IntersectionObserver" in win\)\)/);
  assert.match(css, /\.lanskap-reduced/);
  assert.match(script, /win\.lanskapPlatform\.guestPaused/);
});

test("exposes four locale dictionaries and leaves shared registration/publication to coordinator", async () => {
  const [locales, provenance] = await Promise.all([read("locales.js"), read("source/provenance.json")]);
  assert.match(locales, /\["uz-Latn", "uz-Cyrl", "en", "ru"\]/);
  assert.match(locales, /lanskapFormatDate/);
  assert.equal(JSON.parse(provenance).publicationReady, false);
});

test("typed adapter preserves authored content, fractional event timezone and preview-only isolation", async () => {
  const cwd = fileURLToPath(new URL("../", import.meta.url));
  const source = `
    const assert = require('node:assert/strict');
    require.extensions['.css'] = () => {};
    (async () => {
      const { makeLanskapPayload } = await import('./apps/web/src/templates/wedivo-lanskap-yang-hidup/adapter.ts');
      const { createInvitation } = await import('./packages/contracts/src/index.ts');
      const invitation = createInvitation('wedivo-lanskap-yang-hidup');
      invitation.startsAt = '2027-06-12T17:00';
      invitation.timezone = 'Asia/Kolkata';
      invitation.content['uz-Latn'].people = ['Muallif kuyov', 'Muallif kelin'];
      invitation.content['uz-Latn'].personalGreeting = 'Hurmatli {name}!';
      const before = JSON.stringify(invitation);
      const real = makeLanskapPayload(invitation, 'uz-Latn', 'Nigora', { invitationId: 'test', preview: false, sampleWishes: true });
      assert.equal(real.payload.time, '17:00');
      assert.equal(real.payload.timezone.o, 5.5);
      assert.equal(real.payload.data.groom, 'Muallif kuyov');
      assert.equal(real.payload.data.bride, 'Muallif kelin');
      assert.equal(real.payload.data.greeting, 'Hurmatli Nigora!');
      assert.deepEqual(real.payload.data.wishes, []);
      assert.equal(real.payload.previewMedia, null);
      assert.ok(real.payload.data.gallery.every(item => !item.src));
      const sample = makeLanskapPayload(invitation, 'uz-Latn', '', { invitationId: 'test', preview: true, sampleWishes: true });
      assert.equal(sample.payload.data.gallery.length, 6);
      assert.equal(sample.payload.data.wishes.length, 3);
      assert.ok(sample.payload.previewMedia);
      assert.equal(JSON.stringify(invitation), before);
      invitation.gallery = [{ id: 'upload', url: '/uploads/own.jpg', alt: 'Alt', caption: 'Caption' }];
      const authored = makeLanskapPayload(invitation, 'uz-Latn', '', { invitationId: 'test', preview: true, sampleWishes: true });
      assert.deepEqual(authored.payload.data.gallery, [{ id: 'upload', src: '/uploads/own.jpg', alt: 'Alt', caption: 'Caption' }]);
      assert.equal(authored.payload.previewMedia, null);
    })().catch(error => { console.error(error); process.exitCode = 1; });
  `;
  await promisify(execFile)(process.execPath, ["--import", "tsx", "-e", source], {
    cwd,
    env: { ...process.env, TSX_TSCONFIG_PATH: `${cwd}/apps/web/tsconfig.json` },
    timeout: 30000,
  });
});
