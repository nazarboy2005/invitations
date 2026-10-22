import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { templateById } from "@taklifnoma/contracts";

const templatesRoot = new URL("../apps/web/public/templates/", import.meta.url);
const migration = readFileSync(
  new URL(
    "../packages/database/migrations/0029_add_monogram_retro_kino_templates.sql",
    import.meta.url,
  ),
  "utf8",
);
const nextMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0030_add_suzani_orik_guli_paxta_sahro_fonusi.sql",
    import.meta.url,
  ),
  "utf8",
);
const nilufarMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0028_add_nilufar_template.sql",
    import.meta.url,
  ),
  "utf8",
);
const valsPublicationMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0075_publish_vals.sql",
    import.meta.url,
  ),
  "utf8",
);
const toscanaPublicationMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0076_publish_toscana.sql",
    import.meta.url,
  ),
  "utf8",
);
const qatlamPublicationMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0079_publish_qatlam.sql",
    import.meta.url,
  ),
  "utf8",
);
const muhrPublicationMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0077_publish_muhr.sql",
    import.meta.url,
  ),
  "utf8",
);
const doiraPublicationMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0078_publish_doira.sql",
    import.meta.url,
  ),
  "utf8",
);
const nextBatchMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0033_add_bulbul_kozgu_templates.sql",
    import.meta.url,
  ),
  "utf8",
);
const nextSourceBatchMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0036_add_qandil_parda_ganch.sql",
    import.meta.url,
  ),
  "utf8",
);
const kozguPublicationMigration = readFileSync(
  new URL("../packages/database/migrations/0050_publish_kozgu.sql", import.meta.url),
  "utf8",
);
const qandilPublicationMigration = readFileSync(
  new URL("../packages/database/migrations/0049_publish_qandil.sql", import.meta.url),
  "utf8",
);
const specialtyMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0038_add_lola_qiz_bazmi_shahzoda_chavandoz.sql",
    import.meta.url,
  ),
  "utf8",
);
const beshikMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0039_add_beshik_template.sql",
    import.meta.url,
  ),
  "utf8",
);
const shirinMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0040_add_shirin_bayram_template.sql",
    import.meta.url,
  ),
  "utf8",
);
const jubileeMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0041_add_yubiley_event_type.sql",
    import.meta.url,
  ),
  "utf8",
);
const birthdayTemplatesMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0042_add_marxaba_birthday_templates.sql",
    import.meta.url,
  ),
  "utf8",
);
const oltinKuzPublicationMigration = readFileSync(
  new URL("../packages/database/migrations/0066_publish_oltin_kuz.sql", import.meta.url),
  "utf8",
);
const shirinBayramPublicationMigration = readFileSync(
  new URL("../packages/database/migrations/0067_publish_shirin_bayram.sql", import.meta.url),
  "utf8",
);
const shirinBayramCompatibilityMigration = readFileSync(
  new URL("../packages/database/migrations/0068_shirin_bayram_birthday_only.sql", import.meta.url),
  "utf8",
);
const oltinYoshPublicationMigration = readFileSync(
  new URL("../packages/database/migrations/0069_publish_oltin_yosh.sql", import.meta.url),
  "utf8",
);
const nahorPublicationMigration = readFileSync(
  new URL("../packages/database/migrations/0070_publish_nahor.sql", import.meta.url),
  "utf8",
);
const nahorgiOshPublicationMigration = readFileSync(
  new URL("../packages/database/migrations/0071_publish_nahorgi_osh.sql", import.meta.url),
  "utf8",
);
const hilolPublicationMigration = readFileSync(
  new URL("../packages/database/migrations/0072_publish_hilol.sql", import.meta.url),
  "utf8",
);
const bitiruvPublicationMigration = readFileSync(
  new URL("../packages/database/migrations/0073_publish_bitiruv.sql", import.meta.url),
  "utf8",
);
const konfettiPublicationMigration = readFileSync(
  new URL("../packages/database/migrations/0065_publish_konfetti.sql", import.meta.url),
  "utf8",
);
const yangiUyMigration = readFileSync(
  new URL(
    "../packages/database/migrations/0048_add_yangi_uy_template.sql",
    import.meta.url,
  ),
  "utf8",
);
const dispatch = readFileSync(
  new URL("../apps/web/src/templates/marxaba/index.ts", import.meta.url),
  "utf8",
);

test("registered Marxaba designs reflect their release state and additive migrations", () => {
  const published = new Set([
    "nilufar",
    "monogram",
    "retro-kino",
    "suzani",
    "orik-guli",
    "paxta",
    "sahro-fonusi",
    "lola",
    "qiz-bazmi",
    "shahzoda",
    "chavandoz",
    "beshik",
    "konfetti",
    "oltin-kuz",
    "shirin-bayram",
    "oltin-yosh",
    "nahor",
    "nahorgi-osh",
    "hilol",
    "bitiruv",
    "bulbul",
    "parda",
    "kozgu",
    "qandil",
    "vals",
    "toscana",
    "muhr",
    "doira",
    "qatlam",
  ]);
  const migrationById: Record<string, string> = {
    nilufar: nilufarMigration,
    monogram: migration,
    "retro-kino": migration,
    suzani: nextMigration,
    "orik-guli": nextMigration,
    paxta: nextMigration,
    "sahro-fonusi": nextMigration,
    vals: valsPublicationMigration,
    toscana: toscanaPublicationMigration,
    muhr: muhrPublicationMigration,
    bulbul: nextBatchMigration,
    kozgu: kozguPublicationMigration,
    doira: doiraPublicationMigration,
    qandil: qandilPublicationMigration,
    parda: nextSourceBatchMigration,
    ganch: nextSourceBatchMigration,
    qatlam: qatlamPublicationMigration,
    lola: specialtyMigration,
    "qiz-bazmi": specialtyMigration,
    shahzoda: specialtyMigration,
    chavandoz: specialtyMigration,
    beshik: beshikMigration,
    "shirin-bayram": shirinBayramCompatibilityMigration,
    konfetti: konfettiPublicationMigration,
    "oltin-kuz": oltinKuzPublicationMigration,
    "oltin-yosh": oltinYoshPublicationMigration,
    nahor: nahorPublicationMigration,
    "nahorgi-osh": nahorgiOshPublicationMigration,
    hilol: hilolPublicationMigration,
    bitiruv: bitiruvPublicationMigration,
    "yangi-uy": yangiUyMigration,
  };
  for (const id of Object.keys(migrationById) as Array<
    keyof typeof migrationById
  >) {
    const definition = templateById(id);
    assert.ok(definition, `${id} is registered in the shared typed catalog`);
    assert.equal(
      definition.published,
      published.has(id),
      `${id} publication state must match its completed release`,
    );
    const expectedCategories: Record<string, string[]> = {
      lola: ["qiz-bazmi"],
      "qiz-bazmi": ["qiz-bazmi"],
      shahzoda: ["other"],
      chavandoz: ["other"],
      beshik: ["other"],
      "shirin-bayram": ["birthday"],
      konfetti: ["birthday"],
      "oltin-kuz": ["birthday"],
      "oltin-yosh": ["birthday"],
      nahor: ["osh"],
      "nahorgi-osh": ["osh"],
      hilol: ["iftorlik"],
      bitiruv: ["other"],
      "yangi-uy": ["yangi-uy"],
    };
    assert.deepEqual(
      definition.categoryIds,
      expectedCategories[id] ?? ["wedding"],
    );
    const expectedSupport: Record<string, string[]> = {
      nilufar: ["wedding", "fotiha"],
      monogram: ["wedding", "fotiha"],
      "retro-kino": ["wedding"],
      suzani: ["wedding", "fotiha"],
      "orik-guli": ["wedding", "fotiha", "qiz-uzatish"],
      paxta: ["wedding", "fotiha"],
      "sahro-fonusi": ["wedding", "fotiha"],
      vals: ["wedding", "fotiha"],
      toscana: ["wedding", "fotiha"],
      muhr: ["wedding", "fotiha", "qiz-uzatish"],
      bulbul: ["wedding", "fotiha", "qiz-uzatish"],
      kozgu: ["wedding", "qiz-bazmi", "fotiha"],
      doira: ["wedding", "sunnat-toyi"],
      qandil: ["wedding", "fotiha", "qiz-uzatish"],
      parda: ["wedding", "fotiha", "qiz-uzatish"],
      ganch: ["wedding", "fotiha", "qiz-bazmi"],
      qatlam: ["wedding", "qiz-bazmi", "fotiha"],
      lola: ["qiz-uzatish", "fotiha"],
      "qiz-bazmi": ["qiz-uzatish", "fotiha", "birthday"],
      shahzoda: ["sunnat-toyi"],
      chavandoz: ["sunnat-toyi", "birthday"],
      beshik: ["beshik-toyi", "birthday"],
      "shirin-bayram": ["birthday"],
      konfetti: ["birthday", "yubiley"],
      "oltin-kuz": ["yubiley", "birthday"],
      "oltin-yosh": ["yubiley", "birthday"],
      nahor: ["osh"],
      "nahorgi-osh": ["osh", "sunnat-toyi", "wedding"],
      hilol: ["iftorlik", "osh"],
      bitiruv: ["bitiruv", "birthday", "korporativ"],
      "yangi-uy": ["yangi-uy", "osh"],
    };
    assert.deepEqual(definition.supportedEventTypes, expectedSupport[id]);
    assert.ok(dispatch.includes(`"${id}"`), `${id} uses the shared renderer`);
    assert.ok(existsSync(new URL(`${id}/index.html`, templatesRoot)));
    assert.ok(existsSync(new URL(`${id}/template.css`, templatesRoot)));
    assert.ok(existsSync(new URL(`${id}/template.js`, templatesRoot)));
    assert.ok(
      migrationById[id].includes(`'${id}'`),
      `${id} has an additive DB registration`,
    );
  }

  assert.equal(
    templateById("monogram")?.previewImage,
    "/templates/monogram/preview.webp",
    "Monogram uses its source-rendered opening artwork",
  );
  assert.ok(existsSync(new URL("monogram/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("retro-kino/preview.webp", templatesRoot)));
  for (const id of [
    "nilufar",
    "retro-kino",
    "suzani",
    "orik-guli",
    "paxta",
    "sahro-fonusi",
    "vals",
    "toscana",
    "muhr",
    "bulbul",
    "parda",
    "kozgu",
    "doira",
    "qandil",
    "parda",
    "ganch",
    "qatlam",
    "lola",
    "qiz-bazmi",
    "shahzoda",
    "chavandoz",
    "beshik",
    "shirin-bayram",
    "konfetti",
    "oltin-kuz",
    "oltin-yosh",
    "nahor",
    "nahorgi-osh",
    "hilol",
    "yangi-uy",
  ])
    assert.ok(
      templateById(id)?.previewImage,
      `${id} has portrait catalog artwork`,
    );
  assert.ok(existsSync(new URL("toscana/art/aisle.webp", templatesRoot)));
  assert.ok(existsSync(new URL("muhr/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("bulbul/preview-browser-capture.jpg", templatesRoot)));
  assert.ok(existsSync(new URL("kozgu/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("doira/preview.png", templatesRoot)));
  assert.ok(existsSync(new URL("qandil/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("parda/preview-browser-capture.jpg", templatesRoot)));
  assert.ok(existsSync(new URL("ganch/preview-browser-capture.jpg", templatesRoot)));
  assert.ok(existsSync(new URL("qatlam/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("lola/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("qiz-bazmi/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("shahzoda/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("chavandoz/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("beshik/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("shirin-bayram/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("konfetti/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("oltin-kuz/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("oltin-yosh/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("nahor/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("nahorgi-osh/preview.webp", templatesRoot)));
  assert.ok(existsSync(new URL("hilol/preview.webp", templatesRoot)));
  assert.equal(
    templateById("yangi-uy")?.previewImage,
    "/templates/yangi-uy/preview-browser-capture.jpg",
  );
  assert.ok(existsSync(new URL("yangi-uy/preview-browser-capture.jpg", templatesRoot)));
  assert.equal(
    templateById("nahorgi-osh")?.previewImage,
    "/templates/nahorgi-osh/preview.webp",
  );
  const fixtureBytes = readFileSync(new URL("../apps/web/src/modules/catalog/preview-sample.json", import.meta.url));
  for (const id of ["bulbul", "parda", "ganch", "yangi-uy"]) {
    const definition = templateById(id);
    const image = readFileSync(new URL(`${id}/preview-browser-capture.jpg`, templatesRoot));
    const provenance = JSON.parse(readFileSync(new URL(`${id}/preview.provenance.json`, templatesRoot), "utf8"));
    assert.equal(definition?.previewImage, `/templates/${id}/preview-browser-capture.jpg`);
    assert.equal(definition?.published, id === "bulbul" || id === "parda", `${id} reflects its current release state`);
    assert.equal(provenance.status, "verified");
    assert.equal(provenance.route, `/preview?template=${id}&qaSilent=1`);
    assert.equal(provenance.fixtureSha256, createHash("sha256").update(fixtureBytes).digest("hex"));
    assert.equal(provenance.sha256, createHash("sha256").update(image).digest("hex"));
  }
  assert.match(jubileeMigration, /'yubiley'/);
});
