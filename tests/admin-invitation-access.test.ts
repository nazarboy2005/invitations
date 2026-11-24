import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import type { SessionUser } from "../packages/contracts/src/index";
import { normalizeInvitation } from "../packages/contracts/src/capabilities";
import { completeInvitation } from "./fixtures/publication";
import { grantTestPurchase } from "./fixtures/payment";
import { publishInvitationInTransaction } from "../apps/web/src/server/publication";
import {
  createCheckout,
  getInvitationPayment,
  getPaymentOrder,
  refreshPayment,
} from "../apps/web/src/server/payments";
import { saveInvitation } from "../apps/web/src/server/invitations";
import { assertStaticImageEntitlement } from "../apps/web/src/server/static-image-entitlement";
import {
  findAdminInvitationGrant,
  grantAdminInvitationAccess,
  hasInvitationEntitlement,
} from "../apps/web/src/server/invitation-entitlements";

// Execute production functions and SQL in an isolated PostgreSQL engine.
function tag(client: any): any {
  let savepoint = 0;
  const sql = async (parts: TemplateStringsArray, ...values: unknown[]) =>
    (
      await client.query(
        parts
          .map((part, i) => part + (i < values.length ? `$${i + 1}` : ""))
          .join(""),
        values,
      )
    ).rows;
  sql.json = JSON.stringify;
  sql.begin = (fn: any) => client.transaction((tx: any) => fn(tag(tx)));
  sql.savepoint = async (fn: any) => {
    const name = `fixture_${++savepoint}`;
    await client.query(`SAVEPOINT ${name}`);
    try {
      const result = await fn(sql);
      await client.query(`RELEASE SAVEPOINT ${name}`);
      return result;
    } catch (error) {
      await client.query(`ROLLBACK TO SAVEPOINT ${name}`);
      await client.query(`RELEASE SAVEPOINT ${name}`);
      throw error;
    }
  };
  return sql;
}

test("admin-owned event access never trusts client roles or changes provider payment/revenue", async (t) => {
  const db = new PGlite();
  const globals = globalThis as any;
  const oldDb = globals.fotihaDatabase;
  const originalFetch = globalThis.fetch;
  const env = {
    DATABASE_URL: process.env.DATABASE_URL,
    APP_URL: process.env.APP_URL,
    PLATFORM_ADMIN_TELEGRAM_IDS: process.env.PLATFORM_ADMIN_TELEGRAM_IDS,
    NODZE_API_KEY: process.env.NODZE_API_KEY,
  };
  const sql = tag(db);
  globals.fotihaDatabase = sql;
  process.env.DATABASE_URL = "postgres://unused-isolated-test";
  process.env.APP_URL = "https://invitations.example";
  process.env.PLATFORM_ADMIN_TELEGRAM_IDS = "987654321";
  delete process.env.NODZE_API_KEY;
  let externalCalls = 0;
  globalThis.fetch = async () => {
    externalCalls++;
    throw new Error("External requests are forbidden in this test");
  };
  const rejects = (action: Promise<unknown>, code: string) =>
    assert.rejects(action, (error: any) => error.code === code);
  let telegramId = 100;
  async function account(
    isAdmin = false,
    disabled = false,
    telegram?: number,
  ): Promise<SessionUser> {
    const user = {
      id: randomUUID(),
      telegramUserId: String(telegram ?? ++telegramId),
      displayName: "Isolated entitlement fixture",
      isAdmin,
    };
    await sql`INSERT INTO users(id,telegram_user_id,display_name,is_admin,disabled_at)
      VALUES(${user.id},${user.telegramUserId},${user.displayName},${isAdmin},${disabled ? new Date().toISOString() : null})`;
    return user;
  }
  async function draft(owner: SessionUser, image = false) {
    const invitation = normalizeInvitation({
      ...completeInvitation(),
      ...(image ? { templateId: "oq-atirgul" } : {}),
    });
    await sql`INSERT INTO invitations(id,owner_id,template_id,data) VALUES(${invitation.id},${owner.id},${invitation.templateId},${sql.json(invitation)})`;
    return invitation;
  }
  const publish = (
    invitation: ReturnType<typeof completeInvitation>,
    owner: SessionUser,
  ) =>
    sql.begin((tx: any) =>
      publishInvitationInTransaction(
        tx,
        invitation.id,
        invitation.revision,
        owner,
      ),
    );
  try {
    const directory = new URL(
      "../packages/database/migrations/",
      import.meta.url,
    );
    await db.exec("BEGIN");
    // Use the production access/payment schema without unrelated template fixtures.
    for (const name of [
      "0001_foundation.sql",
      "0002_template_categories.sql",
      "0007_template_event_compatibility.sql",
      "0009_catalog_music.sql",
      "0151_admin_audit_log.sql",
      "0152_admin_management.sql",
      "0160_nodze_payments.sql",
      "0162_two_invitation_states.sql",
      "0209_invitation_edit_approvals.sql",
      "0239_admin_invitation_grants.sql",
    ]) {
      await db.exec(
        "SET CONSTRAINTS ALL IMMEDIATE; SET CONSTRAINTS ALL DEFERRED",
      );
      await db.exec(await readFile(new URL(name, directory), "utf8"));
    }
    await db.exec("COMMIT");
    await sql`INSERT INTO templates(id,name,price_minor,published) VALUES('anor','Anor',4900000,true),('oq-atirgul','Oq atirgul',500000,true)`;
    await sql`INSERT INTO template_supported_event_types(template_id,event_type) VALUES('anor','wedding'),('oq-atirgul','wedding')`;
    const ordinary = await account();
    const admin = await account(true);
    const allowlisted = await account(false, false, 987654321);
    const disabled = await account(true, true);

    await t.test(
      "forged admin flags/Telegram IDs, zero price and finalized metadata grant nothing",
      async () => {
        const invitation = await draft(ordinary);
        await rejects(
          publish(invitation, {
            ...ordinary,
            isAdmin: true,
            telegramUserId: "987654321",
          }),
          "PAYMENT_REQUIRED",
        );
        const image = await draft(ordinary, true);
        await rejects(
          assertStaticImageEntitlement(
            sql,
            { ...image, imageExportedAt: new Date().toISOString() },
            ordinary.id,
          ),
          "PAYMENT_REQUIRED",
        );
        await sql`UPDATE templates SET price_minor=0 WHERE id=${invitation.templateId}`;
        await rejects(publish(invitation, ordinary), "PAYMENT_REQUIRED");
        await sql`UPDATE templates SET price_minor=4900000 WHERE id=${invitation.templateId}`;
        assert.equal(
          (await sql`SELECT * FROM admin_invitation_grants`).length,
          0,
        );
      },
    );

    await t.test(
      "database admins and allowlisted admins publish through the ordinary path without checkout",
      async () => {
        for (const owner of [admin, allowlisted]) {
          const invitation = await draft(owner);
          // The client flag can even be false: database/server policy is authoritative.
          const result = await publish(invitation, {
            ...owner,
            isAdmin: false,
          });
          assert.equal(result.invitation.status, "published");
          assert.match(result.url, /\/i\/[A-Za-z0-9]{6}$/);
          assert.equal((await publish(invitation, owner)).url, result.url);
          const grants =
            await sql`SELECT * FROM admin_invitation_grants WHERE invitation_id=${invitation.id}`;
          assert.equal(grants.length, 1);
          assert.equal(
            (
              await sql`SELECT * FROM payment_orders WHERE invitation_id=${invitation.id}`
            ).length,
            0,
          );
          assert.equal(
            (
              await sql`SELECT * FROM admin_payment_records WHERE invitation_id=${invitation.id}`
            ).length,
            0,
          );
          const context = await getInvitationPayment(invitation.id, owner.id);
          assert.equal(context.order?.status, "SUCCEEDED");
          assert.equal(context.order?.checkoutUrl, null);
          assert.equal(
            (await getPaymentOrder(String(grants[0].id), owner.id)).url,
            result.url,
          );
          await refreshPayment(String(grants[0].id), owner.id);
          await rejects(
            getPaymentOrder(String(grants[0].id), ordinary.id),
            "NOT_FOUND",
          );
          const [audit] =
            await sql`SELECT action FROM invitation_audit_log WHERE invitation_id=${invitation.id} AND action='published_admin'`;
          assert.equal(audit.action, "published_admin");
          await rejects(
            saveInvitation(
              {
                ...result.invitation,
                content: {
                  ...result.invitation.content,
                  "uz-Latn": {
                    ...result.invitation.content["uz-Latn"]!,
                    people: ["Someone else", "Different event"],
                  },
                },
              },
              owner,
            ),
            "NAME_CHANGE_REQUIRES_REVIEW",
          );
        }
      },
    );

    await t.test(
      "checkout also skips the provider and image grants remain scoped to one event and owner",
      async () => {
        const web = await draft(admin);
        const checkout = await createCheckout(
          web.id,
          web.revision,
          4900000,
          admin,
        );
        assert.equal(checkout.status, "SUCCEEDED");
        assert.ok(checkout.url);
        assert.deepEqual(
          await createCheckout(web.id, web.revision, 4900000, admin),
          checkout,
        );
        const image = await draft(admin, true);
        await assertStaticImageEntitlement(sql, image, admin.id);
        assert.equal(
          await findAdminInvitationGrant(sql, image, admin.id),
          null,
          "preflight does not grant access",
        );
        const order = await createCheckout(
          image.id,
          image.revision,
          500000,
          admin,
        );
        assert.equal(order.status, "SUCCEEDED");
        assert.equal(order.url, null);
        assert.equal(
          await hasInvitationEntitlement(sql, image, ordinary.id),
          false,
        );
        assert.equal(
          await hasInvitationEntitlement(
            sql,
            { ...image, id: randomUUID() },
            admin.id,
          ),
          false,
        );
        const different = {
          ...image,
          content: {
            ...image.content,
            "uz-Latn": {
              ...image.content["uz-Latn"]!,
              people: ["Other", "Names"],
            },
          },
        };
        assert.equal(
          await hasInvitationEntitlement(sql, different, admin.id),
          false,
        );
        await rejects(
          saveInvitation(different, admin),
          "CHECKOUT_IDENTITY_LOCKED",
        );
        await rejects(
          createCheckout(image.id, image.revision, 500000, ordinary),
          "NOT_FOUND",
        );
        assert.equal(
          await sql.begin((tx: any) =>
            grantAdminInvitationAccess(tx, image, ordinary.id),
          ),
          null,
        );
        const [state] =
          await sql`SELECT status,slug,identity_locked_at FROM invitations WHERE id=${image.id}`;
        assert.equal(state.status, "draft");
        assert.equal(state.slug, null);
        assert.equal(
          state.identity_locked_at,
          null,
          "image finalizes only on actual download",
        );
        // Previously granted event access survives role removal; new access does not.
        await sql`UPDATE users SET is_admin=false WHERE id=${admin.id}`;
        await assertStaticImageEntitlement(sql, image, admin.id);
        const newImage = await draft(admin, true);
        await rejects(
          assertStaticImageEntitlement(sql, newImage, admin.id),
          "PAYMENT_REQUIRED",
        );
        await rejects(
          publish(await draft(admin), { ...admin, isAdmin: true }),
          "PAYMENT_REQUIRED",
        );
        await sql`UPDATE users SET is_admin=true WHERE id=${admin.id}`;
        const grant = await findAdminInvitationGrant(sql, image, admin.id);
        await assert.rejects(
          sql`UPDATE admin_invitation_grants SET owner_id=${ordinary.id} WHERE id=${grant!.id}`,
          /immutable/,
        );
      },
    );

    await t.test(
      "disabled admins and admin work on ordinary owners' invitations cannot waive payment",
      async () => {
        const invitation = await draft(disabled);
        await rejects(publish(invitation, disabled), "PAYMENT_REQUIRED");
        await rejects(
          createCheckout(invitation.id, invitation.revision, 4900000, disabled),
          "ACCOUNT_UNAVAILABLE",
        );
        const ordinaryDraft = await draft(ordinary);
        await rejects(
          sql.begin((tx: any) =>
            publishInvitationInTransaction(
              tx,
              ordinaryDraft.id,
              ordinaryDraft.revision,
              ordinary,
              undefined,
              {
                actorId: admin.id,
                reason: "Admin editing another owner's invitation",
              },
            ),
          ),
          "PAYMENT_REQUIRED",
        );
        const before = await sql`SELECT * FROM admin_invitation_grants`;
        const incomplete = await draft(admin);
        incomplete.content["uz-Latn"]!.venueName = "";
        await sql`UPDATE invitations SET data=${sql.json(incomplete)} WHERE id=${incomplete.id}`;
        await rejects(publish(incomplete, admin), "PUBLICATION_INCOMPLETE");
        assert.equal(
          (await sql`SELECT * FROM admin_invitation_grants`).length,
          before.length,
          "failed publication rolls back its grant",
        );
      },
    );

    await t.test(
      "ordinary users still publish only after a verified matching provider order",
      async () => {
        const invitation = await draft(ordinary);
        await rejects(publish(invitation, ordinary), "PAYMENT_REQUIRED");
        await grantTestPurchase(sql, invitation, ordinary.id);
        const result = await publish(invitation, ordinary);
        assert.equal(result.invitation.status, "published");
        assert.equal(
          await findAdminInvitationGrant(sql, invitation, ordinary.id),
          null,
        );
        const [audit] =
          await sql`SELECT action FROM invitation_audit_log WHERE invitation_id=${invitation.id}`;
        assert.equal(audit.action, "published_paid");
      },
    );
    assert.equal(externalCalls, 0, "no payment-provider or Telegram requests");
  } finally {
    globals.fotihaDatabase = oldDb;
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(env)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await db.close();
  }
});
