import test from "node:test";
import assert from "node:assert/strict";
import { verifyTurnstile } from "../apps/web/src/server/turnstile";
import { ApiError } from "../apps/web/src/server/api";

test("Turnstile fails closed and binds tokens to the action and frontend hostname", async (t) => {
  const originalFetch = globalThis.fetch;
  const before = {
    secret: process.env.TURNSTILE_SECRET,
    hosts: process.env.TURNSTILE_HOSTNAMES,
    mode: process.env.NODE_ENV,
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries({
      TURNSTILE_SECRET: before.secret,
      TURNSTILE_HOSTNAMES: before.hosts,
      NODE_ENV: before.mode,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  process.env.TURNSTILE_SECRET = "test-only-secret";
  process.env.TURNSTILE_HOSTNAMES = "fotiha.uz";
  const request = (token?: string) =>
    new Request("https://fotiha.uz/api/public/invitations/test/wishes", {
      method: "POST",
      headers: token ? { "cf-turnstile-response": token } : {},
    });
  const forbidden = (error: unknown) =>
    error instanceof ApiError && error.status === 403;
  let calls = 0;
  let response: unknown = {
    success: true,
    action: "guest_wish",
    hostname: "fotiha.uz",
  };
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.equal(
      url,
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    );
    assert.equal(options?.method, "POST");
    assert.equal(
      new URLSearchParams(String(options?.body)).get("secret"),
      "test-only-secret",
    );
    assert.equal(options?.cache, "no-store");
    return Response.json(response);
  };
  await assert.rejects(verifyTurnstile(request(), "guest_wish"), forbidden);
  await assert.rejects(
    verifyTurnstile(request("x".repeat(2049)), "guest_wish"),
    forbidden,
  );
  assert.equal(calls, 0);
  await verifyTurnstile(request("fresh-token"), "guest_wish");
  for (const invalid of [
    null,
    {},
    { success: "true", action: "guest_wish", hostname: "fotiha.uz" },
    { success: true, action: "guest_rsvp", hostname: "fotiha.uz" },
    { success: true, action: "guest_wish", hostname: "evil.fotiha.uz" },
    { success: false, "error-codes": ["timeout-or-duplicate"] },
  ]) {
    response = invalid;
    await assert.rejects(
      verifyTurnstile(request("used-or-invalid-token"), "guest_wish"),
      forbidden,
    );
  }
  globalThis.fetch = async () => {
    throw new Error("timeout");
  };
  await assert.rejects(
    verifyTurnstile(request("token"), "guest_wish"),
    forbidden,
  );
  globalThis.fetch = async () =>
    new Response("upstream failure", { status: 503 });
  await assert.rejects(
    verifyTurnstile(request("token"), "guest_wish"),
    forbidden,
  );
  delete process.env.TURNSTILE_HOSTNAMES;
  await assert.rejects(
    verifyTurnstile(request("token"), "guest_wish"),
    (error: unknown) => error instanceof ApiError && error.status === 503,
  );
  process.env.NODE_ENV = "production";
  process.env.TURNSTILE_HOSTNAMES = "fotiha.uz,localhost";
  await assert.rejects(
    verifyTurnstile(request("token"), "guest_wish"),
    (error: unknown) => error instanceof ApiError && error.status === 503,
  );
});
