import test from "node:test";
import assert from "node:assert/strict";
import { coverDeadline } from "../apps/web/src/server/cover-deadline";
import {
  CoverBrowser,
  captureCoverPixels,
} from "../apps/web/src/server/cover-browser";

test("capture deadline rejects even when browser shutdown never resolves", async () => {
  let invalidated = false;
  const started = Date.now();
  await assert.rejects(
    coverDeadline(
      () => new Promise(() => {}),
      20,
      () => {
        invalidated = true;
      },
    ),
    /timed out/,
  );
  assert.equal(invalidated, true);
  assert.ok(Date.now() - started < 1000);
});

test("discard removes a stuck browser from the warm pool and bounds shutdown", async () => {
  const stuck = { isConnected: () => true, close: () => new Promise(() => {}) };
  const replacement = { isConnected: () => true, close: async () => {} };
  let launches = 0;
  const pool = new CoverBrowser(
    async () => (++launches === 1 ? stuck : replacement) as any,
  );
  assert.equal(await pool.acquire(), stuck);
  const cleanup = pool.discard(stuck as any);
  assert.equal(await pool.acquire(), replacement);
  await cleanup;
  await pool.discard(replacement as any);
});

test(
  "CDP screenshot and detach stalls cannot consume the Vercel function duration",
  { timeout: 12000 },
  async () => {
    let detached = false;
    const session = {
      send: () => new Promise(() => {}),
      detach: () => {
        detached = true;
        return new Promise(() => {});
      },
    };
    const page = {
      frames: () => [],
      viewportSize: () => ({ width: 480, height: 800 }),
      context: () => ({ newCDPSession: async () => session }),
    };
    const started = Date.now();
    await assert.rejects(
      captureCoverPixels(page as any),
      /timed out after 8000ms/,
    );
    assert.equal(detached, true);
    assert.ok(Date.now() - started < 11000);
  },
);
