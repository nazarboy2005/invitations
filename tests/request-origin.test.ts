import test from "node:test";
import assert from "node:assert/strict";
import { allowedRequestOrigin } from "../apps/web/src/server/auth/request-origin";

test("development accepts loopback aliases only with matching protocol and port", () => {
  const configured = "http://127.0.0.1:3001";
  for (const origin of [
    configured,
    "http://localhost:3001",
    "http://[::1]:3001",
  ])
    assert.ok(allowedRequestOrigin(origin, configured, false));
  for (const origin of [
    null,
    "null",
    "http://localhost:3000",
    "https://localhost:3001",
    "http://localhost.evil:3001",
    "http://192.168.1.1:3001",
    "http://localhost:3001/path",
    "http://name@localhost:3001",
  ])
    assert.equal(allowedRequestOrigin(origin, configured, false), false);
});
test("production and non-local configurations retain exact origin checks", () => {
  assert.equal(
    allowedRequestOrigin(
      "http://localhost:3001",
      "http://127.0.0.1:3001",
      true,
    ),
    false,
  );
  assert.equal(
    allowedRequestOrigin("http://localhost:3001", "https://fotiha.uz", false),
    false,
  );
  assert.ok(
    allowedRequestOrigin("https://fotiha.uz", "https://fotiha.uz", true),
  );
  assert.equal(
    allowedRequestOrigin("https://evil.example", "https://fotiha.uz", true),
    false,
  );
});
