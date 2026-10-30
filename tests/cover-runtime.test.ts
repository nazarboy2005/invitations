import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  coverCacheRoot,
  coverBrowserOptions,
} from "../apps/web/src/server/cover-runtime";
import {
  readCoverFile,
  writeCoverFile,
} from "../apps/web/src/server/cover-disk-cache";

test("Vercel cover cache uses writable temporary storage; explicit paths still win", () => {
  assert.equal(
    coverCacheRoot({ VERCEL: "1" }),
    path.join(tmpdir(), ".data", "invitation-covers"),
  );
  assert.equal(
    coverCacheRoot({}),
    path.join(process.cwd(), ".data", "invitation-covers"),
  );
  const explicit = path.join(tmpdir(), "private-cover-cache");
  assert.equal(
    coverCacheRoot({ VERCEL: "1", INVITATION_COVER_DIR: explicit }),
    explicit,
  );
});

test("cover disk cache round-trips images and treats unavailable storage as a miss", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "cover-cache-test-"));
  try {
    const file = path.join(root, "private", "cover.webp");
    const bytes = Buffer.from("cover fixture");
    assert.equal(await readCoverFile(file), undefined);
    assert.equal(await writeCoverFile(file, bytes), true);
    assert.deepEqual(await readCoverFile(file), bytes);
    const blocked = path.join(root, "not-a-directory");
    await writeFile(blocked, "file");
    assert.equal(
      await writeCoverFile(path.join(blocked, "cover.webp"), bytes),
      false,
    );
    assert.equal(
      await readCoverFile(path.join(blocked, "cover.webp")),
      undefined,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("local cover browser preserves Playwright defaults and a managed executable override", async () => {
  const previous = {
    vercel: process.env.VERCEL,
    browser: process.env.INVITATION_COVER_BROWSER_PATH,
  };
  try {
    delete process.env.VERCEL;
    delete process.env.INVITATION_COVER_BROWSER_PATH;
    assert.equal((await coverBrowserOptions()).executablePath, undefined);
    process.env.INVITATION_COVER_BROWSER_PATH = "/managed/chromium";
    assert.equal(
      (await coverBrowserOptions()).executablePath,
      "/managed/chromium",
    );
    process.env.VERCEL = "1";
    const options = await coverBrowserOptions();
    assert.equal(options.executablePath, "/managed/chromium");
    assert.ok(options.args?.includes("--no-sandbox"));
    assert.ok(!options.args?.includes("--single-process"));
  } finally {
    if (previous.vercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = previous.vercel;
    if (previous.browser === undefined)
      delete process.env.INVITATION_COVER_BROWSER_PATH;
    else process.env.INVITATION_COVER_BROWSER_PATH = previous.browser;
  }
});
