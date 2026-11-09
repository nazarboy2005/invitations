import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import {
  normalizeReceipt,
  validateCreatorMedia,
} from "../apps/web/src/server/media-validation";
import { ApiError } from "../apps/web/src/server/api";
const requireWeb = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const sharp = requireWeb("sharp");
const { PDFDocument, PDFName, PDFString } = requireWeb("pdf-lib");
const badFile = (e: unknown) =>
  e instanceof ApiError && e.code === "INVALID_FILE";

test("receipts decode JPEG, PNG, WebP, GIF, AVIF and TIFF independent of filename/MIME", async () => {
  for (const type of ["jpeg", "png", "webp", "gif", "avif", "tiff"]) {
    const input = await sharp({
      create: { width: 40, height: 30, channels: 3, background: "red" },
    })
      .toFormat(type)
      .toBuffer();
    const result = await normalizeReceipt(input);
    assert.equal(result.mime, "image/webp", type);
    const decoded = await sharp(result.content).metadata();
    assert.equal(decoded.width, 40);
    assert.equal(decoded.height, 30);
    assert.equal(decoded.exif, undefined);
  }
});

test("creator images are fully decoded, normalized and checked against claimed type", async () => {
  const png = await sharp({
    create: { width: 4, height: 3, channels: 4, background: "blue" },
  })
    .png()
    .withMetadata()
    .toBuffer();
  const result = await validateCreatorMedia(png, "image/png");
  assert.equal(result.mime, "image/png");
  assert.equal((await sharp(result.content).metadata()).exif, undefined);
  await assert.rejects(validateCreatorMedia(png, "image/jpeg"), badFile);
  for (const data of [
    png.subarray(0, 20),
    Buffer.from(
      "<svg xmlns='http://www.w3.org/2000/svg'><rect width='10' height='10'/></svg>",
    ),
    Buffer.from("not actually an image file"),
  ]) {
    await assert.rejects(normalizeReceipt(data), badFile);
  }
});

test("receipts enforce compressed and decoded image limits", async () => {
  await assert.rejects(
    normalizeReceipt(Buffer.alloc(5 * 1024 * 1024 + 1)),
    badFile,
  );
  const large = await sharp({
    create: { width: 8100, height: 8000, channels: 3, background: "white" },
  })
    .png()
    .toBuffer();
  await assert.rejects(normalizeReceipt(large), badFile);
});

test("PDF receipts keep visual pages but remove document scripts, attachments and interactive actions", async () => {
  const doc = await PDFDocument.create();
  const page = doc.addPage([300, 400]);
  page.drawText("Bank receipt 12345", { x: 20, y: 300 });
  doc.addJavaScript("evil", "app.alert('unsafe')");
  await doc.attach(Buffer.from("bad attachment"), "evil.txt");
  page.node.set(
    PDFName.of("AA"),
    doc.context.obj({ O: { S: "JavaScript", JS: PDFString.of("unsafe") } }),
  );
  const original = Buffer.from(await doc.save());
  const clean = await normalizeReceipt(original);
  assert.equal(clean.mime, "application/pdf");
  const parsed = await PDFDocument.load(clean.content);
  assert.equal(parsed.getPageCount(), 1);
  assert.equal(parsed.getPage(0).getWidth(), 300);
  assert.ok(parsed.getPage(0).node.Contents());
  assert.equal(parsed.catalog.get(PDFName.of("Names")), undefined);
  assert.equal(parsed.getPage(0).node.get(PDFName.of("AA")), undefined);
  await assert.rejects(
    normalizeReceipt(Buffer.from("%PDF-1.7\nnot a PDF\n%%EOF")),
    badFile,
  );
});

test("audio requires a parsable audio stream rather than an ID3/RIFF prefix", async () => {
  for (const [data, mime] of [
    [Buffer.from("ID3" + "x".repeat(50)), "audio/mpeg"],
    [Buffer.from("RIFF1234WAVE" + "x".repeat(40)), "audio/wav"],
  ] as const)
    await assert.rejects(validateCreatorMedia(data, mime), badFile);
  const samples = Buffer.alloc(1600);
  const header = Buffer.alloc(44);
  header.write("RIFF");
  header.writeUInt32LE(36 + samples.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(8000, 24);
  header.writeUInt32LE(16000, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(samples.length, 40);
  const wav = Buffer.concat([header, samples]);
  assert.deepEqual((await validateCreatorMedia(wav, "audio/wav")).content, wav);
  const mp3 = await readFile(
    "apps/web/public/music/catalog/emotional-piano.mp3",
  );
  assert.deepEqual(
    (await validateCreatorMedia(mp3, "audio/mpeg")).content,
    mp3,
  );
});

test("PDF overload fails cleanly without starting more workers", async () => {
  const globals = globalThis as typeof globalThis & {
    fotihaPdfWorkers?: number;
  };
  const previous = globals.fotihaPdfWorkers;
  globals.fotihaPdfWorkers = 2;
  try {
    await assert.rejects(
      normalizeReceipt(Buffer.from("%PDF-1.7\nfixture body\n%%EOF")),
      (error: unknown) =>
        error instanceof ApiError && error.code === "PDF_BUSY",
    );
  } finally {
    globals.fotihaPdfWorkers = previous;
  }
});
