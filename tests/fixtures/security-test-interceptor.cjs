// Only preload in the isolated loopback security test server. No Telegram calls
// leave that process; production code has no CAPTCHA/test bypass.
if (
  process.env.FOTIHA_SECURITY_TEST_SERVER !== "1" ||
  process.env.APP_URL !== "http://127.0.0.1:3024" ||
  process.env.TURNSTILE_SECRET !== "disposable-security-test-secret"
)
  throw new Error(
    "Security test interceptor requires its isolated loopback configuration",
  );
const original = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = input instanceof Request ? input.url : String(input);
  if (new URL(url).hostname === "api.telegram.org")
    return Response.json({ ok: true, result: { message_id: 1 } });
  if (url === "https://challenges.cloudflare.com/turnstile/v0/siteverify") {
    const token = new URLSearchParams(String(init?.body)).get("response") || "";
    return Response.json({
      success: token.startsWith("security-fixture:"),
      hostname: "127.0.0.1",
      action: token.slice("security-fixture:".length),
    });
  }
  return original(input, init);
};
