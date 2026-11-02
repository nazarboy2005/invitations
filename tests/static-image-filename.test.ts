import test from "node:test";
import assert from "node:assert/strict";
import {
  invitationImageFilename,
  imageAttachmentHeader,
} from "../apps/web/src/modules/static-images/filename";
import { completeInvitation } from "./fixtures/publication";

test("image filename uses names in invitation order and preserves Unicode", () => {
  const invitation = completeInvitation();
  invitation.content["uz-Latn"].people = ["Javohir", "Madina"];
  assert.equal(
    invitationImageFilename(invitation, "uz-Latn"),
    "Javohir-Madina.png",
  );
  invitation.content["uz-Latn"].people = ["Ғайрат", "Go‘zal"];
  const filename = invitationImageFilename(invitation, "uz-Latn");
  assert.equal(filename, "Ғайрат-Go‘zal.png");
  const header = imageAttachmentHeader(filename);
  assert.ok(/^[\x20-\x7E]+$/.test(header));
  assert.equal(decodeURIComponent(header.split("UTF-8''")[1]), filename);
});

test("image filename is portable and cannot inject paths or response headers", () => {
  const invitation = completeInvitation();
  invitation.content["uz-Latn"].people = [
    "../Javohir\r\nX-Test: 1",
    'Madina/\\<>:"|?*',
  ];
  const filename = invitationImageFilename(invitation, "uz-Latn");
  assert.doesNotMatch(filename, /[\p{Cc}\p{Cf}<>:"/\\|?*]/u);
  assert.ok(!filename.startsWith("."));
  assert.doesNotMatch(imageAttachmentHeader(filename), /[\r\n]/);
  invitation.content["uz-Latn"].people = ["CON"];
  assert.equal(invitationImageFilename(invitation, "uz-Latn"), "_CON.png");
  invitation.content["uz-Latn"].people = ["", "..."];
  assert.equal(
    invitationImageFilename(invitation, "uz-Latn"),
    "taklifnoma.png",
  );
  invitation.content["uz-Latn"].people = ["A".repeat(200), "B".repeat(200)];
  assert.ok(invitationImageFilename(invitation, "uz-Latn").length <= 124);
});
