import test from "node:test";
import assert from "node:assert/strict";
import { addLanguage, type Invitation } from "../packages/contracts/src/index";
import { normalizeInvitation } from "../packages/contracts/src/capabilities";
import {
  assertCreatorCanEdit,
  editingClosed,
  eventDay,
  lastCeremonyDate,
  sameValue,
} from "../packages/contracts/src/policies";
import {
  changeRequestSchema,
  identityValues,
  applyChange,
} from "../packages/contracts/src/changes";
import { completeInvitation } from "./fixtures/publication";
import { assertPublicMedia } from "../apps/web/src/server/publication";
import { CATALOG_PREVIEW_MUSIC } from "../apps/web/src/modules/catalog/catalog-music";
import { eventTimestamp } from "../apps/web/src/lib/event-date";
const now = new Date("2027-06-01T12:00:00Z");
const state = {
  status: "published",
  editDeadlineAt: "2027-06-14T19:00:00Z",
  approvedEventDate: "2027-06-14",
};
const image = () =>
  normalizeInvitation({
    ...completeInvitation(),
    templateId: "ivory-rose-card",
    imageExportedAt: "2027-06-01T10:00:00Z",
  });
const web = () => ({ ...completeInvitation(), status: "published" as const });
function edit(base: Invitation, mutate: (i: Invitation) => void) {
  const next = structuredClone(base);
  mutate(next);
  return () => assertCreatorCanEdit(base, next, state, now);
}
test("static only permits mapped location and bounded date/time after export", () => {
  const base = image();
  for (const field of ["venueName", "address", "landmark"] as const)
    assert.doesNotThrow(
      edit(base, (i) => {
        i.content["uz-Latn"][field] = "Updated location";
      }),
    );
  assert.doesNotThrow(
    edit(base, (i) => {
      i.venue = {
        latitude: 41,
        longitude: 69,
        mapUrl: "https://yandex.uz/maps",
      };
    }),
  );
  assert.doesNotThrow(
    edit(base, (i) => {
      i.startsAt = "2027-06-13T17:00";
    }),
  );
  assert.doesNotThrow(
    edit(base, (i) => {
      i.startsAt = "2027-06-14T19:00";
    }),
  );
  for (const field of [
    "message",
    "eventLabel",
    "greeting",
    "title",
    "personalGreeting",
  ] as const)
    assert.throws(
      edit(base, (i) => {
        i.content["uz-Latn"][field] = "Another event";
      }),
    );
  for (const date of [
    "2028-06-14T19:00",
    "2027-06-15T00:00",
    "2027-05-31T18:00",
    "garbage",
  ])
    assert.throws(
      edit(base, (i) => {
        i.startsAt = date;
      }),
      /EVENT_CHANGE/,
    );
  assert.throws(
    edit(base, (i) => {
      i.templateData = { "ivory-rose-card": { extra: "bypass" } };
    }),
    /STATIC_CONTENT/,
  );
});
test("moving static earlier and back never ratchets or extends approval", () => {
  const base = image();
  base.startsAt = "2027-06-12T18:00";
  assert.doesNotThrow(
    edit(base, (i) => {
      i.startsAt = "2027-06-14T19:00";
    }),
  );
  assert.throws(
    () =>
      assertCreatorCanEdit(
        base,
        { ...base, startsAt: "2027-06-15T18:00" },
        { ...state, editDeadlineAt: "2030-01-01T00:00:00Z" },
        now,
      ),
    /EVENT_CHANGE/,
  );
});
test("web permits practical updates and same-day start times", () => {
  const base = web();
  assert.doesNotThrow(
    edit(base, (i) => {
      i.startsAt = "2027-06-14T20:00";
      i.content["uz-Latn"].message = "Revised wording";
      i.artistLineup = [];
    }),
  );
  assert.throws(
    edit(base, (i) => {
      i.startsAt = "2027-06-13T18:00";
    }),
    /EVENT_CHANGE/,
  );
  assert.throws(
    edit(base, (i) => {
      i.timezone = "UTC";
    }),
    /EVENT_CHANGE/,
  );
});
test("identity, ages, languages, status and design cannot be forged", () => {
  const base = addLanguage(web(), "ru");
  for (const mutate of [
    (i: Invitation) => {
      i.content.ru.people[0] = "Another person";
    },
    (i: Invitation) => {
      i.content["uz-Latn"].hosts = "Another family";
    },
    (i: Invitation) => {
      i.celebrantAge = 20;
    },
    (i: Invitation) => {
      i.enabledLocales = ["uz-Latn"];
    },
    (i: Invitation) => {
      i.defaultLocale = "ru";
    },
    (i: Invitation) => {
      i.templateId = "suzani";
    },
    (i: Invitation) => {
      i.status = "draft";
    },
    (i: Invitation) => {
      i.id = "another";
    },
  ])
    assert.throws(edit(base, mutate));
});
test("all saves close at the deadline, including static drafts locked on export", () => {
  const base = image();
  assert.throws(
    () =>
      assertCreatorCanEdit(base, base, state, new Date(state.editDeadlineAt)),
    /DEADLINE/,
  );
  assert.throws(
    () =>
      assertCreatorCanEdit(
        base,
        base,
        { ...state, editDeadlineAt: "invalid" },
        now,
      ),
    /DEADLINE/,
  );
  assert.throws(
    () =>
      assertCreatorCanEdit(base, base, { ...state, editDeadlineAt: null }, now),
    /DEADLINE/,
  );
  assert.equal(
    editingClosed({ locked: false, deadlineAt: null, approvedEventDate: null }),
    false,
  );
});
test("secondary ceremony dates/enablement and source family identities are protected", () => {
  const base = web();
  base.templateId = "wedivo-pulau-sehati";
  base.templateData = {
    "wedivo-pulau-sehati": {
      coInviters: "Family",
      secondaryEvent: { enabled: true, date: "2027-06-16", time: "12:00" },
    },
  };
  assert.equal(lastCeremonyDate(base), "2027-06-16");
  assert.throws(
    edit(base, (i) => {
      (i.templateData["wedivo-pulau-sehati"] as any).secondaryEvent.date =
        "2028-01-01";
    }),
    /CEREMONY/,
  );
  assert.throws(
    edit(base, (i) => {
      (i.templateData["wedivo-pulau-sehati"] as any).coInviters =
        "Another family";
    }),
    /NAME/,
  );
  assert.doesNotThrow(
    edit(base, (i) => {
      (i.templateData["wedivo-pulau-sehati"] as any).secondaryEvent.time =
        "13:00";
    }),
  );
});
test("timezone day and canonical comparison are deterministic", () => {
  assert.equal(
    eventDay(new Date("2027-06-14T20:00:00Z"), "Asia/Tashkent"),
    "2027-06-15",
  );
  assert.equal(sameValue({ b: [1, 2], a: null }, { a: null, b: [1, 2] }), true);
  assert.equal(sameValue([1, 2], [2, 1]), false);
});
test("corrections are narrowly typed and preserve practical changes", () => {
  const base = image();
  const values = identityValues(base);
  values.locales["uz-Latn"]!.people[0] = "Corrected name";
  const input = changeRequestSchema.parse({
    type: "identity",
    values,
    reason: "Typo correction",
  });
  const next = applyChange(base, input);
  assert.equal(next.content["uz-Latn"].people[0], "Corrected name");
  assert.equal(next.startsAt, base.startsAt);
  assert.equal(next.imageExportedAt, base.imageExportedAt);
  assert.equal(
    changeRequestSchema.safeParse({ ...input, admin: true }).success,
    false,
  );
  assert.equal(
    changeRequestSchema.safeParse({
      ...input,
      values: { ...values, templateId: "suzani" },
    }).success,
    false,
  );
});
test("built-in music accepts its canonical and versioned paths but still verifies forged assets", async () => {
  const value = completeInvitation();
  const transaction = (() => Promise.resolve([])) as never;
  await assertPublicMedia(transaction, value, "owner");
  value.music.url = CATALOG_PREVIEW_MUSIC.url;
  value.music.enabled = true;
  await assertPublicMedia(transaction, value, "owner");
  value.music.assetId = "forged";
  await assert.rejects(
    assertPublicMedia(transaction, value, "owner"),
    /Musiqani/,
  );
});
test("editing timestamps use explicit timezone and stable Uzbek month names", () => {
  assert.equal(
    eventTimestamp("2027-06-14T19:00:00Z", "Asia/Tashkent"),
    "15-iyun 2027, 00:00",
  );
  assert.equal(
    eventTimestamp("2027-06-14T19:00:00Z", "UTC"),
    "14-iyun 2027, 19:00",
  );
});
