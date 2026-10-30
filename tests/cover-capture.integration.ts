// Run against a local production server; uses synthetic drafts, no database writes.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { completeInvitation } from "./fixtures/publication";

const webRequire = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const sharp = webRequire("sharp");
const origin = process.env.COVER_TEST_URL || "http://127.0.0.1:3001";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));

test(
  "real transient draft covers support warm contexts and hero crops",
  { timeout: 120000 },
  async () => {
    const draft = completeInvitation();
    draft.content["uz-Latn"].people = [`Nodir ${Date.now()}`, "Madina test"];
    async function capture(template: string) {
      const started = Date.now();
      const response = await fetch(`${origin}/api/invitation-covers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: origin },
        body: JSON.stringify({ ...draft, templateId: template }),
        signal: AbortSignal.timeout(55000),
      });
      assert.equal(
        response.status,
        200,
        await response
          .clone()
          .text()
          .then((text) => text.slice(0, 300)),
      );
      const bytes = Buffer.from(await response.arrayBuffer());
      const image = await sharp(bytes).metadata();
      assert.equal(image.width, 480);
      assert.equal(image.height, 800);
      console.log(`${template}: ${Date.now() - started}ms`);
      return bytes;
    }
    const first = await capture("anor");
    draft.content["uz-Latn"].people[0] = "Aziz personalized";
    assert.notDeepEqual(await capture("anor"), first);
    await capture("somon-yoli");
    await capture("butterfly");
    await capture("aurelia");
  },
);
