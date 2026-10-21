import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import {
  createInvitation,
  addLanguage,
  switchTemplate,
  invitationSchema,
} from "../packages/contracts/src/index";

// PGlite executes the production migration in its embedded PostgreSQL engine.
// This deliberately does not pretend to test an external PostgreSQL connection.
let db: PGlite;
let telegramId = 2000;
before(async () => {
  db = new PGlite();
  const directory = new URL(
    "../packages/database/migrations/",
    import.meta.url,
  );
  await db.exec("BEGIN");
  for (const name of (await readdir(directory))
    .filter((name) => name.endsWith(".sql"))
    .sort()) {
    // Mirror the production runner: drain deferred triggers between migrations.
    await db.exec(
      "SET CONSTRAINTS ALL IMMEDIATE; SET CONSTRAINTS ALL DEFERRED",
    );
    await db.exec(await readFile(new URL(name, directory), "utf8"));
  }
  await db.exec("COMMIT");
  await db.exec(
    "BEGIN; INSERT INTO templates(id,name,price_minor,published) VALUES('test-alt','Test alternate',100,true); INSERT INTO template_supported_event_types(template_id,event_type) VALUES('test-alt','wedding'); COMMIT;",
  );
});
after(async () => {
  await db?.close();
});
test("login requests rely on the opaque Telegram start token, not a numeric code", async () => {
  const columns = await db.query<{ column_name: string }>(
    "SELECT column_name FROM information_schema.columns WHERE table_name='auth_requests'",
  );
  assert.ok(columns.rows.some((column) => column.column_name === "token_hash"));
  assert.ok(!columns.rows.some((column) => column.column_name === "code"));
});
test("Bitiruv event compatibility is additive and remains unpublished", async () => {
  const template = await db.query<{ published: boolean }>(
    "SELECT published FROM templates WHERE id='bitiruv'",
  );
  assert.deepEqual(template.rows, [{ published: false }]);
  const categories = await db.query<{ category_id: string }>(
    "SELECT category_id FROM template_category_assignments WHERE template_id='bitiruv'",
  );
  assert.deepEqual(categories.rows, [{ category_id: "other" }]);
  const supported = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='bitiruv' ORDER BY event_type",
  );
  assert.deepEqual(
    supported.rows.map((row) => row.event_type),
    ["birthday", "bitiruv", "korporativ"],
  );
  await assert.rejects(
    db.query(
      "INSERT INTO template_supported_event_types(template_id,event_type) VALUES('bitiruv','unsupported')",
    ),
    /check constraint/i,
  );
});
test("Korporativ event compatibility is additive and remains unpublished", async () => {
  const template = await db.query<{ published: boolean }>(
    "SELECT published FROM templates WHERE id='korporativ'",
  );
  assert.deepEqual(template.rows, [{ published: false }]);
  const categories = await db.query<{ category_id: string }>(
    "SELECT category_id FROM template_category_assignments WHERE template_id='korporativ'",
  );
  assert.deepEqual(categories.rows, [{ category_id: "other" }]);
  const supported = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='korporativ' ORDER BY event_type",
  );
  assert.deepEqual(
    supported.rows.map((row) => row.event_type),
    ["bitiruv", "korporativ", "yubiley"],
  );
  await assert.rejects(
    db.query(
      "INSERT INTO template_supported_event_types(template_id,event_type) VALUES('korporativ','unsupported')",
    ),
    /check constraint/i,
  );
});
async function user(phone = true) {
  const id = randomUUID();
  await db.query(
    "INSERT INTO users(id,telegram_user_id,display_name,phone_number,phone_source,phone_shared_at) VALUES($1,$2,'Nazar',$3,$4,$5)",
    [
      id,
      ++telegramId,
      phone ? "+998901234567" : null,
      phone ? "telegram_contact" : null,
      phone ? new Date() : null,
    ],
  );
  return id;
}
async function invitation(ownerId: string) {
  const data = createInvitation();
  data.templateId = "anor";
  await db.query(
    "INSERT INTO invitations(id,owner_id,template_id,data) VALUES($1,$2,$3,$4)",
    [data.id, ownerId, data.templateId || null, JSON.stringify(data)],
  );
  return data;
}
test("migration enforces ownership, template references, and unique Telegram identities", async () => {
  const owner = await user();
  const account = await db.query<{ telegram_user_id: number }>(
    "SELECT telegram_user_id FROM users WHERE id=$1",
    [owner],
  );
  await assert.rejects(
    db.query(
      "INSERT INTO users(telegram_user_id,display_name) VALUES($1,'Duplicate')",
      [account.rows[0].telegram_user_id],
    ),
    /unique/i,
  );
  await assert.rejects(invitation(randomUUID()), /foreign key/i);
  await assert.rejects(
    db.query(
      "INSERT INTO invitations(owner_id,template_id,data) VALUES($1,'missing','{}')",
      [owner],
    ),
    /foreign key/i,
  );
  const saved = await invitation(owner);
  await assert.rejects(
    db.query("DELETE FROM users WHERE id=$1", [owner]),
    /foreign key/i,
  );
  const stored = await db.query<{ owner_id: string }>(
    "SELECT owner_id FROM invitations WHERE id=$1",
    [saved.id],
  );
  assert.equal(stored.rows[0].owner_id, owner);
});
test("voice-removal migration strips invitation data and preserves shared music media", async () => {
  const owner = await user();
  const draft = await invitation(owner);
  const voiceOnlyId = randomUUID();
  const musicId = randomUUID();
  draft.music = {
    enabled: true,
    assetId: musicId,
    url: `/api/media/${musicId}`,
    filename: "shared-music.mp3",
  };
  const legacyData = {
    ...draft,
    voiceMessage: {
      enabled: true,
      assetId: musicId,
      url: `/api/media/${musicId}`,
      filename: "shared-music.mp3",
    },
  };
  legacyData.voiceMessage.assetId = voiceOnlyId;
  legacyData.voiceMessage.url = `/api/media/${voiceOnlyId}`;
  legacyData.voiceMessage.filename = "old-greeting.m4a";
  for (const [id, filename, mime] of [
    [musicId, "shared-music.mp3", "audio/mpeg"],
    [voiceOnlyId, "old-greeting.m4a", "audio/mp4"],
  ]) {
    await db.query(
      "INSERT INTO media_assets(id,owner_id,draft_id,object_key,url,filename,mime_type,size_bytes,visibility,status) VALUES($1,$2,$3,$4,$5,$6,$7,64,'public','ready')",
      [id, owner, draft.id, `test/${id}`, `/api/media/${id}`, filename, mime],
    );
  }
  await db.query("UPDATE invitations SET data=$1 WHERE id=$2", [
    JSON.stringify(legacyData),
    draft.id,
  ]);

  await db.exec(
    await readFile(
      new URL(
        "../packages/database/migrations/0010_remove_voice_greetings.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );

  const saved = await db.query<{ data: Record<string, unknown> }>(
    "SELECT data FROM invitations WHERE id=$1",
    [draft.id],
  );
  assert.equal("voiceMessage" in saved.rows[0].data, false);
  assert.equal(
    (saved.rows[0].data.music as { assetId: string }).assetId,
    musicId,
  );
  const remaining = await db.query<{ id: string }>(
    "SELECT id FROM media_assets WHERE id=ANY($1::uuid[]) ORDER BY id",
    [[musicId, voiceOnlyId]],
  );
  assert.deepEqual(
    remaining.rows.map((row) => row.id),
    [musicId],
  );
});
test("gift migration removes only the saved bank name", async () => {
  const owner = await user();
  const draft = await invitation(owner);
  const legacyData = {
    ...draft,
    gift: {
      ...draft.gift,
      enabled: true,
      cardNumber: "8600 1234 5678 9012",
      cardHolder: "Asadbek Asqarov",
      bankName: "Old bank entry",
    },
  };
  await db.query("UPDATE invitations SET data=$1 WHERE id=$2", [
    JSON.stringify(legacyData),
    draft.id,
  ]);
  await db.exec(
    await readFile(
      new URL(
        "../packages/database/migrations/0011_remove_gift_bank_name.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  const saved = await db.query<{ data: Record<string, unknown> }>(
    "SELECT data FROM invitations WHERE id=$1",
    [draft.id],
  );
  const gift = saved.rows[0].data.gift as Record<string, unknown>;
  assert.equal("bankName" in gift, false);
  assert.equal(gift.cardNumber, "8600 1234 5678 9012");
  assert.equal(gift.cardHolder, "Asadbek Asqarov");
  assert.equal(gift.enabled, true);
});
test("contact migration keeps phone and Telegram values and removes legacy cards", async () => {
  const owner = await user();
  const draft = await invitation(owner);
  await db.query("UPDATE invitations SET data=$1 WHERE id=$2", [
    JSON.stringify({
      ...draft,
      contacts: [
        {
          id: "phone",
          type: "phone",
          label: "Call",
          value: "+998 90 123 45 67",
        },
        { id: "telegram", type: "telegram", label: "", value: "@taklifnoma" },
      ],
    }),
    draft.id,
  ]);
  await db.exec(
    await readFile(
      new URL(
        "../packages/database/migrations/0012_contacts_phone_telegram.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  const saved = await db.query<{ data: Record<string, unknown> }>(
    "SELECT data FROM invitations WHERE id=$1",
    [draft.id],
  );
  assert.deepEqual(saved.rows[0].data.contacts, {
    phoneNumber: "+998 90 123 45 67",
    telegramUsername: "@taklifnoma",
  });
});
test("session lookup excludes incomplete phone onboarding, revoked, idle-expired, and absolute-expired sessions", async () => {
  const complete = await user(),
    incomplete = await user(false);
  const insert = (
    owner: string,
    token: string,
    expires: string,
    absolute: string,
    revoked: string | null = null,
  ) =>
    db.query(
      "INSERT INTO sessions(user_id,token_hash,expires_at,absolute_expires_at,revoked_at) VALUES($1,$2,$3,$4,$5)",
      [owner, token, expires, absolute, revoked],
    );
  const future = new Date(Date.now() + 86400000).toISOString(),
    past = new Date(Date.now() - 86400000).toISOString();
  await insert(complete, "valid", future, future);
  await insert(incomplete, "no-phone", future, future);
  await insert(complete, "revoked", future, future, new Date().toISOString());
  await insert(complete, "idle-expired", past, future);
  await insert(complete, "absolute-expired", future, past);
  const lookup = (token: string) =>
    db.query(
      "SELECT s.id FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.revoked_at IS NULL AND s.expires_at>now() AND s.absolute_expires_at>now() AND u.phone_shared_at IS NOT NULL",
      [token],
    );
  assert.equal((await lookup("valid")).rows.length, 1);
  for (const token of [
    "no-phone",
    "revoked",
    "idle-expired",
    "absolute-expired",
  ])
    assert.equal((await lookup(token)).rows.length, 0, token);
});
test("pending wishes stay private; approval publishes; soft deletion keeps dashboard evidence", async () => {
  const owner = await user(),
    draft = await invitation(owner),
    wish = randomUUID();
  await db.query(
    "INSERT INTO wishes(id,invitation_id,name,message) VALUES($1,$2,'Mehmon','Baxtli bo‘ling!')",
    [wish, draft.id],
  );
  const visible = () =>
    db.query(
      "SELECT id FROM wishes WHERE invitation_id=$1 AND status='approved' AND deleted_at IS NULL",
      [draft.id],
    );
  assert.equal((await visible()).rows.length, 0);
  await db.query(
    "UPDATE wishes SET status='approved',moderated_by=$1,moderated_at=now() WHERE id=$2",
    [owner, wish],
  );
  assert.equal((await visible()).rows.length, 1);
  await db.query(
    "UPDATE wishes SET status='deleted',deleted_at=now(),moderated_by=$1 WHERE id=$2",
    [owner, wish],
  );
  assert.equal((await visible()).rows.length, 0);
  const dashboard = await db.query<{ message: string; status: string }>(
    "SELECT message,status FROM wishes WHERE invitation_id=$1",
    [draft.id],
  );
  assert.equal(dashboard.rows[0].message, "Baxtli bo‘ling!");
  assert.equal(dashboard.rows[0].status, "deleted");
  await assert.rejects(
    db.query("UPDATE wishes SET status='unchecked-public' WHERE id=$1", [wish]),
    /check constraint/i,
  );
});
test("invitation JSON snapshot retains language variants and stable media IDs through template switching", async () => {
  const owner = await user(),
    draft = addLanguage(createInvitation(), "ru"),
    assetId = randomUUID();
  draft.content.ru = {
    ...draft.content.ru,
    title: "Наш праздник",
    greeting: "Дорогие гости!",
  };
  draft.gallery = [
    {
      id: assetId,
      url: "https://media.example.com/photo.webp",
      alt: "Couple",
      caption: "Together",
    },
  ];
  draft.music = {
    enabled: true,
    assetId: randomUUID(),
    url: "https://media.example.com/music.mp3",
    filename: "our-song.mp3",
  };
  await db.query(
    "INSERT INTO media_assets(id,owner_id,draft_id,object_key,url,filename,mime_type,size_bytes,visibility,status) VALUES($1,$2,$3,'owner/photo.webp',$4,'photo.webp','image/webp',512,'public','ready')",
    [assetId, owner, draft.id, draft.gallery[0].url],
  );
  await db.query(
    "INSERT INTO invitations(id,owner_id,template_id,data) VALUES($1,$2,$3,$4)",
    [draft.id, owner, draft.templateId || null, JSON.stringify(draft)],
  );
  const switched = switchTemplate(draft, "anor");
  await db.query("UPDATE invitations SET template_id=$1,data=$2 WHERE id=$3", [
    switched.templateId,
    JSON.stringify(switched),
    draft.id,
  ]);
  const record = await db.query<{ data: typeof switched; template_id: string }>(
    "SELECT data,template_id FROM invitations WHERE id=$1",
    [draft.id],
  );
  assert.deepEqual(record.rows[0].data, switched);
  assert.equal(record.rows[0].data.gallery[0].id, assetId);
  assert.equal(record.rows[0].data.music.assetId, draft.music.assetId);
  assert.equal(record.rows[0].data.content.ru.greeting, "Дорогие гости!");
  assert.equal(record.rows[0].template_id, "anor");
  const media = await db.query<{ object_key: string; draft_id: string }>(
    "SELECT object_key,draft_id FROM media_assets WHERE id=$1 AND owner_id=$2",
    [assetId, owner],
  );
  assert.equal(media.rows[0].draft_id, draft.id);
  assert.equal(media.rows[0].object_key, "owner/photo.webp");
});
test("template migrations publish completed designs while keeping unfinished designs private", async () => {
  const categories = await db.query<{ id: string }>(
    "SELECT id FROM template_categories ORDER BY position,id",
  );
  assert.deepEqual(
    categories.rows.map((row) => row.id),
    [
      "wedding",
      "birthday",
      "osh",
      "qiz-bazmi",
      "other",
      "iftorlik",
      "yangi-uy",
    ],
  );
  const anor = await db.query<{ published: boolean; price_minor: number }>(
    "SELECT published,price_minor FROM templates WHERE id='anor'",
  );
  assert.equal(anor.rows[0].published, true);
  assert.equal(Number(anor.rows[0].price_minor), 15000000);
  const anorEvents = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='anor'",
  );
  assert.deepEqual(anorEvents.rows, [{ event_type: "wedding" }]);
  const samarqand = await db.query<{
    published: boolean;
    price_minor: number;
  }>(
    "SELECT published,price_minor FROM templates WHERE id='samarqand-kechasi'",
  );
  assert.equal(samarqand.rows[0].published, true);
  assert.equal(Number(samarqand.rows[0].price_minor), 15000000);
  const samarqandEvents = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='samarqand-kechasi'",
  );
  assert.deepEqual(samarqandEvents.rows, [{ event_type: "wedding" }]);
  const bogi = await db.query<{
    published: boolean;
    price_minor: number;
  }>("SELECT published,price_minor FROM templates WHERE id='bogi-eram'");
  assert.equal(bogi.rows[0].published, true);
  assert.equal(Number(bogi.rows[0].price_minor), 15000000);
  const bogiEvents = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='bogi-eram'",
  );
  assert.deepEqual(bogiEvents.rows, [{ event_type: "wedding" }]);
  const atlas = await db.query<{
    published: boolean;
    price_minor: number;
  }>("SELECT published,price_minor FROM templates WHERE id='atlas'");
  assert.equal(atlas.rows[0].published, true);
  assert.equal(Number(atlas.rows[0].price_minor), 15000000);
  const atlasEvents = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='atlas'",
  );
  assert.deepEqual(atlasEvents.rows, [{ event_type: "wedding" }]);
  const marxaba = await db.query<{ id: string; published: boolean }>(
    "SELECT id,published FROM templates WHERE id=ANY($1::text[]) ORDER BY id",
    [
      [
        "oltin-nur",
        "samarqand-kechasi",
        "bogi-eram",
        "atlas",
        "bulbul",
        "uchar-gilam",
        "oq-kabutar",
        "kuzgi-chinor",
        "kozgu",
        "muhabbat-kitobi",
        "sahifa",
        "oltin-uzuk",
        "oynavand",
        "somon-yoli",
        "qogoz-turna",
        "nilufar",
        "monogram",
        "retro-kino",
        "suzani",
        "orik-guli",
        "paxta",
        "sahro-fonusi",
        "toscana",
        "vals",
        "muhr",
        "doira",
        "qandil",
        "parda",
        "ganch",
        "hilol",
        "qatlam",
        "lola",
        "qiz-bazmi",
        "shahzoda",
        "chavandoz",
        "beshik",
        "shirin-bayram",
        "konfetti",
        "oltin-kuz",
        "oltin-yosh",
        "nahor",
        "nahorgi-osh",
      ],
    ],
  );
  assert.deepEqual(
    marxaba.rows.map((row) => [row.id, row.published]),
    [
      ["atlas", true],
      ["beshik", false],
      ["bogi-eram", true],
      ["bulbul", false],
      ["chavandoz", false],
      ["doira", false],
      ["ganch", false],
      ["hilol", false],
      ["konfetti", false],
      ["kozgu", true],
      ["kuzgi-chinor", true],
      ["lola", false],
      ["monogram", false],
      ["muhabbat-kitobi", true],
      ["muhr", false],
      ["nahor", false],
      ["nahorgi-osh", false],
      ["nilufar", false],
      ["oltin-kuz", false],
      ["oltin-nur", false],
      ["oltin-uzuk", true],
      ["oltin-yosh", false],
      ["oq-kabutar", true],
      ["orik-guli", false],
      ["oynavand", true],
      ["parda", false],
      ["paxta", false],
      ["qandil", true],
      ["qatlam", false],
      ["qiz-bazmi", false],
      ["qogoz-turna", true],
      ["retro-kino", false],
      ["sahifa", true],
      ["sahro-fonusi", false],
      ["samarqand-kechasi", true],
      ["shahzoda", false],
      ["shirin-bayram", false],
      ["somon-yoli", true],
      ["suzani", false],
      ["toscana", false],
      ["uchar-gilam", false],
      ["vals", false],
    ],
  );
  const kozguEvents = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='kozgu' ORDER BY event_type",
  );
  assert.deepEqual(kozguEvents.rows, [
    { event_type: "fotiha" },
    { event_type: "qiz-bazmi" },
    { event_type: "wedding" },
  ]);
  const doiraEvents = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='doira' ORDER BY event_type",
  );
  assert.deepEqual(doiraEvents.rows, [
    { event_type: "sunnat-toyi" },
    { event_type: "wedding" },
  ]);
  const ganchEvents = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='ganch' ORDER BY event_type",
  );
  assert.deepEqual(ganchEvents.rows, [
    { event_type: "fotiha" },
    { event_type: "qiz-bazmi" },
    { event_type: "wedding" },
  ]);
  const qatlamEvents = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='qatlam' ORDER BY event_type",
  );
  assert.deepEqual(qatlamEvents.rows, [
    { event_type: "fotiha" },
    { event_type: "qiz-bazmi" },
    { event_type: "wedding" },
  ]);
  const lolaEvents = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='lola' ORDER BY event_type",
  );
  assert.deepEqual(lolaEvents.rows, [
    { event_type: "fotiha" },
    { event_type: "qiz-uzatish" },
  ]);
  const chavandozEvents = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='chavandoz' ORDER BY event_type",
  );
  assert.deepEqual(chavandozEvents.rows, [
    { event_type: "birthday" },
    { event_type: "sunnat-toyi" },
  ]);
  const konfettiEvents = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='konfetti' ORDER BY event_type",
  );
  assert.deepEqual(konfettiEvents.rows, [
    { event_type: "birthday" },
    { event_type: "yubiley" },
  ]);
  const nahorgiOshEvents = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='nahorgi-osh' ORDER BY event_type",
  );
  assert.deepEqual(nahorgiOshEvents.rows, [
    { event_type: "osh" },
    { event_type: "sunnat-toyi" },
    { event_type: "wedding" },
  ]);
  const hilolEvents = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='hilol' ORDER BY event_type",
  );
  assert.deepEqual(hilolEvents.rows, [
    { event_type: "iftorlik" },
    { event_type: "osh" },
  ]);
  const iftorlikCategory = await db.query<{ name: string }>(
    "SELECT name FROM template_categories WHERE id='iftorlik'",
  );
  assert.deepEqual(iftorlikCategory.rows, [{ name: "Iftorlik" }]);
  const assignments = await db.query<{
    template_id: string;
    category_id: string;
  }>(
    "SELECT template_id,category_id FROM template_category_assignments ORDER BY template_id",
  );
  assert.deepEqual(
    assignments.rows.filter((row) => row.template_id === "anor"),
    [{ template_id: "anor", category_id: "wedding" }],
  );
  assert.equal(
    assignments.rows.filter((row) => row.category_id === "wedding").length,
    31,
  );
});
test("template event compatibility is constrained and independently assignable", async () => {
  const existing = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='test-alt'",
  );
  assert.deepEqual(existing.rows, [{ event_type: "wedding" }]);
  await db.query(
    "INSERT INTO template_supported_event_types(template_id,event_type) VALUES('test-alt','birthday')",
  );
  await db.query(
    "INSERT INTO template_supported_event_types(template_id,event_type) VALUES('test-alt','fotiha')",
  );
  await db.query(
    "INSERT INTO template_supported_event_types(template_id,event_type) VALUES('test-alt','iftorlik')",
  );
  await db.query(
    "INSERT INTO template_supported_event_types(template_id,event_type) VALUES('test-alt','yubiley')",
  );
  const supported = await db.query<{ event_type: string }>(
    "SELECT event_type FROM template_supported_event_types WHERE template_id='test-alt' ORDER BY event_type",
  );
  assert.deepEqual(supported.rows, [
    { event_type: "birthday" },
    { event_type: "fotiha" },
    { event_type: "iftorlik" },
    { event_type: "wedding" },
    { event_type: "yubiley" },
  ]);
  await assert.rejects(
    db.query(
      "INSERT INTO template_supported_event_types(template_id,event_type) VALUES('test-alt','anniversary')",
    ),
  );
  await assert.rejects(
    db.query(
      "INSERT INTO template_supported_event_types(template_id,event_type) VALUES('test-alt','birthday')",
    ),
  );
  await assert.rejects(
    db.query(
      "DELETE FROM template_supported_event_types WHERE template_id='anor'",
    ),
  );
});
test("any template can have multiple categories or none without changing invitation content", async () => {
  const owner = await user(),
    draft = await invitation(owner);
  draft.eventType = "wedding";
  await db.query("UPDATE invitations SET data=$1 WHERE id=$2", [
    JSON.stringify(draft),
    draft.id,
  ]);
  const original = JSON.stringify(draft);
  await db.query(
    "INSERT INTO template_categories(id,name,position) VALUES('corporate','Korporativ tadbir',5)",
  );
  await db.transaction(async (tx) => {
    await tx.query(
      "DELETE FROM template_category_assignments WHERE template_id='test-alt'",
    );
    await tx.query(
      "INSERT INTO template_category_assignments(template_id,category_id) VALUES('test-alt','birthday'),('test-alt','corporate')",
    );
  });
  const categories = () =>
    db.query<{ category_id: string }>(
      "SELECT category_id FROM template_category_assignments WHERE template_id='test-alt' ORDER BY category_id",
    );
  assert.deepEqual(
    (await categories()).rows.map((row) => row.category_id),
    ["birthday", "corporate"],
  );
  // Labels are editable; IDs and their assignments are stable.
  await db.query(
    "UPDATE template_categories SET name='Business events' WHERE id='corporate'",
  );
  assert.equal((await categories()).rows[1].category_id, "corporate");
  const saved = await db.query<{ data: typeof draft; template_id: string }>(
    "SELECT data,template_id FROM invitations WHERE id=$1",
    [draft.id],
  );
  assert.deepEqual(saved.rows[0].data, JSON.parse(original));
  assert.equal(saved.rows[0].template_id, "anor");
  assert.equal(saved.rows[0].data.eventType, "wedding");
  await db.query(
    "DELETE FROM template_category_assignments WHERE template_id='test-alt'",
  );
  assert.equal((await categories()).rows.length, 0);
  assert.deepEqual(
    (
      await db.query<{ data: typeof draft }>(
        "SELECT data FROM invitations WHERE id=$1",
        [draft.id],
      )
    ).rows[0].data,
    draft,
  );
});
test("category foreign keys, uniqueness and transaction rollback preserve prior assignments", async () => {
  await db.query(
    "DELETE FROM template_category_assignments WHERE template_id='test-alt'",
  );
  await db.query(
    "INSERT INTO template_category_assignments(template_id,category_id) VALUES('test-alt','wedding')",
  );
  await assert.rejects(
    db.query(
      "INSERT INTO template_category_assignments(template_id,category_id) VALUES('test-alt','wedding')",
    ),
    /unique/i,
  );
  await assert.rejects(
    db.query(
      "INSERT INTO template_category_assignments(template_id,category_id) VALUES('missing','wedding')",
    ),
    /foreign key/i,
  );
  await assert.rejects(
    db.query(
      "INSERT INTO template_category_assignments(template_id,category_id) VALUES('test-alt','missing')",
    ),
    /foreign key/i,
  );
  await assert.rejects(
    db.transaction(async (tx) => {
      await tx.query(
        "DELETE FROM template_category_assignments WHERE template_id='test-alt'",
      );
      await tx.query(
        "INSERT INTO template_category_assignments(template_id,category_id) VALUES('test-alt','missing')",
      );
    }),
    /foreign key/i,
  );
  const unchanged = await db.query<{ category_id: string }>(
    "SELECT category_id FROM template_category_assignments WHERE template_id='test-alt'",
  );
  assert.deepEqual(unchanged.rows, [{ category_id: "wedding" }]);
  await assert.rejects(
    db.query(
      "INSERT INTO template_categories(id,name) VALUES('bad slug','Bad')",
    ),
    /check constraint/i,
  );
  await assert.rejects(
    db.query("INSERT INTO template_categories(id,name) VALUES('empty','   ')"),
    /check constraint/i,
  );
  await assert.rejects(
    db.query(
      "INSERT INTO template_categories(id,name,position) VALUES('negative','Negative',-1)",
    ),
    /check constraint/i,
  );
});
test("Anor reopens multilingual content and admin replacements preserve linked guests and event locks", async () => {
  await db.query("UPDATE templates SET published=true WHERE id='anor'");
  const owner = await user(),
    admin = await user(),
    guestId = randomUUID(),
    wishId = randomUUID(),
    rsvpId = randomUUID();
  await db.query("UPDATE users SET is_admin=true WHERE id=$1", [admin]);
  let draft = addLanguage(addLanguage(createInvitation(), "ru"), "en");
  draft.templateId = "anor";
  draft.templateId = "anor";
  draft.content.ru = {
    ...draft.content["uz-Latn"],
    title: "Наш день",
    greeting: "Дорогие гости!",
  };
  draft.content.en = {
    ...draft.content["uz-Latn"],
    title: "Our wedding",
    greeting: "Dear guests!",
  };
  draft.gallery = [
    {
      id: randomUUID(),
      url: "https://media.example.com/wedding.webp",
      alt: "Wedding portrait",
      caption: "Our story",
    },
  ];
  draft.music = {
    enabled: true,
    assetId: randomUUID(),
    url: "https://media.example.com/wedding.mp3",
    filename: "wedding.mp3",
  };
  await db.query(
    "INSERT INTO invitations(id,owner_id,template_id,data) VALUES($1,$2,$3,$4)",
    [draft.id, owner, draft.templateId, JSON.stringify(draft)],
  );
  draft = {
    ...switchTemplate(draft, "anor"),
    revision: draft.revision + 1,
  };
  await db.query("UPDATE invitations SET template_id=$1,data=$2 WHERE id=$3", [
    draft.templateId,
    JSON.stringify(draft),
    draft.id,
  ]);
  const reopened = await db.query<{ data: unknown }>(
    "SELECT data FROM invitations WHERE id=$1 AND owner_id=$2",
    [draft.id, owner],
  );
  assert.deepEqual(invitationSchema.parse(reopened.rows[0].data), draft);

  const publishedAt = new Date(Date.now() - 2 * 86400000),
    deadline = new Date(Date.now() - 86400000),
    slug = `anor-test-${draft.id}`;
  const published = { ...draft, status: "published" as const };
  await db.query(
    "UPDATE invitations SET status='published',data=$1,slug=$2,first_published_at=$3,identity_locked_at=$3,edit_deadline_at=$4 WHERE id=$5",
    [JSON.stringify(published), slug, publishedAt, deadline, draft.id],
  );
  await db.query(
    "INSERT INTO invitation_guests(id,invitation_id,display_name,token_hash,locale,max_party_size) VALUES($1,$2,'Nazar',$3,'ru',3)",
    [guestId, draft.id, randomUUID()],
  );
  await db.query(
    "INSERT INTO wishes(id,invitation_id,guest_id,name,message,status) VALUES($1,$2,$3,'Nazar','Baxtli bo‘ling!','approved')",
    [wishId, draft.id, guestId],
  );
  await db.query(
    "INSERT INTO rsvp_responses(id,invitation_id,guest_id,name,status,party_size) VALUES($1,$2,$3,'Nazar','yes',2)",
    [rsvpId, draft.id, guestId],
  );

  // Execute the exact production replacement CTE, replacing only postgres.js
  // interpolation markers with PGlite parameter placeholders to avoid drift.
  const route = await readFile(
    new URL(
      "../apps/web/src/app/api/admin/templates/[id]/route.ts",
      import.meta.url,
    ),
    "utf8",
  );
  const productionCte = route.match(
    /await tx`(WITH affected AS[\s\S]*?RETURNING invitation_id)`/,
  )?.[1];
  assert.ok(productionCte, "Production replacement CTE must exist");
  const replacementSql = productionCte
    .replaceAll("${id}", "$1")
    .replaceAll("${target.id}", "$2")
    .replaceAll("${user.id}", "$3");
  const replace = async (from: string, to: string) =>
    db.transaction(async (tx) => {
      const target = await tx.query(
        "SELECT id FROM templates WHERE id=$1 AND published=true FOR UPDATE",
        [to],
      );
      assert.equal(target.rows.length, 1);
      const changed = await tx.query<{ invitation_id: string }>(
        replacementSql,
        [from, to, admin],
      );
      assert.ok(changed.rows.some((row) => row.invitation_id === draft.id));
      await tx.query(
        "UPDATE templates SET published=false,replacement_template_id=$1 WHERE id=$2",
        [to, from],
      );
    });
  await replace("anor", "test-alt");
  await db.query(
    "UPDATE templates SET published=true,replacement_template_id=NULL WHERE id='anor'",
  );
  await replace("test-alt", "anor");

  const final = await db.query<{
    data: unknown;
    template_id: string;
    owner_id: string;
    slug: string;
    status: string;
    first_published_at: Date;
    identity_locked_at: Date;
    edit_deadline_at: Date;
  }>("SELECT * FROM invitations WHERE id=$1", [draft.id]);
  const row = final.rows[0],
    expected = {
      ...published,
      templateId: "anor",
      revision: published.revision + 2,
    };
  assert.deepEqual(invitationSchema.parse(row.data), expected);
  assert.equal(row.template_id, "anor");
  assert.equal(row.owner_id, owner);
  assert.equal(row.slug, slug);
  assert.equal(row.status, "published");
  assert.equal(row.first_published_at.getTime(), publishedAt.getTime());
  assert.equal(row.identity_locked_at.getTime(), publishedAt.getTime());
  assert.equal(row.edit_deadline_at.getTime(), deadline.getTime());
  const linked = await db.query<{
    id: string;
    name: string;
    message: string;
    status: string;
    party_size: number;
  }>(
    "SELECT g.id,g.display_name AS name,w.message,r.status,r.party_size FROM invitation_guests g JOIN wishes w ON w.guest_id=g.id JOIN rsvp_responses r ON r.guest_id=g.id WHERE g.id=$1 AND g.invitation_id=$2 AND w.id=$3 AND r.id=$4",
    [guestId, draft.id, wishId, rsvpId],
  );
  assert.deepEqual(linked.rows, [
    {
      id: guestId,
      name: "Nazar",
      message: "Baxtli bo‘ling!",
      status: "yes",
      party_size: 2,
    },
  ]);
  const audit = await db.query<{
    actor_id: string;
    previous_values: typeof published;
    new_values: typeof published;
  }>(
    "SELECT actor_id,previous_values,new_values FROM invitation_audit_log WHERE invitation_id=$1 AND action='admin_template_replacement' ORDER BY (new_values->>'revision')::int",
    [draft.id],
  );
  assert.equal(audit.rows.length, 2);
  assert.equal(audit.rows[0].actor_id, admin);
  assert.deepEqual(audit.rows[0].previous_values, published);
  assert.deepEqual(audit.rows[0].new_values, {
    ...published,
    templateId: "test-alt",
    revision: published.revision + 1,
  });
  assert.deepEqual(audit.rows[1].previous_values, audit.rows[0].new_values);
  assert.deepEqual(audit.rows[1].new_values, expected);
});
