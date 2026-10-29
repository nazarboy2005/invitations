import test from "node:test";
import assert from "node:assert/strict";
import { createInvitation, addLanguage } from "../packages/contracts/src/index";
import { publicationIssues } from "../packages/contracts/src/publication";
import {
  generatePublicCode,
  publicInvitationUrl,
} from "../apps/web/src/server/publication";
import { completeInvitation } from "./fixtures/publication";
test("public codes have exactly six Base62 characters and cover the whole alphabet", () => {
  const codes = Array.from({ length: 3000 }, generatePublicCode);
  for (const code of codes) assert.match(code, /^[0-9A-Za-z]{6}$/);
  assert.equal(new Set(codes.join("")).size, 62);
  assert.ok(new Set(codes).size > 2990);
});
test("publication requires authored names, real local date/time, text and venue", () => {
  assert.equal(publicationIssues(completeInvitation()).length, 0);
  const empty = createInvitation();
  const issues = publicationIssues(empty);
  for (const field of [
    "templateId",
    "startsAt",
    "content.uz-Latn.people",
    "content.uz-Latn.venueName",
    "content.uz-Latn.address",
  ])
    assert.ok(
      issues.some((issue) => issue.path === field),
      field,
    );
  for (const date of [
    "2027-02-30T18:00",
    "2027-01-01T24:00",
    "2027-06-14",
    "bad",
    "2027-06-14T18:00Z",
  ])
    assert.ok(
      publicationIssues({ ...completeInvitation(), startsAt: date }).some(
        (issue) => issue.path === "startsAt",
      ),
      date,
    );
  assert.ok(
    publicationIssues({ ...completeInvitation(), timezone: "Mars/Test" }).some(
      (issue) => issue.path === "timezone",
    ),
  );
});
test("every enabled language is validated and errors identify its editor step", () => {
  const invitation = addLanguage(completeInvitation(), "ru");
  const issues = publicationIssues(invitation);
  assert.ok(
    issues.some((issue) => issue.locale === "ru" && issue.section === 1),
  );
  assert.ok(
    issues.some((issue) => issue.locale === "ru" && issue.section === 2),
  );
  invitation.content.ru = { ...invitation.content["uz-Latn"] };
  assert.deepEqual(publicationIssues(invitation), []);
});
test("single-person events, map locations and optional sections do not require dummy data", () => {
  const invitation = completeInvitation();
  invitation.eventType = "birthday";
  invitation.content["uz-Latn"].people = ["Birthday test"];
  invitation.content["uz-Latn"].address = "";
  invitation.venue.latitude = 41.3;
  invitation.venue.longitude = 69.2;
  assert.deepEqual(publicationIssues(invitation), []);
  invitation.gift.enabled = true;
  assert.ok(
    publicationIssues(invitation).some((issue) => issue.path === "gift"),
  );
});
test("changing the configured origin preserves the case-sensitive public path", () => {
  const previous = process.env.APP_URL;
  try {
    process.env.APP_URL = "http://127.0.0.1:3001";
    assert.equal(
      publicInvitationUrl("aB3xY9"),
      "http://127.0.0.1:3001/i/aB3xY9",
    );
    process.env.APP_URL = "https://example.test";
    assert.equal(
      publicInvitationUrl("aB3xY9"),
      "https://example.test/i/aB3xY9",
    );
  } finally {
    if (previous) process.env.APP_URL = previous;
    else delete process.env.APP_URL;
  }
});

test("enabled optional inputs must be usable before publishing, and disabled inputs are optional", () => {
  const cases: Array<
    [string, (invitation: ReturnType<typeof completeInvitation>) => void]
  > = [
    [
      "contacts.phoneNumber",
      (i) => {
        i.contacts.phoneNumber = "abc";
      },
    ],
    [
      "contacts.telegramUsername",
      (i) => {
        i.contacts.telegramUsername = "https://t.me/demo";
      },
    ],
    [
      "venue.mapUrl",
      (i) => {
        i.venue.mapUrl = "/not-a-map";
      },
    ],
    [
      "venue",
      (i) => {
        i.venue.latitude = 41.3;
      },
    ],
    [
      "rsvp.deadline",
      (i) => {
        i.rsvp.enabled = true;
        i.rsvp.deadline = "2027-02-30";
      },
    ],
    [
      "gift.cardNumber",
      (i) => {
        i.gift.enabled = true;
        i.gift.cardNumber = "abc";
        i.gift.cardHolder = "Owner";
      },
    ],
    [
      "program.0.time",
      (i) => {
        i.program = [{ id: "entry", time: "25:10" }];
        i.content["uz-Latn"].programTitles.entry = "Arrival";
      },
    ],
    [
      "content.uz-Latn.programTitles.entry",
      (i) => {
        i.program = [{ id: "entry", time: "18:00" }];
      },
    ],
  ];
  for (const [field, change] of cases) {
    const invitation = completeInvitation();
    change(invitation);
    assert.ok(
      publicationIssues(invitation).some((issue) => issue.path === field),
      field,
    );
  }
  const good = completeInvitation();
  good.contacts.phoneNumber = "+998 90 123 45 67";
  good.contacts.telegramUsername = "@test_owner";
  good.gift = {
    enabled: true,
    receiptUploadEnabled: true,
    cardNumber: "8600 1111 2222 3333",
    cardHolder: "Owner",
  };
  good.program = [{ id: "arrival", time: "18:00" }];
  good.content["uz-Latn"].programTitles.arrival = "Arrival";
  assert.deepEqual(publicationIssues(good), []);
});
