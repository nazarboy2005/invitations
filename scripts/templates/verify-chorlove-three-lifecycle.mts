// Disposable creator/media/guest records. Local HTTP only; no messaging or payments.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { chromium } from "../../apps/web/node_modules/playwright-core/index.mjs";
import { getDb, closeDb } from "../../packages/database/src/index";
import {
  createInvitation,
  defaultLocalizedInvitationContent,
  LOCALES,
} from "../../packages/contracts/src/index";
import { digest, randomToken } from "../../apps/web/src/server/auth/crypto";
import { removeMedia } from "../../apps/web/src/server/storage";
import { captureCover } from "../../apps/web/src/server/invitation-cover";
import { publishInvitation } from "../../apps/web/src/server/publication";

const release = process.argv.includes("--release");
const origin = process.env.APP_URL ?? "http://127.0.0.1:3001";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
const sql = getDb(),
  owner = randomUUID(),
  token = randomToken(),
  ids = ["stained-glass", "sunset", "swan-garden"];
const out = fileURLToPath(
  new URL("../../docs/templates/chorlove-three-verification/", import.meta.url),
);
await mkdir(out, { recursive: true });
let browser: any;
const invitations: any[] = [],
  report: any[] = [];
async function request(route: string, body?: any, method?: string) {
  return fetch(origin + route, {
    method: method ?? (body === undefined ? "GET" : "POST"),
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      Cookie: `taklifnoma_session=${token}`,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
async function json(response: Response, status = 200) {
  assert.equal(
    response.status,
    status,
    (await response.clone().text()).slice(0, 600),
  );
  return response.json();
}
async function upload(
  invitationId: string,
  bytes: Buffer,
  kind: string,
  type: string,
) {
  const prepared = await json(
    await request("/api/uploads", {
      draftId: invitationId,
      filename: kind === "image" ? "authored-test.png" : "authored-test.wav",
      size: bytes.length,
      kind,
      contentType: type,
    }),
    201,
  );
  const response = await fetch(new URL(prepared.upload.url, origin), {
    method: "PUT",
    headers: {
      ...prepared.upload.headers,
      Origin: origin,
      Cookie: `taklifnoma_session=${token}`,
    },
    body: new Uint8Array(bytes),
  });
  assert.equal(response.status, 204, await response.text());
  return (await json(await request(prepared.upload.completeUrl, {}))).asset;
}
try {
  await sql`INSERT INTO users(id,telegram_user_id,display_name,phone_number,phone_source,phone_shared_at) VALUES(${owner},${-Math.floor(Math.random() * 1e12) - 1},'Disposable three-template QA','+000000000','telegram_contact',now())`;
  await sql`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${owner},${digest(token)},'Chorlove three QA',now()+interval '2 hours',now()+interval '2 hours')`;
  assert.equal((await json(await request("/api/auth/session"))).user.id, owner);
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 900 },
    reducedMotion: "reduce",
  });
  await context.addInitScript(()=>{
    addEventListener('message',event=>{
      if(typeof event.data?.type==='string'&&event.data.type.endsWith(':update'))
        (window as any).__chorloveQaPayload=event.data.payload;
    });
  });
  await context.addCookies([
    { name: "taklifnoma_session", value: token, url: origin },
  ]);
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e: any) => errors.push(e.message));
  for (const id of ids) {
    let i = createInvitation(id);
    i.eventType = "wedding";
    i.enabledLocales = [...LOCALES];
    i.startsAt = "2027-12-20T18:30";
    for (const locale of LOCALES) {
      i.content[locale] = defaultLocalizedInvitationContent("wedding", locale);
      Object.assign(i.content[locale], {
        people: [`Creator ${id}`, `Partner ${id}`],
        hosts: "Authored families",
        greeting: "Authored greeting",
        personalGreeting: "Welcome, {name}",
        message: `Authored message for ${id}`,
        venueName: "Authored celebration venue",
        address: "Authored address",
        landmark: "Authored landmark",
        programHeading: "Authored program",
      });
    }
    i.venue = {
      latitude: 41.2995,
      longitude: 69.2401,
      mapUrl: "https://yandex.uz/maps/?ll=69.2401,41.2995&z=16",
    };
    i.program = [0, 1, 2, 3].map((index) => ({
      id: randomUUID(),
      time: `${17 + index}:00`,
    }));
    for (const locale of LOCALES)
      i.content[locale].programTitles = Object.fromEntries(
        i.program.map((x, index) => [x.id, `Authored program ${index + 1}`]),
      );
    i.story = [
      {
        id: randomUUID(),
        title: Object.fromEntries(LOCALES.map((l) => [l, "Authored story"])),
        text: Object.fromEntries(
          LOCALES.map((l) => [l, "Authored story text"]),
        ),
      },
    ];
    i.contacts = {
      phoneNumber: "+998901234567",
      telegramUsername: "authored_guest",
      instagramUrl: "https://www.instagram.com/authored_guest/",
    };
    i.dressCode.enabled = true;
    i.dressCode.colors = [
      {
        id: randomUUID(),
        hex: "#557755",
        name: Object.fromEntries(LOCALES.map((l) => [l, "Authored green"])),
      },
    ];
    i.optionalFeatures = { gallery: true, artists: false, contacts: true };
    i.gift = {
      enabled: true,
      receiptUploadEnabled: true,
      cardNumber: "8600111122223333",
      cardHolder: "QA card holder",
    };
    invitations.push(i);
    await sql`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${i.id},${owner},${id},'draft',${sql.json(i)})`;
    const png = await sharp({
      create: { width: 600, height: 800, channels: 3, background: "#9c725c" },
    })
      .png()
      .toBuffer();
    const image = await upload(i.id, png, "image", "image/png");
    const frames = 24000,
      wav = Buffer.alloc(44 + frames * 2);
    wav.write("RIFF");
    wav.writeUInt32LE(wav.length - 8, 4);
    wav.write("WAVEfmt ", 8);
    wav.writeUInt32LE(16, 16);
    wav.writeUInt16LE(1, 20);
    wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(8000, 24);
    wav.writeUInt32LE(16000, 28);
    wav.writeUInt16LE(2, 32);
    wav.writeUInt16LE(16, 34);
    wav.write("data", 36);
    wav.writeUInt32LE(frames * 2, 40);
    const audio = await upload(i.id, wav, "audio", "audio/wav");
    i.gallery = [
      {
        id: image.id,
        url: image.url,
        alt: "Authored uploaded photo",
        caption: "Authored caption",
      },
    ];
    i.music = {
      enabled: true,
      assetId: audio.id,
      url: audio.url,
      filename: "Authored test.wav",
    };
    let saved = (
      await json(await request("/api/invitations", { invitation: i }), 201)
    ).invitation;
    assert.equal(saved.gallery[0].id, image.id);
    assert.equal(saved.music.assetId, audio.id);
    assert.equal(saved.program.length, 4);
    assert.equal(saved.story.length, 1);
    assert.equal(saved.dressCode.colors.length, 1);
    assert.ok(saved.gift.receiptUploadEnabled);
    if (release) {
      const target = ids[(ids.indexOf(id) + 1) % 3];
      saved.templateId = target;
      saved = (
        await json(
          await request("/api/invitations", { invitation: saved }),
          201,
        )
      ).invitation;
      assert.deepEqual(saved.content, i.content);
      assert.equal(saved.gallery[0].id, image.id);
      assert.equal(saved.music.assetId, audio.id);
      assert.equal(saved.program.length, 4);
      assert.equal(saved.story.length, 1);
      saved.templateId = id;
      saved = (
        await json(
          await request("/api/invitations", { invitation: saved }),
          201,
        )
      ).invitation;
    }
    const reopened = (await json(await request(`/api/invitations/${i.id}`)))
      .invitation;
    assert.deepEqual(reopened, saved);
    const mismatch = structuredClone(saved);
    mismatch.eventType = "birthday";
    assert.equal(
      (await request("/api/invitations", { invitation: mismatch })).status,
      409,
    );
    await page.goto(origin, { waitUntil: "domcontentloaded" });
    await page.evaluate(
      (i) =>
        sessionStorage.setItem(
          `taklifnoma:full-preview:v1:${i.id}`,
          JSON.stringify(i),
        ),
      saved,
    );
    await page.goto(
      `${origin}/preview?template=${id}&draft=${i.id}&qaSilent=1`,
      { waitUntil: "domcontentloaded" },
    );
    const f = page.frameLocator("iframe").first();
    await f.locator("[aria-busy=false]").waitFor();
    const data = await f
      .locator("body")
      .evaluate(() => (window as any).__chorloveQaPayload);
    assert.equal(data.data.groom, `Creator ${id}`);
    assert.equal(data.sampleScratchPhoto, undefined);
    assert.equal(data.data.gallery[0].src, image.url);
    await f.locator("[data-chorlove-open]").click();
    await f.locator("[data-opened=true]").waitFor();
    await page.screenshot({ path: `${out}${id}-authored-preview.png` });
    await page.goto(`${origin}/studio/${i.id}`, {
      waitUntil: "domcontentloaded",
    });
    await page.getByRole("button", { name: "Saqlash", exact: true }).waitFor();
    await page.getByRole("button", { name: "Ko‘rinishi", exact: true }).click();
    const studioFrame = page.frameLocator("iframe").first();
    await studioFrame.locator("[aria-busy=false]").waitFor();
    assert.equal(
      await studioFrame.locator("[data-field=groom]").first().textContent(),
      `Creator ${id}`,
    );
    await page.screenshot({ path: `${out}${id}-studio.png` });
    if (release) {
      const publicationResponse = await request(
        `/api/invitations/${i.id}/publish`,
        { revision: saved.revision },
      );
      let published;
      if (publicationResponse.status === 402) {
        assert.equal(
          (await publicationResponse.json()).error.code,
          "PAYMENT_REQUIRED",
        );
        // Exercise the shared publication transaction for disposable QA data in
        // this test process only. Leave the running app's paid mode untouched.
        const mode = process.env.PUBLISHING_MODE;
        try {
          process.env.PUBLISHING_MODE = "free";
          published = await publishInvitation(i.id, saved.revision, {
            id: owner,
            telegramUserId: "",
            displayName: "Disposable QA",
            phoneShared: true,
            isAdmin: false,
          });
        } finally {
          if (mode === undefined) delete process.env.PUBLISHING_MODE;
          else process.env.PUBLISHING_MODE = mode;
        }
      } else published = await json(publicationResponse);
      const publicResponse = await fetch(
        `${origin}/i/${published.invitation.slug}`,
      );
      assert.equal(publicResponse.status, 200);
      await page.goto(`${origin}/i/${published.invitation.slug}?guest=Guest`, {
        waitUntil: "domcontentloaded",
      });
      const publicFrame = page.frameLocator("iframe").first();
      await publicFrame.locator("[aria-busy=false]").waitFor();
      await publicFrame.locator("[data-chorlove-open]").click();
      await publicFrame.locator("[data-opened=true]").waitFor();
      assert.equal(
        await publicFrame.locator("[data-field=groom]").first().textContent(),
        `Creator ${id}`,
      );
      const publicPayload = await publicFrame
        .locator("body")
        .evaluate(() => (window as any).__chorloveQaPayload);
      assert.equal(publicPayload.preview, false);
      assert.equal(publicPayload.sampleScratchPhoto, undefined);
      assert.equal(publicPayload.data.gallery[0].src, image.url);
      const music = publicFrame.locator("audio");
      await music.evaluate(async (a: HTMLAudioElement) => {
        await a.play();
        a.currentTime = 0.5;
      });
      assert.equal(
        await music.evaluate((a: HTMLAudioElement) => a.paused),
        false,
      );
      const pause = publicFrame.locator("[data-music-control]");
      await pause.click();
      assert.equal(
        await music.evaluate((a: HTMLAudioElement) => a.paused),
        true,
      );
      await publicFrame
        .locator("[data-languages]")
        .getByRole("button", { name: "En", exact: true })
        .click();
      await publicFrame
        .locator("[data-section=countdown] h2")
        .filter({ hasText: "Time remaining" })
        .waitFor({ state: "attached" });
      assert.equal(
        await music.evaluate((a: HTMLAudioElement) => a.paused),
        true,
        "Guest pause survives language change",
      );
      const rsvp = publicFrame.locator("[data-rsvp-form]");
      await rsvp.locator("input").fill("QA real guest");
      await rsvp.locator("[role=radio]").first().click();
      await rsvp.locator("[type=submit]").click();
      await rsvp
        .locator("[data-status]")
        .filter({ hasText: "Your response was saved" })
        .waitFor();
      const [response] =
        await sql`SELECT status,party_size FROM rsvp_responses WHERE invitation_id=${i.id}`;
      assert.equal(response.party_size, 1);
      assert.equal(response.status, "yes");
      // Seed a pending wish directly to avoid enqueueing a notification to any person.
      await sql`INSERT INTO wishes(invitation_id,name,message,status) VALUES(${i.id},'QA pending guest','Private pending wish','pending')`;
      const publicWishes = await json(
        await request(`/api/public/invitations/${i.id}/wishes`),
      );
      assert.ok(
        !publicWishes.wishes.some(
          (w: any) => w.message === "Private pending wish",
        ),
      );
      await page.screenshot({ path: `${out}${id}-public.png` });
      const cover = await captureCover(saved, `taklifnoma_session=${token}`);
      assert.equal((await sharp(cover).metadata()).width, 480);
      await writeFile(`${out}${id}-personalized-cover.webp`, cover);
    }
    report.push({
      id,
      saveReopen: true,
      creatorUploads: true,
      fourLocales: true,
      programItems: 4,
      story: true,
      dressCode: true,
      receiptUi: true,
      eventCompatibility: true,
      switched: release,
      publicRender: release,
      rsvp: release,
      pausePreserved: release,
      cover: release,
    });
    console.log(
      `PASS ${id}: ${release ? "release/public/switch/RSVP/music/cover" : "private save/reopen/uploads/preview"} lifecycle`,
    );
  }
  assert.deepEqual(errors, []);
  await writeFile(
    `${out}${release ? "release" : "preflight"}-lifecycle.json`,
    JSON.stringify(report, null, 2) + "\n",
  );
} finally {
  await browser?.close();
  const assets =
    await sql`SELECT object_key FROM media_assets WHERE owner_id=${owner}`;
  for (const a of assets) await removeMedia(a.object_key);
  await sql.begin(async (tx) => {
    const invitationIds = invitations.map((i) => i.id);
    if (invitationIds.length) {
      await tx`DELETE FROM jobs WHERE payload->>'wishId' IN (SELECT id::text FROM wishes WHERE invitation_id IN ${sql(invitationIds)})`;
      await tx`DELETE FROM gift_receipts WHERE invitation_id IN ${sql(invitationIds)}`;
      await tx`DELETE FROM wishes WHERE invitation_id IN ${sql(invitationIds)}`;
      await tx`DELETE FROM rsvp_responses WHERE invitation_id IN ${sql(invitationIds)}`;
      await tx`DELETE FROM invitation_viewers WHERE invitation_id IN ${sql(invitationIds)}`;
      await tx`DELETE FROM invitation_audit_log WHERE invitation_id IN ${sql(invitationIds)}`;
    }
    await tx`DELETE FROM invitations WHERE owner_id=${owner}`;
    await tx`DELETE FROM media_assets WHERE owner_id=${owner}`;
    await tx`DELETE FROM sessions WHERE user_id=${owner}`;
    await tx`DELETE FROM users WHERE id=${owner}`;
  });
  assert.equal(
    (await sql`SELECT count(*)::int AS n FROM users WHERE id=${owner}`)[0].n,
    0,
  );
  await closeDb();
}
