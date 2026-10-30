// Run against a local production server with free publishing and matching
// LOCAL_MEDIA_DIR/INVITATION_COVER_DIR. Creates/removes one disposable account.
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { unlink, readdir } from "node:fs/promises";
import path from "node:path";
import { getDb, closeDb } from "../packages/database/src/index";
import { completeInvitation } from "./fixtures/publication";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { coverKey } from "../apps/web/src/server/cover-policy";
import { coverStorage } from "../apps/web/src/server/cover-storage";
import { coverCacheRoot } from "../apps/web/src/server/cover-runtime";
import { mediaObjectKey, removeMedia } from "../apps/web/src/server/storage";
import { publishInvitation } from "../apps/web/src/server/publication";
import { preparePublishedCover } from "../apps/web/src/server/published-cover";
import { publicationCoverSignature } from "../apps/web/src/server/cover-publication-auth";

test(
  "draft captures stay browser-only; publication preparation saves its canonical cover",
  { timeout: 90000 },
  async () => {
    const origin = process.env.APP_URL!;
    assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
    assert.equal(process.env.PUBLISHING_MODE, "free");
    assert.equal(process.env.MEDIA_STORAGE, "local");
    const sql = getDb();
    const owner = randomUUID(),
      token = randomToken();
    const draft = completeInvitation();
    const key = coverKey(draft, `owner:${owner}`);
    async function request(url: string, body: unknown) {
      return fetch(new URL(url, origin), {
        method: "POST",
        headers: {
          Origin: origin,
          "Content-Type": "application/json",
          Cookie: `taklifnoma_session=${token}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(55000),
      });
    }
    try {
      await sql`INSERT INTO users(id,telegram_user_id,display_name,phone_number,phone_source,phone_shared_at) VALUES(${owner},${-Math.floor(Math.random() * 1e12) - 1},'Cover publication fixture','+000000000','telegram_contact',now())`;
      await sql`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${owner},${digest(token)},'Cover publication fixture',now()+interval '1 hour',now()+interval '1 hour')`;
      await sql`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${draft.id},${owner},${draft.templateId},'draft',${sql.json(draft)})`;
      const before = await readdir(coverCacheRoot()).catch(() => []);
      const transient = await request("/api/invitation-covers", draft);
      assert.equal(
        transient.status,
        200,
        await transient
          .clone()
          .text()
          .then((text) => text.slice(0, 200)),
      );
      await transient.arrayBuffer();
      assert.equal(
        await coverStorage()!.read(key),
        undefined,
        "draft was not saved to persistent media",
      );
      assert.deepEqual(
        await readdir(coverCacheRoot()).catch(() => []),
        before,
        "draft was not saved to server disk",
      );
      const publication = await publishInvitation(draft.id, draft.revision, {
        id: owner,
        telegramUserId: "0",
        displayName: "Cover fixture",
        phoneShared: true,
        isAdmin: false,
      });
      const published = publication.invitation;
      assert.equal(published.status, "published");
      await preparePublishedCover({ invitationId: draft.id });
      let saved: Buffer | undefined;
      const until = Date.now() + 50000;
      while (!saved && Date.now() < until) {
        saved = await coverStorage()!.read(
          coverKey(published, `owner:${owner}`),
        );
        if (!saved) await new Promise((resolve) => setTimeout(resolve, 500));
      }
      assert.ok(
        saved && saved.length > 1000,
        "publication saved its cover without a dashboard request",
      );
      const fetched = await fetch(new URL("/api/invitation-covers", origin), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Publication-Cover": publicationCoverSignature(
            draft.id,
            Date.now() + 60000,
          ),
        },
        body: JSON.stringify({ id: draft.id }),
      });
      assert.equal(fetched.status, 200);
      assert.deepEqual(
        Buffer.from(await fetched.arrayBuffer()),
        saved,
        "published reads use canonical data",
      );
    } finally {
      await removeMedia(
        mediaObjectKey(`invitation-covers/v1/${key}.bin`),
      ).catch(() => {});
      await unlink(path.join(coverCacheRoot(), `${key}.webp`)).catch(() => {});
      await sql.begin(async (tx) => {
        await tx`DELETE FROM invitation_audit_log WHERE invitation_id=${draft.id}`;
        await tx`DELETE FROM invitations WHERE id=${draft.id} AND owner_id=${owner}`;
        await tx`DELETE FROM sessions WHERE user_id=${owner}`;
        await tx`DELETE FROM users WHERE id=${owner}`;
      });
      await closeDb();
    }
  },
);
