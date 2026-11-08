// Run against the isolated :3012 test server with the Telegram fetch interceptor.
// All records belong to disposable users; Telegram delivery is intercepted or injected.
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID, randomInt } from "node:crypto";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { getDb, closeDb } from "../packages/database/src/index";
import {
  invitationSchema,
  pulauSehatiDataSchema,
} from "../packages/contracts/src/index";
import { completeInvitation } from "./fixtures/publication";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import {
  enqueueGuestNotification,
  processGuestNotifications,
} from "../apps/web/src/server/guest-notifications";
import { removeLocalMedia } from "../apps/web/src/server/local-storage";

const { chromium } = createRequire(import.meta.url)(
  "../apps/web/node_modules/playwright",
);
const origin = "http://127.0.0.1:3012";

test(
  "visitor submissions reach activity, immediate Telegram delivery, durable recovery and template-aware tabs",
  { timeout: 600000 },
  async () => {
    const db = getDb();
    const owner = randomUUID(),
      outsider = randomUUID(),
      token = randomToken(),
      otherToken = randomToken();
    const telegramId = -randomInt(1e12);
    const invitations: string[] = [];
    const browserErrors: string[] = [];
    let browser: any;
  process.env.LOCAL_MEDIA_DIR = resolve(".tmp/visitor-activity-media");
    async function fixture(templateId: string) {
      const invitation = {
        ...completeInvitation(),
        templateId,
        status: "published" as const,
      };
      invitation.id = randomUUID();
      invitation.content["uz-Latn"].people = ["Visitor QA", "Activity QA"];
      if (templateId === "anor")
        invitation.gift = {
          enabled: true,
          receiptUploadEnabled: true,
          cardHolder: "Visitor QA",
          cardNumber: "4444333322221111",
        };
      if (templateId === "wedivo-pulau-sehati")
        invitation.templateData[templateId] = pulauSehatiDataSchema.parse({
          giftWell: { enabled: true, currencyLabel: "UZS" },
        });
      invitations.push(invitation.id);
      await db`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${invitation.id},${owner},${templateId},'published',${db.json(invitationSchema.parse(invitation))})`;
      return invitation;
    }
    async function request(
      path: string,
      body?: unknown,
      cookie = token,
      method?: string,
    ) {
      return fetch(origin + path, {
        method: method ?? (body === undefined ? "GET" : "POST"),
        headers: {
          Origin: origin,
          "Content-Type": "application/json",
          ...(cookie ? { Cookie: `taklifnoma_session=${cookie}` } : {}),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    }
    async function activity(id: string) {
      const response = await request(`/api/invitations/${id}/activity`);
      assert.equal(response.status, 200, await response.clone().text());
      return response.json();
    }
    try {
      await db`INSERT INTO users(id,telegram_user_id,display_name) VALUES(${owner},${telegramId},'Disposable visitor QA'),(${outsider},${telegramId - 1},'Disposable outsider QA')`;
      await db`INSERT INTO telegram_connections(user_id,telegram_chat_id) VALUES(${owner},${telegramId})`;
      for (const [user, value] of [
        [owner, token],
        [outsider, otherToken],
      ])
        await db`INSERT INTO sessions(user_id,token_hash,expires_at,absolute_expires_at) VALUES(${user},${digest(value)},now()+interval '1 hour',now()+interval '1 hour')`;
      const session = await request("/api/auth/session");
      assert.equal(
        (await session.json()).user?.id,
        owner,
        "Use the intercepted Telegram test server on :3012",
      );
      const standard = await fixture("anor"),
        wishesOnly = await fixture("taklifla-muhrli-maktub"),
        none = await fixture("ivory-rose-card"),
        pulau = await fixture("wedivo-pulau-sehati"),
        responseOnly = await fixture("palov"),
        uchrashuv = await fixture("taklifla-uchrashuv");
      const base = `/api/public/invitations/${standard.id}`;
      const answer = {
        name: "Visitor QA guest",
        status: "yes",
        partySize: 1,
        note: "QA dietary note",
      };
      const rsvp = await request(base + "/rsvp", answer, "");
      assert.equal(rsvp.status, 201, await rsvp.clone().text());
      const responseCookie = rsvp.headers.get("set-cookie")!.split(";")[0];
      async function repeat(status: string) {
        return fetch(origin + base + "/rsvp", {
          method: "POST",
          headers: {
            Origin: origin,
            "Content-Type": "application/json",
            Cookie: responseCookie,
          },
          body: JSON.stringify({ ...answer, status }),
        });
      }
      assert.equal((await repeat("yes")).status, 201);
      assert.equal((await repeat("no")).status, 201);
      const wish = await request(
        base + "/wishes",
        { name: "Visitor QA guest", message: "QA wish <b>stays escaped</b>" },
        "",
      );
      assert.equal(wish.status, 201, await wish.clone().text());
      const form = new FormData();
      form.set("giverNames", "Visitor QA guest");
      form.set(
        "file",
        new File(
          [
            Buffer.from(
              "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1fcAAAAASUVORK5CYII=",
              "base64",
            ),
          ],
          "qa-receipt.png",
          { type: "image/png" },
        ),
      );
      for (let n = 0; n < 2; n++) {
        const receipt = await fetch(origin + base + "/receipts", {
          method: "POST",
          headers: { Origin: origin },
          body: form,
        });
        assert.equal(
          receipt.status,
          n ? 200 : 201,
          await receipt.clone().text(),
        );
      }
      const intention = await request(
        `/api/public/invitations/${pulau.id}/gift-intentions`,
        { name: "Visitor QA guest", amount: 150000, message: "QA gift pledge" },
        "",
      );
      assert.equal(intention.status, 201, await intention.clone().text());
      assert.equal(
        (
          await request(
            `/api/public/invitations/${wishesOnly.id}/rsvp`,
            answer,
            "",
          )
        ).status,
        403,
      );
      assert.equal(
        (
          await request(
            `/api/public/invitations/${none.id}/wishes`,
            { name: "QA", message: "Blocked" },
            "",
          )
        ).status,
        403,
      );
      assert.equal(
        (
          await request(
            `/api/public/invitations/${uchrashuv.id}/rsvp`,
            answer,
            "",
          )
        ).status,
        201,
      );
      assert.equal(
        (
          await request(
            `/api/invitations/${standard.id}/activity`,
            undefined,
            otherToken,
          )
        ).status,
        404,
      );
      const inbox = await activity(standard.id);
      assert.equal(inbox.responses.length, 1);
      assert.equal(inbox.responses[0].status, "no");
      assert.equal(inbox.responses[0].note, answer.note);
      assert.equal(inbox.wishes[0].status, "pending");
      assert.equal(inbox.receipts.length, 1);
      assert.deepEqual(inbox.features, {
        responses: true,
        wishes: true,
        receipts: true,
        intentions: false,
      });
      assert.deepEqual(
        (await (await request(base + "/wishes", undefined, "")).json()).wishes,
        [],
      );
      assert.equal((await activity(pulau.id)).giftIntentions.length, 1);
      assert.deepEqual((await activity(wishesOnly.id)).features, {
        responses: false,
        wishes: true,
        receipts: false,
        intentions: false,
      });
      assert.deepEqual((await activity(none.id)).features, {
        responses: false,
        wishes: false,
        receipts: false,
        intentions: false,
      });
      const privateReceipt = inbox.receipts[0].url;
      assert.notEqual(
        (await request(privateReceipt, undefined, "")).status,
        200,
      );
      assert.equal((await request(privateReceipt)).status, 200);
      // The after() callbacks must actually deliver every new submission through the interceptor.
      for (let n = 0; n < 30; n++) {
        const [{ pending }] =
          await db`SELECT count(*)::int AS pending FROM jobs WHERE type='guest-notification' AND payload->>'invitationId'=ANY(${db.array(invitations)}::text[]) AND status<>'completed'`;
        if (!pending) break;
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
      const jobs =
        await db`SELECT status,payload FROM jobs WHERE type='guest-notification' AND payload->>'invitationId'=ANY(${db.array(invitations)}::text[])`;
      assert.equal(
        jobs.length,
        6,
        "Identical RSVP and receipt resubmissions do not create extra notices",
      );
      assert.ok(
        jobs.every((j) => j.status === "completed"),
        JSON.stringify(jobs.map((j) => j.status)),
      );
      const delivered = readFileSync(
        ".tmp/guest-notification-deliveries.jsonl",
        "utf8",
      )
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line))
        .filter((row) => String(row.chat_id) === String(telegramId));
      assert.equal(delivered.length, 6);
      assert.ok(
        delivered.every(
          (row) =>
            !JSON.stringify(row).includes("/api/media/") &&
            row.text.length < 1600,
        ),
      );
      assert.ok(
        delivered.some((row) =>
          row.text.includes("QA wish &lt;b&gt;stays escaped&lt;/b&gt;"),
        ),
      );
      // Queue recovery: injected sender, never a Telegram API call.
      const recordId = inbox.wishes[0].id;
      async function queued(suffix: string) {
        return db.begin((tx) =>
          enqueueGuestNotification(
            tx,
            {
              kind: "wish",
              invitationId: standard.id,
              recordId,
              name: "QA recovery",
              message: "QA queued",
            },
            `guest-qa:${suffix}:${randomUUID()}`,
          ),
        );
      }
      const recovery = await queued("recovery");
      let sends = 0;
      const sender = async () => {
        sends++;
        await new Promise((resolve) => setTimeout(resolve, 50));
        return { state: "sent" as const };
      };
      await Promise.all([
        processGuestNotifications({ jobId: recovery, send: sender }),
        processGuestNotifications({ jobId: recovery, send: sender }),
      ]);
      assert.equal(sends, 1);
      const retry = await queued("retry");
      await db`UPDATE jobs SET attempts=11 WHERE id=${retry!}`;
      await processGuestNotifications({
        jobId: retry,
        send: async () => ({ state: "retry", after: 1 }),
      });
      const [exhausted] =
        await db`SELECT attempts,status FROM jobs WHERE id=${retry!}`;
      assert.equal(exhausted.attempts, 12);
      assert.equal(exhausted.status, "failed");
      const delayed = await queued("delayed");
      await processGuestNotifications({
        jobId: delayed,
        send: async () => ({ state: "retry", after: 60 }),
      });
      assert.equal(
        (await db`SELECT status FROM jobs WHERE id=${delayed!}`)[0].status,
        "queued",
      );
      await db`UPDATE jobs SET available_at=now() WHERE id=${delayed!}`;
      await processGuestNotifications({ jobId: delayed, send: sender });
      assert.equal(
        (await db`SELECT status FROM jobs WHERE id=${delayed!}`)[0].status,
        "completed",
      );
      const interrupted = await queued("interrupted");
      await db`UPDATE jobs SET status='processing',locked_at=now()-interval '3 minutes' WHERE id=${interrupted!}`;
      await processGuestNotifications({
        jobId: interrupted,
        send: async () => {
          throw new Error("Must not redeliver unknown acceptance");
        },
      });
      assert.equal(
        (await db`SELECT status FROM jobs WHERE id=${interrupted!}`)[0].status,
        "uncertain",
      );

      browser = await chromium.launch({
        headless: true,
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      });
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
      });
      await context.addCookies([
        { name: "taklifnoma_session", value: token, url: origin },
      ]);
      const page = await context.newPage();
      page.on("pageerror", (error: Error) => browserErrors.push(error.message));
      const output = "docs/qa/2026-11-08-visitor-activity";
      mkdirSync(output, { recursive: true });
      for (const [id, names, screenshot] of [
        [
          standard.id,
          ["Javoblar", "Tilaklar", "To‘yona"],
          "standard-mobile.png",
        ],
        [wishesOnly.id, ["Tilaklar"], "wishes-only-mobile.png"],
        [none.id, [], "no-interactions-mobile.png"],
        [
          pulau.id,
          ["Javoblar", "Tilaklar", "Sovg‘a niyatlari"],
          "gift-intentions-mobile.png",
        ],
        [responseOnly.id, ["Javoblar"], "responses-only-mobile.png"],
      ] as [string, string[], string][]) {
        await page.goto(`${origin}/dashboard/${id}/activity`, {
          waitUntil: "domcontentloaded",
        });
        if (names.length) await page.getByRole("tab").first().waitFor();
        else
          await page
            .getByText(
              "Bu taklifnomada mehmonlardan ma’lumot qabul qilinmaydi.",
            )
            .waitFor();
        const tabs = await page.getByRole("tab").allTextContents();
        assert.equal(tabs.length, names.length);
        names.forEach((name, index) =>
          assert.ok(tabs[index].includes(name), JSON.stringify(tabs)),
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
        );
        await page.screenshot({
          path: `${output}/${screenshot}`,
          fullPage: true,
        });
      }
      assert.deepEqual(browserErrors, []);
      writeFileSync(
        `${output}/integration-result.json`,
        JSON.stringify(
          {
            immediateTelegramMessages: 6,
            repeatSubmissionsDeduplicated: true,
            allFourSubmissionTypes: true,
            retryAndConcurrencyChecks: true,
            ownerAuthorizationAndPrivateReceipts: true,
            activityLayouts: 5,
            browserErrors,
            telegram: "All calls intercepted; no real messages sent",
            cleanup: "Disposable rows and uploaded receipt removed in finally",
          },
          null,
          2,
        ) + "\n",
      );
    } finally {
      await browser?.close();
      const assets =
        await db`SELECT object_key FROM media_assets WHERE owner_id=${owner}`;
      for (const asset of assets)
        if (asset.object_key.startsWith("local/"))
          await removeLocalMedia(asset.object_key);
      await db.begin(async (tx) => {
        await tx`DELETE FROM jobs WHERE type='guest-notification' AND payload->>'invitationId'=ANY(${tx.array(invitations)}::text[])`;
        await tx`DELETE FROM gift_receipts WHERE invitation_id=ANY(${tx.array(invitations)}::uuid[])`;
        await tx`DELETE FROM pulau_gift_intentions WHERE invitation_id=ANY(${tx.array(invitations)}::uuid[])`;
        await tx`DELETE FROM wishes WHERE invitation_id=ANY(${tx.array(invitations)}::uuid[])`;
        await tx`DELETE FROM rsvp_responses WHERE invitation_id=ANY(${tx.array(invitations)}::uuid[])`;
        await tx`DELETE FROM media_assets WHERE owner_id=${owner}`;
        await tx`DELETE FROM invitations WHERE owner_id=${owner}`;
        await tx`DELETE FROM sessions WHERE user_id IN (${owner},${outsider})`;
        await tx`DELETE FROM telegram_connections WHERE user_id=${owner}`;
        await tx`DELETE FROM users WHERE id IN (${owner},${outsider})`;
      });
      await closeDb();
    }
  },
);
