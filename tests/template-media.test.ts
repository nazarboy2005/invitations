import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import sharp from "sharp";
import { optimizedTemplateMedia } from "../apps/web/src/lib/template-media";

type Entry = {
  url: string;
  kind: "image" | "video";
  originalBytes: number;
  bytes: number;
};
const media: Record<string, Entry> = JSON.parse(
  readFileSync("apps/web/src/generated/template-media.json", "utf8"),
);

test("packaged derivatives exist, save useful bytes, and never target uploaded media", async () => {
  assert.ok(Object.keys(media).length > 0);
  for (const [source, entry] of Object.entries(media)) {
    assert.match(source, /^\/templates\//);
    assert.match(
      entry.url,
      /^\/templates\/_optimized\/[a-f0-9]{24}\.(webp|mp4)$/,
    );
    assert.equal(optimizedTemplateMedia(source), entry.url);
    assert.equal(
      statSync(join("apps/web/public", source)).size,
      entry.originalBytes,
    );
    assert.equal(
      statSync(join("apps/web/public", entry.url)).size,
      entry.bytes,
    );
    assert.ok(entry.bytes < entry.originalBytes * 0.9);
    if (entry.kind === "image") {
      const metadata = await sharp(
        join("apps/web/public", entry.url),
      ).metadata();
      assert.ok(metadata.width! <= 1920 && metadata.height! <= 1920);
      assert.equal(metadata.format, "webp");
    }
  }
  for (const url of [
    "/api/media/123",
    "https://other.example/templates/a.png",
    "/templates/unknown.png",
    "/templates/anor/source/art/stage.webp",
    "/templates/../api/media/123",
  ]) {
    assert.equal(optimizedTemplateMedia(url), undefined);
  }
});
