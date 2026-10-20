import assert from "node:assert/strict";
import test from "node:test";
import { createInvitation } from "@taklifnoma/contracts";
import {
  createTemplatePreviewSample,
  hasAuthoredInvitationContent,
} from "./preview-sample";

test("template samples are illustrative complete invitations", () => {
  const sample = createTemplatePreviewSample("anor");
  assert.deepEqual(sample.content["uz-Latn"].people, ["Jasur", "Madina"]);
  assert.deepEqual(sample.enabledLocales, ["uz-Latn", "uz-Cyrl", "en", "ru"]);
  assert.equal(sample.content.en.people[0], "Jasur");
  assert.equal(sample.content.ru.greeting, "Ассалому алейкум, дорогой гость!");
  assert.equal(sample.content["uz-Cyrl"].eventLabel, "Никоҳ тўйи");
  assert.equal(sample.program.length, 4);
  assert.equal(sample.program[0].time, "16:00");
  assert.equal(
    sample.content["uz-Latn"].programTitles["sample-meal"],
    "Tabriklar va dasturxon",
  );
  assert.equal(hasAuthoredInvitationContent(sample), true);
});

test("sample objects are isolated so renderer changes cannot mutate the fixture", () => {
  const first = createTemplatePreviewSample("anor");
  first.content.en.people[0] = "Changed";
  first.program[0].time = "09:00";

  const second = createTemplatePreviewSample("another-template");
  assert.equal(second.content.en.people[0], "Jasur");
  assert.equal(second.program[0].time, "16:00");
});

test("only empty template-selection previews may fall back to sample content", () => {
  const blank = createInvitation("anor");
  assert.equal(hasAuthoredInvitationContent(blank), false);

  blank.eventType = "wedding";
  assert.equal(hasAuthoredInvitationContent(blank), true);

  const authored = createInvitation("anor");
  authored.content["uz-Latn"].people = ["Nazar"];
  assert.equal(hasAuthoredInvitationContent(authored), true);
});
