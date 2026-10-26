import test from "node:test";
import assert from "node:assert/strict";
import type { SessionResponse } from "@taklifnoma/contracts";
import {
  loadClientSession,
  miniAppAdminDestination,
  telegramLaunchData,
} from "../apps/web/src/modules/session/client-session";

const admin = {
  id: "fixture-admin",
  telegramUserId: "123456789",
  displayName: "Admin",
  phoneShared: true,
  isAdmin: true,
};
const authenticated: SessionResponse = { user: admin, configured: true };
const anonymous: SessionResponse = { user: null, configured: true };

test("Mini App admin entry requires a verified server role and preserves personal/deep-link navigation", () => {
  for (const path of ["/", "/dashboard"]) {
    assert.equal(miniAppAdminDestination(path, "", admin), "/admin");
    assert.equal(miniAppAdminDestination(path, "", null), null);
    assert.equal(
      miniAppAdminDestination(path, "", { ...admin, isAdmin: false }),
      null,
    );
    assert.equal(
      miniAppAdminDestination(path, "", { ...admin, phoneShared: false }),
      null,
    );
    assert.equal(miniAppAdminDestination(path, "?mode=personal", admin), null);
  }
  for (const path of [
    "/admin",
    "/admin/verify",
    "/templates",
    "/studio",
    "/studio/fixture",
    "/i/Ab1234",
    "/dashboard/fixture/activity",
  ])
    assert.equal(miniAppAdminDestination(path, "", admin), null);
  assert.equal(
    miniAppAdminDestination(
      "/dashboard",
      "?next=https://attacker.example",
      admin,
    ),
    "/admin",
  );
});

test("Mini App entry always checks signed identity before using a browser session; ordinary browser access still reads its session", async () => {
  const original = globalThis.fetch,
    paths: string[] = [];
  let signedIn = true;
  globalThis.fetch = async (input) => {
    paths.push(String(input));
    return Response.json(signedIn ? authenticated : anonymous);
  };
  try {
    assert.equal(
      (await loadClientSession("existing-admin-launch")).user?.isAdmin,
      true,
    );
    assert.deepEqual(paths, [
      "/api/auth/telegram/mini-app",
      "/api/auth/session",
    ]);
    signedIn = false;
    assert.equal((await loadClientSession()).user, null);
    assert.equal(paths.length, 3);
  } finally {
    globalThis.fetch = original;
  }
});

test("concurrent Mini App bootstraps exchange a launch only once and use the resulting server session", async () => {
  const original = globalThis.fetch,
    calls: string[] = [];
  let signedIn = false;
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    calls.push(url);
    if (url === "/api/auth/session")
      return Response.json(signedIn ? authenticated : anonymous);
    assert.equal(init?.method, "POST");
    assert.deepEqual(JSON.parse(String(init?.body)), {
      initData: "single-use-launch",
    });
    signedIn = true;
    return Response.json({ user: { isAdmin: false } }); // The exchange payload never chooses the redirect role.
  };
  try {
    const first = loadClientSession("single-use-launch"),
      second = loadClientSession("single-use-launch");
    assert.equal(first, second);
    assert.equal((await first).user?.isAdmin, true);
    assert.deepEqual(calls, [
      "/api/auth/telegram/mini-app",
      "/api/auth/session",
    ]);
  } finally {
    globalThis.fetch = original;
  }
});

test("phone verification and blocked accounts never gain an admin redirect", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) =>
    String(input) === "/api/auth/session"
      ? Response.json(authenticated)
      : Response.json({ phoneRequired: true }, { status: 403 });
  try {
    assert.equal((await loadClientSession("phone-required-launch")).user, null);
  } finally {
    globalThis.fetch = original;
  }
});

test("replayed launch recovery requires an authenticated session, not a client role claim", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) =>
    String(input) === "/api/auth/session"
      ? Response.json(authenticated)
      : Response.json({ user: admin }, { status: 409 });
  try {
    assert.equal(
      (await loadClientSession("already-exchanged-launch")).user?.isAdmin,
      true,
    );
  } finally {
    globalThis.fetch = original;
  }
  globalThis.fetch = async (input) =>
    String(input) === "/api/auth/session"
      ? Response.json(anonymous)
      : Response.json({ user: admin }, { status: 409 });
  try {
    await assert.rejects(
      loadClientSession("replayed-without-session"),
      /Mini App/,
    );
  } finally {
    globalThis.fetch = original;
  }
});

test("failed session checks without launch data do not attempt a Telegram exchange", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return Response.json({}, { status: 503 });
  };
  try {
    await assert.rejects(loadClientSession());
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = original;
  }
});

test("signed launch payload can be recovered before the Telegram SDK loads, without trusting user metadata", () => {
  const raw = "user=%7B%22id%22%3A123%7D&auth_date=123&hash=opaque";
  assert.equal(
    telegramLaunchData(
      undefined,
      "#tgWebAppVersion=9.0&tgWebAppData=" + encodeURIComponent(raw),
    ),
    raw,
  );
  assert.equal(
    telegramLaunchData("sdk-proof", "#tgWebAppData=" + encodeURIComponent(raw)),
    "sdk-proof",
  );
  assert.equal(telegramLaunchData(undefined, "#templates"), "");
  assert.equal(telegramLaunchData(undefined, "#user=123&isAdmin=true"), "");
  assert.equal(
    telegramLaunchData(undefined, "#tgWebAppData=" + "a".repeat(16385)),
    "",
  );
});
