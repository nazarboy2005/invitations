// Local production app must be running. Run with TSX_TSCONFIG_PATH=apps/web/tsconfig.json.
// Uses a synthetic account scope and temporary local storage; no account/database writes.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readdir } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { completeInvitation } from "./fixtures/publication";
import { personalizedCover } from "../apps/web/src/server/invitation-cover";
import { SESSION_COOKIE } from "../apps/web/src/server/auth";

test(
  "generated cover is fetched from persistent storage after disk-cache loss and session replacement",
  { timeout: 60000 },
  async () => {
    const origin = process.env.COVER_TEST_URL || "http://127.0.0.1:3001";
    assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
    const root = await mkdtemp(path.join(tmpdir(), "cover-persistence-"));
    const overrides = {
      APP_URL: origin,
      INVITATION_COVER_DIR: path.join(root, "cache"),
      LOCAL_MEDIA_DIR: path.join(root, "durable"),
      MEDIA_STORAGE: "local",
      SESSION_SECRET: "synthetic persistent cover integration secret",
    };
    const previous = Object.fromEntries(
      Object.keys(overrides).map((key) => [key, process.env[key]]),
    );
    try {
      Object.assign(process.env, overrides);
      const draft = completeInvitation();
      draft.status = "published";
      const rendered = await personalizedCover(
        draft,
        "test",
        `${SESSION_COOKIE}=first`,
        "synthetic-owner",
      );
      assert.ok(rendered.length > 1000);
      assert.equal(
        (await readdir(path.join(root, "durable", "invitation-covers", "v1")))
          .length,
        1,
      );
      await rm(path.join(root, "cache"), { recursive: true, force: true });
      // Any attempt to render now fails at configuration, even with a warm browser.
      process.env.APP_URL = "capture-must-not-run";
      const started = Date.now();
      const fetched = await personalizedCover(
        draft,
        "test",
        `${SESSION_COOKIE}=replaced`,
        "synthetic-owner",
      );
      assert.deepEqual(fetched, rendered);
      console.log(
        `Saved cover after cache deletion/session replacement: ${Date.now() - started}ms`,
      );
    } finally {
      for (const [key, value] of Object.entries(previous)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
      await rm(root, { recursive: true, force: true });
    }
  },
);
