// Dedicated loopback test server with the security interceptor; no real sends.
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID, randomInt } from "node:crypto";
import { createRequire } from "node:module";
import { getDb, closeDb } from "../packages/database/src/index";
import { completeInvitation } from "./fixtures/publication";
import { removeLocalMedia } from "../apps/web/src/server/local-storage";
import { resolve } from "node:path";
const requireWeb = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const { PDFDocument } = requireWeb("pdf-lib");
test(
  "Next.js can execute the isolated receipt PDF worker and serve its private attachment",
  { timeout: 60000 },
  async () => {
    const db = getDb(),
      owner = randomUUID();
    const invitation = {
      ...completeInvitation(),
      id: randomUUID(),
      status: "published" as const,
      gift: {
        enabled: true,
        receiptUploadEnabled: true,
        cardHolder: "Disposable PDF QA",
        cardNumber: "4444333322221111",
      },
    };
    const oldDirectory = process.env.LOCAL_MEDIA_DIR;
    process.env.LOCAL_MEDIA_DIR = resolve(".tmp/security-test-media");
    try {
      await db`INSERT INTO users(id,telegram_user_id,display_name) VALUES(${owner},${-randomInt(1e12)},'Disposable PDF worker QA')`;
      await db`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${invitation.id},${owner},${invitation.templateId},'published',${db.json(invitation)})`;
      const doc = await PDFDocument.create();
      doc.addPage().drawText("Bank PDF worker QA");
      doc.addJavaScript("unsafe", "app.alert('must be removed')");
      const form = new FormData();
      form.set("giverNames", "PDF QA");
      form.set(
        "file",
        new Blob([new Uint8Array(await doc.save())], {
          type: "application/pdf",
        }),
        "qa.pdf",
      );
      const response = await fetch(
        `http://127.0.0.1:3024/api/public/invitations/${invitation.id}/receipts`,
        {
          method: "POST",
          signal: AbortSignal.timeout(30000),
          headers: {
            Origin: "http://127.0.0.1:3024",
            "X-Real-IP": "198.51.100.219",
            "cf-turnstile-response": "security-fixture:guest_receipt",
          },
          body: form,
        },
      );
      assert.equal(response.status, 201, await response.clone().text());
      const [asset] =
        await db`SELECT mime_type,visibility,size_bytes FROM media_assets WHERE draft_id=${invitation.id}`;
      assert.equal(asset.mime_type, "application/pdf");
      assert.equal(asset.visibility, "private");
      assert.ok(Number(asset.size_bytes) > 0);
    } finally {
      for (const row of await db`SELECT object_key FROM media_assets WHERE owner_id=${owner}`)
        await removeLocalMedia(row.object_key);
      await db.begin(async (tx) => {
        await tx`DELETE FROM jobs WHERE payload->>'invitationId'=${invitation.id}`;
        await tx`DELETE FROM gift_receipts WHERE invitation_id=${invitation.id}`;
        await tx`DELETE FROM invitations WHERE owner_id=${owner}`;
        await tx`DELETE FROM media_assets WHERE owner_id=${owner}`;
        await tx`DELETE FROM users WHERE id=${owner}`;
      });
      if (oldDirectory === undefined) delete process.env.LOCAL_MEDIA_DIR;
      else process.env.LOCAL_MEDIA_DIR = oldDirectory;
      await closeDb();
    }
  },
);
