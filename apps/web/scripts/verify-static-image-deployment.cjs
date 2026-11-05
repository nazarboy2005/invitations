const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const dist = process.env.TAKLIFNOMA_BUILD_DIST_DIR || ".next";
for (const route of ["static-images/preview", "invitations/[id]/image"]) {
  const manifest = path.resolve(
    __dirname,
    "..",
    dist,
    "server/app/api",
    route,
    "route.js.nft.json",
  );
  const files = JSON.parse(fs.readFileSync(manifest, "utf8")).files;
  for (const suffix of [
    "src/templates/ivory-rose-card/assets/background.png",
    "src/templates/ivory-rose-card/assets/regular.ttf",
    "src/templates/ivory-rose-card/assets/italic.ttf",
    ...["lola-maktubi", "moviy-ravoq-card", "zarhal-oqshom-card"].flatMap(
      (id) => [
        `src/templates/${id}/assets/background.${id === "zarhal-oqshom-card" ? "svg" : "png"}`,
        `src/templates/${id}/assets/regular.ttf`,
        `src/templates/${id}/assets/italic.ttf`,
      ],
    ),
    ...["ivory-rose-card", "lola-maktubi"].flatMap((id) =>
      ["latin", "latin-ext", "cyrillic", "cyrillic-ext"].map(
        (subset) => `src/templates/${id}/assets/calligraphy-${subset}.woff2`,
      ),
    ),
    "src/templates/zarhal-oqshom-card/assets/display.ttf",
    "playwright-core/browsers.json",
    "@sparticuz/chromium/bin/chromium.br",
  ]) {
    const file = files.find((value) =>
      value.replaceAll("\\", "/").endsWith(suffix),
    );
    assert.ok(file, `${route}: missing traced ${suffix}`);
    assert.ok(
      fs.existsSync(path.resolve(path.dirname(manifest), file)),
      `${route}: missing runtime file ${suffix}`,
    );
  }
}
console.log(
  "Static image packaging verified: private artwork, both fonts and browser runtime in both routes.",
);
