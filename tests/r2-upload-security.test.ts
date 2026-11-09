import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  presignMedia,
  readUploadBytes,
  putMedia,
  verifiedMediaKey,
} from "../apps/web/src/server/storage";
import { validateCreatorMedia } from "../apps/web/src/server/media-validation";
const requireWeb = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const { S3Client } = requireWeb("@aws-sdk/client-s3");
const sharp = requireWeb("sharp");

test("R2 signatures bind exact size/type, and approval writes a validated byte snapshot rather than copying a mutable object", async () => {
  const keys = {
    R2_ACCOUNT_ID: "testaccount",
    R2_ACCESS_KEY_ID: "disposable-test-access",
    R2_SECRET_ACCESS_KEY: "disposable-test-secret",
    R2_BUCKET_NAME: "test-bucket",
  };
  const previous = Object.fromEntries(
    Object.keys(keys).map((key) => [key, process.env[key]]),
  );
  const send = S3Client.prototype.send;
  Object.assign(process.env, keys);
  try {
    const signed = new URL(
      await presignMedia("creators/test/photo.png", "image/png", 123),
    );
    const headers = signed.searchParams.get("X-Amz-SignedHeaders")!.split(";");
    assert.ok(headers.includes("content-length"));
    assert.ok(headers.includes("content-type"));
    assert.equal(signed.searchParams.get("X-Amz-Expires"), "300");
    const original = await sharp({
      create: { width: 20, height: 10, channels: 3, background: "red" },
    })
      .png()
      .toBuffer();
    let source = original;
    let written: Buffer | undefined;
    let copied = false;
    S3Client.prototype.send = async function (command: any) {
      if (command.constructor.name === "GetObjectCommand") {
        const snapshot = Buffer.from(source);
        // The caller replaces the still-writable source after this GET begins.
        source = Buffer.from("replacement content that must never be approved");
        return {
          ContentLength: snapshot.length,
          Body: {
            transformToWebStream: () =>
              new ReadableStream({
                start(controller) {
                  controller.enqueue(snapshot);
                  controller.close();
                },
              }),
          },
        };
      }
      if (command.constructor.name === "PutObjectCommand") {
        assert.match(command.input.Key, /^verified\//);
        written = Buffer.from(command.input.Body);
        return {};
      }
      copied = true;
      throw new Error("Unexpected mutable-copy/HEAD operation");
    };
    const bytes = await readUploadBytes(
      "creators/test/photo.png",
      original.length,
    );
    assert.deepEqual(bytes, original);
    const validated = await validateCreatorMedia(bytes, "image/png");
    await putMedia(
      verifiedMediaKey("creators/test/photo.png"),
      validated.content,
      validated.mime,
    );
    assert.deepEqual(written, validated.content);
    assert.equal(copied, false);
    assert.notDeepEqual(written, source);
    await assert.rejects(
      readUploadBytes("creators/test/photo.png", 999),
      (error: any) => error.code === "INVALID_FILE",
    );
    assert.equal(
      verifiedMediaKey("local/creators/test/photo.png"),
      "local/verified/creators/test/photo.png",
    );
  } finally {
    S3Client.prototype.send = send;
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
