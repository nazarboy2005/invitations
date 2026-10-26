import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import {
  isOwnContact,
  verifyInitData,
  verifyMiniAppLaunch,
  randomToken,
  digest,
} from "../apps/web/src/server/auth/crypto";
import { readJson } from "../apps/web/src/server/auth/index";

const bot = "12345:secret",
  now = 1800000000000;
function signed(fields: Record<string, string>) {
  const params = new URLSearchParams(fields);
  const secret = createHmac("sha256", "WebAppData").update(bot).digest();
  const data = Object.entries(fields)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");
  params.set("hash", createHmac("sha256", secret).update(data).digest("hex"));
  return params.toString();
}
const fields = {
  auth_date: String(now / 1000),
  query_id: "unique",
  user: JSON.stringify({ id: 123, first_name: "Nazar" }),
};
test("Mini App accepts signed fresh identity, rejects altered and expired identity", () => {
  assert.equal(verifyInitData(signed(fields), bot, now).id, 123);
  assert.throws(() =>
    verifyInitData(signed(fields).replace("unique", "attacker"), bot, now),
  );
  assert.throws(() => verifyInitData(signed(fields), bot, now + 300001));
  assert.throws(() =>
    verifyInitData(
      signed({ ...fields, auth_date: String(now / 1000 + 60) }),
      bot,
      now,
    ),
  );
});
test("Mini App rejects duplicate parameters and absent verified user", () => {
  assert.throws(() =>
    verifyInitData(signed(fields) + "&user=attacker", bot, now),
  );
  assert.throws(() =>
    verifyInitData(signed({ ...fields, user: "null" }), bot, now),
  );
});

test("older signed launch data is reusable only with its matching existing server session", () => {
  const raw = signed(fields),
    later = now + 600000;
  assert.equal(verifyMiniAppLaunch(raw, bot, later, "123").user.id, 123);
  assert.throws(() => verifyMiniAppLaunch(raw, bot, later));
  assert.throws(() => verifyMiniAppLaunch(raw, bot, later, "456"));
  assert.throws(() =>
    verifyMiniAppLaunch(raw.replace("unique", "altered"), bot, later, "123"),
  );
  assert.throws(() =>
    verifyMiniAppLaunch(
      signed({ ...fields, auth_date: String(now / 1000 + 60) }),
      bot,
      now,
      "123",
    ),
  );
});
test("Mini App replay identity survives parameter reordering and equivalent URL encodings", () => {
  const raw = signed({
    ...fields,
    user: JSON.stringify({ id: 123, first_name: "Nazar Ali" }),
  });
  const reordered = new URLSearchParams(
    [...new URLSearchParams(raw).entries()].reverse(),
  ).toString();
  const encodedVariant = reordered
    .replace(/\+/g, "%20")
    .replace(/%3A/gi, ":")
    .replace(/%7B/g, "%7b");
  assert.notEqual(raw, reordered);
  assert.notEqual(reordered, encodedVariant);
  const key = verifyMiniAppLaunch(raw, bot, now).replayKey;
  assert.equal(verifyMiniAppLaunch(reordered, bot, now).replayKey, key);
  assert.equal(verifyMiniAppLaunch(encodedVariant, bot, now).replayKey, key);
  assert.notEqual(
    verifyMiniAppLaunch(
      signed({ ...fields, query_id: "another-launch" }),
      bot,
      now,
    ).replayKey,
    key,
  );
  assert.throws(() =>
    verifyMiniAppLaunch(raw.replace("Nazar", "Attacker"), bot, now),
  );
});
test("Phone onboarding accepts only sender's own unforwarded contact", () => {
  assert.equal(
    isOwnContact(123, { user_id: 123, phone_number: "+998901234567" }),
    true,
  );
  assert.equal(
    isOwnContact(123, { user_id: 456, phone_number: "+998901234567" }),
    false,
  );
  assert.equal(isOwnContact(123, { phone_number: "+998901234567" }), false);
  assert.equal(
    isOwnContact(123, { user_id: 123, phone_number: "+998901234567" }, true),
    false,
  );
  assert.equal(
    isOwnContact(123, { user_id: 123, phone_number: "123----" }),
    false,
  );
  assert.equal(
    isOwnContact(123, { user_id: 123, phone_number: "+1234567890123456" }),
    false,
  );
  assert.equal(
    isOwnContact(123, { user_id: 123, phone_number: "+0001234567" }),
    false,
  );
});
test("Opaque login tokens fit Telegram start payload and store only fingerprints", () => {
  const a = randomToken(),
    b = randomToken();
  assert.notEqual(a, b);
  assert.match(a, /^[A-Za-z0-9_-]{43}$/);
  assert.ok(("auth_" + a).length <= 64);
  assert.notEqual(digest(a), a);
});
test("JSON reader stops oversized streams before consuming unbounded input", async () => {
  let pulls = 0,
    cancelled = false;
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      pulls++;
      controller.enqueue(new Uint8Array(4096));
    },
    cancel() {
      cancelled = true;
    },
  });
  const request = new Request("https://example.com", {
    method: "POST",
    body,
    duplex: "half",
  } as RequestInit);
  await assert.rejects(
    readJson(request),
    (error) => error instanceof Error && error.message === "Request too large",
  );
  assert.equal(cancelled, true);
  assert.ok(pulls <= 7);
});
test("JSON reader accepts objects and rejects arrays or malformed JSON", async () => {
  const request = (body: string) =>
    new Request("https://example.com", { method: "POST", body });
  assert.deepEqual(await readJson(request('{"requestId":"abc"}')), {
    requestId: "abc",
  });
  await assert.rejects(readJson(request("[]")));
  await assert.rejects(readJson(request("{bad")));
});
