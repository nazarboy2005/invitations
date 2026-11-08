// Preload only in the isolated visitor-activity test server. No Telegram request leaves this process.
const fs = require("node:fs");
const path = require("node:path");
const original = globalThis.fetch;
const log = process.env.GUEST_TELEGRAM_TEST_LOG;
if (!log)
  throw new Error(
    "GUEST_TELEGRAM_TEST_LOG is required for the test interceptor",
  );
fs.mkdirSync(path.dirname(log), { recursive: true });
globalThis.fetch = async function (input, init) {
  const url = input instanceof Request ? input.url : String(input);
  if (new URL(url).hostname === "api.telegram.org") {
    fs.appendFileSync(
      log,
      JSON.stringify(JSON.parse(String(init?.body || "{}"))) + "\n",
    );
    return Response.json({ ok: true, result: { message_id: 101 } });
  }
  return original(input, init);
};
