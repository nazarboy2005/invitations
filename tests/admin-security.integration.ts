// Explicit opt-in: pnpm test:admin. Local HTTP server; isolated disposable rows.
// Does not call Telegram, change real users, or edit existing catalog entries.
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb, closeDb } from "../packages/database/src/index";
import { digest, randomToken } from "../apps/web/src/server/auth/crypto";
import { removeMedia } from "../apps/web/src/server/storage";

const db = getDb();
const origin = process.env.ADMIN_TEST_ORIGIN ?? process.env.APP_URL!;
const appOrigin = new URL(process.env.APP_URL!).origin;
const users = {
  admin: randomUUID(),
  creator: randomUUID(),
  otherAdmin: randomUUID(),
};
const tokens: Record<string, string> = {};
const categoryId = "admin-qa-" + randomUUID();
const authIds: string[] = [];
const cookieName =
  process.env.ADMIN_TEST_PRODUCTION === "1"
    ? "__Host-taklifnoma_session"
    : "taklifnoma_session";
const browserCookieName =
  process.env.ADMIN_TEST_PRODUCTION === "1"
    ? "__Host-taklifnoma_auth_browser"
    : "taklifnoma_auth_browser";
let assetId: string;
let trackId: string;

async function request(
  path: string,
  role?: string,
  body?: unknown,
  options: {
    method?: string;
    origin?: string | null;
    extra?: Record<string, string>;
    raw?: string;
  } = {},
) {
  return fetch(origin + path, {
    method:
      options.method ??
      (body === undefined && options.raw === undefined ? "GET" : "POST"),
    redirect: "manual",
    headers: {
      ...(options.origin === null
        ? {}
        : { Origin: options.origin ?? appOrigin }),
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(role ? { Cookie: `${cookieName}=${tokens[role]}` } : {}),
      ...options.extra,
    },
    ...(options.raw !== undefined
      ? { body: options.raw }
      : body === undefined
        ? {}
        : { body: JSON.stringify(body) }),
  });
}
async function code(
  response: Response,
  expected: number,
  expectedCode?: string,
) {
  assert.equal(response.status, expected);
  assert.match(response.headers.get("Cache-Control") ?? "", /no-store/);
  const body = await response.json();
  if (expectedCode) assert.equal(body.error?.code, expectedCode);
  return body;
}
async function session(
  name: string,
  userId: string,
  age = "0 hours",
  expiry = "1 day",
  revoked = false,
) {
  tokens[name] = randomToken();
  await db`INSERT INTO sessions(user_id,token_hash,created_at,expires_at,absolute_expires_at,revoked_at)
    VALUES(${userId},${digest(tokens[name])},now()-${age}::interval,now()+${expiry}::interval,now()+interval '2 days',${revoked ? new Date() : null})`;
}
before(async () => {
  assert.ok(
    ["localhost", "127.0.0.1"].includes(new URL(origin).hostname),
    "Admin tests must target a local app",
  );
  for (const [role, id] of Object.entries(users)) {
    await db`INSERT INTO users(id,telegram_user_id,display_name,phone_shared_at,is_admin)
      VALUES(${id},${-Math.floor(Math.random() * 1e12) - 1},${"Disposable admin QA " + role},now(),${role !== "creator"})`;
    await session(role, id);
  }
  await session("stale", users.admin, "13 hours");
  await session("expired", users.admin, "2 days", "-1 hour");
  await session("revoked", users.admin, "0 hours", "1 day", true);
  tokens.forged = randomToken();
  const current = await request("/api/auth/session", "admin");
  assert.equal(
    (await current.json()).user?.id,
    users.admin,
    "Local server must load the test environment",
  );
});
after(async () => {
  const ids = Object.values(users);
  const assets =
    await db`SELECT object_key FROM media_assets WHERE owner_id=ANY(${db.array(ids)}::uuid[])`;
  for (const asset of assets)
    if (asset.object_key.startsWith("local/"))
      await removeMedia(asset.object_key);
  await db.begin(async (tx) => {
    await tx`DELETE FROM catalog_music_tracks WHERE asset_id IN (SELECT id FROM media_assets WHERE owner_id=ANY(${tx.array(ids)}::uuid[]))`;
    await tx`DELETE FROM media_assets WHERE owner_id=ANY(${tx.array(ids)}::uuid[])`;
    await tx`DELETE FROM admin_audit_log WHERE actor_id=ANY(${tx.array(ids)}::uuid[])`;
    await tx`DELETE FROM template_categories WHERE id=${categoryId}`;
    await tx`DELETE FROM auth_requests WHERE user_id=ANY(${tx.array(ids)}::uuid[]) OR id=ANY(${tx.array(authIds)}::uuid[])`;
    await tx`DELETE FROM rate_limits WHERE key=ANY(${tx.array(ids.map((id) => "admin-write:" + id))}::text[])`;
    await tx`DELETE FROM sessions WHERE user_id=ANY(${tx.array(ids)}::uuid[])`;
    await tx`DELETE FROM users WHERE id=ANY(${tx.array(ids)}::uuid[])`;
  });
  await closeDb();
});

test("admin HTML and RSC never render controls for anonymous, forged, revoked, expired or creator sessions", async () => {
  for (const role of [undefined, "forged", "revoked", "expired", "creator"]) {
    for (const path of [
      "/admin",
      "/admin?view=music",
      "/admin?view=activity",
      "/admin/verify",
    ]) {
      const response = await request(path, role);
      assert.equal(response.status, 404, `${role}: ${path}`);
      assert.match(response.headers.get("Cache-Control") ?? "", /no-store/);
      const html = await response.text();
      assert.ok(
        !html.includes("Dizaynlar ro‘yxati") &&
          !html.includes("Musiqa qo‘shish") &&
          !html.includes("Disposable admin QA"),
      );
    }
  }
  let rsc = await request("/admin", "creator", undefined, {
    extra: { RSC: "1" },
  });
  // Next validates the RSC cache key and may normalize it before page rendering.
  if (rsc.status === 307) {
    const destination = new URL(rsc.headers.get("Location")!, origin);
    assert.equal(destination.origin, origin);
    rsc = await request(
      destination.pathname + destination.search,
      "creator",
      undefined,
      { extra: { RSC: "1" } },
    );
  }
  // RSC is a streaming transport: Next can carry a 404 interrupt in a 200 stream.
  assert.ok([200, 404].includes(rsc.status));
  const payload = await rsc.text();
  assert.match(payload, /NEXT_HTTP_ERROR_FALLBACK;404/);
  assert.ok(
    !payload.includes("AdminTemplates") &&
      !payload.includes("Disposable admin QA"),
  );
});
test("admin pages carry strict script nonces, deny framing and do not cache", async () => {
  const response = await request("/admin", "admin");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("X-Frame-Options"), "DENY");
  assert.equal(response.headers.get("Referrer-Policy"), "no-referrer");
  const policy = response.headers.get("Content-Security-Policy")!;
  assert.match(policy, /script-src [^;]*'nonce-([^']+)' 'strict-dynamic'/);
  assert.match(policy, /frame-ancestors 'none'/);
  const nonce = policy.match(/'nonce-([^']+)'/)![1];
  assert.ok((await response.text()).includes(`nonce="${nonce}"`));
  const second = await request("/admin", "admin");
  assert.ok(!second.headers.get("Content-Security-Policy")!.includes(nonce));
});
test("all admin reads and writes enforce live roles before parsing body or resource identifiers", async () => {
  const endpoints = [
    ["/api/admin/templates", "GET"],
    ["/api/admin/categories", "GET"],
    ["/api/admin/music", "GET"],
    ["/api/admin/templates/not-a-template", "PATCH"],
    ["/api/admin/categories/not-a-category", "PATCH"],
    ["/api/admin/music/not-a-uuid", "PATCH"],
    ["/api/admin/categories", "POST"],
    ["/api/admin/music", "POST"],
    ["/api/admin/reauth", "POST"],
  ];
  for (const [path, method] of endpoints) {
    await code(
      await request(path, undefined, undefined, { method }),
      401,
      "LOGIN_REQUIRED",
    );
    await code(
      await request(path, "creator", undefined, { method }),
      403,
      "FORBIDDEN",
    );
  }
  await db`UPDATE users SET is_admin=false WHERE id=${users.otherAdmin}`;
  await code(
    await request("/api/admin/templates", "otherAdmin"),
    403,
    "FORBIDDEN",
  );
  await db`UPDATE users SET is_admin=true WHERE id=${users.otherAdmin}`;
  await code(await request("/api/admin/templates", "otherAdmin"), 200);
});
test("stale admin sessions redirect to verification and creator-session renewal cannot restore admin access", async () => {
  const page = await request("/admin", "stale");
  assert.equal(page.status, 307);
  assert.equal(page.headers.get("Location"), "/admin/verify");
  assert.equal((await request("/admin/verify", "stale")).status, 200);
  await code(
    await request("/api/admin/templates", "stale"),
    401,
    "ADMIN_REAUTH_REQUIRED",
  );
  await request("/api/auth/session", "stale");
  await code(
    await request("/api/admin/categories", "stale", {}),
    401,
    "ADMIN_REAUTH_REQUIRED",
  );
});
test("cross-origin, absent-origin and cross-site mutations fail before any write", async () => {
  for (const invalidOrigin of [
    null,
    "null",
    "https://attacker.test",
    "http://localhost:3001.evil.test",
  ]) {
    await code(
      await request(
        "/api/admin/categories",
        "admin",
        { id: categoryId, name: "QA" },
        { origin: invalidOrigin },
      ),
      403,
      "INVALID_ORIGIN",
    );
  }
  await code(
    await request(
      "/api/admin/categories",
      "admin",
      {},
      { extra: { "Sec-Fetch-Site": "cross-site" } },
    ),
    403,
    "INVALID_ORIGIN",
  );
  assert.equal(
    (await db`SELECT id FROM template_categories WHERE id=${categoryId}`)
      .length,
    0,
  );
});
test("category writes validate shape and atomically retain attributable before/after history", async () => {
  await code(
    await request("/api/admin/categories", "admin", {
      id: categoryId,
      name: "QA",
      isAdmin: true,
    }),
    400,
    "INVALID_INPUT",
  );
  await code(
    await request("/api/admin/categories", "admin", undefined, {
      raw: "{broken",
    }),
    400,
    "INVALID_JSON",
  );
  await code(
    await request("/api/admin/categories", "admin", {
      id: categoryId,
      name: "QA",
      padding: "x".repeat(6000),
    }),
    413,
    "TOO_LARGE",
  );
  await code(
    await request("/api/admin/categories", "admin", {
      id: categoryId,
      name: "Before",
    }),
    201,
  );
  await code(
    await request(
      `/api/admin/categories/${categoryId}`,
      "admin",
      { name: "After", position: 9 },
      { method: "PATCH" },
    ),
    200,
  );
  await code(
    await request("/api/admin/categories", "admin", {
      id: categoryId,
      name: "Duplicate",
    }),
    409,
    "CATEGORY_EXISTS",
  );
  const audit =
    await db`SELECT actor_id,action,previous_values,new_values FROM admin_audit_log WHERE target_id=${categoryId} ORDER BY created_at`;
  assert.equal(audit.length, 2);
  assert.equal(audit[0].actor_id, users.admin);
  assert.equal(audit[0].action, "category.create");
  assert.equal(audit[1].previous_values.name, "Before");
  assert.equal(audit[1].new_values.name, "After");
  assert.equal(audit[1].new_values.position, 9);
});
test("catalog audio protects prepare, byte upload and completion, then records library changes", async () => {
  const body = {
    filename: "admin-qa.wav",
    size: 44,
    contentType: "audio/wav",
    kind: "audio",
    catalog: true,
  };
  await code(await request("/api/uploads", "creator", body), 403, "FORBIDDEN");
  await code(
    await request("/api/uploads", "stale", body),
    401,
    "ADMIN_REAUTH_REQUIRED",
  );
  await code(
    await request("/api/uploads", "admin", { ...body, draftId: randomUUID() }),
    400,
    "INVALID_INPUT",
  );
  const result = await code(await request("/api/uploads", "admin", body), 201);
  assetId = result.upload.id;
  await code(
    await request(`/api/uploads/${assetId}/complete`, "stale", undefined, {
      method: "POST",
    }),
    401,
    "ADMIN_REAUTH_REQUIRED",
  );
  if (result.upload.url.startsWith("/")) {
    await code(
      await request(result.upload.url, "stale", undefined, {
        method: "PUT",
        raw: "invalid",
      }),
      401,
      "ADMIN_REAUTH_REQUIRED",
    );
    const bytes = Buffer.alloc(44);
    bytes.write("RIFF", 0);
    bytes.writeUInt32LE(36, 4);
    bytes.write("WAVEfmt ", 8);
    bytes.writeUInt32LE(16, 16);
    bytes.writeUInt16LE(1, 20);
    bytes.writeUInt16LE(1, 22);
    bytes.writeUInt32LE(8000, 24);
    bytes.writeUInt32LE(16000, 28);
    bytes.writeUInt16LE(2, 32);
    bytes.writeUInt16LE(16, 34);
    bytes.write("data", 36);
    const uploaded = await fetch(origin + result.upload.url, {
      method: "PUT",
      headers: {
        Cookie: `${cookieName}=${tokens.admin}`,
        Origin: appOrigin,
        ...result.upload.headers,
      },
      body: bytes,
    });
    assert.equal(uploaded.status, 204);
    await code(
      await request(`/api/uploads/${assetId}/complete`, "admin", undefined, {
        method: "POST",
      }),
      200,
    );
    const created = await code(
      await request("/api/admin/music", "admin", {
        assetId,
        title: "Disposable QA track",
      }),
      201,
    );
    trackId = created.track.id;
    await code(
      await request("/api/admin/music", "admin", {
        assetId,
        title: "Duplicate",
      }),
      409,
      "MUSIC_EXISTS",
    );
    await code(
      await request(
        `/api/admin/music/${trackId}`,
        "admin",
        { active: false },
        { method: "PATCH" },
      ),
      200,
    );
    const audit =
      await db`SELECT action,new_values FROM admin_audit_log WHERE target_id=${trackId} ORDER BY created_at`;
    assert.equal(audit.length, 2);
    assert.equal(audit[1].new_values.active, false);
  }
});
test("reauthentication is browser-bound, same-identity, single-use and rotates the session", async () => {
  const browserToken = randomToken();
  const cookie = `${cookieName}=${tokens.stale}; ${browserCookieName}=${browserToken}`;
  async function confirmation(
    userId: string,
    browserHash: string,
    state = "confirmed",
    expires = "5 minutes",
  ) {
    const [row] =
      await db`INSERT INTO auth_requests(token_hash,browser_hash,user_id,state,confirmed_at,expires_at)
      VALUES(${digest(randomToken())},${browserHash},${userId},${state},now(),now()+${expires}::interval) RETURNING id`;
    authIds.push(row.id);
    return row.id;
  }
  async function exchange(requestId: string) {
    return request(
      "/api/admin/reauth",
      undefined,
      { requestId },
      { extra: { Cookie: cookie } },
    );
  }
  await code(
    await exchange(await confirmation(users.admin, digest(randomToken()))),
    409,
    "LOGIN_NOT_READY",
  );
  await code(
    await exchange(
      await confirmation(
        users.admin,
        digest(browserToken),
        "confirmed",
        "-1 minute",
      ),
    ),
    409,
    "LOGIN_NOT_READY",
  );
  await code(
    await exchange(await confirmation(users.creator, digest(browserToken))),
    403,
    "IDENTITY_MISMATCH",
  );
  const id = await confirmation(users.admin, digest(browserToken));
  const response = await exchange(id);
  await code(response, 200);
  const setCookie = response.headers.get("Set-Cookie")!;
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=lax/i);
  const newCookie = setCookie.split(";")[0];
  assert.ok(!newCookie.includes(tokens.stale));
  await code(
    await request("/api/admin/templates", "stale"),
    401,
    "LOGIN_REQUIRED",
  );
  await code(
    await request("/api/admin/templates", undefined, undefined, {
      extra: { Cookie: newCookie },
    }),
    200,
  );
  await code(
    await request(
      "/api/admin/reauth",
      undefined,
      { requestId: id },
      {
        extra: { Cookie: `${newCookie}; ${browserCookieName}=${browserToken}` },
      },
    ),
    409,
    "LOGIN_NOT_READY",
  );
});
test("admin write limit is durable and atomic across concurrent requests", async () => {
  await db`DELETE FROM rate_limits WHERE key=${"admin-write:" + users.otherAdmin}`;
  const results = await Promise.all(
    Array.from({ length: 33 }, () =>
      request("/api/admin/categories", "otherAdmin", {}),
    ),
  );
  assert.equal(
    results.filter((response) => response.status === 400).length,
    30,
  );
  const rejected = results.filter((response) => response.status === 429);
  assert.equal(rejected.length, 3);
  for (const response of rejected) {
    assert.equal(response.headers.get("Retry-After"), "60");
    await code(response, 429, "RATE_LIMITED");
  }
});
