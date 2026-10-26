import test from "node:test";
import assert from "node:assert/strict";
import {
  parseAdminTelegramIds,
  hasAdminRole,
} from "../apps/web/src/server/auth/admin-role";
import { assertAdminSession } from "../apps/web/src/server/admin-policy";
import { toSessionUser } from "../apps/web/src/server/auth";

function withIds(value: string, action: () => void) {
  const previous = process.env.PLATFORM_ADMIN_TELEGRAM_IDS;
  process.env.PLATFORM_ADMIN_TELEGRAM_IDS = value;
  try {
    action();
  } finally {
    if (previous === undefined) delete process.env.PLATFORM_ADMIN_TELEGRAM_IDS;
    else process.env.PLATFORM_ADMIN_TELEGRAM_IDS = previous;
  }
}
const account = {
  id: "fixture-user",
  telegram_user_id: "123456789",
  is_admin: false,
  disabled_at: null,
  phone_shared_at: new Date(),
  authenticated_at: new Date().toISOString(),
};

test("admin allowlist parses exact safe positive IDs and deduplicates separators", () => {
  assert.deepEqual(parseAdminTelegramIds(undefined), []);
  assert.deepEqual(parseAdminTelegramIds("  , \n "), []);
  assert.deepEqual(parseAdminTelegramIds("123456789, 987654321\n123456789"), [
    "123456789",
    "987654321",
  ]);
  assert.deepEqual(parseAdminTelegramIds("9007199254740991"), [
    "9007199254740991",
  ]);
  for (const value of [
    "@username",
    "-123",
    "0",
    "00123",
    "1.5",
    "1e6",
    "*",
    "9007199254740992",
    "123456789,invalid",
  ]) {
    assert.throws(
      () => parseAdminTelegramIds(value),
      /Invalid PLATFORM_ADMIN_TELEGRAM_IDS/,
    );
  }
});

test("allowlisted existing accounts receive admin access without persisting a role", () => {
  withIds("123456789", () => {
    assert.equal(hasAdminRole(account), true);
    assert.equal(toSessionUser(account).isAdmin, true);
    assert.equal(assertAdminSession(account), account);
    assert.equal(account.is_admin, false);
    for (const id of ["12345678", "1234567890", "987654321"]) {
      assert.equal(hasAdminRole({ ...account, telegram_user_id: id }), false);
    }
    assert.equal(
      hasAdminRole({ isAdmin: true, telegramUserId: "123456789" }),
      false,
    );
  });
});

test("removing an environment grant takes effect on the next role check", () => {
  withIds("123456789", () => {
    assert.equal(hasAdminRole(account), true);
    process.env.PLATFORM_ADMIN_TELEGRAM_IDS = "987654321";
    assert.equal(toSessionUser(account).isAdmin, false);
    assert.throws(() => assertAdminSession(account), { code: "FORBIDDEN" });
    process.env.PLATFORM_ADMIN_TELEGRAM_IDS = "";
    assert.equal(hasAdminRole(account), false);
    assert.equal(hasAdminRole({ ...account, is_admin: true }), true);
  });
});

test("allowlisted admins still require active accounts and fresh sessions", () => {
  withIds("123456789", () => {
    assert.equal(hasAdminRole({ ...account, disabled_at: new Date() }), false);
    assert.throws(
      () =>
        assertAdminSession({
          ...account,
          authenticated_at: new Date(Date.now() - 13 * 3600000).toISOString(),
        }),
      { code: "ADMIN_REAUTH_REQUIRED" },
    );
    assert.throws(() => assertAdminSession(null), { code: "LOGIN_REQUIRED" });
    assert.equal(
      hasAdminRole({ ...account, telegram_user_id: "other", is_admin: "true" }),
      false,
    );
  });
});

test("malformed allowlists fail closed without echoing configured identities", () => {
  withIds("123456789,typo", () => {
    for (const row of [account, { ...account, is_admin: true }])
      assert.throws(() => hasAdminRole(row), {
        message: "Invalid PLATFORM_ADMIN_TELEGRAM_IDS configuration",
      });
  });
});
