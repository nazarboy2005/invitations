// Explicit opt-in: pnpm test:publishing. Uses isolated disposable rows in the
// configured PostgreSQL database and the local HTTP server. Never calls Telegram.
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb, closeDb } from "../packages/database/src/index";
import {
  type SessionUser,
  type Invitation,
  addLanguage,
  LOCALES,
  defaultDressCode,
  defaultLocalizedInvitationContent,
} from "../packages/contracts/src/index";
import {
  publishInvitation,
  generatePublicCode,
} from "../apps/web/src/server/publication";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { completeInvitation } from "./fixtures/publication";
import { removeMedia } from "../apps/web/src/server/storage";

const sql = getDb();
const origin = process.env.APP_URL!;
const token = randomToken();
const owner: SessionUser = {
  id: randomUUID(),
  telegramUserId: "",
  displayName: "Publication test",
  phoneShared: true,
  isAdmin: false,
};
const stranger: SessionUser = { ...owner, id: randomUUID() };
before(async () => {
  assert.ok(
    ["127.0.0.1", "localhost"].includes(new URL(origin).hostname),
    "Integration requests must target a local app.",
  );
  for (const user of [owner, stranger]) {
    const [row] =
      await sql`INSERT INTO users(id,telegram_user_id,display_name,phone_number,phone_source,phone_shared_at) VALUES(${user.id},${-Math.floor(Math.random() * 1e12) - 1},'Disposable publishing test','+000000000','telegram_contact',now()) RETURNING telegram_user_id`;
    user.telegramUserId = String(row.telegram_user_id);
  }
  await sql`INSERT INTO sessions(user_id,token_hash,user_agent,expires_at,absolute_expires_at) VALUES(${owner.id},${digest(token)},'Publishing integration test',now()+interval '1 hour',now()+interval '1 hour')`;
  const response = await fetch(`${origin}/api/auth/session`, {
    headers: { Cookie: `taklifnoma_session=${token}` },
  });
  const session = await response.json();
  assert.equal(
    session.user?.id,
    owner.id,
    "Dev server must load the supplied environment.",
  );
});
after(async () => {
  // Every delete is scoped to these two generated account IDs.
  const assets =
    await sql`SELECT object_key FROM media_assets WHERE owner_id IN (${owner.id},${stranger.id})`;
  for (const asset of assets)
    if (asset.object_key.startsWith("local/"))
      await removeMedia(asset.object_key);
  await sql.begin(async (tx) => {
    await tx`DELETE FROM jobs WHERE payload->>'wishId' IN (SELECT id::text FROM wishes WHERE invitation_id IN (SELECT id FROM invitations WHERE owner_id IN (${owner.id},${stranger.id})))`;
    await tx`DELETE FROM gift_receipts WHERE invitation_id IN (SELECT id FROM invitations WHERE owner_id IN (${owner.id},${stranger.id}))`;
    await tx`DELETE FROM wishes WHERE invitation_id IN (SELECT id FROM invitations WHERE owner_id IN (${owner.id},${stranger.id}))`;
    await tx`DELETE FROM rsvp_responses WHERE invitation_id IN (SELECT id FROM invitations WHERE owner_id IN (${owner.id},${stranger.id}))`;
    await tx`DELETE FROM invitation_audit_log WHERE invitation_id IN (SELECT id FROM invitations WHERE owner_id IN (${owner.id},${stranger.id}))`;
    await tx`DELETE FROM invitations WHERE owner_id IN (${owner.id},${stranger.id})`;
    await tx`DELETE FROM media_assets WHERE owner_id IN (${owner.id},${stranger.id})`;
    await tx`DELETE FROM sessions WHERE user_id IN (${owner.id},${stranger.id})`;
    await tx`DELETE FROM users WHERE id IN (${owner.id},${stranger.id})`;
  });
  await closeDb();
});
async function draft(patch: Partial<Invitation> = {}) {
  const invitation = { ...completeInvitation(), ...patch };
  await sql`INSERT INTO invitations(id,owner_id,template_id,status,data) VALUES(${invitation.id},${owner.id},${invitation.templateId},'draft',${sql.json(invitation)})`;
  return invitation;
}
async function request(
  path: string,
  body?: unknown,
  authenticated = true,
  requestOrigin = origin,
  method?: string,
) {
  return fetch(`${origin}${path}`, {
    method: method ?? (body === undefined ? "GET" : "POST"),
    headers: {
      Origin: requestOrigin,
      "Content-Type": "application/json",
      ...(authenticated ? { Cookie: `taklifnoma_session=${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
async function rejectsCode(promise: Promise<unknown>, code: string) {
  await assert.rejects(
    promise,
    (error: unknown) => (error as { code?: string }).code === code,
  );
}
test("publication endpoint protects sessions, origin, ownership, revisions and request shape", async () => {
  const invitation = await draft();
  const path = `/api/invitations/${invitation.id}/publish`;
  assert.equal((await request(path, { revision: 1 }, false)).status, 401);
  assert.equal(
    (await request(path, { revision: 1 }, true, "https://other.test")).status,
    403,
  );
  assert.equal((await request(path, { revision: 0 })).status, 400);
  assert.equal(
    (await request(path, { revision: 1, slug: "custom" })).status,
    400,
  );
  assert.equal((await request(path, { revision: 2 })).status, 409);
  await rejectsCode(publishInvitation(invitation.id, 1, stranger), "NOT_FOUND");
  const [unchanged] =
    await sql`SELECT status,slug FROM invitations WHERE id=${invitation.id}`;
  assert.equal(unchanged.status, "draft");
  assert.equal(unchanged.slug, null);
});
test("first publish is atomic, free, stable, concurrent-safe and uses event-local end of day", async () => {
  const invitation = await draft();
  const results = await Promise.all(
    Array.from({ length: 3 }, () => publishInvitation(invitation.id, 1, owner)),
  );
  assert.match(results[0].invitation.slug!, /^[0-9A-Za-z]{6}$/);
  for (const result of results) {
    assert.equal(result.url, results[0].url);
    assert.equal(result.invitation.revision, 2);
  }
  const [row] = await sql`SELECT * FROM invitations WHERE id=${invitation.id}`;
  assert.equal(row.data.status, "published");
  assert.equal(row.status, "published");
  assert.equal(row.data.slug, row.slug);
  assert.equal(
    row.identity_locked_at.getTime(),
    row.first_published_at.getTime(),
  );
  assert.equal(row.edit_deadline_at.toISOString(), "2027-06-14T19:00:00.000Z");
  const audits =
    await sql`SELECT action FROM invitation_audit_log WHERE invitation_id=${invitation.id}`;
  assert.deepEqual(
    audits.map((audit) => audit.action),
    ["published_free"],
  );
  const mode = process.env.PUBLISHING_MODE;
  process.env.PUBLISHING_MODE = "paid";
  try {
    assert.equal(
      (await publishInvitation(invitation.id, 1, owner)).url,
      results[0].url,
    );
  } finally {
    process.env.PUBLISHING_MODE = mode;
  }
});

test("unpublishing archives the canonical and returned invitation state", async () => {
  const invitation = await draft();
  const published = await publishInvitation(invitation.id, 1, owner);
  const response = await request(
    `/api/invitations/${invitation.id}`,
    { action: "unpublish" },
    true,
    origin,
    "PATCH",
  );
  assert.equal(response.status, 200);

  const listed = await request("/api/invitations");
  const listedBody = await listed.json();
  assert.equal(
    listedBody.invitations.find((item: Invitation) => item.id === invitation.id)
      ?.status,
    "archived",
  );
  const owned = await request(`/api/invitations/${invitation.id}`);
  const ownedBody = await owned.json();
  assert.equal(ownedBody.invitation.status, "archived");
  const publicRows = await sql`SELECT id FROM invitations WHERE id=${invitation.id} AND slug=${published.invitation.slug} AND status='published'`;
  assert.equal(publicRows.length, 0);
  const archivedRows = await sql`SELECT status,data->>'status' AS data_status FROM invitations WHERE id=${invitation.id}`;
  assert.deepEqual(archivedRows[0], {
    status: "archived",
    data_status: "archived",
  });
});

test("draft deletion is owner-scoped and removes only drafts", async () => {
  const invitation = await draft();
  const deleted = await request(
    `/api/invitations/${invitation.id}`,
    undefined,
    true,
    origin,
    "DELETE",
  );
  assert.equal(deleted.status, 200);
  const remaining = await sql`SELECT id FROM invitations WHERE id=${invitation.id}`;
  assert.equal(remaining.length, 0);

  const publishedInvitation = await draft();
  await publishInvitation(publishedInvitation.id, 1, owner);
  const protectedResponse = await request(
    `/api/invitations/${publishedInvitation.id}`,
    undefined,
    true,
    origin,
    "DELETE",
  );
  assert.equal(protectedResponse.status, 409);
});
test("slug collisions retry through a savepoint and letter case stays distinct", async () => {
  const first = await draft(),
    second = await draft();
  // Generated per run so existing customer codes cannot be overwritten.
  const a = (
    await publishInvitation(
      first.id,
      1,
      owner,
      () => "a" + generatePublicCode().slice(1),
    )
  ).invitation.slug!;
  let calls = 0;
  const b = await publishInvitation(second.id, 1, owner, () =>
    ++calls === 1
      ? a
      : a.replace(/[A-Za-z]/, (letter) =>
          letter === letter.toUpperCase()
            ? letter.toLowerCase()
            : letter.toUpperCase(),
        ),
  );
  if (b.invitation.slug === a)
    assert.fail("A distinct case-sensitive code is required");
  assert.equal(calls, 2);
  const third = await draft();
  await rejectsCode(
    publishInvitation(third.id, 1, owner, () => a),
    "CODE_ALLOCATION_FAILED",
  );
  const [row] =
    await sql`SELECT status,slug FROM invitations WHERE id=${third.id}`;
  assert.equal(row.status, "draft");
  assert.equal(row.slug, null);
});
test("editing deadlines follow DST in the event timezone", async () => {
  for (const [startsAt, deadline] of [
    ["2027-03-14T18:30", "2027-03-15T04:00:00.000Z"],
    ["2027-11-07T18:30", "2027-11-08T05:00:00.000Z"],
  ]) {
    const invitation = await draft({ startsAt, timezone: "America/New_York" });
    await publishInvitation(invitation.id, 1, owner);
    const [row] =
      await sql`SELECT edit_deadline_at FROM invitations WHERE id=${invitation.id}`;
    assert.equal(row.edit_deadline_at.toISOString(), deadline);
  }
});
test("incomplete content, unsupported/retired templates, past days and paid mode cannot publish", async () => {
  const empty = await draft({ startsAt: "" });
  await rejectsCode(
    publishInvitation(empty.id, 1, owner),
    "PUBLICATION_INCOMPLETE",
  );
  const past = await draft({ startsAt: "2000-01-01T12:00" });
  await rejectsCode(publishInvitation(past.id, 1, owner), "EVENT_ENDED");
  const multilingual = await draft(addLanguage(completeInvitation(), "ru"));
  await rejectsCode(
    publishInvitation(multilingual.id, 1, owner),
    "PUBLICATION_INCOMPLETE",
  );
  const [retired] =
    await sql`SELECT t.id,s.event_type FROM templates t JOIN template_supported_event_types s ON s.template_id=t.id WHERE NOT t.published LIMIT 1`;
  const unavailable = await draft({
    templateId: retired.id,
    eventType: retired.event_type,
  });
  await rejectsCode(
    publishInvitation(unavailable.id, 1, owner),
    "TEMPLATE_UNAVAILABLE",
  );
  const incompatible = await draft({ eventType: "birthday" });
  await rejectsCode(
    publishInvitation(incompatible.id, 1, owner),
    "TEMPLATE_EVENT_MISMATCH",
  );
  const free = await draft();
  const mode = process.env.PUBLISHING_MODE;
  process.env.PUBLISHING_MODE = "paid";
  try {
    await rejectsCode(
      publishInvitation(free.id, 1, owner),
      "PUBLISHING_UNAVAILABLE",
    );
  } finally {
    process.env.PUBLISHING_MODE = mode;
  }
});
test("unready or foreign media cannot become public", async () => {
  const assetId = randomUUID();
  await sql`INSERT INTO media_assets(id,owner_id,object_key,url,filename,mime_type,size_bytes,visibility,status) VALUES(${assetId},${stranger.id},${"test/" + assetId},${"/api/media/" + assetId},'test.png','image/png',100,'public','ready')`;
  const invitation = await draft({
    gallery: [
      { id: assetId, url: `/api/media/${assetId}`, alt: "", caption: "" },
    ],
  });
  await rejectsCode(
    publishInvitation(invitation.id, 1, owner),
    "MEDIA_NOT_READY",
  );
  const music = await draft({
    music: {
      enabled: true,
      assetId,
      url: `/api/media/${assetId}`,
      filename: "wrong.png",
    },
  });
  await rejectsCode(publishInvitation(music.id, 1, owner), "MEDIA_NOT_READY");
});
test("publication rejects archived records and permits built-in music and manual receipts without R2", async () => {
  const archived = await draft();
  await sql`UPDATE invitations SET status='archived',data=jsonb_set(data,'{status}','"archived"') WHERE id=${archived.id}`;
  await rejectsCode(
    publishInvitation(archived.id, 1, owner),
    "INVITATION_ARCHIVED",
  );
  const invitation = await draft({
    music: {
      enabled: true,
      assetId: null,
      url: "/music/catalog/emotional-piano.wav",
      filename: "Built-in music",
    },
  });
  await publishInvitation(invitation.id, 1, owner);
  const receipt = await draft({
    gift: {
      enabled: true,
      receiptUploadEnabled: true,
      cardNumber: "8600111122223333",
      cardHolder: "Test owner",
    },
  });
  const previous = process.env.R2_BUCKET_NAME;
  delete process.env.R2_BUCKET_NAME;
  try {
    assert.ok((await publishInvitation(receipt.id, 1, owner)).url);
  } finally {
    if (previous) process.env.R2_BUCKET_NAME = previous;
  }
});

const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6E0UAAAAASUVORK5CYII=",
  "base64",
);
async function uploadFile(
  invitationId: string,
  content: Buffer,
  kind: "image" | "audio",
  contentType: string,
) {
  const preparedResponse = await request("/api/uploads", {
    draftId: invitationId,
    filename: `test.${kind === "image" ? "png" : "wav"}`,
    size: content.length,
    contentType,
    kind,
  });
  assert.equal(
    preparedResponse.status,
    201,
    await preparedResponse.clone().text(),
  );
  const { upload } = await preparedResponse.json();
  const put = await fetch(new URL(upload.url, origin), {
    method: "PUT",
    headers: {
      ...upload.headers,
      Origin: origin,
      Cookie: `taklifnoma_session=${token}`,
    },
    body: new Uint8Array(content),
  });
  assert.equal(put.status, 204, await put.text());
  const complete = await request(upload.completeUrl, {});
  assert.equal(complete.status, 200, await complete.clone().text());
  return { asset: (await complete.json()).asset, upload };
}

test("local photo and music upload → publish → public media and audio seeking, with immutable ready uploads", async () => {
  const invitation = await draft();
  const image = await uploadFile(invitation.id, png, "image", "image/png");
  assert.equal(
    (await fetch(`${origin}${image.asset.url}`)).status,
    404,
    "Draft uploads stay private",
  );
  assert.equal(
    (
      await fetch(`${origin}${image.asset.url}`, {
        headers: { Cookie: `taklifnoma_session=${token}` },
      })
    ).status,
    200,
  );
  const wav = Buffer.alloc(64);
  wav.write("RIFF");
  wav.writeUInt32LE(56, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(8000, 24);
  wav.writeUInt32LE(16000, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(20, 40);
  const audio = await uploadFile(invitation.id, wav, "audio", "audio/wav");
  const edited = {
    ...invitation,
    gallery: [
      {
        id: image.asset.id,
        url: image.asset.url,
        caption: "Creator caption",
        alt: "Creator alt",
      },
    ],
    music: {
      enabled: true,
      assetId: audio.asset.id,
      url: audio.asset.url,
      filename: "test.wav",
    },
  };
  const save = await request("/api/invitations", { invitation: edited });
  assert.equal(save.status, 201);
  const saved = (await save.json()).invitation;
  const published = await request(`/api/invitations/${invitation.id}/publish`, {
    revision: saved.revision,
  });
  assert.equal(published.status, 200, await published.clone().text());
  const publicImage = await fetch(`${origin}${image.asset.url}`);
  assert.equal(publicImage.status, 200);
  assert.deepEqual(Buffer.from(await publicImage.arrayBuffer()), png);
  const range = await fetch(`${origin}${audio.asset.url}`, {
    headers: { Range: "bytes=0-11" },
  });
  assert.equal(range.status, 206);
  assert.equal(range.headers.get("content-range"), "bytes 0-11/64");
  assert.equal((await range.arrayBuffer()).byteLength, 12);
  const replay = await fetch(new URL(image.upload.url, origin), {
    method: "PUT",
    headers: {
      ...image.upload.headers,
      Origin: origin,
      Cookie: `taklifnoma_session=${token}`,
    },
    body: new Uint8Array(png),
  });
  assert.equal(replay.status, 409);
  const invalidRange = await fetch(`${origin}${audio.asset.url}`, {
    headers: { Range: "bytes=900-" },
  });
  assert.equal(invalidRange.status, 416);
});

test("manual receipt upload is private, duplicate safe, owner reviewed and independent of AI", async () => {
  const invitation = await draft({
    gift: {
      enabled: true,
      receiptUploadEnabled: true,
      cardNumber: "8600111122223333",
      cardHolder: "Test owner",
    },
  });
  await publishInvitation(invitation.id, 1, owner);
  async function receipt(originHeader = origin, content = png) {
    const form = new FormData();
    form.set("giverNames", "Test family");
    form.set(
      "file",
      new Blob([new Uint8Array(content)], { type: "image/png" }),
      "receipt.png",
    );
    return fetch(`${origin}/api/public/invitations/${invitation.id}/receipts`, {
      method: "POST",
      headers: { Origin: originHeader },
      body: form,
    });
  }
  assert.equal((await receipt("https://other.test")).status, 403);
  assert.equal(
    (await receipt(origin, Buffer.from("not a receipt image content"))).status,
    400,
  );
  const results = await Promise.all([receipt(), receipt()]);
  assert.deepEqual(results.map((result) => result.status).sort(), [200, 201]);
  const [row] =
    await sql`SELECT r.id,a.url,a.visibility FROM gift_receipts r JOIN media_assets a ON a.id=r.asset_id WHERE invitation_id=${invitation.id}`;
  assert.equal(row.visibility, "private");
  assert.equal((await fetch(`${origin}${row.url}`)).status, 404);
  assert.equal(
    (
      await fetch(`${origin}${row.url}`, {
        headers: { Cookie: `taklifnoma_session=${token}` },
      })
    ).status,
    200,
  );
  const activity = await request(`/api/invitations/${invitation.id}/activity`);
  assert.equal(activity.status, 200);
  const inbox = await activity.json();
  assert.equal(inbox.receipts.length, 1);
  assert.equal(inbox.receipts[0].cardLast4, "3333");
  assert.equal(inbox.receipts[0].cardHolder, "Test owner");
  assert.equal(
    (
      await request(
        `/api/invitations/${invitation.id}/activity`,
        undefined,
        false,
      )
    ).status,
    401,
  );
  const reviewed = await fetch(
    `${origin}/api/invitations/${invitation.id}/activity`,
    {
      method: "PATCH",
      headers: {
        Origin: origin,
        Cookie: `taklifnoma_session=${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receiptId: row.id, status: "received" }),
    },
  );
  assert.equal(reviewed.status, 200);
  await sql`UPDATE invitations SET data=jsonb_set(data,'{gift,receiptUploadEnabled}','false') WHERE id=${invitation.id}`;
  assert.equal((await receipt()).status, 403);
  assert.equal(
    (
      await fetch(`${origin}${row.url}`, {
        headers: { Cookie: `taklifnoma_session=${token}` },
      })
    ).status,
    200,
    "Disabling uploads preserves private receipts",
  );
});

test("RSVP limits and wish moderation reach the owner and approved public list", async () => {
  const invitation = await draft({
    rsvp: { enabled: true, deadline: "2027-06-14", maxPartySize: 3 },
    wishes: { enabled: true, requireApproval: true },
  });
  await publishInvitation(invitation.id, 1, owner);
  const base = `/api/public/invitations/${invitation.id}`;
  assert.equal(
    (
      await request(
        `${base}/rsvp`,
        { name: "Test guest", status: "yes", partySize: 4 },
        false,
      )
    ).status,
    400,
  );
  const firstResponse = await request(
    `${base}/rsvp`,
    { name: "Test guest", status: "yes", partySize: 3 },
    false,
  );
  assert.equal(firstResponse.status, 201);
  assert.equal(
    (
      await request(
        `${base}/wishes`,
        { name: "Test guest", message: "A real test wish" },
        false,
      )
    ).status,
    201,
  );
  assert.equal(
    (await (await request(`${base}/wishes`, undefined, false)).json()).wishes
      .length,
    0,
  );
  const activity = await (
    await request(`/api/invitations/${invitation.id}/activity`)
  ).json();
  assert.equal(activity.totals.guests, 3);
  assert.equal(activity.totals.pending, 1);
  const repeat = await fetch(`${origin}${base}/rsvp`, {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      Cookie: firstResponse.headers.get("set-cookie")!.split(";")[0],
    },
    body: JSON.stringify({ name: "Test guest", status: "yes", partySize: 2 }),
  });
  assert.equal(repeat.status, 201);
  const updated = await (
    await request(`/api/invitations/${invitation.id}/activity`)
  ).json();
  assert.equal(updated.totals.responses, 1);
  assert.equal(
    updated.totals.guests,
    2,
    "Changing a reply replaces the previous party size",
  );
  const wishId = activity.wishes[0].id;
  async function moderate(status: string) {
    return fetch(`${origin}/api/invitations/${invitation.id}/activity`, {
      method: "PATCH",
      headers: {
        Origin: origin,
        Cookie: `taklifnoma_session=${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wishId, status }),
    });
  }
  assert.equal((await moderate("approved")).status, 200);
  assert.equal(
    (await (await request(`${base}/wishes`, undefined, false)).json()).wishes[0]
      .message,
    "A real test wish",
  );
  assert.equal((await moderate("hidden")).status, 200);
  assert.equal(
    (await (await request(`${base}/wishes`, undefined, false)).json()).wishes
      .length,
    0,
  );
});

test("every published template preserves every editor field across four-language save, publish and reopen", async () => {
  const catalog = await (
    await request("/api/catalog", undefined, false)
  ).json();
  assert.ok(catalog.templates.length >= 15);
  const selectedTemplates = catalog.templates.filter(
    (template: { id: string }) =>
      !process.env.PUBLISHING_TEMPLATE_ID ||
      template.id === process.env.PUBLISHING_TEMPLATE_ID,
  );
  assert.ok(
    selectedTemplates.length > 0,
    `No published template matched PUBLISHING_TEMPLATE_ID=${process.env.PUBLISHING_TEMPLATE_ID ?? "(all)"}`,
  );
  const mediaDraft = await draft();
  const photo = await uploadFile(mediaDraft.id, png, "image", "image/png");
  const results = await Promise.allSettled(
    selectedTemplates.map(
      async (template: {
        id: string;
        supportedEventTypes: Invitation["eventType"][];
      }) => {
        let invitation = completeInvitation();
        invitation.templateId = template.id;
        invitation.eventType = template.supportedEventTypes.includes("wedding")
          ? "wedding"
          : template.supportedEventTypes[0];
        for (const locale of LOCALES) {
          if (!invitation.enabledLocales.includes(locale))
            invitation = addLanguage(invitation, locale);
          invitation.content[locale] = {
            ...defaultLocalizedInvitationContent(invitation.eventType, locale),
            title: `Audit title ${locale}`,
            people: [
              `Audit first ${locale}`,
              `Audit second ${locale}`,
              `Audit third ${locale}`,
            ],
            hosts: `Audit hosts ${locale}`,
            greeting: `Audit greeting ${locale}`,
            personalGreeting: `Dear {name} ${locale}`,
            message: `Authored invitation message ${locale}`,
            eventLabel: `Audit celebration ${locale}`,
            venueName: `Audit venue ${locale}`,
            address: `Audit address ${locale}`,
            landmark: `Audit landmark ${locale}`,
            programHeading: `Audit program ${locale}`,
            programTitles: { arrival: `Audit arrival ${locale}` },
          };
        }
        invitation.venue = {
          latitude: 41.3,
          longitude: 69.2,
          mapUrl: "https://maps.google.com/?q=41.3,69.2",
        };
        invitation.program = [{ id: "arrival", time: "18:00" }];
        invitation.story = [
          {
            id: "chapter",
            title: Object.fromEntries(
              LOCALES.map((locale) => [locale, `Story ${locale}`]),
            ),
            text: Object.fromEntries(
              LOCALES.map((locale) => [locale, `Our authored story ${locale}`]),
            ),
          },
        ];
        invitation.dressCode = defaultDressCode();
        invitation.dressCode.enabled = true;
        invitation.music = {
          enabled: true,
          assetId: null,
          url: "/music/catalog/emotional-piano.wav",
          filename: "Built-in music",
        };
        invitation.gallery = [
          {
            id: photo.asset.id,
            url: photo.asset.url,
            alt: "Creator alt",
            caption: "Creator caption",
          },
        ];
        invitation.contacts = {
          phoneNumber: "+998 90 123 45 67",
          telegramUsername: "@audit_owner",
        };
        invitation.rsvp = {
          enabled: true,
          deadline: "2027-06-14",
          maxPartySize: 7,
        };
        invitation.wishes = { enabled: true, requireApproval: true };
        invitation.gift = {
          enabled: true,
          receiptUploadEnabled: true,
          cardNumber: "8600111122223333",
          cardHolder: "Audit owner",
        };
        const save = await request("/api/invitations", { invitation });
        assert.equal(
          save.status,
          201,
          `${template.id}: ${await save.clone().text()}`,
        );
        const saved = (await save.json()).invitation;
        const published = await request(
          `/api/invitations/${saved.id}/publish`,
          { revision: saved.revision },
        );
        assert.equal(
          published.status,
          200,
          `${template.id}: ${await published.clone().text()}`,
        );
        const reopened = (
          await (await request(`/api/invitations/${saved.id}`)).json()
        ).invitation;
        for (const key of [
          "content",
          "enabledLocales",
          "defaultLocale",
          "eventType",
          "startsAt",
          "timezone",
          "venue",
          "program",
          "story",
          "dressCode",
          "gallery",
          "music",
          "gift",
          "contacts",
          "rsvp",
          "wishes",
        ] as const)
          assert.deepEqual(
            reopened[key],
            invitation[key],
            `${template.id}: ${key}`,
          );
        assert.equal(
          (await fetch((await published.json()).url)).status,
          200,
          template.id,
        );
      },
    ),
  );
  for (const result of results)
    if (result.status === "rejected") throw result.reason;
});
test("HTTP save → publish → public render → reopen and allowed edits preserves URL and locks", async () => {
  const invitation = completeInvitation();
  invitation.slug = "spoof1";
  let response = await request("/api/invitations", { invitation });
  assert.equal(response.status, 201);
  let saved = (await response.json()).invitation as Invitation;
  assert.equal(saved.slug, undefined);
  assert.equal((await fetch(`${origin}/i/${invitation.id}`)).status, 404);
  response = await request(`/api/invitations/${invitation.id}/publish`, {
    revision: saved.revision,
  });
  assert.equal(response.status, 200);
  const published = await response.json();
  saved = published.invitation;
  assert.equal(published.url, `${origin}/i/${saved.slug}`);
  assert.equal(
    (await request(`/api/invitations/${invitation.id}`)).status,
    200,
  );
  const publicPage = await fetch(`${published.url}?lang=uz-Latn`);
  assert.equal(publicPage.status, 200);
  const html = await publicPage.text();
  assert.ok(html.includes("Nodir test"));
  assert.ok(html.includes("Madina test"));
  assert.ok(html.includes("noindex"));
  const stableSlug = saved.slug;
  saved.content["uz-Latn"].address = "Updated test address";
  response = await request("/api/invitations", { invitation: saved });
  assert.equal(response.status, 201);
  saved = (await response.json()).invitation;
  assert.equal(saved.slug, stableSlug);
  const altered = structuredClone(saved);
  altered.content["uz-Latn"].people[0] = "Another person";
  assert.equal(
    (await request("/api/invitations", { invitation: altered })).status,
    403,
  );
  assert.equal(
    (
      await request("/api/invitations", {
        invitation: { ...saved, status: "draft" },
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await request("/api/invitations", {
        invitation: { ...saved, startsAt: "2028-01-01T12:00" },
      })
    ).status,
    403,
  );
  await sql`UPDATE invitations SET edit_deadline_at=now()-interval '1 second' WHERE id=${saved.id}`;
  assert.equal(
    (await request("/api/invitations", { invitation: saved })).status,
    403,
  );
  assert.equal(
    (await fetch(published.url)).status,
    200,
    "Public keepsake remains viewable after editing closes",
  );
  response = await request(`/api/invitations/${saved.id}/publish`, {
    revision: 1,
  });
  assert.equal((await response.json()).url, published.url);
});
