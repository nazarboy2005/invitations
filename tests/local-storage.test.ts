import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { localMediaPath } from "../apps/web/src/server/local-storage";
import {
  putMedia,
  inspectMedia,
  removeMedia,
  mediaResponse,
  storageProvider,
  sealMedia,
} from "../apps/web/src/server/storage";

test("local storage validates paths, preserves bytes, serves byte ranges, and removes files", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "invitation-media-"));
  const previous = process.env.LOCAL_MEDIA_DIR;
  process.env.LOCAL_MEDIA_DIR = directory;
  try {
    for (const key of [
      "other/key",
      "local/../escape",
      "local/a/../../escape",
      "local/C:/escape",
      "local/a\\escape",
      "local//file",
      "local/./x",
    ])
      assert.throws(() => localMediaPath(key));
    const bytes = Buffer.from("RIFF1234WAVEcontent for range tests");
    await putMedia("local/test/media.wav", bytes, "audio/wav");
    assert.equal(
      await sealMedia("local/test/media.wav"),
      "local/test/media.wav",
    );
    assert.equal(
      (await inspectMedia("local/test/media.wav")).size,
      bytes.length,
    );
    const response = await mediaResponse(
      new Request("http://localhost/file"),
      "local/test/media.wav",
      "audio/wav",
    );
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes);
    for (const [range, expected] of [
      ["bytes=0-3", bytes.subarray(0, 4)],
      ["bytes=4-", bytes.subarray(4)],
      ["bytes=-4", bytes.subarray(-4)],
    ] as const) {
      const result = await mediaResponse(
        new Request("http://localhost/file", { headers: { range } }),
        "local/test/media.wav",
        "audio/wav",
      );
      assert.equal(result.status, 206);
      assert.deepEqual(Buffer.from(await result.arrayBuffer()), expected);
    }
    for (const range of [
      "bytes=999-",
      "bytes=4-1",
      "bytes=0-1,3-4",
      "bytes=-",
      "bytes=-0",
    ])
      assert.equal(
        (
          await mediaResponse(
            new Request("http://localhost/file", { headers: { range } }),
            "local/test/media.wav",
            "audio/wav",
          )
        ).status,
        416,
      );
    await removeMedia("local/test/media.wav");
    await assert.rejects(inspectMedia("local/test/media.wav"));
  } finally {
    if (previous === undefined) delete process.env.LOCAL_MEDIA_DIR;
    else process.env.LOCAL_MEDIA_DIR = previous;
    await rm(directory, { recursive: true, force: true });
  }
});
test("local mode is explicit on production servers and forbidden on Vercel", () => {
  const previous = process.env.MEDIA_STORAGE,
    vercel = process.env.VERCEL;
  try {
    process.env.MEDIA_STORAGE = "local";
    delete process.env.VERCEL;
    assert.equal(storageProvider(), "local");
    process.env.VERCEL = "1";
    assert.throws(() => storageProvider());
  } finally {
    if (previous === undefined) delete process.env.MEDIA_STORAGE;
    else process.env.MEDIA_STORAGE = previous;
    if (vercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = vercel;
  }
});
