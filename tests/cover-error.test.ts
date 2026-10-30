import test from "node:test";
import assert from "node:assert/strict";
import { ApiError } from "../apps/web/src/server/api";
import {
  coverFailure,
  coverFailureCode,
} from "../apps/web/src/server/cover-error";

test("cover failures distinguish deployment dependencies, binaries, libraries and rendering", () => {
  for (const [message, stage, expected] of [
    ["Cannot find package 'sharp'", "dependencies", "COVER_DEPENDENCY_MISSING"],
    [
      'The input directory "/var/task/bin" does not exist.',
      "browser",
      "COVER_BROWSER_MISSING",
    ],
    [
      "browserType.launch: Executable doesn't exist",
      "launch",
      "COVER_BROWSER_MISSING",
    ],
    [
      "error while loading shared libraries: libnss3.so",
      "launch",
      "COVER_BROWSER_LIBRARY",
    ],
    ["Invalid URL", "configuration", "COVER_CONFIGURATION"],
    [
      "require() cannot be used on an ESM graph",
      "dependencies",
      "COVER_DEPENDENCY_FAILED",
    ],
    [
      "Target page, context or browser has been closed",
      "fonts",
      "COVER_RENDER_TIMEOUT",
    ],
  ])
    assert.equal(coverFailureCode(new Error(message), stage), expected);
});

test("cover diagnostics omit call logs and URLs and preserve existing rate limits", () => {
  const messages: unknown[][] = [];
  const original = console.error;
  console.error = (...args: unknown[]) => {
    messages.push(args);
  };
  try {
    const response = coverFailure(
      new Error(
        "Failed loading https://example.com/?token=private\nCall log: PRIVATE INVITATION",
      ),
      "navigate",
    );
    assert.equal(response.status, 503);
    assert.equal(response.code, "COVER_RENDER_FAILED");
    const logged = JSON.stringify(messages);
    assert.ok(!logged.includes("token"));
    assert.ok(!logged.includes("PRIVATE INVITATION"));
    assert.ok(logged.includes('"stage":"navigate"'));
    const busy = new ApiError(429, "COVER_BUSY", "busy");
    assert.equal(coverFailure(busy, "browser"), busy);
    assert.equal(messages.length, 1);
  } finally {
    console.error = original;
  }
});
