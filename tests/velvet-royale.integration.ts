// Explicit opt-in against the local app and configured database. All invitation,
// account and submission records are disposable; no Telegram processor runs.
import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { writeFile } from "node:fs/promises";
import { createInvitation, addLanguage, LOCALES, type SessionUser } from "../packages/contracts/src/index";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { publishInvitationInTransaction } from "../apps/web/src/server/publication";

const { chromium } = createRequire(new URL("../apps/web/package.json", import.meta.url))("playwright");

test("Velvet Royale saves, publishes, renders all locales and persists real guest responses", { timeout: 150000 }, async () => {
  const origin = process.env.APP_URL!;
  assert.ok(["localhost", "127.0.0.1"].includes(new URL(origin).hostname));
  assert.equal(process.env.PUBLISHING_MODE || "free", "free", "This check never starts a payment.");
  const db = getDb(), token = randomToken(), guestToken = randomToken();
  const owner: SessionUser = { id: randomUUID(), telegramUserId: "", displayName: "Disposable Royale verification", phoneShared: true, isAdmin: false };
  let invitation = createInvitation("royal-burgundy-edition");
  invitation.eventType = "wedding";
  let browser: any;
  const checks: string[] = [];
  const request = (path: string, body?: unknown, method?: string) => fetch(`${origin}${path}`, {
    method: method || (body === undefined ? "GET" : "POST"),
    headers: { Origin: origin, "Content-Type": "application/json", Cookie: `taklifnoma_session=${token}` },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  try {
    const [user] = await db`INSERT INTO users(id,telegram_user_id,display_name,phone_number,phone_source,phone_shared_at) VALUES(${owner.id},${-Math.floor(Math.random()*1e12)-1},${owner.displayName},'+000000000','telegram_contact',now()) RETURNING telegram_user_id`;
    owner.telegramUserId = String(user.telegram_user_id);
    await db`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${owner.id},${digest(token)},'Disposable Royale verification',now()+interval '1 hour',now()+interval '1 hour')`;
    await db`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${invitation.id},${owner.id},'royal-burgundy-edition','draft',${db.json(invitation)})`;
    assert.equal((await (await request("/api/auth/session")).json()).user.id, owner.id);
    for (const locale of LOCALES) {
      invitation = addLanguage(invitation, locale);
      Object.assign(invitation.content[locale], {
        title: `Invitation ${locale}`, eventLabel: `Wedding ${locale}`,
        people: [`Royale ${locale} first`, `Royale ${locale} second`], greeting: `Greeting ${locale}`,
        personalGreeting: `Welcome {name} ${locale}`, message: `Authored invitation ${locale}`,
        hosts: `Hosts ${locale}`, venueName: `Creator venue ${locale}`, address: `Creator address ${locale}`,
      });
    }
    invitation.startsAt = "2027-07-14T18:00"; invitation.timezone = "Asia/Tashkent";
    invitation.venue = { latitude: 41.31, longitude: 69.28, mapUrl: "https://www.google.com/maps/search/?api=1&query=Creator+venue&query_place_id=ChIJtest" };
    invitation.story = Array.from({length:5},(_,i)=>({id:`chapter-${i}`,title:Object.fromEntries(LOCALES.map(locale=>[locale,`Chapter ${i} ${locale}`])),text:Object.fromEntries(LOCALES.map(locale=>[locale,`Authored chapter ${i} ${locale}`]))}));
    invitation.rsvp = { enabled: true, deadline: "", maxPartySize: 4 };
    invitation.wishes.enabled = true;
    let response = await request(`/api/invitations/${invitation.id}`, {invitation}, "PUT");
    assert.equal(response.status, 200, await response.clone().text()); invitation = (await response.json()).invitation;
    const reopened = (await (await request(`/api/invitations/${invitation.id}`)).json()).invitation;
    assert.deepEqual(reopened, invitation); checks.push("Authenticated four-locale save/reopen preserves authored fields, five story chapters and venue");
    // Exercise the real publication transaction before exposing the catalog row.
    // The temporary catalog flag is restored before this transaction commits.
    const publication = await db.begin(async tx => {
      const [template] = await tx`SELECT published FROM templates WHERE id='royal-burgundy-edition' FOR UPDATE`;
      assert.ok(template);
      await tx`UPDATE templates SET published=true WHERE id='royal-burgundy-edition'`;
      const result = await publishInvitationInTransaction(tx, invitation.id, invitation.revision, owner);
      await tx`UPDATE templates SET published=${template.published} WHERE id='royal-burgundy-edition'`;
      return result;
    });
    invitation = publication.invitation;
    assert.equal(invitation.status, "published"); assert.match(invitation.slug!, /^[0-9A-Za-z]{6}$/);
    checks.push("Real shared publication transaction succeeds without exposing the hidden template during verification");
    await db`INSERT INTO invitation_guests(invitation_id,display_name,token_hash,max_party_size) VALUES(${invitation.id},'Personalized Royale guest',${digest(guestToken)},4)`;
    browser = await chromium.launch({ executablePath: process.env.CHROME_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
    const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
    const errors: string[] = []; page.on("pageerror", (error: Error) => errors.push(error.message));
    for (const locale of LOCALES) {
      await page.goto(`${origin}/i/${invitation.slug}?g=${guestToken}&lang=${locale}`, {waitUntil:"domcontentloaded"});
      const frame = page.frameLocator('iframe[src*="velvet-royale/index.html"]');
      await frame.locator(".section-intro__seal").click();
      assert.equal(await frame.locator('[data-editable-id="hero-groom"]').textContent(),`Royale ${locale} first`);
      assert.ok((await frame.locator('[data-editable-id="couple-invitation"]').textContent())?.includes("Personalized Royale guest"));
      assert.equal(await frame.locator(".section-venue__action").getAttribute("href"),invitation.venue.mapUrl);
      assert.equal(await frame.locator(".section-photo-story").isVisible(),false);
    }
    checks.push("Real public route uses the same renderer in every locale with the resolved guest and creator-selected Google Place");
    const frame = page.frameLocator('iframe[src*="velvet-royale/index.html"]');
    await frame.locator('input[name="name"]').fill("Backend Royale guest");
    await frame.locator('input[type="radio"]').first().check();
    assert.equal(await frame.locator('input[name="partySize"]').count(), 0);
    await frame.locator('input[name="phone"]').fill("+000123456");
    await frame.locator('textarea[name="wish"]').fill("Disposable moderated Royale wish");
    await frame.locator('.section-rsvp__submit').click();
    await frame.locator('.section-rsvp__notice').filter({hasText:"Спасибо"}).waitFor();
    const [rsvp] = await db`SELECT status,party_size,note,guest_id FROM rsvp_responses WHERE invitation_id=${invitation.id}`;
    assert.equal(rsvp.status,"yes"); assert.equal(rsvp.party_size,1); assert.ok(rsvp.note.includes("+000123456")); assert.ok(rsvp.guest_id);
    const [wish] = await db`SELECT status,message,guest_id FROM wishes WHERE invitation_id=${invitation.id}`;
    assert.equal(wish.status,"pending"); assert.equal(wish.message,"Disposable moderated Royale wish"); assert.equal(wish.guest_id,rsvp.guest_id);
    assert.deepEqual((await (await request(`/api/public/invitations/${invitation.id}/wishes`)).json()).wishes,[]);
    checks.push("Actual RSVP stores guest token identity, party size and phone note; actual wish stays pending and absent from the public list");
    invitation.content["en"].message = "Reopened creator correction";
    invitation.venue = {latitude:null,longitude:null,mapUrl:"https://www.google.com/maps?q=41.2995,69.2401"};
    response = await request(`/api/invitations/${invitation.id}`, {invitation}, "PUT"); assert.equal(response.status,200,await response.clone().text()); invitation=(await response.json()).invitation;
    await page.goto(`${origin}/i/${invitation.slug}?lang=en`,{waitUntil:"domcontentloaded"});
    const updated = page.frameLocator('iframe[src*="velvet-royale/index.html"]'); await updated.locator('.section-intro__seal').click();
    assert.ok((await updated.locator('[data-editable-id="couple-invitation"]').textContent())?.includes("Reopened creator correction"));
    assert.equal(await updated.locator('.section-venue__action').getAttribute('href'),invitation.venue.mapUrl);
    assert.ok((await updated.locator('.section-venue iframe').getAttribute('src'))?.includes('41.2995%2C69.2401'));
    checks.push("Published edit/reopen updates authored content and manual Google Maps target in the public renderer");
    assert.deepEqual(errors,[]);
    await writeFile("docs/templates/velvet-royale-verification/integration-report.json",JSON.stringify({date:"2026-10-28",checks,consoleErrors:errors,cleanup:"All generated accounts, invitations, guest responses and notification jobs removed"},null,2)+"\n");
  } finally {
    await browser?.close();
    await db.begin(async tx => {
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
});
