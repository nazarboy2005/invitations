/* Optional DOM regression check. Requires jsdom; this is not a visual browser test. */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
let JSDOM;
try { ({ JSDOM } = require("jsdom")); }
catch { ({ JSDOM } = require(path.resolve(".tmp-eternal-deps/node_modules/jsdom"))); }
const root = path.resolve("apps/web/public/templates/wedivo-eternal-rose-garden");
const sample = JSON.parse(fs.readFileSync("apps/web/src/modules/catalog/preview-sample.json", "utf8"));
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const adapter = fs.readFileSync(path.join(root, "adapter.js"), "utf8");
const source = fs.readFileSync(path.join(root, "source/template.js"), "utf8");
const pause = () => new Promise((resolve) => setTimeout(resolve, 15));

async function check(locale, preview) {
  const c = sample.content[locale];
  const dom = new JSDOM(html, { url: "http://localhost/templates/wedivo-eternal-rose-garden/index.html", runScripts: "outside-only", pretendToBeVisual: true });
  const w = dom.window, doc = w.document, errors = [], requests = [];
  let serviceOk = true;
  w.matchMedia = () => ({ matches: true, addEventListener() {} });
  w.HTMLCanvasElement.prototype.getContext = () => null;
  w.SVGElement.prototype.getTotalLength = () => 100;
  w.SVGElement.prototype.getPointAtLength = (n) => ({ x: n, y: n });
  w.requestAnimationFrame = () => 1;
  w.addEventListener("error", (event) => errors.push(event.message));
  w.fetch = async (url, options) => {
    if (options?.method === "POST") requests.push({ url, body: JSON.parse(options.body) });
    return { ok: serviceOk, json: async () => ({ wishes: [] }) };
  };
  const append = doc.body.append.bind(doc.body);
  doc.body.append = (...nodes) => {
    append(...nodes);
    for (const node of nodes) if (node.tagName === "SCRIPT" && node.src.endsWith("template.js")) { w.eval(source); node.onload?.(); }
  };
  const payload = {
    locale, preview, reducedMotion: true, enabledLocales: Object.keys(sample.content), invitationId: "qa-unit-only", guestName: "QA", guestToken: "", rsvpEnabled: true, rsvpDeadline: "", wishesEnabled: true,
    data: {
      title: c.title, bride: c.people[1], groom: c.people[0], hosts: c.hosts, greeting: c.greeting, eventType: c.eventLabel,
      message: c.message, programHeading: c.programHeading, dateTime: "2027-05-15T13:00:00Z", timezone: sample.timezone,
      date: { day: 15 }, venue: { name: c.venueName, address: c.address, mapUrl: "" },
      story: Array.from({ length: 6 }, (_, i) => ({ id: `qa-story-${i}`, title: c.programHeading, text: c.message })),
      gallery: [{ id: "qa-art", src: "/templates/wedivo-eternal-rose-garden/assets/1791949727_768134ac.jpg", alt: c.title }],
      program: sample.program.map((item) => ({ ...item, title: c.programTitles[item.id], description: c.programDescriptions?.[item.id] || "" })),
      dressCode: { enabled: true, style: sample.dressCode.style[locale], text: sample.dressCode.text[locale], note: sample.dressCode.note[locale], colors: sample.dressCode.colors.map((item) => ({ ...item, name: item.name[locale] })) },
      contacts: [{ type: "phone", href: "tel:+998901234567", value: sample.contacts.phoneNumber }],
      music: { enabled: false, url: "" }, wishes: sample.wishes[locale],
    },
  };
  w.eval(adapter);
  w.dispatchEvent(new w.MessageEvent("message", { source: w.parent, origin: w.location.origin, data: { type: "wedivo-eternal-rose-garden:update", payload } }));
  await pause();
  assert.equal(doc.querySelector("#hero-name-g").textContent, c.people[0]);
  assert.equal(doc.querySelectorAll(".ch").length, 6);
  assert.equal(doc.querySelector("#ch-6").dataset.itemId, "qa-story-5");
  assert.equal(doc.querySelectorAll(".rd-item").length, 6);
  assert.equal(doc.querySelectorAll(".dc-sw").length, 5);
  assert.equal(doc.querySelectorAll(".gal-item").length, 1);
  assert.equal(doc.querySelector("#rsvp-pax"), null);
  assert(doc.querySelector("#sec-gift").hidden);
  assert.notEqual(doc.querySelector("#pc-ig-b").style.display, "none");
  assert.equal(doc.querySelectorAll(".wish-card").length, preview ? 3 : 0);
  if (preview) assert(doc.querySelector(".wish-msg").textContent);
  assert(doc.documentElement.classList.contains("rose-ready"));
  if (locale === "uz-Latn") {
    const nodes = doc.createTreeWalker(doc.body, w.NodeFilter.SHOW_TEXT), text = [];
    while (nodes.nextNode()) {
      const node = nodes.currentNode;
      if (!node.parentElement.closest("script,style,[hidden]")) text.push(node.textContent);
    }
    assert.equal(/\b(?:Taman|Mawar|Hadir|Lilin|Mempelai|Pilihan|Sampai|Besok|Kirim|Jumlah|Undangan|Dinding|Peta|Buka|Language)\b/i.test(text.join(" ")), false);
    assert.equal(doc.querySelector(".rose-languages"), null);
    assert.equal(doc.querySelector("#music-toggle").getAttribute("aria-label"), "Musiqani ijro etish yoki to‘xtatish");
    assert(doc.querySelector("#cal-google").href.includes(encodeURIComponent(c.message)));
  }
  doc.querySelector("#rsvp-yes").click();
  doc.querySelector("#rsvp-form").dispatchEvent(new w.Event("submit", { cancelable: true }));
  await pause();
  if (preview) {
    assert.equal(requests.length, 0); assert(doc.querySelector("#rsvp-err").textContent);
  } else {
    assert.equal(requests[0].body.partySize, 1); assert.equal(requests[0].body.status, "yes");
    doc.querySelector("#rsvp-no").click();
    doc.querySelector("#rsvp-form").dispatchEvent(new w.Event("submit", { cancelable: true })); await pause();
    assert.equal(requests[1].body.partySize, 0);
    doc.querySelector("#wish-msg").value = c.message;
    doc.querySelector("#wish-form").dispatchEvent(new w.Event("submit", { cancelable: true })); await pause();
    assert(requests[2].url.endsWith("/wishes")); assert.equal(doc.querySelectorAll(".wish-card").length, 0); assert(doc.querySelector("#wish-ok").textContent);
    serviceOk = false;
    doc.querySelector("#rsvp-form").dispatchEvent(new w.Event("submit", { cancelable: true })); await pause();
    assert(doc.querySelector("#rsvp-err").textContent);
  }
  assert.deepEqual(errors, []);
  w.close();
  console.log(`${locale} ${preview ? "preview" : "public"}: passed`);
}
(async () => { for (const locale of Object.keys(sample.content)) for (const preview of [true, false]) await check(locale, preview); })().catch((error) => { console.error(error); process.exitCode = 1; });
