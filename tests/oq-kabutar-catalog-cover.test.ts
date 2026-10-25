import { readFileSync } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import test from "node:test";
import { TEMPLATES } from "@taklifnoma/contracts";

const packageRoot = new URL(
  "../apps/web/public/templates/oq-kabutar/",
  import.meta.url,
);
const read = (file: string) => readFileSync(new URL(file, packageRoot));
const sha256 = (bytes: Buffer) =>
  createHash("sha256").update(bytes).digest("hex");

test("Oq Kabutar catalog art is the fixture-rendered portrait opening", () => {
  const cover = read("preview-opening.png");
  const provenance = JSON.parse(
    read("preview.provenance.json").toString("utf8"),
  ) as {
    catalogCover: {
      file: string;
      sha256: string;
      width: number;
      height: number;
      aspectRatio: string;
      route: string;
      renderedFrom: string;
      sharedPreviewFixture: { file: string; sha256: string };
      sourceOpening: { file: string; sha256: string };
      captureExcludes: string[];
      browserPageErrors: string[];
    };
    supersededCatalogImage: { file: string; sha256: string; reason: string };
  };
  const catalogCover = provenance.catalogCover;
  const template = TEMPLATES.find((item) => item.id === "oq-kabutar");
  const imageDimensions = {
    width: cover.readUInt32BE(16),
    height: cover.readUInt32BE(20),
  };
  const fixture = readFileSync(
    new URL(
      "./fixtures/catalog-preview-2026-10-23.json",
      import.meta.url,
    ),
  );
  const sourceHtmlBytes = readFileSync(
    new URL(
      "../Invitations%20-%20this%20folder%20will%20be%20removed%20from%20production/Marxaba/Nikoh/templates/oq-kabutar/index.html",
      import.meta.url,
    ),
  );
  const sourceHtml = sourceHtmlBytes.toString("utf8");

  assert.equal(
    template?.previewImage,
    "/templates/oq-kabutar/preview-opening.png",
  );
  assert.equal(catalogCover.file, "preview-opening.png");
  assert.equal(sha256(cover), catalogCover.sha256);
  assert.deepEqual(imageDimensions, { width: 450, height: 800 });
  assert.equal(catalogCover.width, imageDimensions.width);
  assert.equal(catalogCover.height, imageDimensions.height);
  assert.equal(catalogCover.aspectRatio, "9:16");
  assert.equal(
    catalogCover.route,
    "/preview?template=oq-kabutar&qaSilent=1&qaReducedMotion=1",
  );
  assert.equal(sha256(fixture), catalogCover.sharedPreviewFixture.sha256);
  assert.equal(sha256(sourceHtmlBytes), catalogCover.sourceOpening.sha256);
  assert.match(catalogCover.renderedFrom, /closed Oq Kabutar intro/);
  assert.match(sourceHtml, /id="intro"[\s\S]*?class="cloud/);
  assert.match(sourceHtml, /class="ribbon"[\s\S]*?class="intro__copy"/);
  assert.match(sourceHtml, /class="intro__names"[\s\S]*?class="intro__date"/);
  assert.match(sourceHtml, /id="open-invitation"/);
  assert.deepEqual(catalogCover.captureExcludes, [
    ".mh-lang app language switcher",
    "nextjs-portal development badge",
  ]);
  assert.deepEqual(catalogCover.browserPageErrors, []);
  assert.equal(provenance.supersededCatalogImage.file, "preview.webp");
  assert.equal(
    sha256(read("preview.webp")),
    provenance.supersededCatalogImage.sha256,
  );
  assert.match(provenance.supersededCatalogImage.reason, /post-opening hero/);
});
