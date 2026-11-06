import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import vm from "node:vm";
import { createTemplatePreviewSample } from "../apps/web/src/modules/catalog/preview-sample";
import { makePeonyPayload } from "../apps/web/src/templates/wedivo-peony-paradise/adapter";

const root = process.cwd();
const folder = path.join(
  root,
  "apps/web/public/templates/wedivo-peony-paradise",
);
const read = (name: string) => readFileSync(path.join(folder, name), "utf8");
const sha = (value: Buffer | string) =>
  createHash("sha256").update(value).digest("hex");

test("Peony keeps its original capture untouched and packages all exact artwork/fonts", () => {
  const provenance = JSON.parse(read("provenance.json"));
  if (existsSync(path.join(root, provenance.capture)))
    assert.equal(
      sha(readFileSync(path.join(root, provenance.capture))),
      provenance.captureSha256,
    );
  assert.equal(provenance.assets.length, 33);
  assert.equal(provenance.openingArtwork.file, "preview.jpg");
  assert.equal(provenance.openingArtwork.width, 390);
  assert.equal(provenance.openingArtwork.height, 843);
  assert.equal(
    sha(readFileSync(path.join(folder, "preview.jpg"))),
    provenance.openingArtwork.sha256,
  );
  assert.equal(
    provenance.assets.filter((item: { file: string }) =>
      item.file.startsWith("fonts/"),
    ).length,
    14,
  );
  for (const asset of provenance.assets) {
    assert.equal(
      sha(readFileSync(path.join(folder, asset.file))),
      asset.sha256,
      asset.file,
    );
  }
  for (const font of ["Bodoni Moda", "Jost", "WindSong"])
    assert.ok(read("fonts.css").includes(font));
  assert.doesNotMatch(read("fonts.css") + read("template.css"), /https?:\/\//);
});

test("Peony ships the source opening, watercolor keying, motion and interaction engines without the provider runtime", () => {
  const html = read("index.html"),
    source = read("template-source.js");
  for (const id of [
    "cv-curtain-l",
    "cv-curtain-r",
    "cv-bloom",
    "gr-peony",
    "cp-stage",
    "an-peony",
    "sp-range",
    "cd-sec-arc",
    "dc-dyes",
    "gf-wrapbtn",
    "rs-vase",
    "nv-rail",
    "lb",
  ]) {
    assert.ok(html.includes(`id="${id}"`), id);
  }
  for (const method of [
    "function keyCanvas",
    "function makePeony",
    "function storyScrub",
    "function openCover",
    "function openViewer",
    "function dye",
    "function startAudio",
  ]) {
    assert.ok(source.includes(method), method);
  }
  assert.doesNotMatch(
    html + source,
    /wedivo-preview-stub|wedivo-parameters|sample-rundown-|prewedding\/|templateBridePhoto|templateGroomPhoto|uploads\/music|AIza|Aulia|Bagas|Laras|Bima|F3Qioc/,
  );
  assert.doesNotMatch(
    html + source,
    /https:\/\/(?:wedivo|dashboard\.wedivo|fonts\.google)/,
  );
  new vm.Script(source);
  new vm.Script(read("platform-adapter.js"));
  new vm.Script(read("i18n.js"));
});

test("Peony binds authored content, stable ordering and timezone without mutation or sample fallback", () => {
  const invitation = createTemplatePreviewSample("wedivo-peony-paradise");
  invitation.startsAt = "2027-06-12T17:00";
  invitation.timezone = "Asia/Tashkent";
  invitation.content.en.people = ["Creator One", "Creator Two"];
  invitation.content.en.personalGreeting = "Welcome, {name}";
  invitation.content.en.message = "Creator message";
  invitation.program = [
    { id: "stable-second", time: "19:00" },
    { id: "stable-first", time: "18:00" },
  ];
  invitation.content.en.programTitles = {
    "stable-second": "Second",
    "stable-first": "First",
  };
  invitation.content.en.programDescriptions = {
    "stable-second": "Creator description",
  };
  invitation.gallery = [
    {
      id: "photo-stable",
      url: "/creator/photo.jpg",
      alt: "Creator image",
      caption: "Creator caption",
    },
  ];
  invitation.story = [
    {
      id: "story-stable",
      title: { en: "Creator chapter" },
      text: { en: "Creator story" },
    },
  ];
  const before = JSON.stringify(invitation);
  const { payload } = makePeonyPayload(invitation, "en", {
    invitationId: "creator",
    guestName: "Guest",
    preview: false,
    sampleWishes: true,
  });
  assert.equal(payload.data.groom, "Creator One");
  assert.equal(payload.data.bride, "Creator Two");
  assert.equal(payload.data.greeting, "Welcome, Guest");
  assert.equal(payload.data.dateTime, "2027-06-12T12:00:00.000Z");
  assert.equal(payload.data.date.time, "17:00");
  assert.equal(payload.wallDate, "2027-06-12");
  assert.deepEqual(
    payload.data.program.map((item) => item.id),
    ["stable-second", "stable-first"],
  );
  assert.equal(payload.data.program[0].description, "Creator description");
  assert.equal(payload.data.gallery[0].id, "photo-stable");
  assert.equal(payload.data.story[0].id, "story-stable");
  assert.deepEqual(payload.data.wishes, []);
  assert.equal(JSON.stringify(invitation), before);
  invitation.content.en.people = [];
  invitation.content.en.message = "";
  invitation.gallery = [];
  const empty = makePeonyPayload(invitation, "en", { invitationId: "creator" })
    .payload.data;
  assert.equal(empty.bride, "");
  assert.equal(empty.groom, "");
  assert.equal(empty.message, "");
  assert.deepEqual(empty.gallery, []);
});

test("Peony localizes every supported language and only uses ephemeral preview wishes/music", () => {
  const context = {
    window: {} as { peonyCopy?: (locale: string) => Record<string, string> },
  };
  vm.runInNewContext(read("i18n.js"), context);
  const sample = createTemplatePreviewSample("wedivo-peony-paradise");
  const opens = new Set<string>();
  for (const locale of sample.enabledLocales) {
    const ui = context.window.peonyCopy!(locale);
    opens.add(ui.open);
    for (const [key, value] of Object.entries(ui))
      assert.ok(value.length > 0, locale + ":" + key);
    assert.ok(
      makePeonyPayload(sample, locale, {
        invitationId: "preview",
        preview: true,
        sampleWishes: true,
      }).payload.data.wishes.length > 0,
    );
    assert.equal(
      makePeonyPayload(sample, locale, {
        invitationId: "public",
        preview: false,
        sampleWishes: true,
      }).payload.data.wishes.length,
      0,
    );
    const silent = makePeonyPayload(sample, locale, {
      invitationId: "preview",
      preview: true,
      catalogMusic: true,
      silentPlayback: true,
    });
    assert.deepEqual(silent.payload.data.music, { enabled: false, url: "" });
  }
  assert.equal(opens.size, 4);
});

test("Gulbarglar sehri defaults to Uzbek and removes source-language runtime, browser-validation and file-picker copy", () => {
  const release = JSON.parse(read("release-status.json"));
  assert.equal(release.name, "Gulbarglar sehri");
  assert.equal(release.defaultLocale, "uz-Latn");
  assert.match(read("index.html"), /<title>Gulbarglar sehri<\/title>/);
  const context = {
    window: {} as { peonyCopy?: (locale?: string) => Record<string, string> },
  };
  vm.runInNewContext(read("i18n.js"), context);
  const copy = context.window.peonyCopy!();
  assert.equal(copy.templateName, "Gulbarglar sehri");
  assert.equal(copy.open, "Taklifnomani ochish");
  assert.equal(copy.chooseReceipt, "Fayl tanlash");
  assert.equal(copy.calendarFilename, "taklifnoma.ics");
  assert.equal(copy.requiredField, "Iltimos, bu maydonni to‘ldiring.");
  assert.doesNotMatch(
    read("template-source.js"),
    /Putar seratus musim|Lagi diputar|Putar sekali lagi|Gerak lambat|it\.title \|\| "Agenda"/,
  );
  const bridge = read("platform-adapter.js");
  assert.match(bridge, /setCustomValidity/);
  assert.match(bridge, /fileCaption\.textContent = .*ui\.chooseReceipt/);
  assert.match(bridge, /document\.title = d\.title \|\| ui\.templateName/);
  const renderer = readFileSync(
    path.join(
      root,
      "apps/web/src/templates/wedivo-peony-paradise/renderer.tsx",
    ),
    "utf8",
  );
  assert.match(renderer, /locale = "uz-Latn"/);
});

function serviceHarness(preview: boolean, ok = true, receipt = false) {
  type Handler = (event: { preventDefault: () => void }) => Promise<void>;
  const elements = new Map<string, any>();
  const requests: Array<{ url: string; body: any }> = [];
  const statuses: string[] = [];
  function el(id: string) {
    if (!elements.has(id)) {
      const classes = new Set<string>();
      elements.set(id, {
        value: id.endsWith("name")
          ? "QA Guest"
          : id === "ws-msg"
            ? "QA wish"
            : "QA note",
        disabled: false,
        hidden: false,
        dataset: {},
        listeners: {} as Record<string, Handler>,
        children: [] as any[],
        files: [{ size: 100, type: "image/png" }],
        classList: {
          add: (c: string) => classes.add(c),
          remove: (c: string) => classes.delete(c),
          contains: (c: string) => classes.has(c),
          toggle: (c: string, on: boolean) =>
            on ? classes.add(c) : classes.delete(c),
        },
        addEventListener(kind: string, handler: Handler) {
          this.listeners[kind] = handler;
        },
        setAttribute() {},
        removeAttribute() {},
        append(...children: any[]) {
          this.children.push(...children);
        },
        reset() {},
        replaceChildren() {},
        textContent: "",
      });
    }
    return elements.get(id);
  }
  const buttons = ["attending", "maybe", "not_attending"].map((value) => {
    const button = el(value);
    button.dataset.wedivoStatus = value;
    return button;
  });
  const source = read("platform-adapter.js");
  const services = source.slice(
    source.indexOf("  async function send("),
    source.indexOf("  function languages("),
  );
  const sample = createTemplatePreviewSample("wedivo-peony-paradise");
  const payload = makePeonyPayload(sample, "en", {
    invitationId: "public-id",
    guestToken: "guest-token",
    preview,
  }).payload;
  if (receipt) {
    payload.receiptUploadEnabled = true;
    payload.data.toyona.enabled = true;
    payload.data.toyona.cardNumber = "QA card";
  }
  class FormDataStub extends Map<string, any> {
    constructor(form: any) {
      super();
      const walk = (node: any) => {
        if (node.name)
          this.set(
            node.name,
            node.name === "file" ? node.files[0] : node.value,
          );
        node.children?.forEach(walk);
      };
      walk(form);
    }
  }
  let generated = 0;
  const context = {
    document: { querySelectorAll: () => buttons, body: { append() {} } },
    window: {},
    $: el,
    text: () => {},
    make: (tag: string, value: string) => {
      const node = el("generated-" + generated++);
      node.tagName = tag;
      node.textContent = value;
      return node;
    },
    status: (message: string) => statuses.push(message),
    Intl,
    Date,
    encodeURIComponent,
    JSON,
    FormData: FormDataStub,
    fetch: async (url: string, init: any) => {
      requests.push({
        url,
        body: init
          ? typeof init.body === "string"
            ? JSON.parse(init.body)
            : init.body
          : null,
      });
      return { ok, json: async () => ({ wishes: [] }) };
    },
  };
  vm.runInNewContext(services + ";this.services=services", context);
  (context as any).services(payload, {
    preview: "PREVIEW",
    validation: "VALIDATE",
    error: "ERROR",
    saved: "SAVED",
    pending: "PENDING",
    closed: "CLOSED",
    receiptDone: "RECEIPT SAVED",
    receiptFile: "RECEIPT FILE",
  });
  return {
    el,
    buttons,
    requests,
    statuses,
    async submit(id: string) {
      await el(id).listeners.submit({ preventDefault() {} });
    },
  };
}

test("Peony RSVP uses real endpoints, fixed headcounts, preview guards and accurate failure states", async () => {
  const preview = serviceHarness(true);
  await preview.submit("rs-form");
  await preview.submit("ws-form");
  assert.equal(preview.requests.length, 0);
  assert.deepEqual(preview.statuses, ["PREVIEW", "PREVIEW"]);
  for (const [answer, index, count] of [
    ["yes", 0, 1],
    ["maybe", 1, 0],
    ["no", 2, 0],
  ] as const) {
    const runtime = serviceHarness(false);
    await runtime.buttons[index].listeners.click({ preventDefault() {} });
    await runtime.submit("rs-form");
    const request = runtime.requests.find((item) => item.url.endsWith("/rsvp"));
    assert.ok(request);
    assert.equal(request.body.status, answer);
    assert.equal(request.body.partySize, count);
    assert.equal(request.body.guestToken, "guest-token");
    assert.equal(
      runtime.el("rs-form").classList.contains("is-submitted"),
      true,
    );
  }
  const failure = serviceHarness(false, false);
  await failure.buttons[0].listeners.click({ preventDefault() {} });
  await failure.submit("rs-form");
  assert.equal(failure.el("rs-form").classList.contains("is-submitted"), false);
  assert.ok(failure.statuses.includes("ERROR"));
  assert.ok(!failure.statuses.includes("SAVED"));
  const wishes = serviceHarness(false);
  await wishes.submit("ws-form");
  assert.ok(
    wishes.requests.some(
      (item) =>
        item.url.endsWith("/wishes") && item.body?.message === "QA wish",
    ),
  );
  assert.ok(wishes.statuses.includes("PENDING"));
});

test("Peony receipts never claim payment, skip previews, and tie the source gift knot only after API acceptance", async () => {
  for (const [preview, ok] of [
    [true, true],
    [false, false],
    [false, true],
  ]) {
    const runtime = serviceHarness(preview, ok, true);
    const form = runtime.el("gf-form").children[0];
    assert.ok(form);
    await form.listeners.submit({ preventDefault() {} });
    const request = runtime.requests.find((item) =>
      item.url.endsWith("/receipts"),
    );
    if (preview) assert.equal(request, undefined);
    else {
      assert.ok(request);
      assert.equal(request.body.get("guestToken"), "guest-token");
      assert.ok(request.body.get("file"));
    }
    assert.equal(
      runtime.el("gf-form").classList.contains("is-submitted"),
      !preview && ok,
    );
    const output = form.children.at(-1);
    assert.equal(
      output.textContent,
      preview ? "PREVIEW" : ok ? "RECEIPT SAVED" : "ERROR",
    );
  }
});
