import test from "node:test";
import assert from "node:assert/strict";
import {
  publicationCoverSignature,
  verifyPublicationCover,
} from "../apps/web/src/server/cover-publication-auth";

test("publication capture requests bind the invitation, expiration and server secret", () => {
  const previous = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = "synthetic publication cover signing secret";
  try {
    const now = Date.now();
    const signature = publicationCoverSignature("invitation-one", now + 60000);
    assert.ok(verifyPublicationCover("invitation-one", signature, now));
    assert.ok(!verifyPublicationCover("invitation-two", signature, now));
    assert.ok(
      !verifyPublicationCover("invitation-one", signature, now + 60001),
    );
    assert.ok(!verifyPublicationCover("invitation-one", signature + "x", now));
    assert.ok(
      !verifyPublicationCover(
        "invitation-one",
        publicationCoverSignature("invitation-one", now + 180000),
        now,
      ),
    );
    process.env.SESSION_SECRET = "different publication cover signing secret";
    assert.ok(!verifyPublicationCover("invitation-one", signature, now));
  } finally {
    if (previous === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = previous;
  }
});
