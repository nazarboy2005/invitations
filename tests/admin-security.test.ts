import test from "node:test";
import assert from "node:assert/strict";
import {
  assertAdminSession,
  ADMIN_AUTH_MAX_AGE_MS,
} from "../apps/web/src/server/admin-policy";
import { ApiError, apiError } from "../apps/web/src/server/api";
import { verifySameOrigin } from "../apps/web/src/server/auth";
import { proxy } from "../apps/web/src/proxy";

const now = Date.parse("2026-10-27T12:00:00Z");
const admin = {
  is_admin: true,
  authenticated_at: new Date(now - 1000).toISOString(),
};
function rejectsCode(action: () => unknown, code: string) {
  assert.throws(
    action,
    (error: unknown) => error instanceof ApiError && error.code === code,
  );
}
test("administration requires a verified server role, not truthy client metadata", () => {
  rejectsCode(() => assertAdminSession(null, true, now), "LOGIN_REQUIRED");
  for (const is_admin of [false, undefined, "true", 1])
    rejectsCode(
      () => assertAdminSession({ ...admin, is_admin }, true, now),
      "FORBIDDEN",
    );
  assert.equal(assertAdminSession(admin, true, now), admin);
});
test("admin access expires at twelve hours regardless of creator session renewal", () => {
  for (const authenticated_at of [
    undefined,
    "invalid",
    new Date(now + 1).toISOString(),
    new Date(now - ADMIN_AUTH_MAX_AGE_MS).toISOString(),
    new Date(now - ADMIN_AUTH_MAX_AGE_MS - 1).toISOString(),
  ])
    rejectsCode(
      () =>
        assertAdminSession(
          {
            ...admin,
            authenticated_at,
            last_seen_at: new Date(now),
            expires_at: new Date(now + 86400000),
          },
          true,
          now,
        ),
      "ADMIN_REAUTH_REQUIRED",
    );
  assert.ok(
    assertAdminSession(
      {
        ...admin,
        authenticated_at: new Date(
          now - ADMIN_AUTH_MAX_AGE_MS + 1,
        ).toISOString(),
      },
      true,
      now,
    ),
  );
});
test("reauth entry permits stale admins but never grants role elevation", () => {
  assert.ok(assertAdminSession({ is_admin: true }, false, now));
  rejectsCode(
    () => assertAdminSession({ is_admin: false }, false, now),
    "FORBIDDEN",
  );
  rejectsCode(() => assertAdminSession(null, false, now), "LOGIN_REQUIRED");
});
test("same-origin validation rejects missing, null, sibling and attacker origins", () => {
  const previous = process.env.APP_URL;
  process.env.APP_URL = "https://visol.example";
  try {
    for (const origin of [
      undefined,
      "null",
      "https://evil.example",
      "https://sub.visol.example",
      "http://visol.example",
      "https://visol.example.evil.test",
    ]) {
      assert.throws(
        () =>
          verifySameOrigin(
            new Request("https://visol.example/api/admin/categories", {
              method: "POST",
              headers: origin ? { Origin: origin } : {},
            }),
          ),
        /origin/i,
      );
    }
    assert.doesNotThrow(() =>
      verifySameOrigin(
        new Request("https://visol.example/api/admin/categories", {
          method: "POST",
          headers: { Origin: "https://visol.example" },
        }),
      ),
    );
  } finally {
    if (previous === undefined) delete process.env.APP_URL;
    else process.env.APP_URL = previous;
  }
});
test("private failure responses cannot be cached and hide unexpected backend details", async () => {
  const response = apiError(
    new ApiError(403, "FORBIDDEN", "Administrator huquqi kerak."),
  );
  assert.equal(response.status, 403);
  assert.match(response.headers.get("Cache-Control")!, /private.*no-store/);
  assert.deepEqual(await response.json(), {
    error: { code: "FORBIDDEN", message: "Administrator huquqi kerak." },
  });
  const previousLogger = console.error;
  const logged: unknown[][] = [];
  let unexpected: Response;
  try {
    console.error = (...args) => {
      logged.push(args);
    };
    unexpected = apiError(new Error("private-backend-detail"));
  } finally {
    console.error = previousLogger;
  }
  assert.equal(unexpected.status, 503);
  assert.doesNotMatch(
    JSON.stringify(await unexpected.json()),
    /private-backend-detail/,
  );
  assert.doesNotMatch(JSON.stringify(logged), /private-backend-detail/);
});
test("production admin policy uses unpredictable nonces, overwrites supplied policies and forbids inline/eval scripts", () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  try {
    const request = new Request("https://visol.example/admin", {
      headers: {
        "x-nonce": "attacker",
        "Content-Security-Policy": "script-src * 'unsafe-inline'",
      },
    });
    const response = proxy(request as Parameters<typeof proxy>[0]);
    const csp = response.headers.get("Content-Security-Policy")!;
    const scripts = csp
      .split(";")
      .find((part) => part.trim().startsWith("script-src"))!;
    assert.match(scripts, /'nonce-[A-Za-z0-9+/=]{44}' 'strict-dynamic'/);
    assert.doesNotMatch(scripts, /unsafe-inline|unsafe-eval|attacker/);
    assert.notEqual(
      csp,
      proxy(request as Parameters<typeof proxy>[0]).headers.get(
        "Content-Security-Policy",
      ),
    );
    assert.equal(
      response.headers.get("x-middleware-request-content-security-policy"),
      csp,
    );
    assert.equal(response.headers.get("X-Frame-Options"), "DENY");
    assert.match(response.headers.get("Cache-Control")!, /private.*no-store/);
    assert.equal(response.headers.get("Referrer-Policy"), "no-referrer");
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});
