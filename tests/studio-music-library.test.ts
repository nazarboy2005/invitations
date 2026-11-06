import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { CLASSICAL_MUSIC } from "../apps/web/src/modules/studio/classical-music";
import { isBundledMusicUrl } from "../apps/web/src/server/publication";

const root = process.cwd();

test("Studio classical library contains twelve documented instrumental tracks", () => {
  assert.equal(CLASSICAL_MUSIC.length, 12);
  for (const track of CLASSICAL_MUSIC) {
    assert.ok(track.composer, `${track.id} has a composer`);
    assert.ok(track.performer, `${track.id} has a performer`);
    assert.ok(track.instrument, `${track.id} has instrumentation`);
    assert.ok(track.durationSeconds > 0, `${track.id} has a duration`);
    assert.ok(track.license && track.licenseUrl, `${track.id} has license details`);
    assert.ok(track.sourceUrl.startsWith("https://"), `${track.id} has a source page`);
    assert.ok(!/vocal|singer|choir|voice/i.test(track.instrument), `${track.id} is instrumental`);

    const mp3 = path.join(root, "apps/web/public", track.url.replace(/^\//, ""));
    assert.ok(existsSync(mp3), `${track.id} optimized MP3 exists`);
    assert.ok(statSync(mp3).size > 100_000, `${track.id} MP3 is non-empty`);
  }
});

test("retained source masters are listed for every library track", () => {
  const notes = path.join(root, "docs/music-library/README.md");
  const readme = readFileSync(notes, "utf8");
  const masters = [...readme.matchAll(/`(\d{2}-[^`]+)`/g)].map((match) => match[1]);
  assert.equal(masters.length, CLASSICAL_MUSIC.length);
  for (const filename of masters) {
    const file = path.join(root, "docs/music-library/masters", filename);
    assert.ok(existsSync(file), `source master ${filename} is retained`);
    assert.ok(statSync(file).size > 100_000, `source master ${filename} is non-empty`);
  }
});

test("every bundled recording is accepted by publication media validation", () => {
  for (const track of CLASSICAL_MUSIC)
    assert.ok(isBundledMusicUrl(track.url), `${track.id} can be published without an upload asset`);
  assert.equal(isBundledMusicUrl("/music/catalog/classical/unlisted.mp3"), false);
});
