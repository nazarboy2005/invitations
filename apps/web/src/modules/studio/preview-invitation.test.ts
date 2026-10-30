import assert from "node:assert/strict";
import test from "node:test";
import { createInvitation, addLanguage } from "@taklifnoma/contracts";
import { publicationIssues } from "@taklifnoma/contracts/publication";
import { createStudioPreviewInvitation } from "./preview-invitation";

function draft() {
  const invitation = createInvitation("anor");
  invitation.eventType = "wedding";
  return invitation;
}

test("required placeholders fill independently while the saved draft stays incomplete", () => {
  const invitation = draft();
  const before = JSON.stringify(invitation);
  const preview = createStudioPreviewInvitation(invitation);
  assert.deepEqual(preview.content["uz-Latn"].people, ["Javohir", "Madina"]);
  assert.ok(preview.startsAt);
  assert.ok(preview.content["uz-Latn"].venueName);
  assert.ok(preview.content["uz-Latn"].address);
  assert.equal(
    publicationIssues(invitation).some((issue) => issue.path === "startsAt"),
    true,
  );
  assert.equal(JSON.stringify(invitation), before);
  invitation.content["uz-Latn"].people = ["Nodir", ""];
  const edited = createStudioPreviewInvitation(invitation);
  assert.deepEqual(edited.content["uz-Latn"].people, ["Nodir", "Madina"]);
  assert.equal(edited.startsAt, preview.startsAt);
  invitation.startsAt = "2027-04-12T19:30";
  assert.equal(
    createStudioPreviewInvitation(invitation).startsAt,
    invitation.startsAt,
  );
});

test("empty or disabled optional content never receives catalog defaults", () => {
  const invitation = draft();
  invitation.rsvp.enabled = false;
  invitation.wishes.enabled = false;
  const preview = createStudioPreviewInvitation(invitation);
  for (const key of [
    "program",
    "gallery",
    "story",
    "artistLineup",
    "gift",
    "music",
    "rsvp",
    "wishes",
    "dressCode",
    "contacts",
    "templateData",
  ] as const) {
    assert.deepEqual(preview[key], invitation[key], key);
  }
  assert.equal(preview.content["uz-Latn"].hosts, "");
  assert.equal(preview.content["uz-Latn"].greeting, "");
  assert.equal(preview.celebrantAge, null);
});

test("removing a program and clearing optional details remains removed", () => {
  const invitation = draft();
  invitation.program = [{ id: "ceremony", time: "18:30" }];
  invitation.content["uz-Latn"].programTitles.ceremony = "Marosim";
  assert.equal(createStudioPreviewInvitation(invitation).program.length, 1);
  invitation.program = [];
  invitation.contacts.phoneNumber = "";
  assert.deepEqual(createStudioPreviewInvitation(invitation).program, []);
  assert.equal(
    createStudioPreviewInvitation(invitation).contacts.phoneNumber,
    "",
  );
});

test("authored addresses and maps never link to the sample venue", () => {
  const invitation = draft();
  invitation.content["uz-Latn"].address = "Samarqand, Amir Temur ko‘chasi";
  let preview = createStudioPreviewInvitation(invitation);
  assert.equal(
    preview.content["uz-Latn"].address,
    invitation.content["uz-Latn"].address,
  );
  assert.deepEqual(preview.venue, invitation.venue);
  invitation.content["uz-Latn"].address = "";
  invitation.venue.mapUrl = "https://yandex.uz/maps/?text=Samarkand";
  preview = createStudioPreviewInvitation(invitation);
  assert.equal(preview.content["uz-Latn"].address, "");
  assert.deepEqual(preview.venue, invitation.venue);
});

test("each language gets localized required placeholders and preserves edits", () => {
  const invitation = addLanguage(draft(), "ru");
  invitation.content.ru.people = ["Нодир", ""];
  const preview = createStudioPreviewInvitation(invitation);
  assert.deepEqual(preview.content.ru.people, ["Нодир", "Мадина"]);
  assert.deepEqual(preview.content["uz-Latn"].people, ["Javohir", "Madina"]);
  assert.deepEqual(preview.enabledLocales, invitation.enabledLocales);
});

test("single-person events and published invitations retain their meaning", () => {
  const invitation = createInvitation("taklifla-asalari");
  invitation.eventType = "birthday";
  const preview = createStudioPreviewInvitation(invitation);
  assert.equal(preview.content["uz-Latn"].people.length, 1);
  assert.equal(preview.eventType, "birthday");
  assert.equal(preview.celebrantAge, null);
  invitation.status = "published";
  assert.equal(createStudioPreviewInvitation(invitation), invitation);
});
