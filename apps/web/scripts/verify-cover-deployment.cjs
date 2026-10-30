const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// Check the actual deployment trace, not the developer's installed dependencies.
// A local Next server can hide missing assets by reading the original node_modules.
const appRoot = path.resolve(__dirname, "..");
const dist = path.resolve(
  appRoot,
  process.env.TAKLIFNOMA_BUILD_DIST_DIR || ".next",
);
const traceFile = path.join(
  dist,
  "server/app/api/invitation-covers/route.js.nft.json",
);
const trace = JSON.parse(fs.readFileSync(traceFile, "utf8"));
const traced = new Set(
  trace.files.map((file) => path.resolve(path.dirname(traceFile), file)),
);
const playwrightRoot = path.dirname(
  require.resolve("playwright-core/package.json"),
);
const chromiumRoot = path.resolve(
  path.dirname(require.resolve("@sparticuz/chromium")),
  "..",
);

const required = [
  ...[
    "browsers.json",
    "package.json",
    "index.js",
    "index.mjs",
    "lib/coreBundle.js",
    "lib/utilsBundle.js",
  ].map((file) => path.join(playwrightRoot, file)),
  ...fs
    .readdirSync(path.join(chromiumRoot, "bin"))
    .filter((file) => file.endsWith(".br"))
    .map((file) => path.join(chromiumRoot, "bin", file)),
];
for (const file of required) {
  assert.ok(
    traced.has(file),
    `Cover deployment is missing ${path.relative(appRoot, file)}`,
  );
  assert.ok(
    fs.statSync(file).size > 0,
    `Cover runtime asset is empty: ${file}`,
  );
}
assert.ok(
  !trace.files.some((file) => /[/\\]public[/\\]templates[/\\]/.test(file)),
  "Cover function must load public template assets over HTTP, not bundle them",
);
console.log(
  `Cover deployment verified: ${required.length} required Playwright/Chromium runtime assets included.`,
);
