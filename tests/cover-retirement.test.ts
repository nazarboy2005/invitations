import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../apps/web/src/app/api/invitation-covers/route";
test("removed personalized cover generation returns 410 without configuration, parsing or rendering", async () => {
  const response = POST();
  assert.equal(response.status, 410);
  assert.equal((await response.json()).error.code, "COVER_GENERATION_REMOVED");
  assert.equal(response.headers.get("cache-control"), "no-store");
});
