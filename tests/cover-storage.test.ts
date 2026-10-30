import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  persistentCovers,
  sealCover,
  openCover,
  coverStorage,
} from "../apps/web/src/server/cover-storage";
import { coverKey } from "../apps/web/src/server/cover-policy";
import { completeInvitation } from "./fixtures/publication";

const secret = "synthetic cover secret with at least 32 characters";

test("saved covers survive loss of all disposable state and stay scoped to account/content/version", async () => {
  const objects = new Map<string, Buffer>();
  const backend = {
    read: async (key: string) => objects.get(key),
    write: async (key: string, bytes: Buffer) => {
      objects.set(key, bytes);
    },
  };
  const draft = completeInvitation();
  const key = coverKey(draft, "owner:one");
  const pixels = Buffer.from("real personalized screenshot fixture");
  const beforeRestart = persistentCovers(backend, secret);
  assert.equal(await beforeRestart.read(key), undefined);
  assert.equal(await beforeRestart.write(key, pixels), true);
  const afterRestart = persistentCovers(backend, secret);
  assert.deepEqual(
    await afterRestart.read(coverKey(draft, "owner:one")),
    pixels,
  );
  assert.equal(
    await afterRestart.read(coverKey(draft, "owner:two")),
    undefined,
  );
  draft.content["uz-Latn"].people[0] = "Changed name";
  assert.equal(
    await afterRestart.read(coverKey(draft, "owner:one")),
    undefined,
  );
  const encrypted = [...objects.values()][0];
  assert.ok(!encrypted.includes(pixels));
  assert.throws(() => openCover(encrypted, "other-key", secret));
  assert.throws(() => openCover(encrypted, key, "another secret"));
  encrypted[encrypted.length - 1] ^= 1;
  assert.throws(() => openCover(encrypted, key, secret));
  assert.notDeepEqual(
    sealCover(pixels, key, secret),
    sealCover(pixels, key, secret),
  );
});

test("unavailable or corrupt durable storage remains recoverable", async () => {
  const original = console.error;
  console.error = () => {};
  try {
    const unavailable = persistentCovers(
      {
        read: async () => {
          throw new Error("offline");
        },
        write: async () => {
          throw new Error("offline");
        },
      },
      secret,
    );
    assert.equal(await unavailable.read("key"), undefined);
    assert.equal(await unavailable.write("key", Buffer.from("cover")), false);
    const corrupt = persistentCovers(
      {
        read: async () => Buffer.from("corrupt"),
        write: async () => {},
      },
      secret,
    );
    assert.equal(await corrupt.read("key"), undefined);
  } finally {
    console.error = original;
  }
});

test("local persistent media backend survives recreation independently of cover cache", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "saved-covers-"));
  const previous = {
    provider: process.env.MEDIA_STORAGE,
    directory: process.env.LOCAL_MEDIA_DIR,
    secret: process.env.SESSION_SECRET,
    vercel: process.env.VERCEL,
  };
  try {
    process.env.MEDIA_STORAGE = "local";
    process.env.LOCAL_MEDIA_DIR = directory;
    process.env.SESSION_SECRET = secret;
    delete process.env.VERCEL;
    const key = "a".repeat(64);
    assert.equal(
      await coverStorage()!.write(key, Buffer.from("saved WebP")),
      true,
    );
    assert.deepEqual(
      await coverStorage()!.read(key),
      Buffer.from("saved WebP"),
    );
  } finally {
    for (const [name, value] of Object.entries({
      MEDIA_STORAGE: previous.provider,
      LOCAL_MEDIA_DIR: previous.directory,
      SESSION_SECRET: previous.secret,
      VERCEL: previous.vercel,
    })) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
    await rm(directory, { recursive: true, force: true });
  }
});
