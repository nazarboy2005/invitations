import { readFile, stat } from "node:fs/promises";
import { readFile as readCanonicalText } from "./helpers/source-files";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { test } from "node:test";
import { templateById } from "../packages/contracts/src/index";

const root = new URL(
  "../apps/web/public/templates/jasmine-white/",
  import.meta.url,
);
const archive = process.env.CHORLOVE_SOURCE_ROOT
  ? new URL(
      `file:///${process.env.CHORLOVE_SOURCE_ROOT.replace(/\\/g, "/").replace(/^\//, "")}/`,
    )
  : new URL(
      "../Invitations - this folder will be removed from production/Chorlove/Web invitations/",
      import.meta.url,
    );

test("Jasmine White is published for wedding events", () => {
  const template = templateById("jasmine-white");
  assert.ok(template);
  assert.equal(template.published, true);
  assert.deepEqual(template.categoryIds, ["wedding"]);
  assert.deepEqual(template.supportedEventTypes, ["wedding"]);
});

test("Jasmine White preserves its captured page, stylesheets, and design artwork", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("source-assets.provenance.json", root), "utf8"),
  );
  const previewManifest = JSON.parse(
    await readFile(new URL("preview.provenance.json", root), "utf8"),
  );
  const preview = await readFile(new URL(previewManifest.artwork.file, root));
  assert.equal(preview.length, previewManifest.artwork.bytes);
  assert.equal(
    createHash("sha256").update(preview).digest("hex"),
    previewManifest.artwork.sha256,
  );
  assert.equal(previewManifest.artwork.dimensions, "432x768");
  assert.equal(
    previewManifest.catalogImage,
    "/templates/jasmine-white/preview.png",
  );
  const source = await readFile(new URL("source/preview-frame.html", root));
  const sourceArchiveRoot = new URL(
    "templates/jasmine-white/preview-frame.html",
    archive,
  );
  const archiveAvailable = await stat(archive).then(
    () => true,
    () => false,
  );
  if (archiveAvailable) {
    const original = await readCanonicalText(sourceArchiveRoot);
    assert.deepEqual(source, original);
  }
  assert.equal(source.length, manifest.source.bytes);
  assert.equal(
    createHash("sha256").update(source).digest("hex"),
    manifest.source.sha256,
  );
  assert.match(
    source.toString("utf8"),
    /class="text-\[18px\] mb-5 flex flex-col items-center"/,
  );

  for (const record of [
    ...manifest.capturedStylesheets,
    ...manifest.copiedDesignAssets,
  ]) {
    const bytes = await readFile(new URL(record.file, root));
    if (archiveAvailable) {
      assert.deepEqual(
        bytes,
        await readCanonicalText(new URL(record.archiveFile, archive)),
        record.file,
      );
    }
    assert.equal(bytes.length, record.bytes, record.file);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      record.sha256,
      record.file,
    );
  }

  assert.equal(manifest.capturedStylesheets.length, 2);
  assert.equal(manifest.copiedDesignAssets.length, 14);
  assert.equal(manifest.recoveredSourceAssets.length, 3);
  assert.equal(manifest.runtimeFontAssets.length, 34);
  for (const record of manifest.runtimeFontAssets) {
    const bytes = await readFile(new URL(record.file, root));
    assert.equal(bytes.length, record.bytes, record.file);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      record.sha256,
      record.file,
    );
  }
  const fontCss = await readFile(new URL("styles/fonts.css", root), "utf8");
  const fontUrls = [...fontCss.matchAll(/url\(([^)]+)\)/g)].map((match) =>
    match[1].replace(/^['"]|['"]$/g, ""),
  );
  assert.ok(fontUrls.length > 0);
  for (const url of fontUrls) {
    assert.match(url, /^\/templates\/jasmine-white\/assets\/fonts\//);
    await readFile(new URL(url.replace("/templates/jasmine-white/", ""), root));
  }

  const runtimeHtml = await readFile(new URL("index.html", root), "utf8");
  const sourceHtml = await readFile(
    new URL("source/preview-frame.html", root),
    "utf8",
  );
  const bridge = await readFile(new URL("bridge.js", root), "utf8");
  const adapterCss = await readFile(new URL("adapter.css", root), "utf8");
  const renderer = await readFile(
    new URL("../apps/web/src/templates/chorlove/renderer.tsx", import.meta.url),
    "utf8",
  );
  const optionalSections = await readFile(
    new URL(
      "../apps/web/public/templates/shared/editor-sections.js",
      import.meta.url,
    ),
    "utf8",
  );
  const phoneContactPosition = sourceHtml.indexOf('href="tel:+998903747483"');
  const telegramContactPosition = sourceHtml.indexOf('href="https://t.me/chorlove_uz"');
  const instagramContactPosition = sourceHtml.indexOf('>Instagram</p>');
  assert.ok(phoneContactPosition >= 0 && phoneContactPosition < telegramContactPosition);
  assert.ok(telegramContactPosition < instagramContactPosition);
  if (archiveAvailable) {
    const sourceMotion = await readFile(
      new URL("_next/static/chunks/0ziyt946s2g41.js", archive),
      "utf8",
    );
    assert.equal(
      Buffer.byteLength(sourceMotion, "utf8"),
      manifest.sourceMotion.bytes,
    );
    assert.equal(
      createHash("sha256").update(sourceMotion).digest("hex"),
      manifest.sourceMotion.sha256.toLowerCase(),
    );
    assert.match(sourceMotion, /scale:\[1,2,0\]/);
    assert.match(sourceMotion, /opacity:\[0,\.85,\.85,0\]/);
    assert.match(sourceMotion, /duration:\.85,ease:"easeOut"/);
    assert.match(
      sourceMotion,
      /transition:\{duration:\.8,ease:\[\.22,1,\.36,1\]\}/,
    );
    assert.match(sourceMotion, /duration:3\.2,ease:"easeInOut"/);
    assert.equal((bridge.match(/left: "[\d.]+%"/g) || []).length, 12);
    const sourcePetals = sourceMotion.match(
      /let d=(\[[\s\S]*?\]),m=\(\{data:e,isOpening/,
    );
    const packagedPetals = bridge.match(
      /const sourcePetals = \[([\s\S]*?)\n  \];/,
    );
    assert.ok(sourcePetals, "source falling-petal table is present");
    assert.ok(packagedPetals, "packaged falling-petal table is present");
    const petalPattern =
      /\{\s*left:\s*"([^"]+)",\s*color:\s*"([^"]+)",\s*size:\s*"([^"]+)",\s*sway:\s*(-?[\d.]+),\s*duration:\s*([\d.]+),\s*delay:\s*([\d.]+),?\s*\}/g;
    const readPetals = (table: string) =>
      [...table.matchAll(petalPattern)].map((match) => ({
        left: match[1],
        color: match[2],
        size: Number.parseFloat(match[3]),
        sway: Number(match[4]),
        duration: Number(match[5]),
        delay: Number(match[6]),
      }));
    assert.deepEqual(
      readPetals(sourcePetals[1]),
      readPetals(packagedPetals[1]),
    );
    assert.match(sourceMotion, /initial:\{y:"-10vh",opacity:0\}/);
    assert.match(
      sourceMotion,
      /y:\["-10vh","110vh"\],x:\[0,e\.sway,0\],opacity:\[0,\.85,\.85,0\],rotate:\[0,360\]/,
    );
    assert.match(
      sourceMotion,
      /x:\{duration:e\.duration\/2,repeat:1\/0,repeatType:"reverse",ease:"easeInOut"\}/,
    );
    assert.match(
      sourceMotion,
      /rotate:\{duration:1\.2\*e\.duration,repeat:1\/0,ease:"linear",delay:e\.delay\}/,
    );
  } else {
    assert.match(manifest.sourceMotion.sha256, /^[a-f0-9]{64}$/i);
    assert.equal(manifest.sourceMotion.bytes, 60835);
  }
  assert.match(
    bridge,
    /\{ scale: 1, easing: "ease-out" \},\s*\{ scale: 2, offset: 0\.5, easing: "ease-out" \},\s*\{ scale: 0 \}/,
  );
  assert.match(
    bridge,
    /\{ opacity: 0\.85, offset: 1 \/ 3, easing: "linear" \},\s*\{ opacity: 0\.85, offset: 2 \/ 3, easing: "linear" \}/,
  );
  assert.match(
    bridge,
    /duration: petal\.duration \* 1000,\s*delay: petal\.delay \* 1000,\s*iterations: Infinity,\s*easing: "ease-in-out"/,
  );
  assert.match(
    bridge,
    /const opacity = Number\.parseFloat\(getComputedStyle\(petal\)\.opacity\)/,
  );
  assert.match(
    bridge,
    /petal\.animate\([\s\S]{0,180}\{ opacity: Number\.isFinite\(opacity\) \? opacity : 0 \},\s*\{ opacity: 0 \}/,
  );
  assert.match(runtimeHtml, /source\/styles\/0\.u3j0~_2ygfx\.css/);
  assert.match(runtimeHtml, /source\/styles\/00sc_9lpb3zcn\.css/);
  assert.match(runtimeHtml, /src="\/templates\/jasmine-white\/bridge\.js"/);
  assert.doesNotMatch(runtimeHtml, /<script[^>]+src="(?:https?:)?\/\/_next\//i);
  assert.match(bridge, /d\.eventType \|\| c\.event/);
  assert.match(bridge, /outer\.style\.opacity = "0"/);
  assert.match(bridge, /outer\.style\.translate = "0 -10vh"/);
  assert.match(bridge, /outer\.style\.top = "-30px"/);
  assert.match(bridge, /translate: "0 110vh"/);
  assert.match(
    bridge,
    /const photos = p\.preview \? gallery : gallery\.filter\(\(item\) => item\.src\)/,
  );
  assert.match(bridge, /hide\(node, !p\.preview && photos\.length === 0\)/);
  assert.match(bridge, /const previewPhoto = preview && venueImage \? venueImage : ""/);
  assert.match(bridge, /hide\(imageFrame, !previewPhoto\)/);
  assert.match(
    bridge,
    /duration: petal\.duration \* 500,\s*iterations: Infinity,\s*easing: "linear"/,
  );
  assert.match(
    bridge,
    /duration: petal\.duration \* 1200,\s*delay: petal\.delay \* 1000,\s*iterations: Infinity,\s*easing: "linear"/,
  );
  const petalCss = adapterCss.match(/\.jw-source-petal \{([^}]+)\}/)?.[1] || "";
  assert.doesNotMatch(petalCss, /z-index|line-height/);
  assert.match(
    bridge,
    /intro\.querySelector\("\.mb-5\.flex\.flex-col\.items-center span"\)/,
  );
  assert.doesNotMatch(bridge, /querySelector\("p:last-of-type"\)/);
  assert.match(bridge, /tx\(paragraphs\[3\], c\.time\)/);
  assert.match(bridge, /const dateLine = \[/);
  assert.match(bridge, /tx\(paragraphs\[4\], dateLine\.toLocaleUpperCase/);
  assert.match(
    bridge,
    /tx\(paragraphs\[6\], c\.hosts\); tx\(paragraphs\[7\], d\.hosts \|\| ""\)/,
  );
  assert.match(bridge, /partySize: answer \? 0 : 1/);
  assert.doesNotMatch(bridge, /partySize:\s*["']/);
  assert.doesNotMatch(bridge, /createElement\("select"\)/);
  assert.doesNotMatch(
    sourceHtml,
    /partySize|number of guests|mehmonlar soni|количество гостей/i,
  );
  assert.doesNotMatch(
    runtimeHtml,
    /name="partySize"|Mehmonlar soni|Number of guests|Количество гостей/i,
  );
  assert.doesNotMatch(sourceHtml, /Kiyinish uslubi|Dress code|Дресс-код/i);
  assert.doesNotMatch(runtimeHtml, /Kiyinish uslubi|Dress code|Дресс-код/i);
  assert.match(
    renderer,
    /templateId === "jasmine-white"[\s\S]{0,300}story: false,[\s\S]*dressCode: false,[\s\S]*extraPeople: false/,
  );
  assert.match(optionalSections, /current\.sectionPolicy\?\.story !== false/);
  assert.match(
    renderer,
    /if \(templateId === "jasmine-white" && preview && sampleWishes\)[\s\S]{0,180}mapped\.venueImage = venuePhoto/,
  );
  assert.match(bridge, /d\.music\?\.url/);
  assert.match(
    bridge,
    /src="\/templates\/jasmine-white\/assets\/glass_garden_green\.webp"/,
  );
  assert.match(bridge, /const values = \[\s*contacts\.find\(\(item\) => item\.type === "phone"\),\s*contacts\.find\(\(item\) => item\.type === "telegram"\),\s*contacts\.find\(\(item\) => item\.type === "instagram"\),\s*\];/);
  assert.match(bridge, /index === 0 \? c\.phone : index === 1 \? c\.telegram : c\.instagram/);
  assert.equal((bridge.match(/instagram: "Instagram"/g) || []).length, 4);
  assert.match(bridge, /links\.slice\(values\.length\)\.forEach\(\(link\) => hide\(link, true\)\)/);
  assert.match(adapterCss, /\.jw-status:empty\s*\{\s*display:\s*none;/);
  assert.match(bridge, /Таклифнома/);
  assert.doesNotMatch(bridge, /Ð|Ñ„|â€”/);

  for (const record of manifest.recoveredSourceAssets) {
    const bytes = await readFile(new URL(record.file, root));
    assert.equal(bytes.length, record.bytes, record.file);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      record.sha256,
      record.file,
    );
    assert.equal(record.statusCode, 200, record.file);
    assert.equal(record.mimeType, "image/webp", record.file);
    assert.match(
      record.sourceUrl,
      /^https:\/\/chorlove\.uz\/images\/green-garden\//,
    );
  }
  assert.deepEqual(
    await readFile(new URL("assets/dish.webp", root)),
    await readFile(new URL("../green-garden/assets/dish.webp", root)),
  );
  assert.equal(manifest.excludedRelatedTemplateAssets.length, 7);
});
