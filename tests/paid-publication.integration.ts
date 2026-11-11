// Disposable transaction, rolled back in full; no provider or Telegram requests.
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb, closeDb } from "../packages/database/src/index";
import { publishInvitationInTransaction } from "../apps/web/src/server/publication";
import { completeInvitation } from "./fixtures/publication";
import { grantTestPurchase, deleteTestPurchases } from "./fixtures/payment";

test("publication always needs a verified event purchase, including administrator actions", async () => {
  const sql = getDb();
  const appUrl = process.env.APP_URL;
  process.env.APP_URL = "https://invitations.example";
  const rollback = new Error("rollback-disposable-paid-publication");
  try {
    await assert.rejects(sql.begin(async (tx) => {
      const owner = { id: randomUUID(), telegramUserId: "", displayName: "Disposable paid publication", isAdmin: true };
      const invitation = completeInvitation();
      await tx`INSERT INTO users(id,telegram_user_id,display_name) VALUES(${owner.id},${-Math.floor(Math.random() * 1e13) - 1},${owner.displayName})`;
      await tx`INSERT INTO invitations(id,owner_id,template_id,data) VALUES(${invitation.id},${owner.id},${invitation.templateId},${tx.json(invitation)})`;
      await assert.rejects(
        publishInvitationInTransaction(tx, invitation.id, invitation.revision, owner),
        (error: any) => error.code === "PAYMENT_REQUIRED",
      );
      const [unpaid] = await tx`SELECT status,slug FROM invitations WHERE id=${invitation.id}`;
      assert.equal(unpaid.status, "draft");
      assert.equal(unpaid.slug, null);
      await grantTestPurchase(tx, invitation, owner.id);
      const published = await publishInvitationInTransaction(tx, invitation.id, invitation.revision, owner);
      assert.equal(published.invitation.status, "published");
      const [audit] = await tx`SELECT action FROM invitation_audit_log WHERE invitation_id=${invitation.id}`;
      assert.equal(audit.action, "published_paid");
      const retry = await publishInvitationInTransaction(tx, invitation.id, invitation.revision, owner);
      assert.equal(retry.url, published.url);
      await deleteTestPurchases(tx, [invitation.id]);
      assert.equal((await tx`SELECT id FROM payment_orders WHERE invitation_id=${invitation.id}`).length, 0);
      throw rollback;
    }), (error) => error === rollback);
  } finally {
    if (appUrl === undefined) delete process.env.APP_URL;
    else process.env.APP_URL = appUrl;
    await closeDb();
  }
});
