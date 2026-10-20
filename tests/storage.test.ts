import assert from "node:assert/strict";
import test from "node:test";
import { detectMedia } from "../apps/web/src/server/storage.ts";

test("voice recording WebM is detected by its container signature", () => {
  const webmHeader = Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0x93, 0x42]);
  assert.deepEqual(detectMedia(webmHeader, "audio"), {
    mime: "audio/webm",
    extension: "webm",
  });
  assert.equal(detectMedia(Buffer.from("not-audio"), "audio"), null);
});
