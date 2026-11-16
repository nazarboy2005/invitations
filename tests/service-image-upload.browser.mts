// Real browser decoding/encoding, with intercepted uploads; no database/storage writes.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { randomBytes } from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import { SERVICE_IMAGE_UPLOAD_MAX_BYTES } from "../apps/web/src/modules/services/service-image-policy";

const require = createRequire(path.resolve("apps/web/package.json"));
const { chromium } = require("playwright");
const rootRequire = createRequire(path.resolve("package.json"));
const { build } = createRequire(rootRequire.resolve("tsx"))("esbuild");
const bundle = await build({
  entryPoints: ["apps/web/src/modules/admin/service-image-upload.ts"],
  bundle: true,
  write: false,
  platform: "browser",
  format: "iife",
  globalName: "serviceImageUpload",
});
const browser = await chromium.launch({
  channel: process.env.SERVICES_SCRAPER_CHANNEL || "chrome",
  headless: true,
});
try {
  const page = await browser.newPage();
  await page.setContent(
    "<!doctype html><title>Service upload regression</title>",
  );
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  // tsx preserves names in serialized evaluate callbacks using this helper.
  await page.addScriptTag({ content: "globalThis.__name = (value) => value;" });
  const large = await sharp(randomBytes(2048 * 1024 * 3), {
    raw: { width: 2048, height: 1024, channels: 3 },
  })
    .png({ compressionLevel: 0 })
    .toBuffer();
  assert.ok(large.length > 4_500_000);
  const oriented = await sharp({
    create: { width: 120, height: 80, channels: 3, background: "red" },
  })
    .jpeg()
    .withMetadata({ orientation: 6 })
    .toBuffer();
  const small = await sharp({
    create: {
      width: 10,
      height: 10,
      channels: 4,
      background: { r: 10, g: 20, b: 30, alpha: 0.5 },
    },
  })
    .png()
    .toBuffer();
  const results = await page.evaluate(
    async ({ large, oriented, small, limit }) => {
      const api = (globalThis as any).serviceImageUpload;
      const file = (data: string, type = "image/png") =>
        new File(
          [Uint8Array.from(atob(data), (c) => c.charCodeAt(0))],
          "photo",
          { type },
        );
      const dimensions = async (blob: Blob) => {
        const image = await createImageBitmap(blob);
        const result = { width: image.width, height: image.height };
        image.close();
        return result;
      };
      const input = file(large),
        output = await api.prepareServiceImage(input);
      const compressed = {
        source: input.size,
        bytes: output.size,
        type: output.type,
        ...(await dimensions(output)),
      };
      if (output.size > limit) throw new Error("Upload exceeds request budget");
      const rotated = await dimensions(
        await api.prepareServiceImage(file(oriented, "image/jpeg")),
      );
      const tiny = await api.prepareServiceImage(file(small));
      const tinyDimensions = await dimensions(tiny);
      const bitmap = await createImageBitmap(tiny),
        canvas = document.createElement("canvas");
      canvas.width = canvas.height = 10;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bitmap, 0, 0);
      const alpha = ctx.getImageData(0, 0, 1, 1).data[3];
      bitmap.close();
      const failure = async (work: () => Promise<unknown>) => {
        try {
          await work();
          return "NO ERROR";
        } catch (e) {
          return (e as Error).message;
        }
      };
      const invalid = await failure(() =>
        api.prepareServiceImage(file(btoa("not an image"))),
      );
      const oversized = await failure(() =>
        api.prepareServiceImage(
          new File([new Uint8Array(12 * 1024 * 1024 + 1)], "big.png", {
            type: "image/png",
          }),
        ),
      );
      const svg = await failure(() =>
        api.prepareServiceImage(file(btoa("<svg/>"), "image/svg+xml")),
      );
      let sentBytes = 0;
      const original = window.fetch;
      const expected = {
        src: "/api/services/media/11111111-1111-4111-8111-111111111111",
        width: 1600,
        height: 800,
        alt: "",
      };
      try {
        window.fetch = async (_url, options) => {
          sentBytes = (options?.body as Blob).size;
          return Response.json({ image: expected }, { status: 201 });
        };
        const saved = await api.uploadServiceImage(input);
        window.fetch = async () =>
          new Response("FUNCTION_PAYLOAD_TOO_LARGE", { status: 413 });
        const tooLarge = await failure(() =>
          api.uploadServiceImage(file(small)),
        );
        window.fetch = async () => new Response("Bad gateway", { status: 502 });
        const badGateway = await failure(() =>
          api.uploadServiceImage(file(small)),
        );
        window.fetch = async () =>
          Response.json(
            { error: { message: "Qayta kiring" } },
            { status: 401 },
          );
        const auth = await failure(() => api.uploadServiceImage(file(small)));
        window.fetch = async () =>
          Response.json({ image: { src: "https://unexpected.example/image" } });
        const invalidReply = await failure(() =>
          api.uploadServiceImage(file(small)),
        );
        return {
          compressed,
          rotated,
          tinyDimensions,
          alpha,
          invalid,
          oversized,
          svg,
          saved,
          sentBytes,
          tooLarge,
          badGateway,
          auth,
          invalidReply,
        };
      } finally {
        window.fetch = original;
      }
    },
    {
      large: large.toString("base64"),
      oriented: oriented.toString("base64"),
      small: small.toString("base64"),
      limit: SERVICE_IMAGE_UPLOAD_MAX_BYTES,
    },
  );
  assert.deepEqual(
    { width: results.compressed.width, height: results.compressed.height },
    { width: 1600, height: 800 },
  );
  assert.ok(results.compressed.bytes <= SERVICE_IMAGE_UPLOAD_MAX_BYTES);
  assert.equal(results.compressed.type, "image/webp");
  assert.deepEqual(results.rotated, { width: 80, height: 120 });
  assert.deepEqual(results.tinyDimensions, { width: 10, height: 10 });
  assert.ok(results.alpha >= 125 && results.alpha <= 130);
  assert.match(results.invalid, /Rasmni ochib/);
  assert.match(results.oversized, /12 MB/);
  assert.match(results.svg, /JPEG/);
  assert.ok(results.sentBytes <= SERVICE_IMAGE_UPLOAD_MAX_BYTES);
  assert.equal(results.saved.width, 1600);
  assert.match(results.tooLarge, /hajmi juda katta/);
  assert.match(results.badGateway, /Rasm yuklanmadi/);
  assert.equal(results.auth, "Qayta kiring");
  assert.match(results.invalidReply, /tasdiqlab/);
  console.log(JSON.stringify({ passed: true, ...results }, null, 2));
} finally {
  await browser.close();
}
