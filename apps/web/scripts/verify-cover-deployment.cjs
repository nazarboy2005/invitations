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
// Browser rendering remains only for actual static invitation previews/exports.
for (const route of ["static-images/preview", "invitations/[id]/image"]) {
  const traceFile = path.join(
    dist,
    `server/app/api/${route}/route.js.nft.json`,
  );
  const trace = JSON.parse(fs.readFileSync(traceFile, "utf8"));
  const traced = new Set(
    trace.files.map((file) => path.resolve(path.dirname(traceFile), file)),
  );
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
}
const retiredTrace = JSON.parse(
  fs.readFileSync(
    path.join(dist, "server/app/api/invitation-covers/route.js.nft.json"),
    "utf8",
  ),
);
assert.ok(
  !retiredTrace.files.some((file) =>
    /playwright|sparticuz|invitation-cover\./.test(file),
  ),
  "Retired cover endpoint must not bundle a browser",
);
const receiptTraceFile = path.join(
  dist,
  "server/app/api/public/invitations/[id]/receipts/route.js.nft.json",
);
const receiptTrace = JSON.parse(fs.readFileSync(receiptTraceFile, "utf8"));
const receiptFiles = new Set(
  receiptTrace.files.map((file) =>
    path.resolve(path.dirname(receiptTraceFile), file),
  ),
);
const pdfRequire = require("node:module").createRequire(
  require.resolve("pdf-lib"),
);
for (const file of [
  path.join(appRoot, "src/server/pdf-receipt-worker.cjs"),
  require.resolve("pdf-lib"),
  ...["@pdf-lib/standard-fonts", "@pdf-lib/upng", "pako", "tslib"].map((name) =>
    pdfRequire.resolve(name),
  ),
])
  assert.ok(
    receiptFiles.has(file),
    `Receipt PDF worker deployment is missing ${path.relative(appRoot, file)}`,
  );
console.log(
  `Static invitation renderers and receipt PDF worker verified; retired cover route has no browser.`,
);
