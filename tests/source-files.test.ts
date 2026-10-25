import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { readFileSync, readFile } from "./helpers/source-files";

test("source comparisons normalize Windows line endings for strings and text buffers", async () => {
  const directory = mkdtempSync(join(tmpdir(), "invitation-source-test-"));
  try {
    const file = join(directory, "source.svg");
    writeFileSync(file, "<svg>\r\n</svg>\r\n");
    assert.equal(readFileSync(file, "utf8"), "<svg>\n</svg>\n");
    assert.deepEqual(readFileSync(file), Buffer.from("<svg>\n</svg>\n"));
    assert.deepEqual(await readFile(file), Buffer.from("<svg>\n</svg>\n"));
  } finally {
    rmSync(directory, { recursive: true });
  }
});

test("binary source fingerprints retain every byte, including CRLF sequences", async () => {
  const directory = mkdtempSync(join(tmpdir(), "invitation-source-test-"));
  try {
    const file = join(directory, "art.webp");
    const bytes = Buffer.from([0, 255, 13, 10, 128, 13, 10]);
    writeFileSync(file, bytes);
    assert.deepEqual(readFileSync(file), bytes);
    assert.deepEqual(await readFile(file), bytes);
  } finally {
    rmSync(directory, { recursive: true });
  }
});
