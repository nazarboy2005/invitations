import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import templateRenames from "../packages/contracts/src/template-renames.json";
import {
  createInvitation,
  TEMPLATES,
  templateVisitorFeaturesSchema,
} from "../packages/contracts/src/index";
import { TEMPLATE_CAPABILITIES } from "../packages/contracts/src/template-capabilities";
import {
  invitationActivityFeatures,
  normalizeInvitation,
  templateCapabilities,
  templateVisitorFeatures,
} from "../packages/contracts/src/capabilities";
import {
  guestTelegramMessage,
  sendGuestNotification,
} from "../apps/web/src/server/guest-notifications";

test("every template has explicit visitor metadata; migration persists the same support without changing publication", async () => {
  assert.equal(new Set(TEMPLATES.map((t) => t.id)).size, TEMPLATES.length);
  const db = new PGlite();
  // Migration 0226 ran before canonical identities were introduced in 0229.
  const previousIds = new Map(
    templateRenames.map((row) => [row.id, row.previousId]),
  );
  const historicalTemplates = new Map(
    TEMPLATES.map((template) => [
      previousIds.get(template.id) ?? template.id,
      template,
    ]),
  );
  try {
    await db.exec(
      "CREATE TABLE templates(id text PRIMARY KEY,published boolean NOT NULL DEFAULT false)",
    );
    for (const t of TEMPLATES) {
      assert.ok(Object.hasOwn(TEMPLATE_CAPABILITIES, t.id), t.id);
      assert.deepEqual(
        templateVisitorFeaturesSchema.parse(t.visitorFeatures),
        templateVisitorFeatures(t.id),
      );
      await db.query("INSERT INTO templates(id,published) VALUES ($1,$2)", [
        previousIds.get(t.id) ?? t.id,
        t.published,
      ]);
    }
    await db.exec(
      readFileSync(
        "packages/database/migrations/0226_template_visitor_features.sql",
        "utf8",
      ),
    );
    const result = await db.query<{
      id: string;
      published: boolean;
      visitor_features: unknown;
    }>("SELECT * FROM templates");
    for (const row of result.rows) {
      assert.deepEqual(
        row.visitor_features,
        templateVisitorFeatures(historicalTemplates.get(row.id)!.id),
        row.id,
      );
      assert.equal(row.published, historicalTemplates.get(row.id)!.published);
    }
    await db.exec("INSERT INTO templates(id) VALUES ('future-unverified')");
    const future = await db.query<{ visitor_features: unknown }>(
      "SELECT visitor_features FROM templates WHERE id='future-unverified'",
    );
    assert.deepEqual(future.rows[0].visitor_features, {
      rsvp: "none",
      wishes: false,
      receipts: false,
      giftIntentions: false,
    });
    await assert.rejects(
      db.exec("UPDATE templates SET visitor_features='{}'::jsonb"),
    );
  } finally {
    await db.close();
  }
});

test("RSVP note support follows the template form independently of public wishes", () => {
  for (const id of [
    "anor",
    "gulli-darvoza",
    "ming-bir-kecha",
    "safir",
    "uchrashuv",
    "unregistered",
  ]) {
    assert.equal(templateCapabilities(id).rsvpNotes, false, id);
  }
  for (const id of [
    "kongillar-oroli",
    "velora",
    "velvet",
    "andalus-darvozasi",
    "umr-bahori",
    "zaytun",
  ]) {
    assert.equal(templateCapabilities(id).rsvpNotes, true, id);
  }
  for (const template of TEMPLATES) {
    const c = templateCapabilities(template.id);
    assert.equal(typeof c.rsvpNotes, "boolean", template.id);
    if (c.rsvp !== "form") assert.equal(c.rsvpNotes, false, template.id);
  }
});

test("activity sections follow actual forms, owner toggles and retained history", () => {
  assert.deepEqual(invitationActivityFeatures(createInvitation("oq-atirgul")), {
    responses: false,
    wishes: false,
    receipts: false,
    intentions: false,
  });
  for (const id of ["muhrli-maktub", "tovus", "asalari"]) {
    const features = invitationActivityFeatures(createInvitation(id));
    assert.equal(features.responses, false, id);
    assert.equal(features.wishes, true, id);
  }
  assert.equal(
    normalizeInvitation(createInvitation("uchrashuv")).rsvp.enabled,
    true,
  );
  assert.equal(
    invitationActivityFeatures(createInvitation("velora")).wishes,
    false,
  );
  assert.equal(
    invitationActivityFeatures(createInvitation("velvet")).wishes,
    false,
  );
  const invitation = createInvitation("anor");
  invitation.rsvp.enabled = false;
  invitation.wishes.enabled = false;
  assert.equal(invitationActivityFeatures(invitation).responses, false);
  assert.equal(invitationActivityFeatures(invitation).wishes, false);
  assert.deepEqual(
    invitationActivityFeatures(invitation, {
      responses: 1,
      wishes: 1,
      receipts: 1,
      intentions: 0,
    }),
    { responses: true, wishes: true, receipts: true, intentions: false },
  );
  invitation.gift.enabled = true;
  invitation.gift.receiptUploadEnabled = true;
  assert.equal(invitationActivityFeatures(invitation).receipts, true);
  const pulau = createInvitation("kongillar-oroli");
  pulau.templateData["kongillar-oroli"] = { giftWell: { enabled: true } };
  assert.equal(invitationActivityFeatures(pulau).intentions, true);
  assert.equal(
    invitationActivityFeatures(invitation, {
      responses: 0,
      wishes: 0,
      receipts: 0,
      intentions: 1,
    }).intentions,
    false,
  );
});

const shared = {
  invitationId: "11111111-1111-4111-8111-111111111111",
  recordId: "22222222-2222-4222-8222-222222222222",
  name: "Ali <b>&",
};
test("Telegram messages are short, escaped, sticker-free and link to private activity", () => {
  const response = guestTelegramMessage(
    { ...shared, kind: "response", status: "yes", note: "Vegetarian" },
    "A & B",
    "https://fotiha.example",
  );
  assert.equal(
    response.text,
    "💌 <b>Taklifnomangizga yangi javob!</b>\n\n🎉 <b>A &amp; B</b>\n👤 Mehmon: <b>Ali &lt;b&gt;&amp;</b>\n✅ Javob: <b>Kelaman</b>",
  );
  const wish = guestTelegramMessage(
    { ...shared, kind: "wish", message: "<script>".repeat(300) },
    "Wedding",
    "https://fotiha.example",
  );
  assert.ok(wish.text.length < 4096);
  assert.ok(!wish.text.includes("<script>"));
  assert.equal(wish.reply_markup.inline_keyboard.length, 2);
  for (const [status, description] of [
    ["pending", "❓Bu tilakni"],
    ["approved", "✅ Tilak veb-sahifada ko‘rsatiladi."],
    ["hidden", "🗑 Tilak veb-sahifada ko‘rsatilmaydi."],
    ["deleted", "🗑 Tilak veb-sahifada ko‘rsatilmaydi."],
  ] as const) {
    const notification = guestTelegramMessage(
      { ...shared, kind: "wish", message: "Nice" },
      "Wedding",
      "https://fotiha.example",
      status,
    );
    assert.ok(notification.text.includes(description), status);
    assert.deepEqual(
      notification.reply_markup.inline_keyboard,
      [
        [
          {
            text: "✅ Ha, ko‘rsatilsin",
            callback_data: `wish_approve:${shared.recordId}`,
          },
          {
            text: "🗑 Yo‘q, o‘chirilsin",
            callback_data: `wish_hide:${shared.recordId}`,
          },
        ],
        [
          {
            text: "Faollik",
            web_app: {
              url: `https://fotiha.example/dashboard/${shared.invitationId}/activity`,
            },
          },
        ],
      ],
      status,
    );
  }
  const receipt = guestTelegramMessage(
    { ...shared, kind: "receipt" },
    "Wedding",
    "https://fotiha.example",
  );
  assert.match(receipt.text, /Pul tushganini tekshiring/);
  assert.ok(!JSON.stringify(receipt).includes("/api/media"));
  const intention = guestTelegramMessage(
    {
      ...shared,
      kind: "intention",
      amount: "100000",
      currencyLabel: "UZS",
      message: "Enjoy",
    },
    "Wedding",
    "https://fotiha.example",
  );
  assert.match(intention.text, /pul o‘tkazilmagan/);
});

test("Telegram transport distinguishes rate limits, rejection and uncertain acceptance without sending real messages", async () => {
  const original = globalThis.fetch;
  try {
    const message = guestTelegramMessage(
      { ...shared, kind: "response", status: "no", note: "" },
      "Wedding",
      "https://fotiha.example",
    );
    globalThis.fetch = async () => Response.json({ ok: true });
    assert.deepEqual(await sendGuestNotification("1", message), {
      state: "sent",
    });
    globalThis.fetch = async () =>
      Response.json(
        { ok: false, error_code: 429, parameters: { retry_after: 120 } },
        { status: 429 },
      );
    assert.deepEqual(await sendGuestNotification("1", message), {
      state: "retry",
      after: 120,
    });
    globalThis.fetch = async () =>
      Response.json({ ok: false, error_code: 403 }, { status: 403 });
    assert.deepEqual(await sendGuestNotification("1", message), {
      state: "failed",
    });
    globalThis.fetch = async () => {
      throw new Error("Connection lost");
    };
    assert.deepEqual(await sendGuestNotification("1", message), {
      state: "uncertain",
    });
  } finally {
    globalThis.fetch = original;
  }
});
