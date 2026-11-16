import test, { mock } from "node:test";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, unlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { createServiceImageCache } from "../apps/web/src/server/service-image-cache";
import {
  bundledServiceImageSource,
  uploadedServiceImageSource,
} from "../apps/web/src/server/service-image-source";
import { servicePhotoUrl } from "../apps/web/src/modules/services/service-photo-url";

const photo = (color: string) =>
  sharp({
    create: { width: 1000, height: 600, channels: 3, background: color },
  })
    .webp()
    .toBuffer();

test("image bytes are reused, resized and revalidated before conditional responses", async () => {
  const respond = createServiceImageCache();
  let reads = 0,
    inspections = 0,
    exists = true,
    version = "1";
  let bytes = await photo("red");
  const source = {
    key: "unit-image",
    async inspect() {
      inspections++;
      if (!exists) throw new Error("deleted");
      return version;
    },
    async read() {
      reads++;
      return bytes;
    },
  };
  const request = (etag?: string) =>
    new Request("http://localhost/photo", {
      headers: etag ? { "If-None-Match": etag } : {},
    });
  const first = await respond(request(), source, { width: 320 });
  assert.match(
    first.headers.get("Cache-Control")!,
    /private, no-cache, must-revalidate/,
  );
  const etag = first.headers.get("ETag")!;
  const output = Buffer.from(await first.arrayBuffer());
  assert.equal((await sharp(output).metadata()).width, 320);
  assert.equal(reads, 1);
  const second = await respond(request(), source, { width: 320 });
  assert.deepEqual(Buffer.from(await second.arrayBuffer()), output);
  assert.equal(reads, 1, "warm byte cache skips storage reads");
  for (const validator of [etag, `W/${etag}`, `"other", ${etag}`, "*"]) {
    const unchanged = await respond(request(validator), source, { width: 320 });
    assert.equal(unchanged.status, 304);
    assert.equal(await unchanged.text(), "");
  }
  assert.ok(inspections >= 6, "each cache hit checks existence");
  exists = false;
  await assert.rejects(
    respond(request(etag), source, { width: 320 }),
    /deleted/,
  );
  await assert.rejects(respond(request(), source, { width: 320 }), /deleted/);
  exists = true;
  version = "2";
  bytes = await photo("blue");
  const changed = await respond(request(etag), source, { width: 320 });
  assert.equal(changed.status, 200);
  assert.notEqual(changed.headers.get("ETag"), etag);
  assert.notDeepEqual(Buffer.from(await changed.arrayBuffer()), output);
  assert.equal(reads, 2);
  const privateImage = await respond(request("*"), source, {
    cacheable: false,
  });
  assert.equal(privateImage.status, 200);
  assert.equal(privateImage.headers.get("ETag"), null);
  assert.equal(privateImage.headers.get("Cache-Control"), "private, no-store");
  const head = await respond(
    new Request("http://localhost/photo", { method: "HEAD" }),
    source,
  );
  assert.equal(await head.text(), "");
  assert.ok(Number(head.headers.get("Content-Length")) > 0);
  await assert.rejects(respond(request(), source, { width: 123 }), /o‘lchami/);
});

test("deleted local uploads and bundled files cannot survive in warmed caches", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "service-photo-cache-"));
  const previous = process.env.LOCAL_MEDIA_DIR;
  process.env.LOCAL_MEDIA_DIR = root;
  try {
    const src = "/images/services/qa/abcdef.webp";
    const bundled = path.join(root, src);
    const upload = path.join(root, "upload.webp");
    await mkdir(path.dirname(bundled), { recursive: true });
    for (const [file, source] of [
      [bundled, bundledServiceImageSource(src, root)],
      [upload, uploadedServiceImageSource("local/upload.webp")],
    ] as const) {
      await writeFile(file, await photo("red"));
      const respond = createServiceImageCache();
      const initial = await respond(
        new Request("http://localhost/photo"),
        source,
      );
      const etag = initial.headers.get("ETag")!;
      await unlink(file);
      await assert.rejects(
        respond(
          new Request("http://localhost/photo", {
            headers: { "If-None-Match": etag },
          }),
          source,
        ),
        (error: { status?: number }) => error.status === 404,
      );
      await assert.rejects(
        respond(new Request("http://localhost/photo"), source),
        (error: { status?: number }) => error.status === 404,
      );
    }
    assert.throws(() =>
      bundledServiceImageSource("/images/services/../secret.webp", root),
    );
  } finally {
    if (previous === undefined) delete process.env.LOCAL_MEDIA_DIR;
    else process.env.LOCAL_MEDIA_DIR = previous;
    await rm(root, { recursive: true, force: true });
  }
});

test("concurrent requests share transformations; failed loads never poison the cache", async () => {
  const respond = createServiceImageCache();
  let reads = 0,
    fail = true;
  const bytes = await photo("green");
  const source = {
    key: "concurrent",
    async inspect() {
      return "1";
    },
    async read() {
      reads++;
      if (fail) throw new Error("offline");
      return bytes;
    },
  };
  await assert.rejects(
    respond(new Request("http://localhost/photo"), source),
    /offline/,
  );
  fail = false;
  const responses = await Promise.all(
    Array.from({ length: 5 }, () =>
      respond(new Request("http://localhost/photo"), source),
    ),
  );
  assert.ok(responses.every((response) => response.status === 200));
  assert.equal(reads, 2);
});

test("replacement photos get different URLs and widths are restricted", () => {
  assert.notEqual(
    servicePhotoUrl("hall", "/old.webp"),
    servicePhotoUrl("hall", "/new.webp"),
  );
  const url = new URL(
    servicePhotoUrl("hall", "/images/services/hall/abc.webp", 481),
    "http://localhost",
  );
  assert.equal(url.searchParams.get("src"), "/images/services/hall/abc.webp");
  assert.equal(url.searchParams.get("w"), "640");
  assert.equal(
    new URL(
      servicePhotoUrl("hall", "/photo.webp", 5000),
      "http://localhost",
    ).searchParams.get("w"),
    "1600",
  );
});

test("a full page's distinct image requests queue instead of dropping photos", async () => {
  const respond = createServiceImageCache();
  const bytes = await photo("red");
  let active = 0,
    peak = 0;
  const responses = await Promise.all(
    Array.from({ length: 12 }, (_, index) =>
      respond(
        new Request("http://localhost/photo"),
        {
          key: `card-${index}`,
          async inspect() {
            return "1";
          },
          async read() {
            active++;
            peak = Math.max(peak, active);
            await new Promise((resolve) => setTimeout(resolve, 5));
            active--;
            return bytes;
          },
        },
        { width: 320 },
      ),
    ),
  );
  assert.ok(responses.every((response) => response.status === 200));
  assert.ok(peak <= 4);
});

test("R2 existence checks run before cached responses and fail closed on deletion/outage", async () => {
  const require = createRequire(path.resolve("apps/web/package.json"));
  const {
    S3Client,
    HeadObjectCommand,
    GetObjectCommand,
  } = require("@aws-sdk/client-s3");
  const values = {
    R2_ACCOUNT_ID: "cachetest",
    R2_ACCESS_KEY_ID: "disposable",
    R2_SECRET_ACCESS_KEY: "disposable",
    R2_BUCKET_NAME: "cache-test",
  };
  const previous = Object.fromEntries(
    Object.keys(values).map((key) => [key, process.env[key]]),
  );
  Object.assign(process.env, values);
  const bytes = await photo("red");
  let heads = 0,
    gets = 0,
    deleted = false,
    outage = false;
  const send = mock.method(
    S3Client.prototype,
    "send",
    async (command: unknown) => {
      if (command instanceof HeadObjectCommand) {
        heads++;
        if (deleted) throw { $metadata: { httpStatusCode: 404 } };
        if (outage) throw new Error("storage unavailable");
        return { ETag: '"source-version-1"', ContentLength: bytes.length };
      }
      assert.ok(command instanceof GetObjectCommand);
      gets++;
      return {
        ContentLength: bytes.length,
        Body: { transformToByteArray: async () => bytes },
      };
    },
  );
  try {
    const source = uploadedServiceImageSource("services/fixture.webp");
    const respond = createServiceImageCache();
    const first = await respond(new Request("http://localhost/photo"), source);
    const request = () =>
      new Request("http://localhost/photo", {
        headers: { "If-None-Match": first.headers.get("ETag")! },
      });
    assert.equal((await respond(request(), source)).status, 304);
    assert.equal(gets, 1);
    assert.equal(
      heads,
      3,
      "HEAD before first read, after transformation and before 304",
    );
    deleted = true;
    await assert.rejects(
      respond(request(), source),
      (error: { status?: number }) => error.status === 404,
    );
    deleted = false;
    outage = true;
    await assert.rejects(respond(request(), source), /storage unavailable/);
    assert.equal(gets, 1, "neither failure falls back to cached bytes");
  } finally {
    send.mock.restore();
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
