// Run with a dedicated local server (APP_URL matching PRIVACY_TEST_ORIGIN).
// Creates and removes only disposable fixtures; sends no Telegram messages.
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID, randomInt } from "node:crypto";
import { createRequire } from "node:module";
import { getDb, closeDb } from "../packages/database/src/index";
import { completeInvitation } from "./fixtures/publication";

const origin = process.env.PRIVACY_TEST_ORIGIN ?? "http://127.0.0.1:3018";
test(
  "anonymous invitation HTML, RSC, guest APIs and browser traffic exclude private creator data",
  { timeout: 180000 },
  async () => {
    const db = getDb();
    const owner = randomUUID(),
      id = randomUUID(),
      privateAsset = randomUUID();
    const telegramId = -randomInt(1e12);
    const marker = `PRIVATE-${randomUUID()}`;
    const slug = Array.from(
      { length: 6 },
      () =>
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[
          randomInt(62)
        ],
    ).join("");
    const invitation = {
      ...completeInvitation(),
      id,
      slug,
      status: "published" as const,
    };
    invitation.optionalFeatures.contacts = false;
    invitation.contacts = {
      phoneNumber: marker,
      telegramUsername: marker,
      instagramUrl: "",
    };
    invitation.gift = {
      enabled: false,
      receiptUploadEnabled: false,
      cardNumber: "1234567812345678",
      cardHolder: marker,
    };
    const secrets = [
      owner,
      String(telegramId),
      marker,
      ...Object.entries(process.env)
        .filter(
          ([name, value]) =>
            value &&
            value.length >= 16 &&
            /(?:TOKEN|SECRET|PASSWORD|DATABASE_URL|API_KEY|ACCESS_KEY)/.test(
              name,
            ),
        )
        .map(([, value]) => value!),
    ];
    function safe(text: string) {
      for (const secret of secrets)
        assert.ok(
          !text.includes(secret),
          "private value appeared in a public response",
        );
    }
    let browser: any;
    try {
      await db`INSERT INTO users(id,telegram_user_id,display_name) VALUES(${owner},${telegramId},'Disposable privacy QA')`;
      await db`INSERT INTO invitations(id,owner_id,template_id,status,slug,data) VALUES(${id},${owner},'anor','published',${slug},${db.json(invitation)})`;
      await db`INSERT INTO media_assets(id,owner_id,draft_id,object_key,url,filename,mime_type,size_bytes,visibility,status) VALUES(${privateAsset},${owner},${id},${`local/privacy/${privateAsset}.png`},${`/api/media/${privateAsset}`},'private.png','image/png',32,'private','ready')`;
      for (const headers of [{}, { RSC: "1" }]) {
        const response = await fetch(`${origin}/i/${slug}`, { headers });
        assert.equal(response.status, 200);
        assert.equal(response.headers.get("Referrer-Policy"), "no-referrer");
        safe(await response.text());
      }
      for (const [path, status] of [
        [`/api/public/invitations/${id}/wishes`, 200],
        [`/api/public/invitations/${id}/visitor-state`, 200],
        [`/api/invitations/${id}/activity`, 401],
        [`/api/media/${privateAsset}`, 404],
      ] as const) {
        const response = await fetch(origin + path);
        assert.equal(response.status, status);
        safe(await response.text());
      }
      const { chromium } = createRequire(import.meta.url)(
        "../apps/web/node_modules/playwright",
      );
      browser = await chromium.launch();
      const page = await browser.newPage();
      const inspections: Promise<void>[] = [];
      const errors: string[] = [];
      let checked = 0;
      page.on("console", (message: any) => {
        safe(message.text());
      });
      page.on("pageerror", (error: Error) => {
        errors.push(error.message);
      });
      page.on("response", (response: any) => {
        inspections.push(
          (async () => {
            safe(response.url());
            safe(JSON.stringify(await response.allHeaders()));
            const mime = (await response.headerValue("content-type")) ?? "";
            if (
              /json|javascript|text\/html|text\/x-component/.test(mime) &&
              response.url().startsWith(origin)
            ) {
              safe(await response.text());
              checked++;
            }
          })(),
        );
      });
      await page.goto(`${origin}/i/${slug}`, { waitUntil: "networkidle" });
      await Promise.all(inspections);
      assert.ok(
        checked >= 2,
        "inspect invitation document and JavaScript responses",
      );
      assert.deepEqual(errors, []);
      console.log(
        `Privacy HTTP/browser verification passed (${checked} response bodies inspected).`,
      );
    } finally {
      if (browser) await browser.close();
      await db`DELETE FROM media_assets WHERE id=${privateAsset} AND owner_id=${owner}`;
      await db`DELETE FROM invitations WHERE id=${id} AND owner_id=${owner}`;
      await db`DELETE FROM users WHERE id=${owner}`;
      await closeDb();
    }
  },
);
