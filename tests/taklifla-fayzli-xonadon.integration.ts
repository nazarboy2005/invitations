// Explicit opt-in against the local app and configured database. All invitation,
// account and submission records are disposable; no Telegram processor runs.
import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import {
  createInvitation,
  addLanguage,
  LOCALES,
  type SessionUser,
} from "../packages/contracts/src/index";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { publishInvitationInTransaction } from "../apps/web/src/server/publication";

const { chromium } = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
)("playwright");

test(
  "Xonadon saves, publishes, renders all locales and persists real guest responses",
  { timeout: 150000 },
  async () => {
    const origin = process.env.APP_URL!;
    assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
    assert.equal(
      process.env.PUBLISHING_MODE || "free",
      "free",
      "This check never starts a payment.",
    );
    const db = getDb(),
      token = randomToken(),
      guestToken = randomToken();
    const owner: SessionUser = {
      id: randomUUID(),
      telegramUserId: "",
      displayName: "Disposable Xonadon verification",
      phoneShared: true,
      isAdmin: false,
    };
    let invitation = createInvitation("taklifla-fayzli-xonadon");
    invitation.eventType = "yangi-uy";
    let browser: any;
    const checks: string[] = [];
    const request = (path: string, body?: unknown, method?: string) =>
      fetch(`${origin}${path}`, {
        method: method || (body === undefined ? "GET" : "POST"),
        headers: {
          Origin: origin,
          "Content-Type": "application/json",
          Cookie: `taklifnoma_session=${token}`,
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    try {
      const [user] =
        await db`INSERT INTO users(id,telegram_user_id,display_name,phone_number,phone_source,phone_shared_at) VALUES(${owner.id},${-Math.floor(Math.random() * 1e12) - 1},${owner.displayName},'+000000000','telegram_contact',now()) RETURNING telegram_user_id`;
      owner.telegramUserId = String(user.telegram_user_id);
      await db`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${owner.id},${digest(token)},'Disposable Xonadon verification',now()+interval '1 hour',now()+interval '1 hour')`;
      await db`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${invitation.id},${owner.id},'taklifla-fayzli-xonadon','draft',${db.json(invitation)})`;
      assert.equal(
        (await (await request("/api/auth/session")).json()).user.id,
        owner.id,
      );
      for (const locale of LOCALES) {
        invitation = addLanguage(invitation, locale);
        Object.assign(invitation.content[locale], {
          title: `Invitation ${locale}`,
          eventLabel: `Corporate ${locale}`,
          people: [`Hosts ${locale}`],
          greeting: `Greeting ${locale}`,
          personalGreeting: `Welcome {name} ${locale}`,
          message: `Authored invitation ${locale}`,
          hosts: `Hosts ${locale}`,
          venueName: `Creator venue ${locale}`,
          address: `Creator address ${locale}`,
        });
      }
      invitation.startsAt = "2027-07-14T18:00";
      invitation.timezone = "Asia/Tashkent";
      invitation.celebrantAge = 5;
      invitation.venue = {
        latitude: 41.31,
        longitude: 69.28,
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Creator+venue&query_place_id=ChIJtest",
      };
      invitation.story = Array.from({ length: 5 }, (_, i) => ({
        id: `chapter-${i}`,
        title: Object.fromEntries(
          LOCALES.map((locale) => [locale, `Chapter ${i} ${locale}`]),
        ),
        text: Object.fromEntries(
          LOCALES.map((locale) => [locale, `Authored chapter ${i} ${locale}`]),
        ),
      }));
      invitation.templateData["taklifla-fayzli-xonadon"]={menu:[{id:"stable-course",label:Object.fromEntries(LOCALES.map(l=>[l,`Course ${l}`])),name:Object.fromEntries(LOCALES.map(l=>[l,`Meal ${l}`])),description:Object.fromEntries(LOCALES.map(l=>[l,`Details ${l}`]))}]};
      invitation.rsvp = { enabled: true, deadline: "", maxPartySize: 4 };
      invitation.wishes.enabled = true;
      let response = await request(
        `/api/invitations/${invitation.id}`,
        { invitation },
        "PUT",
      );
      assert.equal(response.status, 200, await response.clone().text());
      invitation = (await response.json()).invitation;
      const reopened = (
        await (await request(`/api/invitations/${invitation.id}`)).json()
      ).invitation;
      assert.deepEqual(reopened, invitation);
      assert.deepEqual(reopened.templateData, invitation.templateData);
      checks.push(
        "Authenticated four-locale save/reopen preserves authored fields, authored story chapters and venue",
      );
      const originalShared = structuredClone(invitation);
      for (const templateId of (process.env.TAKLIFLA_PRIVATE_QA ? [] : ["yangi-uy", "taklifla-fayzli-xonadon"])) {
        response = await request(
          `/api/invitations/${invitation.id}`,
          { invitation: { ...invitation, templateId } },
          "PUT",
        );
        assert.equal(response.status, 200, await response.clone().text());
        invitation = (await response.json()).invitation;
        for (const field of [
          "content",
          "program",
          "venue",
          "contacts",
          "story",
          "gallery",
          "dressCode",
          "gift",
          "enabledLocales",
          "wishes",
          "templateData",
        ] as const)
          assert.deepEqual(invitation[field], originalShared[field], field);
      }
      if (!process.env.TAKLIFLA_PRIVATE_QA) checks.push(
        "Switching between compatible published corporate templates preserves all shared creator content on real save/reopen",
      );
      // Exercise the real publication transaction before exposing the catalog row.
      // The temporary catalog flag is restored before this transaction commits.
      const publication = await db.begin(async (tx) => {
        const [template] =
          await tx`SELECT published FROM templates WHERE id='taklifla-fayzli-xonadon' FOR UPDATE`;
        assert.ok(template);
        await tx`UPDATE templates SET published=true WHERE id='taklifla-fayzli-xonadon'`;
        const result = await publishInvitationInTransaction(
          tx,
          invitation.id,
          invitation.revision,
          owner,
        );
        await tx`UPDATE templates SET published=${template.published} WHERE id='taklifla-fayzli-xonadon'`;
        return result;
      });
      invitation = publication.invitation;
      assert.equal(invitation.status, "published");
      assert.match(invitation.slug!, /^[0-9A-Za-z]{6}$/);
      checks.push(
        "Real shared publication transaction succeeds and preserves the existing catalog publication state",
      );
      await db`INSERT INTO invitation_guests(invitation_id,display_name,token_hash,max_party_size) VALUES(${invitation.id},'Personalized Xonadon guest',${digest(guestToken)},4)`;
      browser = await chromium.launch({
        executablePath:
          process.env.CHROME_EXECUTABLE ||
          "C:/Program Files/Google/Chrome/Application/chrome.exe",
        headless: true,
      });
      const ownerContext = await browser.newContext({
        viewport: { width: 1280, height: 850 },
        reducedMotion: "reduce",
      });
      await ownerContext.addCookies([
        { name: "taklifnoma_session", value: token, url: origin },
      ]);
      const editor = await ownerContext.newPage();
      await editor.goto(`${origin}/studio/${invitation.id}`, {
        waitUntil: "domcontentloaded",
      });
      const studioFrame = editor.frameLocator(
        'iframe[src*="taklifla-fayzli-xonadon/index.html"]',
      );
      await studioFrame
        .locator(".hero-names")
        .filter({
          hasText: invitation.content[invitation.defaultLocale].hosts,
        })
        .waitFor();
      assert.equal(
        await studioFrame.locator(".hero-names").textContent(),
        invitation.content[invitation.defaultLocale].hosts,
      );
      checks.push(
        "Authenticated studio uses the same renderer with saved creator data and opens the preview scene",
      );
      await ownerContext.close();
      const page = await browser.newPage({
        viewport: { width: 390, height: 844 },
        reducedMotion: "reduce",
      });
      const errors: string[] = [];
      page.on("pageerror", (error: Error) => errors.push(error.message));
      for (const locale of LOCALES) {
        await page.goto(
          `${origin}/i/${invitation.slug}?g=${guestToken}&lang=${locale}`,
          { waitUntil: "domcontentloaded" },
        );
        const frame = page.frameLocator(
          'iframe[src*="taklifla-fayzli-xonadon/index.html"]',
        );
        await frame.locator("html[data-ready]").waitFor();
        assert.equal(await frame.locator(".menu-course").getAttribute("data-item-id"),"stable-course");
        assert.equal(await frame.locator(".menu-course-name").textContent(),`Meal ${locale}`);
        assert.equal(
          await frame.locator(".hero-names").textContent(),
          `Hosts ${locale}`,
        );
        assert.ok(
          (
            await frame.locator(".welcome .eyebrow").textContent()
          )?.includes("Personalized Xonadon guest"),
        );
        assert.equal(
          await frame.locator(".map-card").getAttribute("href"),
          invitation.venue.mapUrl,
        );
      }
      checks.push(
        "Real public route uses the same renderer in every locale with the resolved guest and creator-selected Google Place",
      );
      const frame = page.frameLocator(
        'iframe[src*="taklifla-fayzli-xonadon/index.html"]',
      );
      await frame.locator('#rsvp-name').fill("Backend Xonadon guest");
      await frame.locator('#rsvp-form .btn').click();
      await frame.locator('#rsvp-thanks').filter({hasText:"Спасибо!"}).waitFor();
      const [reply]=await db`SELECT status,party_size,note,guest_id FROM rsvp_responses WHERE invitation_id=${invitation.id}`;
      assert.equal(reply.status,"yes");assert.equal(reply.party_size,1);assert.ok(reply.guest_id);
      checks.push("Real RSVP persists one-person attendance, resolved guest identity");
      invitation.content["en"].message = "Reopened creator correction";
      invitation.venue = {
        latitude: null,
        longitude: null,
        mapUrl: "https://www.google.com/maps?q=41.2995,69.2401",
      };
      response = await request(
        `/api/invitations/${invitation.id}`,
        { invitation },
        "PUT",
      );
      assert.equal(response.status, 200, await response.clone().text());
      invitation = (await response.json()).invitation;
      await page.goto(`${origin}/i/${invitation.slug}?lang=en`, {
        waitUntil: "domcontentloaded",
      });
      const updated = page.frameLocator(
        'iframe[src*="taklifla-fayzli-xonadon/index.html"]',
      );
      await updated.locator("html[data-ready]").waitFor();
      assert.ok(
        (
          await updated.locator(".welcome-quote").textContent()
        )?.includes("Reopened creator correction"),
      );
      assert.equal(
        await updated.locator(".map-card").getAttribute("href"),
        invitation.venue.mapUrl,
      );

      checks.push(
        "Published edit/reopen updates authored content and manual Google Maps target in the public renderer",
      );
      assert.deepEqual(errors, []);
      await writeFile(
        "docs/templates/taklifla-audit/xonadon-integration.json",
        JSON.stringify(
          {
            date: "2026-10-29",
            checks,
            consoleErrors: errors,
            cleanup:
              "All generated accounts, invitations, guest responses and notification jobs removed",
          },
          null,
          2,
        ) + "\n",
      );
    } finally {
      await browser?.close();
      await db.begin(async (tx) => {
        await tx`DELETE FROM jobs WHERE payload->>'wishId' IN (SELECT id::text FROM wishes WHERE invitation_id=${invitation.id})`;
        await tx`DELETE FROM gift_receipts WHERE invitation_id=${invitation.id}`;
        await tx`DELETE FROM wishes WHERE invitation_id=${invitation.id}`;
        await tx`DELETE FROM rsvp_responses WHERE invitation_id=${invitation.id}`;
        await tx`DELETE FROM invitation_viewers WHERE invitation_id=${invitation.id}`;
        await tx`DELETE FROM invitation_guests WHERE invitation_id=${invitation.id}`;
        await tx`DELETE FROM invitation_audit_log WHERE invitation_id=${invitation.id}`;
        await tx`DELETE FROM invitations WHERE id=${invitation.id} AND owner_id=${owner.id}`;
        await tx`DELETE FROM sessions WHERE user_id=${owner.id}`;
        await tx`DELETE FROM users WHERE id=${owner.id}`;
      });
      await closeDb();
    }
  },
);
