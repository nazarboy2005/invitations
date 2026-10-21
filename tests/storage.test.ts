import assert from "node:assert/strict";
import test from "node:test";
import { detectMedia } from "../apps/web/src/server/storage.ts";

test("audio uploads accept supported music and reject unrecognized bytes", () => {
  const mp3Header = Buffer.from("ID3");
  assert.deepEqual(detectMedia(mp3Header, "audio"), {
    mime: "audio/mpeg",
    extension: "mp3",
  });
  assert.equal(detectMedia(Buffer.from("not-audio"), "audio"), null);
});
